import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  return user ? <Outlet /> : <Navigate to="/log-in" replace />;
}