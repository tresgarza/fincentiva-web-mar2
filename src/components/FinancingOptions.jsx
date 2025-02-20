import { useState, useEffect } from 'react';
import Button from "./Button";
import { Gradient } from "./design/Hero";
import { API_URL } from '../config/api';

const FinancingOptions = ({ product, company, onSelectPlan }) => {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const calculatePayments = async () => {
      try {
        const response = await fetch(`${API_URL}/companies/calculate-payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyId: company.id,
            amount: product.price
          })
        });

        if (!response.ok) {
          throw new Error('Error al calcular las opciones de pago');
        }

        const data = await response.json();
        setPaymentOptions(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    calculatePayments();
  }, [product, company]);

  if (isLoading) {
    return (
      <div className="text-center text-n-1 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Calculando opciones de pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getPeriodShortLabel = (periodLabel) => {
    switch (periodLabel) {
      case 'semanas': return 'sem';
      case 'quincenas': return 'qna';
      case 'catorcenas': return 'cat';
      default: return 'mes';
    }
  };

  return (
    <div className="w-full bg-n-8 px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
        {/* Product Info Column */}
        <div className="bg-n-7 rounded-2xl p-8 lg:p-12">
          <div className="flex flex-col gap-8">
            <div className="aspect-square w-full max-w-[300px] mx-auto rounded-xl overflow-hidden bg-n-6">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-n-1 mb-4">{product.title}</h2>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-primary-500">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {product.rating && (
                  <div className="text-n-3 text-lg">
                    <span className="font-medium text-n-1">Calificación:</span> {product.rating}
                  </div>
                )}
                {product.availability && (
                  <div className="text-n-3 text-lg">
                    <span className="font-medium text-n-1">Disponibilidad:</span> {product.availability}
                  </div>
                )}
              </div>
              {product.features && product.features.length > 0 && (
                <div className="text-n-3">
                  <h3 className="text-xl font-semibold text-n-1 mb-3">Características</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-lg">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financing Options Column */}
        <div>
          <h2 className="text-3xl font-bold text-center text-n-1 mb-8">Elige tu Plan de Financiamiento</h2>
          <div className="flex flex-col gap-4">
            {paymentOptions.map((option, index) => {
              const isSelected = selectedPlan === option;
              
              return (
                <div
                  key={option.periods}
                  onClick={() => setSelectedPlan(option)}
                  className={`
                    relative bg-n-7 rounded-2xl p-6 cursor-pointer
                    transition-all duration-300 ease-in-out
                    ${isSelected 
                      ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/20 scale-[1.02]' 
                      : 'hover:scale-[1.01] hover:shadow-lg hover:shadow-n-1/5'}
                  `}
                >
                  {/* Recommended Badge */}
                  {index === 0 && (
                    <span className="absolute -top-3 left-6 inline-block bg-primary-500 text-n-1 text-sm px-4 py-1 rounded-full shadow-lg">
                      Recomendado
                    </span>
                  )}

                  <div className="flex flex-col gap-4">
                    {/* Period and Payment */}
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-2xl font-bold text-n-1">
                        {option.periods} {option.periodLabel}
                      </h3>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary-500">
                          {formatCurrency(option.paymentPerPeriod)}
                        </span>
                        <span className="text-sm text-n-3 ml-1">
                          /{getPeriodShortLabel(option.periodLabel)}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-n-3">
                      <div>
                        <span className="text-sm">Total a pagar</span>
                        <p className="text-lg font-medium text-n-1">
                          {formatCurrency(option.totalPayment)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm">Tasa de interés</span>
                        <p className="text-lg font-medium text-n-1">
                          {option.interestRate}% anual
                        </p>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-sm">CAT</span>
                        <p className="text-lg font-medium text-n-1">
                          {option.cat}% anual
                        </p>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className={`
                      h-1.5 w-full rounded-full mt-2
                      transition-all duration-300 ease-in-out
                      ${isSelected ? 'bg-primary-500' : 'bg-n-6'}
                    `} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="text-center mt-8">
            <Button
              className="px-12 py-4 text-lg w-full sm:w-auto"
              disabled={!selectedPlan}
              onClick={() => onSelectPlan && onSelectPlan(selectedPlan)}
              white
            >
              {selectedPlan ? 'Continuar con el Plan Seleccionado' : 'Selecciona un Plan'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancingOptions; 