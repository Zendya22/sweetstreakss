'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Home, Target, Trophy, BarChart3, Share2 } from 'lucide-react';

interface BottomNavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export default function BottomNavigation({ currentSection, onNavigate }: BottomNavigationProps) {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      color: 'emerald'
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: Target,
      color: 'sky'
    },
    {
      id: 'milestones',
      label: 'Milestones',
      icon: Trophy,
      color: 'cream'
    },
    {
      id: 'analytics',
      label: 'Analytics',  
      icon: BarChart3,
      color: 'lavender'
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      color: 'blush'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      emerald: {
        bg: isActive ? 'bg-emerald-500' : 'bg-transparent',
        text: isActive ? 'text-white' : 'text-foreground-muted',
        glow: isActive ? 'shadow-glow' : ''
      },
      sky: {
        bg: isActive ? 'bg-sky-500' : 'bg-transparent',
        text: isActive ? 'text-white' : 'text-foreground-muted',
        glow: isActive ? 'shadow-[0_0_20px_rgba(56,189,248,0.3)]' : ''
      },
      cream: {
        bg: isActive ? 'bg-cream-500' : 'bg-transparent',
        text: isActive ? 'text-white' : 'text-foreground-muted',
        glow: isActive ? 'shadow-[0_0_20px_rgba(251,191,36,0.3)]' : ''
      },
      lavender: {
        bg: isActive ? 'bg-lavender-500' : 'bg-transparent',
        text: isActive ? 'text-white' : 'text-foreground-muted',
        glow: isActive ? 'shadow-[0_0_20px_rgba(160,109,255,0.3)]' : ''
      },
      blush: {
        bg: isActive ? 'bg-blush-500' : 'bg-transparent',
        text: isActive ? 'text-white' : 'text-foreground-muted',
        glow: isActive ? 'shadow-[0_0_20px_rgba(236,72,153,0.3)]' : ''
      }
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Premium backdrop */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-xl"></div>
      
      {/* Navigation container */}
      <div className="relative px-4 pt-2 pb-6">
        <div className="max-w-md mx-auto">
          <div className="glass-effect-strong rounded-2xl p-2 shadow-premium-lg border border-white/30">
            <div className="flex items-center justify-around">
              {navigationItems.map((item) => {
                const isActive = currentSection === item.id;
                const colorClasses = getColorClasses(item.color, isActive);
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl nav-button no-tap-highlight ${
                      isActive ? 'scale-click' : 'touch-feedback'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    {/* Active indicator background */}
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 ${colorClasses.bg} ${colorClasses.glow} rounded-xl`}
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* Icon container */}
                    <div className="relative z-10 flex flex-col items-center space-y-1">
                      <div className={`p-1 transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>
                        <Icon className={`w-5 h-5 transition-colors duration-200 ${colorClasses.text}`} />
                      </div>
                      
                      {/* Label */}
                      <span className={`text-[10px] font-medium transition-all duration-200 ${colorClasses.text} ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-70'}`}>
                        {item.label}
                      </span>
                    </div>

                    {/* Touch feedback ripple effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      initial={false}
                      whileTap={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        scale: 0.95,
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}