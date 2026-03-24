import { Navigate } from "react-router-dom";

export default function RoleDirector() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "master":
      return <Navigate to="/master" replace />;
    case "user":
      return <Navigate to="/user" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}
