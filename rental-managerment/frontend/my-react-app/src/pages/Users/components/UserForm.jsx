import { useState, useEffect, useRef } from "react";
import { getRooms } from "../../../api/room.api";

export default function UserForm({ addUser, editingUser, updateUser, cancelEdit }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [roomId, setRoomId] = useState("");
    const [isRepresentative, setIsRepresentative] = useState(false);
    
    // State lưu danh sách phòng lấy từ Backend
    const [rooms, setRooms] = useState([]);

    const nameInputRef = useRef(null);

    // Kéo danh sách phòng 1 lần khi Component mở
    useEffect(() => {
        getRooms()
            .then(res => setRooms(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (editingUser) {
            setName(editingUser.name || "");
            setPhone(editingUser.phone || "");
            // Xử lý cẩn thận: Nếu roomId đã được populate (thành Object) thì lấy _id, ngược lại lấy thẳng chuỗi ID
            setRoomId(editingUser.roomId ? (editingUser.roomId._id || editingUser.roomId) : "");
            setIsRepresentative(editingUser.isRepresentative || false);
        } else {
            setName("");
            setPhone("");
            setRoomId("");
            setIsRepresentative(false);
        }
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [editingUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            name,
            phone,
            roomId,
            isRepresentative,
            status: "active"
        };

        if (editingUser) {
            updateUser(editingUser._id || editingUser.id, userData);
        } else {
            addUser(userData);
        }

        // Reset form
        setName("");
        setPhone("");
        setRoomId("");
        setIsRepresentative(false);
    };

    return (
        <form className="user-form" onSubmit={handleSubmit} style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#0f172a' }}>
                {editingUser ? "Sửa thông tin Khách thuê" : "Thêm Khách thuê mới"}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <input
                    ref={nameInputRef}
                    placeholder="Tên người thuê"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <input
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                
                <select
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    required
                    style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                >
                    <option value="">-- Chọn Phòng --</option>
                    {rooms.map(r => (
                        <option key={r._id} value={r._id}>
                            {r.roomNumber} - {r.price.toLocaleString()} VNĐ ({r.status})
                        </option>
                    ))}
                </select>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>
                    <input 
                        type="checkbox" 
                        checked={isRepresentative} 
                        onChange={(e) => setIsRepresentative(e.target.checked)}
                        style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: '500', color: '#334155' }}>Là người Đại diện Ký hợp đồng?</span>
                </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontWeight: '600' }}>
                    {editingUser ? "Cập nhật" : "Thêm khách"}
                </button>
                {editingUser && (
                    <button type="button" onClick={cancelEdit} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#94a3b8', color: 'white', border: 'none', fontWeight: '600' }}>
                        Hủy bỏ
                    </button>
                )}
            </div>
        </form>
    );
}