import { GrMoney } from "react-icons/gr";
import { BsCalendarCheck, BsShieldCheck } from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineLocalOffer } from "react-icons/md";
import Typewriter from 'typewriter-effect';

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
    <section id="benefits" className="py-12 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 text-[#33FF57]">
            ¿Por qué elegir FINCENTIVA?
          </h2>
          <div className="text-white text-base h-12">
            <Typewriter
              options={{
                strings: [
                  'Simula y conoce tu capacidad de crédito al instante',
                  'Elige el plan que mejor se adapte a tu presupuesto',
                  'Financia tus compras de forma inteligente',
                  'Solicita efectivo con pagos que puedas cumplir',
                  'Toma el control de tus finanzas'
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefitsList.map((item) => (
            <div
              key={item.id}
              className="bg-[#1A1A1A] rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.02] hover:bg-[#252525] border border-[#333333] hover:border-[#33FF57] group"
            >
              <div className="flex flex-col h-full">
                <div className="mb-3 transform transition-all duration-300 group-hover:scale-105 group-hover:text-[#33FF57]">
                  {item.iconComponent}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#33FF57] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
