import React from 'react';
import { History, X } from 'lucide-react';

const RecentImportModal = ({ isOpen, onClose, data = [] }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all animate-scaleIn border border-white/20">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 text-green-600 rounded-xl shadow-inner">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-900">Thay đổi vừa thực hiện</h3>
                            <p className="text-xs text-green-600 font-medium">Danh sách dữ liệu từ lần import gần nhất</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                    {data.length > 0 ? (
                        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Số phòng</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chủ trọ</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Giá thuê</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Khách thuê</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {data.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-green-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.roomNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.masterName || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-extrabold">{row.price?.toLocaleString()} đ</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{row.tenantName || '---'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    row.status === 'Đã thuê' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                                <History className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Chưa có lịch sử thay đổi trong phiên làm việc này.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-sm text-gray-500 font-medium italic">Dữ liệu sẽ được làm mới sau khi bạn thực hiện Import thành công lần tiếp theo.</p>
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-900/10 active:scale-95"
                    >
                        Đóng lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecentImportModal;
