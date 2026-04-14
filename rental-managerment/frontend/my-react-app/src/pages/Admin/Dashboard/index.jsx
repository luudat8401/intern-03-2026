import React, { useState, useEffect, useMemo, useCallback } from "react";
import StatsGrid from "./components/StatsGrid";
import RecentRooms from "./components/RecentRooms";
import { getAdminRooms } from "../../../api/room.api";
import { getUsers } from "../../../api/user.api";
import { getContracts } from "../../../api/contract.api";
import { getMasters } from "../../../api/master.api";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [masters, setMasters] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [roomsRes, usersRes, contractsRes, mastersRes] = await Promise.all([
        getAdminRooms({ limit: 1000, status: 'all' }),
        getUsers(),
        getContracts(),
        getMasters()
      ]);
      setRooms(roomsRes.data.rooms || roomsRes.data);
      setUsers(usersRes.data.users || usersRes.data);
      setContracts(contractsRes.data.contracts || contractsRes.data);
      setMasters(mastersRes.data.masters || mastersRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Định nghĩa các mã trạng thái để code clean hơn
  const ROOM_STATUS = { VACANT: 0, RENTED: 1, MAINTENANCE: 3 };
  const CONTRACT_STATUS = { ACTIVE: 1 };

  const stats = useMemo(() => {
    return {
      totalRooms: Array.isArray(rooms) ? rooms.length : 0,
      rentedRooms: Array.isArray(rooms) ? rooms.filter(r => r.status === ROOM_STATUS.RENTED).length : 0,
      totalUsers: Array.isArray(users) ? users.length : 0,
      activeContracts: Array.isArray(contracts) ? contracts.filter(c => c.status === CONTRACT_STATUS.ACTIVE).length : 0,
      totalMasters: Array.isArray(masters) ? masters.length : 0
    };
  }, [rooms, users, contracts, masters]);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-lg">
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Hệ thống Quản lý</h2>
          <p className="mt-2 text-blue-100 max-w-2xl text-lg">Chào mừng quay trở lại, Admin! Dưới đây là tổng quan tình hình kinh doanh của hệ thống quản lý thuê phòng.</p>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
          <div className="h-64 w-64 rounded-full bg-white blur-3xl"></div>
        </div>
      </div>
      
      <StatsGrid stats={stats} />
      
      <div className="grid grid-cols-1 gap-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <RecentRooms rooms={rooms} />
        </div>
      </div>
    </div>
  );
}