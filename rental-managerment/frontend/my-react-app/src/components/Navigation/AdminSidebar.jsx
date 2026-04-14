import { NavLink } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShieldIcon from '@mui/icons-material/Shield';
import { X } from "lucide-react";

export default function AdminSidebar({ onClose }) {
  const navItems = [
    { to: "/admin", icon: <DashboardIcon fontSize="small" />, label: "Trang chủ", end: true },
    { to: "/admin/rooms", icon: <MeetingRoomIcon fontSize="small" />, label: "Phòng trọ", end: false },
    { to: "/admin/users", icon: <PeopleIcon fontSize="small" />, label: "Khách thuê", end: false },
    { to: "/admin/masters", icon: <BusinessIcon fontSize="small" />, label: "Chủ trọ", end: false },
    { to: "/admin/contracts", icon: <AssignmentIcon fontSize="small" />, label: "Hợp đồng", end: false },
  ];

  return (
    <aside className="w-64 h-full bg-slate-900 text-white flex flex-col overflow-hidden shadow-2xl">
      <div className="p-8 pb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <ShieldIcon />
            </div>
            <div>
            <h2 className="text-xl font-black tracking-tight leading-none">ADMIN</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Control Center</p>
            </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                end={item.end}
                onClick={() => {
                   if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300
                  ${isActive 
                    ? "bg-white/10 text-blue-400 shadow-inner" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"}
                `}
              >
                <div className="opacity-70">{item.icon}</div>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6">
        <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Access</p>
           <p className="text-xs font-bold text-slate-400 mt-1 italic">Root Privileges Active</p>
        </div>
      </div>
    </aside>
  );
}
