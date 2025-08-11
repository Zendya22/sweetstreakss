'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Shield, 
  Calendar,
  BarChart3,
  Zap,
  Star,
  Home,
  Trophy,
  Share2
} from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface StreakAnalyticsProps {
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

export default function StreakAnalytics({ analytics }: StreakAnalyticsProps) {
  const getQualityColor = (score: number) => {
    if (score >= 95) return 'text-emerald-600';
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 95) return { text: 'Excellent', color: 'bg-emerald-100 text-emerald-700' };
    if (score >= 85) return { text: 'Great', color: 'bg-green-100 text-green-700' };
    if (score >= 75) return { text: 'Good', color: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Improving', color: 'bg-orange-100 text-orange-700' };
  };

  const qualityBadge = getQualityBadge(analytics.qualityScore);

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <motion.div 
        className="max-w-md mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
          <p className="text-gray-600">Detailed insights into your progress</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{analytics.currentStreak}</p>
                  <p className="text-sm text-emerald-600">Current Streak</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">{analytics.longestStreak}</p>
                  <p className="text-sm text-purple-600">Longest Streak</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quality Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-gray-800">Quality Score</span>
                </div>
                <Badge className={qualityBadge.color}>
                  {qualityBadge.text}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-3xl font-bold ${getQualityColor(analytics.qualityScore)}`}>
                    {analytics.qualityScore}%
                  </span>
                  <span className="text-sm text-gray-600">
                    Based on check-in timing
                  </span>
                </div>
                <Progress 
                  value={analytics.qualityScore} 
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">{analytics.perfectDays}</p>
                  <p className="text-xs text-gray-600">Perfect Days</p>
                  <p className="text-xs text-emerald-600">100% quality</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-yellow-600">{analytics.graceDays}</p>
                  <p className="text-xs text-gray-600">Grace Period</p>
                  <p className="text-xs text-yellow-600">90% quality</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{analytics.shieldDays}</p>
                  <p className="text-xs text-gray-600">Shield Saves</p>
                  <p className="text-xs text-purple-600">80% quality</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-800">Consistency</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-blue-600">
                    {analytics.consistencyPercentage}%
                  </span>
                  <span className="text-sm text-gray-600">
                    {analytics.totalCheckIns} total check-ins
                  </span>
                </div>
                <Progress 
                  value={analytics.consistencyPercentage} 
                  className="h-3"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Shield Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-cyan-800">Streak Shields</p>
                  <p className="text-sm text-cyan-600">Protection available</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-cyan-700">{analytics.shieldsRemaining}</p>
                <p className="text-sm text-cyan-600">remaining</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Monthly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-gray-800">Monthly Performance</span>
              </div>
              
              <div className="space-y-3">
                {analytics.monthlyPerformance.map((month, index) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">{month.checkIns} check-ins</span>
                        <Badge 
                          className={
                            month.quality >= 90 ? 'bg-emerald-100 text-emerald-700' :
                            month.quality >= 80 ? 'bg-green-100 text-green-700' :
                            month.quality >= 70 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-orange-100 text-orange-700'
                          }
                        >
                          {month.quality}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={month.quality} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Achievements Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Keep Going!</h3>
                <p className="text-sm text-amber-700">
                  Your consistency is building something amazing. Every day counts!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Bottom Navigation */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="max-w-md mx-auto flex justify-around">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="flex flex-col items-center space-y-1 text-gray-500 hover:text-emerald-600"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('challenges')}
              className="flex flex-col items-center space-y-1 text-gray-500 hover:text-emerald-600"
            >
              <Target className="w-5 h-5" />
              <span className="text-xs">Challenges</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('milestones')}
              className="flex flex-col items-center space-y-1 text-gray-500 hover:text-emerald-600"
            >
              <Trophy className="w-5 h-5" />
              <span className="text-xs">Milestones</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('analytics')}
              className="flex flex-col items-center space-y-1 text-emerald-600"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('share')}
              className="flex flex-col items-center space-y-1 text-gray-500 hover:text-emerald-600"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}