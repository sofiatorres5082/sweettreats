import { useEffect, useState } from "react";
import { getUserOrdersRequest } from "../api/orders";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MobileHeader from "../components/MobileHeader";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import Spinner from "../components/Spinner";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getUserOrdersRequest();
        setOrders(res.data);
      } catch {
        toast.error("Error al cargar pedidos");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "entregado":
        return "bg-green-400 text-green-800";
      case "pendiente":
        return "bg-blue-300 text-blue-800";
      case "cancelado":
        return "bg-red-300 text-red-800";
      case "en proceso":
        return "bg-yellow-300 text-yellow-800";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Spinner fullscreen />;

  return (
    <>
      <MobileHeader />
      <div className="min-h-screen bg-[#F9E4CF] px-4 pt-16 pb-8">
        <h2 className="font-[Comic_Neue] text-2xl font-bold mb-6 text-[#67463B] text-center">
          Mis pedidos
        </h2>
        <div className="space-y-3 max-w-md mx-auto">
          {currentOrders.map((order) => (
            <Card
              key={order.id}
              className="bg-[#FFF7E9] border-none shadow-none rounded-xl"
            >
              <CardContent>
                <div className="flex justify-between items-center mb-1">
                  <div className="font-[Comic_Neue] font-semibold text-[#67463B]">
                    Pedido #{order.id}
                  </div>
                  <div className="font-[Comic_Neue] font-semibold text-[#67463B]">
                    ${order.total}
                  </div>
                </div>
                <div className="font-[Comic_Neue] text-base text-[#67463B] mb-2">
                  Fecha: {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="flex justify-between items-center">
                  <div
                    className={`${getStatusColor(
                      order.estado
                    )} px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {order.estado}
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={() => setSelected(order)}
                        className="bg-[#E96D87] hover:bg-[#d6627a] text-white font-[Comic_Neue] font-semibold px-5 py-1 rounded-full"
                      >
                        Detalles
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="bg-[#FCF8EC] p-8 rounded-2xl max-w-lg w-full">
                      <AlertDialogHeader className="mb-4">
                        <AlertDialogTitle className="text-xl font-[Comic_Neue] font-bold text-[#67463B] mb-3 text-center">
                          Detalles Pedido #{selected?.id}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="mb-4 font-[Comic_Neue] text-[#67463B] text-center">
                          Aquí puedes ver la información completa de tu pedido.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="font-[Comic_Neue] text-[#67463B]">
                        <p className="mb-2">
                          <strong>Dirección:</strong> {selected?.direccionEnvio}
                        </p>
                        <p className="mb-3">
                          <strong>Método de pago:</strong>{" "}
                          {selected?.metodoPago && capitalizeFirstLetter(selected.metodoPago)}
                        </p>
                        <ul className="mt-5 space-y-3">
                          {selected?.detalles.map((d) => (
                            <li
                              key={d.productId}
                              className="flex justify-between border-b border-gray-100 pb-2"
                            >
                              <span>
                                {d.productName} x{d.cantidad}
                              </span>
                              <span>${d.precioUnitario * d.cantidad}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <AlertDialogFooter className="mt-6">
                        <div className="flex justify-center w-full">
                          <AlertDialogCancel
                            onClick={() => setSelected(null)}
                            className="bg-[#E96D87] hover:bg-[#d6627a] text-white rounded-xl px-6 py-2 font-[Comic_Neue] font-semibold"
                          >
                            Cerrar
                          </AlertDialogCancel>
                        </div>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                      currentPage === number
                        ? "bg-[#E96D87] text-white"
                        : "bg-white text-[#67463B]"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}