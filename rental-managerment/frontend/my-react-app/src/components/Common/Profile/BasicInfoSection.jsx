import React from 'react';

export default function BasicInfoSection({ user, colorAccent = "blue-600" }) {
  return (
    <div className="bg-white p-10 rounded border border-slate-100 shadow-sm h-[340px] flex flex-col justify-center">
      <h4 className="text-2xl font-black text-slate-900 mb-10 tracking-tighter flex items-center gap-4">
        Thông tin Cơ bản
        <div className={`h-[2px] flex-1 bg-${colorAccent}/5 rounded ml-4 border-b border-slate-100`}></div>
      </h4>

      <div className="grid grid-cols-2 gap-x-16 gap-y-10">
        <LargeInfoItem label="HỌ VÀ TÊN" value={user?.name} colorAccent={colorAccent} />
        <LargeInfoItem label="EMAIL LIÊN HỆ" value={user?.email} colorAccent={colorAccent} />
        <LargeInfoItem label="SỐ ĐIỆN THOẠI" value={user?.phone} colorAccent={colorAccent} />
        <LargeInfoItem label="ĐỊA CHỈ THƯỜNG TRÚ" value={user?.address} colorAccent={colorAccent} />
      </div>
    </div>
  );
}

function LargeInfoItem({ label, value, colorAccent }) {
  return (
    <div className="space-y-1 border-l-4 border-slate-50 pl-4">
      <p className="text-[11px] font-black text-slate-400 tracking-[0.15em] uppercase">{label}</p>
      <p className="text-[17px] font-black text-slate-800 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{value || "---"}</p>
    </div>
  );
}
