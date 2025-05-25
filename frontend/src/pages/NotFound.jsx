import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9E4CF] text-center px-4">
      <h1 className="text-6xl font-bold text-[#E96D87] mb-4 font-[Comic_Neue]">
        404
      </h1>
      <p className="text-xl text-[#67463B] mb-6 font-[Comic_Neue] font-semibold">
        La página que buscás no existe... pero aún podés encontrar algo dulce 🍰
      </p>
      <Button
        onClick={() => navigate("/")}
        className="bg-[#E96D87] hover:bg-[#d6627a] text-white font-[Comic_Neue] rounded-full px-6 py-2"
      >
        Volver al inicio
      </Button>
    </div>
  );
}
