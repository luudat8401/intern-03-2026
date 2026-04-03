import React from 'react';

const RoomHero = ({ room, onRentClick }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
      {/* Main Image */}
      <div className="h-[360px] w-full rounded-xl overflow-hidden shadow-2xl relative group">
        <img
          src={room.thumbnail}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
              #{room.roomNumber}
            </span>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20 text-white">
              Sẵn sàng
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Contact Card */}
      <div className="h-[360px] bg-white rounded-xl p-8 border border-slate-100 shadow-2xl shadow-emerald-500/5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-[120px] -z-10 opacity-40"></div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Giá thuê hằng tháng</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-emerald-600 tracking-tighter leading-none">{room.price?.toLocaleString()}</span>
              <span className="text-emerald-600 font-black text-sm uppercase">VNĐ</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-bold">Chủ sở hữu</span>
              <span className="text-slate-900 font-black">
                {room.master?.name || 'Nhà cung cấp tin cậy'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-bold">Điện thoại</span>
              <span className="text-emerald-700 font-black hover:underline cursor-pointer">
                {room.master?.phone || '090 xxxx xxx'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onRentClick}
          className="w-full bg-emerald-700 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/10 hover:bg-emerald-800 transition-all active:scale-95"
        >
          Tạo hợp đồng thuê phòng
        </button>
      </div>
    </div>
  );
};

export default RoomHero;
