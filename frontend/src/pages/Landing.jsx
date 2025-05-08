import MobileHeader from "../components/MobileHeader";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#F9E4CF]">
      <MobileHeader />

      <main className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl font-bold text-[#67463B] mb-4">SweetTreats</h2>
        <p className="text-lg text-[#67463B] mb-6">
        Descubre nuestra selección de cupcakes, pasteles y más, hechos para disfrutar en cualquier momento.
        </p>
        <Button
          className="bg-[#E96D87] hover:bg-[#f08199] font-[Comic_Neue] font-semibold text-white rounded-full px-6 py-2 cursor-pointer"
          onClick={() => navigate("/catalogo")}
        >
          Nuestro catálogo 
        </Button>
      </main>
    </div>
  );
}
