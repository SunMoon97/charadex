import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerProps {
  duration?: number;
  onTimeUp?: () => void;
  isRunning: boolean;
  onStartToggle?: (running: boolean) => void;
  resetKey?: number;
}

export default function Timer({ duration = 60, onTimeUp, isRunning, onStartToggle, resetKey }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  // Calculate progress percentage and circle properties
  const progress = (timeLeft / duration) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp?.();
      return;
    }

    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isRunning, onTimeUp, duration]);

  // Reset timeLeft when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Reset when resetKey changes (used for shuffle/reset actions)
  useEffect(() => {
    if (typeof resetKey !== 'undefined') {
      setTimeLeft(duration);
    }
  }, [resetKey, duration]);

  return (
    <div className="relative">
      <motion.div
        className="w-64 h-64 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Gradient Background Circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl" />
        
        {/* Timer Circle */}
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            className="stroke-gray-700"
            strokeWidth="12"
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="128"
            cy="128"
            r={radius}
            className={`${timeLeft === 0 ? 'stroke-red-500' : 'stroke-purple-500'}`}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
        
        {/* Timer Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {timeLeft === 0 ? (
              <motion.div
                key="timeUp"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-red-500 text-4xl font-bold flex flex-col items-center"
              >
                <span className="text-5xl mb-2">⏰</span>
                <span className="text-2xl">Time's Up!</span>
              </motion.div>
            ) : (
              <motion.div
                key="countdown"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-5xl font-bold text-white"
              >
                {timeLeft}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Start / Pause button */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center">
          <button
            onClick={() => onStartToggle?.(!isRunning)}
            className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
