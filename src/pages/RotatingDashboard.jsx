import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './Dashboard';
import PayrollDashboard from './PayrollDashboard';
import NotificationCenter from '../components/NotificationCenter';
import NotificationSound from '../components/NotificationSound';
import { supabase } from '../lib/supabaseClient';

const RotatingDashboard = () => {
  // Estado para controlar qué dashboard se muestra actualmente
  const [currentDashboard, setCurrentDashboard] = useState(0);
  
  // Estado para controlar si la rotación automática está activa
  const [autoRotate, setAutoRotate] = useState(true);
  
  // Estados para notificaciones
  const [notifications, setNotifications] = useState([]);
  const [notificationTrigger, setNotificationTrigger] = useState(false);
  const [lastCheckTimestamp, setLastCheckTimestamp] = useState(Date.now());
  
  // Total de dashboards disponibles
  const totalDashboards = 2;
  
  // Nombres de los dashboards para mostrar
  const dashboardNames = [
    'Crédito Automotriz',
    'Créditos por Nómina'
  ];
  
  // Función para reproducir el sonido de notificación
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
  
  // Función para cerrar una notificación
  const handleCloseNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };
  
  // Función para comprobar si hay nuevos registros en todas las tablas
  const checkAllNewRecords = useCallback(async () => {
    try {
      const currentTime = Date.now();
      // Buscamos registros creados en los últimos 65 segundos para asegurar que no nos perdemos ninguno
      const checkTime = new Date(currentTime - 65000).toISOString();
      const lastCheck = new Date(lastCheckTimestamp).toISOString();
      
      console.log(`Verificando nuevos registros desde ${lastCheck}`);
      
      // Verificar simulaciones de auto y solicitudes de préstamo
      const { data: simulations, error: simulationsError } = await supabase
        .from('simulations')
        .select('*')
        .gt('created_at', lastCheck);
      
      // Verificar simulaciones de producto
      const { data: productSimulations, error: productSimulationsError } = await supabase
        .from('product_simulations')
        .select('*')
        .gt('created_at', lastCheck);
      
      // Verificar solicitudes de efectivo
      const { data: cashRequests, error: cashRequestsError } = await supabase
        .from('cash_requests')
        .select('*')
        .gt('created_at', lastCheck);
      
      // Verificar planes seleccionados
      const { data: selectedPlans, error: selectedPlansError } = await supabase
        .from('selected_plans')
        .select('*')
        .gt('created_at', lastCheck);
      
      // Procesar las nuevas simulaciones y solicitudes
      const newSimulations = simulations?.filter(sim => new Date(sim.created_at) > new Date(lastCheck)) || [];
      const newProductSimulations = productSimulations?.filter(sim => new Date(sim.created_at) > new Date(lastCheck)) || [];
      const newCashRequests = cashRequests?.filter(req => new Date(req.created_at) > new Date(lastCheck)) || [];
      const newSelectedPlans = selectedPlans?.filter(plan => new Date(plan.created_at) > new Date(lastCheck)) || [];
      
      // Crear notificaciones para cada nuevo registro
      const newNotifications = [
        ...newSimulations.map(sim => ({
          id: `sim_${sim.id}`,
          lead: sim,
          type: sim.request_type ? 'solicitud' : 'simulación',
          timestamp: new Date(sim.created_at).getTime()
        })),
        ...newProductSimulations.map(sim => ({
          id: `prod_${sim.id}`,
          lead: sim,
          type: 'simulación de producto',
          timestamp: new Date(sim.created_at).getTime()
        })),
        ...newCashRequests.map(req => ({
          id: `cash_${req.id}`,
          lead: req,
          type: 'simulación de efectivo',
          timestamp: new Date(req.created_at).getTime()
        })),
        ...newSelectedPlans.map(plan => ({
          id: `plan_${plan.id}`,
          lead: plan,
          type: 'plan seleccionado',
          timestamp: new Date(plan.created_at).getTime()
        }))
      ];
      
      // Verificar si hay nuevas notificaciones para mostrar
      if (newNotifications.length > 0) {
        // Ordenar notificaciones por timestamp (más recientes primero)
        newNotifications.sort((a, b) => b.timestamp - a.timestamp);
        
        console.log(`Se encontraron ${newNotifications.length} nuevos registros`);
        
        // Añadir nuevas notificaciones al estado
        setNotifications(prev => {
          // Eliminar duplicados si hay notificaciones con el mismo ID
          const existingIds = prev.map(n => n.id);
          const filteredNew = newNotifications.filter(n => !existingIds.includes(n.id));
          
          // Activar el trigger para el sonido si hay nuevas notificaciones
          if (filteredNew.length > 0) {
            setNotificationTrigger(prev => !prev);
            playNotificationSound();
            
            // Para cada nueva notificación, programar auto-cierre después de 10 segundos
            filteredNew.forEach(notification => {
              setTimeout(() => {
                setNotifications(currentNotifications => 
                  currentNotifications.filter(n => n.id !== notification.id)
                );
              }, 10000); // 10 segundos
            });
          }
          
          return [...filteredNew, ...prev];
        });
      }
      
      // Actualizar timestamp de la última verificación
      setLastCheckTimestamp(currentTime);
      
    } catch (error) {
      console.error("Error al verificar nuevos registros:", error);
    }
  }, [lastCheckTimestamp]);
  
  // Configurar suscripciones en tiempo real para todas las tablas relevantes
  useEffect(() => {
    // Suscripción para simulaciones
    const simulationsSubscription = supabase
      .channel('public:simulations')
      .on('INSERT', (payload) => {
        console.log('Nueva simulación detectada:', payload);
        checkAllNewRecords();
      })
      .subscribe();
    
    // Suscripción para simulaciones de producto
    const productSimulationsSubscription = supabase
      .channel('public:product_simulations')
      .on('INSERT', (payload) => {
        console.log('Nueva simulación de producto detectada:', payload);
        checkAllNewRecords();
      })
      .subscribe();
    
    // Suscripción para solicitudes de efectivo
    const cashRequestsSubscription = supabase
      .channel('public:cash_requests')
      .on('INSERT', (payload) => {
        console.log('Nueva solicitud de efectivo detectada:', payload);
        checkAllNewRecords();
      })
      .subscribe();
    
    // Suscripción para planes seleccionados
    const selectedPlansSubscription = supabase
      .channel('public:selected_plans')
      .on('INSERT', (payload) => {
        console.log('Nuevo plan seleccionado detectado:', payload);
        checkAllNewRecords();
      })
      .subscribe();
    
    // Limpiar suscripciones al desmontar
    return () => {
      simulationsSubscription.unsubscribe();
      productSimulationsSubscription.unsubscribe();
      cashRequestsSubscription.unsubscribe();
      selectedPlansSubscription.unsubscribe();
    };
  }, [checkAllNewRecords]);
  
  // Verificación periódica cada 60 segundos para detectar nuevos registros 
  // que podrían no haberse detectado por la suscripción en tiempo real
  useEffect(() => {
    checkAllNewRecords(); // Verificar al iniciar
    
    const interval = setInterval(() => {
      checkAllNewRecords();
    }, 60000); // Cada 60 segundos
    
    return () => clearInterval(interval);
  }, [checkAllNewRecords]);
  
  // Cambiar de dashboard cada 30 segundos si la rotación automática está activa
  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setCurrentDashboard((prev) => (prev + 1) % totalDashboards);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRotate]);
  
  // Función para cambiar manualmente de dashboard
  const handleDashboardChange = (index) => {
    setCurrentDashboard(index);
    // No desactivamos la rotación automática para que se siga refrescando cada 30 segundos
  };
  
  return (
    <div className="relative w-full h-full">
      {/* Indicador y selectores de dashboards - posición ajustada para mejor visibilidad */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-slate-700">
        <div className="text-white text-sm">
          Dashboard activo:
        </div>
        
        <div className="flex gap-2">
          {dashboardNames.map((name, index) => (
            <button 
              key={index}
              className={`px-3 py-1.5 rounded-md transition-all ${
                currentDashboard === index 
                  ? 'bg-[#33FF57] text-black font-medium' 
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
              onClick={() => handleDashboardChange(index)}
            >
              {name}
            </button>
          ))}
        </div>
        
        <button 
          className={`ml-2 px-2 py-1.5 rounded-md transition-all ${
            autoRotate ? 'bg-blue-500 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          }`}
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? "Rotación automática activada" : "Rotación automática desactivada"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Los dashboards, solo mostramos el activo */}
      <div className="w-full h-full">
        {/* Pasamos notificaciones vacías a los dashboards individuales para desactivar sus notificaciones nativas */}
        {currentDashboard === 0 && <Dashboard disableNotifications={true} />}
        {currentDashboard === 1 && <PayrollDashboard disableNotifications={true} />}
      </div>
      
      {/* Componente de notificaciones centralizado */}
      {notifications.length > 0 && (
        <NotificationCenter 
          notifications={notifications} 
          onClose={handleCloseNotification} 
        />
      )}
      
      {/* Componente de sonido para notificaciones */}
      <NotificationSound trigger={notificationTrigger} />
    </div>
  );
};

export default RotatingDashboard;