'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  MapPin, 
  LogOut, 
  Shield, 
  Calendar,
  Award,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Upload,
  FileText,
  Camera,
  Bug,
  HelpCircle,
  ShieldCheck,
  Timer,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface UserData {
  name: string;
  email: string;
  timezone?: string;
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
  shieldsUsedThisMonth: number;
  nextShieldAvailable?: Date;
  monthlyPerformance: { month: string; checkIns: number; quality: number }[];
  shieldUsageHistory: {
    date: Date;
    reason: string;
    dayRecovered: number;
  }[];
}

interface SettingsProps {
  user: UserData;
  onLogout: () => void;
  onUpdateProfile: (userData: UserData) => void;
  onNavigateBack: () => void;
  currentStreak: number;
  totalDays: number;
  startDate: Date;
  completedChallenges: number;
  analytics: StreakAnalytics;
}

interface ManualRecoveryFormData {
  issueType: 'technical' | 'bug' | 'app_crash';
  description: string;
  missedDate: string;
  evidenceFile?: File;
}

export default function Settings({ 
  user, 
  onLogout, 
  onUpdateProfile,
  onNavigateBack,
  currentStreak,
  totalDays,
  startDate,
  completedChallenges,
  analytics
}: SettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showManualRecovery, setShowManualRecovery] = useState(false);
  const [recoveryForm, setRecoveryForm] = useState<ManualRecoveryFormData>({
    issueType: 'technical',
    description: '',
    missedDate: '',
  });

  const handleSave = () => {
    onUpdateProfile(editedUser);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleManualRecoverySubmit = () => {
    if (!recoveryForm.description.trim() || !recoveryForm.missedDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const missedDate = new Date(recoveryForm.missedDate);
    const now = new Date();
    const hoursSinceMissed = (now.getTime() - missedDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceMissed > 72) {
      toast.error('Manual recovery requests must be submitted within 72 hours');
      return;
    }

    // In a real app, this would submit to the server
    toast.success('Recovery request submitted! Our team will review it within 24 hours.');
    setShowManualRecovery(false);
    setRecoveryForm({
      issueType: 'technical',
      description: '',
      missedDate: '',
    });
  };

  const getShieldStatusColor = () => {
    if (analytics.shieldsRemaining === 0) return 'text-error';
    if (analytics.shieldsRemaining === 1) return 'text-warning';
    return 'text-success';
  };

  const getShieldStatusIcon = () => {
    if (analytics.shieldsRemaining === 0) return <XCircle className="w-5 h-5 text-error" />;
    if (analytics.shieldsRemaining === 1) return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <ShieldCheck className="w-5 h-5 text-success" />;
  };

  const formatTimeUntilNextShield = () => {
    if (!analytics.nextShieldAvailable) return 'Available now';
    
    const now = new Date();
    const timeDiff = analytics.nextShieldAvailable.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Available now';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours}h`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const shieldProgressPercentage = (analytics.shieldsRemaining / 3) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <motion.div 
        className="max-w-md mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Premium Header */}
        <motion.div 
          className="flex items-center space-x-4 py-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onNavigateBack}
            className="rounded-2xl hover:bg-primary-soft transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-foreground-muted">Manage your profile and preferences</p>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card premium className="p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100/40 to-mint-100/20 rounded-full transform translate-x-12 -translate-y-12"></div>
            
            <CardHeader className="p-0 mb-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 premium-gradient rounded-3xl flex items-center justify-center shadow-glow">
                  <span className="text-white text-xl font-bold">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">
                    {user.name}
                  </h3>
                  <p className="text-foreground-muted">{user.email}</p>
                </div>
                <Button
                  variant={isEditing ? "premium" : "outline"}
                  size="sm"
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="rounded-xl"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </div>
            </CardHeader>

            {isEditing ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
                    <Input
                      value={editedUser.name}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10 rounded-xl"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
                    <Input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 rounded-xl"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Timezone</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
                    <Input
                      value={editedUser.timezone || 'UTC'}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, timezone: e.target.value }))}
                      className="pl-10 rounded-xl"
                      placeholder="Your timezone"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="premium"
                    size="sm"
                    onClick={handleSave}
                    className="flex-1 rounded-xl"
                  >
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-foreground-muted" />
                  <span className="text-foreground-muted">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-foreground-muted" />
                  <span className="text-foreground-muted">{user.timezone || 'UTC'}</span>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Streak Shield Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card premium className="p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-lavender-100/30 to-blush-100/20 rounded-full transform translate-x-14 -translate-y-14"></div>
            
            <CardHeader className="p-0 mb-6 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-lavender rounded-2xl flex items-center justify-center shadow-premium">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Streak Shields</CardTitle>
                  <CardDescription>Protect your streak when life happens</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
              {/* Shield Status Overview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getShieldStatusIcon()}
                    <span className="font-medium text-foreground">Shield Status</span>
                  </div>
                  <Badge 
                    className={`${getShieldStatusColor()} bg-transparent border-current`}
                  >
                    {analytics.shieldsRemaining}/3 Available
                  </Badge>
                </div>

                {/* Visual Shield Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">This Month's Shields</span>
                    <span className="font-medium text-foreground">
                      {analytics.shieldsUsedThisMonth}/3 Used
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={shieldProgressPercentage} className="h-3 bg-lavender-100" />
                    <div className="absolute inset-0 bg-gradient-to-r from-lavender-400 to-blush-400 rounded-full" 
                         style={{ width: `${shieldProgressPercentage}%` }}></div>
                  </div>
                  
                  {/* Shield Icons Visual */}
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          i < analytics.shieldsRemaining 
                            ? 'gradient-lavender shadow-glow' 
                            : 'bg-background-secondary opacity-50'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                      >
                        <Shield className={`w-4 h-4 ${
                          i < analytics.shieldsRemaining ? 'text-white' : 'text-foreground-muted'
                        }`} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Next Shield Availability */}
                {analytics.nextShieldAvailable && (
                  <div className="p-4 glass-effect rounded-2xl border border-white/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Timer className="w-4 h-4 text-lavender-600" />
                      <span className="text-sm font-medium text-lavender-800">Next Shield Available</span>
                    </div>
                    <p className="text-lavender-700 font-semibold">
                      {formatTimeUntilNextShield()}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Shield Usage Rules */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">How Shields Work</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-foreground-secondary font-medium">3 shields per month</p>
                      <p className="text-xs text-foreground-muted">Automatically reset on the 1st of each month</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-foreground-secondary font-medium">48-hour usage window</p>
                      <p className="text-xs text-foreground-muted">Use within 48 hours of missing a check-in</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-foreground-secondary font-medium">7-day cooldown</p>
                      <p className="text-xs text-foreground-muted">Wait 7 days between shield uses</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shield Usage History */}
              {analytics.shieldUsageHistory.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Recent Shield Usage</h4>
                  <div className="space-y-3">
                    {analytics.shieldUsageHistory.slice(-3).map((usage, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 bg-background-secondary rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 gradient-lavender rounded-xl flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{usage.reason}</p>
                            <p className="text-xs text-foreground-muted">
                              {usage.date.toLocaleDateString()} • Day {usage.dayRecovered}
                            </p>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Recovery Section */}
              <div className="space-y-4">
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-peach-600" />
                    <h4 className="font-semibold text-foreground">Technical Issues?</h4>
                  </div>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    If you experienced app bugs or technical problems that prevented check-in, 
                    you can request manual recovery within 72 hours.
                  </p>
                  
                  <Dialog open={showManualRecovery} onOpenChange={setShowManualRecovery}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-peach-300 text-peach-700 hover:bg-peach-50 rounded-xl"
                      >
                        <Bug className="w-4 h-4 mr-2" />
                        Request Manual Recovery
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <RotateCcw className="w-5 h-5 text-peach-600" />
                          <span>Manual Recovery Request</span>
                        </DialogTitle>
                        <DialogDescription>
                          Submit evidence of technical issues for manual streak recovery
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Issue Type</label>
                          <Select 
                            value={recoveryForm.issueType} 
                            onValueChange={(value: 'technical' | 'bug' | 'app_crash') => 
                              setRecoveryForm(prev => ({ ...prev, issueType: value }))
                            }
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">Technical Issue</SelectItem>
                              <SelectItem value="bug">App Bug</SelectItem>
                              <SelectItem value="app_crash">App Crash</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Missed Date</label>
                          <Input
                            type="date"
                            value={recoveryForm.missedDate}
                            onChange={(e) => setRecoveryForm(prev => ({ ...prev, missedDate: e.target.value }))}
                            className="rounded-xl"
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            value={recoveryForm.description}
                            onChange={(e) => setRecoveryForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the technical issue in detail..."
                            className="rounded-xl min-h-[100px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Evidence (Optional)</label>
                          <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                            <Upload className="w-6 h-6 mx-auto text-foreground-muted mb-2" />
                            <p className="text-sm text-foreground-muted">
                              Upload screenshots or error logs
                            </p>
                            <Input
                              type="file"
                              accept="image/*,.txt,.log"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setRecoveryForm(prev => ({ ...prev, evidenceFile: file }));
                                }
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowManualRecovery(false)}
                            className="flex-1 rounded-xl"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="premium"
                            onClick={handleManualRecoverySubmit}
                            className="flex-1 rounded-xl"
                          >
                            Submit Request
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card premium className="p-6">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-emerald rounded-2xl flex items-center justify-center shadow-premium">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Your Journey</CardTitle>
                  <CardDescription>Track your progress and achievements</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-foreground-muted">Current Streak</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{currentStreak}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-sky-600" />
                    <span className="text-sm text-foreground-muted">Total Days</span>
                  </div>
                  <p className="text-2xl font-bold text-sky-600">{totalDays}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-lavender-600" />
                    <span className="text-sm text-foreground-muted">Challenges</span>
                  </div>
                  <p className="text-2xl font-bold text-lavender-600">{completedChallenges}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-peach-600" />
                    <span className="text-sm text-foreground-muted">Since</span>
                  </div>
                  <p className="text-sm font-semibold text-peach-600">
                    {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button 
            variant="outline"
            onClick={onLogout}
            className="w-full border-error text-error hover:bg-error hover:text-white rounded-2xl py-3 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}