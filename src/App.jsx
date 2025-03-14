import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ButtonGradient from './assets/svg/ButtonGradient';
import WarningBanner from './components/WarningBanner';
import Home from './pages/Home';
import AutoLoan from './pages/AutoLoan';
import PayrollLoan from './pages/PayrollLoan';
import Login from './pages/Login';
import CompanyPanel from './pages/CompanyPanel';
import CompanyRegistration from './pages/CompanyRegistration';
import Dashboard from './pages/Dashboard';
import TestData from './pages/TestData';
import RealtimeTest from './pages/RealtimeTest';
import RotatingDashboard from './pages/RotatingDashboard';

// Componente que se encarga de hacer scroll al inicio en cada cambio de ruta
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    console.log('Navegación detectada:', { pathname, hash });
    
    // Si hay un hash, dejamos que el manejo del hash específico lo haga el componente de destino
    // Si no hay hash, scrolleamos al inicio de la página
    if (!hash) {
      console.log('Reset de scroll al inicio de la página');
      // Forzar el scroll al inicio de la página
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Uso 'instant' en lugar de 'auto' o 'smooth' para asegurar que sea inmediato
      });
    } else {
      console.log('Se detectó un hash:', hash, 'Dejando que el componente destino maneje el scroll');
    }
  }, [pathname, hash]);
  
  return null;
};

// Componente para renderizar condicionalmente el Header y el WarningBanner
const ConditionalUI = () => {
  const { pathname } = useLocation();
  
  // Determinar si estamos en una página administrativa o pública
  const isAdminPage = ['/dashboard', '/test-data', '/realtime-test'].includes(pathname);
  
  return (
    <>
      {!isAdminPage && <WarningBanner />}
      {!isAdminPage && <Header />}
    </>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden bg-n-8">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-n-8 via-n-8/95 to-n-8/90 z-0" />
          
          {/* Animated Circles */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#33FF57]/10 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#40E0D0]/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-[#4DE8B2]/10 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(51,255,87,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(51,255,87,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <ScrollToTop />
          <ConditionalUI />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auto-loan" element={<AutoLoan />} />
              <Route path="/payroll-loan" element={<PayrollLoan />} />
              <Route path="/company-panel" element={<CompanyPanel />} />
              <Route path="/register" element={<CompanyRegistration />} />
              <Route path="/dashboard" element={<RotatingDashboard />} />
              <Route path="/test-data" element={<TestData />} />
              <Route path="/realtime-test" element={<RealtimeTest />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ButtonGradient />
        </div>

        {/* Add styles for animations */}
        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </Router>
  );
};

export default AppWrapper;
