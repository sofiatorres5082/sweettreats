import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles = [], fallback = "/log-in" }) {
  const { isAuth, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!isAuth) {
    return (
      <Navigate to={fallback} state={{ from: location.pathname }} replace />
    );
  }

  if (
    roles.length > 0 &&
    !user?.roles?.some((r) => roles.includes(r.roleEnum))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
