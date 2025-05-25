import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../schemas/AuthSchema";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";

export default function Register() {
  const { register: signup } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate("/log-in");
    } catch (err) {
      alert(
        err.response?.status === 409
          ? "El correo ya está en uso"
          : "Error al registrarse"
      );
    }
  };

  return (
    <>
      <MobileHeader />
    <div className="min-h-screen flex flex-col items-center bg-[#F9E4CF] px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="font-[Comic_Neue] text-2xl font-bold text-[#67463B]">
                Crear cuenta
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="font-[Comic_Neue] block text-sm font-semibold text-[#67463B] mb-2">
                  Nombre completo
                </label>
                <Input
                  placeholder="Tu nombre"
                  {...register("name")}
                  className="font-[Comic_Neue] w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E96D87] bg-gray-50"
                />
                {errors.name && (
                  <p className="font-[Comic_Neue] text-red-500 text-sm mt-2 ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="font-[Comic_Neue] block text-sm font-semibold text-[#67463B] mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("email")}
                  className="font-[Comic_Neue] w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E96D87] bg-gray-50"
                />
                {errors.email && (
                  <p className="font-[Comic_Neue] text-red-500 text-sm mt-2 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="font-[Comic_Neue] block text-sm font-semibold text-[#67463B] mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="font-[Comic_Neue] w-full px-4 py-3 pr-11 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E96D87] bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E96D87] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="font-[Comic_Neue] text-red-500 text-sm mt-2 ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="font-[Comic_Neue] block text-sm font-semibold text-[#67463B] mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className="font-[Comic_Neue] w-full px-4 py-3 pr-11 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E96D87] bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#E96D87] transition-colors"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="font-[Comic_Neue] text-red-500 text-sm mt-2 ml-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="font-[Comic_Neue] font-semibold bg-[#E96D87] hover:bg-[#bb6678] text-white rounded-3xl w-full py-3"
              >
                Registrarse
              </Button>

              <div className="text-center text-sm">
                <p className="font-[Comic_Neue] text-[#67463B]">
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/log-in" className="text-[#E96D87] hover:underline font-semibold">
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
