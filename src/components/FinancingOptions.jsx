import { useState, useEffect } from 'react';
import Button from "./Button";
import { Gradient } from "./design/Hero";

const FinancingOptions = ({ product, company, onSelectPlan }) => {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const calculatePayments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/companies/calculate-payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyId: company.id,
            amount: product.price
          }),
        });

        if (!response.ok) {
          throw new Error('Error al calcular las opciones de pago');
        }

        const data = await response.json();
        setPaymentOptions(data);
      } catch (err) {
        setError('Error al calcular las opciones de pago');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (product?.price && company?.id) {
      calculatePayments();
    }
  }, [product?.price, company?.id]);

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
    <div className="w-full min-h-screen bg-n-8 px-4 py-8">
      {/* Product Info Section */}
      <div className="mb-16">
        <div className="bg-n-7 rounded-2xl p-8 lg:p-12 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/3 xl:w-1/4">
              <div className="aspect-square rounded-xl overflow-hidden bg-n-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-4xl font-bold text-n-1 mb-6">{product.title}</h2>
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-bold text-primary-500">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {product.rating && (
                  <div className="text-n-3 text-xl">
                    <span className="font-medium text-n-1">Calificación:</span> {product.rating}
                  </div>
                )}
                {product.availability && (
                  <div className="text-n-3 text-xl">
                    <span className="font-medium text-n-1">Disponibilidad:</span> {product.availability}
                  </div>
                )}
              </div>
              {product.features && product.features.length > 0 && (
                <div className="text-n-3">
                  <h3 className="text-2xl font-semibold text-n-1 mb-4">Características</h3>
                  <ul className="list-disc list-inside space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-xl">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financing Options Section */}
      <div className="w-full max-w-[1400px] mx-auto">
        <h2 className="text-4xl font-bold text-center text-n-1 mb-12">Elige tu Plan de Financiamiento</h2>
        
        {/* Financing Table */}
        <div className="bg-n-7 rounded-2xl p-8 lg:p-12 mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-n-6">
                  <th className="text-left py-6 px-6 text-xl text-n-3 font-semibold">Plazo</th>
                  <th className="text-right py-6 px-6 text-xl text-n-3 font-semibold">Pago por periodo</th>
                  <th className="text-right py-6 px-6 text-xl text-n-3 font-semibold">Total a pagar</th>
                  <th className="text-right py-6 px-6 text-xl text-n-3 font-semibold">Tasa de interés</th>
                  <th className="text-right py-6 px-6 text-xl text-n-3 font-semibold">CAT</th>
                  <th className="py-6 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {paymentOptions.map((option, index) => (
                  <tr 
                    key={option.periods}
                    className={`border-b border-n-6 hover:bg-n-6 transition-colors ${
                      selectedPlan === option ? 'bg-n-6' : ''
                    }`}
                  >
                    <td className="py-8 px-6">
                      <div className="flex items-center gap-3">
                        {index === 0 && (
                          <span className="inline-block bg-primary-500 text-n-1 text-sm px-3 py-1 rounded-full">
                            Recomendado
                          </span>
                        )}
                        <span className="text-xl text-n-1 font-medium">
                          {option.periods} {option.periodLabel}
                        </span>
                      </div>
                    </td>
                    <td className="py-8 px-6 text-right">
                      <span className="text-2xl font-bold text-primary-500">
                        {formatCurrency(option.paymentPerPeriod)}
                      </span>
                      <span className="text-base text-n-3 ml-1">
                        /{getPeriodShortLabel(option.periodLabel)}
                      </span>
                    </td>
                    <td className="py-8 px-6 text-right">
                      <span className="text-xl font-medium text-n-1">
                        {formatCurrency(option.totalPayment)}
                      </span>
                    </td>
                    <td className="py-8 px-6 text-right">
                      <span className="text-xl font-medium text-n-1">
                        {option.interestRate}% anual
                      </span>
                    </td>
                    <td className="py-8 px-6 text-right">
                      <span className="text-xl font-medium text-n-1">
                        {option.cat}% anual
                      </span>
                    </td>
                    <td className="py-8 px-6">
                      <button
                        onClick={() => setSelectedPlan(option)}
                        className={`w-full px-6 py-3 rounded-xl text-lg font-medium transition-colors ${
                          selectedPlan === option
                            ? 'bg-primary-500 text-n-1'
                            : 'bg-n-5 text-n-3 hover:bg-n-4 hover:text-n-1'
                        }`}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            className="px-12 py-5 text-xl"
            disabled={!selectedPlan}
            onClick={() => onSelectPlan && onSelectPlan(selectedPlan)}
            white
          >
            {selectedPlan ? 'Continuar con el Plan Seleccionado' : 'Selecciona un Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancingOptions; 