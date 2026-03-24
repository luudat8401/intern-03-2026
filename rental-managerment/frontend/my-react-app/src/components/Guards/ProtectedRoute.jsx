import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;

  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}