export default function RoomStats({ rooms }) {

    const total = rooms.length;
    const rented = rooms.filter(r => r.status === "rented").length;
    const available = rooms.filter(r => r.status === "available").length;

    const revenue = rooms
        .filter(r => r.status === "rented")
        .reduce((sum, r) => sum + Number(r.price), 0);

    return (

        <div className="stats-grid">

            <div className="stat-card">
                <div className="stat-title">Tổng phòng</div>
                <div className="stat-value">{total}</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Phòng trống</div>
                <div className="stat-value">{available}</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Đã thuê</div>
                <div className="stat-value">{rented}</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Doanh thu</div>
                <div className="stat-value">{revenue}</div>
            </div>

        </div>
    );
}