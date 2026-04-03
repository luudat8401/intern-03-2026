import React from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center flex flex-col items-center">
                    {/* Warning Icon */}
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
                        <WarningAmberIcon style={{ fontSize: '32px' }} />
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {title || 'Xác nhận xóa tài sản?'}
                    </h3>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8 px-4">
                        {message || 'Hành động này không thể hoàn tác. Dữ liệu phòng sẽ bị xóa vĩnh viễn khỏi kho lưu trữ của bạn.'}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 px-6 py-3.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>

                {/* Small Close Button Top-Right (Optional) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 p-1"
                >
                    <CloseIcon fontSize="small" />
                </button>
            </div>
        </div>
    );
}
