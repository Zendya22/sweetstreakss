'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Share2, Upload, Copy, Award } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface UserData {
  name: string;
  email: string;
}

interface ShareProps {
  currentStreak: number;
  user?: UserData;
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

export default function Share({ currentStreak, user, analytics }: ShareProps) {
  const getMilestoneTitle = (days: number) => {
    if (days === 0) return "0 Days Strong";
    if (days === 1) return "First Step";
    if (days === 3) return "Momentum Builder";
    if (days === 7) return "Week Warrior";
    if (days === 14) return "Fortnight Fighter";
    if (days === 30) return "Monthly Master";
    if (days === 50) return "Halfway Hero";
    if (days === 100) return "Century Star";
    if (days >= 365) return "Yearly Legend";
    return `${days} Days Strong`;
  };

  const getMilestoneEmoji = (days: number) => {
    if (days === 0) return "⭐";
    if (days === 1) return "⭐";
    if (days === 3) return "🎯";
    if (days === 7) return "🚀";
    if (days === 14) return "💪";
    if (days === 30) return "👑";
    if (days === 50) return "💎";
    if (days === 100) return "🏆";
    if (days >= 365) return "🌟";
    return "🔥";
  };

  const getPersonalizedMessage = () => {
    const firstName = user?.name.split(' ')[0] || 'Welcome';
    
    if (currentStreak === 0) {
      return `${firstName} is 0 days strong on their sugar-free journey! 💪`;
    } else if (currentStreak === 1) {
      return `${firstName} just started their sugar-free journey! 🌱`;
    } else if (currentStreak < 7) {
      return `${firstName} is ${currentStreak} days strong on their sugar-free journey! 💪`;
    } else if (currentStreak === 7) {
      return `${firstName} completed their first week sugar-free! 🚀`;
    } else if (currentStreak === 30) {
      return `${firstName} achieved 30 days sugar-free! Amazing! 🌟`;
    } else if (currentStreak === 100) {
      return `${firstName} reached 100 days! What a legend! 💎`;
    } else if (currentStreak >= 365) {
      return `${firstName} has been sugar-free for a whole year! Incredible! 🏆`;
    } else {
      return `${firstName} is ${currentStreak} days strong on their sugar-free journey! 💪`;
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "Welcome Back!";
    const firstName = user.name.split(' ')[0];
    if (currentStreak === 0) return "Welcome Back!";
    return firstName;
  };

  const generateShareCard = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Set exact dimensions as requested: 600x800px
      canvas.width = 600;
      canvas.height = 800;
      
      // Main background gradient (mint/teal)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#a7f3d0');
      gradient.addColorStop(0.5, '#6ee7b7');
      gradient.addColorStop(1, '#34d399');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add decorative circles (as in the design)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      // Large circle top right
      ctx.beginPath();
      ctx.arc(canvas.width - 80, 120, 60, 0, 2 * Math.PI);
      ctx.fill();
      
      // Medium circle bottom left
      ctx.beginPath();
      ctx.arc(80, canvas.height - 150, 40, 0, 2 * Math.PI);
      ctx.fill();
      
      // Small circle center
      ctx.beginPath();
      ctx.arc(canvas.width / 2 + 50, canvas.height / 2, 25, 0, 2 * Math.PI);
      ctx.fill();
      
      // App logo pill at top
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.roundRect(canvas.width / 2 - 40, 100, 80, 36, 18);
      ctx.fill();
      
      // Leaf emoji in pill
      ctx.font = '20px system-ui';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('🍃', canvas.width / 2, 123);
      
      // Main emoji
      ctx.font = '60px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(getMilestoneEmoji(currentStreak), canvas.width / 2, 220);
      
      // Main streak number
      ctx.font = 'bold 80px system-ui';
      ctx.fillStyle = '#047857';
      ctx.fillText(`${currentStreak} Days`, canvas.width / 2, 320);
      
      // Subtitle
      ctx.font = '32px system-ui';
      ctx.fillStyle = '#059669';
      ctx.fillText(getMilestoneTitle(currentStreak), canvas.width / 2, 370);
      
      // Personalized message
      ctx.font = '18px system-ui';
      ctx.fillStyle = '#065f46';
      const message = getPersonalizedMessage();
      const words = message.split(' ');
      const lines = [];
      let currentLine = '';
      
      // Word wrap for message
      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 80 && currentLine !== '') {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine.trim());
      
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, 420 + (index * 25));
      });
      
      // User card background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.roundRect(canvas.width / 2 - 120, 480, 240, 80, 20);
      ctx.fill();
      
      // User name
      ctx.font = 'bold 22px system-ui';
      ctx.fillStyle = '#047857';
      ctx.fillText(getUserDisplayName(), canvas.width / 2, 510);
      
      // User subtitle
      ctx.font = '16px system-ui';
      ctx.fillStyle = '#059669';
      ctx.fillText('Sugar-Free Warrior ⚡', canvas.width / 2, 535);
      
      // App name
      ctx.font = 'bold 36px system-ui';
      ctx.fillStyle = '#047857';
      ctx.fillText('SweetStreaks', canvas.width / 2, 620);
      
      // Tagline
      ctx.font = '18px system-ui';
      ctx.fillStyle = '#065f46';
      ctx.fillText('Track • Challenge • Celebrate', canvas.width / 2, 650);
      
      // Date
      ctx.font = '16px system-ui';
      ctx.fillStyle = '#10b981';
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      ctx.fillText(dateStr, canvas.width / 2, 700);
      
      return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
      console.error('Error generating share card:', error);
      return null;
    }
  };

  const handleShareAchievement = async () => {
    try {
      const imageData = await generateShareCard();
      if (imageData) {
        const link = document.createElement('a');
        link.download = `sweetstreaks-${currentStreak}-days-achievement.png`;
        link.href = imageData;
        link.click();
        toast.success('🎉 Achievement card downloaded! Ready to share your victory!');
      }
    } catch (error) {
      toast.error('Failed to generate share card');
    }
  };

  const handleShareText = async () => {
    const shareText = `🎉 ${getPersonalizedMessage()} Check out my progress with SweetStreaks! 🍃✨ #SugarFree #HealthyHabits #SweetStreaks`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentStreak} Days Sugar-Free!`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
        navigator.clipboard.writeText(shareText);
        toast.success('Share text copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Share text copied to clipboard!');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success('SweetStreaks link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

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
          className="text-center py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Share Your Victory</h1>
          <p className="text-gray-600">
            {user ? `Celebrate your amazing achievement, ${user.name.split(' ')[0]}!` : 'Celebrate your amazing achievement!'}
          </p>
        </motion.div>

        {/* Share Card Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            {/* Card Preview - matches the design exactly */}
            <div className="relative overflow-hidden rounded-2xl" style={{
              background: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%)',
              aspectRatio: '3/4',
              padding: '32px',
              position: 'relative'
            }}>
              {/* Decorative circles */}
              <div className="absolute top-8 right-8 w-20 h-20 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-12 left-8 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 translate-x-6"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4 h-full">
                {/* App logo pill */}
                <div className="bg-emerald-700 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <span className="text-lg">🍃</span>
                </div>
                
                {/* Main emoji */}
                <div className="text-4xl">
                  {getMilestoneEmoji(currentStreak)}
                </div>
                
                {/* Main streak */}
                <div>
                  <div className="text-4xl font-bold text-emerald-800 mb-1">
                    {currentStreak} Days
                  </div>
                  <div className="text-xl font-semibold text-emerald-700 mb-3">
                    {getMilestoneTitle(currentStreak)}
                  </div>
                </div>
                
                {/* Personalized message */}
                <div className="text-sm text-emerald-600 leading-relaxed px-2">
                  {getPersonalizedMessage()}
                </div>
                
                {/* User card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-sm">
                  <div className="font-bold text-emerald-800">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-sm text-emerald-600">
                    Sugar-Free Warrior ⚡
                  </div>
                </div>
                
                {/* App branding */}
                <div className="space-y-2 mt-auto">
                  <div className="text-2xl font-bold text-emerald-800">
                    SweetStreaks
                  </div>
                  <div className="text-sm text-emerald-700">
                    Track • Challenge • Celebrate
                  </div>
                  <div className="text-xs text-teal-600">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Main Share Achievement Button */}
          <Button 
            onClick={handleShareAchievement}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Award className="w-5 h-5 mr-3" />
            Share Achievement
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleShareText}
              variant="outline"
              className="rounded-2xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 py-3 flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Share Text</span>
            </Button>
            
            <Button 
              onClick={handleCopyLink}
              variant="outline"
              className="rounded-2xl border-purple-200 text-purple-700 hover:bg-purple-50 py-3 flex items-center justify-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}