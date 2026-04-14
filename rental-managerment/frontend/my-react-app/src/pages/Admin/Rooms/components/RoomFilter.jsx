import { Search, Filter, RefreshCcw } from "lucide-react";

export default function RoomFilter({
    activeFilters,
    handleSearch,
    handleReset,
    selectedCity,
    setSelectedCity,
    provinces,
    districts
}) {
    return (
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
    );
}
