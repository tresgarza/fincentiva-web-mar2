import { useState } from 'react';
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
      <div className="relative group">
        <label 
          htmlFor="employeeCode" 
          className="block text-sm font-medium text-n-3 mb-2 transition-colors group-focus-within:text-color-1"
        >
          Código de Empresa
        </label>
        <div className="relative">
          <input
            type="text"
            id="employeeCode"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-n-7 text-n-1 border border-n-6 focus:outline-none focus:border-color-1 transition-colors placeholder-n-4/50"
            placeholder="Ingresa el código de tu empresa"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-color-1 via-color-2 to-color-3 opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none"></div>
        </div>
      </div>

      {error && (
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
          <div className="relative text-red-500 text-sm px-4 py-2">
            {error}
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-color-1 via-color-2 to-color-3 rounded-xl opacity-75 blur animate-gradient"></div>
        <Button
          className="relative w-full group overflow-hidden rounded-lg bg-n-8"
          type="submit"
          disabled={isLoading}
        >
          <span className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-120%] block">
            {isLoading ? "Verificando..." : "Continuar"}
          </span>
          <span className="absolute z-10 top-full left-0 w-full text-center transition-transform duration-500 group-hover:translate-y-[-120%]">
            {isLoading ? "Verificando..." : "¡Vamos!"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-color-1 via-color-2 to-color-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </Button>
      </div>
    </form>
  );
};

export default CompanyAuth; 