import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="header">
      <h1></h1>
      {user && (
        <div className="user-info">
          <span>Xin chào, {user.username}</span>
          <button className="logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
