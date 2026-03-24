import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserById } from '../api/user.api';
import { getMasterById } from '../api/master.api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorCtx, setErrorCtx] = useState('');

  // Hàm load profile độc lập để có thể gọi lại bất cứ lúc nào (lúc F5 trang, hoặc lúc Login thành công)
  const loadProfile = async (storedUser) => {
    try {
      setLoading(true);
      setErrorCtx('');

      const { profileId, role } = storedUser;

      // Nếu không có profileId, người dùng này chưa được gắn thông tin cá nhân.
      if (!profileId) {
        setErrorCtx("Hồ sơ tài khoản chưa được thiết lập. Vui lòng liên hệ Admin.");
        setLoading(false);
        return;
      }

      let response;
      if (role === 'master') {
        response = await getMasterById(profileId);
      } else {
        response = await getUserById(profileId);
      }

      setUserProfile(response.data);
    } catch (err) {
      console.error("Lỗi khi fetch Context Data:", err);
      setErrorCtx("Đã xảy ra lỗi hệ thống khi tải dữ liệu hồ sơ chung.");
    } finally {
      setLoading(false);
    }
  };

  // Tự động khôi phục ngữ cảnh khi F5 / Tải lại trang web
  useEffect(() => {
    const storedUserStr = localStorage.getItem('user');
    if (storedUserStr) {
      loadProfile(JSON.parse(storedUserStr));
    } else {
      setLoading(false);
    }
  }, []);

  // Thay thế thao tác thủ công của Component Login bằng thao tác quản lý bởi Context
  const loginContext = async (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    // Yêu cầu Context chọc xuống DB lấy profile chi tiết ngay lập tức
    await loadProfile(userData);
  };

  const logoutContext = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserProfile(null);
  };

  const updateProfileContext = (updatedData) => {
    // Chỉ cập nhật trạng thái UI trên RAM để tối ưu tốc độ, không cần gọi F12 GET DB lại.
    setUserProfile(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{
      userProfile,
      loading,
      errorCtx,
      loginContext,
      logoutContext,
      updateProfileContext
    }}>
      {children}
    </AuthContext.Provider>
  );
};
