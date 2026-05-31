import React, { createContext, useState, useContext, useEffect } from 'react';
import { logoutUser } from '../service/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [errorCtx, setErrorCtx] = useState('');

  const loadProfile = async (storedUser) => {
    try {
      setErrorCtx('');

      const { profileId, role } = storedUser;

      if (!profileId) {
        setErrorCtx("Hồ sơ tài khoản chưa được thiết lập. Vui lòng liên hệ Admin.");
        return;
      }
      setUserProfile({
        ...storedUser
      });
    } catch (err) {
      console.error("Lỗi khi fetch Context Data:", err);
      alert("Lỗi LoadProfile: " + (err.response?.data?.error || err.message));

      setErrorCtx("Đã xảy ra lỗi hệ thống khi tải dữ liệu hồ sơ chung.");

      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setUserProfile(null);
        document.cookie = 'ui_state=; Max-Age=-99999999; path=/';
        window.location.href = "/login";
      }
    }
  };
  const logout = ()=>{
    setUserProfile(null)
  }
  useEffect(() => {
    const getUiStateCookie = () => {
      const match = document.cookie.match(new RegExp('(^| )ui_state=([^;]+)'));
      if (match) {
        try {
          const decodedCookie = decodeURIComponent(match[2]);
          const binString = atob(decodedCookie);
          const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
          return JSON.parse(new TextDecoder().decode(bytes));
        } catch (e) {
          return null;
        }
      }
      return null;
    };

    const basicUserData = getUiStateCookie();

    if (basicUserData) {
      loadProfile(basicUserData).finally(() => setIsInitializing(false));
    } else {
      setIsInitializing(false);
    }
  }, []);

  const loginContext = async (userData) => {
    if (userData && userData.user) {
      await loadProfile(userData.user);
    }
  };

  const logoutContext = async () => {
    try {
      await logoutUser();
    } finally {
      setUserProfile(null);
      window.location.href = "/login";
    }
  };

  const updateProfileContext = (updatedData) => {
    setUserProfile(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{
      userProfile,
      isInitializing,
      errorCtx,
      logout,
      loginContext,
      logoutContext,
      updateProfileContext
    }}>
      {children}
    </AuthContext.Provider>
  );
};
