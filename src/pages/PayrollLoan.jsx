import React from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import CompanyAuth from '../components/CompanyAuth';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';

// Importar logos de empresas
import logoUnoretail from '../assets/logos/logo_empresa_unoretail.png';
import logoVallealto from '../assets/logos/logo_empresa_vallealto.png';
import logoMulligans from '../assets/logos/logo_empresa_mulligans.png';
import logoPlastypel from '../assets/logos/logo_empresa_plastypel.png';
import logoFortezza from '../assets/logos/logo_empresa_fortezza.png';
import logoLogistorage from '../assets/logos/logo_empresa_logistorage.png';
import logoMatamoros from '../assets/logos/logo_empresa_matamoros.png';
import logoCartotec from '../assets/logos/logo_empresa_cartotec.png';
import logoEtimex from '../assets/logos/logo_empresa_etimex.png';
import logoCadtoner from '../assets/logos/Logo_empresa_cadtoner.png';

const PayrollLoan = () => {
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      {/* Hero Section */}
      <Section className="mt-[2rem]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="container">
          <motion.div variants={fadeInUpVariant} className="text-center max-w-4xl mx-auto">
            <h1 className="h1 mb-6">Créditos vía Nómina</h1>
            <p className="body-1 mb-8 text-n-4">
              Impulsa el bienestar financiero de tus empleados con nuestra solución de créditos vía nómina.
              Acceso a efectivo y productos con descuento directo de nómina.
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://fincentiva-feb21-2025-front.vercel.app/login" 
                className="min-w-[200px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full">
                  Acceso Empresarial
                </Button>
              </a>
              <Link 
                to="/register" 
                className="min-w-[200px]"
              >
                <Button variant="secondary" className="w-full">
                  Registrar Empresa
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={fadeInUpVariant}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: "💳",
                title: "Efectivo y Productos",
                description: "Tus empleados pueden solicitar efectivo o comprar en Amazon y Mercado Libre con descuento vía nómina"
              },
              {
                icon: "🔒",
                title: "Proceso Simple y Seguro",
                description: "Sistema automatizado para retenciones y pagos, sin complicaciones administrativas"
              },
              {
                icon: "✨",
                title: "Sin Costo Empresarial",
                description: "Beneficio sin costo para tu empresa, mejorando el paquete de prestaciones"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariant}
                className="bg-n-8 rounded-2xl p-8 hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="h5 mb-3">{feature.title}</h3>
                <p className="text-n-4">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Section>

      {/* Process Section */}
      <Section className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="container">
          <motion.div variants={fadeInUpVariant} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="h2 mb-4">¿Cómo Funciona?</h2>
            <p className="body-1 text-n-4">
              Un proceso simple y transparente para ofrecer créditos a tus empleados
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Afiliación",
                description: "Firma el convenio de colaboración con Fincentiva"
              },
              {
                step: "02",
                title: "Solicitud",
                description: "Tus empleados solicitan el crédito que necesitan"
              },
              {
                step: "03",
                title: "Aprobación",
                description: "Evaluamos y aprobamos en 24-48 horas"
              },
              {
                step: "04",
                title: "Descuento",
                description: "Retención automática vía nómina"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariant}
                className="relative"
              >
                <div className="bg-n-8 rounded-2xl p-8 h-full">
                  <div className="text-color-1 text-xl font-bold mb-4">{step.step}</div>
                  <h3 className="h5 mb-3">{step.title}</h3>
                  <p className="text-n-4">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <svg className="w-8 h-8 text-color-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA after Process Section */}
          <motion.div
            variants={fadeInUpVariant}
            className="flex justify-center gap-6 mt-16">
            <Link 
              to="/register" 
              className="min-w-[200px]"
            >
              <Button variant="primary" className="w-full group">
                <span className="flex items-center gap-2">
                  Comienza Ahora
                  <BsArrowRight className="transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Section>

      {/* Video Demos Section */}
      <Section className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="container">
          <motion.div variants={fadeInUpVariant} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="h2 mb-4">¿Cómo Solicitar un Crédito?</h2>
            <p className="body-1 text-n-4">
              Mira estos videos demostrativos de cómo funciona nuestra plataforma
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video 1: Financiamiento de Productos */}
            <motion.div
              variants={fadeInUpVariant}
              className="bg-n-8 rounded-2xl p-6 overflow-hidden">
              <h3 className="h4 mb-4">Financiamiento de Productos</h3>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  webkit-playsinline="true">
                  <source src="/videos/FINANCIAMIENTO_PRODUCTOS.mov" type="video/mp4" />
                  <source src="/videos/FINANCIAMIENTO_PRODUCTOS.mov" type="video/quicktime" />
                  Tu navegador no soporta el elemento de video.
                </video>
                  </div>
              <p className="mt-4 text-n-4">
                Aprende cómo puedes financiar productos de Amazon y Mercado Libre con descuento vía nómina
              </p>
            </motion.div>

            {/* Video 2: Financiamiento en Efectivo */}
            <motion.div
              variants={fadeInUpVariant}
              className="bg-n-8 rounded-2xl p-6 overflow-hidden">
              <h3 className="h4 mb-4">Financiamiento en Efectivo</h3>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  webkit-playsinline="true">
                  <source src="/videos/FINANCIAMIENTO_EFECTIVO.mov" type="video/mp4" />
                  <source src="/videos/FINANCIAMIENTO_EFECTIVO.mov" type="video/quicktime" />
                  Tu navegador no soporta el elemento de video.
                </video>
                </div>
              <p className="mt-4 text-n-4">
                Descubre el proceso simple para solicitar un préstamo en efectivo a través de nuestra plataforma
              </p>
            </motion.div>
                  </div>
        </motion.div>
      </Section>

      {/* Benefits Section */}
      <Section id="benefits" className="mt-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div variants={fadeInUpVariant} className="bg-n-8 rounded-2xl p-8">
              <h2 className="h3 mb-8">Beneficios para tu Empresa</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: "💰",
                    title: "Sin Costo ni Riesgo",
                    description: "El servicio es gratuito y Fincentiva asume el riesgo crediticio"
                  },
                  {
                    icon: "🤝",
                    title: "Retención de Talento",
                    description: "Mejora el paquete de prestaciones y la satisfacción laboral"
                  },
                  {
                    icon: "⚡",
                    title: "Proceso Automatizado",
                    description: "Sistema eficiente para el manejo de descuentos vía nómina"
                  },
                  {
                    icon: "📊",
                    title: "Reportes Detallados",
                    description: "Acceso a informes y estados de cuenta en tiempo real"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUpVariant}
                    className="flex items-start gap-4 hover:bg-n-7 p-4 rounded-xl transition-colors">
                    <div className="text-3xl">{benefit.icon}</div>
                  <div>
                      <h3 className="h6 mb-2">{benefit.title}</h3>
                      <p className="text-n-4">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
                  </div>
            </motion.div>

            <motion.div variants={fadeInUpVariant} className="bg-n-8 rounded-2xl p-8">
              <h2 className="h3 mb-8">Beneficios para Empleados</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: "✅",
                    title: "Acceso Simple",
                    description: "Sin aval y con respuesta rápida, incluso con historial crediticio limitado"
                  },
                  {
                    icon: "🛍️",
                    title: "Compras en Línea",
                    description: "Acceso a productos de Amazon y Mercado Libre con descuento vía nómina"
                  },
                  {
                    icon: "📅",
                    title: "Pagos Automáticos",
                    description: "Descuentos directos de nómina sin preocupaciones de fechas de pago"
                  },
                  {
                    icon: "💼",
                    title: "Montos Flexibles",
                    description: "Préstamos adaptados a tu capacidad de pago"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUpVariant}
                    className="flex items-start gap-4 hover:bg-n-7 p-4 rounded-xl transition-colors">
                    <div className="text-3xl">{benefit.icon}</div>
                    <div>
                      <h3 className="h6 mb-2">{benefit.title}</h3>
                      <p className="text-n-4">{benefit.description}</p>
                </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* CTA Section before Stats */}
      <Section className="mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="container">
          <motion.div
            variants={fadeInUpVariant}
            className="bg-n-8/80 backdrop-blur-sm border border-n-6 rounded-2xl p-10 text-center">
            <h2 className="h3 mb-4">¿Listo para Empezar?</h2>
            <p className="body-1 text-n-4 mb-8 max-w-2xl mx-auto">
              Únete a las empresas que ya están brindando beneficios financieros a sus empleados con Fincentiva
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="min-w-[200px]"
              >
                <Button variant="primary" className="w-full group">
                  <span className="flex items-center gap-2">
                    Registrar Empresa
                    <BsArrowRight className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <a 
                href="https://fincentiva-feb21-2025-front.vercel.app/login" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#40E0D0] to-[#4DE8B2] text-n-8 font-medium rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-color-1/20 hover:scale-105 group"
              >
                <span className="text-lg relative">
                  Acceder al Portal Empresarial
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-n-8 group-hover:w-full transition-all duration-300" />
                </span>
                <BsArrowRight className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* Stats Section */}
      <Section className="mt-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "15+", label: "Años de Experiencia" },
              { number: "50+", label: "Empresas Afiliadas" },
              { number: "50,000+", label: "Créditos Otorgados" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-n-8 rounded-xl p-8 text-center hover:scale-105 transition-transform duration-300"
              >
                <h3 className="h2 text-color-1 mb-2">{stat.number}</h3>
                <p className="text-n-4">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeInUpVariant}
            className="mt-20 text-center"
          >
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="min-w-[200px]"
              >
                <Button variant="primary" className="w-full group">
                  <span className="flex items-center gap-2">
                    Registrar Empresa
                    <BsArrowRight className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <a 
                href="https://fincentiva-feb21-2025-front.vercel.app/login" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#40E0D0] to-[#4DE8B2] text-n-8 font-medium rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-color-1/20 hover:scale-105 group"
              >
                <span className="text-lg relative">
                  Acceder al Portal Empresarial
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-n-8 group-hover:w-full transition-all duration-300" />
                </span>
                <BsArrowRight className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Trusted Companies Section */}
      <Section className="mt-20 mb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="container"
        >
          <motion.div variants={fadeInUpVariant} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="h2 mb-4">Empresas que Confían en Nosotros</h2>
            <p className="body-1 text-n-4">
              Nos respaldan las empresas más importantes de México, brindando beneficios financieros a sus empleados
            </p>
          </motion.div>

          <div className="relative overflow-hidden py-10">
            <motion.div
              variants={fadeInUpVariant}
              className="flex flex-wrap justify-center gap-8"
            >
              {[
                { name: "Unoretail", logo: logoUnoretail },
                { name: "Valle Alto", logo: logoVallealto },
                { name: "Mulligans", logo: logoMulligans },
                { name: "Plastypel", logo: logoPlastypel },
                { name: "Fortezza", logo: logoFortezza },
                { name: "Logistorage", logo: logoLogistorage },
                { name: "Matamoros", logo: logoMatamoros },
                { name: "Cartotec", logo: logoCartotec },
                { name: "Etimex", logo: logoEtimex },
                { name: "Cadtoner", logo: logoCadtoner }
              ].map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    filter: "brightness(1.2)",
                    boxShadow: "0 20px 40px -20px rgba(0, 166, 80, 0.2)"
                  }}
                  className="relative w-[200px] h-[120px] bg-n-7 rounded-2xl p-6 flex items-center justify-center border border-n-6 hover:border-color-1/30 transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-n-8/80 to-n-8/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <motion.img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                    style={{ maxWidth: "150px", maxHeight: "80px" }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -bottom-2 left-0 w-full text-center transform translate-y-full"
                  >
                    <div className="bg-n-8/90 text-n-1 text-sm py-1 px-3 rounded-full mx-auto inline-block backdrop-blur-sm border border-n-6">
                      {company.name}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient overlays for infinite scroll effect */}
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-n-8 to-transparent z-10" />
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-n-8 to-transparent z-10" />
          </div>

          <motion.div
            variants={fadeInUpVariant}
            className="mt-20 text-center"
          >
            <a 
              href="https://fincentiva-feb21-2025-front.vercel.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#40E0D0] to-[#4DE8B2] text-n-8 font-medium rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-color-1/20 hover:scale-105 group"
            >
              <span className="text-lg relative">
                Acceder al Portal Empresarial
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-n-8 group-hover:w-full transition-all duration-300" />
              </span>
              <BsArrowRight className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
};

export default PayrollLoan; 