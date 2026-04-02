import { NavLink } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarsIcon from '@mui/icons-material/Stars';

export default function UserSidebar() {
  const navItems = [
    { to: "/user", icon: <DashboardIcon fontSize="small" />, label: "Trang chủ", end: true },
    { to: "/user/rooms", icon: <MeetingRoomIcon fontSize="small" />, label: "Phòng của tôi", end: false },
    { to: "/user/contracts", icon: <AssignmentIcon fontSize="small" />, label: "Hợp đồng", end: false },
    { to: "/user/profile", icon: <AccountCircleIcon fontSize="small" />, label: "Hồ sơ", end: false },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col z-50">
      {/* Sidebar Logo - Synced with Master Style */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105">
          <StarsIcon />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Khách thuê</h2>
        </div>
      </div>

      {/* Navigation Links - 4 distinct pages */}
      <nav className="flex-1 px-4 space-y-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-all duration-200
                  ${isActive
                    ? "bg-emerald-50 text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                `}
              >
                <div className="opacity-70">{item.icon}</div>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
