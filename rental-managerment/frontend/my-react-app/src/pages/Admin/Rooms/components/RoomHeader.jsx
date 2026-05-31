import React from 'react';
import { FileSpreadsheet, RefreshCcw, Upload } from "lucide-react";

export default function RoomHeader({
    handleExport,
    setOpenImportModal,
    isExporting,
    onOpenRecent,
    hasRecentData
}) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Phòng trọ</h2>
                <p className="text-sm text-gray-500 mt-1">Hệ thống toàn bộ phòng trọ đang hoạt động</p>
            </div>
            <div className="flex flex-wrap gap-3">
                {hasRecentData && (
                    <button
                        onClick={onOpenRecent}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border border-gray-200 shadow-sm shadow-gray-200/50"
                    >
                        <RefreshCcw className="w-4 h-4 text-green-600" />
                        Thay đổi gần nhất
                    </button>
                )}
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
                    Xuất Excel
                </button>
            </div>
        </div>
    );
}
