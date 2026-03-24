import React from 'react';

export default function ProfileView({ user, onEdit }) {
  if (!user) return null;

  return (
    <div className="profile-card">
      <div className="profile-row">
        <span className="profile-label">Họ và tên quản lý:</span>
        <span className="profile-value">{user.name}</span>
      </div>
      <div className="profile-row">
        <span className="profile-label">Số điện thoại:</span>
        <span className="profile-value">{user.phone}</span>
      </div>
      <div className="profile-row">
        <span className="profile-label">Email liên hệ:</span>
        <span className="profile-value">{user.email}</span>
      </div>
      <div className="profile-row">
        <span className="profile-label">Địa chỉ đăng ký:</span>
        <span className="profile-value">{user.address}</span>
      </div>
      <div style={{ marginTop: '25px' }}>
        <button onClick={onEdit} className="btn-primary">Cập nhật hồ sơ</button>
      </div>
    </div>
  );
}
