'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Premium animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-mint-50 to-sage-50">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-emerald-200/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-16 w-24 h-24 bg-mint-300/40 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-20 h-20 bg-sage-200/35 rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-20 right-32 w-16 h-16 bg-emerald-300/25 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 px-8">
        {/* Premium logo with enhanced animations */}
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 1
          }}
        >
          {/* Logo container with premium styling */}
          <motion.div
            className="relative"
            animate={{
              rotateY: [0, 360],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <div className="w-24 h-24 premium-gradient rounded-3xl flex items-center justify-center shadow-glow relative">
              {/* Inner glow effect */}
              <div className="absolute inset-2 bg-white/20 rounded-2xl backdrop-blur-sm"></div>
              <motion.span 
                className="text-4xl relative z-10"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🍃
              </motion.span>
            </div>
            
            {/* Orbiting elements */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-glow"></div>
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-2 h-2 bg-mint-400 rounded-full shadow-glow"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-sage-400 rounded-full shadow-glow"></div>
              <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full shadow-glow"></div>
            </motion.div>
          </motion.div>

          {/* Enhanced brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gradient tracking-tight">
              SweetStreaks
            </h1>
            <motion.p 
              className="text-lg text-foreground-muted mt-2 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Your Sugar-Free Journey
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Enhanced loading animation */}
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          {/* Premium loading bar */}
          <div className="w-48 h-2 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
            <motion.div
              className="h-full premium-gradient rounded-full shadow-glow"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>

          {/* Loading text with typewriter effect */}
          <motion.p
            className="text-sm text-foreground-muted font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            Preparing your wellness journey...
          </motion.p>
        </motion.div>

        {/* Premium floating elements */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 10)}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + (i * 0.5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}