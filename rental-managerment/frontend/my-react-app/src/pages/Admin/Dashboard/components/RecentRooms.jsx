import React, { useMemo } from "react";

const RecentRooms = React.memo(({ rooms }) => {
  const lastFiveRooms = useMemo(() => {
    return [...rooms].slice(-5).reverse();
  }, [rooms]);

  return (
    <div className="recent-box">
      <h3>Phòng mới cập nhật</h3>
      <table>
        <thead>
          <tr>
            <th>Tên phòng</th>
            <th>Giá</th>
            <th>Tình trạng</th>
          </tr>
        </thead>
        <tbody>
          {lastFiveRooms.map((room) => (
            <tr key={room.id}>
              <td>Phòng {room.roomNumber}</td>
              <td>{room.price?.toLocaleString()}</td>
              <td style={{ color: room.status === "Đã thuê" ? "#ef4444" : "#10b981", fontWeight: "600" }}>
                {room.status}
              </td>
            </tr>
          ))}
          {lastFiveRooms.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", color: "#6b7280" }}>Chưa có dữ liệu phòng.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

export default RecentRooms;