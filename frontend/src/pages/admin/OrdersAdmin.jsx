import { useEffect, useState } from "react";
import {
  getAllOrdersRequest,
  getOrderAdminByIdRequest,
  updateOrderStatusRequest,
} from "../../api/admin";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

const STATE_LABELS = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const validTransitions = {
  PENDIENTE: ["EN_PROCESO", "CANCELADO"],
  EN_PROCESO: ["ENTREGADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  async function fetchOrders(p = 0) {
    setLoading(true);
    try {
      const { data } = await getAllOrdersRequest(p, size);
      setOrders(data.content);
      setTotal(data.totalPages);
      setPage(data.number);
    } catch {
      toast.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const openView = async (id) => {
    try {
      const { data } = await getOrderAdminByIdRequest(id);
      setViewingOrder(data);
    } catch {
      toast.error("No se pudo cargar el detalle");
    }
  };

  const openEdit = (order) => {
    setEditingOrder(order);
  };

  const onEditSubmit = async ({ estado }) => {
    try {
      await updateOrderStatusRequest(editingOrder.id, { estado });
      toast.success("Estado actualizado");
      setEditingOrder(null);
      fetchOrders(page);
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#E96D87] to-[#F9A1B0]">
      <h2 className="text-3xl text-white text-center mb-8 font-[Comic_Neue]">
        Gestión de Pedidos
      </h2>

      <div className="overflow-auto bg-white rounded-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E96D87] text-white text-center">
              <TableCell>ID</TableCell>
              <TableCell>Email Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Cargando…</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No hay pedidos.</TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow
                  key={o.id}
                  className="hover:bg-gray-50 font-[Nunito] text-base text-center"
                >
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{o.email}</TableCell>
                  <TableCell>${o.total.toFixed(2)}</TableCell>
                  <TableCell>{STATE_LABELS[o.estado]}</TableCell>
                  <TableCell>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <AlertDialog
                      open={viewingOrder?.id === o.id}
                      onOpenChange={(open) => !open && setViewingOrder(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-[#3690e4] text-white cursor-pointer"
                          onClick={() => openView(o.id)}
                        >
                          Ver detalle
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-lg bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-center">
                            Pedido #{o.id}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm text-center">
                            {new Date(o.createdAt).toLocaleString()}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        {viewingOrder?.detalles && (
                          <div className="p-4 space-y-4">
                            <p>
                              <strong>Envío:</strong>{" "}
                              {viewingOrder.direccionEnvio}
                            </p>
                            <p>
                              <strong>Pago:</strong> {viewingOrder.metodoPago}
                            </p>
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-[#E96D87] text-white">
                                  <TableCell>Producto</TableCell>
                                  <TableCell>Cantidad</TableCell>
                                  <TableCell>Precio U.</TableCell>
                                  <TableCell>Subtotal</TableCell>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {viewingOrder.detalles.map((d) => (
                                  <TableRow key={d.productId}>
                                    <TableCell>{d.productName}</TableCell>
                                    <TableCell>{d.cantidad}</TableCell>
                                    <TableCell>
                                      ${d.precioUnitario.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                      $
                                      {(d.precioUnitario * d.cantidad).toFixed(
                                        2
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <p className="text-right font-bold">
                              Total: ${viewingOrder.total.toFixed(2)}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-center mt-4">
                          <AlertDialogCancel className={"cursor-pointer"}>
                            Cerrar
                          </AlertDialogCancel>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog open={editingOrder?.id === o.id}>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-[#E96D87] text-white cursor-pointer"
                          onClick={() => openEdit(o)}
                        >
                          Editar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-center">
                            Editar Estado #{o.id}
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const newEstado =
                              e.currentTarget.elements.estado.value;
                            onEditSubmit({ estado: newEstado });
                          }}
                          className="p-4 space-y-4"
                        >
                          <label className="block mb-1">Estado</label>

                          {validTransitions[o.estado].length > 0 ? (
                            <Select name="estado" defaultValue="">
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={STATE_LABELS[o.estado]}
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-[#FCF8EC] text-[#67463B]">
                                {validTransitions[o.estado].map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {STATE_LABELS[opt]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Select
                              name="estado"
                              disabled
                              defaultValue={o.estado}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue>
                                  {STATE_LABELS[o.estado]}
                                </SelectValue>
                              </SelectTrigger>
                            </Select>
                          )}

                          <div className="flex justify-center space-x-2 mt-4">
                            <AlertDialogCancel
                              className={"cursor-pointer"}
                              onClick={() => setEditingOrder(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            {validTransitions[o.estado].length > 0 && (
                              <AlertDialogAction asChild>
                                <button
                                  type="submit"
                                  className="bg-[#E96D87] text-white px-4 py-2 rounded cursor-pointer"
                                >
                                  Guardar
                                </button>
                              </AlertDialogAction>
                            )}
                          </div>
                        </form>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center mt-6 space-x-6 text-white font-[Nunito] text-base">
        <Button
          size="sm"
          className="cursor-pointer bg-white text-[#E96D87] border-none shadow-md font-[Nunito] px-4 py-2 hover:bg-gray-100 transition"
          disabled={page === 0}
          onClick={() => fetchUsers(page - 1)}
        >
          ← Anterior
        </Button>

        <span className="px-3 py-1 bg-[#E96D87] text-white font-semibold shadow-sm">
          Página {page + 1} de {totalPages}
        </span>

        <Button
          size="sm"
          className="cursor-pointer bg-white text-[#E96D87] border-none shadow-md font-[Nunito] px-4 py-2 hover:bg-gray-100 transition"
          disabled={page + 1 === totalPages}
          onClick={() => fetchUsers(page + 1)}
        >
          Siguiente →
        </Button>
      </div>
    </div>
  );
}
