import { supabase } from '../lib/supabaseClient';

/**
 * Utility functions to simulate data for testing the dashboard
 */

// Random name generators
const firstNames = [
  'Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Sofía', 'Carlos', 'Laura', 
  'Miguel', 'Fernanda', 'José', 'Gabriela', 'Francisco', 'Isabel', 'Jorge'
];

const lastNames = [
  'García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 
  'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales'
];

// Generate a random phone number
const generatePhone = () => {
  let phone = '55';
  for (let i = 0; i < 8; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
};

// Generate a random email based on name
const generateEmail = (firstName, lastName) => {
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}`;
};

// Generate random loan data
const generateLoanData = () => {
  // Random loan type
  const loanTypes = ['auto_loan', 'car_backed_loan'];
  const loanType = loanTypes[Math.floor(Math.random() * loanTypes.length)];
  
  // Random car price between 150,000 and 800,000
  const carPrice = Math.floor(Math.random() * 650000) + 150000;
  
  // Random down payment percentage between 10% and 40%
  const downPaymentPercent = Math.random() * 0.3 + 0.1;
  const downPayment = Math.round(carPrice * downPaymentPercent);
  
  // Calculate loan amount
  const loanAmount = carPrice - downPayment;
  
  // Random term between 12, 24, 36, 48, and 60 months
  const termOptions = [12, 24, 36, 48, 60];
  const termMonths = termOptions[Math.floor(Math.random() * termOptions.length)];
  
  // Calculate a realistic monthly payment (approximation with 12% annual interest)
  const annualInterestRate = 0.12;
  const monthlyInterestRate = annualInterestRate / 12;
  const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -termMonths));
  
  return {
    loan_type: loanType,
    car_price: carPrice,
    loan_amount: loanAmount,
    term_months: termMonths,
    monthly_payment: Math.round(monthlyPayment * 100) / 100
  };
};

/**
 * Creates a random simulation record in the database
 * @param {boolean} isApplication - Whether this should be an application
 * @returns {Promise<Object>} The inserted record
 */
export const createRandomSimulation = async (isApplication = false) => {
  try {
    // Generate random personal info
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const phone = generatePhone();
    const email = generateEmail(firstName, lastName);
    
    // Generate loan data
    const loanData = generateLoanData();
    
    // Create the simulation record
    const simulationData = {
      name: firstName,
      last_name: lastName,
      phone,
      email,
      ...loanData,
      is_application: isApplication,
      notes: isApplication ? 'Solicitud de préstamo' : 'Simulación de crédito'
    };
    
    // Insert into the database
    const { data, error } = await supabase
      .from('simulations')
      .insert(simulationData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating simulation:', error);
      return null;
    }
    
    console.log(`Random ${isApplication ? 'application' : 'simulation'} created:`, data);
    return data;
  } catch (error) {
    console.error('Unexpected error creating simulation:', error);
    return null;
  }
};

/**
 * Generate multiple random simulations for testing
 * @param {number} count - Number of simulations to generate
 * @param {number} applicationPercent - Percentage of simulations that should be applications (0-100)
 */
export const generateRandomSimulations = async (count = 5, applicationPercent = 20) => {
  console.log(`Generating ${count} random simulations (${applicationPercent}% applications)...`);
  
  const results = {
    success: 0,
    failed: 0,
    applications: 0,
    simulations: 0
  };
  
  for (let i = 0; i < count; i++) {
    // Determine if this should be an application based on percentage
    const isApplication = Math.random() * 100 < applicationPercent;
    
    // Add a random delay between 0.5 and 2 seconds to simulate real user behavior
    const delay = Math.random() * 1500 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Create the random simulation
    const result = await createRandomSimulation(isApplication);
    
    if (result) {
      results.success++;
      if (isApplication) {
        results.applications++;
      } else {
        results.simulations++;
      }
    } else {
      results.failed++;
    }
    
    // Log progress
    console.log(`Progress: ${i + 1}/${count} (${Math.round((i + 1) / count * 100)}%)`);
  }
  
  console.log('Generation complete!', results);
  return results;
};

// Export utility functions
export default {
  createRandomSimulation,
  generateRandomSimulations
}; 