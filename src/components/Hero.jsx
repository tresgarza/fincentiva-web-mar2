import { useRef, useEffect } from "react";
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
  const bgParticlesRef = useRef(null);

  const marketplaces = [
    {
      name: "Amazon",
      description: "Millones de productos con envío rápido y garantizado",
      url: "https://www.amazon.com.mx",
      color: "text-[#FF9900]",
      hoverEffect: "hover:shadow-amazon",
      bgGradient: "from-[#FF990033] to-transparent",
      icon: "🛍️"
    },
    {
      name: "MercadoLibre",
      description: "La mayor plataforma de comercio electrónico en México",
      url: "https://www.mercadolibre.com.mx",
      color: "text-[#FFE600]",
      hoverEffect: "hover:shadow-mercadolibre",
      bgGradient: "from-[#FFE60033] to-transparent",
      icon: "🌟"
    }
  ];

  useGSAP(() => {
    // Fade in cards with stagger
    gsap.from(".marketplace-card", {
      opacity: 0,
      y: 100,
      duration: 1,
      stagger: 0.3,
      ease: "power3.out"
    });

    // Continuous floating animation
    gsap.to(".marketplace-card", {
      y: -20,
      duration: 2.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.5,
        from: "random"
      }
    });

    // Glow effect animation
    gsap.to(".card-glow", {
      opacity: 0.8,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.3,
        from: "random"
      }
    });

    // Background particles animation
    const particles = bgParticlesRef.current.children;
    gsap.to(particles, {
      y: "random(-100, 100)",
      x: "random(-100, 100)",
      opacity: "random(0.3, 0.8)",
      duration: "random(3, 5)",
      ease: "power1.inOut",
      stagger: {
        each: 0.2,
        repeat: -1,
        yoyo: true
      }
    });
  });

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem] overflow-hidden"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div ref={parallaxRef} className="container relative">
        {/* Background Particles */}
        <div ref={bgParticlesRef} className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <h1 className="h1 mb-6">
            <Typewriter
              options={{
                strings: [
                  'Financia tus sueños...',
                  'Compra tecnología...',
                  'Renueva tu hogar...',
                  'Estrena muebles...',
                  'Adquiere electrodomésticos...'
                ],
                autoStart: true,
                loop: true,
                deleteSpeed: 50,
                delay: 80
              }}
            />
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8 animate-fadeIn">
            Obtén financiamiento al instante para tus compras en línea. 
            Elige el plan que mejor se adapte a ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-1 mb-[4rem]">
          {marketplaces.map((marketplace, index) => (
            <a
              key={index}
              href={marketplace.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`marketplace-card group block p-8 rounded-2xl bg-gradient-to-b ${marketplace.bgGradient} backdrop-blur-sm border border-n-1/10 transition-all duration-500 ${marketplace.hoverEffect} hover:scale-105 hover:-translate-y-2 relative overflow-hidden`}
            >
              {/* Glow effect */}
              <div className={`card-glow absolute inset-0 opacity-0 ${marketplace.bgGradient} blur-xl transition-opacity duration-500 group-hover:opacity-20`} />
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{marketplace.icon}</span>
                <div className={`text-3xl font-bold ${marketplace.color} transition-colors duration-300 group-hover:scale-110 transform`}>
                  {marketplace.name}
                </div>
              </div>
              
              <p className="text-n-3 transition-colors duration-300 group-hover:text-n-1">
                {marketplace.description}
              </p>
              
              <div className="mt-6 flex items-center text-n-3 group-hover:text-n-1">
                <span className="mr-2 transition-transform duration-300 group-hover:translate-x-1">
                  Visitar tienda
                </span>
                <svg
                  className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2 arrow-icon"
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

        <div className="absolute top-[55.25rem] left-1/2 w-[92.5rem] -translate-x-1/2 pointer-events-none">
          <img
            src={curve}
            className="w-full"
            width={1480}
            height={144}
            alt="Curve"
          />
        </div>

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>
    </Section>
  );
};

export default Hero;
