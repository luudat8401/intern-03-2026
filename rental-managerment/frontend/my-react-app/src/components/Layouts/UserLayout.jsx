import React, { useState, useRef, useEffect } from "react";
import UserSidebar from "../Navigation/UserSidebar";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function UserLayout() {
  const navigate = useNavigate();
  const { userProfile: user, logoutContext } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logoutContext();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return (
    <div className="flex items-center justify-center h-screen font-black text-slate-300 uppercase tracking-widest text-xs">
      Đang đồng bộ hồ sơ khách thuê...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <UserSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
        {/* Advanced Header for User (Emerald Theme) */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-slate-100">

          {/* Header Search Area */}
          <div className="relative w-full max-w-lg hidden md:block">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fontSize="small" />
            <input
              type="text"
              placeholder="Tìm kiếm hợp đồng, hóa đơn hoặc tin nhắn..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm font-semibold placeholder:text-slate-300 text-slate-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 pr-5 border-r border-slate-100">
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                <NotificationsNoneIcon />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                <HelpOutlineIcon />
              </button>
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-all select-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 leading-none">{user.username}</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Người thuê</p>
                </div>
                <div className="relative">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=059669&color=fff`}
                    alt="avatar"
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-sm border border-slate-100"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <KeyboardArrowDownIcon className={`text-slate-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fontSize="small" />
              </button>

              {/* Menu Container */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl shadow-slate-900/10 border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đang đăng nhập hồ sơ</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.email || 'Chưa cập nhật email'}</p>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      to="/user/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 w-full p-4 rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold text-sm"
                    >
                      <AccountCircleIcon fontSize="small" className="opacity-60" />
                      Thông tin cá nhân
                    </Link>
                    <div className="h-px bg-slate-50 mx-4 my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-4 rounded-lg text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                    >
                      <LogoutIcon fontSize="small" />
                      Đăng xuất ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Syncing Padding: 40px top, 32px left */}
        <main className="pt-10 pl-8 pr-10 pb-10 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
