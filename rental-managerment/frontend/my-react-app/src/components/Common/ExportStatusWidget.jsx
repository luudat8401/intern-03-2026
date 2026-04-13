import { useState, useEffect } from 'react';
import { getExportStatusApi } from '../../api/room.api';
import { FileSpreadsheet, Download, X, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ExportStatusWidget({ jobId, onFinish, onClose }) {
    const [statusData, setStatusData] = useState({
        status: 'processing',
        progress: 0,
        url: null
    });

    useEffect(() => {
        if (!jobId) return;

        const pollStatus = async () => {
            try {
                const res = await getExportStatusApi(jobId);
                const data = res.data;
                setStatusData(data);

                if (data.status === 'completed' || data.status === 'failed') {
                    clearInterval(interval);
                    if (data.status === 'completed' && onFinish) {
                        onFinish(data.url);
                    }
                }
            } catch (error) {
                console.error("Lỗi polling status:", error);
                clearInterval(interval);
            }
        };

        const interval = setInterval(pollStatus, 2000);
        pollStatus(); // Gọi ngay lần đầu

        return () => clearInterval(interval);
    }, [jobId]);

    const getStatusIcon = () => {
        if (statusData.status === 'completed') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
        if (statusData.status === 'failed') return <AlertCircle className="w-5 h-5 text-rose-500" />;
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    };

    const getStatusText = () => {
        if (statusData.status === 'completed') return "Xuất file thành công!";
        if (statusData.status === 'failed') return "Xuất file thất bại";
        return `Đang chuẩn bị file... ${statusData.progress}%`;
    };

    return (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in slide-in-from-right duration-300 z-50">
            {/* Header */}
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Trình quản lý Export</span>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        {getStatusIcon()}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{getStatusText()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">ID: {jobId.substring(0, 15)}...</p>
                    </div>
                </div>

                {/* Progress Bar (Only when processing) */}
                {statusData.status === 'processing' && (
                    <div className="space-y-1.5">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="bg-blue-500 h-full transition-all duration-500 ease-out" 
                                style={{ width: `${statusData.progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                {statusData.status === 'completed' && (
                    <a 
                        href={statusData.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/10"
                    >
                        <Download className="w-4 h-4" />
                        Tải file ngay
                    </a>
                )}

                {statusData.status === 'failed' && (
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg text-xs border border-rose-100 italic">
                        Lỗi: {statusData.error || "Không xác định"}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-medium italic">Powered by Cloudinary & Stream</span>
            </div>
        </div>
    );
}
