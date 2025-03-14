import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { HambugerMenu } from "./design/Header";
import MenuSvg from "../assets/svg/MenuSvg";

const Header = () => {
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (openNavigation) {
      enablePageScroll();
      setOpenNavigation(false);
    }
  };

  const navigation = [
    {
      id: "0",
      title: "Inicio",
      url: "/",
    },
    {
      id: "1",
      title: "Crédito Automotriz",
      url: "/auto-loan",
    },
    {
      id: "3",
      title: "Crédito vía Nómina",
      url: "/payroll-loan",
    },
    {
      id: "4",
      title: "Contacto",
      url: "/#footer",
      isHash: true
    },
    {
      id: "5",
      title: "Registrar Empresa",
      url: "/register",
      onlyMobile: true
    }
    // Dashboard no se muestra en navegación, solo accesible por URL directa
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 transition-all duration-300 ${
        openNavigation ? "bg-n-8" : scrolled ? "bg-n-8/95 backdrop-blur-sm" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 h-[58px] lg:h-[70px]">
        <Link 
          to="/" 
          className="block z-10"
          onClick={handleClick}
        >
          <h1 className="text-xl font-bold text-white">FINCENTIVA</h1>
        </Link>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[58px] left-0 right-0 bottom-0 bg-n-8 overflow-auto pb-16 lg:static lg:flex lg:bg-transparent lg:pb-0 lg:overflow-visible`}
        >
          <div className="relative z-2 flex flex-col w-full items-center my-auto lg:flex-row lg:justify-center">
            {navigation.map((item) => (
              item.isHash ? (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleClick}
                  className={`block relative font-code uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile && "lg:hidden"
                  } w-full text-center px-6 py-4 md:py-5 lg:w-auto lg:mr-0.25 lg:text-sm lg:font-semibold 
                  lg:text-n-1/80 lg:leading-5 lg:hover:text-color-1 group`}
                >
                  {item.title}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-color-1 group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={handleClick}
                  className={`block relative font-code uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile && "lg:hidden"
                  } w-full text-center px-6 py-4 md:py-5 lg:w-auto lg:mr-0.25 lg:text-sm lg:font-semibold ${
                    location.pathname === item.url
                      ? "text-color-1 lg:text-color-1"
                      : "lg:text-n-1/80"
                  } lg:leading-5 lg:hover:text-color-1 group`}
                >
                  {item.title}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-color-1 group-hover:w-full transition-all duration-300" />
                </Link>
              )
            ))}
          </div>

          <HambugerMenu />
        </nav>

        <div className="flex items-center space-x-3 z-10">
          <a 
            href="https://fincentiva-feb21-2025-front.vercel.app/login" 
            className="button hidden md:flex px-4 py-2 bg-n-7 hover:bg-n-6 text-n-1 rounded-lg transition-all duration-300 hover:scale-105 text-sm md:text-base whitespace-nowrap"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acceso Empresas
          </a>
          
          <Link 
            to="/register" 
            className="button hidden md:flex px-4 py-2 bg-[#33FF57] hover:bg-[#2be04e] text-black rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#33FF57]/20 text-sm md:text-base whitespace-nowrap"
          >
            Registrar Empresa
          </Link>
          
          <button
            onClick={toggleNavigation}
            className="lg:hidden p-1"
            aria-label="Menu de navegación"
          >
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
