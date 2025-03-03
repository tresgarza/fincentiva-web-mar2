/**
 * Configuración global de la aplicación
 */

const appConfig = {
  // Información de contacto
  contact: {
    whatsappNumber: '+528116364522', // Reemplazar con el número real
    email: 'contacto@fincentiva.com',
    phone: '+52 55 1234 5678',
  },
  
  // Configuración de préstamos
  loans: {
    autoLoan: {
      minDownPaymentPercentage: 30, // Porcentaje mínimo de enganche
      maxTermMonths: 48, // Plazo máximo en meses
      interestRate: 16.9, // Tasa de interés anual
    },
    carBackedLoan: {
      maxLoanPercentage: 70, // Porcentaje máximo del valor del auto
      maxTermMonths: 36, // Plazo máximo en meses
      interestRate: 14.9, // Tasa de interés anual
    }
  },
  
  // Configuración de la aplicación
  app: {
    name: 'Fincentiva',
    version: '1.0.0',
    environment: import.meta.env.VITE_NODE_ENV || 'development',
  }
};

export default appConfig; 