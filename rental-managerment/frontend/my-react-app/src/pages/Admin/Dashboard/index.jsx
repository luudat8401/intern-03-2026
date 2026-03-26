import React, { useState, useEffect, useMemo, useCallback } from "react";
import StatsGrid from "./components/StatsGrid";
import RecentRooms from "./components/RecentRooms";
import "./dashboard.css";
import { getRooms } from "../../../api/room.api";
import { getUsers } from "../../../api/user.api";
import { getContracts } from "../../../api/contract.api";
import { getMasters } from "../../../api/master.api";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [roomsRes, usersRes, contractsRes, mastersRes] = await Promise.all([
        getRooms(),
        getUsers(),
        getContracts(),
        getMasters()
      ]);
      setRooms(roomsRes.data);
      setUsers(usersRes.data);
      setContracts(contractsRes.data);
      setMasters(mastersRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sử dụng useMemo để tính toán các con số thống kê chuyên sâu
  const stats = useMemo(() => {
    console.log("--- Đang tính toán lại stats Dashboard ---");
    return {
      totalRooms: rooms.length,
      rentedRooms: rooms.filter(r => r.status === "Đã thuê").length,
      totalUsers: users.length,
      activeContracts: contracts.filter(c => c.status === "active").length,
      totalMasters: masters.length
    };
  }, [rooms, users, contracts, masters]);

  if (loading) return <div className="dashboard-loading">Đang tải dữ liệu hệ thống...</div>;

  return (
    <div className="dashboard">
      <h2>Hệ thống Quản lý - Dashboard</h2>
      
      <StatsGrid stats={stats} />

      <div className="dashboard-content">
        <RecentRooms rooms={rooms} />
        {/* Có thể thêm các danh sách khác ở đây */}
      </div>
    </div>
  );
}