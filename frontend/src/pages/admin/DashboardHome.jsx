// src/pages/admin/DashboardHome.jsx
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  PackageIcon,
  ShoppingCartIcon,
  BarChart2Icon,
  UsersIcon,
} from "lucide-react";

export default function DashboardHome() {
  const navigate = useNavigate();

  const tiles = [
    {
      title: "Productos",
      icon: <PackageIcon size={32} />,
      description: "Gestionar catálogo",
      onClick: () => navigate("/dashboard/products"),
      color: "from-[#FFD6A5] to-[#FDFFB6]",
    },
    {
      title: "Pedidos",
      icon: <ShoppingCartIcon size={32} />,
      description: "Ver y editar estados",
      onClick: () => navigate("/dashboard/orders"),
      color: "from-[#A0E7E5] to-[#B4F8C8]",
    },
    {
      title: "Usuarios",
      icon: <UsersIcon size={32} />,
      description: "Administrar cuentas",
      onClick: () => navigate("/dashboard/users"),
      color: "from-[#CDB4DB] to-[#FFC8DD]",
    },
    {
      title: "Reportes",
      icon: <BarChart2Icon size={32} />,
      description: "Métricas y tendencias",
      onClick: () => navigate("/dashboard/reports"),
      color: "from-[#FFAEBC] to-[#A0CED9]",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-[Comic_Neue] text-[#67463B]">
          🛠️ Panel de Administración
        </h1>
        <p className="mt-2 text-gray-600">
          Accesos rápidos y estadísticas básicas
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiles.map(({ title, icon, description, onClick, color }) => (
          <Card
            key={title}
            className={`bg-gradient-to-br ${color} hover:scale-[1.02] transform transition p-4 cursor-pointer`}
            onClick={onClick}
          >
            <CardContent className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 bg-white rounded-full shadow">{icon}</div>
              <h2 className="text-xl font-semibold text-[#67463B]">{title}</h2>
              <p className="text-sm text-gray-700">{description}</p>
              <Button variant="outline" className="mt-2">
                Ir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
