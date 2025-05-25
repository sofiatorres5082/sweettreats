import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Grid } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
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
} from "../../components/ui/alert-dialog";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

const links = [
  { to: "/dashboard", label: "Resumen" },
  { to: "/dashboard/users", label: "Usuarios" },
  { to: "/dashboard/products", label: "Productos" },
  { to: "/dashboard/orders", label: "Pedidos" },
  { to: "/dashboard/reports", label: "Reportes" },
];

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada", {
      description: "Cerraste sesión exitosamente",
    });
    navigate("/");
  };

  const NavItem = ({ to, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-6 py-3 rounded-lg transition-colors text-[#67463B] font-[Nunito] text-base flex items-center gap-2
          ${isActive ? "bg-[#A57F60] text-white" : "hover:bg-[#FDE0E7]"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="flex h-screen">
      <aside className="hidden md:flex flex-col w-72 bg-[#FCF8EC] p-6">
        <h1
          className="text-4xl font-[Marimpa] text-center text-[#67463B] mb-6 tracking-wide"
          role="banner"
          aria-label="SweetTreats"
        >
          Sweet<span className="text-[#E96D87]">Treats</span>
        </h1>
        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-3"
              >
                <LogOut className="w-5 h-5" /> Cerrar Sesión
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-[#FCF8EC] text-[#67463B] border-none">
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
                  <AlertDialogCancel className="rounded-lg px-5 py-2 bg-white hover:bg-[#FDE0E7]">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-lg px-5 py-2 bg-[#E96D87] text-white hover:bg-[#D86E7A]"
                    onClick={handleLogout}
                  >
                    Confirmar
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      <div className="md:hidden fixed top-4 left-4 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Grid className="w-6 h-6 text-[#705D44]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#FCF8EC] p-6 w-72">
            <h1 className="text-2xl font-[Marimpa] text-[#67463B] mb-6 text-center">
              Sweet<span className="text-[#E96D87]">Treats</span>
            </h1>
            <nav className="flex flex-col gap-3 mb-6">
              {links.map((link) => (
                <NavItem key={link.to} {...link} />
              ))}
            </nav>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  <LogOut className="w-5 h-5" /> Cerrar Sesión
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md bg-[#FCF8EC] text-[#67463B] border-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg text-center">
                    ¿Cerrar sesión?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    Esta acción cerrará tu sesión y te devolverá al inicio.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex justify-center gap-2 mt-4 w-full">
                  <AlertDialogCancel className="rounded-lg px-5 py-2 bg-white hover:bg-[#FDE0E7]">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-lg px-5 py-2 bg-[#E96D87] text-white hover:bg-[#D86E7A]"
                    onClick={handleLogout}
                  >
                    Confirmar
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 overflow-auto bg-[#FFF6ED] md:pl-10">
        <Outlet />
      </main>
    </div>
  );
}
