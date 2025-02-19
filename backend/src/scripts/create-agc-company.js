import { supabase } from '../config/supabase.js';

async function createAGCCompany() {
  try {
    console.log('Creating AGC company...');
    
    const company = {
      name: 'AGC',
      employee_code: 'agc1234',
      interest_rates: {
        biweekly: 60,
        weekly: 0,  // Not used
        monthly: 0  // Not used
      }
    };

    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) throw error;

    console.log('AGC Company created successfully:', data);
    
    // Test retrieving the company
    const { data: retrievedCompany, error: retrieveError } = await supabase
      .from('companies')
      .select('*')
      .eq('employee_code', 'agc1234')
      .single();

    if (retrieveError) throw retrieveError;
    
    console.log('Company can be retrieved with code:', retrievedCompany);

  } catch (error) {
    console.error('Error creating AGC company:', error.message);
  }
}

createAGCCompany(); 