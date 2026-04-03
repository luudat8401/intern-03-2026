import React from 'react';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

export default function TenantRoomCard({ room, onViewDetail }) {
  const isTopRated = room.price > 10000000;
  const isNewListing = !isTopRated;

  // Xử lý hiển thị diện tích (Dữ liệu thực)
  const displayArea = room.area ? room.area.toString().replace(/m2|m²/i, '') : '20';

  return (
    <div
      className="w-[216px] h-[465px] bg-white rounded-xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
      onClick={() => onViewDetail(room)}
    >
      {/* Thumbnail */}
      <div className="relative h-[220px] overflow-hidden shrink-0">
        <img
          src={room.thumbnail || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400'}
          alt={room.roomNumber}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {isTopRated && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[9px] font-medium text-slate-800 uppercase tracking-widest shadow-lg">
            💎 TOP RATED
          </div>
        )}
        {isNewListing && (
          <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[9px] font-semibold text-white uppercase tracking-widest shadow-lg">
            ✨ NEW ROOM
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-[17px] font-medium text-slate-900 leading-tight tracking-tight flex-1 pr-2 uppercase">
             Phòng {room.roomNumber || 'Trống'}
          </h3>
          <div className="text-right shrink-0">
             <p className="text-[14px] font-semibold text-blue-600">
               {room.price >= 1000000 ? `${(room.price/1000000).toFixed(1)}Tr` : room.price.toLocaleString()}
             </p>
             <p className="text-[8px] text-slate-400 font-medium uppercase mt-[-2px]">/tháng</p>
          </div>
        </div>

        <p className="text-[11px] font-normal text-slate-400 mb-6 flex items-center gap-1">
          📍 {room.district}, {room.city}
        </p>

        {/* Features SECTION - CLEANED UP FOR BOARDING ROOMS */}
        <div className="mt-auto space-y-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-y-3">
            {/* AREA */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                <SquareFootIcon sx={{ fontSize: 16 }} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-900">{displayArea} m²</p>
              </div>
            </div>

            {/* CAPACITY */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                <PeopleIcon sx={{ fontSize: 16 }} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-900">Tối đa {room.capacity || '2'}</p>
              </div>
            </div>

             {/* ROOM NUMBER (EXTRA) */}
             <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                <MeetingRoomIcon sx={{ fontSize: 16 }} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-900">Tầng {room.roomNumber?.charAt(0) || '1'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
