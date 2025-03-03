import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loading } from '../assets';

const defaultMessages = {
  home: [
    "15+ años de experiencia",
    "Financiamiento a tu medida",
    "Aprobación rápida y sencilla",
    "Asesoría personalizada",
    "Simula tu crédito al instante"
  ],
  autoLoan: [
    "Aprobación en 48 horas",
    "Simula tu crédito al instante",
    "Atención personalizada",
    "Financiamiento hasta del 70%",
    "Plazos flexibles hasta 48 meses"
  ]
};

const Generating = ({ className, type = 'home' }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const messages = defaultMessages[type] || defaultMessages.home;
  const currentMessage = messages[messageIndex];

  useEffect(() => {
    let timeoutId;
    let currentText = '';
    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (currentIndex < currentMessage.length) {
        currentText += currentMessage[currentIndex];
        setDisplayText(currentText);
        currentIndex++;
        timeoutId = setTimeout(typeNextCharacter, 50);
      } else {
        // Esperar antes de cambiar al siguiente mensaje
        timeoutId = setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2000);
      }
    };

    // Iniciar el efecto de escritura
    typeNextCharacter();

    // Limpieza
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [messageIndex, messages]);

  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <motion.div 
        className="flex items-center h-[3.5rem] px-6 bg-n-8/80 rounded-[1.7rem] text-base border border-n-6 backdrop-blur-md"
        style={{ minWidth: '320px', maxWidth: '600px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-5 h-5 mr-4 relative">
          <motion.img
            src={loading}
            alt="Loading..."
            className="w-full h-full"
            animate={{ 
              rotate: 360,
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#33FF57]/20 to-[#40E0D0]/20 blur-sm rounded-full animate-pulse" />
        </div>
        <div className="relative flex items-center h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="whitespace-nowrap text-white"
            >
              {displayText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-color-1 ml-1"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Generating;
