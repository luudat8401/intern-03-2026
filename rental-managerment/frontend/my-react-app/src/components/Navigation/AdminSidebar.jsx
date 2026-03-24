import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="sidebar">
      <h2>ADMIN PANEL</h2>
      <ul>
        <li>
          <NavLink to="/admin" end>Trang chủ </NavLink>
        </li>
        <li>
          <NavLink to="/admin/rooms">Phòng trọ</NavLink>
        </li>
        <li>
          <NavLink to="/admin/users">Khách thuê trọ</NavLink>
        </li>
        <li>
          <NavLink to="/admin/masters">Chủ trọ</NavLink>
        </li>
        <li>
          <NavLink to="/admin/contracts">Hợp đồng cho thuê</NavLink>
        </li>
      </ul>
    </div>
  );
}
