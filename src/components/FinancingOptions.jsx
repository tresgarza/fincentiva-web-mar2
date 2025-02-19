import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from "./Button";
import Section from "./Section";
import { Gradient } from "./design/Hero";

const FinancingOptions = ({ product, company, onSelectPlan }) => {
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculatePayments = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/companies/calculate-payments', {
          companyId: company.id,
          amount: product.price
        });
        setPaymentOptions(response.data);
      } catch (err) {
        setError('Error calculating payment options');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    calculatePayments();
  }, [product.price, company.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white">
          Calculating payment options...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <Section className="py-10">
      <div className="container">
        <div className="max-w-[62rem] mx-auto">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem] p-8">
              {product && (
                <div className="mb-8">
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="h4 mb-2">{product.title}</h3>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        {/* Price Section */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-n-1">
                            {new Intl.NumberFormat('es-MX', {
                              style: 'currency',
                              currency: 'MXN',
                              minimumFractionDigits: 2
                            }).format(product.price)}
                          </span>
                          {product.originalPrice && (
                            <>
                              <span className="text-n-3 line-through">
                                {new Intl.NumberFormat('es-MX', {
                                  style: 'currency',
                                  currency: 'MXN',
                                  minimumFractionDigits: 2
                                }).format(product.originalPrice)}
                              </span>
                              <span className="text-green-500">
                                {product.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        {/* Seller & Rating */}
                        <div className="flex items-center gap-4 text-sm">
                          {product.seller && (
                            <span className="text-n-3">
                              Vendedor: <span className="text-n-1">{product.seller}</span>
                            </span>
                          )}
                          {product.rating && (
                            <span className="text-n-3">
                              Rating: <span className="text-yellow-500">{product.rating}</span>
                            </span>
                          )}
                        </div>

                        {/* Availability & Shipping */}
                        <div className="flex items-center gap-4 text-sm">
                          {product.availability && (
                            <span className="text-green-500">{product.availability}</span>
                          )}
                          {product.shipping && (
                            <span className="text-blue-500">{product.shipping}</span>
                          )}
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-n-3 text-sm mb-1">Características:</h4>
                            <ul className="list-disc list-inside text-sm text-n-2">
                              {product.features.slice(0, 3).map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <h3 className="h3 mb-4">Elige tu Plan de Financiamiento</h3>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paymentOptions.map((option) => (
                  <div
                    key={option.months}
                    className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => onSelectPlan(option)}
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {option.months} Months
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Monthly Payment:</span>
                        <span className="font-semibold">${option.monthlyPayment.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Payment:</span>
                        <span className="font-semibold">${option.totalPayment.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">{option.interestRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                disabled={paymentOptions.length === 0}
                onClick={() => onSelectPlan && onSelectPlan(paymentOptions[0])}
                white
              >
                Continuar con el Plan Seleccionado
              </Button>
            </div>
          </div>
          <Gradient />
        </div>
      </div>
    </Section>
  );
};

export default FinancingOptions; 