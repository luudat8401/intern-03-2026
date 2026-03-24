import React from 'react';

export default function ProfileView({ user, onEdit }) {
  if (!user) return null;

  return (
    <div className="profile-card">
      <div className="profile-row">
        <span className="profile-label">Họ và tên:</span>
        <span className="profile-value">{user.name}</span>
      </div>
      <div className="profile-row">
        <span className="profile-label">Số điện thoại:</span>
        <span className="profile-value">{user.phone}</span>
      </div>
      <div className="profile-row">
        <span className="profile-label">Trạng thái:</span>
        <span className="profile-value">
          {user.status === 'active' ? (
            <span style={{ color: '#2b9348', fontWeight: 'bold' }}>Đang hoạt động</span>
          ) : (
            <span style={{ color: '#d90429', fontWeight: 'bold' }}>Đã khóa</span>
          )}
        </span>
      </div>
      <div style={{ marginTop: '25px' }}>
        <button onClick={onEdit} className="btn-primary">Chỉnh sửa thông tin</button>
      </div>
    </div>
  );
}
