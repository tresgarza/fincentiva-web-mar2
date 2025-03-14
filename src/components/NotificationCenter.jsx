import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';

const NotificationCenter = ({ notifications, onClose }) => {
  const [activeNotificationIndex, setActiveNotificationIndex] = useState(0);
  
  // Si hay notificaciones, cambiar a la siguiente cada 5 segundos
  useEffect(() => {
    if (!notifications || notifications.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveNotificationIndex(prev => (prev + 1) % notifications.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [notifications]);
  
  if (!notifications || notifications.length === 0) return null;
  
  const currentNotification = notifications[activeNotificationIndex];
  const { lead, type, timestamp } = currentNotification;
  
  // Determinar etiqueta apropiada para el tipo de notificación
  const getNotificationTitle = () => {
    const notificationLabels = {
      'simulación': '¡Nueva simulación recibida!',
      'solicitud': '¡Nueva solicitud de préstamo!',
      'simulación de producto': '¡Nueva simulación de producto!',
      'simulación de efectivo': '¡Nueva simulación de efectivo!',
      'plan seleccionado': '¡Nuevo plan seleccionado!'
    };
    
    return notificationLabels[type] || '¡Nuevo registro recibido!';
  };
  
  // Determinar etiqueta apropiada para el tipo de préstamo
  const getLoanTypeLabel = () => {
    if (!lead) return 'No especificado';
    
    const loanTypes = {
      'auto_loan': 'Crédito Automotriz',
      'car_backed_loan': 'Préstamo con Garantía de Auto'
    };
    
    return loanTypes[lead.loan_type] || 'No especificado';
  };
  
  // Obtener nombre completo del cliente
  const getClientName = () => {
    if (!lead) return 'N/A';
    
    if (lead.name && lead.last_name) {
      return `${lead.name} ${lead.last_name}`;
    }
    
    if (lead.user_first_name && lead.user_last_name) {
      return `${lead.user_first_name} ${lead.user_last_name}`;
    }
    
    return lead.company_name || lead.user_name || 'N/A';
  };
  
  // Función para obtener el monto solicitado/simulado
  const getAmount = () => {
    if (!lead) return 0;
    
    // Diferentes campos posibles para el monto
    return lead.loan_amount || 
           lead.amount || 
           lead.requested_amount || 
           lead.total_payment || 
           lead.product_price || 
           0;
  };
  
  // Función para obtener el pago mensual
  const getMonthlyPayment = () => {
    if (!lead) return 0;
    
    // Diferentes campos posibles para el pago mensual
    return lead.monthly_payment || 
           lead.payment_per_period || 
           0;
  };
  
  // Función para obtener el nombre del producto
  const getProductName = () => {
    if (!lead) return 'N/A';
    
    // Si es un plan de tipo efectivo o simulación de efectivo, mostrar "Crédito en Efectivo"
    if (lead.plan_type === 'cash' || lead.simulation_type === 'cash' || type === 'simulación de efectivo') {
      return "Crédito en Efectivo";
    }
    
    return lead.product_title || 
           lead.product_name || 
           lead.purpose || 
           'N/A';
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeNotificationIndex}
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        {/* Contenido de la notificación */}
        <div className="relative w-full max-w-md bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden"
             style={{ boxShadow: '0 0 20px rgba(51, 255, 87, 0.3)' }}
        >
          <div className="relative p-6">
            <button
              onClick={() => onClose(currentNotification.id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="flex flex-col items-start gap-3">
              {/* Encabezado de la notificación */}
              <div className="flex items-center gap-3 w-full">
                {/* Icono de notificación */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#33FF57]/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#33FF57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                </div>
                
                {/* Título de la notificación */}
                <h3 className="text-lg font-bold text-[#33FF57]">
                  {getNotificationTitle()}
                </h3>
              </div>
              
              {/* Contenido de la notificación */}
              <div className="w-full">
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Nombre:</p>
                    <p className="text-white">{getClientName()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Teléfono:</p>
                    <p className="text-white">{lead.phone || 'No disponible'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-xs">Monto:</p>
                    <p className="text-white">{formatCurrency(getAmount())}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-xs">Pago Mensual:</p>
                    <p className="text-white">{formatCurrency(getMonthlyPayment())}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">
                      {new Date(timestamp).toLocaleTimeString()}
                    </p>
                    
                    {notifications.length > 1 && (
                      <div className="flex items-center gap-1 ml-2">
                        {notifications.map((_, index) => (
                          <div 
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full cursor-pointer ${
                              index === activeNotificationIndex ? 'bg-[#33FF57]' : 'bg-gray-600'
                            }`}
                            onClick={() => setActiveNotificationIndex(index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => onClose(currentNotification.id)}
                    className="px-3 py-1 bg-[#33FF57] text-black text-xs font-medium rounded-lg hover:bg-[#2be04e] transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Barra de progreso para auto-cierre */}
          <div className="h-1.5 bg-[#33FF57]/20 rounded-b">
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ 
                duration: 10, 
                ease: 'linear',
                delay: 0 
              }}
              className="h-full bg-[#33FF57] rounded-b"
              onAnimationComplete={() => onClose(currentNotification.id)}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter; 