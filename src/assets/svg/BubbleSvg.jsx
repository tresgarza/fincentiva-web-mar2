import React from "react";
import { motion } from "framer-motion";

const BubbleSvg = ({ className, color = "currentColor", ...props }) => {
  return (
    <svg
      width="422"
      height="572"
      viewBox="0 0 422 572"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <motion.circle
        cx="134" 
        cy="84" 
        r="22" 
        fill={color}
        fillOpacity="0.3"
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.circle
        cx="239" 
        cy="122" 
        r="16" 
        fill={color}
        fillOpacity="0.4"
        animate={{
          y: [0, -10, 0],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.5
        }}
      />
      <motion.circle
        cx="287" 
        cy="219" 
        r="34" 
        fill={color}
        fillOpacity="0.2"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      <motion.circle
        cx="375" 
        cy="310" 
        r="12" 
        fill={color}
        fillOpacity="0.5"
        animate={{
          y: [0, -8, 0],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1.5
        }}
      />
      <motion.circle
        cx="198" 
        cy="388" 
        r="28" 
        fill={color}
        fillOpacity="0.3"
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
      <motion.circle
        cx="97" 
        cy="415" 
        r="18" 
        fill={color}
        fillOpacity="0.4"
        animate={{
          y: [0, -12, 0],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.7
        }}
      />
      <motion.circle
        cx="52" 
        cy="268" 
        r="25" 
        fill={color}
        fillOpacity="0.2"
        animate={{
          y: [0, -15, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1.2
        }}
      />
    </svg>
  );
};

export default BubbleSvg; 