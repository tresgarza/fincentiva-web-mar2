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
        'liverpool.com.mx',
        'walmart.com.mx',
        'elpalaciodehierro.com'
      ];
      
      const isValidDomain = validDomains.some(domain => parsedUrl.hostname.endsWith(domain));
      
      if (!isValidDomain) {
        setError("Por favor ingresa un enlace válido de Amazon México, MercadoLibre México, Liverpool, Walmart o El Palacio de Hierro");
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
    setError("");
    
    if (!validateLink(productLink)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting product link:', productLink);
      await onSubmit(productLink);
      setProductLink("");
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(err.message || "Hubo un error al procesar el enlace. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="get-started" className="py-10">
      <div className="container">
        <div className="max-w-[40rem] mx-auto">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem] p-8">
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
                      setError(""); // Clear error when user types
                    }}
                    placeholder="https://www.amazon.com.mx/producto..."
                    className={`w-full px-4 py-3 rounded-lg bg-n-7 text-n-1 placeholder-n-4 border ${
                      error ? 'border-red-500' : 'border-n-6'
                    } focus:outline-none focus:border-n-3`}
                    required
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                <Button
                  className="w-full"
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  white={!isSubmitting && !isLoading}
                >
                  {isSubmitting || isLoading ? "Procesando..." : "Ver Opciones de Financiamiento"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-n-4 text-sm">
                  Aceptamos productos de:
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  <span className="text-n-3">Amazon México</span>
                  <span className="text-n-3">MercadoLibre México</span>
                  <span className="text-n-3">Liverpool</span>
                  <span className="text-n-3">Walmart</span>
                  <span className="text-n-3">El Palacio de Hierro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ProductLinkForm; 