import React from 'react';

const ImportResultModal = ({ isOpen, onClose, errors, successMessage, recentData = [] }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${recentData.length > 0 && errors.length === 0 ? 'max-w-5xl' : 'max-w-2xl'} overflow-hidden transform transition-all animate-scaleIn border border-white/20`}>
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
                <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                    {successMessage && <p className="text-green-700 font-bold text-center text-lg mb-6">🎉 {successMessage}</p>}

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
                        recentData.length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-gray-600 font-medium">Danh sách các phòng đã được thêm mới:</p>
                                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Số phòng</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chủ trọ</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Giá thuê</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Khách thuê</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {recentData.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-green-50/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.roomNumber}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.masterName || 'N/A'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">{row.price?.toLocaleString()} đ</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{row.tenantName || '---'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.status === 'Đã thuê' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-600 italic">Mọi dữ liệu đã được xử lý chính xác và lưu vào hệ thống.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 ${errors.length > 0
                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200'
                                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
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
