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
      <div className="h-screen flex flex-col items-center bg-[#F9E4CF] px-4 pt-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white p-6 rounded-xl space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-[#67463B]">
            Crear cuenta
          </h2>

          <div>
            <label className="block text-sm font-medium text-[#67463B]">
              Nombre completo
            </label>
            <Input
              placeholder="Tu nombre"
              {...register("name")}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#67463B]">
              Email
            </label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#67463B]">
              Contraseña
            </label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#67463B]">
              Confirmar contraseña
            </label>
            <div className="relative mt-1">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E96D87] text-white"
          >
            Registrarse
          </Button>

          <div className="text-center text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link to="/log-in" className="text-blue-500 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
