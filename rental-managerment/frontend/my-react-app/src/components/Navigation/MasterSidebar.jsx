import { NavLink } from "react-router-dom";

export default function MasterSidebar() {
  return (
    <div className="master-sidebar">
      <h2>MASTER PANEL</h2>
      <ul>
        <li>
          <NavLink to="/master" end>Tổng quan</NavLink>
        </li>
        <li>
          <NavLink to="/master/rooms">Phòng của tôi</NavLink>
        </li>
        <li>
          <NavLink to="/master/contracts">Hợp đồng của tôi</NavLink>
        </li>
      </ul>
    </div>
  );
}
