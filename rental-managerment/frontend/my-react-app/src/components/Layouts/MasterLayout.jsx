import MasterSidebar from "../Navigation/MasterSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import "../../styles/master-theme.css";

export default function MasterLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : {};

  return (
    <div className="master-app-container">
      <MasterSidebar />
      <div className="master-main-content">
        <header className="master-header">
          <h1>🏆 Quản lý dãy trọ của {user.username || "Chủ Trọ"}</h1>
          <button className="master-btn-logout" onClick={handleLogout}>Đăng Xuất</button>
        </header>

        <main className="master-page-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
