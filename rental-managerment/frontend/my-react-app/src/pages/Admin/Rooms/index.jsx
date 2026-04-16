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
import RecentImportModal from "./components/RecentImportModal";
import ImportRoomModal from "./components/ImportRoomModal";
import DeleteConfirmModal from "../../../components/Common/DeleteConfirmModal";

// APIs
import {
    getAdminRooms,
    deleteRoomApi,
    exportAdminRoomsApi,
    importAdminRoomsApi
} from "../../../api/room.api";

const EXCEL_COLUMN_MAP = {
    "Họ tên Chủ trọ": "masterName",
    "SĐT Chủ trọ": "masterPhone",
    "Email Chủ trọ": "masterEmail",
    "Địa chỉ Chủ trọ": "masterAddress",
    "Số phòng": "roomNumber",
    "Tiêu đề phòng": "title",
    "Giá thuê (VNĐ)": "price",
    "Diện tích (m2)": "area",
    "Sức chứa (người)": "capacity",
    "Tỉnh/Thành": "city",
    "Quận/Huyện": "district",
    "Phường/Xã": "ward",
    "Địa chỉ chi tiết": "location",
    "Mô tả": "description",
    "Tiện ích": "amenities",
    "Nổi bật": "isTrending",
    "Trạng thái": "status",
    "Họ tên người thuê": "tenantName",
    "SĐT người thuê": "tenantPhone",
    "Tiền cọc (VNĐ)": "deposit",
    "Ngày bắt đầu (dd/mm/yyyy)": "startDate",
    "Ngày kết thúc (dd/mm/yyyy)": "endDate"
};

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
    const [recentImportedData, setRecentImportedData] = useState([]);

    const [isExporting, setIsExporting] = useState(false);
    const [isOpenImportModal, setIsOpenImportModal] = useState(false);
    const [importResult, setImportResult] = useState({
        isOpen: false,
        errors: [],
        successMessage: ''
    });
    const limitPage = 10;
    const [isImporting, setIsImporting] = useState(false);
    const [isOpenRecentModal, setIsOpenRecentModal] = useState(false);

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
                const expectedColumnNumber = 22;

                const formatExcelDate = (value) => {
                    if (!value) return null;
                    let parsedDate;
                    switch (typeof value) {
                        case 'number':
                            parsedDate = new Date(Math.round((value - 25569) * 86400 * 1000));
                            break;
                        case 'string':
                            if (value.includes('/')) {
                                const [date, month, year] = value.split('/');
                                return `${date.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
                            }
                            return value;
                        case 'object':
                            if (value instanceof Date) {
                                parsedDate = value;
                                break;
                            }
                            return value;
                        default:
                            return value;
                    }
                    const day = String(parsedDate.getDate()).padStart(2, '0');
                    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
                    const year = parsedDate.getFullYear();

                    return `${day}/${month}/${year}`;
                };

                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const headers = json[0];
                const columnIndices = {};
                Object.keys(EXCEL_COLUMN_MAP).forEach(vnHeader => {
                    const dbKey = EXCEL_COLUMN_MAP[vnHeader];
                    const index = headers.findIndex(h => h?.toString().trim() === vnHeader);
                    columnIndices[dbKey] = index; // key là tên cột trong database, value là index của cột trong file excel
                }); // map dữ liệu từ file excel sang database

                const rows = json.slice(1)
                    .map((r, i) => ({ raw: r, excelRow: i + 1 }))
                    .filter(item => {
                        const r = item.raw;
                        // Kiểm tra xem hàng có dữ liệu tối thiểu (Số phòng, Tiêu đề, Giá, vv.)
                        const coreFields = ["roomNumber", "title", "price", "masterName"];
                        return coreFields.some(field => {
                            const idx = columnIndices[field];
                            if (idx === undefined || idx === -1) return false;
                            const val = r[idx];
                            return val !== null && val !== undefined && val.toString().trim() !== "";
                        });
                    })
                    .map(item => {
                        const r = item.raw;
                        const getValue = (field) => {
                            const idx = columnIndices[field];
                            if (idx === undefined || idx === -1) return undefined;
                            return r[idx];
                        };

                        return {
                            excelRow: item.excelRow,
                            masterName: getValue("masterName")?.toString().trim(),
                            masterPhone: getValue("masterPhone")?.toString().trim(),
                            masterEmail: getValue("masterEmail")?.toString().trim(),
                            masterAddress: getValue("masterAddress")?.toString().trim(),
                            roomNumber: getValue("roomNumber")?.toString().trim(),
                            title: getValue("title")?.toString().trim(),
                            price: parseFloat(getValue("price")),
                            area: getValue("area")?.toString().trim(),
                            capacity: parseInt(getValue("capacity")),
                            city: getValue("city")?.toString().trim(),
                            district: getValue("district")?.toString().trim(),
                            ward: getValue("ward")?.toString().trim(),
                            location: getValue("location")?.toString().trim(),
                            description: getValue("description")?.toString().trim(),
                            amenities: getValue("amenities")?.toString().trim(),
                            isTrending: getValue("isTrending")?.toString().toLowerCase() === "true" || getValue("isTrending") === "1" || getValue("isTrending")?.toString().toLowerCase() === "có",
                            status: getValue("status")?.toString().trim() || "Trống",
                            tenantName: getValue("tenantName")?.toString().trim() || null,
                            tenantPhone: getValue("tenantPhone")?.toString().trim() || null,
                            deposit: parseFloat(getValue("deposit")) || 0,
                            startDate: formatExcelDate(getValue("startDate")),
                            endDate: formatExcelDate(getValue("endDate"))
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
                const requiredVNHeaders = [
                    "SĐT Chủ trọ", "Email Chủ trọ", "Số phòng",
                    "Tiêu đề phòng", "Giá thuê (VNĐ)", "Diện tích (m2)", "Sức chứa (người)",
                    "Tỉnh/Thành", "Quận/Huyện", "Phường/Xã", "Địa chỉ chi tiết"
                ];

                const missingHeaders = requiredVNHeaders.filter(h => !headers.some(cell => cell?.toString().trim() === h));

                if (missingHeaders.length > 0) {
                    validationErrors.push(`File thiếu các cột bắt buộc: ${missingHeaders.join(", ")}`);
                } else {
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
                    if (res.data.recentData) {
                        setRecentImportedData(res.data.recentData);
                    }
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
                    onOpenRecent={() => setIsOpenRecentModal(true)}
                    hasRecentData={recentImportedData.length > 0}
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
                recentData={recentImportedData}
            />
            <RecentImportModal
                isOpen={isOpenRecentModal}
                onClose={() => setIsOpenRecentModal(false)}
                data={recentImportedData}
            />
        </div>
    );
}