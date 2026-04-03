import React from 'react';

const ExpiringContracts = ({ expiringSoon }) => {
  return (
    <div className="bg-white p-8 rounded shadow-sm border border-slate-100 h-full flex flex-col">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">Hợp đồng cũ</h3>
            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none">Hết hạn sớm</p>
          </div>
       </div>

       <div className="flex-1 space-y-1">
          <div className="grid grid-cols-3 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-2">
            <span>Khách</span>
            <span>Phòng</span>
            <span className="text-right">Hạn</span>
          </div>
          <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {expiringSoon?.length > 0 ? expiringSoon.map((con, idx) => {
              const days = parseInt(con.daysLeft);
              const colorClass = days <= 7 ? 'bg-rose-50 text-rose-600' : days <= 15 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600';
              return (
                <div key={idx} className="grid grid-cols-3 py-4 items-center hover:bg-slate-50 transition-all rounded-xl px-2 -mx-2 group cursor-pointer border-b border-slate-50/50">
                  <span className="text-[11px] font-black text-slate-800 tracking-tight truncate">{con.name}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{con.room}</span>
                  <div className="text-right">
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest leading-none ${colorClass}`}>
                        {con.daysLeft}
                      </span>
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Tất cả hợp đồng<br/>đều ổn định</p>
              </div>
            )}
          </div>
       </div>
    </div>
  );
};

export default ExpiringContracts;
