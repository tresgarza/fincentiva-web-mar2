import { supabase } from '../lib/supabaseClient';

// Función para verificar la estructura de la tabla simulations
export const checkTableStructure = async () => {
  try {
    console.log('Verificando estructura de la tabla simulations...');
    
    // Intentar obtener una fila para ver qué columnas existen
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error al verificar la tabla simulations:', error);
      return { success: false, error };
    }
    
    // Si hay datos, mostrar las columnas
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('Columnas existentes en la tabla simulations:', columns);
      
      // Verificar si existe la columna is_application
      const hasIsApplication = columns.includes('is_application');
      console.log('¿Existe la columna is_application?', hasIsApplication ? 'Sí' : 'No');
      
      // Verificar si existe la columna notes
      const hasNotes = columns.includes('notes');
      console.log('¿Existe la columna notes?', hasNotes ? 'Sí' : 'No');
      
      return { 
        success: true, 
        columns,
        hasIsApplication,
        hasNotes
      };
    } else {
      console.log('La tabla simulations está vacía o no existe');
      
      // Intentar obtener la estructura de la tabla mediante una consulta SQL
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('get_table_schema', { table_name: 'simulations' });
      
      if (schemaError) {
        console.error('Error al obtener el esquema de la tabla:', schemaError);
        return { success: false, error: schemaError };
      }
      
      console.log('Esquema de la tabla simulations:', schemaData);
      return { success: true, schema: schemaData };
    }
  } catch (e) {
    console.error('Excepción al verificar la estructura de la tabla:', e);
    return { success: false, error: e };
  }
};

// Ejecutar la verificación inmediatamente
checkTableStructure()
  .then(result => {
    console.log('Resultado de la verificación de la estructura de la tabla:', result);
  })
  .catch(err => {
    console.error('Error al ejecutar la verificación de la estructura de la tabla:', err);
  });

export default checkTableStructure; 