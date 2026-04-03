import React from 'react';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const RoomRecommendations = ({ recommendations, cityName }) => {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="pt-12 space-y-10 border-t border-slate-200">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gợi ý dành cho bạn</h3>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Cùng thành phố {cityName}</p>
        </div>
        <button 
          onClick={() => navigate('/user/rooms')}
          className="text-emerald-600 text-[10px] font-black uppercase tracking-widest border-b-2 border-emerald-600 pb-1 hover:text-emerald-800 transition-all font-bold"
        >
          Tất cả
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map(rec => (
          <div 
            key={rec.id} 
            onClick={() => navigate(`/user/rooms/${rec.id}`)}
            className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
          >
            <div className="h-44 overflow-hidden relative">
              <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[10px] font-black px-2 py-1 rounded">
                {rec.price?.toLocaleString()} đ
              </div>
            </div>
            <div className="p-5 space-y-2">
              <h4 className="font-black text-slate-900 text-sm truncate uppercase">P.{rec.roomNumber} - {rec.title}</h4>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold italic">
                <LocationOnIcon sx={{ fontSize: 12 }} />
                <span className="truncate">{rec.district}, {rec.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomRecommendations;
