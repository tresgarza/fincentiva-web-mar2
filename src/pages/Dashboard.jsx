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

const Dashboard = ({ disableNotifications = false }) => {
  // Add the window size hook
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // State for all data
  const [recentSimulations, setRecentSimulations] = useState([]);
  const [loanApplications, setLoanApplications] = useState([]);
  const [dailySimulationCounts, setDailySimulationCounts] = useState({
    labels: [],
    data: []
  });
  const [dailyLoanAmounts, setDailyLoanAmounts] = useState({
    labels: [],
    data: []
  });
  const [loading, setLoading] = useState(true);
  const [newLeadNotification, setNewLeadNotification] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Estados para manejar el contacto de clientes
  const [contactedRecords, setContactedRecords] = useState(() => {
    // Intentar cargar el estado desde localStorage
    const savedContacts = localStorage.getItem('dashboardContactedRecords');
    return savedContacts ? new Set(JSON.parse(savedContacts)) : new Set();
  });
  const [contactingRecord, setContactingRecord] = useState(null);
  
  // Referencias para controlar las notificaciones procesadas
  const processedNotificationsRef = useRef(new Set());
  const lastFetchTimeRef = useRef(new Date());

  // Debugging info
  useEffect(() => {
    console.log("Dashboard component mounted or re-rendered", { lastUpdated });
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

  // Función para mostrar notificación de nuevo lead
  const showLeadNotification = (lead, type) => {
    // Si las notificaciones están deshabilitadas, no mostramos nada
    if (disableNotifications) {
      console.log('Notificaciones deshabilitadas en Dashboard - usando sistema centralizado');
      return;
    }

    // Verificar si ya hemos procesado esta notificación
    const notificationId = `${type}_${lead.id}`;
    if (processedNotificationsRef.current.has(notificationId)) {
      console.log(`Notificación ${notificationId} ya procesada, ignorando...`);
      return;
    }

    // Marcar como procesada
    processedNotificationsRef.current.add(notificationId);

    // Reproducir sonido
    playNotificationSound();

    // Guardar la notificación para mostrarla
    setNewLeadNotification({
      lead,
      type,
      timestamp: new Date().getTime()
    });

    // Auto-cerrar después de 10 segundos
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

  // Setup real-time subscription
  useEffect(() => {
    console.log("Configurando suscripción en tiempo real a Supabase");
    
    // Explicitly enable channel for real-time updates
    const enableRealtimeForTable = async () => {
      // First try: using Supabase dashboard setting
      console.log("Verificando que Realtime esté habilitado para la tabla 'simulations'");
      try {
        // This is a direct request to ensure the table is properly configured for realtime
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/realtime/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            topic: 'realtime:public:simulations:*',
            event: 'test',
            payload: { message: 'Test realtime' }
          })
        });
        console.log("Prueba de publicación realtime completada");
      } catch (error) {
        console.error("Error al verificar realtime:", error);
      }
    };
    
    enableRealtimeForTable();
    
    // Set up real-time subscription to the simulations table
    const simulationsChannel = supabase
      .channel('simulations-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'simulations' 
      }, (payload) => {
        console.log('Cambio detectado en Supabase:', payload);
        handleSimulationChange(payload);
      })
      .subscribe((status) => {
        console.log('Estado de suscripción:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Suscripción a cambios en tiempo real activa');
        }
      });
    
    // Cleanup function to remove the subscription when the component unmounts
    return () => {
      console.log('Limpiando suscripción a Supabase');
      supabase.removeChannel(simulationsChannel);
    };
  }, []);
  
  // Función para verificar registros recientes y mostrar notificaciones
  const checkRecentRegistrations = (simulations) => {
    // Si las notificaciones están deshabilitadas, no hacemos nada
    if (disableNotifications) return;
    
    // Solo revisar si hay datos
    if (!simulations || simulations.length === 0) return;
    
    // Obtener la hora actual y restar un minuto
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
    
    // Hora de la última actualización
    const lastFetchTime = lastFetchTimeRef.current;
    
    console.log(`Verificando registros nuevos entre ${lastFetchTime.toISOString()} y ahora...`);
    
    // Filtrar simulaciones que son más recientes que la última vez que verificamos
    // pero no más antiguas que un minuto (para no mostrar notificaciones muy viejas)
    const newRegistrations = simulations.filter(sim => {
      const createdAt = new Date(sim.created_at);
      return createdAt > lastFetchTime && createdAt > oneMinuteAgo;
    });
    
    console.log(`Se encontraron ${newRegistrations.length} registros nuevos`);
    
    // Mostrar notificación para el registro más reciente si hay alguno
    if (newRegistrations.length > 0) {
      // Ordenar por fecha descendente
      newRegistrations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      // Mostrar notificación para el más reciente
      const newestRecord = newRegistrations[0];
      const isApplication = newestRecord.notes === 'Solicitud de préstamo';
      
      showLeadNotification(newestRecord, isApplication ? 'solicitud' : 'simulación');
      
      // Si hay más de uno, mostrar un mensaje adicional
      if (newRegistrations.length > 1) {
        console.log(`Hay ${newRegistrations.length - 1} registros nuevos adicionales`);
        // Aquí podrías implementar una notificación adicional o contador
      }
    }
    
    // Actualizar la hora de la última verificación para la próxima vez
    lastFetchTimeRef.current = new Date();
  };
  
  // Load initial data - separate from realtime setup
  useEffect(() => {
    const fetchInitialData = async () => {
      console.log("Cargando datos iniciales...");
      try {
        setLoading(true);
        
        // Fetch recent simulations
        const { data: simulations, error: simulationsError } = await supabase
          .from('simulations')
          .select('id, name, last_name, phone, loan_type, loan_amount, term_months, created_at, notes, monthly_payment, email')
          .order('created_at', { ascending: false })
          .limit(30);
        
        if (simulationsError) throw simulationsError;
        console.log("Simulaciones cargadas:", simulations?.length || 0);
        setRecentSimulations(simulations || []);
        
        // Verificar si hay registros recientes para mostrar notificaciones
        checkRecentRegistrations(simulations);
        
        // Fetch loan applications
        const { data: applications, error: applicationsError } = await supabase
          .from('simulations')
          .select('id, name, last_name, phone, loan_type, loan_amount, term_months, created_at, notes, monthly_payment, email')
          .eq('notes', 'Solicitud de préstamo')
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (applicationsError) throw applicationsError;
        console.log("Solicitudes cargadas:", applications?.length || 0);
        setLoanApplications(applications || []);
        
        // Prepare data for charts
        prepareDailySimulationData(simulations || []);
        prepareDailyLoanApplicationData(applications || []);
        
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      } finally {
        setLoading(false);
        setLastUpdated(new Date());
      }
    };

    // Cargar datos iniciales al montar el componente
    fetchInitialData();
    
    // También configuramos un intervalo de refresco cada 30 segundos como respaldo
    const refreshInterval = setInterval(() => {
      console.log("Refrescando datos por intervalo");
      fetchInitialData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Handle real-time changes to simulations
  const handleSimulationChange = async (payload) => {
    console.log('Procesando actualización en tiempo real:', payload);
    
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    // Update recent simulations list
    if (eventType === 'INSERT') {
      console.log('Nueva simulación insertada:', newRecord);
      
      // Show notification for new lead
      const isApplication = newRecord.notes === 'Solicitud de préstamo';
      showLeadNotification(newRecord, isApplication ? 'solicitud' : 'simulación');
      
      setRecentSimulations(prev => {
        // Add new simulation to the beginning and keep only 30
        const updated = [newRecord, ...prev].slice(0, 30);
        prepareDailySimulationData(updated);
        return updated;
      });
      
      // If it's also a loan application, update that list too
      if (newRecord.notes === 'Solicitud de préstamo') {
        setLoanApplications(prev => {
          const updated = [newRecord, ...prev].slice(0, 20);
          prepareDailyLoanApplicationData(updated);
          return updated;
        });
      }
      
      // Actualizar marca de tiempo para debugging
      setLastUpdated(new Date());
    } 
    else if (eventType === 'UPDATE') {
      console.log('Simulación actualizada:', newRecord);
      
      // Handle updates to existing simulations
      setRecentSimulations(prev => 
        prev.map(item => item.id === newRecord.id ? newRecord : item)
      );
      
      // Check if this affects loan applications list
      if (newRecord.notes === 'Solicitud de préstamo' || oldRecord.notes === 'Solicitud de préstamo') {
        // Refresh loan applications data
        const { data } = await supabase
          .from('simulations')
          .select('id, name, last_name, phone, loan_type, loan_amount, term_months, created_at, notes, monthly_payment, email')
          .eq('notes', 'Solicitud de préstamo')
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (data) {
          setLoanApplications(data);
          prepareDailyLoanApplicationData(data);
        }
      }
      
      // Actualizar marca de tiempo para debugging
      setLastUpdated(new Date());
    }
    else if (eventType === 'DELETE') {
      console.log('Simulación eliminada:', oldRecord);
      
      // Remove deleted simulation from lists
      setRecentSimulations(prev => 
        prev.filter(item => item.id !== oldRecord.id)
      );
      
      setLoanApplications(prev => 
        prev.filter(item => item.id !== oldRecord.id)
      );
      
      // Recalculate charts
      prepareDailySimulationData(
        recentSimulations.filter(item => item.id !== oldRecord.id)
      );
      prepareDailyLoanApplicationData(
        loanApplications.filter(item => item.id !== oldRecord.id)
      );
      
      // Actualizar marca de tiempo para debugging
      setLastUpdated(new Date());
    }
  };
  
  // Prepare data for daily simulation counts chart
  const prepareDailySimulationData = (simulations) => {
    const last10Days = getLast10Days();
    const counts = new Array(10).fill(0);
    
    simulations.forEach(simulation => {
      const date = new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
      }).format(new Date(simulation.created_at));
      
      const index = last10Days.indexOf(date);
      if (index !== -1) {
        counts[index]++;
      }
    });
    
    setDailySimulationCounts({
      labels: last10Days,
      data: counts
    });
  };
  
  // Prepare data for daily loan application amounts chart
  const prepareDailyLoanApplicationData = (applications) => {
    const last10Days = getLast10Days();
    const amounts = new Array(10).fill(0);
    
    applications.forEach(app => {
      const date = new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: '2-digit',
      }).format(new Date(app.created_at));
      
      const index = last10Days.indexOf(date);
      if (index !== -1) {
        amounts[index] += Number(app.loan_amount);
      }
    });
    
    setDailyLoanAmounts({
      labels: last10Days,
      data: amounts
    });
  };

  // Función para obtener el texto de visualización del tipo de préstamo
  const getLoanTypeDisplayText = (record) => {
    // Si es un plan de tipo efectivo o simulación de efectivo, mostrar "Crédito en Efectivo"
    if (record.plan_type === 'cash' || record.simulation_type === 'cash') {
      return "Crédito en Efectivo";
    }
    
    // Para préstamos automotrices
    if (record.loan_type === 'auto_loan') {
      return "Auto";
    }
    
    // Para préstamos con garantía
    if (record.loan_type === 'secured_loan' || record.loan_type === 'car_backed_loan') {
      return "Garantía";
    }
    
    // Para cualquier otro caso, buscar en los campos normales
    return record.product_title || 
           record.product_name || 
           record.purpose || 
           'N/A';
  };

  // Función para generar un enlace de WhatsApp con mensaje personalizado
  const generateWhatsAppLink = (record, recordType) => {
    if (!record.phone) return '';
    
    // Formatear número telefónico (eliminar espacios, +, etc)
    let formattedPhone = record.phone.replace(/\s+/g, '');
    if (!formattedPhone.startsWith('+52') && !formattedPhone.startsWith('52')) {
      formattedPhone = '52' + formattedPhone;
    } else if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.substring(1);
    }
    
    // Crear un mensaje personalizado basado en el tipo de registro
    let message = '';
    if (recordType === 'simulation') {
      // Obtener el tipo de préstamo para mostrar en el mensaje
      const productType = getLoanTypeDisplayText(record).toLowerCase();
      
      message = `¡Hola ${record.name}! Soy un asesor de Fincentiva. Veo que realizaste una simulación de ${productType} por ${formatCurrency(record.loan_amount)} a ${record.term_months} meses. ¿Te gustaría que te explique más detalles sobre esta opción o explorar otras alternativas que se ajusten mejor a tus necesidades?`;
    } else if (recordType === 'application') {
      // Obtener el tipo de préstamo para mostrar en el mensaje
      const productType = getLoanTypeDisplayText(record).toLowerCase();
      
      message = `¡Hola ${record.name}! Soy un asesor de Fincentiva. Recibimos tu solicitud de ${productType} por ${formatCurrency(record.loan_amount)} a ${record.term_months} meses. ¿Tienes un momento para hablar sobre los siguientes pasos del proceso?`;
    }
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Construir el enlace
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };
  
  // Función para manejar el clic en el botón de contacto
  const handleContactClick = (recordId, recordType, whatsappLink) => {
    if (contactedRecords.has(recordId) || contactingRecord === recordId) {
      return; // Evitar múltiples clics
    }
    
    // Marcar el registro como "en proceso de contacto"
    setContactingRecord(recordId);
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappLink, '_blank');
    
    // Después de 3 segundos, marcar como contactado
    setTimeout(() => {
      setContactedRecords(prev => {
        const newSet = new Set(prev);
        newSet.add(recordId);
        return newSet;
      });
      
      // Limpiar el estado de "contactando"
      setContactingRecord(null);
    }, 3000);
  };

  // Guardar contactedRecords en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('dashboardContactedRecords', JSON.stringify([...contactedRecords]));
  }, [contactedRecords]);

  // Chart configurations
  const simulationCountsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Simulaciones por día (10 días)',
        font: {
          size: 16
        },
        color: '#ffffff'
      },
    },
    scales: {
      y: {
        ticks: { color: '#cccccc' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#cccccc' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };
  
  const simulationCountsChartData = {
    labels: dailySimulationCounts.labels,
    datasets: [
      {
        label: 'Cantidad de simulaciones',
        data: dailySimulationCounts.data,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const loanAmountsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff'
        }
      },
      title: {
        display: true,
        text: 'Monto de solicitudes de préstamo por día (10 días)',
        font: {
          size: 16
        },
        color: '#ffffff'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: { 
          color: '#cccccc',
          callback: function(value) {
            return formatCurrency(value);
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#cccccc' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };
  
  const loanAmountsChartData = {
    labels: dailyLoanAmounts.labels,
    datasets: [
      {
        label: 'Monto total de solicitudes',
        data: dailyLoanAmounts.data,
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-n-8 text-white p-2 md:p-4 lg:p-6">
      <div className="container mx-auto">
        {/* Dashboard Header */}
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">Dashboard de Crédito Automotriz</h1>
            <p className="text-gray-400 text-xs md:text-sm">
              Última actualización: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="mt-2 md:mt-0">
            <button 
              onClick={() => fetchInitialData()}
              className="px-3 py-1.5 bg-n-7 hover:bg-n-6 rounded-lg text-xs md:text-sm flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Actualizar Datos
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Charts Section */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Daily Simulations Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-n-7 rounded-xl p-3 md:p-4 shadow-lg overflow-hidden"
            >
              <h2 className="text-base md:text-lg font-semibold mb-3">Simulaciones Diarias (Últimos 10 días)</h2>
              <div className="h-[200px] md:h-[250px]">
                <Bar
                  data={{
                    labels: dailySimulationCounts.labels,
                    datasets: [
                      {
                        label: 'Simulaciones',
                        data: dailySimulationCounts.data,
                        backgroundColor: 'rgba(51, 255, 87, 0.6)',
                        borderColor: 'rgba(51, 255, 87, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                          color: 'rgba(255, 255, 255, 0.7)',
                          font: {
                            size: isMobile ? 10 : 12,
                          },
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                      x: {
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                          font: {
                            size: isMobile ? 8 : 10,
                          },
                        },
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                          size: 14,
                        },
                        bodyFont: {
                          size: 12,
                        },
                      },
                    },
                  }}
                />
              </div>
            </motion.div>
            
            {/* Daily Loan Amount Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-n-7 rounded-xl p-3 md:p-4 shadow-lg overflow-hidden"
            >
              <h2 className="text-base md:text-lg font-semibold mb-3">Montos Diarios (Últimos 10 días)</h2>
              <div className="h-[200px] md:h-[250px]">
                <Bar
                  data={{
                    labels: dailyLoanAmounts.labels,
                    datasets: [
                      {
                        label: 'Monto Total',
                        data: dailyLoanAmounts.data,
                        backgroundColor: 'rgba(64, 224, 208, 0.6)',
                        borderColor: 'rgba(64, 224, 208, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return formatCurrency(value).replace('$', '');
                          },
                          color: 'rgba(255, 255, 255, 0.7)',
                          font: {
                            size: isMobile ? 10 : 12,
                          },
                        },
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)',
                        },
                      },
                      x: {
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                          font: {
                            size: isMobile ? 8 : 10,
                          },
                        },
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        callbacks: {
                          label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                              label += ': ';
                            }
                            if (context.parsed.y !== null) {
                              label += formatCurrency(context.parsed.y);
                            }
                            return label;
                          }
                        },
                        titleFont: {
                          size: 14,
                        },
                        bodyFont: {
                          size: 12,
                        },
                      },
                    },
                  }}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Recent Simulations Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-n-7 rounded-xl p-3 md:p-4 shadow-lg lg:col-span-3 overflow-hidden"
          >
            <h2 className="text-base md:text-lg lg:text-xl font-semibold mb-3">Últimas 20 Simulaciones</h2>
            <div className="overflow-auto max-h-[500px]">
              <table className="min-w-full bg-transparent">
                <thead className="sticky top-0 bg-n-8 z-10">
                  <tr>
                    <th className="py-2 px-2 text-left text-gray-300 text-xs md:text-sm">Nombre</th>
                    <th className="py-2 px-2 text-left text-gray-300 text-xs md:text-sm">Teléfono</th>
                    <th className="py-2 px-2 text-left text-gray-300 text-xs md:text-sm">Tipo</th>
                    <th className="py-2 px-2 text-left text-gray-300 text-xs md:text-sm">Monto</th>
                    <th className="py-2 px-2 text-left text-gray-300 text-xs md:text-sm">Plazo</th>
                    <th className="py-2 px-2 text-left text-gray-300 text-xs md:text-sm">Fecha</th>
                    <th className="py-2 px-2 text-center text-gray-300 text-xs md:text-sm">Contactar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-n-6">
                  {recentSimulations.map((simulation) => (
                    <tr key={simulation.id} className="hover:bg-n-6 transition-colors">
                      <td className="py-2 px-2 text-white text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis">{`${simulation.name} ${simulation.last_name}`}</td>
                      <td className="py-2 px-2 text-white text-xs md:text-sm">{simulation.phone}</td>
                      <td className="py-2 px-2 text-white text-xs md:text-sm">{getLoanTypeDisplayText(simulation)}</td>
                      <td className="py-2 px-2 text-white text-xs md:text-sm">{formatCurrency(simulation.loan_amount)}</td>
                      <td className="py-2 px-2 text-white text-xs md:text-sm">{simulation.term_months} meses</td>
                      <td className="py-2 px-2 text-white text-xs md:text-sm">{formatDate(simulation.created_at)}</td>
                      <td className="py-2 px-2 text-center">
                        {simulation.phone ? (
                          <button
                            className={`px-2 md:px-3 py-1 rounded text-xs font-medium transition-colors ${
                              contactedRecords.has(`simulation-${simulation.id}`)
                                ? 'bg-gray-600 text-gray-300 cursor-default'
                                : contactingRecord === `simulation-${simulation.id}`
                                  ? 'bg-yellow-600 text-white cursor-wait'
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                            onClick={() => {
                              if (!contactedRecords.has(`simulation-${simulation.id}`) && 
                                  contactingRecord !== `simulation-${simulation.id}`) {
                                const whatsappLink = generateWhatsAppLink(simulation, 'simulation');
                                handleContactClick(`simulation-${simulation.id}`, 'simulation', whatsappLink);
                              }
                            }}
                            disabled={contactedRecords.has(`simulation-${simulation.id}`)}
                          >
                            {contactedRecords.has(`simulation-${simulation.id}`)
                              ? 'Contactado'
                              : contactingRecord === `simulation-${simulation.id}`
                                ? 'Redirigiendo...'
                                : 'Contactar'}
                          </button>
                        ) : (
                          <span className="text-gray-500 text-xs">No disponible</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {recentSimulations.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-4 text-center text-gray-400 text-xs md:text-sm">No hay simulaciones disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Lead Notification */}
      <AnimatePresence>
        {newLeadNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 50 }}
            className="fixed bottom-4 right-4 z-50 max-w-xs md:max-w-sm bg-gradient-to-r from-[#1e1e1e] to-[#2d2d2d] rounded-lg shadow-xl overflow-hidden border border-n-6"
            style={{ boxShadow: '0 0 20px rgba(51, 255, 87, 0.2)' }}
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#33FF57]/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#33FF57]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm md:text-base font-semibold text-[#33FF57]">
                  {newLeadNotification.title}
                </h3>
                <button
                  className="ml-auto text-gray-400 hover:text-white"
                  onClick={() => setNewLeadNotification(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm mb-3">
                <div>
                  <p className="text-gray-400 text-xs">Nombre:</p>
                  <p className="text-white">{newLeadNotification.clientName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Monto:</p>
                  <p className="text-white">{formatCurrency(newLeadNotification.amount)}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-xs">Tipo de Préstamo:</p>
                  <p className="text-white">{getLoanTypeDisplayText(newLeadNotification.lead)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Fecha:</p>
                  <p className="text-white">{formatDate(newLeadNotification.timestamp)}</p>
                </div>
              </div>
              
              <div className="mt-2 flex justify-end">
                <button
                  className="text-xs font-medium px-3 py-1 bg-[#33FF57] text-black rounded hover:bg-[#2be04e] transition-colors"
                  onClick={() => setNewLeadNotification(null)}
                >
                  Entendido
                </button>
              </div>
            </div>
            
            {/* Auto-dismiss progress bar */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 8, ease: 'linear' }}
              className="h-1 bg-[#33FF57]"
              onAnimationComplete={() => setNewLeadNotification(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 