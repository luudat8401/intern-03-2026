import React, { useState } from 'react';

export default function ProfileForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
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
        <label>Họ và tên:</label>
        <input 
          type="text" 
          name="name" 
          className="form-control"
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Số điện thoại:</label>
        <input 
          type="text" 
          name="phone" 
          className="form-control"
          value={formData.phone} 
          onChange={handleChange} 
          pattern="[0-9]{10,11}"
          title="Vui lòng nhập 10-11 chữ số"
          required 
        />
      </div>
      <div className="form-group">
         <label>Trạng thái (Hệ thống cấp):</label>
         <input type="text" className="form-control" disabled value={user?.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'} />
      </div>

      <div className="button-group">
        <button type="button" className="btn-secondary" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn-primary">Lưu thay đổi</button>
      </div>
    </form>
  );
}
