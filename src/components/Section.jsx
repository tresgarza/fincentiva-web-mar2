import { motion } from "framer-motion";

import SectionSvg from "../assets/svg/SectionSvg";

const Section = ({
  className,
  id,
  crosses,
  crossesOffset,
  customPaddings,
  children,
}) => {
  return (
    <div
      id={id}
      className={`
        relative 
        ${customPaddings || `py-4 lg:py-6`}
        ${className || ""}
      `}
    >
      {children}

      {crosses && (
        <div className={`absolute top-0 left-0 w-full h-full pointer-events-none ${crossesOffset || ""}`}>
          <div className="absolute top-0 left-0 w-0.25 h-full bg-n-6" />
          <div className="absolute top-0 right-0 w-0.25 h-full bg-n-6" />
          <div className="absolute top-0 left-0 w-full h-0.25 bg-n-6" />
          <div className="absolute bottom-0 left-0 w-full h-0.25 bg-n-6" />
        </div>
      )}
    </div>
  );
};

export default Section;
