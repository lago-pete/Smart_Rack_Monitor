import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function ProtectedRoute() {
  const { token } = useAuthStore();
  const location = useLocation();

  // Dev bypass: skip login if VITE_BYPASS_AUTH=true in .env.local
  const bypass = import.meta.env.VITE_BYPASS_AUTH === "true";
  if (bypass) {
    return <Outlet />;
  }

  if (!token) {
    // Extract language from current path
    const lng = location.pathname.split('/')[1] || 'en';
    return <Navigate to={`/${lng}/login`} replace />;
  }

  return <Outlet />;
}