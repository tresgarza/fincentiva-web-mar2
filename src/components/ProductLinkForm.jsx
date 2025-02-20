import { useState } from "react";
import Button from "./Button";
import Section from "./Section";

const ProductLinkForm = ({ onSubmit, isLoading }) => {
  const [productLink, setProductLink] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(productLink);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="get-started" className="py-10">
      <div className="container">
        <div className="max-w-[40rem] mx-auto">
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-r from-[#40E0D0] via-[#4DE8B2] to-[#3FD494] overflow-hidden">
            {/* Animated light effect */}
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
              <h3 className="h3 mb-4 text-center">Comienza tu Compra</h3>
              <p className="body-2 text-n-4 mb-8 text-center">
                Pega el enlace del producto que deseas y nosotros nos encargamos del resto
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="productLink" className="text-n-4 text-sm">
                    Enlace del Producto
                  </label>
                  <input
                    type="url"
                    id="productLink"
                    value={productLink}
                    onChange={(e) => {
                      setProductLink(e.target.value);
                      setError("");
                    }}
                    placeholder="https://www.amazon.com.mx/producto..."
                    className="w-full px-4 py-3 rounded-lg bg-[#1A1F26] text-white placeholder-gray-500 border border-[#2D3643] focus:outline-none focus:border-[#40E0D0] transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                <div className="text-center text-sm text-gray-400 mb-4">
                  Aceptamos productos de:
                  <div className="flex justify-center items-center gap-4 mt-2">
                    <span>Amazon</span>
                    <span>y</span>
                    <span>MercadoLibre</span>
                    
                  </div>
                  <div className="mt-1">
                   
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#40E0D0] to-[#3FD494] hover:from-[#3FD494] hover:to-[#40E0D0] text-black font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  type="submit"
                  disabled={isSubmitting || isLoading}
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
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Section>
  );
};

export default ProductLinkForm; 