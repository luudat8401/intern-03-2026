export default function RoomTable({ rooms, deleteRoom }) {

    return (

        <div className="room-table">

            <table>

                <thead>
                    <tr>
                        <th>Phòng</th>
                        <th>Chủ trọ</th>
                        <th>Giá</th>
                        <th>Trạng thái</th>
                        <th>Người thuê</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>

                    {rooms.map(room => (

                        <tr key={room.id}>

                            <td>{room.name}</td>
                            <td>{room.owner}</td>
                            <td>{room.price}</td>

                            <td>
                                {room.status === "available"
                                    ? "🟢 Trống"
                                    : "🔴 Đã thuê"}
                            </td>

                            <td>{room.tenant}</td>

                            <td>
                                <button
                                    className="btn-delete"
                                    onClick={() => deleteRoom(room.id)}
                                >
                                    Xóa
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}