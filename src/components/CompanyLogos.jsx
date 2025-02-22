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
  const logos = [
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
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Empresas que confían en nosotros
      </h5>
      <div className="relative flex overflow-x-hidden">
        <div className="animate-scroll-logos py-6 flex items-center justify-around min-w-full whitespace-nowrap">
          {logos.map((logo, index) => (
            <div key={index} className="mx-8">
              <img 
                src={logo.src} 
                alt={logo.alt}
                className="h-24 object-contain hover:scale-110 transition-transform duration-300 bg-white/50 backdrop-blur-sm rounded-lg p-4"
              />
            </div>
          ))}
        </div>
        <div className="animate-scroll-logos py-6 flex items-center justify-around min-w-full whitespace-nowrap">
          {logos.map((logo, index) => (
            <div key={`repeat-${index}`} className="mx-8">
              <img 
                src={logo.src} 
                alt={logo.alt}
                className="h-24 object-contain hover:scale-110 transition-transform duration-300 bg-white/50 backdrop-blur-sm rounded-lg p-4"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyLogos;
