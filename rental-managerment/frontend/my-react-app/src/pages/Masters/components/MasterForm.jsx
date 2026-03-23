import { useState, useEffect, useRef } from "react";

export default function MasterForm({ addMaster, editingMaster, updateMaster, cancelEdit }) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const nameInputRef = useRef(null);
  useEffect(() => {
    if (editingMaster) {
      setName(editingMaster.name);
      setPhone(editingMaster.phone);
      setEmail(editingMaster.email);
      setAddress(editingMaster.address);
    } else {
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
    }
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingMaster]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const masterData = {
      name,
      phone,
      email,
      address
    };

    if (editingMaster) {
      updateMaster(editingMaster._id || editingMaster.id, masterData);
    } else {
      addMaster(masterData);
    }
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
  };
  return (
    <form onSubmit={handleSubmit} className="master-form">
      <h3>{editingMaster ? "Sửa chủ trọ" : "Thêm chủ trọ"}</h3>
      <input
        ref={nameInputRef}
        type="text"
        placeholder="Tên chủ trọ"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Số điện thoại"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Địa chỉ"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="submit">{editingMaster ? "Cập nhật" : "Thêm"}</button>
        {editingMaster && (
          <button type="button" onClick={cancelEdit} style={{ backgroundColor: '#6c757d' }}>
            Hủy
          </button>
        )}
      </div>

    </form>
  );
}