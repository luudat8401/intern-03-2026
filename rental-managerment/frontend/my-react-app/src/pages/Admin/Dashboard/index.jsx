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

  const fetchData = useCallback(async () => {
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
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    return {
      totalRooms: rooms.length,
      rentedRooms: rooms.filter(r => r.status === "Đã thuê").length,
      totalUsers: users.length,
      activeContracts: contracts.filter(c => c.status === "active").length,
      totalMasters: masters.length
    };
  }, [rooms, users, contracts, masters]);

  return (
    <div className="dashboard">
      <h2>Hệ thống Quản lý - Dashboard</h2>
      <StatsGrid stats={stats} />
      <div className="dashboard-content">
        <RecentRooms rooms={rooms} />
      </div>
    </div>
  );
}