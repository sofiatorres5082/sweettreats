// src/pages/admin/DashboardLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom"
import { LogOut, Grid } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog"
import { useAuth } from "../../context/AuthContext"
import { toast } from "sonner"

export default function DashboardLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success("Sesión cerrada")
    navigate("/")
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar fijo en pantallas grandes, y menú deslizante en móviles */}
      <aside className="hidden md:flex flex-col w-64 bg-[#FCF8EC] p-6">
        <h1 className="text-2xl font-[Comic_Neue] text-[#67463B] mb-8">SweetTreats</h1>
        <nav className="flex flex-col gap-4 font-[Nunito] text-base">
          <Link to="/dashboard"      className="px-4 py-2 hover:bg-pink-50 rounded">Resumen</Link>
          <Link to="/dashboard/users"className="px-4 py-2 hover:bg-pink-50 rounded">Usuarios</Link>
          <Link to="/dashboard/products" className="px-4 py-2 hover:bg-pink-50 rounded">Productos</Link>
          <Link to="/dashboard/orders"   className="px-4 py-2 hover:bg-pink-50 rounded">Pedidos</Link>
          <Link to="/dashboard/reports"  className="px-4 py-2 hover:bg-pink-50 rounded">Reportes</Link>
        </nav>
        <div className="mt-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex justify-end gap-2">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Botón menú móvil */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Grid className="w-6 h-6 text-[#705D44]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#FCF8EC] p-6">
            <h1 className="text-2xl font-[Comic_Neue] text-[#67463B] mb-6">SweetTreats</h1>
            <nav className="flex flex-col gap-4">
              <Link to="/dashboard"      className="px-4 py-2 hover:bg-pink-50 rounded">Resumen</Link>
              <Link to="/dashboard/users"className="px-4 py-2 hover:bg-pink-50 rounded">Usuarios</Link>
              <Link to="/dashboard/products" className="px-4 py-2 hover:bg-pink-50 rounded">Productos</Link>
              <Link to="/dashboard/orders"   className="px-4 py-2 hover:bg-pink-50 rounded">Pedidos</Link>
              <Link to="/dashboard/reports"  className="px-4 py-2 hover:bg-pink-50 rounded">Reportes</Link>
            </nav>
            <div className="mt-auto pt-6">
              <Button variant="outline" onClick={handleLogout} className="w-full">
                <LogOut className="w-4 h-4 mr-2 inline" /> Cerrar Sesión
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Contenido dinámico */}
      <main className="flex-1 overflow-auto bg-[#FFF6ED] md:pl-10">
        <Outlet />
      </main>
    </div>
  )
}
