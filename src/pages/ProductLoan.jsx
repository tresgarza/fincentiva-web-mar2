import React from 'react';
import { motion } from 'framer-motion';
import Section from '../components/Section';
import ProductLinkForm from '../components/ProductLinkForm';

const ProductLoan = () => {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Section className="mt-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container">
          <h1 className="h2 mb-6 text-center">Financia tus Compras</h1>
          <p className="body-1 mb-10 text-n-4 text-center max-w-3xl mx-auto">
            Obtén financiamiento para tus compras en línea. Pega el enlace del producto
            que deseas comprar y te ayudaremos a financiarlo.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-n-8 rounded-2xl p-8">
              <ProductLinkForm />
            </div>

            <div className="bg-n-8 rounded-2xl p-8">
              <h2 className="h4 mb-6">¿Cómo Funciona?</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-color-1 flex items-center justify-center text-white font-semibold">1</div>
                  <div>
                    <h3 className="h6 mb-2">Pega el enlace del producto</h3>
                    <p className="text-n-4">Copia y pega el enlace del producto que deseas comprar de cualquier tienda en línea.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-color-1 flex items-center justify-center text-white font-semibold">2</div>
                  <div>
                    <h3 className="h6 mb-2">Simula tu crédito</h3>
                    <p className="text-n-4">Calcula tus pagos mensuales y elige el plazo que mejor se adapte a ti.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-color-1 flex items-center justify-center text-white font-semibold">3</div>
                  <div>
                    <h3 className="h6 mb-2">Completa tu solicitud</h3>
                    <p className="text-n-4">Proporciona la información necesaria y recibe una respuesta en minutos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Sección de Tiendas Compatibles */}
      <Section className="mt-20">
        <div className="container">
          <h2 className="h3 mb-10 text-center">Tiendas Compatibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Amazon', 'Mercado Libre', 'Liverpool', 'Walmart'].map((store, index) => (
              <motion.div
                key={store}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-n-8 rounded-xl p-6 text-center"
              >
                <h3 className="h5 text-color-1">{store}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ProductLoan; 