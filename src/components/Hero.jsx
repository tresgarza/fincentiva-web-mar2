import { useRef } from "react";
import { ScrollParallax } from "react-just-parallax";
import Typewriter from "typewriter-effect";

import { curve, heroBackground } from "../assets";
import Button from "./Button";
import CompanyLogos from "./CompanyLogos";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import Generating from "./Generating";
import Notification from "./Notification";
import Section from "./Section";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div ref={parallaxRef} className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <h1 className="h1 mb-6">
            Financia tus Sueños
            <br />
            <Typewriter
              options={{
                strings: [
                  "Electrónicos",
                  "Electrodomésticos",
                  "Muebles",
                  "Tecnología",
                  "Y Más",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>

          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Obtén financiamiento instantáneo para productos de tus tiendas online favoritas. Solo comparte el enlace y nosotros nos encargamos del resto con{" "}
            <span className="inline-block relative font-semibold">
              Fincentiva
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2 pointer-events-none select-none"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </p>

          <Button href="#get-started" white>
            Comenzar Ahora
          </Button>
        </div>

        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                {/* Product Showcase Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
                  <div className="product-card bg-n-7 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Electrónicos</div>
                    <div className="text-xs text-n-3">Aprobación instantánea</div>
                  </div>
                  <div className="product-card bg-n-7 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Electrodomésticos</div>
                    <div className="text-xs text-n-3">Términos flexibles</div>
                  </div>
                  <div className="product-card bg-n-7 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Muebles</div>
                    <div className="text-xs text-n-3">Pagos fáciles</div>
                  </div>
                </div>

                <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />

                <ScrollParallax isAbsolutelyPositioned>
                  <Notification
                    className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                    title="Aprobación Instantánea"
                  />
                </ScrollParallax>
              </div>
            </div>

            <Gradient />
          </div>

          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img
              src={heroBackground}
              className="w-full pointer-events-none select-none"
              width={1440}
              height={1800}
              alt="Hero"
            />
          </div>

          <BackgroundCircles />
        </div>

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
