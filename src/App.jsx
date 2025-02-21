import { useState, useEffect } from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductLinkForm from "./components/ProductLinkForm";
import CreditAmountForm from "./components/CreditAmountForm";
import FinancingOptions from "./components/FinancingOptions";
import CompanyAuth from "./components/CompanyAuth";
import { getProductInfo } from "./services/api";
import Typewriter from 'typewriter-effect';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const App = () => {
  const [productData, setProductData] = useState(null);
  const [showFinancingOptions, setShowFinancingOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [activeForm, setActiveForm] = useState('product'); // 'product' o 'amount'
  const [monthlyIncome, setMonthlyIncome] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  // Exponer setActiveForm globalmente
  useEffect(() => {
    window.setActiveForm = (formType) => {
      setActiveForm(formType);
      // Dar tiempo para que el estado se actualice antes de hacer scroll
      setTimeout(() => {
        const element = document.getElementById('get-started');
        if (element) {
          const offset = element.offsetTop - 100; // Ajustar el offset para que quede más arriba
          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });
        }
      }, 100);
    };

    return () => {
      delete window.setActiveForm;
    };
  }, []);

  const handleProductSubmit = async (productLink, income, monthlyIncome) => {
    setIsLoading(true);
    setShowLoader(true);
    setError(null);
    
    try {
      const data = await getProductInfo(productLink);
      setProductData(data);
      setMonthlyIncome(income);
      
      // Esperamos a que los datos estén listos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostramos las opciones de financiamiento
      setShowFinancingOptions(true);
      
      // El loader se mantendrá hasta que FinancingOptions llame a onLoaded
    } catch (err) {
      setError(err.message);
      console.error("Error fetching product data:", err);
      setShowLoader(false);
      setIsLoading(false);
    }
  };

  const handleAmountSubmit = async (amount, income) => {
    setIsLoading(true);
    setShowLoader(true);
    setError(null);
    
    try {
      setMonthlyIncome(income);

      const simulatedProduct = {
        title: "Crédito en Efectivo",
        price: amount,
        features: ["Financiamiento directo", "Disponibilidad inmediata"]
      };
      
      // Esperamos a que los datos estén listos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Establecemos el producto y mostramos las opciones
      setProductData(simulatedProduct);
      setShowFinancingOptions(true);
      
      // El loader se mantendrá hasta que FinancingOptions llame a onLoaded
    } catch (err) {
      setError(err.message);
      console.error("Error processing amount:", err);
      setShowLoader(false);
      setIsLoading(false);
    }
  };

  const handleCompanyAuthenticated = (company) => {
    setCompanyData(company);
  };

  const handlePlanSelection = (planId) => {
    // TODO: Implement financing application process
    console.log("Selected plan:", planId);
  };

  const handleBack = () => {
    setShowFinancingOptions(false);
    setProductData(null);
    setError(null);
  };

  // Si no está autenticado, mostrar solo el formulario de autenticación
  if (!companyData) {
    return (
      <div className="min-h-screen bg-n-8 text-n-1 relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#33FF57] to-[#40E0D0] opacity-30 animate-pulse-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-[90rem] mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-[#33FF57] via-[#40E0D0] to-[#3FD494] bg-clip-text text-transparent">
                Fincentiva
              </h1>
              <div className="text-3xl text-n-3 h-20 mb-4">
                <Typewriter
                  options={{
                    strings: [
                      'Financia tus sueños...',
                      'Compra muebles...',
                      'Adquiere electrodomésticos...',
                      'Renueva tu tecnología...',
                      'Lo que necesites en los mejores marketplace de México'
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                  }}
                />
              </div>
              <p className="text-n-3 text-xl max-w-3xl mx-auto">
                Plataforma empresarial de financiamiento que permite a tus empleados adquirir productos y servicios con facilidades de pago
              </p>
            </div>

            <div className="flex flex-wrap gap-8 items-stretch justify-center">
              {/* Login Form */}
              <div className="w-full max-w-[28rem]">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#33FF57] via-[#40E0D0] to-[#3FD494] rounded-2xl opacity-75 blur animate-gradient"></div>
                  
                  <div className="relative bg-n-8 rounded-[1rem] p-8 shadow-2xl backdrop-blur-sm">
                    <h3 className="h3 mb-6 text-center bg-gradient-to-r from-[#33FF57] to-[#40E0D0] bg-clip-text text-transparent">
                      Portal Empresarial
                    </h3>
                    <CompanyAuth onAuthenticated={handleCompanyAuthenticated} />
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="w-full max-w-[40rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Feature 1 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-n-7/50 border border-n-6 hover:border-[#33FF57]/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#33FF57]/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#33FF57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-n-1">Gestión Simplificada</h3>
                    </div>
                    <p className="text-n-3">Control total sobre las solicitudes de financiamiento de tus empleados desde un solo lugar.</p>
                  </motion.div>

                  {/* Feature 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl bg-n-7/50 border border-n-6 hover:border-[#40E0D0]/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#40E0D0]/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#40E0D0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-n-1">Pagos Flexibles</h3>
                    </div>
                    <p className="text-n-3">Opciones de pago adaptadas a las necesidades y capacidades de cada empleado.</p>
                  </motion.div>

                  {/* Feature 3 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-xl bg-n-7/50 border border-n-6 hover:border-[#4DE8B2]/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#4DE8B2]/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#4DE8B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-n-1">Respuesta Inmediata</h3>
                    </div>
                    <p className="text-n-3">Aprobación instantánea y cálculo automático de capacidad crediticia en tiempo real.</p>
                  </motion.div>

                  {/* Feature 4 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 rounded-xl bg-n-7/50 border border-n-6 hover:border-[#3FD494]/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#3FD494]/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#3FD494]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-n-1">Máxima Seguridad</h3>
                    </div>
                    <p className="text-n-3">Protección de datos y transacciones con los más altos estándares de seguridad.</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Sección de Logos de Empresas */}
            <div className="mt-20 text-center">
              <h4 className="text-n-3 mb-8">Empresas que confían en nosotros</h4>
              <div className="relative overflow-hidden">
                <div className="flex animate-scroll-logos gap-8 items-center">
                  {[
                    'cadtoner',
                    'etimex',
                    'fortezza',
                    'plastypel',
                    'unoretail',
                    'matamoros',
                    'logistorage',
                    'mulligans',
                    'vallealto',
                    'cartotec'
                  ].map((empresa, index) => (
                    <div 
                      key={index}
                      className="flex-none bg-white/50 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
                    >
                      <img
                        src={`/src/assets/logos/logo_empresa_${empresa}.png`}
                        alt={`Logo ${empresa}`}
                        className="h-24 w-auto object-contain"
                      />
                    </div>
                  ))}
                  {/* Duplicamos los logos para el efecto infinito */}
                  {[
                    'cadtoner',
                    'etimex',
                    'fortezza',
                    'plastypel',
                    'unoretail',
                    'matamoros',
                    'logistorage',
                    'mulligans',
                    'vallealto',
                    'cartotec'
                  ].map((empresa, index) => (
                    <div 
                      key={`duplicate-${index}`}
                      className="flex-none bg-white/50 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
                    >
                      <img
                        src={`/src/assets/logos/logo_empresa_${empresa}.png`}
                        alt={`Logo ${empresa}`}
                        className="h-24 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ButtonGradient />
      </div>
    );
  }

  // Una vez autenticado, mostrar la aplicación completa
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        
        <section className="container mx-auto px-4 py-4">
          {error && (
            <div className="max-w-[40rem] mx-auto mb-4">
              <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg">
                {error}
              </div>
            </div>
          )}
          
          <div className="w-full max-w-[1400px] mx-auto" id="get-started">
            {/* Loader Global */}
            <AnimatePresence>
              {showLoader && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 flex items-center justify-center z-50 bg-n-8/90 backdrop-blur-sm"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-[#33FF57] rounded-full animate-spin border-t-transparent"></div>
                    <div className="w-16 h-16 border-4 border-[#40E0D0] rounded-full animate-spin-slow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-t-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-[#33FF57] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute mt-32 text-n-1 text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <span className="animate-pulse">Calculando tus opciones de financiamiento</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#33FF57] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-[#33FF57] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-[#33FF57] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contenido Principal */}
            <div className="relative">
              {/* Formularios */}
              {!showFinancingOptions && (
                <div>
                  <div className="flex justify-center gap-4 mb-4">
                    <button
                      onClick={() => setActiveForm('product')}
                      className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                        activeForm === 'product'
                          ? 'bg-[#33FF57] text-black'
                          : 'bg-n-7 text-n-1 hover:bg-n-6'
                      }`}
                    >
                      Financiar Producto
                    </button>
                    <button
                      onClick={() => setActiveForm('amount')}
                      className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                        activeForm === 'amount'
                          ? 'bg-[#33FF57] text-black'
                          : 'bg-n-7 text-n-1 hover:bg-n-6'
                      }`}
                    >
                      Solicitar Efectivo
                    </button>
                  </div>
                  
                  {activeForm === 'product' ? (
                    <ProductLinkForm 
                      onSubmit={handleProductSubmit}
                      isLoading={isLoading}
                      company={companyData}
                      showLoader={showLoader}
                    />
                  ) : (
                    <CreditAmountForm
                      onSubmit={handleAmountSubmit}
                      isLoading={isLoading}
                      company={companyData}
                      showLoader={showLoader}
                    />
                  )}
                </div>
              )}

              {/* Opciones de Financiamiento */}
              {showFinancingOptions && (
                <div>
                  <FinancingOptions
                    product={productData}
                    company={{...companyData, monthly_income: monthlyIncome}}
                    onSelectPlan={handlePlanSelection}
                    onBack={handleBack}
                    onLoaded={() => {
                      setShowLoader(false);
                      setIsLoading(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Benefits y Footer */}
        {!showFinancingOptions && <Benefits />}
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

// Export the RouterProvider component with our router configuration
export default function AppWrapper() {
  return <RouterProvider router={router} />;
}
