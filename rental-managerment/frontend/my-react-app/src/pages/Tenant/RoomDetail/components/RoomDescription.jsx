import React from 'react';

const RoomDescription = ({ description }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Mô tả </h3>
      </div>
      <div className="bg-slate-50/50 p-8 rounded-xl border border-slate-100 text-slate-600 leading-relaxed text-[15px] font-medium whitespace-pre-wrap">
        {description || "Dữ liệu đang được cập nhật..."}
      </div>
    </div>
  );
};

export default RoomDescription;
