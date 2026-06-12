import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../application/hooks";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
