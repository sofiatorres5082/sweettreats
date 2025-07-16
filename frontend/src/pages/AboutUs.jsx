import React from "react";
import MobileHeader from "../components/MobileHeader";
import { Heart, Mail, Phone, MapPin, Sparkles, Cookie, Cake } from "lucide-react";
import imgSprinkles from "../assets/images/aboutus-imagen-1.jpg";
import owner1 from "../assets/images/aboutus-imagen-2.jpg";
import owner2 from "../assets/images/aboutus-imagen-3.jpg";
import heartIcon from "../assets/images/hearts-icon.png";
import strawberryIcon from "../assets/images/strawberry-icon.png";

const OrganicBlob = ({ className, color }) => (
  <div
    className={`absolute ${className}`}
    style={{
      background: color,
      borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
      opacity: 0.15,
    }}
  />
);

const FloatingIcon = ({ Icon, className, color }) => (
  <Icon
    className={`absolute ${className} ${color} opacity-20`}
    style={{ 
      animationDuration: '3s', 
      animationDelay: Math.random() * 2 + 's',
      animation: 'starFloat 7s ease-in-out infinite alternate'
    }}
  />
);

const FloatingImage = ({ src, alt, className, animationType = 'starFloat' }) => (
  <img
    src={src}
    alt={alt}
    className={`absolute ${className} opacity-60`}
    style={{ 
      animationDuration: '5s', 
      animationDelay: Math.random() * 2 + 's',
      animation: `${animationType} 7s ease-in-out infinite alternate`
    }}
  />
);

