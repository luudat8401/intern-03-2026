import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function FormActions({ isEditMode, isSubmitting, onCancel }) {
  return (
    <div className="flex justify-end gap-4 pt-10">
      <button
        type="button"
        onClick={onCancel}
        className="px-8 py-4 rounded-xl text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
      >
        Hủy bỏ
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-12 py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <CheckCircleIcon fontSize="small" />
        )}
        {isEditMode ? 'Cập nhật phòng' : 'Xác nhận thêm'}
      </button>
    </div>
  );
}
