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

  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        
        {error && (
          <div className="container mx-auto px-4 py-2">
            <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg">
              {error}
            </div>
          </div>
        )}
        
        {!companyData ? (
          <CompanyAuth onAuthenticated={handleCompanyAuthenticated} />
        ) : !showFinancingOptions ? (
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

        <Benefits />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;
