import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
