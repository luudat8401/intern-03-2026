import AdminSidebar from "../Navigation/AdminSidebar";
import Header from "../Navigation/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="layout">
      <AdminSidebar />
      <div className="main">
        <Header />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
