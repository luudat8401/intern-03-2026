import { useState } from "react";

export default function UserForm({ addUser }) {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [room, setRoom] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        const newUser = {
            id: Date.now(),
            name,
            phone,
            room,
            status: "active"
        };

        addUser(newUser);

        setName("");
        setPhone("");
        setRoom("");
    };

    return (

        <form className="user-form" onSubmit={handleSubmit}>

            <input
                placeholder="Tên người thuê"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <input
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />

            <input
                placeholder="Phòng"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
            />

            <button type="submit">Thêm người thuê</button>

        </form>
    );
}