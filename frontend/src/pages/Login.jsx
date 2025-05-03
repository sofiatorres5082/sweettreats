import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

export default function Login() {
    const { loginRequest } = useAuth();
    const [email, setEmail] = useState("");
    const [passw, setPassw] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
  
      const res = await loginRequest({ email, password: passw });
  
      if (res.status === 200) {
        return navigate("/home");
      }
  
      setError(res.response?.data?.message || "Error al iniciar sesión");

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
                value={passw}
                onChange={(e) => setPassw(e.target.value)}
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