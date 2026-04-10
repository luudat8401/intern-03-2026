import { useEffect, useState } from "react";
import RoomTable from "./components/RoomTable";

import { getAdminRooms, deleteRoomApi, exportAdminRoomsApi, exportAdminRoomsBatchApi, exportAdminRoomsCloudinaryApi, importAdminRoomsApi } from "../../../api/room.api";
import DeleteConfirmModal from "../../../components/Common/DeleteConfirmModal";
import ExportStatusWidget from "../../../components/Common/ExportStatusWidget";
import { Search, Filter, FileSpreadsheet, RefreshCcw, Cloud, Upload, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRef } from "react";
import * as XLSX from "xlsx";


export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        status: 'all',
        search: '',
        city: 'Chọn Tỉnh/Thành',
        district: 'Chọn Quận/Huyện'
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);


    const [isExporting, setIsExporting] = useState(false);
    const [isExportingBatch, setIsExportingBatch] = useState(false);
    const [activeJobId, setActiveJobId] = useState(null);
    const fileInputRef = useRef(null);
    const limit = 10;



    const fetchRooms = async (currentPage) => {
        try {
            const res = await getAdminRooms({
                page: currentPage,
                limit,
                ...activeFilters
            });
            setRooms(res.data.rooms || res.data);
            setTotalPages(res.data.totalPages || 1);
        } catch (error) {
            console.error("Lỗi khi tải phòng", error);
        }
    };

    useEffect(() => {
        fetchRooms(page);
    }, [page, activeFilters]);


    // Fetch tỉnh thành
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch('https://provinces.open-api.vn/api/p/');
                const data = await res.json();
                setProvinces(data);
            } catch (err) {
                console.error("Lỗi fetch tỉnh thành:", err);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch quận huyện khi tỉnh thay đổi (Vẫn giữ local state cho cái này vì nó cần logic phụ thuộc)
    const [selectedCity, setSelectedCity] = useState('Chọn Tỉnh/Thành');

    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedCity === 'Chọn Tỉnh/Thành') {
                setDistricts([]);
                return;
            }
            try {
                const province = provinces.find(p => p.name === selectedCity);
                if (province) {
                    const res = await fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
                    const data = await res.json();
                    setDistricts(data.districts || []);
                }
            } catch (err) {
                console.error("Lỗi fetch quận huyện:", err);
            }
        };
        fetchDistricts();
    }, [selectedCity, provinces]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const formData = new FormData(e.target);
        const newFilters = {
            search: formData.get('search'),
            status: formData.get('status'),
            city: formData.get('city'),
            district: formData.get('district')
        };
        setPage(1);
        setActiveFilters(newFilters);
    };

    const handleReset = (e) => {
        const form = e.target.closest('form');
        if (form) form.reset();
        setSelectedCity('Chọn Tỉnh/Thành');
        const defaultFilters = { status: 'all', search: '', city: 'Chọn Tỉnh/Thành', district: 'Chọn Quận/Huyện' };
        setPage(1);
        setActiveFilters(defaultFilters);
    };
    const handleExport = async () => {
        const start = Date.now();
        console.log("%c[STREAMING] Bắt đầu xuất file...", "color: #10b981; font-weight: bold;");
        try {
            setIsExporting(true);
            const response = await exportAdminRoomsApi(activeFilters);

            const totalTime = Date.now() - start;
            console.log(`%c[STREAMING] Hoàn thành! Tổng thời gian: ${totalTime}ms`, "color: #10b981; font-weight: bold;");

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Streaming_Export_${new Date().getTime()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("[STREAMING] Lỗi:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportBatch = async () => {
        const start = Date.now();
        console.log("%c[BATCH] Bắt đầu xuất theo lô (10.000 dòng/lô)...", "color: #f59e0b; font-weight: bold;");
        try {
            setIsExportingBatch(true);
            const response = await exportAdminRoomsBatchApi(activeFilters);

            const totalTime = Date.now() - start;
            console.log(`%c[BATCH] Hoàn thành! Tổng thời gian: ${totalTime}ms`, "color: #f59e0b; font-weight: bold;");

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Batch_Export_${new Date().getTime()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("[BATCH] Lỗi:", error);
        } finally {
            setIsExportingBatch(false);
        }
    };
    const handleExportCloudinary = async () => {
        try {
            const response = await exportAdminRoomsCloudinaryApi(activeFilters);
            if (response.data.success) {
                setActiveJobId(response.data.jobId);
            }
        } catch (error) {
            console.error("[CLOUDINARY] Lỗi:", error);
        }
    };

    const handleImportExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Validate kích thước file (Tối đa 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File quá lớn! Vui lòng chọn file dưới 5MB.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Đọc dữ liệu thô dạng mảng
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                // Bỏ qua dòng tiêu đề, lọc các dòng có dữ liệu và map đúng 17 cột
                const rows = json.slice(1).filter(r => r.length > 0).map(r => ({
                    masterName: r[0]?.toString().trim(),
                    masterPhone: r[1]?.toString().trim(),
                    masterEmail: r[2]?.toString().trim(),
                    masterAddress: r[3]?.toString().trim(),
                    roomNumber: r[4]?.toString().trim(),
                    title: r[5]?.toString().trim(),
                    price: parseFloat(r[6]),
                    area: parseFloat(r[7]),
                    capacity: parseInt(r[8]),
                    city: r[9]?.toString().trim(),
                    district: r[10]?.toString().trim(),
                    ward: r[11]?.toString().trim(),
                    location: r[12]?.toString().trim(),
                    description: r[13]?.toString().trim(),
                    amenities: r[14]?.toString().trim(),
                    isTrending: r[15]?.toString().toLowerCase() === "true" || r[15] === "1" || r[15]?.toString().toLowerCase() === "có"
                }));

                if (rows.length === 0) {
                    toast.error("File không có dữ liệu!");
                    return;
                }

                if (rows.length > 100) {
                    toast.error("Chỉ được nhập tối đa 100 dòng mỗi lần!");
                    return;
                }

                // Gửi mảng dữ liệu về Backend
                const res = await importAdminRoomsApi(rows);
                toast.success(res.data.message || "Nhập dữ liệu thành công!");
                fetchRooms(page);
            } catch (error) {
                console.error("Lỗi xử lý file Excel:", error);
                const errorMsg = error.response?.data?.error || "Lỗi khi xử lý file Excel";
                toast.error(errorMsg, { duration: 6000 });
            } finally {
                e.target.value = "";
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDeleteClick = (id) => {
        setSelectedRoomId(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedRoomId) return;
        try {
            await deleteRoomApi(selectedRoomId);
            fetchRooms(page);
        } catch (error) {
            console.error("Lỗi xóa phòng", error);
            alert("Xóa thất bại!");
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Phòng trọ</h2>
                        <p className="text-sm text-gray-500 mt-1">Hệ thống toàn bộ phòng trọ đang hoạt động</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportBatch}
                            disabled={isExportingBatch || isExporting}
                            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50"
                        >
                            {isExportingBatch ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                            Xuất batching
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={isExporting || isExportingBatch}
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

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImportExcel}
                            accept=".xlsx, .xls"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-rose-900/20 disabled:opacity-50"
                        >
                            <Upload className="w-4 h-4" />
                            Nhập file
                        </button>
                    </div>
                </div>

                {/* Section Bộ lọc */}
                <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            name="search"
                            defaultValue={activeFilters.search}
                            placeholder="Tìm số phòng, tiêu đề..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <select
                        name="status"
                        defaultValue={activeFilters.status}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="0">Còn trống</option>
                        <option value="1">Đã thuê</option>
                        <option value="2">Đang chờ duyệt</option>
                        <option value="3">Bảo trì</option>
                    </select>

                    <select
                        name="city"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    >
                        <option value="Chọn Tỉnh/Thành">Tất cả Tỉnh/Thành</option>
                        {provinces.map(p => (
                            <option key={p.code} value={p.name}>{p.name}</option>
                        ))}
                    </select>

                    <select
                        name="district"
                        defaultValue={selectedCity === 'Chọn Tỉnh/Thành' ? 'Chọn Quận/Huyện' : ''}
                        disabled={selectedCity === 'Chọn Tỉnh/Thành'}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium disabled:opacity-50"
                    >
                        <option value="Chọn Quận/Huyện">Tất cả Quận/Huyện</option>
                        {districts.map(d => (
                            <option key={d.code} value={d.name}>{d.name}</option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-md"
                    >
                        <Filter className="w-4 h-4" />
                        Lọc tin
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                        title="Đặt lại bộ lọc"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>

                </form>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <RoomTable
                        rooms={rooms}
                        deleteRoom={handleDeleteClick}
                        onEdit={(room) => console.log("Edit room", room)}
                    />

                    {/* Component Phân trang */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <span className="text-sm text-gray-500">
                            Trang <span className="font-medium text-gray-900">{page}</span> / <span className="font-medium text-gray-900">{totalPages}</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${page === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                            >
                                Trang trước
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${page === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                            >
                                Trang kế
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Xác nhận xóa phòng?"
                message="Hành động này không thể hoàn tác. Dữ liệu phòng sẽ bị xóa vĩnh viễn khỏi hệ thống."
            />

            {activeJobId && (
                <ExportStatusWidget
                    jobId={activeJobId}
                    onClose={() => setActiveJobId(null)}
                    onFinish={(url) => {
                        console.log("Export finished! URL:", url);
                        // Có thể tự động tải nếu muốn: window.open(url);
                    }}
                />
            )}
        </div>
    );
}