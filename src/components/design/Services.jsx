import Typewriter from "typewriter-effect";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyBillWave, FaHospital, FaHome, FaShoppingCart, FaLaptop, FaCouch, FaMoneyCheck, FaMedkit, FaTools, FaCarSide, FaPercent, FaClock, FaCheckCircle, FaRocket } from "react-icons/fa";
import { GiSteeringWheel, GiSpeedometer, GiCarDoor, GiCarSeat, GiCalendar, GiCash, GiBank, GiHourglass } from "react-icons/gi";

import {
  brainwaveWhiteSymbol,
  gradient,
  loading,
  pause,
  play,
} from "../../assets";
import ChatBubbleWing from "../../assets/svg/ChatBubbleWing";

const nominalMessages = [
  { text: "Financia muebles y electrodomésticos", icon: FaHome },
  { text: "Cubre gastos médicos y emergencias", icon: FaMedkit },
  { text: "Realiza compras en línea y retail", icon: FaShoppingCart },
  { text: "Mejoras y reparaciones del hogar", icon: FaTools },
  { text: "Aprobación inmediata para colaboradores", icon: FaCheckCircle }
];

const autoMessages = [
  { text: "Financiamiento desde $100,000 MXN", icon: FaMoneyBillWave },
  { text: "Tasa preferencial desde 3.7% mensual", icon: FaPercent },
  { text: "Plazos flexibles de hasta 48 meses", icon: FaClock },
  { text: "Simula tu crédito 100% en linea", icon: FaRocket },
  { text: "Auto nuevo, seminuevo o usado a tu alcance", icon: FaCarSide }
];

export const Gradient = () => {
  return (
    <div className="absolute top-0 -left-[10rem] w-[56.625rem] h-[56.625rem] opacity-50 mix-blend-color-dodge pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-color-1 to-color-2 rounded-full blur-[6rem]" />
    </div>
  );
};

export const HologramEffect = ({ Icon, isVisible }) => {
  // Asegurarse de que el ícono es un componente válido antes de intentar renderizarlo
  const IconComponent = React.isValidElement(Icon) ? Icon : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative w-full h-full max-w-[200px] max-h-[200px] mx-auto">
        {/* Base del holograma */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-[#33FF57]/5"
          animate={{
            boxShadow: [
              '0 0 40px 20px rgba(51,255,87,0.1), inset 0 0 20px 10px rgba(51,255,87,0.1)',
              '0 0 60px 30px rgba(51,255,87,0.15), inset 0 0 30px 15px rgba(51,255,87,0.15)',
              '0 0 40px 20px rgba(51,255,87,0.1), inset 0 0 20px 10px rgba(51,255,87,0.1)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Anillos giratorios */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-[#33FF57]/20"
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 10 - i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Ícono central */}
        {IconComponent && isVisible && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-[#33FF57] text-4xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {IconComponent}
          </motion.div>
        )}

        {/* Efecto de escaneo */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#33FF57]/10 to-transparent"
          animate={{
            y: [-100, 100]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Líneas de interferencia */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-[1px] bg-[#33FF57]/10"
              style={{ top: `${i * 10}%` }}
              animate={{
                x: [-100, 100]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.1
              }}
            />
          ))}
        </div>
    </div>
    </motion.div>
  );
};

const LoadingHologram = () => (
  <motion.div
    className="relative w-60 h-60"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Base glow */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-full blur-[50px]"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
    
    {/* Loading circles */}
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-color-1 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.3
          }}
          style={{
            left: `${50 + Math.cos(i * (Math.PI * 2) / 3) * 20}%`,
            top: `${50 + Math.sin(i * (Math.PI * 2) / 3) * 20}%`
          }}
        />
      ))}
      </div>
  </motion.div>
);

export const PhotoChatMessage = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showHologram, setShowHologram] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(nominalMessages[0].icon);
  const typingTimeoutRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    const startTyping = () => {
      setIsTyping(true);
      setShowHologram(false);
      setDisplayText("");
      let currentText = "";
      let currentIndex = 0;
      
      // Safely get the current message and icon
      const message = nominalMessages[currentMessage];
      if (!message) return;
      
      setCurrentIcon(message.icon);

      const typeNextChar = () => {
        if (currentIndex < message.text.length) {
          currentText += message.text[currentIndex];
          setDisplayText(currentText);
          currentIndex++;
          typingTimeoutRef.current = setTimeout(typeNextChar, 50);
        } else {
          setIsTyping(false);
          // Show hologram after text is complete
          setTimeout(() => {
            setShowHologram(true);
            // Wait before next message
            messageTimeoutRef.current = setTimeout(() => {
              setCurrentMessage((prev) => (prev + 1) % nominalMessages.length);
            }, 5000);
          }, 1000);
        }
      };

      typeNextChar();
    };

    startTyping();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, [currentMessage]);

  return (
    <div className="flex flex-col items-center gap-1 justify-center w-full">
      <div className="text-lg text-n-1 text-center min-h-[4rem] flex items-center justify-center">
        {displayText}
        {isTyping && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            |
          </motion.span>
        )}
      </div>
      
      <div className="relative w-60 h-60 mx-auto">
        <AnimatePresence>
          {isTyping ? (
            <LoadingHologram />
          ) : (
            <HologramEffect 
              Icon={currentIcon}
              isVisible={showHologram}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const VideoChatMessage = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showHologram, setShowHologram] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(autoMessages[0].icon);
  const typingTimeoutRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    const startTyping = () => {
      setIsTyping(true);
      setShowHologram(false);
      setDisplayText("");
      let currentText = "";
      let currentIndex = 0;
      
      // Safely get the current message and icon
      const message = autoMessages[currentMessage];
      if (!message) return;
      
      setCurrentIcon(message.icon);

      const typeNextChar = () => {
        if (currentIndex < message.text.length) {
          currentText += message.text[currentIndex];
          setDisplayText(currentText);
          currentIndex++;
          typingTimeoutRef.current = setTimeout(typeNextChar, 50);
        } else {
          setIsTyping(false);
          // Show hologram after text is complete
          setTimeout(() => {
            setShowHologram(true);
            // Wait before next message
            messageTimeoutRef.current = setTimeout(() => {
              setCurrentMessage((prev) => (prev + 1) % autoMessages.length);
            }, 5000);
          }, 1000);
        }
      };

      typeNextChar();
    };

    startTyping();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, [currentMessage]);

  return (
    <div className="flex flex-col items-center gap-1 justify-center w-full">
      <div className="text-lg text-n-1 text-center min-h-[4rem] flex items-center justify-center">
        {displayText}
        {isTyping && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            |
          </motion.span>
        )}
      </div>
      
      <div className="relative w-60 h-60 mx-auto">
        <AnimatePresence>
          {isTyping ? (
            <LoadingHologram />
          ) : (
            <HologramEffect 
              Icon={currentIcon}
              isVisible={showHologram}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
