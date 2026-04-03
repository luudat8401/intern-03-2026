import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';
import AvatarSection from '../../../../components/Common/Profile/AvatarSection';
import BasicInfoSection from '../../../../components/Common/Profile/BasicInfoSection';

export default function ProfileView({ user, onEdit }) {
  return (
    <div className="w-full pb-10 animate-in fade-in duration-700 font-sans">
      {/* Compact Header Section */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Hồ sơ cá nhân</h2>
          <p className="text-slate-500 text-sm font-medium italic opacity-70">Quản lý thông tin cá nhân</p>
        </div>
        <button
          onClick={onEdit}
          className="px-6 py-2.5 bg-blue-600 rounded text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 border border-blue-500"
        >
          <EditIcon sx={{ fontSize: 16 }} />
          Chỉnh sửa ngay
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT COLUMN (4 units) - Reusable Avatar Section */}
        <div className="md:col-span-4 space-y-8">
          <AvatarSection user={user} roleLabel="Chủ trọ" badgeColor="blue-600" />
        </div>

        {/* RIGHT COLUMN (8 units) - Reusable Basic Info Section + Payment Section */}
        <div className="md:col-span-8 space-y-8">
          <BasicInfoSection user={user} colorAccent="blue-600" />

          {/* Payment Block (Legacy or role specific) */}
          <div className="bg-white p-10 rounded border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                  <AccountBalanceIcon sx={{ fontSize: 20 }} />
                </div>
                THÔNG TIN THANH TOÁN
              </h4>
              <span className="text-[11px] font-black bg-blue-600 text-white px-4 py-1.5 rounded uppercase tracking-wider shadow-md shadow-blue-500/10">{user?.bankName}</span>
            </div>

            <div className="bg-slate-50 p-8 rounded grid grid-cols-2 gap-y-10 gap-x-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600/20"></div>
              <div>
                <p className="text-[11px] font-black text-slate-400 tracking-[0.2em] mb-2 uppercase">Chủ tài khoản</p>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{user?.bankAccountHolder || user?.name}</p>
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-400 tracking-[0.2em] mb-2 uppercase">Số tài khoản</p>
                <p className="text-xl font-black text-slate-900 tracking-widest font-mono">
                  {user?.bankAccountNumber ? user?.bankAccountNumber.replace(/\d(?=\d{4})/g, "* ") : "1023 **** **** 8901"}
                </p>
              </div>
              <div className="col-span-2 flex items-center gap-4 text-xs text-slate-500 font-bold bg-white/40 p-4 rounded-lg border border-slate-200/50">
                <InfoIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <span>Chi nhánh: {user?.bankBranch || "Chi nhánh Nam Sài Gòn, TP. Hồ Chí Minh"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
