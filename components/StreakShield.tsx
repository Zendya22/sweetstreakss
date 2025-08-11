'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, Clock, AlertTriangle, CheckCircle2, Zap, Timer } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface StreakShieldProps {
  isVisible: boolean;
  shieldsRemaining: number;
  canUseShield: boolean;
  hoursUntilExpiry: number;
  streakDays: number;
  onUseShield: () => void;
  onClose: () => void;
  shieldCooldownHours?: number;
  missedCheckInHours?: number;
}

export default function StreakShield({
  isVisible,
  shieldsRemaining,
  canUseShield,
  hoursUntilExpiry,
  streakDays,
  onUseShield,
  onClose,
  shieldCooldownHours = 0,
  missedCheckInHours = 0
}: StreakShieldProps) {
  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return 'Expired';
    
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    const minutes = Math.floor((hours % 1) * 60);
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    } else if (remainingHours > 0) {
      return `${remainingHours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getUrgencyLevel = () => {
    if (hoursUntilExpiry <= 1) return 'critical';
    if (hoursUntilExpiry <= 6) return 'warning';
    return 'normal';
  };

  const getUrgencyColor = () => {
    const level = getUrgencyLevel();
    switch (level) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      default: return 'text-emerald-600';
    }
  };

  const getProgressColor = () => {
    const level = getUrgencyLevel();
    switch (level) {
      case 'critical': return 'from-error to-error/80';
      case 'warning': return 'from-warning to-warning/80';
      default: return 'from-emerald-400 to-emerald-600';
    }
  };

  const getShieldUsageWindow = () => {
    const windowHours = 48; // 48-hour usage window
    const elapsed = missedCheckInHours;
    const remaining = Math.max(0, windowHours - elapsed);
    return { total: windowHours, remaining };
  };

  const shieldWindow = getShieldUsageWindow();
  const windowProgress = ((shieldWindow.total - shieldWindow.remaining) / shieldWindow.total) * 100;

  const getReasonForUnavailability = () => {
    if (shieldsRemaining === 0) {
      return {
        title: 'No Shields Available',
        description: 'You\'ve used all 3 shields this month. Shields reset on the 1st of each month.',
        icon: <X className="w-5 h-5" />,
        color: 'text-error'
      };
    }
    
    if (shieldCooldownHours > 0) {
      const cooldownDays = Math.ceil(shieldCooldownHours / 24);
      return {
        title: 'Shield on Cooldown',
        description: `You must wait ${cooldownDays} day${cooldownDays > 1 ? 's' : ''} between shield uses.`,
        icon: <Timer className="w-5 h-5" />,
        color: 'text-warning'
      };
    }
    
    if (shieldWindow.remaining === 0) {
      return {
        title: 'Usage Window Expired',
        description: 'Shields must be used within 48 hours of missing a check-in.',
        icon: <Clock className="w-5 h-5" />,
        color: 'text-error'
      };
    }

    return null;
  };

  const unavailabilityReason = !canUseShield ? getReasonForUnavailability() : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card premium className="p-8 rounded-3xl shadow-premium-lg relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender-100/40 to-blush-100/20 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-mint-100/20 rounded-full transform -translate-x-12 translate-y-12"></div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 rounded-2xl hover:bg-background-secondary z-10"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="text-center space-y-6 relative z-10">
                {/* Header */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 gradient-lavender rounded-3xl shadow-glow">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Streak Shield
                    </h2>
                    <p className="text-foreground-muted">
                      Protect your {streakDays}-day streak
                    </p>
                  </div>
                </motion.div>

                {/* Shield Status */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Shields Available */}
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-foreground-muted">Shields Available:</span>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                            i < shieldsRemaining 
                              ? 'gradient-lavender shadow-glow' 
                              : 'bg-background-secondary opacity-50'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + (i * 0.1) }}
                        >
                          <Shield className={`w-3 h-3 ${
                            i < shieldsRemaining ? 'text-white' : 'text-foreground-muted'
                          }`} />
                        </motion.div>
                      ))}
                    </div>
                    <Badge className="bg-lavender-100 text-lavender-700 border-lavender-200">
                      {shieldsRemaining}/3
                    </Badge>
                  </div>

                  {/* Usage Window Progress */}
                  {missedCheckInHours > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground-muted">Shield Usage Window</span>
                        <span className={`font-medium ${windowProgress > 80 ? 'text-error' : 'text-foreground'}`}>
                          {formatTimeRemaining(shieldWindow.remaining)} left
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={windowProgress} className="h-2 bg-background-secondary" />
                        <div 
                          className={`absolute inset-0 bg-gradient-to-r ${
                            windowProgress > 80 ? 'from-error to-error/80' : 'from-lavender-400 to-lavender-600'
                          } rounded-full transition-all duration-300`}
                          style={{ width: `${windowProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-foreground-muted text-center">
                        48-hour window since missed check-in
                      </p>
                    </div>
                  )}

                  {/* Time Until Expiry */}
                  {hoursUntilExpiry > 0 && canUseShield && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className={`w-4 h-4 ${getUrgencyColor()}`} />
                        <span className="text-sm text-foreground-muted">Streak expires in:</span>
                        <span className={`font-bold ${getUrgencyColor()}`}>
                          {formatTimeRemaining(hoursUntilExpiry)}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <Progress 
                          value={(hoursUntilExpiry / 26) * 100} 
                          className="h-3 bg-background-secondary" 
                        />
                        <div 
                          className={`absolute inset-0 bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-300`}
                          style={{ width: `${(hoursUntilExpiry / 26) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Action Section */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {canUseShield ? (
                    <div className="space-y-4">
                      <div className="p-4 glass-effect rounded-2xl border border-white/30 space-y-2">
                        <div className="flex items-center space-x-2 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Shield Ready</span>
                        </div>
                        <p className="text-xs text-emerald-600 leading-relaxed">
                          Using a shield will preserve your {streakDays}-day streak as if you checked in on time.
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="flex-1 rounded-2xl border-border hover:bg-background-secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="premium"
                          onClick={onUseShield}
                          className="flex-1 rounded-2xl shadow-glow hover:shadow-glow-strong"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Use Shield
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {unavailabilityReason && (
                        <div className="p-4 bg-background-secondary rounded-2xl space-y-3">
                          <div className={`flex items-center space-x-2 ${unavailabilityReason.color}`}>
                            {unavailabilityReason.icon}
                            <span className="font-medium">{unavailabilityReason.title}</span>
                          </div>
                          <p className="text-sm text-foreground-muted leading-relaxed">
                            {unavailabilityReason.description}
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="p-4 bg-peach-50 border border-peach-200 rounded-2xl">
                          <div className="flex items-center space-x-2 text-peach-700 mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-medium">Alternative Options</span>
                          </div>
                          <p className="text-xs text-peach-600 leading-relaxed">
                            Visit Settings → Streak Shields to request manual recovery for technical issues.
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="w-full rounded-2xl"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Shield Rules Reminder */}
                <motion.div
                  className="pt-4 border-t border-border/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Shield Rules</h4>
                    <div className="text-xs text-foreground-muted space-y-1 text-left">
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                        <span>3 shields per month maximum</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                        <span>48-hour usage window after missed check-in</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                        <span>7-day cooldown between uses</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}