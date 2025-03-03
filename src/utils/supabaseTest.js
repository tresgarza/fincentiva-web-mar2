import { supabase } from '../lib/supabaseClient';

// Function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('Auth test result:', authError ? 'Failed' : 'Success');
    if (authError) {
      console.error('Auth error:', authError);
    }
    
    // Test database access
    const { data: dbData, error: dbError } = await supabase
      .from('simulations')
      .select('id')
      .limit(1);
      
    console.log('Database test result:', dbError ? 'Failed' : 'Success');
    if (dbError) {
      console.error('Database error:', dbError);
    } else {
      console.log('Database response:', dbData);
    }
    
    return {
      authSuccess: !authError,
      dbSuccess: !dbError,
      authError,
      dbError
    };
  } catch (e) {
    console.error('Exception during Supabase test:', e);
    return {
      authSuccess: false,
      dbSuccess: false,
      exception: e
    };
  }
};

// Run the test immediately
testSupabaseConnection(); 