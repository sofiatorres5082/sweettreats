import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login({ email, password }, {
        withCredentials: true,
      });

      if (user.roles.includes("ADMIN")) {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Credenciales inválidas");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-pink-100 to-violet-200">
      <Card className="w-[350px] shadow-xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
            <Input
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="mt-2 w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
