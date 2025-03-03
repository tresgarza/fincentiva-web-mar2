import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

const CompanyAuth = () => {
  const [formData, setFormData] = useState({
    employee_code: '',
    payment_frequency: 'biweekly'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Buscar la empresa por código
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('employee_code', formData.employee_code)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!company) {
        setError('Código de empresa no encontrado');
        return;
      }

      // Verificar que la frecuencia de pago coincida
      if (company.payment_frequency !== formData.payment_frequency) {
        setError(`Esta empresa no acepta pagos ${formData.payment_frequency === 'biweekly' ? 'quincenales' : 'mensuales'}`);
        return;
      }

      // Guardar datos de la empresa en localStorage
      localStorage.setItem('companyData', JSON.stringify({
        id: company.id,
        name: company.name,
        employee_code: company.employee_code,
        payment_frequency: company.payment_frequency,
        interest_rate: company.interest_rate,
        payment_day: company.payment_day,
        max_credit_amount: company.max_credit_amount,
        min_credit_amount: company.min_credit_amount
      }));

      // Redirigir al panel de empresa
      navigate('/company-panel');
    } catch (error) {
      console.error('Error:', error.message);
      setError('Error al verificar el código de empresa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-n-8 rounded-2xl p-8 border border-n-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="payment_frequency" className="block text-n-4 mb-2">
              ¿Cómo recibes tu nómina?
            </label>
            <select
              id="payment_frequency"
              name="payment_frequency"
              value={formData.payment_frequency}
              onChange={handleChange}
              className="w-full p-3 bg-n-6 rounded-lg text-n-1 border border-n-5 focus:border-color-1 focus:outline-none transition-colors"
              required
            >
              <option value="biweekly">Quincenal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="employee_code" className="block text-n-4 mb-2">
              Código de Empresa
            </label>
            <input
              type="text"
              id="employee_code"
              name="employee_code"
              value={formData.employee_code}
              onChange={handleChange}
              className="w-full p-3 bg-n-6 rounded-lg text-n-1 border border-n-5 focus:border-color-1 focus:outline-none transition-colors"
              placeholder="Ingresa el código de tu empresa"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm p-2 bg-red-500/10 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          
          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-[#40E0D0] to-[#4DE8B2] hover:from-[#4DE8B2] hover:to-[#40E0D0] text-n-8 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-n-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'INICIAR SESIÓN'
              )}
            </motion.button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-n-4 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Acceso seguro con encriptación de extremo a extremo
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyAuth; 