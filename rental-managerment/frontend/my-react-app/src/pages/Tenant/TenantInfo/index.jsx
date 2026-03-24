import React, { useEffect, useState } from 'react';
import { getUserById, updateUserApi } from '../../../api/user.api';
import ProfileView from './components/ProfileView';
import ProfileForm from './components/ProfileForm';
import './tenant-info.css';

export default function TenantInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // mặc định là false 

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const storedUserStr = localStorage.getItem('user');
      if (!storedUserStr) {
        setError("Vui lòng đăng nhập lại để xem thông tin.");
        setLoading(false);
        return;
      }

      const storedUser = JSON.parse(storedUserStr);
      const profileId = storedUser.profileId;

      if (!profileId) {
        setError("Hồ sơ tài khoản chưa được thiết lập. Vui lòng liên hệ Admin.");
        setLoading(false);
        return;
      }
      const response = await getUserById(profileId);
      setUser(response.data);
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi hệ thống khi tải dữ liệu người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      await updateUserApi(user._id, updatedData);
      setUser({ ...user, ...updatedData });
      setIsEditing(false);
    } catch (err) {
      alert("Cập nhật thông tin thất bại: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="tenant-info-container">
      <h2 className="user-heading">Thông tin cá nhân</h2>
      <p className="user-subheading">Xem và quản lý hồ sơ cá nhân của bạn.</p>

      {loading && <div style={{ marginTop: '20px' }}>⏳ Đang tải dữ liệu...</div>}

      {error && <div style={{ color: '#d90429', marginTop: '20px', fontWeight: 'bold' }}>{error}</div>}

      {!loading && !error && user && (
        <React.Fragment>
          {isEditing ? ( // nếu là false thì hiển thị view còn true thì hiển thị form
            <ProfileForm
              user={user}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView
              user={user}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </React.Fragment>
      )}
    </div>
  );
}
