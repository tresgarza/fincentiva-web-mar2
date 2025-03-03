import { supabase } from '../lib/supabaseClient';

export const getTableStructure = async (tableName) => {
  try {
    console.log(`Fetching structure for table: ${tableName}`);
    
    // This query uses PostgreSQL's information_schema to get column information
    const { data, error } = await supabase
      .from('_postgrest_rpc')
      .select('*')
      .rpc('schema_introspection', { 
        table_name: tableName 
      });
    
    if (error) {
      console.error(`Error fetching table structure for ${tableName}:`, error);
      return { success: false, error };
    }
    
    console.log(`Table structure for ${tableName}:`, data);
    return { success: true, data };
  } catch (e) {
    console.error(`Exception when fetching table structure for ${tableName}:`, e);
    return { success: false, error: e };
  }
};

// Alternative approach using a direct query
export const getTableColumns = async (tableName) => {
  try {
    console.log(`Fetching columns for table: ${tableName}`);
    
    // Direct query to get column information
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: tableName });
    
    if (error) {
      console.error(`Error fetching columns for ${tableName}:`, error);
      
      // Fallback to a simpler approach - just try to select a row
      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.error(`Error fetching sample data from ${tableName}:`, sampleError);
        return { success: false, error: sampleError };
      }
      
      // If we got a row, we can see the columns from the returned object
      if (sampleData && sampleData.length > 0) {
        const columns = Object.keys(sampleData[0]);
        console.log(`Columns in ${tableName} (from sample):`, columns);
        return { success: true, columns };
      }
      
      return { success: false, error };
    }
    
    console.log(`Columns in ${tableName}:`, data);
    return { success: true, data };
  } catch (e) {
    console.error(`Exception when fetching columns for ${tableName}:`, e);
    return { success: false, error: e };
  }
};

// Execute immediately
getTableColumns('simulations')
  .then(result => {
    console.log('Table structure check result:', result);
  })
  .catch(err => {
    console.error('Failed to check table structure:', err);
  }); 