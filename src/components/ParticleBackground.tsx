import { useCallback } from 'react';
import { motion } from 'framer-motion';

export default function ParticleBackground() {
  const renderParticles = useCallback(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * -20;
      
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            y: {
              duration,
              repeat: Infinity,
              ease: "linear",
              repeatType: "reverse",
            },
            opacity: {
              duration: duration / 2,
              repeat: Infinity,
              ease: "linear",
              repeatType: "reverse",
            },
            delay,
          }}
        />
      );
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black" />
      {renderParticles()}
    </div>
  );
}