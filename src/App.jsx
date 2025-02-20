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

const App = () => {
  const [productData, setProductData] = useState(null);
  const [showFinancingOptions, setShowFinancingOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [activeForm, setActiveForm] = useState('product'); // 'product' o 'amount'
  const [monthlyIncome, setMonthlyIncome] = useState(null);

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

  const handleProductSubmit = async (productLink) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getProductInfo(productLink);
      setProductData(data);
      setShowFinancingOptions(true);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching product data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountSubmit = async (amount, income) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // El ingreso ya viene en el periodo correcto de la empresa
      // No necesitamos convertirlo a mensual aquí
      setMonthlyIncome(income);

      // Crear un objeto de producto simulado con el monto
      const simulatedProduct = {
        title: "Crédito en Efectivo",
        price: amount,
        features: ["Financiamiento directo", "Disponibilidad inmediata"]
      };
      setProductData(simulatedProduct);
      setShowFinancingOptions(true);
    } catch (err) {
      setError(err.message);
      console.error("Error processing amount:", err);
    } finally {
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
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-30 animate-pulse-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-[40rem] mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-color-1 via-color-2 to-color-3 bg-clip-text text-transparent">
                Fincentiva
              </h1>
              <div className="text-2xl text-n-3 h-20">
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
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-color-1 via-color-2 to-color-3 rounded-2xl opacity-75 blur animate-gradient"></div>
              
              <div className="relative bg-n-8 rounded-[1rem] p-8 shadow-2xl backdrop-blur-sm">
                <h3 className="h3 mb-6 text-center bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent">
                  Acceso Empresarial
                </h3>
                <CompanyAuth onAuthenticated={handleCompanyAuthenticated} />
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
        
        {/* Main Content Section */}
        <section className="container mx-auto px-4 py-4">
          {error && (
            <div className="max-w-[40rem] mx-auto mb-4">
              <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg">
                {error}
              </div>
            </div>
          )}
          
          <div className="w-full max-w-[1400px] mx-auto" id="get-started">
            {!showFinancingOptions ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-center gap-4">
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
                  />
                ) : (
                  <CreditAmountForm
                    onSubmit={handleAmountSubmit}
                    isLoading={isLoading}
                    company={companyData}
                  />
                )}
              </div>
            ) : (
              <FinancingOptions
                product={productData}
                company={{...companyData, monthly_income: monthlyIncome}}
                onSelectPlan={handlePlanSelection}
                onBack={handleBack}
              />
            )}
          </div>
        </section>

        <Benefits />
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
