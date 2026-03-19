import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="stats-grid">
      <StatCard title="Tổng phòng" value="24" />
      <StatCard title="Phòng đã thuê" value="18" />
      <StatCard title="Khách thuê" value="21" />
      <StatCard title="Hợp đồng đang hoạt động" value="18" />
    </div>
  );
}