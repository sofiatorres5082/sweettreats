import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";

export default function MobileMenu() {
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada", {
      description: "Cerraste sesión exitosamente",
    });
    navigate("/");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="w-10 h-10 text-[#705D44]" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-[#E57F95] border-none shadow-none flex flex-col justify-between px-5 py-6"
      >
        <nav className="flex flex-col gap-4 mt-18">
          <Link
            to="/"
            className="w-full text-center font-[Comic_Neue] font-semibold text-[#67463B] bg-[#FCF8EC] border rounded-3xl py-2.5 hover:bg-pink-100 transition"
          >
            Inicio
          </Link>
          <Link
            to="/catalogo"
            className="w-full text-center font-[Comic_Neue] font-semibold text-[#67463B] bg-[#FCF8EC] border rounded-3xl py-2.5 hover:bg-pink-100 transition"
          >
            Catálogo
          </Link>
          <Link
            to="/contacto"
            className="w-full text-center font-[Comic_Neue] font-semibold text-[#67463B] bg-[#FCF8EC] border rounded-3xl py-2.5 hover:bg-pink-100 transition"
          >
            Contacto
          </Link>

          {isAuth && (
            <>
              <Link
                to="/perfil"
                className="w-full text-center font-[Comic_Neue] font-semibold text-[#67463B] bg-[#FCF8EC] border rounded-3xl py-2.5 hover:bg-pink-100 transition"
              >
                Perfil
              </Link>
              <Link
                to="/mis-pedidos"
                className="w-full text-center font-[Comic_Neue] font-semibold text-[#67463B] bg-[#FCF8EC] border rounded-3xl py-2.5 hover:bg-pink-100 transition"
              >
                Mis Pedidos
              </Link>
            </>
          )}
        </nav>

        <div className="mb-10">
          {!isAuth ? (
            <Link
              to="/log-in"
              className="w-full flex items-center justify-center gap-2 font-[Comic_Neue] font-semibold text-[#67463B] bg-[#FCF8EC] border rounded-3xl py-2.5 hover:bg-pink-100 transition"
            >
              Iniciar Sesión
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2 font-[Comic_Neue] font-semibold text-[#67463B] bg-[#FCF8EC] border rounded-3xl py-2.5 hover:bg-pink-100 transition"
                >
                  Cerrar Sesión
                  <LogOut className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg">
                    ¿Cerrar sesión?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción cerrará tu sesión y te devolverá al inicio.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center">
                  <div className="flex gap-5">
                    <AlertDialogCancel className="rounded-xl bg-white border hover:bg-pink-100">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-xl bg-[#E57F95] text-white hover:bg-pink-700"
                      onClick={handleLogout}
                    >
                      Confirmar
                    </AlertDialogAction>
                  </div>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
