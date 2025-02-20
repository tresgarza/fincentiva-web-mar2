import Section from "./Section";
import Heading from "./Heading";
import { benefits } from "../constants";
import Arrow from "../assets/svg/Arrow";
import { GrMoney } from "react-icons/gr";
import { BsCalendarCheck, BsShieldCheck } from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineLocalOffer } from "react-icons/md";

const Benefits = () => {
  const benefitsList = [
    {
      id: "0",
      title: "Financiamiento Inmediato",
      text: "Obtén respuesta rápida para tus solicitudes de crédito y comienza a comprar lo que necesitas hoy mismo.",
      backgroundClass: "bg-n-8",
      iconComponent: <RiMoneyDollarCircleLine className="text-color-1 text-4xl" />,
    },
    {
      id: "1",
      title: "Planes Flexibles",
      text: "Elige el plan de pagos que mejor se adapte a tu presupuesto, con plazos desde 6 hasta 36 meses.",
      backgroundClass: "bg-n-8",
      iconComponent: <BsCalendarCheck className="text-color-2 text-4xl" />,
    },
    {
      id: "2",
      title: "Compras Seguras",
      text: "Realiza tus compras con la tranquilidad de contar con un respaldo financiero confiable y seguro.",
      backgroundClass: "bg-n-8",
      iconComponent: <BsShieldCheck className="text-color-3 text-4xl" />,
    },
    {
      id: "3",
      title: "Mejores Tasas",
      text: "Accede a tasas competitivas y transparentes, diseñadas para hacer tus compras más accesibles.",
      backgroundClass: "bg-n-8",
      iconComponent: <AiOutlineRise className="text-color-1 text-4xl" />,
    },
    {
      id: "4",
      title: "Sin Complicaciones",
      text: "Proceso de solicitud simple y rápido, sin papeleo excesivo ni trámites complejos.",
      backgroundClass: "bg-n-8",
      iconComponent: <GrMoney className="text-color-2 text-4xl" />,
    },
    {
      id: "5",
      title: "Ofertas Exclusivas",
      text: "Aprovecha descuentos y promociones especiales en nuestras tiendas asociadas.",
      backgroundClass: "bg-n-8",
      iconComponent: <MdOutlineLocalOffer className="text-color-3 text-4xl" />,
    },
  ];

  return (
    <Section id="features">
      <div className="container">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="Impulsa tus compras con FinCENTIVA"
        />

        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefitsList.map((item) => (
            <div
              className={`relative z-1 p-0.5 rounded-[2.5rem] overflow-hidden ${
                item.backgroundClass
              }`}
              key={item.id}
            >
              <div className="relative h-full p-8 rounded-[2.4375rem] overflow-hidden bg-n-8">
                <div className="relative z-1">
                  <div className="mb-6">
                    {item.iconComponent}
                  </div>
                  <h4 className="h4 mb-4">{item.title}</h4>
                  <p className="body-2 text-n-3">{item.text}</p>
                </div>

                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-color-1/25 via-color-2/25 to-color-3/25 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
