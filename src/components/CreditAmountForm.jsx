import { useState, useEffect } from "react";
import Button from "./Button";
import Section from "./Section";
import { FaMoneyBillWave } from "react-icons/fa";

const CreditAmountForm = ({ onSubmit, isLoading, company }) => {
  const [income, setIncome] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [maxCredit, setMaxCredit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // El ingreso ya está en el periodo de la empresa (semanal, quincenal o mensual)
    // Calculamos el pago máximo por periodo (25% del ingreso)
    const maxPaymentPerPeriod = incomeAmount * 0.25;
    
    // Convertimos el pago máximo por periodo a mensual para calcular el préstamo
    let maxMonthlyPayment = maxPaymentPerPeriod;
    switch (company?.payment_frequency) {
      case 'weekly':
        maxMonthlyPayment = maxPaymentPerPeriod * 4;
        break;
      case 'biweekly':
      case 'fortnightly':
        maxMonthlyPayment = maxPaymentPerPeriod * 2;
        break;
    }

    // Calculamos el monto máximo de crédito basado en la tasa de interés y el plazo máximo
    const annualRate = company?.interest_rate || 60; // 60% anual por defecto
    const monthlyRate = annualRate / 100 / 12;
    const maxMonths = 12; // plazo máximo en meses

    // Fórmula para calcular el monto máximo de préstamo considerando intereses
    // P = PMT * (1 - (1 + r)^-n) / r
    // Donde: P = Principal (monto máximo), PMT = Pago mensual máximo, r = tasa mensual, n = número de meses
    const maxLoan = maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -maxMonths)) / monthlyRate;
    
    // Ajustamos el valor para considerar el IVA sobre intereses (16%)
    const maxLoanWithIVA = maxLoan / (1 + (monthlyRate * maxMonths * 0.16));
    
    // Retornamos el mínimo entre el máximo calculado y 100,000
    return Math.min(Math.floor(maxLoanWithIVA), 100000);
  };

  useEffect(() => {
    if (income) {
      const calculatedMax = calculateMaxCredit(parseFloat(income));
      setMaxCredit(calculatedMax);
      
      // Si el monto actual excede el máximo calculado, limpiamos el campo
      if (parseFloat(amount) > calculatedMax) {
        setAmount("");
        setError(`El monto solicitado excede tu capacidad de pago máxima de ${formatCurrency(calculatedMax)}`);
      }
    }
  }, [income]);

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError("Por favor ingresa un monto válido");
      return false;
    }
    if (numValue < 1000) {
      setError("El monto mínimo es de $1,000 MXN");
      return false;
    }
    if (numValue > 100000) {
      setError("El monto máximo es de $100,000 MXN");
      return false;
    }
    if (maxCredit && numValue > maxCredit) {
      setError(`El monto excede tu capacidad de pago máxima de ${formatCurrency(maxCredit)}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isLoading) return;

    if (!income) {
      setError("Por favor ingresa primero tus ingresos");
      return;
    }

    if (!validateAmount(amount)) return;

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(parseFloat(amount), parseFloat(income));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    // Convertir a número y formatear sin decimales forzados
    const number = parseFloat(value);
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const handleNumberInput = (e, setter) => {
    let value = e.target.value;
    // Eliminar todo excepto números
    value = value.replace(/[^\d]/g, '');
    // Convertir a número
    const numValue = parseInt(value, 10);
    // Si es un número válido, actualizamos el estado
    if (!isNaN(numValue)) {
      setter(numValue.toString());
    } else if (value === '') {
      setter('');
    }
    setError("");
  };

  return (
    <Section id="credit-amount" className="py-10">
      <div className="container">
        <div className="max-w-[40rem] mx-auto">
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-r from-[#40E0D0] via-[#4DE8B2] to-[#3FD494] overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0" 
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transform: 'translateX(-100%)',
                  animation: 'gradient-slide 3s linear infinite'
                }}
              />
            </div>

            <div className="relative bg-[#0D1117] rounded-2xl p-8">
              <div className="flex items-center justify-center mb-6">
                <FaMoneyBillWave className="text-[#40E0D0] text-4xl animate-pulse" />
              </div>
              <h3 className="h3 mb-4 text-center">Solicita tu Crédito</h3>
              <p className="body-2 text-n-4 mb-8 text-center">
                Ingresa tus datos para calcular tu capacidad de crédito
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Campo de Ingresos */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="income" className="text-n-4 text-sm">
                    ¿Cuánto ganas por {getPaymentFrequencyLabel()}?
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-n-4">
                      $
                    </span>
                    <input
                      type="text"
                      id="income"
                      value={income}
                      onChange={(e) => handleNumberInput(e, setIncome)}
                      placeholder="0"
                      className="w-full px-12 py-3 rounded-lg bg-[#1A1F26] text-white placeholder-gray-500 border border-[#2D3643] focus:outline-none focus:border-[#40E0D0] transition-colors text-right pr-20"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-n-4 ml-2">
                      MXN
                    </span>
                  </div>
                </div>

                {/* Campo de Monto Solicitado */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="creditAmount" className="text-n-4 text-sm">
                    Monto Solicitado
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-n-4">
                      $
                    </span>
                    <input
                      type="text"
                      id="creditAmount"
                      value={amount}
                      onChange={(e) => handleNumberInput(e, setAmount)}
                      placeholder="0"
                      className="w-full px-12 py-3 rounded-lg bg-[#1A1F26] text-white placeholder-gray-500 border border-[#2D3643] focus:outline-none focus:border-[#40E0D0] transition-colors text-right pr-20"
                      required
                      disabled={!income}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-n-4 ml-2">
                      MXN
                    </span>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                <div className="text-center text-sm text-gray-400">
                  {maxCredit ? (
                    <div className="p-3 bg-[#1A1F26] rounded-lg border border-[#2D3643]">
                      <p className="text-[#40E0D0] font-medium">
                        Tu capacidad máxima de crédito es de {formatCurrency(maxCredit)}
                      </p>
                      <p className="text-xs mt-1">
                        Basado en el 25% de tus ingresos mensuales
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>Monto mínimo: $1,000 MXN</div>
                      <div>Monto máximo: $100,000 MXN</div>
                    </>
                  )}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#40E0D0] to-[#3FD494] hover:from-[#3FD494] hover:to-[#40E0D0] text-black font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  type="submit"
                  disabled={isSubmitting || isLoading || !income}
                >
                  {isSubmitting || isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    "VER OPCIONES DE FINANCIAMIENTO"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Section>
  );
};

export default CreditAmountForm; 