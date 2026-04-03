import React from 'react';

const DashboardHeader = () => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-100 pb-4 pt-4">
            <div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-2">
                    Hệ thống quản lý chủ trọ
                </p>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                    Báo cáo tổng quan
                </h1>
            </div>
            <div className="text-right">
                <p className="text-[11px] font-bold text-slate-500 italic opacity-75">
                    Hôm nay: {new Date().toLocaleDateString('vi-VN')}
                </p>
            </div>
        </div>
    );
};

export default DashboardHeader;
