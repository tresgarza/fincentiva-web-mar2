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
          className="block text-sm font-medium text-n-3 mb-2 transition-colors group-focus-within:text-[#33FF57]"
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
            className="w-full px-4 py-3 rounded-lg bg-n-7 text-n-1 border border-n-6 focus:outline-none focus:border-[#33FF57] transition-colors placeholder-n-4/50"
            placeholder="Ingresa el código de tu empresa"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#33FF57] to-[#33FF57] opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none"></div>
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

      <button
        type="submit"
        disabled={isLoading}
        className={`
          relative w-full overflow-hidden rounded-xl
          px-6 py-3 text-sm font-medium uppercase tracking-wider
          transition-all duration-300
          ${isLoading 
            ? 'bg-n-6 text-n-3 cursor-not-allowed'
            : 'bg-n-8 text-[#33FF57] border border-[#33FF57] hover:bg-[#33FF57]/10'
          }
          group
        `}
      >
        <div className="relative z-10 flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Verificando...</span>
            </div>
          ) : (
            <>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                CONTINUAR
              </span>
              <div className="absolute inset-0 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(51,255,87,0.3)]"></div>
            </>
          )}
        </div>
      </button>
    </form>
  );
};

export default CompanyAuth; 