export default function RoomTable({ rooms, deleteRoom, onEdit }) {

    return (
        <div className="room-table" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Phòng</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Giá (VNĐ)</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Chủ Sở Hữu</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Trạng thái</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Sức chứa</th>
                        <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {rooms.map(room => (
                        <tr key={room.id || room.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '16px', fontWeight: '600', color: '#3b82f6' }}>{room.roomNumber}</td>
                            <td style={{ padding: '16px', color: '#475569' }}>{room.price ? room.price.toLocaleString() : "0"}</td>
                            
                            {/* Xuất tên Chủ Trọ từ JSON Populated */}
                            <td style={{ padding: '16px', fontWeight: '500', color: '#f59e0b' }}>
                                👑 {room.masterId ? room.masterId.name : "Vô chủ"}
                            </td>

                            <td>
                                {room.status === "Trống"
                                    ? "🟢 Trống"
                                    : room.status === "Đã thuê"
                                        ? "🔴 Đã thuê"
                                        : "🟡 Bảo trì"}
                            </td>

                            <td>{room.capacity} người</td>

                            <td>
                                <button
                                    className="btn-edit"
                                    onClick={() => onEdit(room)}
                                    style={{ marginRight: '8px', backgroundColor: '#0ea5e9', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => deleteRoom(room.id || room.id)}
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