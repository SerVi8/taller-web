import { useAuthStore } from "@/features/auth/store/auth.store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute() {
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
