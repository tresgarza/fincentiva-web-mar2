import { db } from '../config/firebase.js';
import { Company } from '../models/Company.js';

async function testFirebaseConnection() {
  try {
    console.log('Probando conexión con Firebase...');
    
    // Crear una empresa de prueba
    const testCompany = {
      name: 'Empresa de Prueba',
      employeeCode: 'TEST001',
      interestRates: {
        weekly: 15.5,
        biweekly: 14.5,
        monthly: 13.5
      }
    };

    console.log('Creando empresa de prueba...');
    const createdCompany = await Company.create(testCompany);
    console.log('Empresa creada exitosamente:', createdCompany);

    // Probar obtener la empresa por código
    console.log('Obteniendo empresa por código...');
    const retrievedCompany = await Company.getByCode('TEST001');
    console.log('Empresa recuperada:', retrievedCompany);

    // Probar cálculo de pagos
    console.log('Calculando pagos de prueba...');
    const payments = await Company.calculatePayments('TEST001', 10000);
    console.log('Cálculo de pagos:', payments);

    console.log('¡Todas las pruebas completadas exitosamente!');
  } catch (error) {
    console.error('Error durante las pruebas:', error);
  } finally {
    process.exit();
  }
}

testFirebaseConnection(); 