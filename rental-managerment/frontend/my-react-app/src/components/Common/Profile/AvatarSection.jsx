import React from 'react';
import { Avatar, Tooltip } from '@mui/material';

export default function AvatarSection({ user, roleLabel, badgeColor = "blue-600" }) {
  return (
    <div className="bg-white p-8 rounded border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center h-[340px] relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${badgeColor}/5 -mr-12 -mt-12 rounded-full blur-2xl opacity-60`}></div>

      <div className="relative mb-5">
        <Avatar
          src={user?.avatar}
          sx={{
            width: 120,
            height: 120,
            borderRadius: '32px',
            bgcolor: 'slate.50',
            border: '1px solid #f1f5f9',
            boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.1)'
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
      </div>

      <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{user?.name}</h3>
      <p className={`text-xs font-black text-${badgeColor} uppercase tracking-[0.25em] mb-8`}>{roleLabel === "Chủ trọ" ? "CHỦ SỞ HỮU DIAMOND" : "NGƯỜI THUÊ CHÍNH CHỦ"}</p>

      <div className="w-full space-y-4 pt-6 border-t border-slate-50">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-bold tracking-widest uppercase">Tham gia từ</span>
          <span className="text-slate-800 font-black">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}
          </span>
        </div>
      </div>
    </div>
  );
}
