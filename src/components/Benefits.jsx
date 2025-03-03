import { GrMoney, GrCreditCard } from "react-icons/gr";
import { BsCalendarCheck, BsShieldCheck, BsFillCreditCard2FrontFill, BsArrowRight } from "react-icons/bs";
import { AiOutlineRise, AiOutlineSafety } from "react-icons/ai";
import { RiMoneyDollarCircleLine, RiPercentLine } from "react-icons/ri";
import { MdOutlineLocalOffer, MdOutlineDescription } from "react-icons/md";
import { FaRegMoneyBillAlt, FaUserTie } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import Section from "./Section";
import { motion } from "framer-motion";

const Benefits = () => {
  const payrollBenefits = [
    {
      id: "0",
      title: "Financiamos tus compras en linea",
      text: "Financia productos de los comercios más importantes con descuento vía nómina.",
      iconComponent: <MdOutlineLocalOffer className="text-[#33FF57] text-3xl" />,
    },
    {
      id: "1",
      title: "Solicita efectivo y paga a plazos",
      text: "Solicita dinero en efectivo con descuento automático de tu nómina.",
      iconComponent: <FaRegMoneyBillAlt className="text-[#33FF57] text-3xl" />,
    },
    {
      id: "2",
      title: "Rapidez y transparencia",
      text: "Proceso 100% digital con respuesta inmediata y sin trámites presenciales.",
      iconComponent: <AiOutlineRise className="text-[#33FF57] text-3xl" />,
    },
  ];

  const autoLoanBenefits = [
    {
      id: "3",
      title: "Simula tu crédito en linea",
      text: "Interés competitivo del 3.7% mensual para adquirir el auto de tus sueños.",
      iconComponent: <RiPercentLine className="text-[#33FF57] text-3xl" />,
    },
    {
      id: "4",
      title: "Claridad de procesos",
      text: "Sin letras pequeñas ni cargos ocultos. Total transparencia en tu financiamiento.",
      iconComponent: <BsShieldCheck className="text-[#33FF57] text-3xl" />,
    },
    {
      id: "5",
      title: "Buró no determinante",
      text: "El historial crediticio no es determinante para aprobar tu solicitud de crédito.",
      iconComponent: <GrCreditCard className="text-[#33FF57] text-3xl" />,
    },
  ];

  return (
    <Section id="benefits" className="py-16 md:py-20 lg:py-24">
      <div className="container relative z-2">
        {/* Two-column benefits layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Payroll Credit Benefits */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-5 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#40E0D0] to-[#4DE8B2] inline-block mb-2">Crédito Nómina</h2>
              <p className="text-sm text-n-4">Soluciones financieras con descuento vía nómina</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              {payrollBenefits.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 }
                  }}
                  className="relative bg-n-8 overflow-hidden rounded-2xl border border-n-6 hover:border-[#33FF57]/40 transition-all duration-300"
                >
                  <div className="p-5 h-full flex flex-col">
                    <div className="flex justify-center items-center h-12 mb-3 transform transition-transform duration-200 group-hover:scale-110">
                      {item.iconComponent}
                    </div>
                    
                    <h3 className="text-center text-base font-semibold mb-2 text-n-1">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-n-4 text-center flex-grow">
                      {item.text}
                    </p>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#40E0D0] via-[#4DE8B2] to-[#3FD494] opacity-70" />
                </motion.div>
              ))}
            </div>

            {/* Buttons for Payroll Credit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/payroll-loan">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 166, 80, 0.3)"
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#40E0D0] to-[#4DE8B2] text-n-8 font-medium flex items-center justify-center gap-2 hover:shadow-xl transition-all duration-300"
                >
                  <span>Conocer más</span>
                  <BsArrowRight className="text-lg" />
                </motion.button>
              </Link>
              
              <a href="https://fincentiva-feb21-2025-front.vercel.app/login" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-n-8 border border-[#40E0D0]/50 text-n-1 font-medium flex items-center justify-center gap-2 hover:border-[#40E0D0] hover:shadow-lg transition-all duration-300"
                >
                  <span>Acceso empresarial</span>
                  <FaUserTie className="text-lg" />
                </motion.button>
              </a>
            </motion.div>
          </div>

          {/* Automotive Credit Benefits */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-5 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4DE8B2] to-[#3FD494] inline-block mb-2">Crédito Automotriz</h2>
              <p className="text-sm text-n-4">Adquiere el vehículo que deseas con condiciones favorables</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              {autoLoanBenefits.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 }
                  }}
                  className="relative bg-n-8 overflow-hidden rounded-2xl border border-n-6 hover:border-[#33FF57]/40 transition-all duration-300"
                >
                  <div className="p-5 h-full flex flex-col">
                    <div className="flex justify-center items-center h-12 mb-3 transform transition-transform duration-200 group-hover:scale-110">
                      {item.iconComponent}
                    </div>
                    
                    <h3 className="text-center text-base font-semibold mb-2 text-n-1">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-n-4 text-center flex-grow">
                      {item.text}
                    </p>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#40E0D0] via-[#4DE8B2] to-[#3FD494] opacity-70" />
                </motion.div>
              ))}
            </div>

            {/* Buttons for Auto Loan Credit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/auto-loan">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 166, 80, 0.3)"
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#4DE8B2] to-[#3FD494] text-n-8 font-medium flex items-center justify-center gap-2 hover:shadow-xl transition-all duration-300"
                >
                  <span>Conocer más</span>
                  <BsArrowRight className="text-lg" />
                </motion.button>
              </Link>
              
              <Link to="/auto-loan#simulator-section">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-n-8 border border-[#4DE8B2]/50 text-n-1 font-medium flex items-center justify-center gap-2 hover:border-[#4DE8B2] hover:shadow-lg transition-all duration-300"
                >
                  <span>Simular crédito</span>
                  <RiPercentLine className="text-lg" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
