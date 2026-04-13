import React from 'react';

const ImportResultModal = ({ isOpen, onClose, errors, successMessage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all animate-scaleIn border border-white/20">
                {/* Header */}
                <div className={`px-6 py-4 flex items-center justify-between ${errors.length > 0 ? 'bg-red-50 border-b border-red-100' : 'bg-green-50 border-b border-green-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${errors.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {errors.length > 0 ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <h3 className={`text-xl font-bold ${errors.length > 0 ? 'text-red-800' : 'text-green-800'}`}>
                            {errors.length > 0 ? 'Kết quả nhập dữ liệu (Có lỗi)' : 'Nhập dữ liệu thành công'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                    {successMessage && <p className="text-green-700 font-medium mb-4">{successMessage}</p>}
                    
                    {errors.length > 0 ? (
                        <div className="space-y-3">
                            <p className="text-gray-600 mb-2">
                                Đã tìm thấy <span className="font-bold text-red-600">{errors.length}</span> lỗi cần xử lý trong file Excel:
                            </p>
                            <ul className="space-y-2">
                                {errors.map((err, index) => (
                                    <li key={index} className="flex gap-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm leading-relaxed">
                                        <span className="flex-shrink-0 font-bold">•</span>
                                        <span>{err}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-600 italic">Mọi dữ liệu đã được xử lý chính xác và lưu vào hệ thống.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95 ${
                            errors.length > 0 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                        {errors.length > 0 ? 'Tôi đã hiểu, để tôi sửa lại' : 'Tuyệt vời, đóng lại'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportResultModal;
