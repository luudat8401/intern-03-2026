import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getRoomsByMaster, createRoom, updateRoomApi, deleteRoomApi } from '../api/room.api';

export function useMasterRooms(userProfile) {
  // Data State
  const [rooms, setRooms] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, occupied: 0, vacant: 0, pending: 0, maintenance: 0 });

  // Control State
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;


  // UI State: Delete Modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  // 1. Core Fetching Logic (Server-side)
  const fetchRooms = useCallback(async () => {
    if (!userProfile?.id) return;
    try {
      const res = await getRoomsByMaster(userProfile.id, {
        page: currentPage,
        limit,
        status: filterStatus
      });

      const { rooms: data, total, totalPages: pages, stats: dashboardStats } = res.data;
      setRooms(data);
      setTotalItems(total);
      setTotalPages(pages);
      setStats(dashboardStats);
    } catch (err) {
      console.error("Lỗi fetch rooms:", err);
      toast.error("Không thể tải danh sách phòng.");
    }
  }, [userProfile?.id, currentPage, filterStatus, limit]);

  // Trigger fetch when dependency changes
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Reset to page 1 whenever filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);


  // 3. Delete logic
  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteRoomApi(deleteModal.id);
      toast.success("Đã xóa phòng khỏi hệ thống!");
      fetchRooms(); // Reload from server
    } catch (err) {
      toast.error("Xóa thất bại! Vui lòng thử lại.");
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  return {
    rooms, // This is already paginated by the server
    totalItems,
    totalPages,
    stats,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    deleteModal,
    setDeleteModal,
    handleConfirmDelete,
    refreshRooms: fetchRooms
  };
}
