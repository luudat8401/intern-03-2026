import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../service/authService";
import { Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Đăng nhập</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth-button" type="submit">
            Login
          </button>
        </form>
        <p className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}