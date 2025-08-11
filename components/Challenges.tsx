'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Target, Clock, CheckCircle2, Plus, Trophy, Home, Share2, BarChart3 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  currentDay: number;
  isActive: boolean;
  isCompleted: boolean;
  startDate?: Date;
  lastCheckIn?: Date;
  emoji: string;
  color: string;
}

interface ChallengesProps {
  challenges?: Challenge[];
  onChallengesUpdate?: (challenges: Challenge[]) => void;
  user?: {
    name: string;
    email: string;
  };
}

export default function Challenges({ challenges = [], onChallengesUpdate, user }: ChallengesProps) {
  const availableChallenges = [
    {
      id: 'no-sugar-drinks',
      title: '7 Days No Sugary Drinks',
      description: 'Cut out all sugary beverages including juices',
      duration: 7,
      emoji: '🧃',
      color: 'gradient-lavender',
    },
    {
      id: 'home-cooked',
      title: '30 Days Home Cooked Meals',
      description: 'Eat only home-prepared meals for a month',
      duration: 30,
      emoji: '🏠',
      color: 'gradient-sage',
    },
    {
      id: 'no-processed',
      title: '14 Days No Processed Foods',
      description: 'Avoid all packaged and processed foods',
      duration: 14,
      emoji: '📦',
      color: 'gradient-blush',
    },
    {
      id: 'no-maida',
      title: '21 Days No Refined Flour',
      description: 'Stay away from refined flour (maida) products',
      duration: 21,
      emoji: '🍞',
      color: 'gradient-cream',
    },
    {
      id: 'no-soda',
      title: '10 Days No Soda',
      description: 'Cut out all sodas and fizzy drinks',
      duration: 10,
      emoji: '🥤',
      color: 'gradient-sky',
    },
    {
      id: 'no-fast-food',
      title: '14 Days No Fast Food',
      description: 'Avoid all fast food restaurants and takeaways',
      duration: 14,
      emoji: '🍔',
      color: 'gradient-peach',
    },
  ];

  // Pastel color mapping for challenge cards
  const challengeColorMap = {
    'no-soda': { bg: 'bg-sky/20', border: 'border-sky/30', text: 'text-sky-dark' },
    'no-fast-food': { bg: 'bg-peach/20', border: 'border-peach/30', text: 'text-peach-dark' },
    'no-sugar-drinks': { bg: 'bg-lavender/20', border: 'border-lavender/30', text: 'text-lavender-dark' },
    'home-cooked': { bg: 'bg-sage/20', border: 'border-sage/30', text: 'text-sage-dark' },
    'no-processed': { bg: 'bg-blush/20', border: 'border-blush/30', text: 'text-blush-dark' },
    'no-maida': { bg: 'bg-cream/20', border: 'border-cream/30', text: 'text-cream-dark' },
  };

  const startChallenge = (challengeTemplate: any) => {
    const newChallenge: Challenge = {
      ...challengeTemplate,
      currentDay: 0,
      isActive: true,
      isCompleted: false,
      startDate: new Date(),
    };
    
    const updatedChallenges = [...challenges, newChallenge];
    onChallengesUpdate?.(updatedChallenges);
  };

  // Helper function to safely format date
  const formatStartDate = (startDate?: Date) => {
    if (!startDate) return 'Unknown';
    
    // Ensure startDate is a Date object
    const date = startDate instanceof Date ? startDate : new Date(startDate);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Unknown';
    
    return date.toLocaleDateString();
  };

  const activeChallenges = challenges.filter(c => c.isActive);
  const completedChallenges = challenges.filter(c => c.isCompleted);
  
  // Filter out challenges that are already started or completed
  const availableChallengesList = availableChallenges.filter(
    available => !challenges.find(existing => existing.id === available.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <motion.div 
        className="max-w-md mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-gray-800">🎯 Challenges</h1>
          <p className="text-gray-600 mt-1">
            {user ? `Ready for a challenge, ${user.name.split(' ')[0]}?` : 'Take on focused healthy goals!'}
          </p>
        </motion.div>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-gray-800">Active Challenges</h3>
            
            {activeChallenges.map((challenge) => {
              const colorScheme = challengeColorMap[challenge.id as keyof typeof challengeColorMap] || 
                { bg: 'bg-mint-light/20', border: 'border-mint/30', text: 'text-emerald-600' };
              
              return (
                <Card key={challenge.id} className={`p-6 bg-white shadow-sm rounded-2xl border-gray-100`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full ${colorScheme.bg} ${colorScheme.border} border flex items-center justify-center shadow-sm`}>
                          <span className="text-xl">{challenge.emoji}</span>
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-800">{challenge.title}</h2>
                          <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">
                            Active Challenge
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-800">
                          {challenge.currentDay} / {challenge.duration} days
                        </span>
                      </div>
                      <Progress 
                        value={(challenge.currentDay / challenge.duration) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Started {formatStartDate(challenge.startDate)}
                    </p>
                  </div>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Completed Challenges</span>
            </h3>
            
            {completedChallenges.map((challenge) => {
              const colorScheme = challengeColorMap[challenge.id as keyof typeof challengeColorMap] || 
                { bg: 'bg-mint-light/20', border: 'border-mint/30', text: 'text-emerald-600' };
              
              return (
                <Card key={challenge.id} className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-sm rounded-xl border-emerald-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${colorScheme.bg} ${colorScheme.border} border flex items-center justify-center shadow-sm`}>
                      <span className="text-lg">{challenge.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                      <p className="text-sm text-emerald-600">✅ Completed! Amazing work!</p>
                    </div>
                    <Badge className="bg-emerald-200 text-emerald-800 text-xs">
                      Done
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Available Challenges */}
        {availableChallengesList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              <span>Start a New Challenge</span>
            </h3>
            
            {availableChallengesList.map((challenge, index) => {
              const colorScheme = challengeColorMap[challenge.id as keyof typeof challengeColorMap] || 
                { bg: 'bg-mint-light/20', border: 'border-mint/30', text: 'text-emerald-600' };
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-4 bg-white shadow-sm rounded-xl border-gray-100 hover:scale-105 transition-transform">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${colorScheme.bg} ${colorScheme.border} border flex items-center justify-center shadow-sm`}>
                        <span className="text-lg">{challenge.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{challenge.duration} days</span>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => startChallenge(challenge)}
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      >
                        Start
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* No challenges message */}
        {challenges.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 bg-white shadow-sm rounded-2xl text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Ready for a Challenge{user ? `, ${user.name.split(' ')[0]}` : ''}?
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    Start your first challenge to build specific healthy habits!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Motivation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-beige shadow-sm rounded-2xl">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-amber-800">
                💪 Challenge Yourself!
              </h3>
              <p className="text-sm text-amber-700">
                Focused challenges help build specific healthy habits{user ? `, ${user.name.split(' ')[0]}` : ''}. Remember: missing a day resets your progress, so stay consistent!
              </p>
            </div>
          </Card>
        </motion.div>


      </motion.div>
    </div>
  );
}