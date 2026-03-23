import { useState, useEffect, useRef } from "react";
import { getMasters } from "../../../api/master.api"; // API lấy thẻ Chủ trọ

export default function RoomForm({ addRoom, editingRoom, updateRoom, cancelEdit }) {

    const [roomNumber, setRoomNumber] = useState("");
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("2");
    const [masterId, setMasterId] = useState(""); // Lưu ID Chủ trọ
    
    const [masters, setMasters] = useState([]); // Chứa danh sách để rải ra <select>

    const roomNumberInputRef = useRef(null);

    // Kéo dữ liệu các Chủ trọ từ DB xuống
    useEffect(() => {
        getMasters().then(res => setMasters(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (editingRoom) {
            setRoomNumber(editingRoom.roomNumber);
            setPrice(editingRoom.price);
            setCapacity(editingRoom.capacity);
            setMasterId(editingRoom.masterId?._id || editingRoom.masterId || "");
        } else {
            setRoomNumber("");
            setPrice("");
            setCapacity("2");
            setMasterId("");
        }
        if (roomNumberInputRef.current) {
            roomNumberInputRef.current.focus();
        }
    }, [editingRoom]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const roomData = {
            roomNumber,
            price: Number(price),
            capacity: Number(capacity),
            masterId // Thêm chốt giao kết
        };

        if (editingRoom) {
            updateRoom(editingRoom._id || editingRoom.id, roomData);
        } else {
            addRoom(roomData);
        }

        setRoomNumber("");
        setPrice("");
        setCapacity("2");
        setMasterId("");
    };

    return (

        <form className="room-form" onSubmit={handleSubmit} style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#0f172a' }}>
                {editingRoom ? "Sửa thông tin Phòng" : "Thêm Phòng mới"}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <select
                    value={masterId}
                    onChange={(e) => setMasterId(e.target.value)}
                    required
                    style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', gridColumn: 'span 2' }}
                    >
                    <option value="">-- Thuộc sở hữu của Chủ Trọ --</option>
                    {masters.map(m => (
                        <option key={m._id} value={m._id}>
                            {m.name} - {m.phone}
                        </option>
                    ))}
                </select>

                <input
                    ref={roomNumberInputRef}
                    placeholder="Số phòng / Tên phòng"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                    style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <input
                    placeholder="Giá phòng (VNĐ)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <input
                    placeholder="Sức chứa (số người)"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                    style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', gridColumn: 'span 2' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit">{editingRoom ? "Cập nhật phòng" : "Thêm phòng"}</button>
                {editingRoom && (
                    <button type="button" onClick={cancelEdit} style={{ backgroundColor: '#6c757d' }}>
                        Hủy
                    </button>
                )}
            </div>

        </form>
    );
}