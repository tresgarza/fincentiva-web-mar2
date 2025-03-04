import { supabase } from '../lib/supabaseClient';

/**
 * Habilita la funcionalidad en tiempo real para la tabla 'simulations' en Supabase.
 * Este script debe ejecutarse una vez para garantizar que las actualizaciones en tiempo real estén habilitadas.
 */
const enableRealtime = async () => {
  try {
    console.log('✓ Verificando estado de Supabase Realtime...');
    
    // Método 1: Intenta usar el RPC si está disponible
    try {
      console.log('Método 1: Intentando habilitar realtime mediante RPC...');
      const { error } = await supabase.rpc('supabase_realtime', {
        table: 'simulations',
        action: 'enable',
      });
      
      if (!error) {
        console.log('✅ Realtime habilitado exitosamente mediante RPC.');
      } else {
        console.log('RPC no disponible o error:', error.message);
      }
    } catch (rpcError) {
      console.log('RPC no soportado:', rpcError.message);
    }
    
    // Método 2: Usar la API REST directa
    try {
      console.log('Método 2: Intentando verificar/habilitar realtime mediante API REST...');
      
      // Intenta publicar un mensaje de prueba para verificar que realtime está funcionando
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
          payload: { message: 'Test realtime connection' }
        })
      });
      
      if (response.ok) {
        console.log('✅ Publicación de prueba realtime exitosa.');
      } else {
        const errorData = await response.json();
        console.warn('Error en publicación de prueba:', errorData);
      }
    } catch (apiError) {
      console.warn('Error al verificar mediante API:', apiError.message);
    }
    
    // Método 3: Probar una suscripción de prueba
    console.log('Método 3: Configurando una suscripción de prueba...');
    const testChannel = supabase
      .channel('realtime-test')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'simulations' 
      }, (payload) => {
        console.log('✅ Recibido evento de prueba!', payload);
      })
      .subscribe((status) => {
        console.log(`Estado de suscripción de prueba: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Suscripción de prueba exitosa');
          
          // Esperar un momento y luego limpiar
          setTimeout(() => {
            console.log('Limpiando canal de prueba...');
            supabase.removeChannel(testChannel);
          }, 5000);
        }
      });
    
    // Método 4: Instrucciones manuales
    console.log(`
-------------------------------------------------------
✓ INSTRUCCIONES PARA HABILITAR REALTIME MANUALMENTE:
-------------------------------------------------------
1. Ve al Dashboard de Supabase: ${import.meta.env.VITE_SUPABASE_URL}
2. Navega a "Database" > "Replication"
3. Busca la sección "Tables enabled for realtime"
4. Asegúrate de que "public.simulations" esté en la lista
5. Si no está, haz clic en "Add table" y añade "public.simulations"
-------------------------------------------------------
`);
    
  } catch (error) {
    console.error('❌ Error inesperado al verificar el estado de realtime:', error);
  }
};

// Ejecutar la función al importar este archivo
console.log('🔄 Iniciando verificación de Supabase Realtime...');
enableRealtime();

export default enableRealtime; 