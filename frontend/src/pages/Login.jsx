import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const from = location.state?.from || "/catalogo";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login({ email, password });
      if (user) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Credenciales inválidas");
    }
  };

  return (
    <>
      <MobileHeader />
      <div className="h-screen flex flex-col justify-start items-center bg-[#F9E4CF] px-4 pt-16">
        <Card className="w-[280px] sm:w-[360px] sm:rounded-2xl sm:bg-white/50 border-none bg-transparent shadow-none">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-center mb-2 text-[#67463B]">
              ¡Bienvenido de nuevo!
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Inicia sesión para continuar
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#67463B] font-medium">
                  Email
                </label>
                <Input
                  className="!bg-white !border !border-gray-300 !text-black !placeholder-gray-400 !rounded-lg !px-3 !py-2 !text-sm !shadow-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#67463B] font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    className="!bg-white !border !border-gray-300 !text-black !placeholder-gray-400 !rounded-lg !px-3 !py-2 !text-sm !pr-10 !shadow-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="mt-2 w-full bg-[#E96D87] border-none rounded-3xl shadow-none cursor-pointer"
              >
                Entrar
              </Button>
            </form>

            <div className="text-center mt-4">
              <a href="#" className="text-sm text-blue-500 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                to="/sign-up"
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Regístrate
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
