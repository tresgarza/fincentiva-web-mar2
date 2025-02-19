import { supabase } from '../config/supabase.js';

export class Company {
  static async getAll() {
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) throw error;
    return data;
  }

  static async getById(id) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async verifyPassword(companyId, password) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .eq('password', password)
      .single();
    
    if (error) throw error;
    return !!data;
  }

  static async calculatePayments(companyId, amount) {
    const company = await this.getById(companyId);
    if (!company) throw new Error('Company not found');

    // Get company-specific financing terms
    const { interest_rate, max_months } = company;
    
    // Calculate monthly payments for different terms
    const payments = [];
    for (let months = 3; months <= max_months; months += 3) {
      const monthlyInterest = interest_rate / 12 / 100;
      const monthlyPayment = (amount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / 
                            (Math.pow(1 + monthlyInterest, months) - 1);
      
      payments.push({
        months,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalPayment: Math.round(monthlyPayment * months * 100) / 100,
        interestRate: interest_rate
      });
    }

    return payments;
  }

  static async create(companyData) {
    const { name, interestRates, employeeCode } = companyData;
    
    try {
      // Verificar si el código ya existe
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('*')
        .eq('employee_code', employeeCode)
        .single();
      
      if (existingCompany) {
        throw new Error('El código de empresa ya existe');
      }

      // Crear la empresa
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name,
          interest_rates: interestRates,
          employee_code: employeeCode,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        employeeCode: data.employee_code,
        interestRates: data.interest_rates
      };
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  static async getByCode(employeeCode) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('employee_code', employeeCode)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Empresa no encontrada');

      return {
        id: data.id,
        name: data.name,
        employeeCode: data.employee_code,
        interestRates: data.interest_rates
      };
    } catch (error) {
      console.error('Error getting company:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Empresa no encontrada');

      return {
        id: data.id,
        name: data.name,
        employeeCode: data.employee_code,
        interestRates: data.interest_rates
      };
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  static calculatePaymentSchedule(principal, annualInterestRate, paymentsPerYear) {
    const r = annualInterestRate / 100 / paymentsPerYear; // Tasa por período
    const periods = [6, 12, 18, 24]; // Períodos disponibles

    return periods.map(n => {
      const payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalInterest = (payment * n) - principal;
      
      return {
        periods: n,
        paymentPerPeriod: Math.round(payment * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalPayment: Math.round((principal + totalInterest) * 100) / 100
      };
    });
  }
} 