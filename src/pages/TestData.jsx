import React, { useState } from 'react';
import { createRandomSimulation, generateRandomSimulations } from '../utils/simulateData';
import { motion } from 'framer-motion';

const TestData = () => {
  const [count, setCount] = useState(5);
  const [applicationPercent, setApplicationPercent] = useState(20);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [singleType, setSingleType] = useState('simulation'); // 'simulation' or 'application'

  // Handle generating a single random simulation/application
  const handleSingleGeneration = async () => {
    const isApplication = singleType === 'application';
    
    try {
      setGenerating(true);
      const data = await createRandomSimulation(isApplication);
      
      if (data) {
        setResult({
          message: `Se ha generado un(a) ${isApplication ? 'solicitud' : 'simulación'} exitosamente.`,
          data: data,
          type: 'success'
        });
      } else {
        setResult({
          message: `Error al generar ${isApplication ? 'solicitud' : 'simulación'}.`,
          type: 'error'
        });
      }
    } catch (error) {
      setResult({
        message: `Error: ${error.message}`,
        type: 'error'
      });
    } finally {
      setGenerating(false);
    }
  };

  // Handle generating multiple random simulations
  const handleBulkGeneration = async () => {
    try {
      setGenerating(true);
      const results = await generateRandomSimulations(count, applicationPercent);
      
      setResult({
        message: `Generación completada: ${results.success} éxitos (${results.applications} solicitudes, ${results.simulations} simulaciones), ${results.failed} errores.`,
        data: results,
        type: 'success'
      });
    } catch (error) {
      setResult({
        message: `Error: ${error.message}`,
        type: 'error'
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] min-h-screen bg-n-8">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8 text-white"
        >
          Generador de Datos de Prueba
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto bg-n-7 rounded-2xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-white">Generar Dato Individual</h2>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Tipo de Registro:</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setSingleType('simulation')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  singleType === 'simulation' 
                    ? 'bg-[#33FF57] text-black font-semibold' 
                    : 'bg-n-6 text-white hover:bg-n-5'
                }`}
              >
                Simulación
              </button>
              <button
                onClick={() => setSingleType('application')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  singleType === 'application' 
                    ? 'bg-[#33FF57] text-black font-semibold' 
                    : 'bg-n-6 text-white hover:bg-n-5'
                }`}
              >
                Solicitud de Préstamo
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSingleGeneration}
            disabled={generating}
            className="px-6 py-3 bg-[#33FF57] hover:bg-[#2be04e] text-black rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generando...' : `Generar ${singleType === 'application' ? 'Solicitud' : 'Simulación'}`}
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto bg-n-7 rounded-2xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-white">Generar Múltiples Registros</h2>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Cantidad de Registros:</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="flex-grow h-2 bg-n-6 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-16 px-2 py-1 bg-n-6 text-white rounded-lg text-center border border-n-5"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Porcentaje de Solicitudes: {applicationPercent}%</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={applicationPercent}
                onChange={(e) => setApplicationPercent(parseInt(e.target.value))}
                className="flex-grow h-2 bg-n-6 rounded-lg cursor-pointer"
              />
              <span className="w-16 text-white text-center">{applicationPercent}%</span>
            </div>
          </div>
          
          <button
            onClick={handleBulkGeneration}
            disabled={generating}
            className="px-6 py-3 bg-[#33FF57] hover:bg-[#2be04e] text-black rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generando...' : `Generar ${count} Registros`}
          </button>
        </motion.div>
        
        {/* Result message */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-2xl mx-auto p-4 rounded-lg mb-8 ${
              result.type === 'success' ? 'bg-green-950/50 border border-green-800' : 'bg-red-950/50 border border-red-800'
            }`}
          >
            <p className={`text-lg ${result.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {result.message}
            </p>
            {result.data && (
              <details className="mt-4">
                <summary className="cursor-pointer text-gray-300 hover:text-white">
                  Ver detalles
                </summary>
                <pre className="mt-2 p-3 bg-n-8 rounded text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </motion.div>
        )}
        
        <div className="text-center mt-8">
          <a 
            href="/dashboard" 
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            Ir al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestData; 