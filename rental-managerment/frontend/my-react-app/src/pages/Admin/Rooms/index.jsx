import { useEffect, useState } from "react";
import RoomTable from "./components/RoomTable";
import "./rooms.css";
import { getRooms } from "../../../api/room.api";
import { deleteRoomApi } from "../../../api/room.api";
export default function Rooms() {

    const [rooms, setRooms] = useState([]);
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
    const deleteRoom = async (id) => {
        try {
            await deleteRoomApi(id);
            setRooms(rooms.filter(r => r.id !== id));
        } catch (error) {
            console.error("Lỗi xóa phòng", error);
        }
    };
    return (
        <div className="rooms-page">
            <h2>Quản lý phòng</h2>
            <RoomTable
                rooms={rooms}
                deleteRoom={deleteRoom}
            />
        </div>

    );
}