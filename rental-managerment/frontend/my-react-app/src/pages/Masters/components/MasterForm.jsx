import { useState } from "react";

export default function MasterForm({ addMaster }) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMaster = {
      id: Date.now(),
      name,
      phone,
      email,
      address
    };

    addMaster(newMaster);

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
  };

  return (
    <form onSubmit={handleSubmit} className="master-form">

      <h3>Thêm chủ trọ</h3>

      <input
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
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Địa chỉ"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button type="submit">Thêm</button>

    </form>
  );
}