import React, { useState } from 'react';
import { createContract } from '../../../../api/contract.api';

export default function ContractRequestModal({ room, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    deposit: room.price, // Mặc định để bằng giá thuê 1 tháng
  });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.endDate && formData.endDate < formData.startDate) {
      alert('Ngày kết thúc không được nhỏ hơn ngày bắt đầu!');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        roomId: room._id,
        price: room.price,
        startDate: formData.startDate,
        endDate: formData.endDate,
        deposit: formData.deposit,
      };
      await createContract(payload);
      alert('Gửi yêu cầu thuê phòng thành công! Vui lòng chờ chủ trọ phê duyệt.');
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Lỗi khi gửi yêu cầu thuê phòng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Yêu cầu thuê phòng {room.roomNumber}</h3>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Bạn đang gửi yêu cầu thuê phòng với giá <strong>{room.price.toLocaleString()} VNĐ/tháng</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group-rm">
            <label>Ngày bắt đầu ở</label>
            <input
              type="date"
              required
              min={today}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div className="form-group-rm">
            <label>Ngày kết thúc dự kiến</label>
            <input
              type="date"
              required
              min={formData.startDate || today}
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="form-group-rm">
            <label>Tiền cọc đề xuất (VNĐ)</label>
            <input
              type="number"
              required
              value={formData.deposit}
              onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
