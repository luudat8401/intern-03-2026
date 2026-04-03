import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';

export default function RoomRow({ room, onEdit, onDelete }) {
  const imageUrl = room.thumbnail || 'https://via.placeholder.com/100x100?text=Room';

  // Status mapping
  const statusConfig = {
    0: { label: 'Trống', color: 'bg-emerald-100 text-emerald-700' },
    1: { label: 'Đã thuê', color: 'bg-blue-100 text-blue-700' },
    2: { label: 'Đang xử lý', color: 'bg-amber-100 text-amber-700' },
    3: { label: 'Bảo trì', color: 'bg-rose-100 text-rose-700' }
  };

  const currentStatus = statusConfig[room.status] || { label: 'Unknown', color: 'bg-slate-100 text-slate-700' };

  // Tenant logic (Assuming room.users might have an array)
  // Determine the tenant's name from either the linked users array or an active contract
  const tenant = (room.users && room.users.length > 0)
    ? room.users[0].name
    : (room.contracts && room.contracts.length > 0 && room.contracts[0].user)
      ? room.contracts[0].user.name
      : 'Chưa bàn giao';

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src={imageUrl}
            alt={room.roomNumber}
            className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-100"
          />
          <div className="flex flex-col">
            <h6 className="text-sm font-bold text-slate-900">Phòng {room.roomNumber}</h6>
            <p className="text-xs text-slate-500 font-medium">{room.area}m² • {room.title || 'Studio'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold leading-5 ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-bold text-slate-900">{room.price.toLocaleString()}đ</span>
        <p className="text-[10px] text-slate-400 font-semibold uppercase">Mỗi tháng</p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <AccountCircleIcon style={{ fontSize: '18px' }} className="text-slate-400" />
          </div>
          <span className={`text-sm font-medium ${tenant === 'Chưa bàn giao' ? 'text-slate-400' : 'text-slate-700'}`}>
            {tenant}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(room)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Chỉnh sửa"
          >
            <EditNoteIcon fontSize="small" />
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
            title="Xóa phòng"
          >
            <DeleteOutlineIcon fontSize="small" />
          </button>
        </div>
      </td>
    </tr>
  );
}
