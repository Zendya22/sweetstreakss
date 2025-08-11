'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { ChevronRight, Zap, Target, Trophy } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingScreens = [
  {
    id: 1,
    icon: <Zap className="w-12 h-12 text-white" />,
    title: "Track Daily Habits",
    description: "Build lasting sugar-free habits with daily check-ins and streak tracking",
    gradient: "gradient-emerald",
    illustration: "🍃",
  },
  {
    id: 2,
    icon: <Target className="w-12 h-12 text-white" />,
    title: "Take On Challenges",
    description: "Join focused challenges like 'No Soda for 10 Days' to build specific healthy habits",
    gradient: "gradient-lavender",
    illustration: "🎯",
  },
  {
    id: 3,
    icon: <Trophy className="w-12 h-12 text-white" />,
    title: "Celebrate Milestones",
    description: "Unlock achievements and share your success with beautiful milestone cards",
    gradient: "gradient-peach",
    illustration: "🏆",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setDirection(1);
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      setDirection(-1);
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSwipe = (offset: number, velocity: number) => {
    if (offset > 100 && velocity > 300) {
      // Swipe right - go to previous
      handlePrevious();
    } else if (offset < -100 && velocity > 300) {
      // Swipe left - go to next
      handleNext();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const currentScreenData = onboardingScreens[currentScreen];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-mint-light p-4 flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end pt-4 pb-8">
        <Button 
          variant="ghost" 
          onClick={onComplete}
          className="text-emerald-600 hover:text-emerald-700"
        >
          Skip
        </Button>
      </div>

      {/* Screen Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentScreen}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center space-y-8"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info: PanInfo) => {
                handleSwipe(info.offset.x, Math.abs(info.velocity.x));
              }}
            >
              {/* Illustration */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className={`w-32 h-32 mx-auto bg-${currentScreenData.gradient} rounded-3xl flex items-center justify-center shadow-soft`}
              >
                <span className="text-6xl">{currentScreenData.illustration}</span>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-emerald-800">
                  {currentScreenData.title}
                </h2>
                <p className="text-emerald-600 leading-relaxed px-4">
                  {currentScreenData.description}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="pb-8 space-y-6">
        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2">
          {onboardingScreens.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentScreen 
                  ? 'bg-emerald-500 w-6' 
                  : 'bg-emerald-200'
              }`}
              layoutId={`dot-${index}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center px-4">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentScreen === 0}
            className="text-emerald-600 disabled:opacity-30"
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-gradient-emerald hover:scale-105 transition-transform text-white rounded-xl px-6 py-3"
          >
            {currentScreen === onboardingScreens.length - 1 ? (
              'Get Started'
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Swipe Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-emerald-400"
        >
          Swipe left or right to navigate
        </motion.p>
      </div>
    </div>
  );
}