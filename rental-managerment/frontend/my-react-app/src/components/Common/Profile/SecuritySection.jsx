import React from 'react';
import SecurityIcon from '@mui/icons-material/Security';
import KeyIcon from '@mui/icons-material/Key';

export default function SecuritySection({ register, errors, accentColor = "blue-600" }) {
  const isMaster = accentColor === "blue-600";
  const ringColor = isMaster ? "focus:ring-blue-100" : "focus:ring-emerald-100";

  return (
    <div className="bg-white p-10 rounded border border-slate-100 shadow-sm mt-10">
      <div className="mb-10 flex items-center justify-between">
        <h4 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <SecurityIcon fontSize="small" className={`text-${accentColor}`} />
          Bảo mật & Mật khẩu
        </h4>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg text-amber-600 text-[10px] font-black uppercase tracking-widest">
          Rất quan trọng
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Helper info side */}
        <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
          <div className={`w-12 h-12 bg-white rounded-xl shadow-sm text-${accentColor} flex items-center justify-center`}>
            <KeyIcon fontSize="medium" />
          </div>
          <h5 className="text-xs font-black text-slate-800 tracking-tight">Thay đổi mật khẩu</h5>
          <p className="text-[11px] text-slate-400 font-bold leading-relaxed px-2">
            Mật khẩu của bạn nên có ít nhất 8 ký tự bao gồm chữ cái và số để đảm bảo an toàn.
          </p>
        </div>

        {/* Password Inputs */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Mật khẩu hiện tại</label>
            <input
              {...register("oldPassword")}
              type="password"
              className={`w-full px-4 py-3 bg-slate-50 border ${errors.oldPassword ? 'border-rose-300' : 'border-slate-100'} rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 ${ringColor} transition-all`}
              placeholder="••••••••"
            />
            {errors.oldPassword && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.oldPassword.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Mật khẩu mới</label>
              <input
                {...register("newPassword")}
                type="password"
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.newPassword ? 'border-rose-300' : 'border-slate-100'} rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 ${ringColor} transition-all`}
                placeholder="••••••••"
              />
              {errors.newPassword && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Cần xác nhận lại</label>
              <input
                {...register("confirmNewPassword")}
                type="password"
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.confirmNewPassword ? 'border-rose-300' : 'border-slate-100'} rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 ${ringColor} transition-all`}
                placeholder="••••••••"
              />
              {errors.confirmNewPassword && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.confirmNewPassword.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
