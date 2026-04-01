import React, { useEffect, useState } from 'react';
import { getRooms } from '../../../api/room.api';
import TenantRoomCard from './components/TenantRoomCard';
import ContractRequestModal from './components/ContractRequestModal';
import './tenant-rooms.css';

export default function TenantRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null); 
  const [isRequestOpen, setIsRequestOpen] = useState(false); // State mở Modal yêu cầu thuê

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getRooms();
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải danh sách phòng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleViewDetail = (room) => {
    setSelectedRoom(room);
  };

  const handleOpenRequest = () => {
    setIsRequestOpen(true);
  };

  return (
    <div className="tenant-rooms-page">
      <h2 className="user-heading">Danh sách phòng khả dụng</h2>
      <p className="user-subheading">Tìm kiếm và lựa chọn căn phòng phù hợp với nhu cầu của bạn.</p>

      {loading ? (
        <p className="loading-text">Đang tải danh sách phòng...</p>
      ) : (
        <div className="room-grid">
          {rooms.filter(r => r.status === 'Trống').length === 0 ? (
            <p className="empty-text">Hiện tại không có phòng trống nào.</p>
          ) : (
            rooms
              .filter(r => r.status === 'Trống')
              .map((room) => (
                <TenantRoomCard
                  key={room.id}
                  room={room}
                  onViewDetail={handleViewDetail}
                />
              ))
          )}
        </div>
      )}

      {/* Modal Chi tiết phòng */}
      {selectedRoom && !isRequestOpen && (
        <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
          <div className="modal-content detail-view" onClick={(e) => e.stopPropagation()}>
            <h3>Chi tiết Phòng {selectedRoom.roomNumber}</h3>
            <img
              src={selectedRoom.thumbnail || 'https://via.placeholder.com/400x250'}
              alt="Room"
              className="detail-image"
            />
            <div className="detail-info">
              <p><strong>Giá thuê:</strong> <span className="price-tag">{selectedRoom.price.toLocaleString()} VNĐ</span></p>
              <p><strong>Sức chứa tối đa:</strong> {selectedRoom.capacity} người</p>
              <p><strong>Hiện có:</strong> {selectedRoom.currentTenants} người đang ở</p>
              <hr />
              <p><strong>Chủ trọ:</strong> {selectedRoom.masterId?.name || 'Đang cập nhật'}</p>
              <p><strong>Liên hệ:</strong> {selectedRoom.masterId?.phone || 'Chưa có số'}</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setSelectedRoom(null)}>Đóng</button>
              <button className="btn-submit" onClick={handleOpenRequest}>
                Đăng ký thuê phòng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gửi yêu cầu thuê (Nhập ngày tháng, tiền cọc) */}
      {isRequestOpen && selectedRoom && (
        <ContractRequestModal 
          room={selectedRoom}
          onClose={() => setIsRequestOpen(false)}
          onSuccess={() => {
            setIsRequestOpen(false);
            setSelectedRoom(null);
            fetchRooms(); // Load lại để cập nhật nếu cần (dù status phòng chưa đổi ngay)
          }}
        />
      )}
    </div>
  );
}
