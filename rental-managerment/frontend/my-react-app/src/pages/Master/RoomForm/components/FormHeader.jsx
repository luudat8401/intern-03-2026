import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FormHeader({ isEditMode, onBack }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
        >
          <ArrowBackIcon fontSize="small" />
        </button>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            {isEditMode ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
          </h1>
          <p className="text-slate-500 font-medium">Hệ thống quản lý nội thất và tiện nghi chi tiết.</p>
        </div>
      </div>
    </div>
  );
}
