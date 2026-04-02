import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./components/Layouts/AdminLayout";
import MasterLayout from "./components/Layouts/MasterLayout";
import UserLayout from "./components/Layouts/UserLayout";
import RoleDirector from "./components/Guards/RoleDirector";
import ProtectedRoute from "./components/Guards/ProtectedRoute";
import {
  Dashboard, MasterDashboard, TenantInfo,
  TenantRooms, TenantContracts,
  MasterRooms, MasterContracts,
  Masters, Rooms, Users, Contracts, Login, Register, MasterProfile
} from "./pages";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RoleDirector />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="masters" element={<Masters />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="users" element={<Users />} />
          <Route path="contracts" element={<Contracts />} />
        </Route>

        <Route
          path="/master"
          element={
            <ProtectedRoute allowedRoles={["master"]}>
              <MasterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MasterDashboard />} />
          <Route path="rooms" element={<MasterRooms />} />
          <Route path="contracts" element={<MasterContracts />} />
          <Route path="profile" element={<MasterProfile />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          {/* 4 distinct pages for Tenant */}
          <Route index element={<div className="font-black text-slate-400 text-xs uppercase tracking-widest p-10">Đang phát triển Trang chủ Người thuê...</div>} />
          <Route path="rooms" element={<TenantRooms />} />
          <Route path="contracts" element={<TenantContracts />} />
          <Route path="profile" element={<TenantInfo />} />
        </Route>
        <Route path="/unauthorized" element={
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>403 - Bạn không có quyền truy cập trang này</h1>
            <a href="/">Quay lại trang chủ</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;