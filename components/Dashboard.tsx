'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, Target, Trophy, Share2, CheckCircle2, User, Calendar, Sparkles, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import DatePicker from './DatePicker';

interface Challenge {
  id: string;
  title: string;
  currentDay: number;
  duration: number;
  emoji: string;
  color: string;
  lastCheckIn?: Date;
}

interface UserData {
  name: string;
  email: string;
}

interface StreakStatus {
  status: 'active' | 'warning' | 'critical' | 'broken';
  hoursRemaining: number;
  canUseShield: boolean;
  nextNotification: 'reminder' | 'warning' | 'critical' | 'recovery' | null;
}

interface StreakAnalytics {
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
}

interface DashboardProps {
  startDate: Date;
  currentStreak: number;
  onCheckIn: () => void;
  onNavigate: (section: string) => void;
  hasCheckedInToday: boolean;
  onDateChange?: (date: Date) => void;
  activeChallenges?: Challenge[];
  onChallengeCheckIn?: (challengeId: string) => void;
  user?: UserData;
  streakStatus?: StreakStatus;
  analytics?: StreakAnalytics;
}

export default function Dashboard({ 
  startDate, 
  currentStreak, 
  onCheckIn, 
  onNavigate,
  hasCheckedInToday,
  onDateChange,
  activeChallenges = [],
  onChallengeCheckIn,
  user,
  streakStatus,
  analytics
}: DashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const challengeColors = {
    'no-soda': { bg: 'bg-sky-100', text: 'text-sky-700', gradient: 'gradient-sky' },
    'no-fast-food': { bg: 'bg-peach-100', text: 'text-peach-700', gradient: 'gradient-peach' },
    'no-sugar-drinks': { bg: 'bg-lavender-100', text: 'text-lavender-700', gradient: 'gradient-lavender' },
    'home-cooked': { bg: 'bg-sage-100', text: 'text-sage-700', gradient: 'gradient-sage' },
    'no-processed': { bg: 'bg-blush-100', text: 'text-blush-700', gradient: 'gradient-blush' },
    'no-maida': { bg: 'bg-cream-100', text: 'text-cream-700', gradient: 'gradient-cream' },
  };

  const milestones = [1, 3, 7, 14, 30, 50, 100, 365];
  const nextMilestone = milestones.find(m => m > currentStreak);
  const previousMilestone = milestones.filter(m => m <= currentStreak).pop() || 0;
  
  const getMilestoneTitle = (days: number) => {
    if (days === 1) return "First Step";
    if (days === 3) return "3 Days";
    if (days === 7) return "Week Warrior";
    if (days === 14) return "2 Weeks";
    if (days === 30) return "Monthly Master";
    if (days === 50) return "50 Days";
    if (days === 100) return "Century Star";
    if (days === 365) return "Yearly Legend";
    return `${days} Days`;
  };

  const getPersonalizedGreeting = () => {
    const firstName = user?.name.split(' ')[0] || 'there';
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    if (currentStreak === 0) return `${timeGreeting}, ${firstName}! Ready to start your sugar-free journey?`;
    if (currentStreak === 1) return `Great start, ${firstName}!`;
    if (currentStreak < 7) return `Building momentum, ${firstName}!`;
    if (currentStreak < 30) return `You're on fire, ${firstName}!`;
    return `Amazing dedication, ${firstName}!`;
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.name.split(' ')[0] || '';
    
    if (hour < 12) return `Good morning${firstName ? `, ${firstName}` : ''}!`;
    else if (hour < 17) return `Good afternoon${firstName ? `, ${firstName}` : ''}!`;
    else return `Good evening${firstName ? `, ${firstName}` : ''}!`;
  };

  const getStreakStatusColor = () => {
    if (!streakStatus) return 'text-emerald-600';
    switch (streakStatus.status) {
      case 'warning': return 'text-warning';
      case 'critical': return 'text-error';
      case 'broken': return 'text-foreground-muted';
      default: return 'text-emerald-600';
    }
  };

  const getStreakStatusMessage = () => {
    if (!streakStatus) return '';
    switch (streakStatus.status) {
      case 'warning':
        return `⚠️ ${Math.floor(streakStatus.hoursRemaining)}h ${Math.floor((streakStatus.hoursRemaining % 1) * 60)}m remaining`;
      case 'critical':
        return `🚨 Critical: ${Math.floor(streakStatus.hoursRemaining)}h ${Math.floor((streakStatus.hoursRemaining % 1) * 60)}m left!`;
      case 'broken':
        return streakStatus.canUseShield ? '🛡️ Use Streak Shield to recover' : '💔 Streak broken - start fresh!';
      default:
        return '';
    }
  };

  const canCheckInChallenge = (challenge: Challenge) => {
    if (!challenge.lastCheckIn) return true;
    const today = new Date();
    const lastCheckIn = new Date(challenge.lastCheckIn);
    return (
      today.getFullYear() !== lastCheckIn.getFullYear() ||
      today.getMonth() !== lastCheckIn.getMonth() ||
      today.getDate() !== lastCheckIn.getDate()
    );
  };

  const milestoneProgress = nextMilestone 
    ? ((currentStreak - previousMilestone) / (nextMilestone - previousMilestone)) * 100
    : 100;

  const circumference = 2 * Math.PI * 48;
  const progressOffset = circumference - (milestoneProgress / 100) * circumference;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="animate-fade-in space-y-6 text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin mx-auto"></div>
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-emerald-100 rounded-full animate-shimmer bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 bg-[length:200px_100%]"></div>
            <p className="text-emerald-600 font-medium">Loading SweetStreaks...</p>
          </div>
        </div>
      </div>
    );
  }

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
          className="flex items-center justify-between py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center shadow-glow">
                <span className="text-white text-xl">🍃</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white animate-pulse-slow"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">SweetStreaks</h1>
              <p className="text-sm text-foreground-muted">{getTimeBasedGreeting()}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onNavigate('settings')}
            className="rounded-2xl touch-feedback no-tap-highlight group"
          >
            <div className="w-11 h-11 premium-gradient rounded-2xl flex items-center justify-center shadow-premium scale-click">
              {user ? (
                <span className="text-white text-sm font-semibold">
                  {getInitials(user.name)}
                </span>
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
          </Button>
        </motion.div>

        {/* Premium Progress Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card premium className="p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-mint-100/30 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sage-100/40 to-emerald-100/20 rounded-full transform -translate-x-8 translate-y-8"></div>
            
            <div className="text-center space-y-6 relative z-10">
              {/* Enhanced Circular Progress */}
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="rgb(var(--color-emerald-100))"
                    strokeWidth="4"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgb(var(--color-emerald-400))" />
                      <stop offset="50%" stopColor="rgb(var(--color-mint-500))" />
                      <stop offset="100%" stopColor="rgb(var(--color-sage-400))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground mb-1">{currentStreak}</span>
                  <span className="text-sm text-foreground-muted font-medium">
                    {currentStreak === 1 ? 'day' : 'days'}
                  </span>
                  {currentStreak > 0 && (
                    <div className="flex items-center mt-1">
                      <Sparkles className="w-3 h-3 text-emerald-500 mr-1" />
                      <span className="text-xs text-emerald-600 font-medium">Active</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground leading-tight">{getPersonalizedGreeting()}</h2>
                
                {/* Streak Status Warning */}
                {streakStatus && streakStatus.status !== 'active' && (
                  <motion.div 
                    className={`text-sm font-medium ${getStreakStatusColor()} bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {getStreakStatusMessage()}
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <p className="text-foreground-muted">
                    You've been sugar-free since
                  </p>
                  <p className="text-emerald-600 font-semibold">
                    {startDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                  
                  <Button 
                    variant="ghost"
                    onClick={() => setShowDatePicker(true)}
                    className="text-lavender-600 touch-feedback no-tap-highlight text-sm mt-2"
                  >
                    Change Start Date
                  </Button>

                  {/* Quality Score with enhanced styling */}
                  {analytics && (
                    <motion.div 
                      className="flex items-center justify-center space-x-3 mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="text-sm text-foreground-muted">Quality:</span>
                      </div>
                      <span className={`text-sm font-bold ${
                        analytics.qualityScore >= 90 ? 'text-emerald-600' : 
                        analytics.qualityScore >= 80 ? 'text-warning' : 'text-peach-600'
                      }`}>
                        {analytics.qualityScore}%
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Premium Today's Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {hasCheckedInToday ? (
            <Card className="p-6 premium-gradient text-white rounded-2xl shadow-glow relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10 animate-pulse-slow"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-8 translate-y-8"></div>
              
              <div className="text-center space-y-4 relative z-10">
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold">
                    Well done{user ? `, ${user.name.split(' ')[0]}` : ''}! 🎉
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    You've already checked in today
                  </p>
                </div>
                <div className="glass-effect rounded-2xl p-4 mt-4 border border-white/20">
                  <p className="text-sm">
                    ✅ Checked in on {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                {/* Enhanced milestone celebration */}
                {[1, 3, 7, 14, 30, 50, 100, 365].includes(currentStreak) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button 
                      onClick={() => onNavigate('share')}
                      variant="glass"
                      className="w-full mt-4 text-white border-white/30 touch-feedback no-tap-highlight rounded-2xl backdrop-blur-sm"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share This Victory! 🎉
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          ) : (
            <Card premium className="p-6 rounded-2xl">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Today's Check-in{user ? `, ${user.name.split(' ')[0]}` : ''}
                  </h3>
                  <p className="text-foreground-muted mt-1">
                    How are you feeling today? Ready to stay strong?
                  </p>
                </div>
                <Button 
                  onClick={onCheckIn}
                  variant="premium"
                  size="lg"
                  className="w-full rounded-2xl shadow-glow button-premium no-tap-highlight"
                >
                  ✅ Yes! I stayed sugar-free today
                </Button>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Enhanced Next Milestone */}
        {nextMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="p-5 rounded-2xl card-interactive no-tap-highlight" premium>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-cream rounded-xl flex items-center justify-center shadow-premium">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-foreground">Next Milestone</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">🏆</span>
                  <p className="text-sm font-medium text-foreground-muted">
                    {nextMilestone - currentStreak} Days
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground-muted">Progress to {getMilestoneTitle(nextMilestone)}</span>
                  <span className="text-foreground font-medium">
                    {currentStreak}/{nextMilestone} days
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={(currentStreak / nextMilestone) * 100} 
                    className="h-3 bg-emerald-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-mint-500 rounded-full" 
                       style={{ width: `${(currentStreak / nextMilestone) * 100}%` }}></div>
                </div>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {nextMilestone - currentStreak} more days until your {getMilestoneTitle(nextMilestone)} milestone! 🎉
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Enhanced Active Challenges */}
        {activeChallenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Active Challenges</h3>
              <span className="text-lavender-600 text-sm font-medium">
                View more in Challenges tab
              </span>
            </div>
            
            {activeChallenges.map((challenge, index) => {
              const colorScheme = challengeColors[challenge.id as keyof typeof challengeColors] || 
                { bg: 'bg-mint-100', text: 'text-emerald-600', gradient: 'gradient-mint' };
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-5 rounded-2xl card-interactive no-tap-highlight" premium>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${colorScheme.bg} flex items-center justify-center shadow-premium`}>
                        <span className="text-xl">{challenge.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                        <p className="text-sm text-foreground-muted">
                          Day {challenge.currentDay} of {challenge.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${colorScheme.text}`}>
                          {challenge.duration - challenge.currentDay} days left
                        </span>
                      </div>
                    </div>
                    
                    {canCheckInChallenge(challenge) ? (
                      <Button 
                        onClick={() => onChallengeCheckIn?.(challenge.id)}
                        variant="premium"
                        size="sm"
                        className="w-full rounded-xl button-premium no-tap-highlight"
                      >
                        🎯 Day {challenge.currentDay + 1} – Crushing it, {user?.name.split(' ')[0] || 'champion'}!
                      </Button>
                    ) : (
                      <div className="w-full bg-emerald-50 text-emerald-600 rounded-xl py-3 text-center text-sm font-medium border border-emerald-100">
                        ✅ Checked in for today!
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Enhanced Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card glass className="p-6 rounded-2xl border-cream-200">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 gradient-cream rounded-2xl shadow-premium">
                <span className="text-2xl">🗄️</span>
              </div>
              <div>
                <h3 className="font-semibold text-cream-800">Coming Soon</h3>
                <p className="text-sm text-cream-700 mt-2 leading-relaxed">
                  Nutrition database with 1M+ foods to track sugar content
                </p>
              </div>
              <Button 
                variant="outline"
                size="sm"
                className="border-cream-300 text-cream-700 touch-feedback no-tap-highlight rounded-xl"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Date Picker Modal */}
      {showDatePicker && onDateChange && (
        <DatePicker
          currentDate={startDate}
          onDateChange={onDateChange}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}