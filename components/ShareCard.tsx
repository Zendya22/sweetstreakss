'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Download, Copy, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface ShareCardProps {
  currentStreak: number;
  milestoneTitle: string;
  userName: string;
  achievementDate: Date;
  qualityScore: number;
  consistencyPercentage: number;
}

export default function ShareCard({ 
  currentStreak, 
  milestoneTitle, 
  userName, 
  achievementDate,
  qualityScore,
  consistencyPercentage 
}: ShareCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

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
    const firstName = userName.split(' ')[0] || 'Champion';
    
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

  const generateShareCard = async () => {
    setIsGenerating(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Set dimensions to 600x800px as requested
      canvas.width = 600;
      canvas.height = 800;
      
      // Add roundRect polyfill for older browsers
      if (!ctx.roundRect) {
        ctx.roundRect = function(x: number, y: number, width: number, height: number, radius: number) {
          this.beginPath();
          this.moveTo(x + radius, y);
          this.lineTo(x + width - radius, y);
          this.quadraticCurveTo(x + width, y, x + width, y + radius);
          this.lineTo(x + width, y + height - radius);
          this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          this.lineTo(x + radius, y + height);
          this.quadraticCurveTo(x, y + height, x, y + height - radius);
          this.lineTo(x, y + radius);
          this.quadraticCurveTo(x, y, x + radius, y);
          this.closePath();
        };
      }
      
      // Main background gradient (mint/teal)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#a7f3d0');
      gradient.addColorStop(0.5, '#6ee7b7');
      gradient.addColorStop(1, '#34d399');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add decorative circles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(canvas.width - 80, 120, 60, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(80, canvas.height - 150, 40, 0, 2 * Math.PI);
      ctx.fill();
      
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
      ctx.fillText(getMilestoneEmoji(currentStreak), canvas.width / 2, 220);
      
      // Main streak number
      ctx.font = 'bold 80px system-ui';
      ctx.fillStyle = '#047857';
      ctx.fillText(`${currentStreak} Days`, canvas.width / 2, 320);
      
      // Subtitle
      ctx.font = '32px system-ui';
      ctx.fillStyle = '#059669';
      ctx.fillText(milestoneTitle, canvas.width / 2, 370);
      
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
      const firstName = userName.split(' ')[0];
      ctx.fillText(firstName, canvas.width / 2, 510);
      
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
      const dateStr = achievementDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      ctx.fillText(dateStr, canvas.width / 2, 700);
      
      return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
      console.error('Error generating share card:', error);
      toast.error('Failed to generate share card');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const imageData = await generateShareCard();
    if (imageData) {
      const link = document.createElement('a');
      link.download = `sweetstreaks-${currentStreak}-days-${milestoneTitle.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = imageData;
      link.click();
      toast.success('🎉 Achievement card downloaded! Ready to celebrate your win!');
    }
  };

  const handleCopyLink = () => {
    const shareText = `🎉 ${getPersonalizedMessage()} Check out my progress with SweetStreaks! 🍃✨ #SugarFree #HealthyHabits #SweetStreaks`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success('Share text copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const handleShare = async () => {
    const shareText = `🎉 ${getPersonalizedMessage()} Check out my progress with SweetStreaks! 🍃✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentStreak} Days Sugar-Free!`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white shadow-lg rounded-3xl border-gray-100 overflow-hidden relative">
        <div className="space-y-6">
          {/* Preview of the share card matching new design */}
          <div className="relative overflow-hidden rounded-2xl" style={{
            background: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%)',
            aspectRatio: '3/4',
            padding: '24px'
          }}>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-8 left-4 w-8 h-8 bg-white/10 rounded-full"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-3 h-full">
              {/* App logo pill */}
              <div className="bg-emerald-700 text-white px-3 py-1 rounded-full">
                <span className="text-sm">🍃</span>
              </div>
              
              {/* Main content */}
              <div className="text-2xl">{getMilestoneEmoji(currentStreak)}</div>
              <div className="text-2xl font-bold text-emerald-800">{currentStreak} Days</div>
              <div className="text-lg font-semibold text-emerald-700">{milestoneTitle}</div>
              <div className="text-xs text-emerald-600 px-2 leading-relaxed">
                {getPersonalizedMessage()}
              </div>
              
              {/* User card */}
              <div className="bg-white/90 rounded-xl px-4 py-2">
                <div className="font-bold text-emerald-800 text-sm">
                  {userName.split(' ')[0]}
                </div>
                <div className="text-xs text-emerald-600">Sugar-Free Warrior ⚡</div>
              </div>
              
              {/* App branding */}
              <div className="mt-auto space-y-1">
                <div className="text-lg font-bold text-emerald-800">SweetStreaks</div>
                <div className="text-xs text-emerald-700">Track • Challenge • Celebrate</div>
                <div className="text-xs text-teal-600">
                  {achievementDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Share actions */}
          <div className="space-y-3">
            <Button 
              onClick={handleShare}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-3 transition-all duration-200 hover:scale-105"
              disabled={isGenerating}
            >
              <Award className="w-4 h-4 mr-2" />
              Share Achievement
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={handleCopyLink}
                className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                disabled={isGenerating}
              >
                <Copy className="w-4 h-4 mr-2" />
                Share Text
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleDownload}
                className="rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50"
                disabled={isGenerating}
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? 'Creating...' : 'Download'}
              </Button>
            </div>
          </div>

          {/* Achievement details */}
          <div className="bg-emerald-50 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-700">Quality Score</span>
              <Badge className="bg-emerald-100 text-emerald-800">{qualityScore}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-700">Consistency</span>
              <Badge className="bg-emerald-100 text-emerald-800">{consistencyPercentage}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-700">Achieved</span>
              <span className="text-sm font-medium text-emerald-800">
                {achievementDate.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}