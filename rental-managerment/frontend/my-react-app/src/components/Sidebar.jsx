import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>QUẢN LÝ THUÊ TRỌ</h2>

      <ul>
        <li>
          <NavLink to="/">Trang chủ </NavLink>
        </li>

        <li>
          <NavLink to="/rooms">Phòng trọ</NavLink>
        </li>

        <li>
          <NavLink to="/users">Khách thuê trọ</NavLink>
        </li>

        <li>
          <NavLink to="/masters">Chủ trọ</NavLink>
        </li>

        <li>
          <NavLink to="/contracts">Hợp đồng cho thuê</NavLink>
        </li>
      </ul>
    </div>
  );
}