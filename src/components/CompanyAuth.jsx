import { useState, useEffect } from 'react';
import { getCompanies, getByCode } from '../services/api';
import Button from './Button';

const CompanyAuth = ({ onAuthenticated }) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const companyData = await getByCode(employeeCode);
      onAuthenticated(companyData);
    } catch (error) {
      setError(error.message || 'Error al verificar credenciales');
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="employeeCode" className="block text-sm font-medium text-n-3 mb-2">
          Código de Empresa
        </label>
        <input
          type="text"
          id="employeeCode"
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-n-7 text-n-1 border border-n-6 focus:outline-none focus:border-n-3"
          placeholder="Ingresa el código de tu empresa"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <Button
        className="w-full"
        type="submit"
        disabled={isLoading}
        white={!isLoading}
      >
        {isLoading ? "Verificando..." : "Continuar"}
      </Button>
    </form>
  );
};

export default CompanyAuth; 