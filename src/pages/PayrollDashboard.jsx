import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Custom hook for responsive design
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const PayrollDashboard = ({ disableNotifications = false }) => {
  // Add the window size hook
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // State for all data
  const [productSimulations, setProductSimulations] = useState([]);
  const [cashSimulations, setCashSimulations] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  
  // Estado para los gráficos
  const [dailyAllSimulationsCounts, setDailyAllSimulationsCounts] = useState({
    labels: [],
    data: []
  });
  const [dailyAllRequestsCounts, setDailyAllRequestsCounts] = useState({
    labels: [],
    data: []
  });
  
  const [loading, setLoading] = useState(true);
  const [newLeadNotification, setNewLeadNotification] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Referencias para controlar las notificaciones procesadas
  const processedNotificationsRef = useRef(new Set());
  const lastFetchTimeRef = useRef(new Date());

  // Debugging info
  useEffect(() => {
    console.log("PayrollDashboard component mounted or re-rendered", { lastUpdated });
  }, [lastUpdated]);

  // Helper function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Helper function to get the last 10 days as labels
  const getLast10Days = () => {
    const dates = [];
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
      }).format(date));
    }
    return dates;
  };

  // Function to show a notification when a new lead arrives
  const showLeadNotification = (lead, type = 'producto') => {
    // Si las notificaciones están deshabilitadas, no mostramos nada
    if (disableNotifications) {
      console.log('Notificaciones deshabilitadas en PayrollDashboard - usando sistema centralizado');
      return;
    }
    
    console.log(`Mostrando notificación para nuevo ${type}:`, lead);
    
    // No mostrar notificación si ya se ha procesado este ID
    const notificationId = `${type}_${lead.id}`;
    if (processedNotificationsRef.current.has(notificationId)) {
      console.log(`Notificación ${notificationId} ya procesada, ignorando...`);
      return;
    }
    
    // Marcar esta notificación como procesada
    processedNotificationsRef.current.add(notificationId);
    
    // Reproducir sonido de notificación
    playNotificationSound();
    
    setNewLeadNotification({
      lead,
      type,
      timestamp: new Date().getTime()
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setNewLeadNotification(prev => {
        // Solo limpiar si es la misma notificación (para evitar cerrar una nueva)
        if (prev?.lead?.id === lead.id && prev?.type === type) {
          return null;
        }
        return prev;
      });
    }, 10000);
  };
  
  // Función para reproducir un sonido de notificación
  const playNotificationSound = () => {
    try {
      // Crear un contexto de audio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Función para generar un pitido individual
      const createBeep = (startTime, duration = 0.15) => {
        // Crear un oscilador para el sonido
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Configurar el sonido (tipo de onda, frecuencia, volumen)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, startTime); // Nota La (A5)
        
        // Ajustar el volumen
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        // Conectar los nodos
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Iniciar y detener en el tiempo especificado
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      // Crear 3 pitidos espaciados por 0.2 segundos
      const now = audioContext.currentTime;
      createBeep(now);
      createBeep(now + 0.2);
      createBeep(now + 0.4);
      
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  };

  // Setup real-time subscriptions
  useEffect(() => {
    console.log("Configurando suscripciones en tiempo real para Dashboard de Nómina");
    
    // Setup real-time for product_simulations
    const productChannel = supabase
      .channel('product-simulations-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'product_simulations' 
      }, (payload) => {
        console.log('Cambio detectado en product_simulations:', payload);
        handleProductChange(payload);
      })
      .subscribe((status) => {
        console.log('Estado de suscripción (product_simulations):', status);
      });
      
    // Setup real-time for cash_requests
    const cashChannel = supabase
      .channel('cash-requests-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cash_requests' 
      }, (payload) => {
        console.log('Cambio detectado en cash_requests:', payload);
        handleCashChange(payload);
      })
      .subscribe((status) => {
        console.log('Estado de suscripción (cash_requests):', status);
      });
      
    // Setup real-time for selected_plans
    const plansChannel = supabase
      .channel('selected-plans-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'selected_plans' 
      }, (payload) => {
        console.log('Cambio detectado en selected_plans:', payload);
        handlePlanChange(payload);
      })
      .subscribe((status) => {
        console.log('Estado de suscripción (selected_plans):', status);
      });
    
    // Cleanup function
    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(cashChannel);
      supabase.removeChannel(plansChannel);
    };
  }, []);
  
  // Función para verificar registros recientes en las tres tablas
  const checkRecentRegistrations = () => {
    // Si las notificaciones están deshabilitadas, no hacemos nada
    if (disableNotifications) return;
    
    const checkTable = (records, type) => {
      if (!records || records.length === 0) return;
      
      // Obtener la hora actual y restar un minuto
      const oneMinuteAgo = new Date();
      oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
      
      // Hora de la última actualización
      const lastFetchTime = lastFetchTimeRef.current;
      
      // Filtrar registros recientes
      const newRegistrations = records.filter(record => {
        const createdAt = new Date(record.created_at);
        return createdAt > lastFetchTime && createdAt > oneMinuteAgo;
      });
      
      console.log(`Se encontraron ${newRegistrations.length} registros nuevos en ${type}`);
      
      // Mostrar notificación para el registro más reciente
      if (newRegistrations.length > 0) {
        newRegistrations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        showLeadNotification(newRegistrations[0], type);
      }
    };
    
    // Verificar cada tabla
    checkTable(productSimulations, 'simulación de producto');
    checkTable(cashSimulations, 'simulación de efectivo');
    checkTable(selectedPlans, 'plan seleccionado');
    
    // Actualizar tiempo de última consulta
    lastFetchTimeRef.current = new Date();
  };
  
  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      console.log("Cargando datos iniciales del Dashboard de Nómina...");
      try {
        setLoading(true);
        
        // Fetch product simulations
        const { data: products, error: productsError } = await supabase
          .from('product_simulations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (productsError) throw productsError;
        console.log("Simulaciones de productos cargadas:", products?.length || 0);
        setProductSimulations(products || []);
        
        // Fetch cash requests
        const { data: cash, error: cashError } = await supabase
          .from('cash_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (cashError) throw cashError;
        console.log("Simulaciones de efectivo cargadas:", cash?.length || 0);
        setCashSimulations(cash || []);
        
        // Fetch selected plans
        const { data: plans, error: plansError } = await supabase
          .from('selected_plans')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (plansError) throw plansError;
        console.log("Planes seleccionados cargados:", plans?.length || 0);
        setSelectedPlans(plans || []);
        
        // Prepare chart data con todas las simulaciones y solicitudes combinadas
        if (products && cash) {
          prepareAllSimulationsData([...products, ...cash]);
        }
        
        // Usar todos los planes seleccionados para el gráfico de solicitudes
        if (plans) {
          prepareAllRequestsData(plans);
        }
        
        // Verificar registros recientes para notificaciones
        checkRecentRegistrations();
        
      } catch (error) {
        console.error('Error al cargar datos iniciales del Dashboard de Nómina:', error);
      } finally {
        setLoading(false);
        setLastUpdated(new Date());
      }
    };

    // Cargar datos iniciales
    fetchInitialData();
    
    // Intervalo de refresco cada 30 segundos
    const refreshInterval = setInterval(() => {
      console.log("Refrescando datos de nómina por intervalo");
      fetchInitialData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Handle product simulation changes
  const handleProductChange = (payload) => {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      // Show notification for new record
      if (eventType === 'INSERT') {
        showLeadNotification(newRecord, 'simulación de producto');
      }
      
      // Update product simulations list
      setProductSimulations(prev => {
        const filteredList = prev.filter(item => item.id !== newRecord.id);
        const newList = [newRecord, ...filteredList].slice(0, 20);
        
        // Actualizar gráficos con todas las simulaciones
        const allSimulations = [...newList, ...cashSimulations];
        prepareAllSimulationsData(allSimulations);
        
        return newList;
      });
    } 
    else if (eventType === 'DELETE') {
      // Remove from list
      setProductSimulations(prev => {
        const newList = prev.filter(item => item.id !== payload.old.id);
        
        // Actualizar gráficos con todas las simulaciones
        const allSimulations = [...newList, ...cashSimulations];
        prepareAllSimulationsData(allSimulations);
        
        return newList;
      });
    }
    
    setLastUpdated(new Date());
  };
  
  // Handle cash request changes
  const handleCashChange = (payload) => {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      // Show notification for new record
      if (eventType === 'INSERT') {
        showLeadNotification(newRecord, 'simulación de efectivo');
      }
      
      // Update cash simulations list
      setCashSimulations(prev => {
        const filteredList = prev.filter(item => item.id !== newRecord.id);
        const newList = [newRecord, ...filteredList].slice(0, 20);
        
        // Actualizar gráficos con todas las simulaciones
        const allSimulations = [...newList, ...productSimulations];
        prepareAllSimulationsData(allSimulations);
        
        return newList;
      });
    } 
    else if (eventType === 'DELETE') {
      // Remove from list
      setCashSimulations(prev => {
        const newList = prev.filter(item => item.id !== payload.old.id);
        
        // Actualizar gráficos con todas las simulaciones
        const allSimulations = [...newList, ...productSimulations];
        prepareAllSimulationsData(allSimulations);
        
        return newList;
      });
    }
    
    setLastUpdated(new Date());
  };
  
  // Handle selected plan changes
  const handlePlanChange = (payload) => {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      // Show notification for new record
      if (eventType === 'INSERT') {
        showLeadNotification(newRecord, 'plan seleccionado');
      }
      
      // Update selected plans list
      setSelectedPlans(prev => {
        const filteredList = prev.filter(item => item.id !== newRecord.id);
        const newList = [newRecord, ...filteredList].slice(0, 20);
        
        // Actualizar gráficos de solicitudes con todos los planes
        prepareAllRequestsData(newList);
        
        return newList;
      });
    } 
    else if (eventType === 'DELETE') {
      // Remove from list
      setSelectedPlans(prev => {
        const newList = prev.filter(item => item.id !== payload.old.id);
        
        // Actualizar gráficos de solicitudes con todos los planes
        prepareAllRequestsData(newList);
        
        return newList;
      });
    }
    
    setLastUpdated(new Date());
  };
  
  // Prepare data for all simulations combined (product + cash)
  const prepareAllSimulationsData = (records) => {
    const last10Days = getLast10Days();
    const counts = new Array(10).fill(0);
    
    records.forEach(record => {
      const date = new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
      }).format(new Date(record.created_at));
      
      const index = last10Days.indexOf(date);
      if (index !== -1) {
        counts[index]++;
      }
    });
    
    setDailyAllSimulationsCounts({
      labels: last10Days,
      data: counts
    });
  };
  
  // Prepare data for all requests
  const prepareAllRequestsData = (records) => {
    const last10Days = getLast10Days();
    const counts = new Array(10).fill(0);
    
    // Usamos todos los planes seleccionados sin filtrar
    records.forEach(record => {
      const date = new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
      }).format(new Date(record.created_at));
      
      const index = last10Days.indexOf(date);
      if (index !== -1) {
        counts[index]++;
      }
    });
    
    console.log("Datos de gráfico de solicitudes actualizados:", { labels: last10Days, data: counts });
    
    setDailyAllRequestsCounts({
      labels: last10Days,
      data: counts
    });
  };
  
  // Función para obtener nombre completo del cliente
  const getClientName = (record) => {
    if (record.name && record.last_name) {
      return `${record.name} ${record.last_name}`;
    }
    
    if (record.user_first_name && record.user_last_name) {
      return `${record.user_first_name} ${record.user_last_name}`;
    }
    
    // Como último recurso, usar cualquier campo que pueda tener el nombre
    return record.company_name || record.user_name || 'N/A';
  };
  
  // Función para obtener el monto solicitado/simulado
  const getAmount = (record) => {
    // Diferentes campos posibles para el monto
    return record.loan_amount || 
           record.amount || 
           record.requested_amount || 
           record.total_payment || 
           record.product_price || 
           0;
  };
  
  // Función para obtener el pago mensual
  const getMonthlyPayment = (record) => {
    if (!record) return 0;
    
    // Diferentes campos posibles para el pago mensual
    let payment = 0;
    
    // Verificamos los campos en orden de prioridad
    if (record.payment_per_period !== undefined && record.payment_per_period !== null) {
      payment = record.payment_per_period;
    } else if (record.monthly_payment !== undefined && record.monthly_payment !== null) {
      payment = record.monthly_payment;
    } else if (record.cuota !== undefined && record.cuota !== null) {
      payment = record.cuota;
    } else if (record.payment_amount !== undefined && record.payment_amount !== null) {
      payment = record.payment_amount;
    } else if (record.payment !== undefined && record.payment !== null) {
      payment = record.payment;
    } else if (record.amount && record.term_months) {
      // Si tenemos monto y plazo, calculamos una aproximación
      payment = (record.amount / record.term_months).toFixed(2);
    }
    
    console.log("Pago mensual para registro:", record.id, "Valor:", payment, "Campos disponibles:", 
      Object.keys(record).filter(key => key.includes('payment') || key.includes('cuota') || key === 'amount' || key === 'term_months'));
    
    return parseFloat(payment) || 0;
  };
  
  // Función para obtener el tipo de crédito/simulación
  const getItemType = (record, tableName) => {
    if (tableName === 'product_simulations') {
      return 'Producto';
    }
    
    if (tableName === 'cash_requests') {
      return 'Efectivo';
    }
    
    if (record.plan_type) {
      return record.plan_type === 'product' ? 'Producto' : 'Efectivo';
    }
    
    if (record.simulation_type) {
      return record.simulation_type === 'product' ? 'Producto' : 'Efectivo';
    }
    
    if (record.loan_type) {
      return record.loan_type === 'product' ? 'Producto' : 'Efectivo';
    }
    
    // Por defecto, si no es producto, asumimos que es efectivo
    return 'Efectivo';
  };
  
  // Función para obtener el nombre del producto
  const getProductName = (record) => {
    // Si es un plan de tipo efectivo, mostrar "Crédito en Efectivo"
    if (record.plan_type === 'cash' || record.simulation_type === 'cash' || record.tableOrigin === 'cash_requests') {
      return "Crédito en Efectivo";
    }
    
    // Para cualquier otro caso, buscar en los campos normales
    return record.product_title || 
           record.product_name || 
           record.purpose || 
           'N/A';
  };
  
  // Función para generar el enlace de WhatsApp con mensaje personalizado
  const generateWhatsAppLink = (record, recordType) => {
    // Verificar si hay un número de teléfono
    const phone = record.phone || record.user_phone;
    if (!phone) return null;
    
    // Formatear el número de teléfono (eliminar espacios, guiones, etc.)
    let formattedPhone = phone.replace(/[\s-\(\)]/g, '');
    
    // Si el número no comienza con +, agregar el código de México (+52)
    if (!formattedPhone.startsWith('+')) {
      // Si comienza con 52, agregar solo el +
      if (formattedPhone.startsWith('52')) {
        formattedPhone = '+' + formattedPhone;
      } else {
        formattedPhone = '+52' + formattedPhone;
      }
    }
    
    // Generar mensaje personalizado según el tipo de registro
    let message = "";
    
    if (recordType === 'simulation' || recordType === 'product_simulations' || recordType === 'cash_requests') {
      // Mensaje para simulaciones
      const productName = getProductName(record);
      const amount = formatCurrency(getAmount(record));
      
      message = `¡Hola ${getClientName(record)}! Vimos que realizaste una simulación para ${productName} por un monto de ${amount}. En Fincentiva contamos con las mejores opciones de financiamiento adaptadas a tus necesidades. ¿Te gustaría recibir más información personalizada?`;
    } else if (recordType === 'selected_plan') {
      // Mensaje para planes seleccionados
      const productName = getProductName(record);
      const amount = formatCurrency(getAmount(record));
      const payment = formatCurrency(getMonthlyPayment(record));
      
      message = `¡Hola ${getClientName(record)}! Vimos que seleccionaste un plan de ${productName} por un monto de ${amount} con un pago mensual estimado de ${payment}. En Fincentiva queremos ayudarte a concretar este financiamiento. ¿Podemos brindarte asesoría personalizada?`;
    } else {
      // Mensaje genérico
      message = `¡Hola ${getClientName(record)}! Gracias por tu interés en Fincentiva. Nos gustaría brindarte más información sobre nuestros productos financieros. ¿Te gustaría recibir asesoría personalizada?`;
    }
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Retornar el enlace completo
    return `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodedMessage}`;
  };
  
  // Estado para controlar contactos realizados
  const [contactedRecords, setContactedRecords] = useState(() => {
    // Intentar cargar el estado desde localStorage
    const savedContacts = localStorage.getItem('payrollDashboardContactedRecords');
    return savedContacts ? new Set(JSON.parse(savedContacts)) : new Set();
  });
  const [contactingRecord, setContactingRecord] = useState(null);
  
  // Guardar contactedRecords en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('payrollDashboardContactedRecords', JSON.stringify([...contactedRecords]));
  }, [contactedRecords]);
  
  // Función para manejar el clic en el botón de contacto
  const handleContactClick = (recordId, recordType, whatsappLink) => {
    // Si ya está en proceso de contacto, no hacer nada
    if (contactingRecord === recordId) return;
    
    // Establecer que está en proceso de contacto
    setContactingRecord(recordId);
    
    // Esperar 3 segundos antes de redirigir y marcar como contactado
    setTimeout(() => {
      // Marcar como contactado
      setContactedRecords(prev => new Set([...prev, recordId]));
      // Limpiar el estado de contacto en proceso
      setContactingRecord(null);
      
      // Redirigir a WhatsApp
      if (whatsappLink) {
        window.open(whatsappLink, '_blank');
      }
    }, 3000);
  };
  
  // Función para combinar todas las simulaciones ordenadas por fecha
  const getAllSimulations = () => {
    const productSims = productSimulations.map(sim => ({
      ...sim,
      tableOrigin: 'product_simulations'
    }));
    
    const cashSims = cashSimulations.map(sim => ({
      ...sim,
      tableOrigin: 'cash_requests'
    }));
    
    // Combinar y ordenar por fecha de creación (más reciente primero)
    return [...productSims, ...cashSims]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 20); // Mostrar máximo 20 simulaciones
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-white p-2 md:p-4 lg:p-6">
      <div className="container mx-auto">
        {/* Dashboard Header */}
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">Dashboard de Créditos por Nómina</h1>
            <p className="text-gray-400 text-xs md:text-sm">
              Última actualización: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="mt-2 md:mt-0">
            <button 
              onClick={() => fetchInitialData()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs md:text-sm flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Actualizar Datos
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#33FF57]"></div>
          </div>
        ) : (
          <>
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Todas las Simulaciones por Día</h2>
                <Bar
                  data={{
                    labels: dailyAllSimulationsCounts.labels,
                    datasets: [
                      {
                        label: 'Simulaciones',
                        data: dailyAllSimulationsCounts.data,
                        backgroundColor: 'rgba(51, 255, 87, 0.6)',
                        borderColor: 'rgba(51, 255, 87, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0, // Ensure whole numbers
                        },
                      },
                    },
                  }}
                />
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Todas las Solicitudes por Día</h2>
                <Bar
                  data={{
                    labels: dailyAllRequestsCounts.labels,
                    datasets: [
                      {
                        label: 'Solicitudes',
                        data: dailyAllRequestsCounts.data,
                        backgroundColor: 'rgba(255, 170, 51, 0.6)',
                        borderColor: 'rgba(255, 170, 51, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            {/* Data Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Combined Simulations Table */}
              <div className="bg-slate-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Últimas Simulaciones</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="py-2 px-4 text-left">Fecha</th>
                        <th className="py-2 px-4 text-left">Cliente</th>
                        <th className="py-2 px-4 text-left">Tipo</th>
                        <th className="py-2 px-4 text-left">Producto/Concepto</th>
                        <th className="py-2 px-4 text-right">Monto</th>
                        <th className="py-2 px-4 text-center">Contactar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {getAllSimulations().map((simulation) => (
                        <tr key={`${simulation.tableOrigin}-${simulation.id}`} className="hover:bg-slate-800">
                          <td className="py-2 px-4">{formatDate(simulation.created_at)}</td>
                          <td className="py-2 px-4">{getClientName(simulation)}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              simulation.tableOrigin === 'product_simulations' ? 'bg-green-900 text-green-200' : 'bg-blue-900 text-blue-200'
                            }`}>
                              {getItemType(simulation, simulation.tableOrigin)}
                            </span>
                          </td>
                          <td className="py-2 px-4">{getProductName(simulation)}</td>
                          <td className="py-2 px-4 text-right">{formatCurrency(getAmount(simulation))}</td>
                          <td className="py-2 px-4 text-center">
                            {(simulation.phone || simulation.user_phone) ? (
                              <button
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  contactedRecords.has(`${simulation.tableOrigin}-${simulation.id}`)
                                    ? 'bg-gray-600 text-gray-300 cursor-default'
                                    : contactingRecord === `${simulation.tableOrigin}-${simulation.id}`
                                      ? 'bg-yellow-600 text-white cursor-wait'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                                onClick={() => {
                                  if (!contactedRecords.has(`${simulation.tableOrigin}-${simulation.id}`) && 
                                      contactingRecord !== `${simulation.tableOrigin}-${simulation.id}`) {
                                    const whatsappLink = generateWhatsAppLink(simulation, simulation.tableOrigin);
                                    handleContactClick(`${simulation.tableOrigin}-${simulation.id}`, simulation.tableOrigin, whatsappLink);
                                  }
                                }}
                                disabled={contactedRecords.has(`${simulation.tableOrigin}-${simulation.id}`)}
                              >
                                {contactedRecords.has(`${simulation.tableOrigin}-${simulation.id}`)
                                  ? 'Contactado'
                                  : contactingRecord === `${simulation.tableOrigin}-${simulation.id}`
                                    ? 'Redirigiendo...'
                                    : 'Contactar'}
                              </button>
                            ) : (
                              <span className="text-gray-500 text-xs">No disponible</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {getAllSimulations().length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-4 text-center text-gray-400">
                            No hay simulaciones recientes
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Selected Plans Table */}
              <div className="bg-slate-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Planes Seleccionados</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-gray-300">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="py-3 px-4 text-left">Fecha</th>
                        <th className="py-3 px-4 text-left">Nombre</th>
                        <th className="py-3 px-4 text-left">Tipo</th>
                        <th className="py-3 px-4 text-left">Producto</th>
                        <th className="py-3 px-4 text-right">Monto</th>
                        <th className="py-3 px-4 text-right">Pago Mensual</th>
                        <th className="py-3 px-4 text-center">Contactar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPlans.map((plan, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/20'}>
                          <td className="py-2 px-4">{new Date(plan.created_at).toLocaleDateString()}</td>
                          <td className="py-2 px-4">{getClientName(plan)}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              (plan.plan_type === 'product') ? 'bg-green-900 text-green-200' : 'bg-blue-900 text-blue-200'
                            }`}>
                              {getItemType(plan)}
                            </span>
                          </td>
                          <td className="py-2 px-4">{getProductName(plan)}</td>
                          <td className="py-2 px-4 text-right">{formatCurrency(getAmount(plan))}</td>
                          <td className="py-2 px-4 text-right">{formatCurrency(getMonthlyPayment(plan))}</td>
                          <td className="py-2 px-4 text-center">
                            {(plan.phone || plan.user_phone) ? (
                              <button
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  contactedRecords.has(`selected_plan-${plan.id}`)
                                    ? 'bg-gray-600 text-gray-300 cursor-default'
                                    : contactingRecord === `selected_plan-${plan.id}`
                                      ? 'bg-yellow-600 text-white cursor-wait'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                                onClick={() => {
                                  if (!contactedRecords.has(`selected_plan-${plan.id}`) && 
                                      contactingRecord !== `selected_plan-${plan.id}`) {
                                    const whatsappLink = generateWhatsAppLink(plan, 'selected_plan');
                                    handleContactClick(`selected_plan-${plan.id}`, 'selected_plan', whatsappLink);
                                  }
                                }}
                                disabled={contactedRecords.has(`selected_plan-${plan.id}`)}
                              >
                                {contactedRecords.has(`selected_plan-${plan.id}`)
                                  ? 'Contactado'
                                  : contactingRecord === `selected_plan-${plan.id}`
                                    ? 'Redirigiendo...'
                                    : 'Contactar'}
                              </button>
                            ) : (
                              <span className="text-gray-500 text-xs">No disponible</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {selectedPlans.length === 0 && (
                        <tr>
                          <td colSpan="7" className="py-4 text-center text-gray-400">
                            No hay planes seleccionados recientes
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* New Lead Notification Popup */}
        <AnimatePresence>
          {newLeadNotification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              {/* Overlay semitransparente */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setNewLeadNotification(null)}></div>
              
              {/* Contenido de la notificación */}
              <div className="relative z-10 max-w-2xl w-full mx-4 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden"
                   style={{ boxShadow: '0 0 40px rgba(255, 170, 51, 0.4)' }}
              >
                <div className="relative p-6">
                  <button
                    onClick={() => setNewLeadNotification(null)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Alert Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-[#FFAA33]/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFAA33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Alert Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#FFAA33] mb-3">
                        {newLeadNotification.type === 'plan seleccionado'
                          ? '¡Nuevo plan seleccionado!'
                          : newLeadNotification.type === 'simulación de efectivo'
                          ? '¡Nueva simulación de efectivo!'
                          : '¡Nueva simulación de producto!'}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Nombre:</p>
                          <p className="text-white font-medium">{getClientName(newLeadNotification.lead)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Teléfono:</p>
                          <p className="text-white font-medium">{newLeadNotification.lead.phone || 'No disponible'}</p>
                        </div>
                        
                        {newLeadNotification.type === 'simulación de producto' && (
                          <>
                            <div>
                              <p className="text-gray-400 text-sm">Producto:</p>
                              <p className="text-white font-medium">{getProductName(newLeadNotification.lead)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Precio:</p>
                              <p className="text-white font-medium">{formatCurrency(getAmount(newLeadNotification.lead))}</p>
                            </div>
                          </>
                        )}
                        
                        {newLeadNotification.type === 'simulación de efectivo' && (
                          <>
                            <div>
                              <p className="text-gray-400 text-sm">Monto solicitado:</p>
                              <p className="text-white font-medium">{formatCurrency(getAmount(newLeadNotification.lead))}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Propósito:</p>
                              <p className="text-white font-medium">{newLeadNotification.lead.purpose || 'No especificado'}</p>
                            </div>
                          </>
                        )}
                        
                        <div>
                          <p className="text-gray-400 text-sm">Pago Mensual:</p>
                          <p className="text-white font-medium">{formatCurrency(getMonthlyPayment(newLeadNotification.lead))}</p>
                        </div>
                        
                        {newLeadNotification.lead.term_months && (
                          <div>
                            <p className="text-gray-400 text-sm">Plazo:</p>
                            <p className="text-white font-medium">{newLeadNotification.lead.term_months} meses</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                          Recibido: {new Date(newLeadNotification.timestamp).toLocaleTimeString()}
                        </p>
                        
                        <button 
                          onClick={() => setNewLeadNotification(null)}
                          className="px-4 py-2 bg-[#FFAA33] text-black text-sm font-medium rounded-lg hover:bg-[#E59A22] transition-colors"
                        >
                          Entendido
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar for auto-dismiss */}
                <div className="h-1 bg-[#FFAA33]/20">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 10, ease: 'linear' }}
                    className="h-full bg-[#FFAA33]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PayrollDashboard; 