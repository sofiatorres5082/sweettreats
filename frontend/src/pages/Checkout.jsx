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
import { getAllPaymentMethodsRequest } from "../api/payments";
import { validateCardLocally } from "../services/cardValidationService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const { cart, clearCart } = useCart();
  const { isAuth, loading } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [useLocalValidation, setUseLocalValidation] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });

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
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0
  );

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const { data } = await getAllPaymentMethodsRequest();
        setPaymentMethods(data);
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message ||
            "No se pudieron cargar los métodos de pago"
        );
      }
    };

    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (!loading && !isAuth) {
      toast.error("Debes iniciar sesión para continuar");
      return navigate("/log-in");
    }

    if (orderDone) return;

    const hasValidProducts = cart.length > 0 && cart.some((i) => i.precioUnitario > 0 && i.cantidad > 0);

    if (!hasValidProducts && !orderDone && !openSuccess) {
      toast.error(
        "El carrito debe tener al menos un producto válido para continuar"
      );
      navigate("/catalogo");
    }
  }, [loading, isAuth, cart, navigate, orderDone, openSuccess]);

  if (loading) {
    return <Spinner />;
  }

  const processPaymentWithStripe = async (data) => {
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
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error("Error en Stripe:", error);
      return { success: false, error: error.message };
    }
  };

  const processPaymentLocally = (data) => {
    // Validar tarjeta con algoritmo de Luhn
    const validation = validateCardLocally(cardData);

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // Si la validación local es exitosa
    toast.info(`Tarjeta ${validation.cardType} validada localmente (modo offline)`);
    return { success: true };
  };

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      let paymentResult;

      // Intentar primero con Stripe si está disponible
      if (!useLocalValidation && stripe && elements) {
        toast.info("Procesando pago con Stripe...");
        paymentResult = await processPaymentWithStripe(data);

        // Si Stripe falla (sin internet u otro error), usar validación local
        if (!paymentResult.success) {
          toast.warning("Stripe no disponible. Usando validación local...");
          setUseLocalValidation(true);
          paymentResult = processPaymentLocally(data);
        }
      } else {
        // Usar validación local directamente
        toast.info("Validando tarjeta localmente...");
        paymentResult = processPaymentLocally(data);
      }

      if (!paymentResult.success) {
        if (paymentResult.errors) {
          paymentResult.errors.forEach((error) => toast.error(error));
        } else {
          toast.error(`Error al procesar el pago: ${paymentResult.error}`);
        }
        return;
      }

      // Crear la orden
      await createOrderRequest({
        direccionEnvio: data.direccion,
        metodoPagoId: Number(data.tipoTarjeta),
        items: cart.map((item) => ({
          productId: item.productId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
      });

      setOrderDone(true);
      toast.success("🍰 Pedido realizado con éxito");
      setOpenSuccess(true);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Hubo un error al procesar el pedido";
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const onError = (formErrors) => {
    console.warn("Errores de validación:", formErrors);
  };

  const hasValidProducts =
    cart.length > 0 &&
    cart.some((item) => item.precioUnitario > 0 && item.cantidad > 0);

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
            {["nombre", "direccion", "telefono", "email"].map((field) => (
              <div key={field} className="mb-4">
                <label htmlFor={field} className="block mb-1 capitalize">
                  {field === "email" ? "Email" : field}
                </label>
                <Controller
                  name={field}
                  control={control}
                  render={({ field }) => (
                    <Input
                      id={field.name}
                      type={field.name === "email" ? "email" : "text"}
                      placeholder={
                        field.name === "direccion"
                          ? "Calle 123, Ciudad, Código Postal, Provincia"
                          : field.name === "email"
                          ? "tu-email@ejemplo.com"
                          : ""
                      }
                      {...field}
                    />
                  )}
                />
                {errors[field] && (
                  <p className="text-red-600 text-sm">
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}

            <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mt-6 mb-4">
              Información de Pago
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
                    <option value="">Selecciona el tipo de tarjeta</option>
                    {paymentMethods.map((pm) => (
                      <option key={pm.id} value={pm.id}>
                        {pm.nombre}
                      </option>
                    ))}
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
              <label htmlFor="nombreTitular" className="block mb-1">
                Nombre del titular
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

            {/* Mostrar CardElement de Stripe o inputs manuales según el modo */}
            {!useLocalValidation && stripe && elements ? (
              <div className="mb-4">
                <label className="block mb-1">Datos de la tarjeta</label>
                <div className="border rounded-md p-3 bg-white">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ingresa el número, fecha de vencimiento y código de seguridad
                </p>
                <button
                  type="button"
                  onClick={() => setUseLocalValidation(true)}
                  className="text-xs text-blue-600 hover:underline mt-2"
                >
                  ¿Sin internet? Usar validación local
                </button>
              </div>
            ) : (
              <div className="mb-4 space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                  <p className="text-xs text-yellow-800">
                    🔒 Modo validación local (sin conexión a internet)
                  </p>
                </div>

                <div>
                  <label className="block mb-1 text-sm">
                    Número de tarjeta
                  </label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    value={cardData.number}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .replace(/(.{4})/g, "$1 ")
                        .trim();
                      setCardData({ ...cardData, number: value });
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block mb-1 text-sm">Mes</label>
                    <Input
                      type="text"
                      placeholder="MM"
                      maxLength="2"
                      value={cardData.expMonth}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          expMonth: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Año</label>
                    <Input
                      type="text"
                      placeholder="AA"
                      maxLength="2"
                      value={cardData.expYear}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          expYear: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">CVV</label>
                    <Input
                      type="text"
                      placeholder="123"
                      maxLength="4"
                      value={cardData.cvv}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          cvv: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                  </div>
                </div>

                {stripe && elements && (
                  <button
                    type="button"
                    onClick={() => setUseLocalValidation(false)}
                    className="text-xs text-blue-600 hover:underline mt-2"
                  >
                    Volver a Stripe
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mb-4">
              Resumen del Pedido
            </h2>

            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div>
                      <span className="font-medium text-sm">
                        {item.nombre}
                      </span>
                      <div className="text-xs text-gray-500">
                        Cantidad: {item.cantidad}
                      </div>
                    </div>
                  </div>
                  <span className="font-medium">
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-lg font-semibold text-[#67463B]">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-4 p-3 bg-blue-50 rounded-md">
              <p>✅ Pago seguro con encriptación SSL</p>
              <p>🚚 Envío a domicilio incluido</p>
              <p>📱 Recibirás confirmación por email</p>
            </div>

            <Button
              type="submit"
              disabled={processing || !hasValidProducts}
              className="w-full bg-[#E96D87] hover:bg-[#d95c74] rounded-3xl text-white font-[Comic_Neue] py-3 disabled:opacity-50"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando pago...
                </div>
              ) : (
                `Pagar $${total.toFixed(2)}`
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-2">
              Al confirmar, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>
      </form>

      {processing && (
        <div className="fixed inset-0 bg-[#FFF6ED] bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg border border-[#E96D87]/20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E96D87]"></div>
            <span className="font-[Comic_Neue] text-[#67463B]">
              Procesando tu pago...
            </span>
          </div>
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
              Gracias por tu compra. Recibirás un email con los detalles de tu
              pedido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex flex-col items-center space-y-2 mt-4 w-full">
              <AlertDialogAction
                className="rounded-xl bg-[#E57F95] text-white hover:bg-pink-700 font-[Comic_Neue] cursor-pointer w-full"
                onClick={async () => {
                  await clearCart();
                  setOpenSuccess(false);
                  navigate("/catalogo");
                }}
              >
                Seguir comprando
              </AlertDialogAction>
              <AlertDialogCancel
                className="rounded-xl bg-white border hover:bg-pink-100 font-[Comic_Neue] cursor-pointer w-full"
                onClick={async () => {
                  await clearCart();
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