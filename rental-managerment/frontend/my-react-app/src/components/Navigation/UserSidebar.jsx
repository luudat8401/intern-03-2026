import { NavLink } from "react-router-dom";

export default function UserSidebar() {
  return (
    <div className="user-sidebar">
      <h2>Khách thuê trọ</h2>
      <ul>
        <li>
          <NavLink to="/user" end>Thông tin cá nhân</NavLink>
        </li>
        <li>
          <NavLink to="/user/rooms">Danh sách phòng</NavLink>
        </li>
        <li>
          <NavLink to="/user/contracts">Hợp đồng của tôi</NavLink>
        </li>
      </ul>
    </div>
  );
}
