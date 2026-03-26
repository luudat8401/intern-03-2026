import React, { useState, useEffect } from 'react';
import { getRoomsByMaster, createRoom, updateRoomApi, deleteRoomApi } from '../../../api/room.api';
import { useAuth } from '../../../context/AuthContext';
import RoomCard from './components/RoomCard';
import RoomModal from './components/RoomModal';
import './master-rooms.css';

export default function MasterRooms() {
  const { userProfile } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    if (userProfile && userProfile._id) {
      fetchRooms();
    }
  }, [userProfile]);

  const fetchRooms = async () => {
    try {
      const res = await getRoomsByMaster(userProfile._id);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi kết nối đến Server tải danh sách phòng.");
    }
  };

  const handeOpenAdd = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Chắc chắn chưa ?")) {
      try {
        await deleteRoomApi(id);
        // Lọc khỏi mảng Rooms ngay lập tức để tiết kiệm chi phí gọi lại API Server
        setRooms(rooms.filter(r => r._id !== id));
      } catch (err) {
        alert("Xóa thất bại! Không cho phép xóa.");
      }
    }
  };

  // Hàm Hứng Chịu Gói Hàng (FormData multipart) do Con Mảnh RoomModal Truyền Lên
  const handleSaveRoom = async (formData, roomId) => {
    try {
      if (roomId) { // chế độ sửa

        const res = await updateRoomApi(roomId, formData);
        setRooms(rooms.map(r => r._id === roomId ? res.data : r));
        alert("Cập nhật phòng thành công!");
      } else {      // chế độ thêm
        const res = await createRoom(formData);
        setRooms([...rooms, res.data]);
        alert("Đã đẩy thông tin phòng và tải ảnh lên Cloud thành công!");
      }
      setIsModalOpen(false); // Cất bảng Popup đi
    } catch (err) {
      alert("Gặp sự cố lỗi: " + (err.response?.data?.error || err.message));
    }

  };

  return (
    <div>
      <h2 className="master-heading">Quản Lý Phòng Cho Thuê</h2>
      <p className="master-subheading">Thêm mới, tải ảnh quảng cáo, chỉnh sửa thông tin phòng và thiết lập mức giá cho khách thuê dưới quyền.</p>

      <button className="btn-add-room" onClick={handeOpenAdd}>
        + Đăng Phòng Mới
      </button>

      {
        (
          <div className="room-grid">
            {rooms.length === 0 && <p style={{ color: '#6b7280' }}>Khu trọ hiện tại trống rỗng. Hãy thêm phòng đầu tiên!</p>}
            {rooms.map(room => (
              <RoomCard
                key={room._id}
                room={room}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      {/* Tấm Tường Rào Popup Gửi Dữ Liệu - Sẽ vô hình nếu isModalOpen = False */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRoom}
        roomData={editingRoom}
        masterId={userProfile ? userProfile._id : ''}
      />
    </div>
  );
}
