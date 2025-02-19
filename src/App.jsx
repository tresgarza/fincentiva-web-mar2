import { useState } from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductLinkForm from "./components/ProductLinkForm";
import FinancingOptions from "./components/FinancingOptions";
import CompanyAuth from "./components/CompanyAuth";
import { getProductInfo } from "./services/api";

const App = () => {
  const [productData, setProductData] = useState(null);
  const [showFinancingOptions, setShowFinancingOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);

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

  const handleCompanyAuthenticated = (company) => {
    setCompanyData(company);
  };

  const handlePlanSelection = (planId) => {
    // TODO: Implement financing application process
    console.log("Selected plan:", planId);
    // Navigate to application form or checkout
  };

  // If not authenticated, show only the auth form
  if (!companyData) {
    return (
      <div className="min-h-screen bg-n-8 text-n-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-[40rem] mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Fincentiva</h1>
              <p className="text-n-3">Financiamiento instantáneo para tus compras en línea</p>
            </div>
            <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
              <div className="relative bg-n-8 rounded-[1rem] p-8">
                <h3 className="h3 mb-4 text-center">Acceso Empresarial</h3>
                <CompanyAuth onAuthenticated={handleCompanyAuthenticated} />
              </div>
            </div>
          </div>
        </div>
        <ButtonGradient />
      </div>
    );
  }

  // Once authenticated, show the full application
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        
        {/* Main Content Section */}
        <section className="container mx-auto px-4 py-12">
          {error && (
            <div className="max-w-[40rem] mx-auto mb-8">
              <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg">
                {error}
              </div>
            </div>
          )}
          
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
              <div className="relative bg-n-8 rounded-[1rem] p-8">
                {!showFinancingOptions ? (
                  <ProductLinkForm 
                    onSubmit={handleProductSubmit}
                    isLoading={isLoading}
                  />
                ) : (
                  <FinancingOptions
                    product={productData}
                    company={companyData}
                    onSelectPlan={handlePlanSelection}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <Benefits />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;
