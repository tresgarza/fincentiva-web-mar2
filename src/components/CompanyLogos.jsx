import { motion } from 'framer-motion';

// Import all company logos
import logoCartotec from '../assets/logos/logo_empresa_cartotec.png';
import logoCadtoner from '../assets/logos/Logo_empresa_cadtoner.png';
import logoEtimex from '../assets/logos/logo_empresa_etimex.png';
import logoFortezza from '../assets/logos/logo_empresa_fortezza.png';
import logoPlastypel from '../assets/logos/logo_empresa_plastypel.png';
import logoUnoretail from '../assets/logos/logo_empresa_unoretail.png';
import logoMatamoros from '../assets/logos/logo_empresa_matamoros.png';
import logoLogistorage from '../assets/logos/logo_empresa_logistorage.png';
import logoMulligans from '../assets/logos/logo_empresa_mulligans.png';
import logoVallealto from '../assets/logos/logo_empresa_vallealto.png';

const CompanyLogos = ({ className }) => {
  // Company logos with their alt text
  const companyLogos = [
    { src: logoCartotec, alt: "Cartotec" },
    { src: logoCadtoner, alt: "Cadtoner" },
    { src: logoEtimex, alt: "Etimex" },
    { src: logoFortezza, alt: "Fortezza" },
    { src: logoPlastypel, alt: "Plastypel" },
    { src: logoUnoretail, alt: "Unoretail" },
    { src: logoMatamoros, alt: "Matamoros" },
    { src: logoLogistorage, alt: "Logistorage" },
    { src: logoMulligans, alt: "Mulligans" },
    { src: logoVallealto, alt: "Valle Alto" }
  ];

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold"
        >
          Empresas que confían en nosotros
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "120px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-[#40E0D0] to-[#3FD494] mx-auto my-4 rounded-full"
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="marquee overflow-hidden relative hover:cursor-pointer"
      >
        <div className="track flex flex-nowrap w-[200%] animate-scroll-logos">
          {/* First set of logos */}
          {companyLogos.map((logo, index) => (
            <div key={`logo-${index}`} className="flex-shrink-0 px-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <img 
                  src={logo.src} 
                  alt={logo.alt}
                  className="h-16 w-[160px] object-contain"
                />
              </div>
            </div>
          ))}
          
          {/* Duplicate set for continuous scrolling */}
          {companyLogos.map((logo, index) => (
            <div key={`logo-dup-${index}`} className="flex-shrink-0 px-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <img 
                  src={logo.src} 
                  alt={logo.alt}
                  className="h-16 w-[160px] object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyLogos;
