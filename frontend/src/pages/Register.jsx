import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import MobileHeader from "@/components/MobileHeader";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const { register, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await register({ name, email, password });
      const user = await checkAuth();
      navigate("/log-in");

    } catch (err) {
      if (err.response?.status === 409) {
        setError("El correo electrónico ya está registrado.");
      } else {
        setError(err.response?.data?.message || "Error al registrarse.");
      }
      throw err;
    }
  };

  return (
    <>
      <MobileHeader />
      <div className="h-screen flex flex-col justify-start items-center bg-[#F9E4CF] px-4 pt-10">
        <Card className="w-[280px] sm:w-[360px] sm:rounded-2xl sm:bg-white/50 border-none bg-transparent shadow-none">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-center mb-2 text-[#67463B]">
              Crear cuenta
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Registrate para comenzar
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#67463B] font-medium">
                  Nombre completo
                </label>
                <Input
                  className="!bg-white !border !border-gray-300 !text-black !placeholder-gray-400 !rounded-lg !px-3 !py-2 !text-sm !shadow-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Tu nombre"
                />
              </div>

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

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[#67463B] font-medium">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Input
                    className="!bg-white !border !border-gray-300 !text-black !placeholder-gray-400 !rounded-lg !px-3 !py-2 !text-sm !pr-10 !shadow-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="mt-2 w-full bg-[#E96D87] border-none rounded-3xl shadow-none"
              >
                Registrarse
              </Button>
            </form>

            <div className="text-center mt-4 text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/log-in"
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Inicia sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
