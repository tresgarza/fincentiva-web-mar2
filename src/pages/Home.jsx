import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import Footer from "../components/Footer";
import ButtonGradient from "../assets/svg/ButtonGradient";
import { getProductInfo } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [showFinancingOptions, setShowFinancingOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeForm, setActiveForm] = useState('product');
  const [monthlyIncome, setMonthlyIncome] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Verificar autenticación al cargar la página
    const storedCompanyData = localStorage.getItem('companyData');
    if (!storedCompanyData) {
      navigate('/login');
    } else {
      setCompanyData(JSON.parse(storedCompanyData));
    }
  }, [navigate]);

  const handleProductSubmit = async (productLink, income, monthlyIncome) => {
    setIsLoading(true);
    setShowLoader(true);
    setError(null);
    
    try {
      const data = await getProductInfo(productLink);
      setProductData(data);
      setMonthlyIncome(income);
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/planes', { 
        state: { 
          productData: data, 
          monthlyIncome: income,
          companyData: companyData 
        } 
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching product data:", err);
    } finally {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/planes', { 
        state: { 
          productData: simulatedProduct, 
          monthlyIncome: income,
          companyData: companyData 
        } 
      });
    } catch (err) {
      setError(err.message);
      console.error("Error processing amount:", err);
    } finally {
      setShowLoader(false);
      setIsLoading(false);
    }
  };

  if (!companyData) {
    return null; // O un componente de carga
  }

  return (
    <div className="relative overflow-hidden">
      <Header />
      <Hero 
        activeForm={activeForm}
        setActiveForm={setActiveForm}
        showFinancingOptions={showFinancingOptions}
        handleProductSubmit={handleProductSubmit}
        handleAmountSubmit={handleAmountSubmit}
        isLoading={isLoading}
        companyData={companyData}
        showLoader={showLoader}
        productData={productData}
        monthlyIncome={monthlyIncome}
      />
      <Benefits />
      <Footer />
      <ButtonGradient />
    </div>
  );
};

export default Home; 