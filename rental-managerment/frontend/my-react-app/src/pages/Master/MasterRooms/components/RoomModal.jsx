import React, { useState, useEffect } from 'react';

export default function RoomModal({ isOpen, onClose, onSave, roomData, masterId }) {
  const [formData, setFormData] = useState({
    roomNumber: '',
    price: '',
    status: 'Trống',
    capacity: 2,
    currentTenants: 0
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (roomData) {
      setFormData({
        roomNumber: roomData.roomNumber,
        price: roomData.price,
        status: roomData.status,
        capacity: roomData.capacity,
        currentTenants: roomData.currentTenants || 0
      });
    } else {
      setFormData({ roomNumber: '', price: '', status: 'Trống', capacity: 2, currentTenants: 0 });
    }
    setImageFile(null);
  }, [roomData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('roomNumber', formData.roomNumber);
    data.append('price', formData.price);
    data.append('status', formData.status);
    data.append('capacity', formData.capacity);
    data.append('currentTenants', formData.currentTenants);
    data.append('masterId', masterId);

    if (imageFile) {
      data.append('image', imageFile);
    }
    onSave(data, roomData ? roomData._id : null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{roomData ? 'Cập nhật phòng' : 'Thêm phòng mới'}</h3>
        <form onSubmit={handleSubmit}>

          <div className="form-row">
            <div className="form-group-rm">
              <label>Số phòng (Bắt buộc):</label>
              <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
            </div>
            <div className="form-group-rm">
              <label>Giá thuê - VNĐ (Bắt buộc):</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group-rm">
              <label>Sức chứa (Tối đa):</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
            </div>
            <div className="form-group-rm">
              <label>Người đang ở:</label>
              <input type="number" name="currentTenants" value={formData.currentTenants} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group-rm">
            <label>Trạng thái kinh doanh:</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Trống">Trống</option>
              <option value="Đã thuê">Đã thuê</option>
              <option value="Bảo trì">Bảo trì</option>
              <option value="Đang xử lý">Đang xử lý</option>
            </select>
          </div>

          <div className="form-group-rm">
            <label>Tải ảnh hiển thị (Tùy chọn):</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imageFile && <p className="file-name-hint">Đã sẵn sàng tải lên: {imageFile.name}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Thoát (Hủy)</button>
            <button type="submit" className="btn-submit">Lưu hệ thống</button>
          </div>
        </form>
      </div>
    </div>
  );
}
