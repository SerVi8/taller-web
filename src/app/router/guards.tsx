import { useAuth } from "@/features/auth/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PageLoader = () => {
  return (
    <div className="h-dvh flex flex-col space-y-6 justify-center items-center">
      <h1 className="uppercase text-6xl font-black">
        Lubri<span className="text-primary">llantas</span>
      </h1>
      <span className="font-semibold text-muted-foreground animate-pulse">
        Iniciando sistema...
      </span>
    </div>
  );
};

export function ProtectedRoute() {
  const location = useLocation();

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) {
    const from =
      (location.state as { from?: Location })?.from?.pathname ?? "/admin";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
