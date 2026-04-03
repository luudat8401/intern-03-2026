import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getRooms } from '../../../api/room.api';
import TenantRoomCard from './components/TenantRoomCard';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Pagination from '@mui/material/Pagination';

// FRONTEND CONFIGURATION: Page limit defined here
const PAGE_LIMIT = 8;

export default function TenantRooms() {
  const [rooms, setRooms] = useState([]);
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Applied filters (Only update when Search is clicked)
  const [appliedProvince, setAppliedProvince] = useState('');
  const [appliedDistrict, setAppliedDistrict] = useState('');

  // Snapshot of the last successful request to prevent duplicates
  const [lastAppliedFilters, setLastAppliedFilters] = useState({
    search: '',
    city: '',
    district: '',
    sort: 'price_asc'
  });

  // Filter States (Buffer/Temporary)
  const [searchQuery, setSearchQuery] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState({ code: null, name: "" });
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [sortBy, setSortBy] = useState('price_asc');

  // 1. Fetch Location Data
  const fetchProvinces = async () => {
    try {
      const res = await axios.get('https://provinces.open-api.vn/api/p/');
      setProvinces(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDistricts = async (provinceCode) => {
    if (!provinceCode) return setDistricts([]);
    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      setDistricts(res.data.districts);
    } catch (err) { console.error(err); }
  };

  // 2. Fetch Rooms with Applied Filters
  const fetchRooms = useCallback(async (page = 1, filters = {}) => {
    try {
      const city = filters.city !== undefined ? filters.city : appliedProvince;
      const district = filters.district !== undefined ? filters.district : appliedDistrict;
      const search = filters.search !== undefined ? filters.search : searchQuery;
      const sort = filters.sort !== undefined ? filters.sort : sortBy;

      const params = {
        page,
        limit: PAGE_LIMIT,
        city: city || undefined,
        district: district || undefined,
        search: search || undefined,
        sort: sort
      };

      const res = await getRooms(params);

      setRooms(res.data.rooms || []);
      setTotalRooms(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);

      // Record this filter set as the "last applied" for this page
      if (page === 1) {
        setLastAppliedFilters({ search, city, district, sort });
      }

    } catch (err) {
      console.error("Lỗi fetch rooms:", err);
    }
  }, [appliedProvince, appliedDistrict, searchQuery, sortBy]);

  // Initial load
  useEffect(() => {
    fetchProvinces();
    fetchRooms(1, { search: '', city: '', district: '', sort: 'price_asc' });
  }, []);

  const handleSearchClick = () => {
    const city = selectedProvince.name || '';
    const dist = (selectedDistrict && selectedDistrict !== 'Chọn Quận/Huyện') ? selectedDistrict : '';

    // REDUNDANCY CHECK: Compare current setup with the last successful one
    if (
      searchQuery === lastAppliedFilters.search &&
      city === lastAppliedFilters.city &&
      dist === lastAppliedFilters.district &&
      sortBy === lastAppliedFilters.sort
    ) {
      console.log("Dữ liệu không thay đổi. Bỏ qua request.");
      return; // Skip the request
    }

    // Update labels and trigger fetch
    setAppliedProvince(city);
    setAppliedDistrict(dist);
    fetchRooms(1, { search: searchQuery, city, district: dist, sort: sortBy });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchRooms(value);
  };

  const handleViewDetail = (room) => {
    navigate(`/user/rooms/${room.id}`);
  };

  return (
    <div className="w-full pb-20 animate-in fade-in duration-700">

      {/* FILTER BAR */}
      <div className="bg-white p-8 rounded shadow-xl shadow-slate-200/40 border border-slate-100 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">

          <div className="md:col-span-1.5 flex flex-col gap-2">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pl-2 font-black">Tìm kiếm nhanh</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 font-bold">
                <SearchIcon sx={{ fontSize: 18 }} />
              </div>
              <input
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded text-sm font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="Tên phòng hoặc địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pl-2 font-bold">Thành phố</label>
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded text-sm font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none cursor-pointer"
                value={selectedProvince.code || ''}
                onChange={(e) => {
                  const code = e.target.value;
                  const name = provinces.find(p => p.code == code)?.name || "";
                  setSelectedProvince({ code, name });
                  setSelectedDistrict("");
                  fetchDistricts(code);
                }}
              >
                <option value="">Toàn quốc</option>
                {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <KeyboardArrowDownIcon />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pl-2 font-bold">Quận / Huyện</label>
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded text-sm font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none cursor-pointer disabled:opacity-50"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedProvince.code}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <KeyboardArrowDownIcon />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pl-2 font-bold">Sắp xếp theo giá</label>
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded text-sm font-medium text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price_asc">Giá: Thấp tới Cao</option>
                <option value="price_desc">Giá: Cao tới Thấp</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <KeyboardArrowDownIcon />
              </div>
            </div>
          </div>

          <button
            onClick={handleSearchClick}
            className="h-[46px] bg-green-700 text-white font-medium text-xs uppercase tracking-[0.2em] rounded hover:bg-green-800 shadow-xl shadow-green-500/20 active:scale-95 transition-all"
          >
            TÌM KIẾM
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-10 px-4">
        <h2 className="text-3xl font-medium text-slate-900 tracking-tighter">
          {!appliedProvince
            ? "Danh sách phòng"
            : `Danh sách phòng tại ${appliedProvince}${appliedDistrict ? `, ${appliedDistrict}` : ''}`}
        </h2>
        <p className="text-slate-400 text-[11px] font-medium opacity-80 uppercase tracking-widest">
          Tìm thấy {totalRooms} phòng khả dụng
        </p>
      </div>

      {(
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-12 px-2 justify-items-center">
            {rooms.length === 0 ? (
              <div className="col-span-full py-20 text-center font-medium text-slate-300 uppercase tracking-widest text-sm italic">
                Không có phòng nào phù hợp tiêu chí của bạn.
              </div>
            ) : (
              rooms.map((room) => (
                <TenantRoomCard
                  key={room.id}
                  room={room}
                  onViewDetail={handleViewDetail}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-20 flex flex-col items-center gap-4">
              <div className="h-[1px] w-full bg-slate-100 mb-4"></div>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': { fontWeight: '700', borderRadius: '12px' }
                }}
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Trang {currentPage} / {totalPages}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
