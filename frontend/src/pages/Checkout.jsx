import { useCart } from "../context/CartContext";
import { useEffect } from "react";
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
import { useState } from "react";
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

export default function Checkout() {
  const { cart, dispatch } = useCart();
  const { isAuth, loading } = useAuth();
  const navigate = useNavigate();
  const [openSuccess, setOpenSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      nombre: "",
      direccion: "",
      telefono: "",
      email: "",
      tipoTarjeta: "",
      nombreTitular: "",
      numero: "",
      vencimiento: "",
      cvv: "",
    },
  });

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  useEffect(() => {
    if (!loading && !isAuth) {
      toast.error("Debes iniciar sesión para continuar");
      navigate("/log-in");
    }
  }, [loading, isAuth, navigate]);

  if (loading) return <Spinner fullScreen />;

  const onSubmit = async (data) => {
    const payload = {
      direccionEnvio: data.direccion,
      metodoPago: data.tipoTarjeta,
      items: cart.map((item) => ({
        productId: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      })),
    };

    try {
      await createOrderRequest(payload);
      dispatch({ type: "CLEAR_CART" });
      toast.success("🍰 Pedido realizado con éxito");
      setOpenSuccess(true);
    } catch {
      toast.error("Hubo un error al crear el pedido");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen bg-[#FFF6ED] px-4 py-12"
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Envío + Pago */}
          <div>
            <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mb-4">
              Datos de Envío
            </h2>
            {["nombre", "direccion", "telefono", "email"].map((field) => (
              <div key={field} className="mb-4">
                <label htmlFor={field} className="block mb-1 capitalize">
                  {field}
                </label>
                <Controller
                  name={field}
                  control={control}
                  render={({ field }) => <Input id={field.name} {...field} />}
                />
                {errors[field] && (
                  <p className="text-red-600 text-sm">
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}

            <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mt-6 mb-4">
              Pago
            </h2>
            <div className="mb-4">
              <label htmlFor="tipoTarjeta" className="block mb-1">
                Tipo de Tarjeta
              </label>
              <Controller
                name="tipoTarjeta"
                control={control}
                render={({ field }) => (
                  <select
                    id="tipoTarjeta"
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

            {["nombreTitular", "numero", "vencimiento", "cvv"].map((field) => (
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
          </div>

          {/* Resumen + Botón */}
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
              disabled={!isValid}
              className="mt-6 w-full bg-[#E96D87] rounded-3xl disabled:opacity-50 text-white"
            >
              Confirmar Pedido
            </Button>
          </div>
        </div>
      </form>

      <AlertDialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <AlertDialogTrigger asChild>
          {/* Botón invisible para disparar el diálogo programáticamente */}
          <button className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1] p-6 rounded-2xl shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-[Comic_Neue] text-center">
              ¡Pedido realizado con éxito!
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 font-[Comic_Neue] text-center">
              Gracias por tu compra. ¿Qué deseas hacer ahora?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="">
            <div className="flex flex-col items-center space-y-2 mt-4 w-full">
              <AlertDialogAction
                className="rounded-xl bg-[#E57F95] text-white hover:bg-pink-700 font-[Comic_Neue]"
                onClick={() => {
                  setOpenSuccess(false);
                  navigate("/catalogo");
                }}
              >
                Seguir comprando
              </AlertDialogAction>
              <AlertDialogCancel
                className="rounded-xl bg-white border hover:bg-pink-100 font-[Comic_Neue]"
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
