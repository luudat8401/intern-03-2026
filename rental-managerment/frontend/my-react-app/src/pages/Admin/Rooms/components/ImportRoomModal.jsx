import React, { useRef, useState } from 'react';
import { X, Upload, Download, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { generateRoomImportTemplate } from '../../../../utils/room-excel-template';

export default function ImportRoomModal({ isOpen, onClose, onImport, isImporting }) {
    const fileInputRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const handleDownloadTemplate = async () => {
        try {
            setIsGenerating(true);
            await generateRoomImportTemplate();
        } catch (error) {
            console.error("Lỗi tạo file mẫu:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onImport(e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-rose-50 px-6 py-4 flex justify-between items-center border-b border-rose-100">
                    <div className="flex items-center gap-2 text-rose-700">
                        <Upload className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Nhập dữ liệu từ Excel</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="space-y-6">
                        {/* Step 1: Download Template */}
                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm">Bước 1: Tải file mẫu</h4>
                                <p className="text-xs text-gray-500">Sử dụng file mẫu có sẵn Dropdown để nhập liệu chuẩn nhất.</p>
                            </div>
                            <button 
                                onClick={handleDownloadTemplate}
                                disabled={isGenerating}
                                className="flex items-center gap-1.5 bg-white border border-blue-200 text-blue-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Download className="w-3.5 h-3.5" />
                                )}
                                {isGenerating ? 'Đang tạo...' : 'Tải về'}
                            </button>
                        </div>

                        {/* Step 2: Upload File */}
                        <div 
                            onClick={() => !isImporting && fileInputRef.current?.click()}
                            className={`
                                cursor-pointer border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all
                                ${isImporting ? 'bg-gray-50 border-gray-200' : 'bg-rose-50/30 border-rose-200 hover:bg-rose-50/50 hover:border-rose-300'}
                            `}
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isImporting ? 'bg-gray-100 text-gray-400' : 'bg-rose-100 text-rose-600'}`}>
                                <Upload className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <h4 className="font-bold text-gray-900">Bước 2: Chọn file Excel</h4>
                                <p className="text-xs text-gray-500 mt-1">Kéo thả file hoặc click để chọn từ máy tính (.xlsx, .xls)</p>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".xlsx, .xls"
                                className="hidden"
                            />
                        </div>

                        {/* Note */}
                        <div className="flex gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p className="text-[11px] leading-relaxed">
                                Lưu ý: Hệ thống chỉ chấp nhận file đúng định dạng. Các dòng dữ liệu bị lỗi logic hoặc trùng số phòng sẽ được báo cáo chi tiết sau khi hệ thống xử lý.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                </div>
            </div>
        </div>
    );
}
