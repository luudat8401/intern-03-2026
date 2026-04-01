import React from 'react';

export default function RoomCard({ room, onEdit, onDelete }) {
  const imageUrl = room.thumbnail || 'https://via.placeholder.com/300x200?text=Kh%C3%B4ng+c%C3%B3+%E1%BA%A3nh';

  return (
    <div className="room-card">
      <img src={imageUrl} alt={`Phòng ${room.roomNumber}`} className="room-image" />
      <div className="room-content">
        <h3 className="room-title">Phòng {room.roomNumber}</h3>
        <p className="room-price">{room.price.toLocaleString()} VNĐ/Tháng</p>

        <div className="room-details">
          <span><i className="status-dot" data-status={room.status}></i> {room.status}</span>
          <span>Sức chứa: {room.currentTenants}/{room.capacity} người</span>
        </div>

        <div className="room-actions">
          <button className="btn-edit-room" onClick={() => onEdit(room)}>Chỉnh sửa</button>
          <button className="btn-delete-room" onClick={() => onDelete(room.id)}>Xóa</button>
        </div>
      </div>
    </div>
  );
}
