import React from "react";
import StatCard from "./StatCard";

const StatsGrid = React.memo(({ stats }) => {
  return (
    <div className="stats-grid">
      <StatCard title="Tổng phòng" value={stats.totalRooms} />
      <StatCard title="Phòng đã thuê" value={stats.rentedRooms} />
      <StatCard title="Khách thuê" value={stats.totalUsers} />
      <StatCard title="Hợp đồng active" value={stats.activeContracts} />
      <StatCard title="Tổng chủ trọ" value={stats.totalMasters} />
    </div>
  );
});

export default StatsGrid;