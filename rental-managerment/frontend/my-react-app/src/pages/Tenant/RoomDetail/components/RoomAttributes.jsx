import React from 'react';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';

const RoomAttributes = ({ room }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <SquareFootIcon />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diện tích</p>
          <p className="text-lg font-black text-slate-900">{room.area} m²</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <PeopleIcon />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sức chứa</p>
          <p className="text-lg font-black text-slate-900">{room.capacity} người</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <PersonIcon />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hiện có</p>
          <p className="text-lg font-black text-slate-900">{room.currentTenants} người</p>
        </div>
      </div>
    </div>
  );
};

export default RoomAttributes;
