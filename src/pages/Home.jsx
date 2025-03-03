import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import Services from '../components/Services';
import CompanyLogos from '../components/CompanyLogos';
import Section from '../components/Section';
import { ScrollParallax } from 'react-just-parallax';
import Typewriter from 'typewriter-effect';
import { BackgroundCircles, Gradient } from '../components/design/Hero';
import BubbleSvg from '../assets/svg/BubbleSvg';
import Particles from '../components/design/Particles';

// Importar íconos para las soluciones financieras
import { FaCar, FaShoppingCart, FaUserTie } from 'react-icons/fa';
import { BsCashCoin, BsArrowRight } from 'react-icons/bs';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

const Home = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  const [isHovered, setIsHovered] = useState(null);
  
  // Referencias para animaciones al hacer scroll
  const solutionsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: solutionsRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8], [0, 1, 1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8], [0.8, 1, 1.05]);
  
  // Animaciones para los elementos del Hero
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Animaciones mejoradas para los elementos flotantes
  const floatingElements = [
    { icon: '💵', top: '15%', left: '10%', delay: 0, rotate: 15 },
    { icon: '🚗', top: '20%', right: '15%', delay: 0.5, rotate: -10 },
    { icon: '💳', bottom: '30%', left: '15%', delay: 1, rotate: 5 },
    { icon: '📱', bottom: '25%', right: '10%', delay: 1.5, rotate: -5 },
    { icon: '💰', top: '40%', left: '5%', delay: 2, rotate: 20 },
    { icon: '📊', top: '35%', right: '5%', delay: 2.5, rotate: -15 },
  ];
  
  // Nuevos elementos de fondo con burbujas y formas
  const backgroundShapes = [
    { type: 'circle', size: '10rem', top: '10%', left: '5%', color: 'from-color-1/20 to-transparent', delay: 0.2 },
    { type: 'circle', size: '15rem', bottom: '15%', right: '10%', color: 'from-color-2/20 to-transparent', delay: 0.5 },
    { type: 'blob', size: '20rem', top: '40%', right: '5%', color: 'from-color-1/10 to-transparent', delay: 0.8 },
    { type: 'blob', size: '25rem', bottom: '5%', left: '15%', color: 'from-color-2/10 to-transparent', delay: 1.2 },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <motion.div 
        className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#33FF57]/10 to-[#40E0D0]/10 blur-[120px] rounded-full"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#40E0D0]/10 to-[#33FF57]/10 blur-[120px] rounded-full"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        {/* Services Section - Moved to the top */}
        <Services />
        
        {/* Spacer for better separation */}
        <div className="h-10 md:h-16"></div>

        {/* Benefits Section */}
        <Benefits className="mb-10 md:mb-16" />
        
        {/* Spacer for better separation */}
        <div className="h-6 md:h-12"></div>
        
        {/* Soluciones Financieras Section - Enhanced with space around */}
        <Section className="mt-16 md:mt-24 mb-16">
          <div className="container">
            <motion.div
              ref={solutionsRef}
              style={{ opacity, scale }}
              className="relative z-1 max-w-[1120px] mx-auto text-center mb-12 md:mb-20"
            >
              <motion.h2 
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="h2 mb-6"
              >
                Soluciones Financieras{" "}
                <span className="text-gradient-primary">Avanzadas</span>
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="body-1 text-n-4 max-w-[680px] mx-auto"
              >
                Fincentiva ofrece soluciones de crédito innovadoras adaptadas a tus necesidades financieras.
              </motion.p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-[1120px] mx-auto"
            >
              {[
                {
                  icon: <FaCar className="text-3xl text-color-1" />,
                  title: "Crédito Automotriz",
                  description: "Financia el auto de tus sueños con los mejores plazos y tasas preferenciales.",
                  action: () => navigate('/auto-loan')
                },
                {
                  icon: <FaShoppingCart className="text-3xl text-color-1" />,
                  title: "Préstamos por Productos",
                  description: "Financia tus compras en línea con plazos flexibles y aprobación inmediata.",
                  action: () => navigate('/product-loan')
                },
                {
                  icon: <FaUserTie className="text-3xl text-color-1" />,
                  title: "Crédito vía Nómina",
                  description: "Accede a crédito preferencial con descuentos directos a tu nómina.",
                  action: () => navigate('/payroll-loan')
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 20px 40px -12px rgba(0, 166, 80, 0.2)"
                  }}
                  className="flex flex-col items-center p-8 bg-n-8 rounded-2xl border border-n-6 hover:border-color-1 transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  onClick={item.action}
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-color-1/40 to-color-2/40 flex items-center justify-center mb-6">
                    {item.icon}
      </div>
                  <h3 className="h5 mb-3">{item.title}</h3>
                  <p className="text-n-4 text-center mb-6">{item.description}</p>
                  <motion.div
                    animate={{
                      x: isHovered === index ? [0, 5, 0] : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center text-color-1 font-medium"
                  >
                    Explorar Opciones <BsArrowRight className="ml-2" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Decorative elements */}
            <Particles
              className="absolute inset-0"
              particleColor="from-color-1 to-color-2"
              speed={0.3}
              opacity={0.15}
            />
          </div>
        </Section>

        {/* Company Logos - Shows trusted partners */}
        <Section className="py-10 md:py-16">
          <div className="container">
            <CompanyLogos className="mb-10" />
          </div>
        </Section>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-[12.5rem] left-[10%] hidden xl:block">
          <ScrollParallax enableOnTouchDevice={false} isAbsolutelyPositioned lerpEase={0.05}>
            <BubbleSvg className="h-[30rem] text-color-1/20" />
          </ScrollParallax>
        </div>

        <div className="absolute top-[20rem] right-[10%] hidden xl:block">
          <ScrollParallax enableOnTouchDevice={false} isAbsolutelyPositioned lerpEase={0.05}>
            <BubbleSvg className="h-[30rem] text-color-2/20" />
          </ScrollParallax>
        </div>
      </div>
    </div>
  );
};

export default Home; 