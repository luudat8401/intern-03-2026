import React, { useState } from 'react';

export default function ProfileForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="profile-card" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Họ và tên Quản lý:</label>
        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Số điện thoại:</label>
        <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} pattern="[0-9]{10,11}" title="Vui lòng nhập 10-11 chữ số" required />
      </div>
      <div className="form-group">
        <label>Email liên hệ:</label>
        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Địa chỉ đăng ký:</label>
        <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} required />
      </div>

      <div className="button-group">
        <button type="button" className="btn-secondary" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn-primary">Lưu thay đổi</button>
      </div>
    </form>
  );
}
