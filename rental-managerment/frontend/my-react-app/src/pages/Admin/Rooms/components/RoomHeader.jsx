import React from 'react';
import { FileSpreadsheet, RefreshCcw, Cloud, Upload } from "lucide-react";

export default function RoomHeader({ 
    handleExport, 
    handleExportCloudinary, 
    setOpenImportModal,
    isExporting, 
    activeJobId
}) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Phòng trọ</h2>
                <p className="text-sm text-gray-500 mt-1">Hệ thống toàn bộ phòng trọ đang hoạt động</p>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => setOpenImportModal(true)}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-rose-900/20"
                >
                    <Upload className="w-4 h-4" />
                    Nhập dữ liệu Excel
                </button>

                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                >
                    {isExporting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                    Xuất Stream
                </button>

                <button
                    onClick={handleExportCloudinary}
                    disabled={!!activeJobId}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                >
                    <Cloud className="w-4 h-4" />
                    Xuất Cloud
                </button>
            </div>
        </div>
    );
}
