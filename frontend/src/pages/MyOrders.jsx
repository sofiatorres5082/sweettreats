import { useEffect, useState } from 'react';
import { getUserOrdersRequest } from '../api/orders';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import MobileHeader from '../components/MobileHeader';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getUserOrdersRequest();
        setOrders(res.data);
      } catch {
        toast.error('Error al cargar pedidos');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div>Cargando pedidos...</div>;

  return (
    <div className="min-h-screen bg-[#FFF6ED] px-4 py-12">
      <MobileHeader />
      <h2 className="text-2xl font-semibold mb-6 text-[#67463B] text-center">
        Mis Pedidos
      </h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        {orders.map(order => (
          <Card key={order.id} className="bg-white">
            <CardContent className="flex justify-between items-center">
              <div>
                <p><strong>Pedido #{order.id}</strong></p>
                <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Estado: {order.estado}</p>
                <p>Total: ${order.total}</p>
              </div>

              {/* Trigger con AlertDialogTrigger */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={() => setSelected(order)}
                    className="bg-[#E96D87] text-white"
                  >
                    Ver detalles
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-white p-6 rounded-2xl max-w-lg w-full">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold text-[#67463B] mb-2">
                      Detalles Pedido #{selected?.id}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="mb-4">
                      Aquí puedes ver la información completa de tu pedido.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div>
                    <p><strong>Dirección:</strong> {selected?.direccionEnvio}</p>
                    <p><strong>Método de pago:</strong> {selected?.metodoPago}</p>
                    <ul className="mt-4 space-y-2">
                      {selected?.detalles.map(d => (
                        <li key={d.productId} className="flex justify-between">
                          <span>{d.productName} x{d.cantidad}</span>
                          <span>${d.precioUnitario * d.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <AlertDialogFooter>
                    <div className="flex justify-end w-full">
                      <AlertDialogCancel
                        onClick={() => setSelected(null)}
                        className="bg-[#705D44] text-white rounded-2xl px-4 py-2"
                      >
                        Cerrar
                      </AlertDialogCancel>
                    </div>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
