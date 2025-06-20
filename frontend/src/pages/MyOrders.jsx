// src/pages/MyOrders.jsx

import { useEffect, useState } from "react";
import { getUserOrdersRequest, cancelOrderRequest } from "../api/orders";
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

  const capitalize = (str = "") =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const lastIdx = currentPage * ordersPerPage;
  const firstIdx = lastIdx - ordersPerPage;
  const currentOrders = orders.slice(firstIdx, lastIdx);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  if (loading) return <Spinner />;

  if (!loading && orders.length === 0) {
    return (
      <>
        <MobileHeader />
        <div className="min-h-screen bg-[#F9E4CF] flex flex-col justify-center items-center text-center px-4">
          <h2 className="font-[Comic_Neue] text-2xl font-bold text-[#67463B] mb-4">
            ¡Aún no hiciste ningún pedido!
          </h2>
          <p className="font-[Comic_Neue] text-[#67463B] mb-6">
            ¿Qué esperás para probar tu primer pastel delicioso? 🍰✨
          </p>
          <Button
            className="bg-[#E96D87] hover:bg-[#d6627a] text-white font-[Comic_Neue] rounded-full px-6 py-2"
            onClick={() => (window.location.href = "/catalogo")}
          >
            Ir al catálogo
          </Button>
        </div>
      </>
    );
  }

  const handleCancel = async (orderId) => {
    try {
      await cancelOrderRequest(orderId);
      toast.success("Pedido cancelado correctamente");
      setLoading(true);
      const res = await getUserOrdersRequest();
      setOrders(res.data);
    } catch {
      toast.error("No se pudo cancelar el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MobileHeader />
      <div className="min-h-screen bg-[#F9E4CF] px-4 pt-16 pb-8">
        <h2 className="font-[Comic_Neue] text-2xl font-bold mb-6 text-[#67463B] text-center">
          Mis pedidos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {currentOrders.map((order, idx) => {
            const number = (currentPage - 1) * ordersPerPage + idx + 1;
            return (
              <Card
                key={order.id}
                className="bg-[#FFF7E9] border-none shadow-lg rounded-xl"
              >
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-[Comic_Neue] font-semibold text-[#67463B]">
                      Pedido #{number}
                    </span>
                    <span className="font-[Comic_Neue] font-semibold text-[#67463B]">
                      ${order.total?.toFixed(2)}
                    </span>
                  </div>
                  <p className="font-[Comic_Neue] text-[#67463B]">
                    Fecha: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`${getStatusColor(
                        order.estado
                      )} px-3 py-1 rounded-full text-sm font-[Comic_Neue]`}
                    >
                      {capitalize(order.estado)}
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          onClick={() => setSelected(order)}
                          className="bg-[#E96D87] hover:bg-[#d6627a] text-white font-[Comic_Neue] font-semibold px-4 py-1 rounded-full cursor-pointer"
                        >
                          Detalles
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#FCF8EC] p-6 rounded-2xl max-w-md mx-auto">
                        <AlertDialogHeader className="mb-4">
                          <AlertDialogTitle className="text-lg font-[Comic_Neue] font-bold text-[#67463B] mb-2 text-center">
                            Detalles Pedido #{number}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-[Comic_Neue] text-[#67463B] text-center">
                            Información completa de tu pedido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="font-[Comic_Neue] text-[#67463B] space-y-2">
                          <p>
                            <strong>Dirección:</strong>{" "}
                            {selected?.direccionEnvio}
                          </p>
                          <p>
                            <strong>Pago:</strong>{" "}
                            {capitalize(selected?.metodoPago)}
                          </p>
                          <ul className="mt-4 space-y-2">
                            {selected?.detalles.map((d) => (
                              <li
                                key={d.productId}
                                className="flex justify-between border-b border-gray-200 pb-1"
                              >
                                {d.productName} x{d.cantidad}
                                <span>
                                  ${(d.precioUnitario * d.cantidad).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Botón “Cancelar pedido” solo si está en PENDIENTE */}
                        {selected?.estado === "PENDIENTE" && (
                          <div className="mt-4 flex justify-center">
                            <Button
                              onClick={() => handleCancel(selected.id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-[Comic_Neue] rounded-full px-6 py-2 cursor-pointer"
                            >
                              Cancelar pedido
                            </Button>
                          </div>
                        )}

                        <AlertDialogFooter className="mt-6">
                          <div className="flex justify-center gap-4 w-full">
                            <AlertDialogCancel
                              onClick={() => setSelected(null)}
                              className="bg-[#E96D87] hover:bg-[#d6627a] text-white rounded-full px-6 py-2 font-[Comic_Neue] cursor-pointer"
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
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-[Comic_Neue] ${
                  currentPage === n
                    ? "bg-[#E96D87] text-white cursor-pointer"
                    : "bg-white text-[#67463B] cursor-pointer"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
