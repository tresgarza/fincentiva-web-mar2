import { GrMoney } from "react-icons/gr";
import { BsCalendarCheck, BsShieldCheck } from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineLocalOffer } from "react-icons/md";
import Typewriter from 'typewriter-effect';
import Section from "./Section";
import { benefits } from "../constants";

const Benefits = () => {
  const benefitsList = [
    {
      id: "0",
      title: "Simulador Inteligente",
      text: "Calcula instantáneamente tu capacidad de crédito basada en tus ingresos y periodo de pago.",
      iconComponent: <RiMoneyDollarCircleLine className="text-[#33FF57] text-4xl" />,
    },
    {
      id: "1",
      title: "Planes Personalizados",
      text: "Visualiza diferentes opciones de pago y elige el plazo que mejor se ajuste a tu presupuesto.",
      iconComponent: <BsCalendarCheck className="text-[#33FF57] text-4xl" />,
    },
    {
      id: "2",
      title: "Proceso Transparente",
      text: "Sin letras pequeñas. Conoce exactamente cuánto pagarás y todos los detalles de tu plan.",
      iconComponent: <BsShieldCheck className="text-[#33FF57] text-4xl" />,
    },
    {
      id: "3",
      title: "Control Total",
      text: "Nunca excedas tu capacidad de pago. Te mostramos solo los planes que puedes pagar cómodamente.",
      iconComponent: <AiOutlineRise className="text-[#33FF57] text-4xl" />,
    },
    {
      id: "4",
      title: "Solicitud Simple",
      text: "Proceso 100% en línea. Sin papeleos innecesarios ni visitas a sucursales.",
      iconComponent: <GrMoney className="text-[#33FF57] text-4xl" />,
    },
    {
      id: "5",
      title: "Múltiples Opciones",
      text: "Financia productos de tus tiendas favoritas o solicita efectivo según tus necesidades.",
      iconComponent: <MdOutlineLocalOffer className="text-[#33FF57] text-4xl" />,
    },
  ];

  return (
    <Section id="benefits" className="py-8">
      <div className="container relative z-2">
        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefitsList.map((item) => (
            <div
              key={item.id}
              className="relative p-0.5 rounded-[2.4rem] bg-gradient-to-r from-[#40E0D0] via-[#4DE8B2] to-[#3FD494] overflow-hidden"
            >
              <div className="relative bg-n-8 rounded-[2.3rem] h-full p-8">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 left-1/2 w-[41.6rem] aspect-square -translate-x-1/2 -translate-y-1/2 bg-[#40E0D0] opacity-10 blur-[100px]" />
                </div>
                <div className="relative z-2">
                  <div className="mb-4 flex justify-center">
                    {item.iconComponent}
                  </div>
                  <h3 className="h4 mb-4 text-center">{item.title}</h3>
                  <p className="body-2 text-n-4 text-center">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
