export default function ContractStats ({contracts}){
    const total = contracts.length;
    const active = contracts.filter(
        c => c.status === "active"
    ).length;

    const revenue = contracts
        .filter(c => c.status === "active")
        .reduce((sum, c) => sum + Number(c.price), 0);

    return (

        <div className="stats-grid">

            <div className="stat-card">
                <div className="stat-title">Tổng hợp đồng</div>
                <div className="stat-value">{total}</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Đang hiệu lực</div>
                <div className="stat-value">{active}</div>
            </div>

            <div className="stat-card">
                <div className="stat-title">Doanh thu</div>
                <div className="stat-value">{revenue}</div>
            </div>

        </div>
    );
}