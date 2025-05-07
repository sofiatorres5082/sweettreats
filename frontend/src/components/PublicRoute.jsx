import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "./Spinner";

export default function PublicRoute() {
  const { loading, isAuth, user } = useAuth();

  if (loading) return <Spinner></Spinner>;

  if (isAuth && user?.active === 1) {
    return (
      <Navigate
        to={user.role === "USER" ? "/home" : "/dashboard"}
        replace
      />
    );
  }  

  return <Outlet />;
}
