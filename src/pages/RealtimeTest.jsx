import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { createRandomSimulation } from '../utils/simulateData';

const RealtimeTest = () => {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('Iniciando...');
  const [subscribed, setSubscribed] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  // Función para agregar un mensaje de log
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{
      id: Date.now(),
      message,
      timestamp,
      type
    }, ...prev].slice(0, 100)); // Mantener solo los últimos 100 mensajes
  };

  // Probar la conexión realtime
  useEffect(() => {
    addLog('Iniciando prueba de conectividad en tiempo real con Supabase...', 'info');
    setStatus('Conectando...');

    // Función para verificar la configuración de Realtime
    const checkRealtimeConfig = async () => {
      try {
        addLog('Verificando configuración de Realtime...', 'info');
        
        // Comprobar si podemos publicar mensajes (requiere derechos de admin)
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/realtime/publish`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
              topic: 'realtime:public:simulations:*',
              event: 'test',
              payload: { message: 'Test desde RealtimeTest.jsx' }
            })
          });
          
          if (response.ok) {
            addLog('✅ API de realtime accesible y funcionando', 'success');
          } else {
            const errorData = await response.json();
            addLog(`⚠️ No se pudo publicar un mensaje de prueba: ${JSON.stringify(errorData)}`, 'warning');
          }
        } catch (error) {
          addLog(`⚠️ Error al intentar publicar mensaje: ${error.message}`, 'warning');
        }
        
        // Comprobar la configuración directamente
        const { data, error } = await supabase
          .from('pg_catalog.pg_publication_tables')
          .select('*')
          .eq('tablename', 'simulations');
        
        if (error) {
          addLog(`⚠️ No se pudo verificar la configuración de replicación: ${error.message}`, 'warning');
        } else if (data && data.length > 0) {
          addLog(`✅ Tabla 'simulations' está configurada para replicación: ${JSON.stringify(data)}`, 'success');
        } else {
          addLog('⚠️ La tabla simulations no parece estar configurada para replicación en tiempo real', 'warning');
        }
        
      } catch (error) {
        addLog(`❌ Error al verificar configuración: ${error.message}`, 'error');
      }
    };

    // Establecer una suscripción de prueba
    const setupSubscription = async () => {
      try {
        addLog('Configurando canal de suscripción...', 'info');
        
        const channel = supabase
          .channel('realtime-test-page')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'simulations' 
          }, (payload) => {
            const eventType = payload.eventType;
            const record = payload.new || payload.old;
            addLog(`✅ Evento recibido: ${eventType.toUpperCase()} - ID: ${record.id}`, 'success');
            setTestMessage(JSON.stringify(payload, null, 2));
          })
          .subscribe((status) => {
            addLog(`Estado de suscripción: ${status}`, status === 'SUBSCRIBED' ? 'success' : 'info');
            if (status === 'SUBSCRIBED') {
              setStatus('Conectado ✅');
              setSubscribed(true);
            } else if (status === 'CHANNEL_ERROR') {
              setStatus('Error de conexión ❌');
              setSubscribed(false);
            } else {
              setStatus(`Estado: ${status}`);
            }
          });
          
        return () => {
          addLog('Limpiando suscripción...', 'info');
          supabase.removeChannel(channel);
        };
      } catch (error) {
        addLog(`❌ Error de suscripción: ${error.message}`, 'error');
        setStatus('Error ❌');
        return () => {};
      }
    };

    // Ejecutar las verificaciones
    checkRealtimeConfig();
    const cleanup = setupSubscription();
    
    return cleanup;
  }, []);
  
  // Función para crear un evento de prueba
  const handleCreateTestEvent = async () => {
    try {
      addLog('Creando simulación de prueba...', 'info');
      const simulation = await createRandomSimulation(false);
      if (simulation) {
        addLog(`✅ Simulación creada con ID: ${simulation.id}`, 'success');
      } else {
        addLog('❌ No se pudo crear la simulación', 'error');
      }
    } catch (error) {
      addLog(`❌ Error al crear simulación: ${error.message}`, 'error');
    }
  };
  
  // Función para crear un evento de solicitud de préstamo
  const handleCreateLoanApplication = async () => {
    try {
      addLog('Creando solicitud de préstamo de prueba...', 'info');
      const application = await createRandomSimulation(true);
      if (application) {
        addLog(`✅ Solicitud creada con ID: ${application.id}`, 'success');
      } else {
        addLog('❌ No se pudo crear la solicitud', 'error');
      }
    } catch (error) {
      addLog(`❌ Error al crear solicitud: ${error.message}`, 'error');
    }
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
          Prueba de Conectividad en Tiempo Real
          <div className="mt-2 text-lg">
            Estado: <span className={`font-mono ${
              status.includes('✅') ? 'text-green-400' : 
              status.includes('❌') ? 'text-red-400' : 'text-yellow-400'
            }`}>{status}</span>
          </div>
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de control */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-n-7 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-white">Panel de Control</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Estado de la conexión</h3>
                <div className="p-3 bg-n-8 rounded-lg">
                  <p className="text-white">
                    {subscribed ? (
                      <span className="text-green-400">✅ Conectado y escuchando cambios en la tabla 'simulations'</span>
                    ) : (
                      <span className="text-yellow-400">⚠️ No conectado o esperando conexión</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Crear Eventos de Prueba</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleCreateTestEvent}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
                  >
                    Crear Simulación
                  </button>
                  
                  <button
                    onClick={handleCreateLoanApplication}
                    className="px-4 py-2 bg-[#33FF57] hover:bg-[#2be04e] text-black rounded-lg transition-all duration-300"
                  >
                    Crear Solicitud de Préstamo
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Enlaces Útiles</h3>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="/dashboard" 
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
                    target="_blank"
                  >
                    Abrir Dashboard
                  </a>
                  
                  <a 
                    href="/test-data" 
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300"
                    target="_blank"
                  >
                    Generador de Datos
                  </a>
                  
                  <a 
                    href={import.meta.env.VITE_SUPABASE_URL} 
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Panel de Supabase
                  </a>
                </div>
              </div>
              
              {testMessage && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Último Mensaje Recibido</h3>
                  <pre className="p-3 bg-n-8 rounded-lg text-green-400 overflow-auto max-h-40 text-xs">
                    {testMessage}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Panel de logs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-n-7 rounded-2xl p-6 shadow-lg flex flex-col h-[600px]"
          >
            <h2 className="text-2xl font-semibold mb-4 text-white">Registro de Eventos</h2>
            
            <div className="overflow-auto flex-1 bg-n-8 rounded-lg p-4">
              {logs.length === 0 ? (
                <p className="text-gray-400 italic">No hay eventos registrados.</p>
              ) : (
                <div className="space-y-2">
                  {logs.map(log => (
                    <div 
                      key={log.id} 
                      className={`p-2 border-l-4 text-sm font-mono ${
                        log.type === 'error' ? 'border-red-500 bg-red-500/10 text-red-400' : 
                        log.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' : 
                        log.type === 'success' ? 'border-green-500 bg-green-500/10 text-green-400' : 
                        'border-blue-500 bg-blue-500/10 text-blue-400'
                      }`}
                    >
                      <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeTest; 