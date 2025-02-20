import { useRef } from "react";
import { ScrollParallax } from "react-just-parallax";
import { heroIcons } from "../constants";
import { curve } from "../assets";
import CompanyLogos from "./CompanyLogos";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import Section from "./Section";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Typewriter from 'typewriter-effect';

const Hero = () => {
  const parallaxRef = useRef(null);

  const marketplaces = [
    {
      name: "Amazon",
      description: "Millones de productos con envío rápido y garantizado",
      url: "https://www.amazon.com.mx",
      color: "text-[#FF9900]",
      icon: "🛍️"
    },
    {
      name: "Financiar Producto",
      description: "Simula un crédito para tus compras en línea y elige el mejor plan de pagos",
      isSimulator: true,
      simulatorType: 'product',
      color: "text-[#33FF57]",
      icon: "💳"
    },
    {
      name: "Solicitar Efectivo",
      description: "Calcula tu capacidad de crédito y obtén el efectivo que necesitas",
      isSimulator: true,
      simulatorType: 'cash',
      color: "text-[#33FF57]",
      icon: "💰"
    },
    {
      name: "MercadoLibre",
      description: "La mayor plataforma de comercio electrónico en México",
      url: "https://www.mercadolibre.com.mx",
      color: "text-[#FFE600]",
      icon: "🌟"
    }
  ];

  useGSAP(() => {
    // Fade in cards with stagger
    gsap.from(".marketplace-card", {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.3,
      ease: "power3.out"
    });
  });

  return (
    <Section
      className="pt-[8rem] -mt-[5.25rem] overflow-hidden"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div ref={parallaxRef} className="container relative">
        <div className="relative z-1 max-w-[45rem] mx-auto text-center mb-[2rem] md:mb-8 lg:mb-[2rem]">
          <h1 className="h1 mb-6">
            <div className="h-[100px] flex items-center justify-center">
              <Typewriter
                options={{
                  strings: [
                    'Simula tu crédito al instante',
                    'Calcula tu capacidad de pago',
                    'Financia tus compras en línea',
                    'Obtén efectivo de inmediato',
                    'Elige el plan que más te convenga'
                  ],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 30,
                  delay: 100,
                  pauseFor: 2500
                }}
              />
            </div>
          </h1>
          <p className="body-1 max-w-2xl mx-auto mb-10 text-n-2 lg:mb-12 text-base">
            Descubre cuánto puedes solicitar según tus ingresos y elige el plan de pagos 
            que mejor se adapte a tu presupuesto. Sin complicaciones, 100% en línea.
          </p>
          
          {/* Beneficios Destacados */}
          <div className="grid grid-cols-3 gap-4 max-w-[40rem] mx-auto">
            <div className="flex flex-col items-center p-4 rounded-xl bg-n-7/50 backdrop-blur-sm">
              <div className="text-[#33FF57] text-2xl mb-2">⚡️</div>
              <h3 className="text-sm font-semibold mb-1">Respuesta Inmediata</h3>
              <p className="text-xs text-n-3">Conoce tu capacidad de crédito al instante</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-n-7/50 backdrop-blur-sm">
              <div className="text-[#33FF57] text-2xl mb-2">🎯</div>
              <h3 className="text-sm font-semibold mb-1">Planes Flexibles</h3>
              <p className="text-xs text-n-3">Ajustados a tu capacidad de pago</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-n-7/50 backdrop-blur-sm">
              <div className="text-[#33FF57] text-2xl mb-2">🔒</div>
              <h3 className="text-sm font-semibold mb-1">100% Seguro</h3>
              <p className="text-xs text-n-3">Proceso transparente y confiable</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 mb-4">
          {marketplaces.map((marketplace, index) => (
            <a
              key={index}
              href={marketplace.isSimulator ? "#" : marketplace.url}
              onClick={marketplace.isSimulator ? (e) => {
                e.preventDefault();
                if (typeof window !== 'undefined' && window.setActiveForm) {
                  window.setActiveForm(marketplace.simulatorType === 'product' ? 'product' : 'amount');
                }
              } : undefined}
              target={marketplace.isSimulator ? undefined : "_blank"}
              rel={marketplace.isSimulator ? undefined : "noopener noreferrer"}
              className={`
                marketplace-card block p-6 rounded-xl 
                bg-n-7 border border-n-1/10 
                transition-all duration-300 hover:scale-[1.02]
                hover:bg-n-6 relative overflow-hidden
                ${marketplace.isSimulator ? 'hover:border-[#33FF57]' : ''}
                transform-gpu
              `}
              style={{
                zIndex: 10,
                opacity: 1,
                visibility: 'visible',
                transform: 'none'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{marketplace.icon}</span>
                <div className={`text-2xl font-bold ${marketplace.color} transition-colors duration-300`}>
                  {marketplace.name}
                </div>
              </div>
              
              <p className="text-n-3 text-sm transition-colors duration-300 group-hover:text-n-1 mb-4">
                {marketplace.description}
              </p>
              
              <div className="mt-auto flex items-center text-n-3 text-sm group-hover:text-n-1">
                <span className="mr-2 transition-transform duration-300 group-hover:translate-x-1">
                  {marketplace.isSimulator ? 
                    (marketplace.simulatorType === 'product' ? 
                      "Financiar un producto" : 
                      "Solicitar efectivo") :
                    "Explorar productos financiables"}
                </span>
                <svg
                  className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Hero;
