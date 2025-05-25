import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";

export default function DesktopMenu() {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada", {
      description: "Cerraste sesión exitosamente",
    });
    navigate("/");
  };

  const menuItemClass =
    "px-4 py-2 rounded-full bg-[#fdf5ea] text-amber-900 hover:bg-[#E96D87] hover:text-white transition-all duration-300 ease-in-out text-sm font-[Comic_Neue] font-semibold";

  return (
    <nav className="flex gap-4 items-center">
      <Link to="/" className={menuItemClass}>
        Inicio
      </Link>
      <Link to="/catalogo" className={menuItemClass}>
        Catálogo
      </Link>
      <Link to="/sobre-nosotros" className={menuItemClass}>
        Sobre nosotros
      </Link>

      {isAuth && user?.roles?.some(r => r.roleEnum === 'ADMIN') && (
        <Button
          variant="outline"
          className={`${menuItemClass} flex items-center gap-2`} 
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </Button>
      )}

      {isAuth && !user?.roles?.some(r => r.roleEnum === 'ADMIN') && (
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className={`${menuItemClass} flex items-center gap-2`}>
              Cerrar Sesión
              <LogOut className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#fdf5ea] text-amber-900 border-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg text-center">
                ¿Cerrar sesión?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                Esta acción cerrará tu sesión y te devolverá al inicio.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <div className="flex justify-center gap-4 w-full">
                <AlertDialogCancel className="rounded-full px-5 py-2 bg-white hover:bg-[#FDE0E7]">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-full px-5 py-2 bg-[#E96D87] text-white hover:bg-[#D86E7A]"
                  onClick={handleLogout}
                >
                  Confirmar
                </AlertDialogAction>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </nav>
  );
}
