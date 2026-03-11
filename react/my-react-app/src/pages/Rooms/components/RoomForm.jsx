import { useState } from "react";

export default function RoomForm({ addRoom }) {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [owner, setOwner] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const newRoom = {
            id: Date.now(),
            name,
            price,
            owner,
            status: "available",
            tenant: "-"
        };

        addRoom(newRoom);

        setName("");
        setPrice("");
        setOwner("");
    };

    return (

        <form className="room-form" onSubmit={handleSubmit}>
            <input
                placeholder="Tên phòng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                placeholder="Giá phòng"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
            <input
                placeholder="Chủ trọ"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
            />

            <button type="submit">Thêm phòng</button>

        </form>
    );
}