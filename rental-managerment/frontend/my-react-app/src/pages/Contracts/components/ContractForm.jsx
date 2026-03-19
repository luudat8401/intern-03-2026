import { useRef, useState } from "react";

export default function ContractForm({ addContract }) {
  const [formData, setFormData] = useState({
    user: "",
    room: "",
    price: "",
    startDate: "",
    endDate: ""
  });
  const count = useRef(0);

  const handleChange = (a) => {
    const { name, value } = a.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    count.current ++;
    console.log(count.current)
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newContract = {
      id: Date.now(),
      ...formData,
      status: "active"
    };
    addContract(newContract);

    // reset form
    setFormData({
      user: "",
      room: "",
      price: "",
      startDate: "",
      endDate: ""
    });
  };

  return (
    <form className="contract-form" onSubmit={handleSubmit}>
      <input
        name="user"
        placeholder="Người thuê"
        value={formData.user}
        onChange={handleChange}
        required
      />

      <input
        name="room"
        placeholder="Phòng"
        value={formData.room}
        onChange={handleChange}
        required
      />

      <input
        name="price"
        placeholder="Giá thuê"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        required
      />

      <button type="submit">Tạo hợp đồng</button>
    </form>
  );
}
