import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { HambugerMenu } from "./design/Header";
import MenuSvg from "../assets/svg/MenuSvg";

const Header = () => {
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

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
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-4 lg:px-6 max-lg:py-2 h-[58px]">
        <Link 
          to="/" 
          className="block mr-12"
          onClick={handleClick}
        >
          <h1 className="text-xl font-bold text-white">FINCENTIVA</h1>
        </Link>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[4rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row lg:justify-start">
            {navigation.map((item) => (
              item.isHash ? (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleClick}
                  className={`block relative font-code uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile && "lg:hidden"
                  } px-6 py-4 md:py-6 lg:mr-0.25 lg:text-sm lg:font-semibold 
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
                  } px-6 py-4 md:py-6 lg:mr-0.25 lg:text-sm lg:font-semibold ${
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

        <div className="ml-auto flex items-center">
          <a 
            href="https://fincentiva-feb21-2025-front.vercel.app/login" 
            className="button hidden mr-4 lg:flex px-4 py-2 bg-n-7 hover:bg-n-6 text-n-1 rounded-lg transition-all duration-300 hover:scale-105"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acceso Empresas
          </a>
          
          <Link 
            to="/register" 
            className="button hidden lg:flex px-4 py-2 bg-[#33FF57] hover:bg-[#2be04e] text-black rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#33FF57]/20"
          >
            Registrar Empresa
          </Link>
          
          <button
            onClick={toggleNavigation}
            className="lg:hidden"
          >
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
