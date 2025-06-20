import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Grid } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";

const links = [
  { to: "/dashboard", label: "Resumen" },
  { to: "/dashboard/users", label: "Usuarios" },
  { to: "/dashboard/products", label: "Productos" },
  { to: "/dashboard/orders", label: "Pedidos" },
  { to: "/dashboard/reports", label: "Reportes" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
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
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 py-3"
          >
            <ArrowLeft className="w-5 h-5" /> Volver al Inicio
          </Button>
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
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full flex items-center justify-center gap-2 py-3 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 cursor-pointer" /> Volver al Inicio
            </Button>
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 overflow-auto bg-[#FFF6ED] md:pl-10">
        <Outlet />
      </main>
    </div>
  );
}
