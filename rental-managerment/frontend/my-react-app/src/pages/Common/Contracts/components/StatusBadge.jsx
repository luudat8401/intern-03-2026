import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 0:
        return { label: 'Đang chờ duyệt', className: 'bg-amber-50 text-amber-600 border-amber-100' };
      case 1:
        return { label: 'Đang hiệu lực', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      case 2:
        return { label: 'Đã từ chối', className: 'bg-rose-50 text-rose-600 border-rose-100' };
      case 3:
        return { label: 'Đã kết thúc', className: 'bg-slate-50 text-slate-500 border-slate-100' };
      default:
        return { label: 'Không xác định', className: 'bg-slate-50 text-slate-400 border-slate-100' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
