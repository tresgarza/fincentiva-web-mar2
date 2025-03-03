import React from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import CompanyAuth from '../components/CompanyAuth';
import logoCartotec from '../assets/logos/logo_empresa_cartotec.png';
import logoCadtoner from '../assets/logos/Logo_empresa_cadtoner.png';
import logoEtimex from '../assets/logos/logo_empresa_etimex.png';
import logoFortezza from '../assets/logos/logo_empresa_fortezza.png';
import logoPlastypel from '../assets/logos/logo_empresa_plastypel.png';
import logoUnoretail from '../assets/logos/logo_empresa_unoretail.png';
import logoMatamoros from '../assets/logos/logo_empresa_matamoros.png';
import logoLogistorage from '../assets/logos/logo_empresa_logistorage.png';
import logoMulligans from '../assets/logos/logo_empresa_mulligans.png';
import logoVallealto from '../assets/logos/logo_empresa_vallealto.png';

const Login = () => {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Section className="mt-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container">
          <div className="max-w-md mx-auto">
            <h1 className="h2 mb-6 text-center">Acceso Empresarial</h1>
            <p className="body-2 mb-8 text-n-4 text-center">
              Inicia sesión para gestionar los créditos de nómina de tus empleados
            </p>
            
            <CompanyAuth />
          </div>
        </motion.div>
      </Section>
      
      {/* Beneficios para empresas */}
      <Section className="mt-16">
        <div className="container">
          <h2 className="h3 mb-10 text-center">Beneficios del Portal Empresarial</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Gestión Centralizada",
                description: "Administra todas las solicitudes de crédito de tus empleados desde un solo lugar."
              },
              {
                title: "Reportes Detallados",
                description: "Accede a informes y analíticas sobre los créditos otorgados a tu personal."
              },
              {
                title: "Proceso Automatizado",
                description: "Sistema automatizado de descuentos vía nómina sin intervención manual."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1/50 transition-colors"
              >
                <h3 className="h5 mb-3 text-color-1">{benefit.title}</h3>
                <p className="text-n-4">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Trusted By Section */}
      <div className="mt-20 py-10 bg-n-8/50 backdrop-blur-sm rounded-2xl">
        <h3 className="text-center text-2xl font-bold mb-8">Confían en nosotros</h3>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-scroll-logos py-6 flex items-center justify-around min-w-full whitespace-nowrap">
            {[
              { src: logoCartotec, alt: "Cartotec" },
              { src: logoCadtoner, alt: "Cadtoner" },
              { src: logoEtimex, alt: "Etimex" },
              { src: logoFortezza, alt: "Fortezza" },
              { src: logoPlastypel, alt: "Plastypel" },
              { src: logoUnoretail, alt: "Unoretail" },
              { src: logoMatamoros, alt: "Matamoros" },
              { src: logoLogistorage, alt: "Logistorage" },
              { src: logoMulligans, alt: "Mulligans" },
              { src: logoVallealto, alt: "Valle Alto" }
            ].map((logo, index) => (
              <div key={index} className="mx-8">
                <img 
                  src={logo.src} 
                  alt={logo.alt}
                  className="h-24 object-contain hover:scale-110 transition-transform duration-300 bg-white/50 backdrop-blur-sm rounded-lg p-4"
                />
              </div>
            ))}
          </div>
          <div className="animate-scroll-logos py-6 flex items-center justify-around min-w-full whitespace-nowrap">
            {[
              { src: logoCartotec, alt: "Cartotec" },
              { src: logoCadtoner, alt: "Cadtoner" },
              { src: logoEtimex, alt: "Etimex" },
              { src: logoFortezza, alt: "Fortezza" },
              { src: logoPlastypel, alt: "Plastypel" },
              { src: logoUnoretail, alt: "Unoretail" },
              { src: logoMatamoros, alt: "Matamoros" },
              { src: logoLogistorage, alt: "Logistorage" },
              { src: logoMulligans, alt: "Mulligans" },
              { src: logoVallealto, alt: "Valle Alto" }
            ].map((logo, index) => (
              <div key={index} className="mx-8">
                <img 
                  src={logo.src} 
                  alt={logo.alt}
                  className="h-24 object-contain hover:scale-110 transition-transform duration-300 bg-white/50 backdrop-blur-sm rounded-lg p-4"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 