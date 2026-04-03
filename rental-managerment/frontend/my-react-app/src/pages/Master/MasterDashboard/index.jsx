import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../context/AuthContext";
import { getMasterStats } from "../../../api/master.api";
import { toast } from "react-hot-toast";
import DashboardHeader from './components/DashboardHeader';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import ExpiringContracts from './components/ExpiringContracts';
import QuickActions from './components/QuickActions';

const MasterDashboard = () => {
  const { userProfile: user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [range, setRange] = useState(6);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await getMasterStats(user.id, range);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu dashboard:", err);
        toast.error("Không thể tải dữ liệu thống kê từ máy chủ");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, range]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse font-sans">Đang đồng bộ dữ liệu...</p>
      </div>
    );
  }

  const { stats, expiringSoon, chartData } = dashboardData || {};

  return (
    <div className="max-w-[1400px] mx-auto p-4 lg:p-6 lg:pt-0 space-y-6 animate-in fade-in duration-700 font-sans">

      {/* 1. Header Section */}
      <DashboardHeader />

      {/* 2. Top Statistics Section */}
      <StatsCards stats={stats} />

      {/* 3. Main Analytics & Contracts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <RevenueChart
          chartData={chartData}
          range={range}
          setRange={setRange}
        />
        <ExpiringContracts
          expiringSoon={expiringSoon}
        />
      </div>
      {/* 4. Navigation & Shortcuts Section */}
      <QuickActions />

    </div>
  );
};

export default MasterDashboard;
