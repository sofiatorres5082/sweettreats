import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkoutSchema } from "../schemas/checkoutSchema";
import { createOrderRequest } from "@/api/orders";
import { createPaymentIntent } from "../api/payments";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
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
} from "../components/ui/alert-dialog";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const { cart, dispatch } = useCart();
  const { isAuth, loading } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [processing, setProcessing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      nombre: "",
      direccion: "",
      telefono: "",
      email: "",
      tipoTarjeta: "",
      nombreTitular: "",
    },
  });

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  useEffect(() => {
    if (!loading && !isAuth) {
      toast.error("Debes iniciar sesión para continuar");
      return navigate("/log-in");
    }

    if (orderDone) return;

    const hasValidProducts = cart.some((i) => i.precio > 0 && i.cantidad > 0);
    if (!hasValidProducts) {
      toast.error(
        "El carrito debe tener al menos un producto válido para continuar"
      );
      navigate("/catalogo");
    }
  }, [loading, isAuth, cart, navigate, orderDone]);

  if (loading) {
    return <Spinner />;
  }

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      const {
        data: { clientSecret },
      } = await createPaymentIntent(total * 100);

      const cardElement = elements.getElement(CardElement);
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: data.nombreTitular,
            email: data.email,
          },
        },
      });
      if (error) {
        toast.error(`Error al procesar el pago: ${error.message}`);
        return;
      }

      await createOrderRequest({
        direccionEnvio: data.direccion,
        metodoPago: data.tipoTarjeta,
        items: cart.map((item) => ({
          productId: item.id,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
        })),
      });
      dispatch({ type: "CLEAR_CART" });
      setOrderDone(true);
      toast.success("🍰 Pedido realizado con éxito");
      setOpenSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al procesar el pedido");
    } finally {
      setProcessing(false);
    }
  };

  const onError = (formErrors) => {
    console.warn("Errores de validación:", formErrors);
  };

  const hasValidProducts = cart.some(
    (item) => item.precio > 0 && item.cantidad > 0
  );

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="min-h-screen bg-[#FFF6ED] px-4 py-12"
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mb-4">
              Datos de Envío
            </h2>
            {["nombre", "direccion", "telefono"].map((field) => (
              <div key={field} className="mb-4">
                <label htmlFor={field} className="block mb-1 capitalize">
                  {field}
                </label>
                <Controller
                  name={field}
                  control={control}
                  render={({ field }) => <Input id={field} {...field} />}
                />
                {errors[field] && (
                  <p className="text-red-600 text-sm">
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}

            <div className="mb-4">
              <label htmlFor="nombreTitular" className="block mb-1">
                Titular de la tarjeta
              </label>
              <Controller
                name="nombreTitular"
                control={control}
                render={({ field }) => (
                  <Input
                    id="nombreTitular"
                    placeholder="Como aparece en la tarjeta"
                    {...field}
                  />
                )}
              />
              {errors.nombreTitular && (
                <p className="text-red-600 text-sm">
                  {errors.nombreTitular.message}
                </p>
              )}
            </div>

            <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mt-6 mb-4">
              Pago
            </h2>
            <div className="mb-4">
              <label className="block mb-1">Tipo de Tarjeta</label>
              <Controller
                name="tipoTarjeta"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">Selecciona</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                  </select>
                )}
              />
              {errors.tipoTarjeta && (
                <p className="text-red-600 text-sm">
                  {errors.tipoTarjeta.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1">Datos de la tarjeta</label>
              <div className="border rounded-md p-3">
                <CardElement />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mb-4">
              Resumen del Pedido
            </h2>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>
                  {item.nombre} x{item.cantidad}
                </span>
                <span>${item.precio * item.cantidad}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4 flex justify-between text-lg">
              <span>Total:</span>
              <span>${total}</span>
            </div>
            <Button
              type="submit"
              disabled={processing || !stripe || !elements || !hasValidProducts}
              className="mt-6 w-full bg-[#E96D87] rounded-3xl text-white disabled:opacity-50 cursor-pointer"
            >
              {processing ? "Procesando…" : "Confirmar Pedido"}
            </Button>
          </div>
        </div>
      </form>

      {(processing || !stripe || !elements) && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}

      <AlertDialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <AlertDialogTrigger asChild>
          <button className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#FCF8EC] text-[#67463B] p-6 rounded-2xl shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-[Comic_Neue] text-center">
              ¡Pedido realizado con éxito!
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-center">
              Gracias por tu compra. ¿Qué deseas hacer ahora?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex flex-col items-center space-y-2 mt-4 w-full">
              <AlertDialogAction
                className="rounded-xl bg-[#E57F95] text-white hover:bg-pink-700 font-[Comic_Neue] cursor-pointer"
                onClick={() => {
                  setOpenSuccess(false);
                  navigate("/catalogo");
                }}
              >
                Seguir comprando
              </AlertDialogAction>
              <AlertDialogCancel
                className="rounded-xl bg-white border hover:bg-pink-100 font-[Comic_Neue] cursor-pointer"
                onClick={() => {
                  setOpenSuccess(false);
                  navigate("/mis-pedidos");
                }}
              >
                Ver mis pedidos
              </AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
