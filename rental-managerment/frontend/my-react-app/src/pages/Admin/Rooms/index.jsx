import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";
import { importRowSchema } from "../../../schemas/import-room.schema";

// Components
import RoomTable from "./components/RoomTable";
import RoomHeader from "./components/RoomHeader";
import RoomFilter from "./components/RoomFilter";
import RoomPagination from "./components/RoomPagination";
import ImportResultModal from "./components/ImportResultModal";
import ImportRoomModal from "./components/ImportRoomModal";
import DeleteConfirmModal from "../../../components/Common/DeleteConfirmModal";

// APIs
import {
    getAdminRooms,
    deleteRoomApi,
    exportAdminRoomsApi,
    importAdminRoomsApi
} from "../../../api/room.api";

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
    const [isOpenImportModal, setIsOpenImportModal] = useState(false);
    const [importResult, setImportResult] = useState({
        isOpen: false,
        errors: [],
        successMessage: ''
    });
    const limitPage = 10;
    const [isImporting, setIsImporting] = useState(false);

    const fetchRooms = async (currentPage) => {
        try {
            const res = await getAdminRooms({
                page: currentPage,
                limit: limitPage,
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

    // Fetch quận huyện khi tỉnh thay đổi
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



    const handleImportExcel = async (e) => {
        setIsOpenImportModal(false);
        const file = e.target.files[0];
        if (!file) return;

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
                const workbook = XLSX.read(data, { type: 'array', cellDates: true });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Hàm xử lý ngày tháng từ Excel
                const formatExcelDate = (val) => {
                    if (!val) return null;

                    let date;
                    if (val instanceof Date) {
                        date = val;
                    } else if (typeof val === 'number') {
                        date = new Date(Math.round((val - 25569) * 86400 * 1000));
                    } else if (typeof val === 'string' && val.includes('/')) {
                        const [d, m, y] = val.split('/');
                        return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
                    } else {
                        return val;
                    }
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };

                const rows = json.slice(1)
                    .map((r, i) => ({ raw: r, excelRow: i + 1 }))
                    .filter(item => item.raw.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== ""))
                    .map(item => {
                        const r = item.raw;
                        return {
                            excelRow: item.excelRow,
                            masterName: r[0]?.toString().trim(),
                            masterPhone: r[1]?.toString().trim(),
                            masterEmail: r[2]?.toString().trim(),
                            masterAddress: r[3]?.toString().trim(),
                            roomNumber: r[4]?.toString().trim(),
                            title: r[5]?.toString().trim(),
                            price: parseFloat(r[6]),
                            area: r[7]?.toString().trim(),
                            capacity: parseInt(r[8]),
                            city: r[9]?.toString().trim(),
                            district: r[10]?.toString().trim(),
                            ward: r[11]?.toString().trim(),
                            location: r[12]?.toString().trim(),
                            description: r[13]?.toString().trim(),
                            amenities: r[14]?.toString().trim(),
                            isTrending: r[15]?.toString().toLowerCase() === "true" || r[15] === "1" || r[15]?.toString().toLowerCase() === "có",
                            status: r[16]?.toString().trim() || "Trống",
                            tenantName: r[17]?.toString().trim() || null,
                            tenantPhone: r[18]?.toString().trim() || null,
                            deposit: parseFloat(r[19]) || 0,
                            startDate: formatExcelDate(r[20]),
                            endDate: formatExcelDate(r[21])
                        };
                    });

                if (rows.length === 0) {
                    toast.error("File không có dữ liệu!");
                    return;
                }

                if (rows.length > 100) {
                    toast.error("Chỉ được nhập tối đa 100 dòng mỗi lần!");
                    return;
                }

                // --- VALIDATE FRONTEND TỔNG THỂ ---
                const validationErrors = [];
                const seenRoomNumbers = new Set();

                for (const row of rows) {
                    const rowLabel = row.excelRow;
                    
                    // 1. Validate định dạng (Yup)
                    try {
                        await importRowSchema.validate(row, { abortEarly: false });
                    } catch (err) {
                        err.inner.forEach(e => {
                            validationErrors.push(`Dòng ${rowLabel}: ${e.message}`);
                        });
                    }

                    // 2. Validate trùng lặp trong file
                    if (row.roomNumber) {
                        if (seenRoomNumbers.has(row.roomNumber)) {
                            validationErrors.push(`Dòng ${rowLabel}: Số phòng "${row.roomNumber}" bị trùng lặp trong chính file Excel.`);
                        }
                        seenRoomNumbers.add(row.roomNumber);
                    }

                    // 3. Kiểm tra logic Hợp đồng (Nếu có người thuê)
                    const hasTenantInfo = !!(row.tenantPhone || row.tenantName);
                    const hasContractInfo = !!(row.startDate || row.endDate || row.deposit);

                    if (hasTenantInfo || hasContractInfo) {
                        if (!row.tenantPhone) validationErrors.push(`Dòng ${rowLabel}: Thiếu SĐT người thuê.`);
                        if (!row.tenantName) validationErrors.push(`Dòng ${rowLabel}: Thiếu Họ tên người thuê.`);
                        if (!row.startDate) validationErrors.push(`Dòng ${rowLabel}: Thiếu Ngày bắt đầu hợp đồng.`);
                        if (!row.endDate) validationErrors.push(`Dòng ${rowLabel}: Thiếu Ngày kết thúc hợp đồng.`);
                        if (!row.status) validationErrors.push(`Dòng ${rowLabel}: Có thông tin thuê nhưng thiếu Trạng thái phòng.`);
                        else if (row.status !== "Đã thuê") validationErrors.push(`Dòng ${rowLabel}: Có người thuê thì trạng thái phòng phải là "Đã thuê".`);
                    } else if (row.status === "Đã thuê") {
                        validationErrors.push(`Dòng ${rowLabel}: Trạng thái phòng là "Đã thuê" nhưng không có thông tin người thuê và hợp đồng.`);
                    }
                }

                if (validationErrors.length > 0) {
                    setImportResult({
                        isOpen: true,
                        errors: validationErrors.slice(0, 100), // Hiển thị tối đa 100 lỗi
                        successMessage: ''
                    });
                    setIsImporting(false);
                    e.target.value = "";
                    return;
                }
                // -------------------------

                setIsImporting(true);
                try {
                    const res = await importAdminRoomsApi(rows);
                    setImportResult({
                        isOpen: true,
                        errors: [],
                        successMessage: res.data.message || "Nhập dữ liệu thành công!"
                    });
                    fetchRooms(page);
                } catch (error) {
                    console.error("Lỗi xử lý gọi API Import:", error);
                    const errorData = error.response?.data;
                    setImportResult({
                        isOpen: true,
                        errors: errorData?.details || [errorData?.error || errorData?.message || "Lỗi khi xử lý lưu dữ liệu"],
                        successMessage: ''
                    });
                } finally {
                    setIsImporting(false);
                    e.target.value = "";
                }
            } catch (error) {
                console.error("Lỗi đọc/phân tích file Excel:", error);
                toast.error("Đã có lỗi xảy ra khi đọc file!");
                setIsImporting(false);
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

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">

                <RoomHeader
                    handleExport={handleExport}
                    setOpenImportModal={setIsOpenImportModal}
                    isExporting={isExporting}
                />

                <RoomFilter
                    activeFilters={activeFilters}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    provinces={provinces}
                    districts={districts}
                />

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <RoomTable
                        rooms={rooms}
                        deleteRoom={handleDeleteClick}
                        onEdit={(room) => console.log("Edit room", room)}
                    />

                    <RoomPagination
                        page={page}
                        totalPages={totalPages}
                        handlePrevPage={() => page > 1 && setPage(page - 1)}
                        handleNextPage={() => page < totalPages && setPage(page + 1)}
                    />
                </div>
            </div>

            <ImportRoomModal
                isOpen={isOpenImportModal}
                onClose={() => setIsOpenImportModal(false)}
                onImport={handleImportExcel}
                isImporting={isImporting}
            />

            <DeleteConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Xác nhận xóa phòng?"
                message="Hành động này không thể hoàn tác. Dữ liệu phòng sẽ bị xóa vĩnh viễn khỏi hệ thống."
            />
            <ImportResultModal
                isOpen={importResult.isOpen}
                onClose={() => setImportResult(prev => ({ ...prev, isOpen: false }))}
                errors={importResult.errors}
                successMessage={importResult.successMessage}
            />
        </div>
    );
}