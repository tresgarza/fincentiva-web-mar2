import { socials } from "../constants";
import Section from "./Section";
import logoBuro from "../assets/logos/logo_buro.png";
import logoCondusef from "../assets/logos/logo_condusef.png";
import logoCNBV from "../assets/logos/Logo_CNBV.png";
import { HiDocumentText } from "react-icons/hi";

const Footer = () => {
  return (
    <footer id="footer" className="py-8 md:py-10 bg-n-8 border-t border-n-6">
      <div className="container mx-auto px-4">
        {/* Sección de Reguladores */}
        <div className="mb-8 md:mb-12">
          <h4 className="text-lg font-semibold text-n-1 mb-6 text-center px-2">
            Instituciones que nos Regulan, Califican y Reconocen:
          </h4>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 md:mb-8">
            <a 
              href="https://www.buro.gob.mx/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-sm rounded-lg p-3 md:p-4 hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <img src={logoBuro} alt="Logo Buró de Entidades Financieras" className="h-8 md:h-12 object-contain" />
            </a>
            <a 
              href="https://www.condusef.gob.mx/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-sm rounded-lg p-3 md:p-4 hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <img src={logoCondusef} alt="Logo CONDUSEF" className="h-8 md:h-12 object-contain" />
            </a>
            <a 
              href="https://www.gob.mx/cnbv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-sm rounded-lg p-3 md:p-4 hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <img src={logoCNBV} alt="Logo CNBV" className="h-8 md:h-12 object-contain" />
            </a>
          </div>
        </div>

        {/* Información Legal */}
        <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6 text-xs md:text-sm text-n-4">
          <p className="px-2">
            Financiera Incentiva, S.A.P.I. de C.V., SOFOM, E.N.R., está constituido y operando con carácter de SOFOM E.N.R. para lo cual no requiere autorización de la Secretaría de Hacienda y Crédito Público, y está sujeto a la supervisión de la Comisión Nacional Bancaria y de Valores, únicamente para lo dispuesto en el art. 56 de la Ley General de Organizaciones y Actividades Auxiliares de Crédito.
          </p>
          
          <p className="px-2">
            El Buró de Entidades Financieras contiene información de Financiera Incentiva, S.A.P.I. de C.V., SOFOM, E.N.R., sobre nuestro desempeño frente a los usuarios por la prestación de productos y servicios.
            Te invitamos a consultarlo en la página{" "}
            <a 
              href="https://www.buro.gob.mx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#33FF57] hover:underline"
            >
              https://www.buro.gob.mx
            </a>
            {" "}o nuestra página de internet{" "}
            <a 
              href="https://fincentiva.com.mx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#33FF57] hover:underline"
            >
              https://fincentiva.com.mx
            </a>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-n-3 px-2">
            <span>Titular de la UNE</span>
            <span className="hidden md:inline text-n-1">|</span>
            <span>Adolfo Medina Figueroa</span>
            <span className="hidden md:inline text-n-1">|</span>
            <a 
              href="mailto:amedina@fincentiva.com.mx"
              className="text-[#33FF57] hover:underline"
            >
              amedina@fincentiva.com.mx
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-n-4">
          <p>© {new Date().getFullYear()} Financiera Incentiva. Todos los derechos reservados.</p>
          
          {/* Documentos legales */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <a 
              href="/docs/aviso-privacidad.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-n-7 hover:bg-n-6 text-n-1 rounded-lg transition-colors duration-300 text-sm"
            >
              <HiDocumentText className="text-[#33FF57]" />
              Aviso de Privacidad
            </a>
            
            <a 
              href="/docs/Disposiciones-Legales.docx.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-n-7 hover:bg-n-6 text-n-1 rounded-lg transition-colors duration-300 text-sm"
            >
              <HiDocumentText className="text-[#33FF57]" />
              Disposiciones Legales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
