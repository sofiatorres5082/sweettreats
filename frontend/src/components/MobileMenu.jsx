import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, User, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileMenu() {
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
        </nav>
        <div className="mb-10">
          <Link
            to="/log-in"
            className="w-full flex items-center justify-center gap-2 font-[Comic_Neue] font-semibold text-[#67463B] bg-[#FCF8EC] border rounded-3xl py-2.5 hover:bg-pink-100 transition"
          >
            Iniciar Sesión
            <User className="w-5 h-5" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
