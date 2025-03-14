import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../components/Section';
import Generating from '../components/Generating';
import Particles from '../components/design/Particles';
import { FaCarSide, FaMoneyBillWave, FaUserCheck, FaClock } from 'react-icons/fa';
import { BsShieldCheck, BsSpeedometer, BsInfoCircle, BsArrowRight } from 'react-icons/bs';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { supabase } from '../lib/supabaseClient';
import { testSupabaseConnection } from '../utils/supabaseTest';
import { checkTableStructure } from '../utils/checkTableStructure';
import appConfig from '../config/appConfig';
import { useLocation } from 'react-router-dom';

const AutoLoan = () => {
  const location = useLocation();
  const simulationData = location.state;

  // Test Supabase connection when component mounts
  useEffect(() => {
    const testConnection = async () => {
      const result = await testSupabaseConnection();
      if (!result.dbSuccess) {
        console.error('Supabase connection test failed:', result);
        showNotification('Error de conexión a la base de datos. Por favor intenta más tarde.', 'error');
      }
      
      // Verificar la estructura de la tabla
      const structureResult = await checkTableStructure();
      console.log('Estructura de la tabla verificada:', structureResult);
      
      // Si la tabla no tiene la columna is_application, mostrar una advertencia
      if (structureResult.success && structureResult.columns && !structureResult.hasIsApplication) {
        console.warn('La columna is_application no existe en la tabla simulations. Se usará la columna notes como alternativa.');
      }
    };
    
    testConnection();
  }, []);

  // Estados para el simulador
  const [carPrice, setCarPrice] = useState(375000);
  const [carPriceInput, setCarPriceInput] = useState("375,000");
  const [downPayment, setDownPayment] = useState(112500);
  const [downPaymentInput, setDownPaymentInput] = useState("112,500");
  const [termMonths, setTermMonths] = useState(48);
  const [monthlyPayment, setMonthlyPayment] = useState(8750);
  const [loanAmount, setLoanAmount] = useState(262500);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [loanType, setLoanType] = useState('autoLoan');

  // Add states for pending changes
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [pendingAnimationActive, setPendingAnimationActive] = useState(false);

  // Add new states for car-backed loan
  const [carBackedLoanCarPrice, setCarBackedLoanCarPrice] = useState(300000);
  const [carBackedLoanCarPriceInput, setCarBackedLoanCarPriceInput] = useState("300,000");
  const [carBackedLoanAmount, setCarBackedLoanAmount] = useState(150000);
  const [carBackedLoanAmountInput, setCarBackedLoanAmountInput] = useState("150,000");
  const [carBackedLoanTermMonths, setCarBackedLoanTermMonths] = useState(24);
  const [carBackedLoanMonthlyPayment, setCarBackedLoanMonthlyPayment] = useState(0);
  const [carYear, setCarYear] = useState(2020);
  const [carModel, setCarModel] = useState('');
  const [isCalculatingCarBacked, setIsCalculatingCarBacked] = useState(false);

  // Constantes para cálculos
  const IVA = 0.16;
  const gpsRent = 400;
  const commissionRate = 0.03;
  const annualInterestRate = 0.45 * (1 + IVA);
  const monthlyInterestRate = annualInterestRate / 12;

  // Estados para campos de contacto
  const [contactInfo, setContactInfo] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [showContactForm, setShowContactForm] = useState(true);
  const [contactFormValid, setContactFormValid] = useState(false);
  const [contactInfoSaved, setContactInfoSaved] = useState(false);

  // Add state for notifications
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Add new state for simulation visibility
  const [showSimulation, setShowSimulation] = useState(false);

  // Add new state for counter animation
  const [animatedPayment, setAnimatedPayment] = useState(0);

  // Add state for loading application submission
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  // Dentro del componente AutoLoan, justo después de los demás estados:
  const [paymentDetails, setPaymentDetails] = useState({
    interestPayment: 0,
    gpsPayment: 0,
    commissionTotal: 0
  });

  // Agregar efecto para actualizar el enganche cuando cambia el valor del auto
  useEffect(() => {
    // Cuando cambia el precio del auto, actualizamos el enganche para mantener el 30%
    const minDownPayment = carPrice * 0.3;
    // Solo actualizamos el enganche si es menor que el mínimo requerido
    if (downPayment < minDownPayment) {
      setDownPayment(minDownPayment);
      setDownPaymentInput(formatInputCurrency(minDownPayment.toString()));
    }
    
    // Marcamos los cambios como pendientes
    setHasPendingChanges(true);
  }, [carPrice]);

  // Add effect to reset showSimulation when loanType changes
  useEffect(() => {
    setShowSimulation(false);
    resetSimulationState();
  }, [loanType]);

  // Function to reset simulation state
  const resetSimulationState = () => {
    setContactInfoSaved(false);
    setShowSimulation(false);
    setAnimatedPayment(0);
  };

  // Validar formulario de contacto
  useEffect(() => {
    const { name, lastName, email, phone } = contactInfo;
    const isValid = name.trim() !== '' && 
                   lastName.trim() !== '' && 
                   email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && 
                   phone.match(/^\d{10}$/);
    setContactFormValid(isValid);
  }, [contactInfo]);

  // Función para manejar cambios en el formulario de contacto
  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  // Add useEffect for payment animation
  useEffect(() => {
    if (showSimulation) {
      const payment = loanType === 'autoLoan' ? monthlyPayment : carBackedLoanMonthlyPayment;
      const duration = 1000; // 1 second animation
      const steps = 20;
      const increment = payment / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= payment) {
          setAnimatedPayment(payment);
          clearInterval(timer);
        } else {
          setAnimatedPayment(current);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [showSimulation, monthlyPayment, carBackedLoanMonthlyPayment]);

  // Add useEffect for pending changes animation
  useEffect(() => {
    if (hasPendingChanges) {
      setPendingAnimationActive(true);
      const timer = setTimeout(() => {
        setPendingAnimationActive(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [hasPendingChanges]);

  // Obtener configuración
  const { whatsappNumber } = appConfig.contact;
  const { autoLoan, carBackedLoan } = appConfig.loans;

  // Modify saveSimulation function to reset pending changes
  const saveSimulation = async (loanType, carPrice, loanAmount, termMonths, monthlyPayment, isApplication = false) => {
    try {
      if (isApplication) {
        setIsSubmittingApplication(true);
      }
      
      // Reset pending changes flag
      setHasPendingChanges(false);
      
      const simulationData = {
        name: contactInfo.name,
        last_name: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        loan_type: loanType,
        car_price: carPrice,
        loan_amount: loanAmount,
        term_months: termMonths,
        monthly_payment: monthlyPayment,
        // is_application field is now added as a comment in the notes field instead
        notes: isApplication ? 'Solicitud de préstamo' : 'Simulación',
        created_at: new Date().toISOString()
      };
      
      console.log('Saving simulation data:', simulationData);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Key (first 10 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 10) + '...');
      
      // Try to get the table info first to check if it exists
      try {
        const { data: tableData, error: tableCheckError } = await supabase
          .from('simulations')
          .select('id')
          .limit(1);
        
        if (tableCheckError) {
          console.error('Error checking simulations table:', tableCheckError);
          showNotification(`Error: La tabla 'simulations' puede no existir. Detalles: ${tableCheckError.message}`, 'error');
          return false;
        }
        
        console.log('Table check successful, table exists');
      } catch (tableCheckException) {
        console.error('Exception checking simulations table:', tableCheckException);
      }
      
      // Now try to insert the data
        const { data, error } = await supabase
          .from('simulations')
          .insert([simulationData])
          .select();

        if (error) {
        console.error('Error saving simulation:', error);
        
        // Check if the error is about missing columns
        if (error.message && error.message.includes('column') && error.message.includes('not found')) {
          showNotification('Error al guardar: La estructura de la base de datos no coincide con los datos enviados. Por favor contacta al administrador.', 'error');
        } else {
          showNotification(`Error al guardar tus datos. Por favor intenta de nuevo. Detalles: ${error.message}`, 'error');
        }
        return false;
      }

      console.log('Simulation saved successfully:', data);
      
      if (isApplication) {
        showNotification('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.', 'success');
        
        // Mostrar pantalla de redirección - Paso 1: Guardando
        setRedirectStep(1);
        setRedirectMessage('Guardando tu solicitud...');
        setIsRedirecting(true);
        
        // Preparar mensaje para WhatsApp
        const formattedCarPrice = formatCurrency(carPrice);
        const formattedLoanAmount = formatCurrency(loanAmount);
        const formattedMonthlyPayment = formatCurrency(monthlyPayment);
        
        // Corregir el cálculo del enganche para crédito automotriz
        const downPaymentAmount = loanType === 'auto_loan' ? downPayment : 0;
        const formattedDownPayment = formatCurrency(downPaymentAmount);
        
        console.log("Preparando mensaje WhatsApp con:", {
          loanType,
          carPrice,
          downPayment,
          downPaymentAmount,
          loanAmount,
          formattedDownPayment
        });
        
        // Mensaje de WhatsApp personalizado según el tipo de préstamo
        let introMessage = '';
        let detailsTitle = '';
        let messageContent = '';
        let closingMessage = '';
        let disclaimerMessage = '';
        
        if (loanType === 'auto_loan') {
          // Mensaje para Crédito Automotriz
          introMessage = `Hola, soy *${contactInfo.name} ${contactInfo.lastName}* y estoy interesado en un *crédito automotriz*.`;
          detailsTitle = 'Detalles de mi simulación de crédito:';
          messageContent = `• Precio del auto: ${formattedCarPrice}
• Enganche: ${formattedDownPayment}
• Monto solicitado: ${formattedLoanAmount}
• Plazo: ${termMonths} meses
• Pago mensual: ${formattedMonthlyPayment}`;
          closingMessage = 'Me gustaría conocer los requisitos y el proceso para obtener el crédito automotriz.';
          disclaimerMessage = 'Estoy consciente de que esta simulación es un estimado y no incluye el seguro del auto, el cual también deberé contratar.';
        } else if (loanType === 'car_backed_loan') {
          // Mensaje para Préstamo por Auto
          introMessage = `Hola, soy *${contactInfo.name} ${contactInfo.lastName}* y estoy interesado en un *Préstamo por Auto*.`;
          detailsTitle = 'Detalles de mi simulación:';
          messageContent = `• Auto y modelo: ${carModel || 'No especificado'}
• Precio del auto: ${formattedCarPrice}
• Monto solicitado: ${formattedLoanAmount}
• Plazo: ${termMonths} meses
• Pago mensual: ${formattedMonthlyPayment}`;
          closingMessage = 'Me gustaría conocer los requisitos y el proceso para obtener mi Préstamo por Auto.';
          disclaimerMessage = 'Entiendo que esta simulación es solo un estimado y podría variar al momento de la aprobación.';
        }
        
        const whatsappMessage = `${introMessage}

*${detailsTitle}*
${messageContent}

*Contacto:*
• Tel: ${contactInfo.phone}
• Email: ${contactInfo.email}

${closingMessage} ${disclaimerMessage} Gracias.`;
        
        // Secuencia de pasos con tiempos
        setTimeout(() => {
          // Paso 2: Conectando con asesor
          setRedirectStep(2);
          setRedirectMessage('Conectando con un asesor especializado...');
        }, 1000);
        
        setTimeout(() => {
          // Paso 3: Redirigiendo a WhatsApp
          setRedirectStep(3);
          setRedirectMessage('¡Listo! Redirigiendo a WhatsApp...');
        }, 2000);
        
        // Esperar 3 segundos antes de redirigir
        setTimeout(() => {
          // Redirigir a WhatsApp
          const encodedMessage = encodeURIComponent(whatsappMessage);
          const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
          
          window.open(whatsappUrl, '_blank');
          setIsRedirecting(false);
          setRedirectStep(1);
        }, 3000);
      } else {
        showNotification('Simulación guardada correctamente', 'success');
      }

      setContactInfoSaved(true);
      setShowSimulation(true);
      return true;
    } catch (e) {
      console.error('Exception when saving simulation:', e);
      showNotification(`Error al guardar los datos. Por favor intenta de nuevo. Error: ${e.message || 'Desconocido'}`, 'error');
      return false;
    } finally {
      if (isApplication) {
        setIsSubmittingApplication(false);
      }
    }
  };

  // Add function to handle loan applications
  const handleLoanApplication = async () => {
    if (!contactFormValid) {
      showNotification('Por favor completa todos los campos de contacto correctamente', 'error');
      return;
    }
    
    if (loanType === 'autoLoan') {
      // Para Crédito Automotriz - Asegurar que el downPayment se usa correctamente
      console.log("Enviando solicitud de crédito automotriz con:", {
        carPrice,
        downPayment,
        loanAmount,
        termMonths,
        monthlyPayment
      });
      await saveSimulation('auto_loan', carPrice, loanAmount, termMonths, monthlyPayment, true);
    } else if (loanType === 'carBackedLoan') {
      // Para Préstamo por Auto
      if (!carModel.trim()) {
        showNotification('Por favor ingresa la marca y modelo del auto', 'error');
        return;
      }
      console.log("Enviando solicitud de préstamo por auto con:", {
        carBackedLoanCarPrice,
        carBackedLoanAmount,
        carBackedLoanTermMonths,
        carBackedLoanMonthlyPayment
      });
      await saveSimulation('car_backed_loan', carBackedLoanCarPrice, carBackedLoanAmount, carBackedLoanTermMonths, carBackedLoanMonthlyPayment, true);
    }
  };

  // Función para convertir string a número eliminando formato
  const parseAmount = (value) => {
    if (!value) return 0;
    return Number(value.replace(/[^0-9]/g, ''));
  };
  
  // Función para formatear moneda en input
  const formatInputCurrency = (value) => {
    if (!value) return '';
    const onlyNumbers = value.replace(/[^0-9]/g, '');
    return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Modificación en la constante calculateMonthlyPayment para distinguir entre comisión y GPS
  const calculateMonthlyPayment = (creditAmount, months) => {
    if (months <= 0) return { total: 0, interestPayment: 0, gpsPayment: 0, commissionTotal: 0 };
    
    // Calcula la comisión por apertura
    const commissionTotal = creditAmount * commissionRate;
    
    // Calcula el pago de interés (principal + interés)
    const interestPayment = (creditAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -months));
    
    // Pago total mensual
    const total = interestPayment + gpsRent;
    
    return { 
      total, 
      interestPayment, 
      gpsPayment: gpsRent,
      commissionTotal 
    };
  };

  // Manejadores de eventos para el precio del auto
  const handleCarPriceChange = (e) => {
    const value = Number(e.target.value);
    setCarPrice(value);
    setCarPriceInput(formatInputCurrency(value.toString()));
    
    // Actualizamos el enganche mínimo automáticamente (30% del valor del auto)
    const minDownPayment = value * 0.3;
    if (downPayment < minDownPayment) {
      setDownPayment(minDownPayment);
      setDownPaymentInput(formatInputCurrency(minDownPayment.toString()));
    }
    
    // Marcar como pendiente
    setHasPendingChanges(true);
  };

  const handleCarPriceInputChange = (e) => {
    const value = e.target.value;
    setCarPriceInput(value);
  };

  const handleCarPriceInputBlur = () => {
    const parsedValue = parseAmount(carPriceInput);
    const minValue = 100000;
    const maxValue = 1000000;
    // Validar rango
    const validValue = Math.min(Math.max(parsedValue, minValue), maxValue);
    setCarPrice(validValue);
    setCarPriceInput(formatInputCurrency(validValue.toString()));
    // Mark as pending instead of calculating immediately
    setHasPendingChanges(true);
  };

  // Manejadores de eventos para el enganche
  const handleDownPaymentInputChange = (e) => {
    const value = e.target.value;
    setDownPaymentInput(value);
  };

  const handleDownPaymentInputBlur = () => {
    const parsedValue = parseAmount(downPaymentInput);
    const minValue = carPrice * 0.3;
    const maxValue = carPrice;
    // Validar rango
    const validValue = Math.min(Math.max(parsedValue, minValue), maxValue);
    setDownPayment(validValue);
    setDownPaymentInput(formatInputCurrency(validValue.toString()));
    // Mark as pending instead of calculating immediately
    setHasPendingChanges(true);
  };

  const handleTermChange = (months) => {
    setTermMonths(months);
    // Mark as pending instead of calculating immediately
    setHasPendingChanges(true);
  };

  // Add a function to handle loan type change
  const handleLoanTypeChange = (type) => {
    setLoanType(type);
    resetSimulationState();
  };

  // Add handlers for car-backed loan
  const handleCarBackedLoanPriceChange = (e) => {
    const value = e.target.value;
    setCarBackedLoanCarPriceInput(value);
  };

  const handleCarBackedLoanPriceBlur = () => {
    const parsedValue = parseAmount(carBackedLoanCarPriceInput);
    const minValue = 100000;
    const maxValue = 1000000;
    const validValue = Math.min(Math.max(parsedValue, minValue), maxValue);
    setCarBackedLoanCarPrice(validValue);
    setCarBackedLoanCarPriceInput(formatInputCurrency(validValue.toString()));
    // Actualizar el monto máximo del préstamo (70% del valor del auto)
    const maxLoanAmount = validValue * 0.7;
    if (carBackedLoanAmount > maxLoanAmount) {
      setCarBackedLoanAmount(maxLoanAmount);
      setCarBackedLoanAmountInput(formatInputCurrency(maxLoanAmount.toString()));
    }
    // Mark as pending instead of calculating immediately
    setHasPendingChanges(true);
  };

  const handleCarBackedLoanAmountChange = (e) => {
    const value = e.target.value;
    setCarBackedLoanAmountInput(value);
  };

  const handleCarBackedLoanAmountBlur = () => {
    const parsedValue = parseAmount(carBackedLoanAmountInput);
    const maxValue = carBackedLoanCarPrice * 0.7; // 70% del valor del auto
    const minValue = 50000;
    const validValue = Math.min(Math.max(parsedValue, minValue), maxValue);
    setCarBackedLoanAmount(validValue);
    setCarBackedLoanAmountInput(formatInputCurrency(validValue.toString()));
    // Mark as pending instead of calculating immediately
    setHasPendingChanges(true);
  };

  const handleCarBackedLoanTermChange = (months) => {
    setCarBackedLoanTermMonths(months);
    // Mark as pending instead of calculating immediately
    setHasPendingChanges(true);
  };

  const calculateCarBackedLoanPayment = async (amount, months) => {
    setIsCalculatingCarBacked(true);
    
    const creditWithCommission = amount / (1 - commissionRate);
    const payment = (creditWithCommission * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -months));
    const totalPayment = payment + gpsRent;
    
    setCarBackedLoanMonthlyPayment(totalPayment);
    setIsCalculatingCarBacked(false);
  };

  // Definición de beneficios para el préstamo de auto
  const autoLoanBenefits = [
    {
      id: "1",
      title: "Tasa Competitiva",
      description: "Interés competitivo del 3.7% mensual para adquirir el auto de tus sueños.",
      icon: <RiMoneyDollarCircleLine className="text-2xl text-[#33FF57]" />,
    },
    {
      id: "2",
      title: "Sin Letras Pequeñas",
      description: "Total transparencia en tu financiamiento, sin cargos ocultos.",
      icon: <BsShieldCheck className="text-2xl text-[#33FF57]" />,
    },
    {
      id: "3",
      title: "Autos desde 2016",
      description: "Financiamos vehículos con año modelo 2016 en adelante.",
      icon: <FaCarSide className="text-2xl text-[#33FF57]" />,
    },
    {
      id: "4",
      title: "Proceso Simple",
      description: "Trámite sencillo con respuesta en 24-48 horas.",
      icon: <BsSpeedometer className="text-2xl text-[#33FF57]" />,
    },
    {
      id: "5",
      title: "Requisitos Mínimos",
      description: "Menos documentación que la banca tradicional.",
      icon: <FaUserCheck className="text-2xl text-[#33FF57]" />,
    },
    {
      id: "6",
      title: "Atención Personalizada",
      description: "Asesoría durante todo el proceso de solicitud y aprobación.",
      icon: <FaClock className="text-2xl text-[#33FF57]" />,
    }
  ];

  // Actualizar la función updateCalculations para manejar los nuevos valores desglosados
  const updateCalculations = async (price, payment, months) => {
    setIsCalculating(true);
    
    const minDownPayment = price * 0.3;
    let validDownPayment = payment;
    if (payment < minDownPayment) {
      validDownPayment = minDownPayment;
      setDownPayment(validDownPayment);
      setDownPaymentInput(formatInputCurrency(validDownPayment.toString()));
    }
    
    const loan = price - validDownPayment;
    const creditWithCommission = loan / (1 - commissionRate);
    
    setLoanAmount(loan);
    const paymentDetails = calculateMonthlyPayment(creditWithCommission, months);
    setMonthlyPayment(paymentDetails.total);
    
    // Aquí podrías guardar los detalles desglosados en el estado si lo necesitas
    
    setIsCalculating(false);
  };

  // Add simulation handler functions
  const handleAutoLoanSimulation = async () => {
    if (!contactFormValid) {
      showNotification('Por favor completa todos los campos de contacto correctamente', 'error');
      return;
    }
    
    setIsCalculating(true);
    try {
      // Calcular aquí en lugar de usar la función externa
      const minDownPayment = carPrice * 0.3;
      let validDownPayment = downPayment;
      if (downPayment < minDownPayment) {
        validDownPayment = minDownPayment;
        setDownPayment(validDownPayment);
        setDownPaymentInput(formatInputCurrency(validDownPayment.toString()));
      }
      
      const loan = carPrice - validDownPayment;
      const creditWithCommission = loan / (1 - commissionRate);
      
      setLoanAmount(loan);
      const paymentDetails = calculateMonthlyPayment(creditWithCommission, termMonths);
      setMonthlyPayment(paymentDetails.total);
      
      // Store payment details in state for display
      setPaymentDetails({
        interestPayment: paymentDetails.interestPayment,
        gpsPayment: paymentDetails.gpsPayment,
        commissionTotal: paymentDetails.commissionTotal
      });
      
      // Guardar animación del pago
      const startValue = 0;
      const endValue = paymentDetails.total;
      const duration = 1500;
      const startTime = Date.now();
      
      const animateValue = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentValue = startValue + progress * (endValue - startValue);
        setAnimatedPayment(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateValue);
        }
      };
      
      requestAnimationFrame(animateValue);
      
      // Guardar en Supabase
      if (appConfig.persistSimulations) {
        await saveSimulation('autoLoan', carPrice, loan, termMonths, paymentDetails.total);
      }
      
      setShowSimulation(true);
      setHasPendingChanges(false);
      
      showNotification('Simulación completada con éxito', 'success');
    } catch (error) {
      console.error('Error en la simulación:', error);
      showNotification('Hubo un error al realizar la simulación', 'error');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCarBackedLoanSimulation = async () => {
    if (!contactFormValid) {
      showNotification('Por favor completa todos los campos de contacto correctamente', 'error');
      return;
    }
    if (!carModel.trim()) {
      showNotification('Por favor ingresa la marca y modelo del auto', 'error');
      return;
    }
    
    setIsCalculatingCarBacked(true);
    try {
      const creditWithCommission = carBackedLoanAmount / (1 - commissionRate);
      const payment = (creditWithCommission * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -carBackedLoanTermMonths));
      const totalPayment = payment + gpsRent;
      
      setCarBackedLoanMonthlyPayment(totalPayment);
      
      await saveSimulation('car_backed_loan', carBackedLoanCarPrice, carBackedLoanAmount, carBackedLoanTermMonths, totalPayment);
    } catch (error) {
      console.error("Error in car backed loan simulation:", error);
      showNotification('Error al simular. Por favor intenta de nuevo.', 'error');
    } finally {
      setIsCalculatingCarBacked(false);
    }
  };

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState('');
  const [redirectStep, setRedirectStep] = useState(1); // 1: Guardando, 2: Conectando, 3: Redirigiendo

  // Función para obtener el icono según el paso de redirección
  const getRedirectStepIcon = (step) => {
    switch (step) {
      case 1:
        return <FaMoneyBillWave className="text-color-1 text-xl" />;
      case 2:
        return <FaUserCheck className="text-color-1 text-xl" />;
      case 3:
        return <BsArrowRight className="text-color-1 text-xl" />;
      default:
        return <FaUserCheck className="text-color-1 text-xl" />;
    }
  };
  
  // Función para obtener el título según el paso de redirección
  const getRedirectStepTitle = (step) => {
    switch (step) {
      case 1:
        return '¡Solicitud Recibida!';
      case 2:
        return 'Conectando...';
      case 3:
        return '¡Todo Listo!';
      default:
        return '¡Solicitud Recibida!';
    }
  };

  // useEffect para cargar datos de simulación desde la navegación y hacer scroll
  useEffect(() => {
    // No hacemos window.scrollTo(0, 0) aquí porque ya lo hace el componente ScrollToTop global
    
    // Manejo de datos de simulación
    if (location.state && location.state.carPrice) {
      const simulationData = location.state;
      console.log("Datos de simulación detectados:", simulationData);
      
      // Actualizar estados con los datos recibidos
      setCarPrice(simulationData.carPrice);
      setCarPriceInput(formatInputCurrency(simulationData.carPrice.toString()));
      setDownPayment(simulationData.downPayment);
      setDownPaymentInput(formatInputCurrency(simulationData.downPayment.toString()));
      setTermMonths(simulationData.termMonths);
      setLoanAmount(simulationData.loanAmount);
      
      // Actualizar cálculos
      updateCalculations(simulationData.carPrice, simulationData.downPayment, simulationData.termMonths);
      
      // Hacer scroll después de un pequeño retraso para asegurar que la página esté cargada
      setTimeout(() => {
        scrollToSimulatorSection();
      }, 800); // Aumentamos el tiempo para asegurar que la página esté completamente cargada
    }
    // Si no hay datos de simulación pero sí un hash, también hacer scroll
    else if (location.hash === '#contact-section') {
      console.log('Hash detectado:', location.hash);
      setTimeout(() => {
        scrollToContactSection();
      }, 800);
    }
    // Si el hash es #simulator o #simulator-section, hacer scroll a la sección del simulador
    else if (location.hash === '#simulator-section') {
      console.log('Hash de simulador detectado:', location.hash);
      setTimeout(() => {
        scrollToSimulatorSection();
      }, 800);
    }
  }, [location]);

  const scrollToContactSection = () => {
    console.log('Intentando hacer scroll al simulador...');
    
    // Intentos de scroll con diferentes métodos
    const tryScrollById = () => {
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        console.log('Elemento encontrado por ID, haciendo scroll...');
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      }
      console.log('No se encontró el elemento por ID');
      return false;
    };
    
    const tryScrollBySelector = () => {
      // Intentar por el encabezado primero
      const headers = Array.from(document.querySelectorAll('h4'));
      const contactHeader = headers.find(el => 
        el.textContent.includes('Información de Contacto')
      );
      
      if (contactHeader) {
        console.log('Encabezado de contacto encontrado, haciendo scroll...');
        contactHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      }
      
      // Si no se encuentra el encabezado, intentar con otros selectores
      console.log('Intentando encontrar la sección por otros medios...');
      return false;
    };
    
    // Intentar primero por ID
    if (!tryScrollById()) {
      // Si falla, intentar por selector
      if (!tryScrollBySelector()) {
        // Si ambos fallan, programar reintentos
        const delays = [500, 1000, 2000, 3000, 5000];
        
        const attemptWithDelays = (index = 0) => {
          if (index >= delays.length) {
            console.log('Se agotaron los intentos de scroll');
            return;
          }
          
          setTimeout(() => {
            console.log(`Reintentando scroll (intento ${index + 1})...`);
            if (!tryScrollById() && !tryScrollBySelector() && index < delays.length - 1) {
              attemptWithDelays(index + 1);
            }
          }, delays[index]);
        };
        
        attemptWithDelays();
      }
    }
  };

  // Función para hacer scroll a la sección del simulador
  const scrollToSimulatorSection = () => {
    console.log('Intentando hacer scroll al simulador...');
    
    // Primero intentar por ID
    const simulatorSectionById = document.getElementById('simulator-section');
    if (simulatorSectionById) {
      console.log('Sección de simulador encontrada por ID, haciendo scroll...');
      simulatorSectionById.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    
    // Luego intentar por clase
    const simulatorSection = document.querySelector('.simulator-section');
    if (simulatorSection) {
      console.log('Sección de simulador encontrada por clase, haciendo scroll...');
      simulatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    
    // Si no encuentra por clase, intentar encontrar por otros medios
    const headers = Array.from(document.querySelectorAll('h2, h3, h4'));
    const simulatorHeader = headers.find(el => 
      el.textContent.includes('Simulador') || 
      el.textContent.includes('Simulación') ||
      el.textContent.includes('Crédito')
    );
    
    if (simulatorHeader) {
      console.log('Encabezado de simulador encontrado, haciendo scroll...');
      simulatorHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    
    console.log('No se encontró la sección del simulador');
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      {/* Hero Section */}
      <Section className="pt-6 md:pt-10 lg:pt-20">
        <div className="container px-4 md:px-6 relative">
          <div className="relative z-1">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h1 mb-4 md:mb-6 text-center text-2xl md:text-4xl lg:text-5xl"
            >
              Tu auto ideal está <br className="md:hidden" />
              <span className="text-gradient-primary">más cerca de lo que crees</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="body-1 mb-6 md:mb-8 text-n-4 text-center max-w-3xl mx-auto text-sm md:text-base"
            >
              Financiamiento flexible y personalizado para que manejes el auto que deseas.
              Sin complicaciones, sin letras pequeñas.
            </motion.p>

            <Generating className="max-w-[940px] mx-auto mb-12 md:mb-20" type="autoLoan" />
          </div>

          {/* Background Effects */}
          <Particles
            className="absolute inset-0"
            particleColor="from-[#33FF57] to-[#40E0D0]"
            quantity={30}
          />
        </div>
      </Section>

      {/* Notification Component */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 px-4 md:px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-[#33FF57]/90' : 'bg-red-500/90'
            } text-black backdrop-blur-sm max-w-[90%] md:max-w-md text-center text-sm md:text-base`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulator Section */}
      <Section id="simulator-section" className="pt-6 md:pt-10">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-4 md:p-8 rounded-xl md:rounded-[2rem] border border-n-6 bg-n-8/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="relative z-1">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-10 text-center"
              >
                Simula tu Crédito <span className="text-color-1 inline-block">en segundos</span>
              </motion.h2>

              <div className="flex justify-center mb-6 md:mb-8">
                <button
                  onClick={() => handleLoanTypeChange('autoLoan')}
                  className={`p-2 rounded-xl border text-sm md:text-base ${
                    loanType === 'autoLoan' ? 'bg-color-1 border-color-1 text-black font-semibold shadow-md' : 'bg-n-6 border-n-6 text-n-3 hover:bg-n-5 hover:border-n-5'
                  } transition-all duration-300 flex-1 mx-1 md:flex-none md:mx-0`}
                >
                  Crédito Automotriz
                </button>
                <button
                  onClick={() => handleLoanTypeChange('carBackedLoan')}
                  className={`p-2 rounded-xl border text-sm md:text-base ml-1 md:ml-4 ${
                    loanType === 'carBackedLoan' ? 'bg-color-1 border-color-1 text-black font-semibold shadow-md' : 'bg-n-6 border-n-6 text-n-3 hover:bg-n-5 hover:border-n-5'
                  } transition-all duration-300 flex-1 mx-1 md:flex-none md:mx-0`}
                >
                  Préstamo por tu Auto
                </button>
              </div>

              {/* Añadimos solo el ID simulator a la estructura original */}
              <div id="simulator" className="simulator-section grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10">
                {loanType === 'autoLoan' ? (
                  <>
                    <div className="bg-n-7/50 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-n-6">
                      <div className="mb-6 md:mb-8">
                        <h5 className="text-n-1 font-semibold mb-3 md:mb-4 text-base md:text-lg">Información de Contacto</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="text-n-3 block mb-1 md:mb-2 text-sm">Nombre</label>
                            <input
                              type="text"
                              name="name"
                              value={contactInfo.name}
                              onChange={handleContactInfoChange}
                              className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 text-sm md:text-base border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                              placeholder="Tu nombre"
                            />
                          </div>
                          <div>
                            <label className="text-n-3 block mb-1 md:mb-2 text-sm">Apellido</label>
                            <input
                              type="text"
                              name="lastName"
                              value={contactInfo.lastName}
                              onChange={handleContactInfoChange}
                              className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 text-sm md:text-base border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                              placeholder="Tu apellido"
                            />
                          </div>
                          <div>
                            <label className="text-n-3 block mb-1 md:mb-2 text-sm">Correo Electrónico</label>
                            <input
                              type="email"
                              name="email"
                              value={contactInfo.email}
                              onChange={handleContactInfoChange}
                              className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 text-sm md:text-base border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                              placeholder="tucorreo@ejemplo.com"
                            />
                          </div>
                          <div>
                            <label className="text-n-3 block mb-1 md:mb-2 text-sm">Teléfono (10 dígitos)</label>
                            <input
                              type="tel"
                              name="phone"
                              value={contactInfo.phone}
                              onChange={handleContactInfoChange}
                              className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 text-sm md:text-base border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                              placeholder="1234567890"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 md:mb-8">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <div className="flex items-center gap-2 mb-2 md:mb-0">
                            <RiMoneyDollarCircleLine className="text-color-1 text-lg md:text-xl" />
                            <label className="text-n-3 text-sm md:text-base">Valor del Auto</label>
                          </div>
                          <div className="relative">
                            <div className="flex items-center">
                              <span className="text-n-3 mr-1 text-sm md:text-base">$</span>
                              <input
                                type="text"
                                value={carPriceInput}
                                onChange={handleCarPriceInputChange}
                                onBlur={handleCarPriceInputBlur}
                                className="w-24 md:w-28 bg-n-6 rounded-lg px-2 py-1 text-right text-n-1 text-sm md:text-base font-medium border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                              />
                            </div>
                            <div className="text-xs text-n-4 text-right mt-1">
                              Min: $100,000 - Max: $1,000,000
                            </div>
                          </div>
                        </div>
                        <div className="relative mt-3 h-2">
                          <div className="absolute inset-0 bg-n-6 rounded-full"></div>
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-color-1/80 to-color-1 rounded-full pointer-events-none transition-all duration-200 ease-out"
                            style={{ width: `${((carPrice - 100000) / 900000) * 100}%` }}
                          />
                          <input
                            type="range"
                            min="100000"
                            max="1000000"
                            step="1000"
                            value={carPrice}
                            onChange={handleCarPriceChange}
                            className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-color-1 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:translate-y-[-2px] [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-color-1 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:translate-y-[-2px]"
                          />
                        </div>
                      </div>

                      <div className="mb-6 md:mb-8">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <div className="flex items-center gap-2 mb-2 md:mb-0">
                            <RiMoneyDollarCircleLine className="text-color-1 text-lg md:text-xl" />
                            <div className="flex items-center group">
                              <label className="text-n-3 mr-1 text-sm md:text-base">Enganche</label>
                              <div 
                                className="text-n-3 cursor-help relative"
                                onMouseEnter={() => setShowTip(true)}
                                onMouseLeave={() => setShowTip(false)}
                              >
                                <BsInfoCircle className="text-xs" />
                                <AnimatePresence>
                                  {showTip && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      className="absolute left-0 bottom-full mb-2 w-48 z-50"
                                    >
                                      <div className="bg-n-8/90 backdrop-blur-sm text-xs text-n-3 p-2 rounded-lg border border-n-6">
                                        El enganche mínimo requerido es del 30% del valor del vehículo
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="flex items-center">
                              <span className="text-n-3 mr-1 text-sm md:text-base">$</span>
                              <input
                                type="text"
                                value={downPaymentInput}
                                onChange={handleDownPaymentInputChange}
                                onBlur={handleDownPaymentInputBlur}
                                className="w-24 md:w-28 bg-n-6 rounded-lg px-2 py-1 text-right text-n-1 text-sm md:text-base font-medium border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                              />
                            </div>
                            <div className="text-xs text-n-4 text-right mt-1">
                              Mínimo: {formatCurrency(carPrice * 0.3)}
                            </div>
                            {parseAmount(downPaymentInput) < carPrice * 0.3 && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full left-0 right-0 mt-1 text-xs text-red-500"
                              >
                                El enganche debe ser al menos 30% del valor
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 md:mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <FaClock className="text-color-1 text-lg md:text-xl" />
                          <label className="text-n-3 text-sm md:text-base">Plazo (meses)</label>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
                          {[6, 12, 18, 24, 36, 48].map((months) => (
                            <motion.button
                              key={months}
                              onClick={() => handleTermChange(months)}
                              className={`p-2 rounded-xl border text-sm md:text-base ${
                                termMonths === months
                                  ? 'bg-color-1 border-color-1 text-black font-semibold shadow-md'
                                  : 'bg-n-6 border-n-6 text-n-3 hover:bg-n-5 hover:border-n-5'
                              } transition-all duration-300`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {months} meses
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-n-7/50 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-n-6">
                      <h4 className="h4 mb-6 flex items-center gap-2">
                        <FaCarSide className="text-color-1 text-2xl" />
                        Tu Cotización
                      </h4>

                      {/* Auto Loan Results */}
                      {!contactFormValid ? (
                        <div className="p-4 bg-n-8/90 rounded-lg border border-red-500/50">
                          <div className="flex items-center gap-3 text-red-500">
                            <BsInfoCircle className="text-xl" />
                            <div className="space-y-1">
                              <p>Por favor completa todos los campos de contacto para continuar</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {!showSimulation && (
                            <div className="flex justify-center">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAutoLoanSimulation}
                                className="bg-color-1 hover:bg-color-1/90 text-black font-semibold rounded-xl px-8 py-4"
                              >
                                {isCalculating ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    Simulando...
                                  </div>
                                ) : (
                                  "Simular mi Crédito"
                                )}
                              </motion.button>
                            </div>
                          )}

                          {showSimulation && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-n-7/50 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-n-6 mt-6"
                            >
                              <h4 className="h4 mb-6 flex items-center gap-2">
                                <FaCarSide className="text-color-1 text-2xl" />
                                Tu Cotización
                              </h4>
                              
                              <div className="space-y-4">
                                {/* Formato exactamente como lo pide el usuario */}
                                <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                                  <span className="text-n-3">VALOR DEL AUTO:</span>
                                  <span className="text-lg font-semibold text-n-1">{formatCurrency(carPrice)}</span>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                                  <span className="text-n-3">MONTO A FINANCIAR:</span>
                                  <span className="text-lg font-semibold text-n-1">{formatCurrency(loanAmount)}</span>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                                  <span className="text-n-3">PLAZO:</span>
                                  <span className="text-lg font-semibold text-n-1">{termMonths} meses</span>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                                  <span className="text-n-3">ENGANCHE (Pago inicial a la agencia):</span>
                                  <span className="text-lg font-semibold text-n-1">{formatCurrency(downPayment)}</span>
                                </div>
                                
                                <div className="my-2 border-t border-n-6"></div>
                                
                                <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                                  <span className="text-n-3">COMISIÓN POR APERTURA: (mensual)</span>
                                  <span className="text-lg font-semibold text-n-1">
                                    {formatCurrency(paymentDetails?.commissionTotal / termMonths)}
                                  </span>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                                  <span className="text-n-3">GPS: (mensual)</span>
                                  <span className="text-lg font-semibold text-n-1">
                                    {formatCurrency(paymentDetails?.gpsPayment)}
                                  </span>
                                </div>
                                
                                <div className="my-2 border-t border-n-6"></div>
                                
                                {/* Pago total */}
                                <div className="p-4 bg-gradient-to-r from-color-1/10 to-transparent rounded-lg border border-color-1/30">
                                  <div className="flex justify-between items-center">
                                    <span className="text-n-2 font-medium">PAGO MENSUAL:</span>
                                    <span className="text-2xl font-bold text-color-1">
                                      {formatCurrency(monthlyPayment)}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Botón de solicitud */}
                                <div className="pt-4">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLoanApplication}
                                    disabled={isSubmittingApplication}
                                    className="w-full bg-gradient-to-r from-[#33FF57] to-[#40E0D0] text-black font-semibold rounded-xl py-4 transition-all"
                                  >
                                    {isSubmittingApplication ? (
                                      <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        Enviando Solicitud...
                                      </div>
                                    ) : (
                                      <span className="flex items-center justify-center gap-2">
                                        Solicitar Este Crédito
                                        <BsArrowRight />
                                      </span>
                                    )}
                                  </motion.button>
                                </div>
                                
                                {hasPendingChanges && (
                                  <div className="flex justify-center mt-4">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={handleAutoLoanSimulation}
                                      className="bg-yellow-500 text-black font-semibold rounded-xl px-8 py-3 relative overflow-hidden"
                                    >
                                      <motion.span 
                                        className="absolute inset-0 bg-yellow-300/30"
                                        animate={{
                                          x: ["0%", "100%"],
                                          opacity: [0, 0.3, 0]
                                        }}
                                        transition={{
                                          duration: 1.5,
                                          repeat: Infinity,
                                          repeatType: "loop"
                                        }}
                                      />
                                      <div className="flex items-center justify-center">
                                        <span className="mr-1">Actualizar Simulación</span>
                                        <motion.svg 
                                          xmlns="http://www.w3.org/2000/svg" 
                                          width="16" 
                                          height="16" 
                                          viewBox="0 0 24 24" 
                                          fill="none" 
                                          stroke="currentColor" 
                                          strokeWidth="2" 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round"
                                          animate={{
                                            rotate: [0, 360]
                                          }}
                                          transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "linear"
                                          }}
                                        >
                                          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.25"></path>
                                          <path d="M21 3v9h-9"></path>
                                        </motion.svg>
                                      </div>
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Columna Izquierda */}
                      <div className="space-y-6">
                        {/* Información del Auto */}
                        <div className="bg-n-7/50 rounded-xl p-6 backdrop-blur-sm border border-n-6">
                          <h4 className="h4 mb-6 flex items-center gap-2">
                            <FaCarSide className="text-color-1 text-2xl" />
                            Información del Auto
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-n-3 block mb-2">Año del Auto</label>
                              <select
                                value={carYear}
                                onChange={(e) => setCarYear(Number(e.target.value))}
                                className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 font-medium border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                              >
                                {Array.from({ length: 9 }, (_, i) => 2024 - i).map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-n-3 block mb-2">Marca y Modelo</label>
                              <input
                                type="text"
                                value={carModel}
                                onChange={(e) => setCarModel(e.target.value)}
                                placeholder="Ej: Honda Civic"
                                className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 font-medium border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-n-3 block mb-2">
                                Valor Estimado del Auto (Según Libro Azul)
                                <div className="text-xs text-n-4">
                                  El valor debe estar basado en el Libro Azul de Kelley Blue Book
                                </div>
                              </label>
                              <div className="flex items-center">
                                <span className="text-n-3 mr-2">$</span>
                                <input
                                  type="text"
                                  value={carBackedLoanCarPriceInput}
                                  onChange={handleCarBackedLoanPriceChange}
                                  onBlur={handleCarBackedLoanPriceBlur}
                                  className="w-full bg-n-6 rounded-lg px-3 py-2 text-right text-n-1 font-medium border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                                />
                              </div>
                              <div className="text-xs text-n-4 mt-1">
                                Min: $100,000 - Max: $1,000,000
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detalles del Préstamo */}
                        <div className="bg-n-7/50 rounded-xl p-6 backdrop-blur-sm border border-n-6">
                          <h4 className="h4 mb-6">Detalles del Préstamo</h4>
                          <div className="space-y-6">
                            <div>
                              <label className="text-n-3 block mb-2">Monto del Préstamo</label>
                              <div className="flex items-center">
                                <span className="text-n-3 mr-2">$</span>
                                <input
                                  type="text"
                                  value={carBackedLoanAmountInput}
                                  onChange={handleCarBackedLoanAmountChange}
                                  onBlur={handleCarBackedLoanAmountBlur}
                                  className="w-full bg-n-6 rounded-lg px-3 py-2 text-right text-n-1 font-medium border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                                />
                              </div>
                              <div className="text-xs text-n-4 mt-1">
                                Hasta {formatCurrency(carBackedLoanCarPrice * 0.7)} (70% del valor del auto)
                              </div>
                            </div>

                            <div>
                              <label className="text-n-3 block mb-2">Plazo del Préstamo</label>
                              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {[6, 12, 18, 24, 36, 48].map((months) => (
                                  <motion.button
                                    key={months}
                                    onClick={() => handleCarBackedLoanTermChange(months)}
                                    className={`p-2 rounded-xl border ${
                                      carBackedLoanTermMonths === months
                                        ? 'bg-color-1 border-color-1 text-black font-semibold shadow-md'
                                        : 'bg-n-6 border-n-6 text-n-3 hover:bg-n-5 hover:border-n-5'
                                    } transition-all duration-300`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {months} meses
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Columna Derecha */}
                      <div className="space-y-6">
                        {/* Información de Contacto */}
                        <div id="contact-section" className="bg-n-7/50 rounded-xl p-6 backdrop-blur-sm border border-n-6">
                          <h4 className="h4 mb-6">Información de Contacto</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-n-3 block mb-2">Nombre</label>
                              <input
                                type="text"
                                name="name"
                                value={contactInfo.name}
                                onChange={handleContactInfoChange}
                                className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                                placeholder="Tu nombre"
                              />
                            </div>
                            <div>
                              <label className="text-n-3 block mb-2">Apellido</label>
                              <input
                                type="text"
                                name="lastName"
                                value={contactInfo.lastName}
                                onChange={handleContactInfoChange}
                                className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                                placeholder="Tu apellido"
                              />
                            </div>
                            <div>
                              <label className="text-n-3 block mb-2">Correo Electrónico</label>
                              <input
                                type="email"
                                name="email"
                                value={contactInfo.email}
                                onChange={handleContactInfoChange}
                                className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                                placeholder="tucorreo@ejemplo.com"
                              />
                            </div>
                            <div>
                              <label className="text-n-3 block mb-2">Teléfono (10 dígitos)</label>
                              <input
                                type="tel"
                                name="phone"
                                value={contactInfo.phone}
                                onChange={handleContactInfoChange}
                                className="w-full bg-n-6 rounded-lg px-3 py-2 text-n-1 border border-n-6 focus:border-color-1 outline-none transition-colors duration-300"
                                placeholder="1234567890"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Tu Cotización - Préstamo por Auto */}
                        <div className="bg-n-7/50 rounded-xl p-6 backdrop-blur-sm border border-n-6">
                          <h4 className="h4 mb-6">Tu Cotización</h4>
                          {/* Car Backed Loan Results */}
                          {(!contactFormValid || !carModel.trim()) ? (
                            <div className="p-4 bg-n-8/90 rounded-lg border border-red-500/50">
                              <div className="flex items-center gap-3 text-red-500">
                                <BsInfoCircle className="text-xl" />
                                <div className="space-y-1">
                                  <p>Para continuar, por favor completa:</p>
                                  <ul className="list-disc list-inside">
                                    {!contactFormValid && <li>Información de contacto</li>}
                                    {!carModel.trim() && <li>Marca y modelo del auto</li>}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {!showSimulation && (
                                <div className="flex justify-center">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCarBackedLoanSimulation}
                                    className="bg-color-1 hover:bg-color-1/90 text-black font-semibold rounded-xl px-8 py-4"
                                  >
                                    {isCalculatingCarBacked ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        Simulando...
                                      </div>
                                    ) : (
                                      "Simular mi Préstamo"
                                    )}
                                  </motion.button>
                                </div>
                              )}

                              {showSimulation && (
                                <>
                                  <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                                    <span className="text-n-3">Monto Solicitado:</span>
                                    <span className="text-xl font-semibold text-n-1">
                                      {formatCurrency(carBackedLoanAmount)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center p-3 bg-n-8/70 rounded-lg">
                                    <span className="text-n-3">Plazo:</span>
                                    <span className="text-xl font-semibold text-n-1">
                                      {carBackedLoanTermMonths} meses
                                    </span>
                                  </div>
                                  <div className="p-4 bg-n-8/90 rounded-lg border border-n-6">
                                    <div className="flex justify-between items-center">
                                      <span className="text-n-3">Pago Mensual Estimado:</span>
                                      <AnimatePresence mode="wait">
                                        {isCalculatingCarBacked ? (
                                          <motion.div
                                            key="loader"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-8 flex items-center"
                                          >
                                            <div className="w-6 h-6 border-2 border-color-1 border-t-transparent rounded-full animate-spin"></div>
                                          </motion.div>
                                        ) : (
                                          <motion.span
                                            key="amount"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="text-2xl font-bold text-color-1"
                                          >
                                            {formatCurrency(animatedPayment)}
                                          </motion.span>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  </div>

                                  <div className="flex justify-center mt-6">
                                    <motion.button
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: hasPendingChanges ? 0.5 : 1, y: 0 }}
                                      onClick={handleLoanApplication}
                                      className="w-full bg-gradient-to-r from-[#33FF57] to-[#40E0D0] text-black font-semibold rounded-xl px-8 py-4 hover:opacity-90 transition-opacity"
                                      disabled={hasPendingChanges}
                                    >
                                      {isSubmittingApplication ? (
                                        <div className="flex items-center justify-center gap-2">
                                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                          Enviando...
                                        </div>
                                      ) : (
                                        "Solicitar Préstamo"
                                      )}
                                    </motion.button>
                                  </div>
                                  
                                  {hasPendingChanges && (
                                    <div className="flex justify-center mt-4">
                                      <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCarBackedLoanSimulation}
                                        className="bg-yellow-500 text-black font-semibold rounded-xl px-8 py-3 relative overflow-hidden"
                                      >
                                        <motion.span 
                                          className="absolute inset-0 bg-yellow-300/30"
                                          animate={{
                                            x: ["0%", "100%"],
                                            opacity: [0, 0.3, 0]
                                          }}
                                          transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "loop"
                                          }}
                                        />
                                        <div className="flex items-center justify-center">
                                          <span className="mr-1">Actualizar Simulación</span>
                                          <motion.svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            animate={{
                                              rotate: [0, 360]
                                            }}
                                            transition={{
                                              duration: 4,
                                              repeat: Infinity,
                                              ease: "linear"
                                            }}
                                          >
                                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.25"></path>
                                            <path d="M21 3v9h-9"></path>
                                          </motion.svg>
                                        </div>
                                      </motion.button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#33FF57]/10 to-[#40E0D0]/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#40E0D0]/10 to-[#33FF57]/10 blur-[120px] rounded-full" />

            {/* Sección de Explicación del Proceso */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-10 bg-n-7/50 rounded-xl p-8 backdrop-blur-sm border border-n-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#33FF57]/5 to-[#40E0D0]/5 blur-[80px] rounded-full" />
              
              <h4 className="h4 mb-6 flex items-center gap-2">
                {loanType === 'autoLoan' ? 
                  <><FaCarSide className="text-color-1 text-2xl" /> ¿Cómo funciona el Crédito Automotriz?</> : 
                  <><RiMoneyDollarCircleLine className="text-color-1 text-2xl" /> ¿Cómo funciona el Préstamo por Auto?</>
                }
              </h4>
              
              {loanType === 'autoLoan' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4 text-n-3">
                    <p className="text-n-1">El <span className="text-color-1 font-medium">Crédito Automotriz</span> te permite adquirir un vehículo nuevo o seminuevo pagando una parte inicial (enganche) y financiando el resto a través de pagos mensuales.</p>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">1</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Selección del vehículo:</span> Eliges el auto que deseas comprar (modelo 2016 en adelante).</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">2</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Enganche:</span> Pagas mínimo el 30% del valor del auto como pago inicial.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-n-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">3</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Financiamiento:</span> Nosotros cubrimos el resto del valor y te convertimos en propietario del vehículo de inmediato.</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">4</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Pagos mensuales:</span> Realizas pagos fijos durante el plazo elegido (hasta 48 meses) para liquidar el préstamo.</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">5</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Garantía:</span> El vehículo queda como garantía del préstamo hasta finalizar los pagos, pero tú lo usas normalmente.</p>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#33FF57]/10 to-[#40E0D0]/10 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl text-color-1 mb-3">
                        <FaCarSide />
                      </div>
                      <h5 className="h5 mb-2">Tu Auto, Tu Decisión</h5>
                      <p className="text-n-3">Con nuestro crédito automotriz obtienes la libertad de elegir el vehículo que realmente deseas, con un proceso simple y transparente.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4 text-n-3">
                    <p className="text-n-1">El <span className="text-color-1 font-medium">Préstamo por Auto</span> te permite obtener liquidez inmediata utilizando tu vehículo como garantía, sin tener que dejarlo ni venderlo.</p>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">1</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Valoración del vehículo:</span> Evaluamos el valor comercial actual de tu auto según el Libro Azul.</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">2</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Monto del préstamo:</span> Puedes solicitar hasta el 70% del valor de tu auto (según condiciones).</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-n-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">3</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Aprobación rápida:</span> Evaluamos tu solicitud y aprobamos en 48 horas o menos.</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">4</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Depósito inmediato:</span> Recibe el dinero en tu cuenta y continúa usando tu auto normalmente.</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#33FF57]/10 flex items-center justify-center mt-0.5">
                        <span className="text-[#33FF57] text-sm font-bold">5</span>
                      </div>
                      <p><span className="text-n-1 font-medium">Pagos mensuales:</span> Realizas pagos fijos durante el plazo elegido (hasta 48 meses) para liquidar el préstamo.</p>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#33FF57]/10 to-[#40E0D0]/10 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl text-color-1 mb-3">
                        <RiMoneyDollarCircleLine />
                      </div>
                      <h5 className="h5 mb-2">Liquidez Inmediata</h5>
                      <p className="text-n-3">Con nuestro préstamo por auto obtienes el efectivo que necesitas sin dejar de usar tu vehículo. Un proceso rápido y sin complicaciones.</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#33FF57]/10 to-[#40E0D0]/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#40E0D0]/10 to-[#33FF57]/10 blur-[120px] rounded-full" />
          </motion.div>
        </div>
      </Section>

      {/* Features Grid */}
      <Section className="pt-10">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: <FaCarSide className="text-[#33FF57] text-2xl" />,
                title: "Autos desde 2016",
                description: "Amplia variedad de modelos disponibles"
              },
              {
                icon: <RiMoneyDollarCircleLine className="text-[#33FF57] text-2xl" />,
                title: "Tasa Competitiva",
                description: "3.7% mensual fijo"
              },
              {
                icon: <FaUserCheck className="text-[#33FF57] text-2xl" />,
                title: "Proceso Simple",
                description: "Respuesta en 48 horas"
              },
              {
                icon: <BsShieldCheck className="text-[#33FF57] text-2xl" />,
                title: "Sin Letras Pequeñas",
                description: "Transparencia total en tu crédito"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-8 rounded-[2rem] border border-n-6 hover:border-n-5 bg-n-8/80 backdrop-blur-sm transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-n-6">
                  {feature.icon}
                </div>
                <h3 className="h5 mb-2">{feature.title}</h3>
                <p className="text-n-4">{feature.description}</p>
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-[#33FF57]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Process Section */}
      <Section className="pt-20">
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="h3 mb-12 text-center"
          >
            Proceso Simple y <span className="text-gradient-primary">Transparente</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaUserCheck className="text-[#33FF57] text-3xl" />,
                title: "Solicitud",
                description: "Llena el formulario en línea en minutos"
              },
              {
                icon: <BsSpeedometer className="text-[#33FF57] text-3xl" />,
                title: "Evaluación",
                description: "Revisión rápida de tu caso"
              },
              {
                icon: <FaMoneyBillWave className="text-[#33FF57] text-3xl" />,
                title: "Aprobación",
                description: "Respuesta en 48 horas"
              },
              {
                icon: <FaClock className="text-[#33FF57] text-3xl" />,
                title: "Formalización",
                description: "Firma y recibe tu auto"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-n-7 hover:bg-n-6 transition-colors duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-[#33FF57]/20 to-[#40E0D0]/20">
                  {step.icon}
                </div>
                <h3 className="h5 mb-4">{step.title}</h3>
                <p className="text-n-4">{step.description}</p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#33FF57]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section className="pt-20">
        <div className="container">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative z-1 max-w-[940px] mx-auto rounded-[2.5rem] p-10 overflow-hidden"
            >
              <div className="relative z-1">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="h3 mb-6 text-center"
                >
                  Beneficios que nos <span className="text-gradient-primary">Distinguen</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {autoLoanBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative p-6 rounded-xl bg-n-7 hover:bg-n-6 transition-colors duration-300"
                    >
                      <div className="flex items-center mb-4">
                        <div className="mr-4">{benefit.icon}</div>
                        <h3 className="h6">{benefit.title}</h3>
                      </div>
                      <p className="text-n-4">{benefit.description}</p>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#33FF57]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Background Effects */}
              <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#33FF57]/10 to-[#40E0D0]/10 blur-[120px] rounded-full" />
              <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#40E0D0]/10 to-[#33FF57]/10 blur-[120px] rounded-full" />
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Comparison Section */}
      <Section className="pt-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-[2.5rem] p-10 overflow-hidden"
          >
            <div className="relative z-1">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="h3 mb-12 text-center"
              >
                ¿Por qué elegir <span className="text-gradient-primary">Fincentiva</span>?
              </motion.h2>

              <div className="grid lg:grid-cols-2 gap-10">
                {/* Comparison Cards */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-2xl border border-n-6 bg-n-8/80 backdrop-blur-sm"
                >
                  <div className="relative z-1 p-8">
                    <div className="grid gap-6">
                      {[
                        {
                          feature: "Proceso de Aprobación",
                          fincentiva: {
                            title: "Simple y Rápido",
                            description: "Respuesta en 24-48 horas",
                            icon: <BsSpeedometer className="text-[#33FF57] text-xl" />
                          },
                          traditional: {
                            title: "Complejo y Lento",
                            description: "7-15 días hábiles",
                            icon: <FaClock className="text-n-4 text-xl" />
                          }
                        },
                        {
                          feature: "Requisitos",
                          fincentiva: {
                            title: "Flexibles",
                            description: "Historial crediticio no determinante",
                            icon: <BsShieldCheck className="text-[#33FF57] text-xl" />
                          },
                          traditional: {
                            title: "Estrictos",
                            description: "Buró impecable requerido",
                            icon: <FaUserCheck className="text-n-4 text-xl" />
                          }
                        },
                        {
                          feature: "Financiamiento",
                          fincentiva: {
                            title: "Mayor Accesibilidad",
                            description: "Desde 30% de enganche, hasta 48 meses",
                            icon: <RiMoneyDollarCircleLine className="text-[#33FF57] text-xl" />
                          },
                          traditional: {
                            title: "Más Restrictivo",
                            description: "40-50% de enganche, máximo 36 meses",
                            icon: <RiMoneyDollarCircleLine className="text-n-4 text-xl" />
                          }
                        }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-n-7 border border-n-6"
                        >
                          <div className="col-span-2 mb-2">
                            <h4 className="text-n-1 font-medium">{item.feature}</h4>
                          </div>
                          <div className="space-y-2 p-3 rounded-lg bg-gradient-to-br from-[#33FF57]/10 to-transparent">
                            <div className="flex items-center gap-2">
                              {item.fincentiva.icon}
                              <span className="text-[#33FF57] font-medium">Fincentiva</span>
                            </div>
                            <div className="text-n-1 font-medium">{item.fincentiva.title}</div>
                            <div className="text-n-3 text-sm">{item.fincentiva.description}</div>
                          </div>
                          <div className="space-y-2 p-3 rounded-lg bg-n-8">
                            <div className="flex items-center gap-2">
                              {item.traditional.icon}
                              <span className="text-n-3 font-medium">Banca Tradicional</span>
                            </div>
                            <div className="text-n-2 font-medium">{item.traditional.title}</div>
                            <div className="text-n-4 text-sm">{item.traditional.description}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Background Effects */}
                  <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#33FF57]/10 to-[#40E0D0]/10 blur-[120px] rounded-full" />
                  <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#40E0D0]/10 to-[#33FF57]/10 blur-[120px] rounded-full" />
                </motion.div>

                {/* CTA Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-n-7 to-n-8 border border-n-6"
                >
                  <div className="relative z-1 p-8">
                    <h3 className="h4 mb-4">¿Listo para estrenar auto?</h3>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {[
                          {
                            icon: <BsSpeedometer className="text-[#33FF57] text-xl" />,
                            text: "Proceso 100% digital"
                          },
                          {
                            icon: <BsShieldCheck className="text-[#33FF57] text-xl" />,
                            text: "Sin cargos ocultos"
                          },
                          {
                            icon: <FaUserCheck className="text-[#33FF57] text-xl" />,
                            text: "Asesoría personalizada"
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#33FF57]/10 flex items-center justify-center">
                              {item.icon}
                            </div>
                            <span className="text-n-3">{item.text}</span>
                          </div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="button button-gradient w-full py-4 rounded-xl"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Solicitar mi Crédito
                          <BsArrowRight className="text-xl" />
                        </span>
                      </motion.button>

                      <div className="text-center">
                        <div className="text-sm text-n-3 mb-1">¿Necesitas ayuda?</div>
                        <a href="tel:+528116364522" className="text-[#33FF57] hover:underline text-sm">
                          Llámanos al (81) 1636-4522
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#33FF57]/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#40E0D0]/10 rounded-full blur-3xl" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Pantalla de redirección */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-n-8/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-5"
          >
            <div className="bg-n-7 rounded-2xl p-8 max-w-md w-full flex flex-col items-center relative overflow-hidden">
              {/* Partículas de fondo */}
              <div className="absolute inset-0 opacity-10">
                <Particles />
              </div>
              
              {/* Gradientes de fondo */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-color-1/20 to-transparent opacity-20 rounded-t-2xl" />
              <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-color-1/10 to-transparent opacity-10 rounded-b-2xl" />
              
              <div className="w-16 h-16 mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-color-1 border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 rounded-full bg-n-7 flex items-center justify-center">
                  {getRedirectStepIcon(redirectStep)}
                </div>
              </div>
              
              <h4 className="h4 mb-2 relative">{getRedirectStepTitle(redirectStep)}</h4>
              <p className="body-2 text-n-3 mb-6 relative">{redirectMessage}</p>
              
              <div className="w-full space-y-2 mb-4 relative">
                <div className="flex justify-between text-xs text-n-3">
                  <span>Guardando</span>
                  <span>Conectando</span>
                  <span>Redirigiendo</span>
                </div>
                <div className="w-full bg-n-6 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-color-1"
                    initial={{ width: 0 }}
                    animate={{ width: `${(redirectStep / 3) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
              
              <p className="text-xs text-n-4 mt-4 relative">
                Serás redirigido automáticamente a WhatsApp para hablar con un asesor
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoLoan;