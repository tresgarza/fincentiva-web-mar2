import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from "./Button";
import Section from "./Section";
import { FaLink, FaMoneyBillWave } from "react-icons/fa";
import { BsArrowRight, BsClipboard, BsCheckCircle } from "react-icons/bs";

const ProductLinkForm = ({ onSubmit = () => {}, isLoading, company, showLoader }) => {
  const [productLink, setProductLink] = useState('');
  const [income, setIncome] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maxCredit, setMaxCredit] = useState(null);

  const getPaymentFrequencyLabel = () => {
    switch (company?.payment_frequency) {
      case 'weekly': return 'semana';
      case 'biweekly': return 'quincena';
      case 'fortnightly': return 'catorcena';
      default: return 'mes';
    }
  };

  const calculateMaxCredit = (incomeAmount) => {
    if (!incomeAmount) return null;
    
    // El ingreso está en el periodo de la empresa (semanal, quincenal o mensual)
    // Calculamos el pago máximo por periodo (25% del ingreso)
    const maxPaymentPerPeriod = incomeAmount * 0.25;
    
    // Calculamos el monto máximo de crédito basado en la tasa de interés y el plazo máximo
    const annualRate = company?.interest_rate || 60; // 60% anual por defecto
    
    // Convertimos la tasa anual al periodo correspondiente
    let periodicRate;
    let maxPeriods;
    switch (company?.payment_frequency) {
      case 'weekly':
        periodicRate = annualRate / 100 / 52; // Tasa semanal
        maxPeriods = 52; // 52 semanas (1 año)
        break;
      case 'biweekly':
      case 'fortnightly':
        periodicRate = annualRate / 100 / 26; // Tasa quincenal
        maxPeriods = 26; // 26 quincenas (1 año)
        break;
      default:
        periodicRate = annualRate / 100 / 12; // Tasa mensual
        maxPeriods = 12; // 12 meses (1 año)
    }

    // Fórmula para calcular el monto máximo de préstamo considerando intereses
    // P = PMT * (1 - (1 + r)^-n) / r
    // Donde: P = Principal (monto máximo), PMT = Pago por periodo máximo, r = tasa por periodo, n = número de periodos
    const maxLoan = maxPaymentPerPeriod * (1 - Math.pow(1 + periodicRate, -maxPeriods)) / periodicRate;
    
    // Ajustamos el valor para considerar el IVA sobre intereses (16%)
    const maxLoanWithIVA = maxLoan / (1 + (periodicRate * maxPeriods * 0.16));
    
    // Retornamos el mínimo entre el máximo calculado y 100,000
    return Math.min(Math.floor(maxLoanWithIVA), 100000);
  };

  const validateLink = (url) => {
    try {
      const parsedUrl = new URL(url);
      const validDomains = [
        'amazon.com',
        'amazon.com.mx',
        'mercadolibre.com.mx',
        'mercadolibre.com',
      ];
      
      const isValidDomain = validDomains.some(domain => parsedUrl.hostname.endsWith(domain));
      
      if (!isValidDomain) {
        setError("Por favor ingresa un enlace válido de Amazon México o MercadoLibre México");
        return false;
      }
      
      return true;
    } catch (err) {
      setError("Por favor ingresa una URL válida");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isLoading) return;
    
    if (!validateLink(productLink)) return;
    if (!income) {
      setError("Por favor ingresa tus ingresos");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let monthlyIncome = parseFloat(income);
      switch (company?.payment_frequency) {
        case 'weekly':
          monthlyIncome = monthlyIncome * 4;
          break;
        case 'biweekly':
        case 'fortnightly':
          monthlyIncome = monthlyIncome * 2;
          break;
      }

      await onSubmit(productLink, parseFloat(income), monthlyIncome);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumberInput = (e, setter) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, '');
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setter(numValue.toString());
      if (setter === setIncome) {
        const calculatedMax = calculateMaxCredit(numValue);
        setMaxCredit(calculatedMax);
      }
    } else if (value === '') {
      setter('');
      if (setter === setIncome) {
        setMaxCredit(null);
      }
    }
    setError("");
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-n-7 rounded-2xl p-6 border border-n-6">
        <h3 className="h5 mb-4 text-color-1">Ingresa los detalles de tu producto</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="productLink" className="block text-n-4 mb-2">Enlace del Producto</label>
            <input
              type="url"
              id="productLink"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              placeholder="https://www.amazon.com.mx/producto..."
              className="w-full p-3 bg-n-6 rounded-lg text-n-1 border border-n-5 focus:border-color-1 focus:outline-none transition-colors"
              required
            />
            <p className="text-xs text-n-4 mt-1">Enlace de Amazon o Mercado Libre México</p>
          </div>
          
          <div>
            <label htmlFor="income" className="block text-n-4 mb-2">Ingreso Mensual</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4">$</span>
              <input
                type="number"
                id="income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="0"
                className="w-full p-3 pl-8 bg-n-6 rounded-lg text-n-1 border border-n-5 focus:border-color-1 focus:outline-none transition-colors"
                min="1"
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-color-1 hover:bg-color-2 text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Simular Financiamiento
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProductLinkForm; 