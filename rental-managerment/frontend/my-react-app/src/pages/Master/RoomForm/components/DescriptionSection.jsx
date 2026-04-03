import React from 'react';
import DescriptionIcon from '@mui/icons-material/Description';

export default function DescriptionSection({ register }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          <DescriptionIcon fontSize="small" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Mô tả chi tiết</h3>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
        <textarea
          {...register("description")}
          placeholder="Nhập ghi chú thêm về phòng, nội quy, hoặc các thông tin đặc biệt khác..."
          className="w-full min-h-[220px] p-8 text-sm font-medium text-slate-600 placeholder:text-slate-300 outline-none resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
