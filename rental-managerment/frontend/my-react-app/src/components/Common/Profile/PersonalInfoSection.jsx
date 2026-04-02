import React from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export default function PersonalInfoSection({ register, errors, user, avatarPreview, onAvatarChange, roleLabel = "Chủ trọ" }) {
  const isMaster = roleLabel === "Chủ trọ";
  const accentColor = isMaster ? "blue-600" : "emerald-600";

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
      {/* Avatar Edit Block (4 units) */}
      <div className="md:col-span-4">
        <div className="bg-white p-10 rounded border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center h-full relative group">
          <div className="relative mb-6">
            <Avatar
              src={avatarPreview || user?.avatar}
              sx={{
                width: 140,
                height: 140,
                borderRadius: '40px',
                bgcolor: 'slate.50',
                border: '1px solid #f1f5f9',
                boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.1)'
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>

            <label className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-2xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 cursor-pointer shadow-lg transition-all active:scale-95 group-hover:bg-blue-50">
              <PhotoCameraIcon sx={{ fontSize: 18 }} />
              <input type="file" hidden accept="image/*" onChange={onAvatarChange} />
            </label>
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-1">{user?.name || "Hồ sơ mới"}</h3>
          <p className={`text-[10px] font-black text-${accentColor} uppercase tracking-[0.25em]`}>
            {isMaster ? "CHỦ SỞ HỮU DIAMOND" : "NGƯỜI THUÊ CHÍNH CHỦ"}
          </p>
        </div>
      </div>

      {/* Inputs Block (8 units) */}
      <div className="md:col-span-8">
        <div className="bg-white p-10 rounded border border-slate-100 shadow-sm space-y-8">
          <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Thông tin Cá nhân
            <div className="h-[2px] flex-1 bg-slate-50 rounded"></div>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Họ và Tên</label>
              <input
                {...register("name")}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.name ? 'border-rose-300' : 'border-slate-100'} rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
                placeholder="Nhập họ tên đầy đủ..."
              />
              {errors.name && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Liên hệ</label>
              <input
                {...register("email")}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.email ? 'border-rose-300' : 'border-slate-100'} rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Số điện thoại</label>
              <input
                {...register("phone")}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.phone ? 'border-rose-300' : 'border-slate-100'} rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none`}
                placeholder="Số điện thoại cá nhân"
              />
              {errors.phone && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Địa chỉ thường trú</label>
              <textarea
                {...register("address")}
                rows={1}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.address ? 'border-rose-300' : 'border-slate-100'} rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none`}
                placeholder="Nhập địa chỉ chi tiết theo hộ khẩu..."
              />
              {errors.address && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.address.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