export default function AboutUs() {
  return (
    <>
      <MobileHeader />
      <div className="relative bg-[#F9E4CF] min-h-screen overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <FloatingIcon Icon={Heart} className="w-8 h-8 top-20 left-10" color="text-[#E96D87]" />
          <FloatingIcon Icon={Sparkles} className="w-6 h-6 top-32 right-20" color="text-[#F4A460]" />
          <FloatingImage src={strawberryIcon} alt="" className="w-10 h-10 bottom-40 left-16" animationType="starPulse" />
          <FloatingImage src={heartIcon} alt="" className="w-12 h-12 bottom-20 right-12" animationType="starTwinkle" />
          <FloatingImage src={heartIcon} alt="" className="w-8 h-8 top-40 right-32" animationType="starFloat" />

          <OrganicBlob className="w-64 h-64 top-10 -right-20" color="#E96D87" />
          <OrganicBlob className="w-48 h-48 bottom-32 -left-12" color="#DDA0DD" />
          <OrganicBlob className="w-56 h-56 top-1/2 left-1/3" color="#F4A460" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 space-y-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#E96D87]" />
              <h1 className="text-4xl md:text-5xl font-[Marimpa] text-[#67463B]">
                Sobre nosotros
              </h1>
              <Sparkles className="w-6 h-6 text-[#E96D87]" />
            </div>
          </div>

          <section className="relative bg-white rounded-[40px] p-8 md:p-12 overflow-hidden shadow-xl">
            <OrganicBlob className="w-32 h-32 top-4 right-4" color="#FFB6C1" />
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-[Marimpa] text-[#67463B] mb-4">
                  Nuestra Historia
                </h2>
                <div className="space-y-3 text-[#67463B] leading-relaxed font-[Comic_Neue]">
                  <p>SweetTreats nació en 2020 de nuestra pasión por la repostería casera.</p>
                  <p>En marzo 2022 ampliamos a nuestro propio espacio de producción.</p>
                  <p className="font-semibold text-[#E96D87]">Este crecimiento fue posible gracias a tu apoyo.</p>
                </div>
              </div>
              <div className="relative">
                <div
                  className="bg-[#E96D87] rounded-[40px] p-4"
                  style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
                >
                  <div className="flex gap-4 justify-center">
                    {[owner1, owner2].map((src, idx) => (
                      <div key={idx} className="relative mt-4">
                        <img
                          src={src}
                          alt={idx === 0 ? 'Fundadora 1' : 'Fundadora 2'}
                          className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white"
                        />
                        <div className={`absolute -bottom-2 ${idx===0 ? '-left-2':'-right-2'} bg-white rounded-full px-3 py-1`}>
                          <span className="text-sm font-[Comic_Neue] font-bold text-[#67463B]">
                            {idx===0 ? 'María' : 'Ana'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative bg-white rounded-[40px] p-8 md:p-12 shadow-xl overflow-hidden">
            <OrganicBlob className="w-40 h-40 -top-8 -left-8" color="#DDA0DD" />
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-[#E96D87] to-[#F4A460] p-3 rounded-full">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-[Marimpa] text-[#67463B]">
                    Cada creación está llena de{' '}
                    <span className="text-[#E96D87] font-bold">amor</span>
                  </h2>
                </div>
                <p className="text-[#67463B] leading-relaxed space-y-4 font-[Comic_Neue]">
                  <span>Operamos como un negocio familiar: María hornea cada delicia y Ana prepara cada pedido.</span>
                  <span> Detrás de cada oferta hay horas de investigación y cariño.</span>
                </p>
              </div>
              <div className="relative flex justify-center">
                <div
                  className="bg-gradient-to-br from-[#FFB6C1] to-[#E96D87] p-6 flex items-center justify-center"
                  style={{ 
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    width: '280px',
                    height: '280px'
                  }}
                >
                  <img
                    src={imgSprinkles}
                    alt="Espolvoreando cupcakes"
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-[#F4A460]" style={{animation: 'starPulse 4s ease-in-out infinite'}} />
                <img 
                  src={strawberryIcon} 
                  alt="" 
                  className="absolute -bottom-4 -left-4 w-10 h-10" 
                  style={{animation: 'starFloat 7s ease-in-out infinite alternate'}} 
                />
              </div>
            </div>
          </section>

          <section className="relative bg-gradient-to-br from-white to-[#FFF0F5] rounded-[40px] p-8 md:p-12 shadow-xl overflow-hidden">
            <OrganicBlob className="w-28 h-28 top-6 right-6" color="#F4A460" />
            <h2 className="text-2xl md:text-3xl font-[Marimpa] text-[#E96D87] mb-8 text-center">
              Nuestros Valores
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Heart, text: "Calidad Artesanal", color: "bg-[#E96D87]" },
                { icon: Sparkles, text: "Pasión por el detalle", color: "bg-[#F4A460]" },
                { icon: Sparkles, text: "Innovación constante", color: "bg-[#DDA0DD]" },
                { icon: Heart, text: "Compromiso con el cliente", color: "bg-[#E96D87]" },
              ].map((valor, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white rounded-[20px] p-4 hover:scale-105 transition-all duration-300"
                >
                  <div className={`${valor.color} p-3 rounded-full flex items-center justify-center`}>
                    {valor.icon ? (
                      <valor.icon className="w-5 h-5 text-white" />
                    ) : (
                      <img src={valor.image} alt="" className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-[#67463B] font-semibold font-[Comic_Neue]">
                    {valor.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="relative bg-[#E96D87] rounded-[40px] p-8 md:p-12 shadow-xl overflow-hidden text-white">
            <OrganicBlob className="w-36 h-36 -bottom-8 -right-8" color="rgba(255,255,255,0.1)" />
            <h2 className="text-2xl md:text-3xl font-[Marimpa] mb-8 text-center">
              Contáctanos
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Mail, text: "info@sweettreats.com", href: "mailto:info@sweettreats.com" },
                { icon: Phone, text: "+54 11 2222-3334", href: "tel:+541112223334" },
                { icon: MapPin, text: "Av. Corrientes 1234, Buenos Aires", href: null }
              ].map((contact, i) => (
                <div
                  key={i}
                  className="bg-white/20 backdrop-blur-sm rounded-[20px] p-4 hover:bg-white/30 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <contact.icon className="w-8 h-8 text-white" />
                    {contact.href ? (
                      <a href={contact.href} className="hover:underline font-semibold font-[Comic_Neue]">
                        {contact.text}
                      </a>
                    ) : (
                      <span className="font-semibold font-[Comic_Neue]">{contact.text}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>


    </>
  );
}