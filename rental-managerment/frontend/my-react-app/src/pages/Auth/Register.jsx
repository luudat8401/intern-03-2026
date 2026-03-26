import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../service/authService";
import "./auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, role);
      alert("Đăng ký thành công! Vui lòng Đăng nhập.");
      navigate("/login");
    } catch (error) {
      alert("Đăng ký thất bại! Có thể tên đăng nhập đã tồn tại.");
      console.error(error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Đăng ký Máy chủ Khu Trọ</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Mật khẩu cực độc"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="auth-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Khách thuê phòng</option>
            <option value="master">Chủ nhà trọ</option>
            {/* <option value="admin">Quản lý tổng (Admin)</option> */}
          </select>

          <button className="auth-button" type="submit">
            Tạo tài khoản
          </button>
        </form>
        <p className="auth-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
