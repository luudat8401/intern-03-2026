import React from 'react';
import { Home, MeetingRoom, AssignmentTurnedIn } from '@mui/icons-material';

const PaymentsIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const StatsCards = ({ stats }) => {
  const statConfig = [
    { 
      title: 'TỔNG DOANH THU', 
      value: stats?.totalRevenue?.toLocaleString() || '0', 
      unit: 'VNĐ', 
      bgColor: 'bg-emerald-50',
      icon: <PaymentsIcon className="text-emerald-600" />
    },
    { 
      title: 'TỔNG SỐ PHÒNG', 
      value: stats?.totalRooms || '0', 
      unit: 'Phòng', 
      bgColor: 'bg-slate-50',
      icon: <Home className="text-slate-600" />
    },
    { 
      title: 'PHÒNG ĐANG TRỐNG', 
      value: stats?.vacantRooms?.toString().padStart(2, '0') || '00', 
      unit: 'Phòng', 
      bgColor: 'bg-rose-50',
      icon: <MeetingRoom className="text-rose-600" />
    },
    { 
      title: 'HỢP ĐỒNG HIỆU LỰC', 
      value: stats?.activeContracts || '0', 
      unit: 'Hợp đồng', 
      bgColor: 'bg-blue-50',
      icon: <AssignmentTurnedIn className="text-blue-600" />
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statConfig.map((item, idx) => (
        <div key={idx} className="bg-white p-5 rounded shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.title}</span>
            <div className={`w-8 h-8 rounded ${item.bgColor} flex items-center justify-center`}>
              {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{item.value}</h2>
            <span className="text-[10px] font-black text-slate-400 uppercase">{item.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
