export default function UserStats({ users }) {

    const total = users.length;
    const active = users.filter(u => u.status === "active").length;
    const left = users.filter(u => u.status === "left").length;

    return (

        <div className="stats-grid">

            <div className="stat-card">
                <div className="stat-title">Tổng người thuê</div>
                <div className="stat-value">{total}</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Đang thuê</div>
                <div className="stat-value">{active}</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Đã rời</div>
                <div className="stat-value">{left}</div>
            </div>

        </div>
    );
}