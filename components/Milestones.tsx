'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Star, 
  Crown, 
  Gem, 
  Medal, 
  Award, 
  Sparkles,
  TrendingUp,
  Target,
  Share2
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

interface Milestone {
  id: string;
  days: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  achieved: boolean;
  achievedDate?: Date;
}

interface MilestonesProps {
  currentStreak: number;
  longestStreak: number;
  user?: {
    name: string;
    email: string;
  };
  analytics: {
    currentStreak: number;
    longestStreak: number;
    totalCheckIns: number;
    consistencyPercentage: number;
    qualityScore: number;
    perfectDays: number;
    graceDays: number;
    shieldDays: number;
    shieldsRemaining: number;
    monthlyPerformance: { month: string; checkIns: number; quality: number }[];
  };
}

export default function Milestones({ 
  currentStreak, 
  longestStreak, 
  user,
  analytics 
}: MilestonesProps) {
  const milestones: Milestone[] = [
    {
      id: '1day',
      days: 1,
      title: 'First Step',
      description: 'Your journey begins with a single day!',
      icon: <Star className="w-5 h-5" />,
      color: 'from-cream-400 to-cream-600',
      achieved: currentStreak >= 1,
    },
    {
      id: '3days',
      days: 3,
      title: 'Momentum Builder',
      description: 'Three days strong - building habits!',
      icon: <Medal className="w-5 h-5" />,
      color: 'from-peach-400 to-peach-600',
      achieved: currentStreak >= 3,
    },
    {
      id: '1week',
      days: 7,
      title: 'Week Warrior',
      description: 'A full week! You\'re officially on fire!',
      icon: <Award className="w-5 h-5" />,
      color: 'from-emerald-400 to-emerald-600',
      achieved: currentStreak >= 7,
    },
    {
      id: '2weeks',
      days: 14,
      title: 'Fortnight Fighter',
      description: 'Two weeks down - unstoppable momentum!',
      icon: <Trophy className="w-5 h-5" />,
      color: 'from-sky-400 to-sky-600',
      achieved: currentStreak >= 14,
    },
    {
      id: '1month',
      days: 30,
      title: 'Monthly Master',
      description: 'One month sugar-free! What a champion!',
      icon: <Crown className="w-5 h-5" />,
      color: 'from-lavender-400 to-lavender-600',
      achieved: currentStreak >= 30,
    },
    {
      id: '50days',
      days: 50,
      title: 'Halfway Hero',
      description: '50 days! You\'re halfway to 100!',
      icon: <Gem className="w-5 h-5" />,
      color: 'from-blush-400 to-blush-600',
      achieved: currentStreak >= 50,
    },
    {
      id: '100days',
      days: 100,
      title: 'Century Star',
      description: '100 days! You\'re absolutely incredible!',
      icon: <Trophy className="w-5 h-5" />,
      color: 'from-cream-500 to-peach-500',
      achieved: currentStreak >= 100,
    },
    {
      id: '365days',
      days: 365,
      title: 'Yearly Legend',
      description: 'A full year! You\'re a true legend!',
      icon: <Crown className="w-5 h-5" />,
      color: 'from-lavender-500 to-blush-500',
      achieved: currentStreak >= 365,
    },
  ];

  const achievedCount = milestones.filter(m => m.achieved).length;
  const nextMilestone = milestones.find(m => !m.achieved);
  const totalMilestones = milestones.length;
  const progressPercentage = (achievedCount / totalMilestones) * 100;

  const getPersonalizedGreeting = () => {
    const firstName = user?.name.split(' ')[0] || 'Champion';
    if (achievedCount === 0) return `Ready to start, ${firstName}?`;
    if (achievedCount === 1) return `Great start, ${firstName}!`;
    if (achievedCount < 4) return `Building momentum, ${firstName}!`;
    return `Amazing progress, ${firstName}!`;
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <motion.div 
        className="max-w-md mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Premium Header */}
        <motion.div 
          className="text-center py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 gradient-cream rounded-2xl flex items-center justify-center shadow-glow">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Milestones</h1>
          </div>
          <p className="text-foreground-muted">{getPersonalizedGreeting()}</p>
        </motion.div>

        {/* Premium Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card premium className="p-6 relative overflow-hidden">
            {/* Premium background decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/40 to-mint-100/20 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cream-100/30 to-emerald-100/15 rounded-full transform -translate-x-8 translate-y-8"></div>
            
            <div className="text-center space-y-6 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 premium-gradient rounded-3xl shadow-glow">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-2">
                  {achievedCount} / {totalMilestones}
                </h2>
                <p className="text-emerald-600 font-semibold text-lg">Milestones Unlocked</p>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="space-y-3">
                <div className="relative h-4 bg-emerald-50 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 premium-gradient rounded-full shadow-inner"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
                <p className="text-sm text-emerald-700 font-medium">
                  {Math.round(progressPercentage)}% Complete
                </p>
              </div>
              
              {nextMilestone && (
                <motion.div 
                  className="mt-6 p-4 glass-effect rounded-2xl border border-white/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-800">Next Milestone</p>
                  </div>
                  <p className="font-bold text-emerald-700 text-lg">
                    {nextMilestone.title}
                  </p>
                  <p className="text-sm text-emerald-600 mt-1">
                    {nextMilestone.days - currentStreak} more days to go!
                  </p>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Premium Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card interactive className="p-4 rounded-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 gradient-lavender rounded-2xl flex items-center justify-center mx-auto shadow-premium">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-lavender-600">{analytics.qualityScore}%</p>
              <p className="text-sm text-foreground-muted font-medium">Quality Score</p>
            </div>
          </Card>
          
          <Card interactive className="p-4 rounded-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 gradient-sky rounded-2xl flex items-center justify-center mx-auto shadow-premium">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-sky-600">{analytics.consistencyPercentage}%</p>
              <p className="text-sm text-foreground-muted font-medium">Consistency</p>
            </div>
          </Card>
        </motion.div>

        {/* Premium Milestones Grid */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-lg">Your Journey</h3>
            <span className="text-emerald-600 text-sm font-medium px-3 py-1 bg-emerald-50 rounded-full">
              {achievedCount} unlocked
            </span>
          </div>

          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.4 }}
              className={milestone.achieved ? "animate-scale-in" : ""}
            >
              <Card 
                interactive={milestone.achieved}
                className={`p-5 rounded-2xl transition-all duration-300 ${
                  milestone.achieved 
                    ? 'premium shadow-premium-lg border-emerald-100 hover:shadow-glow' 
                    : 'bg-background-secondary border-border opacity-60'
                }`}
              >
                <div className="space-y-4">
                  {/* Top section - Icon and Title with Badge */}
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-premium ${
                      milestone.achieved 
                        ? `bg-gradient-to-br ${milestone.color} text-white shadow-glow` 
                        : 'bg-background-tertiary text-foreground-muted'
                    }`}>
                      {milestone.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className={`font-semibold text-base leading-tight ${
                          milestone.achieved ? 'text-foreground' : 'text-foreground-muted'
                        }`}>
                          {milestone.title}
                        </h4>
                        {milestone.achieved && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-200">
                            ✨ Unlocked
                          </Badge>
                        )}
                      </div>
                      
                      <p className={`text-sm leading-relaxed ${
                        milestone.achieved ? 'text-foreground-muted' : 'text-foreground-muted/60'
                      }`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bottom section - Days and Share button */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        milestone.achieved 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                          : 'bg-background-tertiary text-foreground-muted'
                      }`}>
                        {milestone.days} {milestone.days === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    
                    {milestone.achieved && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Create shareable achievement card
                          const canvas = document.createElement('canvas');
                          const ctx = canvas.getContext('2d');
                          if (!ctx) return;
                          
                          canvas.width = 800;
                          canvas.height = 600;
                          
                          // Premium gradient background
                          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                          gradient.addColorStop(0, '#10b981');
                          gradient.addColorStop(0.5, '#22c55e');
                          gradient.addColorStop(1, '#059669');
                          ctx.fillStyle = gradient;
                          ctx.fillRect(0, 0, canvas.width, canvas.height);
                          
                          // Premium text styling
                          ctx.fillStyle = 'white';
                          ctx.textAlign = 'center';
                          ctx.font = 'bold 48px system-ui';
                          ctx.fillText('🏆 Milestone Achieved!', canvas.width / 2, 150);
                          
                          ctx.font = 'bold 64px system-ui';
                          ctx.fillText(milestone.title, canvas.width / 2, 250);
                          
                          ctx.font = '28px system-ui';
                          ctx.fillText(`${milestone.days} days sugar-free`, canvas.width / 2, 320);
                          
                          ctx.font = '24px system-ui';
                          ctx.fillText(`${user?.name || 'Champion'}'s journey with SweetStreaks`, canvas.width / 2, 380);
                          
                          ctx.font = '20px system-ui';
                          ctx.fillText(milestone.description, canvas.width / 2, 440);
                          
                          ctx.font = '16px system-ui';
                          ctx.fillText('🍃 Building healthier habits, one day at a time', canvas.width / 2, 500);
                          
                          // Download the premium image
                          const link = document.createElement('a');
                          link.download = `sweetstreaks-${milestone.title.toLowerCase().replace(/\s+/g, '-')}-milestone.png`;
                          link.href = canvas.toDataURL();
                          link.click();
                          
                          toast.success(`🎉 ${milestone.title} achievement card downloaded! Time to celebrate your win!`);
                        }}
                        className="bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 transition-all duration-200 px-3 py-1.5 h-auto rounded-xl"
                      >
                        <Share2 className="w-3 h-3 mr-1.5" />
                        <span className="text-xs font-medium">Share Victory</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Encouragement */}
        {achievedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card glass className="p-6 rounded-2xl border-cream-200 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cream-200/30 to-cream-300/20 rounded-full transform translate-x-8 -translate-y-8"></div>
              
              <div className="text-center space-y-3 relative z-10">
                <div className="inline-flex items-center space-x-2">
                  <span className="text-2xl">🎉</span>
                  <h3 className="font-semibold text-cream-800">
                    You're Amazing{user ? `, ${user.name.split(' ')[0]}` : ''}!
                  </h3>
                </div>
                <p className="text-sm text-cream-700 leading-relaxed">
                  Every milestone represents your incredible commitment to a healthier lifestyle. 
                  {nextMilestone ? ` Your next milestone is just ${nextMilestone.days - currentStreak} days away!` : ' You\'ve unlocked them all - what a legend!'}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}