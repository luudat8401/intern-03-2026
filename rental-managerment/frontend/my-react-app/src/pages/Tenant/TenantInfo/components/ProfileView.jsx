import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AvatarSection from '../../../../components/Common/Profile/AvatarSection';
import BasicInfoSection from '../../../../components/Common/Profile/BasicInfoSection';

export default function ProfileView({ user, onEdit }) {
  return (
    <div className="w-full pb-10 animate-in fade-in duration-700 font-sans">
      {/* Compact Header Section (Emerald for Tenant) */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Hồ sơ cá nhân</h2>
          <p className="text-slate-500 text-sm font-medium italic opacity-70">Thông tin cá nhân của bạn</p>
        </div>
        <button
          onClick={onEdit}
          className="px-6 py-2.5 bg-emerald-600 rounded text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 border border-emerald-500"
        >
          <EditIcon sx={{ fontSize: 16 }} />
          Chỉnh sửa hồ sơ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT COLUMN (4 units) - Reusable Avatar Section (Tenant Theme) */}
        <div className="md:col-span-4 space-y-8">
          <AvatarSection user={user} roleLabel="Người thuê" badgeColor="emerald-600" />
        </div>

        {/* RIGHT COLUMN (8 units) - Reusable Basic Info Section */}
        <div className="md:col-span-8 space-y-8">
          <BasicInfoSection user={user} colorAccent="emerald-600" />

          <div className="bg-white p-10 rounded border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h5 className="font-black text-slate-800 text-sm">Hướng dẫn bảo mật</h5>
              <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                Mọi thay đổi thông tin quan trọng sẽ được thông báo qua Email. Vui lòng đảm bảo Email của bạn luôn hoạt động.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
