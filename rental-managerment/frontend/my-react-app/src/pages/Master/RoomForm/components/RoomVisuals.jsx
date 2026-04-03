import React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function RoomVisuals({ register, previewUrl, handleFileChange, imageError }) {
  return (
    <div className="space-y-6">
      <div className="group relative h-72 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-300 hover:bg-blue-50/30 shadow-inner">
        {previewUrl ? (
          <img src={previewUrl} alt="Room" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-500">
            <CloudUploadIcon style={{ fontSize: '64px' }} />
            <div className="text-center">
              <p className="text-sm font-bold tracking-tight">Tải ảnh phòng</p>
              <p className="text-[10px] uppercase tracking-widest font-extrabold opacity-60">PNG, JPG </p>
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        {previewUrl && (
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <span className="bg-white text-slate-900 px-6 py-2 rounded-full text-xs font-bold shadow-2xl">Đổi ảnh</span>
          </div>
        )}
      </div>
      {imageError && <p className="text-rose-500 text-xs font-bold bg-rose-50 px-3 py-2 rounded-lg text-center">{imageError}</p>}

      {/* Trending section with preserved custom larger roundedness */}
      <div className="bg-slate-50/80 p-6 rounded-2xl space-y-6 border border-slate-100">
        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Thiết lập nhanh</h5>
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <span className="text-sm font-bold text-slate-700">Nổi bật (Trending)</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register("isTrending")} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 ml-1">Trạng thái phòng</label>
          <select
            {...register("status")}
            className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none shadow-sm"
          >
            <option value={0}>✅ Còn trống</option>
            <option value={1}>🏠 Đã thuê</option>
            <option value={2}>⏳ Đang xử lý</option>
            <option value={3}>🛠️ Đang bảo trì</option>
          </select>
        </div>
      </div>
    </div>
  );
}
