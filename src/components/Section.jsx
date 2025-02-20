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
        ${customPaddings || `py-10 lg:py-16 xl:py-20`} 
        ${className || ""}
      `}
    >
      {children}
    </div>
  );
};

export default Section;
