import UserSidebar from "../Navigation/UserSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import "../../styles/user-theme.css";

export default function UserLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : {};

  return (
    <div className="user-app-container">
      <UserSidebar />
      <div className="user-main-content">
        <header className="user-header">
          <h1>👋 Xin chào, {user.username || "Khách thuê"}!</h1>
          <button className="user-btn-logout" onClick={handleLogout}>Đăng Xuất</button>
        </header>

        <main className="user-page-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
