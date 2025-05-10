import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function ProtectedRoute({ roles = [], fallback = "/log-in" }) {
  const { isAuth, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner fullScreen />;

  if (!isAuth || !user) {
    return (
      <Navigate to={fallback} replace state={{ from: location.pathname }} />
    );
  }

  if (roles.length > 0) {
    const userRoles = user.roles.map((role) => role.toUpperCase());
    const requiredRoles = roles.map((role) => role.toUpperCase());

    const hasRequiredRole = userRoles.some((role) =>
      requiredRoles.includes(role)
    );

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
