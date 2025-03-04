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

const Dashboard = () => {
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

  // Function to show a notification when a new lead arrives
  const showLeadNotification = (lead, type = 'simulación') => {
    console.log(`Mostrando notificación para nueva ${type}:`, lead);
    
    // No mostrar notificación si ya se ha procesado este ID
    if (processedNotificationsRef.current.has(lead.id)) {
      console.log(`Notificación para ${lead.id} ya fue mostrada anteriormente, ignorando`);
      return;
    }
    
    // Marcar esta notificación como procesada
    processedNotificationsRef.current.add(lead.id);
    
    // Reproducir sonido de notificación
    playNotificationSound();
    
    setNewLeadNotification({
      lead,
      type,
      timestamp: new Date()
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setNewLeadNotification(null);
    }, 10000);
  };
  
  // Función para reproducir un sonido de notificación
  const playNotificationSound = () => {
    try {
      // Crear un contexto de audio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Crear un oscilador para el sonido
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configurar el sonido (tipo de onda, frecuencia, volumen)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // Nota La (A5)
      
      // Ajustar el volumen
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      // Conectar los nodos
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Reproducir y detener
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
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
    <div className="pt-[4.75rem] lg:pt-[5.25rem] min-h-screen bg-n-8">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8 text-white"
        >
          Dashboard en Tiempo Real
          <span className="text-xs block text-gray-400 mt-2">
            Última actualización: {lastUpdated.toLocaleTimeString()}
          </span>
        </motion.h1>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Charts Section - Placed at the top */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Simulation Counts Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-n-7 rounded-2xl p-6 shadow-lg"
              >
                <div className="h-[300px]">
                  <Bar options={simulationCountsChartOptions} data={simulationCountsChartData} />
                </div>
              </motion.div>
              
              {/* Loan Amounts Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-n-7 rounded-2xl p-6 shadow-lg"
              >
                <div className="h-[300px]">
                  <Bar options={loanAmountsChartOptions} data={loanAmountsChartData} />
                </div>
              </motion.div>
            </div>
            
            {/* Tables Section - Placed below the charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Simulations Panel */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-n-7 rounded-2xl p-4 shadow-lg h-[500px] overflow-hidden"
              >
                <h2 className="text-2xl font-semibold mb-3 text-white">Últimas 30 Simulaciones</h2>
                <div className="overflow-auto h-[calc(100%-40px)]">
                  <table className="min-w-full bg-transparent">
                    <thead className="sticky top-0 bg-n-7 z-10">
                      <tr className="border-b border-n-6">
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Nombre</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Teléfono</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Tipo</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Monto</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Plazo</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSimulations.map((simulation) => (
                        <tr key={simulation.id} className="border-b border-n-6 hover:bg-n-6 transition-colors">
                          <td className="py-2 px-2 text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis">{`${simulation.name} ${simulation.last_name}`}</td>
                          <td className="py-2 px-2 text-white text-sm">{simulation.phone}</td>
                          <td className="py-2 px-2 text-white text-sm">{simulation.loan_type === 'auto_loan' ? 'Auto' : 'Garantía'}</td>
                          <td className="py-2 px-2 text-white text-sm">{formatCurrency(simulation.loan_amount)}</td>
                          <td className="py-2 px-2 text-white text-sm">{simulation.term_months} meses</td>
                          <td className="py-2 px-2 text-white text-sm">{formatDate(simulation.created_at)}</td>
                        </tr>
                      ))}
                      {recentSimulations.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-4 text-center text-gray-400">No hay simulaciones disponibles</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
              
              {/* Loan Applications Panel */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-n-7 rounded-2xl p-4 shadow-lg h-[500px] overflow-hidden"
              >
                <h2 className="text-2xl font-semibold mb-3 text-white">Últimas 20 Solicitudes de Préstamo</h2>
                <div className="overflow-auto h-[calc(100%-40px)]">
                  <table className="min-w-full bg-transparent">
                    <thead className="sticky top-0 bg-n-7 z-10">
                      <tr className="border-b border-n-6">
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Nombre</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Teléfono</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Tipo</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Monto</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Plazo</th>
                        <th className="py-2 px-2 text-left text-gray-300 text-sm">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loanApplications.map((application) => (
                        <tr key={application.id} className="border-b border-n-6 hover:bg-n-6 transition-colors">
                          <td className="py-2 px-2 text-white text-sm whitespace-nowrap overflow-hidden text-ellipsis">{`${application.name} ${application.last_name}`}</td>
                          <td className="py-2 px-2 text-white text-sm">{application.phone}</td>
                          <td className="py-2 px-2 text-white text-sm">{application.loan_type === 'auto_loan' ? 'Auto' : 'Garantía'}</td>
                          <td className="py-2 px-2 text-white text-sm">{formatCurrency(application.loan_amount)}</td>
                          <td className="py-2 px-2 text-white text-sm">{application.term_months} meses</td>
                          <td className="py-2 px-2 text-white text-sm">{formatDate(application.created_at)}</td>
                        </tr>
                      ))}
                      {loanApplications.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-4 text-center text-gray-400">No hay solicitudes disponibles</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </div>
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
                   style={{ boxShadow: '0 0 40px rgba(51, 255, 87, 0.4)' }}
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
                      <div className="w-16 h-16 bg-[#33FF57]/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#33FF57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Alert Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#33FF57] mb-3">
                        ¡Nueva {newLeadNotification.type === 'solicitud' ? 'solicitud de préstamo' : 'simulación'} recibida!
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Nombre:</p>
                          <p className="text-white font-medium">{`${newLeadNotification.lead.name} ${newLeadNotification.lead.last_name}`}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Teléfono:</p>
                          <p className="text-white font-medium">{newLeadNotification.lead.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Tipo de Préstamo:</p>
                          <p className="text-white font-medium">{newLeadNotification.lead.loan_type === 'auto_loan' ? 'Crédito Automotriz' : 'Préstamo con Garantía'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Monto:</p>
                          <p className="text-white font-medium">{formatCurrency(newLeadNotification.lead.loan_amount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Plazo:</p>
                          <p className="text-white font-medium">{newLeadNotification.lead.term_months} meses</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Pago Mensual:</p>
                          <p className="text-white font-medium">{formatCurrency(newLeadNotification.lead.monthly_payment)}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                          Recibido: {new Date(newLeadNotification.timestamp).toLocaleTimeString()}
                        </p>
                        
                        <button 
                          onClick={() => setNewLeadNotification(null)}
                          className="px-4 py-2 bg-[#33FF57] text-black text-sm font-medium rounded-lg hover:bg-[#2be04e] transition-colors"
                        >
                          Entendido
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar for auto-dismiss */}
                <div className="h-1 bg-[#33FF57]/20">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 10, ease: 'linear' }}
                    className="h-full bg-[#33FF57]"
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

export default Dashboard; 