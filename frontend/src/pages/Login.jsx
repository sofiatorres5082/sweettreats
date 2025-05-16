import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas/AuthSchema";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(
        { email: data.email, password: data.password },
        { withCredentials: true }
      );
      if (user?.data?.roles?.some((r) => r.roleEnum === "ADMIN")) {
        navigate("/dashboard");
      } else {
        navigate(from);
      }
    } catch (err) {
      alert(err.message || "Credenciales inválidas");
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
            ¡Bienvenido de nuevo!
          </h2>

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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E96D87] text-white"
          >
            Entrar
          </Button>

          <div className="text-center text-sm">
            ¿No tienes cuenta?{" "}
            <Link to="/sign-up" className="text-blue-500 hover:underline">
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
