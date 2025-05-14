import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function ProtectedRoute({ roles = [], fallback = "/log-in" }) {
  const { isAuth, user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!isAuth) {
    return <Navigate to="/log-in" state={{ from: location.pathname }} replace />;
  }

  if (
    roles.length > 0 &&
    !user?.roles?.some((r) => roles.includes(r.roleEnum))
  ) {
    console.warn("User doesn't have required roles:", user?.roles);
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}
