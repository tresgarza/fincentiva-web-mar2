import express from 'express';
import { Company } from '../models/Company.js';

const router = express.Router();

// Crear una nueva empresa
router.post('/', async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener empresa por código
router.get('/code/:employeeCode', async (req, res) => {
  try {
    const company = await Company.getByCode(req.params.employeeCode);
    res.json(company);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Actualizar empresa
router.put('/:id', async (req, res) => {
  try {
    const company = await Company.update(req.params.id, req.body);
    res.json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar empresa
router.delete('/:id', async (req, res) => {
  try {
    await Company.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all companies (for dropdown)
router.get('/', async (req, res) => {
  try {
    const companies = await Company.getAll();
    // Only send necessary information for the dropdown
    const companiesForDropdown = companies.map(({ id, name }) => ({ id, name }));
    res.json(companiesForDropdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify company password
router.post('/verify-password', async (req, res) => {
  try {
    const { companyId, password } = req.body;
    
    if (!companyId || !password) {
      return res.status(400).json({ error: 'Company ID and password are required' });
    }

    const isValid = await Company.verifyPassword(companyId, password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const company = await Company.getById(companyId);
    res.json({ 
      id: company.id,
      name: company.name,
      interest_rate: company.interest_rate,
      max_months: company.max_months
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate payments for a company
router.post('/calculate-payments', async (req, res) => {
  try {
    const { companyId, amount, paymentFrequency } = req.body;
    
    if (!companyId || !amount || !paymentFrequency) {
      return res.status(400).json({ error: 'Company ID, amount, and payment frequency are required' });
    }

    const company = await Company.getById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Usar la frecuencia de pago proporcionada por el frontend
    const companyData = {
      ...company,
      payment_frequency: paymentFrequency
    };

    const payments = await Company.calculatePaymentsWithFrequency(companyId, amount, paymentFrequency);
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 