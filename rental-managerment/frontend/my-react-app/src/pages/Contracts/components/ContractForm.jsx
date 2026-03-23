import { useState, useEffect } from "react";
import { getUsers } from "../../../api/user.api";
import { getRooms } from "../../../api/room.api";

export default function ContractForm({ addContract, editingContract, updateContract, cancelEdit }) {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    roomId: "",
    price: "",
    deposit: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    getUsers().then(res => setUsers(res.data)).catch(console.error);
    getRooms().then(res => setRooms(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (editingContract) {
      setFormData({
        userId: editingContract.userId?._id || editingContract.userId || "",
        roomId: editingContract.roomId?._id || editingContract.roomId || "",
        price: editingContract.price,
        deposit: editingContract.deposit || "",
        startDate: editingContract.startDate?.slice(0, 10) || "",
        endDate: editingContract.endDate?.slice(0, 10) || ""
      });
    } else {
      setFormData({ userId: "", roomId: "", price: "", deposit: "", startDate: "", endDate: "" });
    }
  }, [editingContract]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Khi chọn phòng, tự điền sẵn giá tiền của phòng đó
  const handleRoomChange = (e) => {
    const selectedRoomId = e.target.value;
    const selectedRoom = rooms.find(r => r._id === selectedRoomId);
    setFormData(prev => ({ ...prev, roomId: selectedRoomId, price: selectedRoom?.price || "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingContract) {
      updateContract(editingContract._id, formData);
    } else {
      addContract(formData);
    }
    setFormData({ userId: "", roomId: "", price: "", deposit: "", startDate: "", endDate: "" });
  };

  return (
    <form className="contract-form" onSubmit={handleSubmit}>

      <select name="userId" value={formData.userId} onChange={handleChange} required>
        <option value="">-- Chọn người thuê --</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>{u.name} - {u.phone}</option>
        ))}
      </select>

      <select name="roomId" value={formData.roomId} onChange={handleRoomChange} required>
        <option value="">-- Chọn phòng --</option>
        {rooms.filter(r => r.status === "Trống").map(r => (
          <option key={r._id} value={r._id}>{r.roomNumber} - {r.price?.toLocaleString()} VNĐ</option>
        ))}
      </select>

      <input
        name="price"
        type="number"
        placeholder="Giá thuê (VNĐ)"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <input
        name="deposit"
        type="number"
        placeholder="Tiền cọc (VNĐ)"
        value={formData.deposit}
        onChange={handleChange}
      />

      <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
      <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />

      <div style={{ display: "flex", gap: "8px" }}>
        <button type="submit">{editingContract ? "Cập nhật hợp đồng" : "Tạo hợp đồng"}</button>
        {editingContract && (
          <button type="button" onClick={cancelEdit} style={{ backgroundColor: "#6c757d" }}>Hủy</button>
        )}
      </div>

    </form>
  );
}
