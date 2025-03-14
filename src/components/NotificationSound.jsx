import { useEffect, useRef } from 'react';

const NotificationSound = ({ trigger, volume = 0.3 }) => {
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  
  useEffect(() => {
    // Limpiar al desmontar
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!trigger) return;
    
    // Reproducir tres pitidos rápidos
    playTripleBeep();
  }, [trigger, volume]);
  
  const createBeep = (startTime, frequency = 880, duration = 0.1) => {
    if (!audioContextRef.current) {
      // Inicializar el AudioContext bajo demanda para evitar errores con navegadores
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = volume;
        gainNodeRef.current.connect(audioContextRef.current.destination);
      } catch (e) {
        console.error('Error al crear AudioContext:', e);
        return;
      }
    }
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      oscillator.connect(gainNodeRef.current);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    } catch (e) {
      console.error('Error al crear oscilador:', e);
    }
  };
  
  const playTripleBeep = () => {
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = volume;
        gainNodeRef.current.connect(audioContextRef.current.destination);
      } catch (e) {
        console.error('Error al crear AudioContext:', e);
        return;
      }
    }
    
    const now = audioContextRef.current.currentTime;
    
    // Tres pitidos rápidos con un pequeño intervalo entre ellos
    createBeep(now, 880, 0.1);
    createBeep(now + 0.15, 880, 0.1);
    createBeep(now + 0.3, 880, 0.1);
  };
  
  // Este componente no renderiza nada, solo maneja el sonido
  return null;
};

export default NotificationSound; 