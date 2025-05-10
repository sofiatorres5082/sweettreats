import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function Checkout() {
  const { cart, dispatch } = useCart();
  const { isAuth, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    tipoTarjeta: "",
    nombreTitular: "",
    numero: "",
    vencimiento: "",
    cvv: "",
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    const camposFaltantes = Object.entries(form).filter(([_, valor]) => !valor);
    if (camposFaltantes.length > 0) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    dispatch({ type: "CLEAR_CART" });
    toast.success("🍰 Pedido realizado con éxito");
    navigate("/success");
  };

  return (
    <div className="min-h-screen bg-[#FFF6ED] px-4 py-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Formulario de Envío + Pago */}
        <div>
          <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mb-4">
            Datos de Envío
          </h2>
          {["nombre", "direccion", "telefono", "email"].map((field) => (
            <div className="mb-4" key={field}>
              <label
                htmlFor={field}
                className="block mb-1 text-[#67463B] capitalize font-[Comic_Neue]"
              >
                {field}
              </label>
              <Input
                id={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mt-6 mb-4">
            Pago
          </h2>
          <div className="mb-4">
            <label className="block mb-1 text-[#67463B] font-[Comic_Neue]">
              Tipo de Tarjeta
            </label>
            <select
              name="tipoTarjeta"
              value={form.tipoTarjeta}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Selecciona</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
            </select>
          </div>

          {["nombreTitular", "numero", "vencimiento", "cvv"].map((field) => (
            <div className="mb-4" key={field}>
              <label
                htmlFor={field}
                className="block mb-1 text-[#67463B] capitalize font-[Comic_Neue]"
              >
                {field}
              </label>
              <Input
                id={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div>
          <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mb-4">
            Resumen del Pedido
          </h2>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between mb-2 font-[Comic_Neue] text-[#67463B]"
            >
              <span>
                {item.nombre} x{item.cantidad}
              </span>
              <span>${item.precio * item.cantidad}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 flex justify-between text-lg font-[Comic_Neue] text-[#67463B]">
            <span>Total:</span>
            <span>${total}</span>
          </div>

          <Button
            className="mt-6 w-full bg-[#E96D87] hover:bg-[#d95c74] text-white font-[Comic_Neue] rounded-2xl"
            onClick={handleConfirm}
          >
            Confirmar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}
