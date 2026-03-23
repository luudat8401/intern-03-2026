import { useEffect, useState } from "react";
import RoomForm from "./components/RoomForm";
import RoomTable from "./components/RoomTable";
import RoomStats from "./components/RoomStats";
import "./rooms.css";
import { getRooms } from "../../api/room.api";
import { createRoom } from "../../api/room.api";
import { updateRoomApi } from "../../api/room.api";
import { deleteRoomApi } from "../../api/room.api";
export default function Rooms() {

    const [rooms, setRooms] = useState([]);
    const [editingRoom, setEditingRoom] = useState(null);

    const fetchRooms = async () => {
        try {
            const res = await getRooms();
            setRooms(res.data);
        } catch (error) {
            console.error("Lỗi khi tải phòng", error);
        }
    }

    useEffect(() => {
        fetchRooms();
    }, [])

    const addRoom = async (roomData) => {
        try {
            const res = await createRoom(roomData);
            setRooms([...rooms, res.data]);
        } catch (error) {
            console.error("Lỗi thêm phòng", error);
            alert("Lưu phòng thất bại! Vui lòng kiểm tra lại (có thể trùng số phòng).");
        }
    };

    const updateRoom = async (id, data) => {
        try {
            await updateRoomApi(id, data);
            const res = await getRooms();
            setRooms(res.data);
            setEditingRoom(null);
        } catch (error) {
            console.error("Lỗi cập nhật phòng", error);
        }
    };

    const deleteRoom = async (id) => {
        try {
            await deleteRoomApi(id);
            setRooms(rooms.filter(r => r._id !== id));
        } catch (error) {
            console.error("Lỗi xóa phòng", error);
        }
    };

    return (

        <div className="rooms-page">

            <h2>Quản lý phòng</h2>

            <RoomStats rooms={rooms} />

            <RoomForm
                addRoom={addRoom}
                editingRoom={editingRoom}
                updateRoom={updateRoom}
                cancelEdit={() => setEditingRoom(null)}
            />

            <RoomTable
                rooms={rooms}
                deleteRoom={deleteRoom}
                onEdit={(room) => setEditingRoom(room)}
            />

        </div>

    );
}