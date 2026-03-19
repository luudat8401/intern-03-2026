import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">

      <Sidebar />

      <div className="main">

        <Header />

        <div className="content">
          <Outlet/>
        </div>

      </div>

    </div>
  );
}