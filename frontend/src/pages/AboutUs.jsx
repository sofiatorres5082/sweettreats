import React from "react";
import MobileHeader from "../components/MobileHeader";

export default function AboutUs() {
  return (
    <>
      <MobileHeader />

      <div className="min-h-screen bg-[#F9E4CF] px-4 pt-16 pb-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-[Comic_Neue] text-[#67463B] text-center">
            Sobre Nosotros
          </h1>

          {/* Misión */}
          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-[Comic_Neue] text-[#E96D87] mb-2">
              Nuestra Misión
            </h2>
            <p className="text-[#67463B] leading-relaxed">
              En SweetTreats nos apasiona endulzar tus días con productos artesanales
              de la más alta calidad. Nuestra misión es llevar a tu mesa sabores
              únicos, elaborados con ingredientes frescos y mucho cariño.
            </p>
          </section>

          {/* Visión */}
          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-[Comic_Neue] text-[#E96D87] mb-2">
              Nuestra Visión
            </h2>
            <p className="text-[#67463B] leading-relaxed">
              Ser el referente número uno en repostería creativa, innovando en cada
              receta y ofreciendo una experiencia inolvidable en cada bocado.
            </p>
          </section>

          {/* Valores */}
          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-[Comic_Neue] text-[#E96D87] mb-2">
              Nuestros Valores
            </h2>
            <ul className="list-disc list-inside text-[#67463B] space-y-1">
              <li>Calidad Artesanal</li>
              <li>Pasión por el detalle</li>
              <li>Innovación constante</li>
              <li>Compromiso con el cliente</li>
              <li>Sostenibilidad</li>
            </ul>
          </section>

          {/* Equipo */}
          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-[Comic_Neue] text-[#E96D87] mb-4">
              Nuestro Equipo
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: "Ana Pérez", role: "Chef Pastelera" },
                { name: "Jorge Ruiz", role: "Diseño y Decoración" },
                { name: "Laura Gómez", role: "Atención al Cliente" },
              ].map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center text-center"
                >
                  <div className="h-24 w-24 bg-gray-200 rounded-full mb-2" />
                  <p className="font-[Comic_Neue] font-semibold">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
