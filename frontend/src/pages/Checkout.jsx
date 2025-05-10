import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

// regex para validar email, teléfono y cvv
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{7,15}$/; // entre 7 y 15 dígitos
const cvvRegex = /^\d{3,4}$/;     // 3 o 4 dígitos para CVV
const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/AA

// Función para validar Luhn
function isValidCardNumber(value) {
  const digits = value.replace(/\D/g, "");
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

const isValidExpirationDate = (input) => {
  if (!expRegex.test(input)) return false;
  const [monthStr, yearStr] = input.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt("20" + yearStr, 10);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
};

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
  const [errors, setErrors] = useState({});

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

  // Validaciones inline
  const validateField = (name, value) => {
    let error;
    if (!value) {
      error = "Este campo es obligatorio";
    } else {
      switch (name) {
        case 'email':
          if (!emailRegex.test(value)) error = 'Email inválido';
          break;
        case 'telefono':
          if (!phoneRegex.test(value)) error = 'Teléfono inválido';
          break;
        case 'numero':
          if (!isValidCardNumber(value)) error = 'Tarjeta inválida';
          break;
        case 'cvv':
          if (!cvvRegex.test(value)) error = 'CVV inválido';
          break;
        case 'vencimiento':
          if (!isValidExpirationDate(value)) error = 'Vencimiento inválido o expirado';
          break;
        default:
          break;
      }
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (['email','telefono','numero','cvv','vencimiento'].includes(name)) {
      validateField(name, value);
    }
  };

  const isFormValid = () => {
    const fields = Object.keys(form);
    const missing = fields.some(key => !form[key]);
    const hasErrors = Object.values(errors).some(err => err);
    return !missing && !hasErrors;
  };

  const handleConfirm = () => {
    if (!isFormValid()) {
      toast.error("Revisa los errores del formulario antes de continuar");
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
          <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mb-4">Datos de Envío</h2>
          {['nombre','direccion','telefono','email'].map(field => (
            <div key={field} className="mb-4">
              <label htmlFor={field} className="block mb-1 capitalize">{field}</label>
              <Input
                id={field} name={field}
                value={form[field]} onChange={handleChange}
                onBlur={() => validateField(field, form[field])}
              />
              {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
            </div>
          ))}

          <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mt-6 mb-4">Pago</h2>
          <div className="mb-4">
            <label className="block mb-1">Tipo de Tarjeta</label>
            <select
              name="tipoTarjeta" value={form.tipoTarjeta}
              onChange={handleChange}
              onBlur={() => validateField('tipoTarjeta', form.tipoTarjeta)}
            >
              <option value="">Selecciona</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
            </select>
            {errors.tipoTarjeta && <p className="text-red-600 text-sm">{errors.tipoTarjeta}</p>}
          </div>

          {['nombreTitular','numero','vencimiento','cvv'].map(field => (
            <div key={field} className="mb-4">
              <label htmlFor={field} className="block mb-1 capitalize">{field}</label>
              <Input
                id={field} name={field}
                value={form[field]} onChange={handleChange}
                onBlur={() => validateField(field, form[field])}
              />
              {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
            </div>
          ))}
        </div>

        {/* Resumen y botón */}
        <div>
          <h2 className="text-[#67463B] font-[Comic_Neue] text-2xl mb-4">Resumen del Pedido</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.nombre} x{item.cantidad}</span>
              <span>${item.precio * item.cantidad}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 flex justify-between text-lg">
            <span>Total:</span><span>${total}</span>
          </div>

          <Button
            disabled={!isFormValid()}
            className="mt-6 w-full bg-[#E96D87] border-none rounded-3xl shadow-none cursor-pointer disabled:opacity-50 text-white"
            onClick={handleConfirm}
          >Confirmar Pedido</Button>
        </div>
      </div>
    </div>
  );
}
