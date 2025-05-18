import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function DesktopMenu() {
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada", {
      description: "Cerraste sesión exitosamente",
    });
    navigate("/");
  };

  const menuItemClass =
    "px-4 py-2 rounded-full bg-[#fdf5ea] text-amber-900  hover:bg-[#E96D87] hover:text-white transition-all duration-300 ease-in-out text-sm font-[Comic_Neue] font-semibold";

  return (
    <nav className="flex gap-4 items-center">
      <Link to="/" className={menuItemClass}>
        Inicio
      </Link>
      <Link to="/catalogo" className={menuItemClass}>
        Catálogo
      </Link>
      <Link to="/contacto" className={menuItemClass}>
        Contacto
      </Link>

      {isAuth && (
        <>
          <Link to="/perfil" className={menuItemClass}>
            Perfil
          </Link>
          <Link to="/mis-pedidos" className={menuItemClass}>
            Mis Pedidos
          </Link>
        </>
      )}

      {!isAuth ? (
        <Link
          to="/log-in"
          className={`${menuItemClass} flex items-center gap-2`}
        >
          Iniciar Sesión
          <User className="w-4 h-4" />
        </Link>
      ) : (
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={`${menuItemClass} flex items-center gap-2`}
        >
          Cerrar Sesión
          <LogOut className="w-4 h-4" />
        </Button>
      )}
    </nav>
  );
}
