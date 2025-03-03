import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Section from '../components/Section';
import Button from '../components/Button';

const CompanyPanel = () => {
  const [companyData, setCompanyData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar datos de la empresa del localStorage
    const storedData = localStorage.getItem('companyData');
    if (!storedData) {
      window.location.href = 'https://fincentiva-feb21-2025-front.vercel.app/login';
      return;
    }
    setCompanyData(JSON.parse(storedData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('companyData');
    window.location.href = 'https://fincentiva-feb21-2025-front.vercel.app/login';
  };

  if (!companyData) {
    return null;
  }

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Section className="mt-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="h2 mb-2">Bienvenido, {companyData.name}</h1>
              <p className="text-n-4">Panel de Control Empresarial</p>
            </div>
            <Button onClick={handleLogout} variant="secondary">
              Cerrar Sesión
            </Button>
          </div>

          {/* Company Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-n-8 rounded-2xl p-8 border border-n-6 mb-8"
          >
            <h2 className="h4 mb-4">Información de la Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-n-7 rounded-xl">
                <p className="text-n-4 mb-1">Código de Empresa</p>
                <p className="text-xl font-semibold text-n-1">{companyData.employee_code}</p>
              </div>
              <div className="p-4 bg-n-7 rounded-xl">
                <p className="text-n-4 mb-1">Frecuencia de Pago</p>
                <p className="text-xl font-semibold text-n-1">
                  {companyData.payment_frequency === 'biweekly' ? 'Quincenal' : 'Mensual'}
                </p>
              </div>
              <div className="p-4 bg-n-7 rounded-xl">
                <p className="text-n-4 mb-1">Tasa de Interés</p>
                <p className="text-xl font-semibold text-n-1">{companyData.interest_rate}%</p>
              </div>
              <div className="p-4 bg-n-7 rounded-xl">
                <p className="text-n-4 mb-1">Día de Pago</p>
                <p className="text-xl font-semibold text-n-1">{companyData.payment_day}</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {[
              {
                title: "Solicitudes de Crédito",
                description: "Ver y gestionar las solicitudes de crédito de tus empleados",
                icon: "📋",
                action: () => {}
              },
              {
                title: "Reportes",
                description: "Accede a reportes detallados y estados de cuenta",
                icon: "📊",
                action: () => {}
              },
              {
                title: "Configuración",
                description: "Administra la configuración de tu cuenta",
                icon: "⚙️",
                action: () => {}
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-n-8 rounded-2xl p-6 border border-n-6 hover:border-color-1 transition-all duration-300 cursor-pointer"
                onClick={item.action}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="h5 mb-2">{item.title}</h3>
                <p className="text-n-4">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Credit Limits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-n-8 rounded-2xl p-8 border border-n-6"
          >
            <h2 className="h4 mb-6">Límites de Crédito</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-n-4 mb-2">Monto Mínimo</p>
                <div className="p-4 bg-n-7 rounded-xl">
                  <p className="text-2xl font-semibold text-n-1">
                    ${companyData.min_credit_amount.toLocaleString('es-MX')}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-n-4 mb-2">Monto Máximo</p>
                <div className="p-4 bg-n-7 rounded-xl">
                  <p className="text-2xl font-semibold text-n-1">
                    ${companyData.max_credit_amount.toLocaleString('es-MX')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
};

export default CompanyPanel; 