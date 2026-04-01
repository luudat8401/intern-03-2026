import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import RoomRow from './components/RoomRow';
import RoomModal from './components/RoomModal';
import DeleteConfirmModal from '../../../components/Common/DeleteConfirmModal';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import { useMasterRooms } from '../../../hooks/useMasterRooms';

export default function MasterRooms() {
  const { userProfile } = useAuth();

  const {
    rooms,
    totalItems,
    totalPages,
    stats,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    roomModal,
    setRoomModal,
    deleteModal,
    setDeleteModal,
    handleSaveRoom,
    handleConfirmDelete
  } = useMasterRooms(userProfile);

  const StatBox = ({ title, value, filterVal, colorClass, activeBorder }) => (
    <div
      onClick={() => setFilterStatus(filterVal)}
      className={`bg-white p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md
        ${filterStatus === filterVal ? activeBorder : 'border-slate-100 hover:border-slate-200'}`}
    >
      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</h5>
      <span className={`text-2xl font-extrabold block mt-2 ${colorClass}`}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Quản lý phòng
          </h1>
          <p className="text-slate-500 font-medium">Hệ thống trung tâm quản lý tài sản và dãy trọ của bạn.</p>
        </div>
        <button
          onClick={() => setRoomModal({ isOpen: true, data: null })}
          className="bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-900 transition-all hover:shadow-lg active:scale-95 shadow-md"
        >
          <AddIcon />
          <span>Thêm phòng mới</span>
        </button>
      </div>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-5 gap-6">
        <StatBox title="Tổng số phòng" value={stats.total} filterVal="all" colorClass="text-slate-900" activeBorder="border-slate-900" />
        <StatBox title="Đã thuê" value={stats.occupied} filterVal="1" colorClass="text-blue-600" activeBorder="border-blue-500" />
        <StatBox title="Phòng trống" value={stats.vacant} filterVal="0" colorClass="text-emerald-600" activeBorder="border-emerald-500" />
        <StatBox title="Đang xử lý" value={stats.pending} filterVal="2" colorClass="text-amber-500" activeBorder="border-amber-500" />
        <StatBox title="Bảo trì" value={stats.maintenance} filterVal="3" colorClass="text-rose-600" activeBorder="border-rose-500" />
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Danh sách phòng hiện có</h3>
          <div className="flex gap-3">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
              <FilterListIcon fontSize="small" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
              <FileDownloadIcon fontSize="small" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên phòng</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá thuê</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Khách thuê</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                    Không tìm thấy phòng nào phù hợp với bộ lọc bạn chọn.
                  </td>
                </tr>
              ) : (
                rooms.map(room => (
                  <RoomRow
                    key={room.id}
                    room={room}
                    onEdit={(room) => setRoomModal({ isOpen: true, data: room })}
                    onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Đang ở trang {currentPage} / {totalPages} (Tổng {totalItems} nội dung)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-xs font-bold border rounded-lg transition-all 
                ${currentPage === 1 ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Trang trước
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-xs font-bold border rounded-lg transition-all 
                ${currentPage === totalPages ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Trang tiếp
            </button>
          </div>
        </div>
      </div>

      <RoomModal
        isOpen={roomModal.isOpen}
        onClose={() => setRoomModal({ isOpen: false, data: null })}
        onSave={handleSaveRoom}
        roomData={roomModal.data}
        masterId={userProfile?.id || ''}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa phòng?"
        message="Bạn có chắc chắn muốn xóa phòng này? Hành động này sẽ xóa vĩnh viễn tất cả thông tin liên quan."
      />
    </div>
  );
}
