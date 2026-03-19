import StatsGrid from "./components/StatsGrid";
import RecentRooms from "./components/RecentRooms";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      <h2>Dashboard</h2>

      <StatsGrid />

      <RecentRooms />

    </div>
  );
}