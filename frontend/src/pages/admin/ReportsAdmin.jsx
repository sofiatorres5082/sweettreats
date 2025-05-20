import { useEffect, useState } from "react";
import {
  salesRequest,
  salesTrendRequest,
  ticketAverageRequest,
  topProductsRequest,
  lowStockRequest,
  noSalesRequest,
} from "../../api/admin";
import { Card } from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsAdmin() {
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [trend, setTrend] = useState({ labels: [], data: [] });
  const [avgTicket, setAvgTicket] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [noSales, setNoSales] = useState([]);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [
          salesRes,
          trendRes,
          avgRes,
          topRes,
          lowRes,
          noRes,
        ] = await Promise.all([
          salesRequest("month"),
          salesTrendRequest("month"),
          ticketAverageRequest("month"),
          topProductsRequest(),
          lowStockRequest(10),
          noSalesRequest(30),
        ]);

        setTotalSales(salesRes.data.total);
        setTrend(trendRes.data);    
        setAvgTicket(avgRes.data.total);
        setTopProducts(topRes.data);
        setLowStock(lowRes.data);
        setNoSales(noRes.data);
      } catch {
        toast.error("Error al cargar reportes");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg font-medium text-gray-700">
        Cargando reportes…
      </p>
    );

  const lineData = {
    labels: trend.labels,
    datasets: [
      {
        label: "Ventas diarias",
        data: trend.data,
        fill: true,
        borderColor: "#E96D87",          
        backgroundColor: "rgba(233,109,135,0.2)", 
        tension: 0.3,                  
        pointRadius: 3,
        pointBackgroundColor: "#E96D87",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#67463B", font: { size: 12 } },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#67463B" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#67463B" },
        grid: { color: "#eee" },
      },
    },
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#E96D87] to-[#F9A1B0] space-y-8">
      <h2 className="text-4xl text-white text-center font-[Comic_Neue] mb-4">
        📊 Panel de Reportes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-[#FF9AA2] to-[#FFB7B2] text-white p-6">
          <h3 className="font-bold text-lg">Ventas este mes</h3>
          <p className="mt-2 text-4xl font-extrabold">
            ${totalSales.toFixed(2)}
          </p>
        </Card>

        <Card className="bg-gradient-to-r from-[#FFDAC1] to-[#E2F0CB] text-gray-900 p-6">
          <h3 className="font-bold text-lg">Ticket promedio</h3>
          <p className="mt-2 text-4xl font-extrabold">
            ${avgTicket.toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold text-xl mb-4">
          📈 Tendencia diaria (último mes)
        </h3>
        <Line data={lineData} options={lineOptions} className="h-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">🏆 Top 10 Productos</h3>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E96D87] text-white">
                  <TableCell>Producto</TableCell>
                  <TableCell>Unidades</TableCell>
                  <TableCell>Ingresos</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p) => (
                  <TableRow key={p.nombre}>
                    <TableCell className="font-medium">
                      {p.nombre}
                    </TableCell>
                    <TableCell>{p.totalCantidad ?? 0}</TableCell>
                    <TableCell>${(p.totalIngresos ?? 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">
              ⚠️ Productos bajo stock (&lt;10)
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {lowStock.map((p) => (
                <li key={p.id} className="font-medium">
                  {p.nombre} ({p.stock})
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">
              🚫 Sin ventas (30 días)
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {noSales.map((p) => (
                <li key={p.id}>{p.nombre}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
