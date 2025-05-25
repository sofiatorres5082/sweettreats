import React from "react";
import MobileHeader from "../components/MobileHeader";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import cupcakeIcon from "../assets/images/cupcake-icon.png";
import tartaIcon from "../assets/images/tarta-icon.png";
import pastelIcon from "../assets/images/pastel-icon.png";
import heartIcon from "../assets/images/hearts-icon.png";
import dessertIcon from "../assets/images/dessert-icon.png";
import strawberryIcon from "../assets/images/strawberry-icon.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9E4CF] relative overflow-hidden flex flex-col">
      <MobileHeader />

      <div className="absolute inset-0 pointer-events-none">
        <img
          src={heartIcon}
          alt=""
          className="absolute w-10 h-10 md:w-25 md:h-25 top-[10%] left-[5%] animate-starFloat opacity-80"
        />
        <img
          src={strawberryIcon}
          alt=""
          className="absolute w-8 h-8 md:w-15 md:h-15 top-[25%] left-[20%] animate-starPulse opacity-70"
        />
        <img
          src={dessertIcon}
          alt=""
          className="absolute w-7 h-7 md:w-20 md:h-20 top-[40%] left-[8%] animate-starTwinkle opacity-60"
        />
        <img
          src={heartIcon}
          alt=""
          className="absolute w-9 h-9 md:w-25 md:h-25 top-[60%] left-[18%] animate-starSpin opacity-50"
        />
        <img
          src={dessertIcon}
          alt=""
          className="absolute w-12 h-12 md:w-20 md:h-20 top-[15%] right-[8%] animate-starFloat opacity-80"
        />
        <img
          src={strawberryIcon}
          alt=""
          className="absolute w-10 h-10 md:w-13 md:h-13 top-[35%] right-[25%] animate-starPulse opacity-70 -scale-x-100"
        />

        <img
          src={heartIcon}
          alt=""
          className="absolute w-8 h-8 md:w-25 md:h-25 top-[55%] right-[10%] animate-starTwinkle opacity-60"
        />
        <img
          src={heartIcon}
          alt=""
          className="absolute w-7 h-7 md:w-25 md:h-25 top-[75%] right-[20%] animate-starSpin opacity-50"
        />
      </div>

      <main className="flex flex-col items-center justify-center text-center px-6 py-20 relative z-10 flex-grow">
        <h1
          className="text-5xl md:text-7xl font-medium font-[Marimpa] text-[#67463B] mb-4 tracking-wide animate-fadeInUp"
          role="banner"
          aria-label="SweetTreats - Pastelería artesanal"
        >
          Sweet<span className="text-[#E96D87]">Treats</span>
        </h1>

        <p className="max-w-lg text-lg md:text-xl text-[#67463B] leading-relaxed font-[Comic_Neue] mb-16">
          Descubre nuestra{" "}
          <span className="text-[#E96D87] font-semibold">
            deliciosa selección
          </span>{" "}
          de cupcakes, pasteles y tartas artesanales, creados con amor para{" "}
          <span className="text-[#E96D87] font-semibold">endulzar</span> cada
          momento especial.
        </p>

        <Button
          className="font-[Comic_Neue] font-semibold bg-[#E96D87] hover:bg-[#f08199] text-white rounded-full px-8 py-4 transition-transform hover:scale-105 shadow-md mb-16"
          onClick={() => navigate("/catalogo")}
        >
          Explorar Catálogo
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          {[
            {
              icon: pastelIcon,
              alt: "Pastel",
              title: "Pasteles Artesanales",
              text: "Hechos con ingredientes frescos y naturales",
            },
            {
              icon: cupcakeIcon,
              alt: "Cupcake",
              title: "Cupcakes Únicos",
              text: "Sabores exclusivos para cada ocasión",
            },
            {
              icon: tartaIcon,
              alt: "Tarta",
              title: "Tartas Especiales",
              text: "Perfectas para celebraciones memorables",
            },
          ].map(({ icon, alt, title, text }) => (
            <div
              key={title}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl transform hover:scale-105 transition-all shadow-md"
            >
              <img src={icon} alt={alt} className="mx-auto w-20 h-20 mb-4" />
              <h3 className="font-[Comic_Neue] font-semibold text-[#67463B] text-lg mb-2">
                {title}
              </h3>
              <p className="font-[Comic_Neue] text-[#67463B] text-sm">{text}</p>
            </div>
          ))}
        </div>
      </main>

      <div className="w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="block w-full h-24"
        >
          <path
            d="M0,40 Q200,120 400,40 T800,40 Q1000,120 1200,40 L1200,120 L0,120 Z"
            fill="#fdf6e7"
          />
        </svg>
      </div>
      <footer className="bg-[#fdf6e7] py-6">
        <p className="text-center text-sm text-[#67463B]/80 font-[Comic_Neue]">
          © {new Date().getFullYear()} SweetTreats. Todos los derechos
          reservados.
        </p>
      </footer>

      <style jsx global>{`
        @keyframes starFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(40px) rotate(180deg);
            opacity: 0.7;
          }
        }
        @keyframes starPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.8);
            opacity: 0.6;
          }
        }
        @keyframes starTwinkle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes starSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-starFloat {
          animation: starFloat 7s ease-in-out infinite alternate;
        }
        .animate-starPulse {
          animation: starPulse 4s ease-in-out infinite;
        }
        .animate-starTwinkle {
          animation: starTwinkle 3s ease-in-out infinite alternate;
        }
        .animate-starSpin {
          animation: starSpin 8s linear infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
