import React from 'react';
import { PostAdd, Group } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
      <div 
        onClick={() => navigate('/master/contracts')}
        className="bg-slate-50 p-8 rounded border border-slate-100 flex items-center gap-6 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95 group shadow-sm"
      >
        <div className="w-14 h-14 bg-white rounded flex items-center justify-center shadow shadow-slate-200 group-hover:shadow-blue-200/50 text-blue-600 transition-all">
           <PostAdd sx={{ fontSize: 24 }} />
        </div>
        <div>
          <h4 className="text-md font-black text-slate-900 tracking-tight mb-0.5 uppercase">Quản lý hợp đồng</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kiểm soát tình trạng hiệu lực</p>
        </div>
      </div>

      <div 
        onClick={() => navigate('/master/rooms')}
        className="bg-slate-50 p-8 rounded border border-slate-100 flex items-center gap-8 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95 group shadow-sm"
      >
        <div className="w-14 h-14 bg-white rounded flex items-center justify-center shadow shadow-slate-200 group-hover:shadow-purple-200/50 text-purple-600 transition-all">
           <Group sx={{ fontSize: 24 }} />
        </div>
        <div>
          <h4 className="text-md font-black text-slate-900 tracking-tight mb-0.5 uppercase">Quản lý phòng</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Theo dõi chi tiết các phòng</p>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
