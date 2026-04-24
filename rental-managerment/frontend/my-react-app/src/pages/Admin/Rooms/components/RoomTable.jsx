import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
export default function RoomTable({ rooms, deleteRoom, onEdit }) {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                    <tr>
                        <th className="px-6 py-4">Phòng</th>
                        <th className="px-6 py-4">Giá (VNĐ)</th>
                        <th className="px-6 py-4">Chủ Sở Hữu</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4">Khách Đang Thuê</th>
                        <th className="px-6 py-4 text-right">Hành động</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {rooms.map(room => (
                        <tr key={room.id} className="hover:bg-purple-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-600 flex flex-shrink-0 items-center justify-center">
                                        <HomeIcon fontSize="small" />
                                    </div>
                                    <span className="font-semibold text-gray-900">{room.roomNumber}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium">
                                {room.price ? room.price.toLocaleString() : "0"}
                            </td>
                            <td className="px-6 py-4 font-medium italic text-gray-600">
                                {room.master?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4">
                                {(() => {
                                    const statusMap = {
                                        0: { label: 'Trống', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                                        1: { label: 'Đã thuê', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                                        2: { label: 'Đang xử lý', color: 'bg-amber-100 text-amber-700 border-amber-200' },
                                        3: { label: 'Bảo trì', color: 'bg-rose-100 text-rose-700 border-rose-200' },
                                        4: { label: 'Đã xóa', color: 'bg-gray-100 text-gray-500 border-gray-300 line-through opacity-60' }
                                    };
                                    const current = statusMap[room.status] || { label: 'Không xác định', color: 'bg-gray-100 text-gray-700 border-gray-200' };
                                    return (
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${current.color}`}>
                                            {current.label}
                                        </span>
                                    );
                                })()}
                            </td>
                            <td className="px-6 py-4">
                                {room.contracts?.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        {room.contracts.map((contract, idx) => (
                                            contract.user ? (
                                                <div key={idx} className="flex items-center gap-1.5 text-gray-900 font-semibold">
                                                    <PeopleIcon className="text-blue-500" style={{ fontSize: '14px' }} />
                                                    {contract.user.name}
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 italic text-xs font-medium uppercase tracking-tight">
                                        Chưa bàn giao
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit && onEdit(room)}
                                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <EditIcon fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => deleteRoom(room.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Xóa"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {rooms.length === 0 && (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                <span className="block text-sm">Chưa có dữ liệu phòng trọ.</span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}