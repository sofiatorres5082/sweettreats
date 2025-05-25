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
  const [serverError, setServerError] = useState(""); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setServerError("");
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
      const msg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "Credenciales inválidas";

      setServerError(msg);
    }
  };

  return (
    <>
      <MobileHeader />
      <div className="min-h-screen flex flex-col items-center bg-[#F9E4CF] px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border-none shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="font-[Comic_Neue] text-2xl font-bold text-[#67463B] mb-2">
                ¡Bienvenido de nuevo!
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="font-[Comic_Neue] block text-sm font-semibold text-[#67463B] mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("email")}
                  className="font-[Comic_Neue] w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E96D87] focus:border-transparent bg-gray-50"
                />
                {errors.email && (
                  <p className="font-[Comic_Neue] text-red-500 text-sm mt-2 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-[Comic_Neue] block text-sm font-semibold text-[#67463B] mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="font-[Comic_Neue] w-full px-4 py-3 pr-11 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E96D87] focus:border-transparent bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
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

              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="font-[Comic_Neue] text-red-600 text-sm text-center">
                    {serverError}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="font-[Comic_Neue] font-semibold bg-[#E96D87] hover:bg-[#bb6678] text-white rounded-3xl w-full py-3"
              >
                Entrar
              </Button>

              <div className="text-center">
                <p className="font-[Comic_Neue] text-sm text-[#67463B]">
                  ¿No tienes cuenta?{" "}
                  <Link
                    to="/sign-up"
                    className="text-[#E96D87] hover:underline font-semibold"
                  >
                    Regístrate
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
