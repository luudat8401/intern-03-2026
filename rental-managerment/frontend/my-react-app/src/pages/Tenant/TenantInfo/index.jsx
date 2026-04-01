import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { updateUserApi } from '../../../api/user.api';
import ProfileView from './components/ProfileView';
import ProfileForm from './components/ProfileForm';
import './tenant-info.css';

export default function TenantInfo() {
  // Lấy thẳng dữ liệu từ App Context do AuthProvider cung cấp
  const { userProfile: user, loading, errorCtx: error, updateProfileContext } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (updatedData) => {
    try {
      await updateUserApi(user.id, updatedData);
      updateProfileContext(updatedData);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (err) {
      alert("Cập nhật thông tin thất bại: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="tenant-info-container">
      <h2 className="user-heading">Thông tin cá nhân</h2>
      <p className="user-subheading">Xem và quản lý hồ sơ cá nhân của bạn.</p>

      {loading && <div style={{ marginTop: '20px' }}>⏳ Đang đồng bộ dữ liệu...</div>}

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
