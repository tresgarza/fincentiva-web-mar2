import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 25;

const Particles = ({ 
  className = "",
  particleColor = "from-color-1 to-color-2",
  minSize = 2,
  maxSize = 6,
  speed = 1,
  opacity = 0.3,
  containerId = "particles-container"
}) => {
  const containerRef = useRef(null);
  
  const generateParticles = () => {
    const particles = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      
      particles.push({
        id: `particle-${i}`,
        size: size,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 2,
        opacity: Math.random() * opacity + 0.1,
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }
    
    return particles;
  };
  
  const particles = generateParticles();
  
  return (
    <div 
      id={containerId}
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full bg-gradient-to-br ${particleColor}`}
          style={{ 
            width: `${particle.size}px`, 
            height: `${particle.size}px`,
            top: particle.top,
            left: particle.left,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, particle.direction * -30 * speed, 0],
            x: [0, particle.direction * 20 * speed, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration / speed,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default Particles; 