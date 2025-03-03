import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Section from "./Section";
import Heading from "./Heading";
import { PhotoChatMessage, VideoChatMessage } from "./design/Services";
import Generating from "./Generating";
import curve from "../assets/hero/curve.png";
import { BsArrowRight, BsInfoCircle } from "react-icons/bs";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaCarSide, FaClock } from "react-icons/fa";

// Import images
import aiImage from "../assets/services/1.png";
// Removed unused image imports
// import carImage from "../assets/services/2.png";
// import robotHandImage from "../assets/services/3.png";

const Services = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [buttonHover, setButtonHover] = useState(null);
  
  // Estados para el simulador
  const [carPrice, setCarPrice] = useState(375000);
  const [carPriceInput, setCarPriceInput] = useState("375,000");
  const [downPayment, setDownPayment] = useState(112500);
  const [downPaymentInput, setDownPaymentInput] = useState("112,500");
  const [termMonths, setTermMonths] = useState(48);
  const [monthlyPayment, setMonthlyPayment] = useState(8750);
  const [loanAmount, setLoanAmount] = useState(262500);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Constantes para cálculos
  const IVA = 0.16;
  const gpsRent = 400;
  const commissionRate = 0.03;
  const annualInterestRate = 0.45 * (1 + IVA);
  const monthlyInterestRate = annualInterestRate / 12;

  // Función para convertir string a número eliminando formato
  const parseAmount = (value) => {
    if (!value) return 0;
    return Number(value.replace(/[^0-9]/g, ''));
  };
  
  // Función para formatear moneda en input
  const formatInputCurrency = (value) => {
    if (!value) return '';
    const onlyNumbers = value.replace(/[^0-9]/g, '');
    return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Función para calcular el pago mensual
  const calculateMonthlyPayment = (creditAmount, months) => {
    if (months <= 0) return 0;
    const payment = (creditAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -months));
    return payment + gpsRent;
  };

  // Función para actualizar cálculos
  const updateCalculations = (price, payment, months) => {
    setIsCalculating(true);
    
    // Simulamos un pequeño delay para mostrar el efecto de cálculo
    setTimeout(() => {
      const minDownPayment = price * 0.3;
      // Si el enganche es menor que el mínimo requerido, actualizarlo
      let validDownPayment = payment;
      if (payment < minDownPayment) {
        validDownPayment = minDownPayment;
        setDownPayment(validDownPayment);
        setDownPaymentInput(formatInputCurrency(validDownPayment.toString()));
      }
      
      const loan = price - validDownPayment;
      const creditWithCommission = loan / (1 - commissionRate);
      
      setLoanAmount(loan);
      setMonthlyPayment(calculateMonthlyPayment(creditWithCommission, months));
      setIsCalculating(false);
    }, 300);
  };

  // Efecto para sincronizar los valores del precio del auto
  useEffect(() => {
    // Solo actualizamos si el cambio viene del slider para evitar loops
    if (carPrice !== parseAmount(carPriceInput)) {
      setCarPriceInput(formatInputCurrency(carPrice.toString()));
      
      // Actualizar el enganche mínimo si es necesario
      const minDownPayment = carPrice * 0.3;
      if (downPayment < minDownPayment) {
        setDownPayment(minDownPayment);
        setDownPaymentInput(formatInputCurrency(minDownPayment.toString()));
      }
      
      updateCalculations(carPrice, downPayment, termMonths);
    }
  }, [carPrice]);

  // Efecto para sincronizar los valores del enganche
  useEffect(() => {
    // Solo actualizamos si el cambio viene del slider para evitar loops
    if (downPayment !== parseAmount(downPaymentInput)) {
      setDownPaymentInput(formatInputCurrency(downPayment.toString()));
      updateCalculations(carPrice, downPayment, termMonths);
    }
  }, [downPayment]);

  // Manejadores de eventos para los sliders
  const handleCarPriceChange = (e) => {
    const newPrice = Number(e.target.value);
    setCarPrice(newPrice);
  };

  const handleCarPriceInputChange = (e) => {
    const value = e.target.value;
    setCarPriceInput(formatInputCurrency(value));
  };

  const handleCarPriceInputBlur = () => {
    const parsedValue = parseAmount(carPriceInput);
    // Validar rango
    const validValue = Math.min(Math.max(parsedValue, 100000), 1000000);
    setCarPrice(validValue);
    setCarPriceInput(formatInputCurrency(validValue.toString()));
  };

  const handleDownPaymentChange = (e) => {
    const newPayment = Number(e.target.value);
    setDownPayment(newPayment);
  };

  const handleDownPaymentInputChange = (e) => {
    const value = e.target.value;
    setDownPaymentInput(formatInputCurrency(value));
  };

  const handleDownPaymentInputBlur = () => {
    const parsedValue = parseAmount(downPaymentInput);
    const minValue = carPrice * 0.3;
    const maxValue = carPrice;
    // Validar rango
    const validValue = Math.min(Math.max(parsedValue, minValue), maxValue);
    setDownPayment(validValue);
    setDownPaymentInput(formatInputCurrency(validValue.toString()));
  };

  const handleTermChange = (months) => {
    setTermMonths(months);
    updateCalculations(carPrice, downPayment, months);
  };

  // Modificar el componente Link para incluir los datos de la simulación
  const getSimulationLink = () => {
    const simulationData = {
      carPrice,
      downPayment,
      termMonths,
      loanAmount,
    };
    
    // Aseguramos que el hash tenga el formato correcto con el símbolo #
    return {
      pathname: '/auto-loan',
      state: simulationData,
      hash: '#simulator-section'
    };
  };

  const mainServices = [
    "Aprobamos en 48 horas",
    "Tu buró no es determinante",
    "Atención personalizada"
  ];

  return (
    <Section id="how-to-use" className="pt-8 pb-10">
      <div className="container max-w-[1320px] mx-auto px-4">
        <Heading
          title={
            <>
              Financiamiento{" "}
              <span className="inline-block relative font-semibold">
                a la medida
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2 pointer-events-none select-none"
                  width={624}
                  height={28}
                  alt="Curve"
                />
              </span>
            </>
          }
          text="Con más de 10 años de experiencia, aquí encontrarás la liquidez que necesitas de forma rápida y confiable. Tu historial crediticio no es determinante, estamos listos para ayudarte a avanzar con tranquilidad y cumplir tus metas financieras."
        />

        <div className="relative">
          {/* Service 1 - Reduced height and improved layout */}
          <motion.div 
            className="relative z-1 flex flex-col lg:flex-row items-center mb-10 bg-n-8/80 rounded-[2rem] border border-n-6 p-4 lg:p-8 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'linear-gradient(145deg, rgba(51,255,87,0.03) 0%, rgba(0,166,80,0.05) 100%)'
            }}
          >
            <div className="flex-1 lg:max-w-[45%] mb-6 lg:mb-0 lg:mr-8">
              <div className="relative">
                <img 
                  src={aiImage} 
                  alt="AI Assistant" 
                  className="w-full h-auto max-h-[400px] object-contain rounded-xl"
                />
                {/* Generating component positioned better */}
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-[280px]">
                  <Generating className="w-full" />
                </div>
              </div>
            </div>

            <div className="flex-1 pt-8">
              <h3 className="h3 mb-4">Tu Aliado Financiero</h3>
              
              <ul className="mb-10">
                {mainServices.map((service, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start mb-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-color-1 flex items-center justify-center mr-3 mt-1">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-n-1 text-lg">{service}</p>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Buttons with tooltips */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative group">
                  <Link 
                    to="/auto-loan"
                    className="button px-6 py-3 bg-color-1 hover:bg-color-2 text-black font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    onMouseEnter={() => setButtonHover('auto')}
                    onMouseLeave={() => setButtonHover(null)}
                  >
                    <FaCarSide className="text-xl" />
                    <span>Simular Crédito</span>
                  </Link>
                  {buttonHover === 'auto' && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-n-7 text-n-1 text-sm rounded-lg whitespace-nowrap">
                      Calcula tu crédito automotriz
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <a 
                    href="https://fincentiva-feb21-2025-front.vercel.app/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button px-6 py-3 bg-n-7 hover:bg-n-6 text-n-1 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    onMouseEnter={() => setButtonHover('payroll')}
                    onMouseLeave={() => setButtonHover(null)}
                  >
                    <RiMoneyDollarCircleLine className="text-xl" />
                    <span>Acceso Empresarial</span>
                  </a>
                  {buttonHover === 'payroll' && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-n-7 text-n-1 text-sm rounded-lg whitespace-nowrap">
                      Portal para empresas afiliadas
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Service 2 and 3 - Smaller cards without images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service 2 - Credinómina - Adjusted height and spacing */}
            <motion.div 
              className="relative z-1 bg-n-8/80 rounded-[2rem] border border-n-6 p-5 overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onMouseEnter={() => setActiveService('nominal')}
              onMouseLeave={() => setActiveService(null)}
              whileHover={{ 
                borderColor: "rgba(0, 166, 80, 0.5)",
                boxShadow: "0 10px 30px -10px rgba(0, 166, 80, 0.3)"
              }}
              style={{ height: '400px' }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-n-8/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-2 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="h4 mb-0">Credinómina</h3>
              </div>

                <div className="flex-grow flex items-center justify-center">
              <PhotoChatMessage />
            </div>

                <div className="absolute bottom-5 left-5 z-2">
                  <Link to="/payroll-loan">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="button px-4 py-2 bg-gradient-to-r from-[#40E0D0] to-[#4DE8B2] text-n-8 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm backdrop-blur-sm hover:shadow-lg hover:shadow-color-1/20"
                    >
                      <span>Conocer más</span>
                      <BsArrowRight className="text-sm" />
                    </motion.div>
                  </Link>
                </div>

                <div className="absolute bottom-5 right-5 z-2">
                  <a 
                    href="https://fincentiva-feb21-2025-front.vercel.app/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button px-4 py-2 bg-color-1/90 hover:bg-color-2 text-black font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs backdrop-blur-sm"
                  >
                    <span>Acceso Empresas</span>
                    <BsArrowRight className="text-xs" />
                  </a>
                </div>
              </div>
            </motion.div>
            
            {/* Service 3 - Crédito Automotriz */}
            <motion.div 
              className="relative z-1 bg-n-8/80 rounded-[2rem] border border-n-6 p-5 overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              onMouseEnter={() => setActiveService('auto')}
              onMouseLeave={() => setActiveService(null)}
              whileHover={{ 
                borderColor: "rgba(0, 166, 80, 0.5)",
                boxShadow: "0 10px 30px -10px rgba(0, 166, 80, 0.3)"
              }}
              style={{ height: '400px' }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-n-8/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-2 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="h4 mb-0">Crédito Automotriz</h3>
                </div>

                <div className="flex-grow flex items-center justify-center">
                  <VideoChatMessage />
                </div>

                <div className="absolute bottom-5 left-5 z-2">
                  <Link to="/auto-loan">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="button px-4 py-2 bg-gradient-to-r from-[#40E0D0] to-[#4DE8B2] text-n-8 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm backdrop-blur-sm hover:shadow-lg hover:shadow-color-1/20"
                    >
                      <span>Conocer más</span>
                      <BsArrowRight className="text-sm" />
                    </motion.div>
                  </Link>
                </div>

                <div className="absolute bottom-5 right-5 z-2">
                  <Link 
                    to="/auto-loan"
                    className="button px-4 py-2 bg-color-1/90 hover:bg-color-2 text-black font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs backdrop-blur-sm"
                  >
                    <span>Simular crédito</span>
                    <BsArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Nueva sección del Simulador Automotriz */}
          <motion.div 
            className="mt-16 relative z-1 bg-n-8/80 rounded-[2rem] border border-n-6 p-8 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            whileHover={{ 
              boxShadow: "0 20px 40px -20px rgba(0, 166, 80, 0.3)"
            }}
          >
            <div className="relative z-2">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FaCarSide className="text-color-1 text-3xl" />
                <h3 className="h3 mb-0 text-center">Simulador de Crédito Automotriz</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Columna del Simulador */}
                <div className="bg-n-7/50 rounded-xl p-6 backdrop-blur-sm border border-n-6">
                  {/* Slider e Input de Precio del Auto */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <RiMoneyDollarCircleLine className="text-color-1 text-xl" />
                        <label className="text-n-3">Valor del Auto</label>
                      </div>
                      <div className="relative">
                        <div className="flex items-center">
                          <span className="text-n-3 mr-1">$</span>
                          <input
                            type="text"
                            value={carPriceInput}
                            onChange={handleCarPriceInputChange}
                            onBlur={handleCarPriceInputBlur}
                            className="w-28 bg-n-6 rounded-lg px-2 py-1 text-right text-n-1 font-medium border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                          />
                        </div>
                        <div className="text-xs text-n-4 text-right mt-1">
                          Min: $100,000 - Max: $1,000,000
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-3 h-2">
                      <div className="absolute inset-0 bg-n-6 rounded-full"></div>
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-color-1/80 to-color-1 rounded-full pointer-events-none transition-all duration-200 ease-out"
                        style={{ width: `${((carPrice - 100000) / 900000) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="100000"
                        max="1000000"
                        step="1000"
                        value={carPrice}
                        onChange={handleCarPriceChange}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-color-1 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:translate-y-[-2px] [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-color-1 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:translate-y-[-2px]"
                      />
                    </div>
                  </div>

                  {/* Input Manual de Enganche */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <RiMoneyDollarCircleLine className="text-color-1 text-xl" />
                        <div className="flex items-center group">
                          <label className="text-n-3 mr-1">Enganche</label>
                          <div 
                            className="text-n-3 cursor-help relative"
                            onMouseEnter={() => setShowTip(true)}
                            onMouseLeave={() => setShowTip(false)}
                          >
                            <BsInfoCircle className="text-xs" />
                            <AnimatePresence>
                              {showTip && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute left-0 bottom-full mb-2 w-48 z-50"
                                >
                                  <div className="bg-n-8/90 backdrop-blur-sm text-xs text-n-3 p-2 rounded-lg border border-n-6">
                                    El enganche mínimo requerido es del 30% del valor del vehículo
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="flex items-center">
                          <span className="text-n-3 mr-1">$</span>
                          <input
                            type="text"
                            value={downPaymentInput}
                            onChange={handleDownPaymentInputChange}
                            onBlur={handleDownPaymentInputBlur}
                            className="w-28 bg-n-6 rounded-lg px-2 py-1 text-right text-n-1 font-medium border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                          />
                        </div>
                        <div className="text-xs text-n-4 text-right mt-1">
                          Mínimo: {formatCurrency(carPrice * 0.3)}
                        </div>
                        {parseAmount(downPaymentInput) < carPrice * 0.3 && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-0 right-0 mt-1 text-xs text-red-500"
                          >
                            El enganche debe ser al menos 30% del valor
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selector de Plazo */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaClock className="text-color-1 text-xl" />
                      <label className="text-n-3">Plazo (meses)</label>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {[6, 12, 18, 24, 36, 48].map((months) => (
                        <motion.button
                          key={months}
                          onClick={() => handleTermChange(months)}
                          className={`p-2 rounded-xl border ${
                            termMonths === months
                              ? 'bg-color-1 border-color-1 text-black font-semibold shadow-md'
                              : 'bg-n-6 border-n-6 text-n-3 hover:bg-n-5 hover:border-n-5'
                          } transition-all duration-300`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {months} meses
                        </motion.button>
                      ))}
                    </div>
                  </div>
              </div>

                {/* Columna de Resultados */}
                <div className="bg-n-7/50 rounded-xl p-6 backdrop-blur-sm border border-n-6">
                  <h4 className="h4 mb-6 flex items-center gap-2">
                    <FaCarSide className="text-color-1 text-2xl" />
                    Tu Cotización
                  </h4>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                      <span className="text-n-3">Valor del Auto:</span>
                      <span className="text-xl font-semibold text-n-1">{formatCurrency(carPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                      <span className="text-n-3">Enganche:</span>
                      <span className="text-xl font-semibold text-n-1">{formatCurrency(downPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                      <span className="text-n-3">Monto a Financiar:</span>
                      <span className="text-xl font-semibold text-n-1">{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                      <span className="text-n-3">Plazo:</span>
                      <span className="text-xl font-semibold text-n-1">{termMonths} meses</span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6"
                  >
                    <Link
                      to={getSimulationLink()}
                      className="flex items-center justify-center gap-2 w-full bg-color-1 hover:bg-color-1/90 text-black font-semibold rounded-xl px-4 py-3 transition-colors duration-200"
                    >
                      Continuar con Simulación
                      <BsArrowRight />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
