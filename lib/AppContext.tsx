'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { StreakManager, StreakData, StreakStatus } from '../components/StreakManager';
import { supabase } from './supabaseClient';
import { toast } from 'sonner@2.0.3';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  currentDay: number;
  isActive: boolean;
  isCompleted: boolean;
  startDate?: Date;
  lastCheckIn?: Date;
  emoji: string;
  color: string;
}

interface UserData {
  name: string;
  email: string;
  timezone?: string;
}

interface AppState {
  streakData: StreakData;
  challenges: Challenge[];
  user?: UserData;
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  showSplash: boolean;
  showStreakShield: boolean;
  mounted: boolean;
}

interface AppContextType {
  appState: AppState;
  streakStatus: StreakStatus;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  handleCheckIn: () => void;
  handleUseStreakShield: () => void;
  handleChallengeCheckIn: (challengeId: string) => void;
  handleDateChange: (newDate: Date) => void;
  handleChallengeUpdate: (challenges: Challenge[]) => void;
  handleSplashComplete: () => void;
  handleOnboardingComplete: () => void;
  handleUpdateProfile: (userData: UserData) => void;
  hasCheckedInToday: () => boolean;
  activeChallenges: Challenge[];
  completedChallenges: number;
  analytics: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
  user?: User;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, user }) => {
  const [appState, setAppState] = useState<AppState>({
    streakData: {
      currentStreak: 0,
      longestStreak: 0,
      lastCheckIn: null,
      startDate: new Date(),
      totalCheckIns: 0,
      streakShields: [],
      streakHistory: [],
      qualityScore: 100,
      consistencyPercentage: 100,
      monthlyShieldResets: {}
    },
    challenges: [],
    hasCompletedOnboarding: false,
    isAuthenticated: !!user,
    showSplash: !user,
    showStreakShield: false,
    mounted: false,
  });

  const [streakStatus, setStreakStatus] = useState<StreakStatus>({
    status: 'active',
    hoursRemaining: 24,
    canUseShield: false,
    nextNotification: null
  });

  // Convert Supabase user to UserData
  useEffect(() => {
    if (user) {
      const userData: UserData = {
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        timezone: user.user_metadata?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      setAppState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: true,
        showSplash: false
      }));
    }
  }, [user]);

  // Load data from localStorage and set up app
  useEffect(() => {
    const initializeApp = async () => {
      setAppState(prev => ({ ...prev, mounted: true }));
      
      const saved = localStorage.getItem('sweetStreaksApp');
      if (saved && user) {
        try {
          const parsed = JSON.parse(saved);
          
          const streakData: StreakData = {
            ...parsed.streakData,
            startDate: new Date(parsed.streakData.startDate),
            lastCheckIn: parsed.streakData.lastCheckIn ? new Date(parsed.streakData.lastCheckIn) : null,
            streakShields: (parsed.streakData.streakShields || []).map((shield: any) => ({
              ...shield,
              usedAt: new Date(shield.usedAt),
              recoveredDay: new Date(shield.recoveredDay),
              cooldownUntil: new Date(shield.cooldownUntil)
            })),
            streakHistory: (parsed.streakData.streakHistory || []).map((entry: any) => ({
              ...entry,
              date: new Date(entry.date),
              checkInTime: new Date(entry.checkInTime)
            })),
            monthlyShieldResets: parsed.streakData.monthlyShieldResets || {}
          };
          
          const challengesWithDates = parsed.challenges ? parsed.challenges.map((challenge: any) => ({
            ...challenge,
            startDate: challenge.startDate ? new Date(challenge.startDate) : undefined,
            lastCheckIn: challenge.lastCheckIn ? new Date(challenge.lastCheckIn) : undefined,
          })) : [];
          
          setAppState(prev => ({
            ...prev,
            streakData,
            challenges: challengesWithDates,
            hasCompletedOnboarding: parsed.hasCompletedOnboarding || false,
          }));

          const status = StreakManager.getStreakStatus(streakData);
          setStreakStatus(status);
          checkAndResetMissedChallenges(challengesWithDates);
          checkMonthlyShieldReset(streakData);
          scheduleNotifications(streakData);
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
    };

    initializeApp();
  }, [user]);

  // Save data to localStorage
  useEffect(() => {
    if (appState.mounted && appState.isAuthenticated) {
      const dataToSave = {
        ...appState,
        streakData: {
          ...appState.streakData,
          startDate: appState.streakData.startDate.toISOString(),
          lastCheckIn: appState.streakData.lastCheckIn?.toISOString(),
          streakShields: appState.streakData.streakShields.map(shield => ({
            ...shield,
            usedAt: shield.usedAt.toISOString(),
            recoveredDay: shield.recoveredDay.toISOString(),
            cooldownUntil: shield.cooldownUntil.toISOString()
          })),
          streakHistory: appState.streakData.streakHistory.map(entry => ({
            ...entry,
            date: entry.date.toISOString(),
            checkInTime: entry.checkInTime.toISOString()
          }))
        },
        challenges: appState.challenges.map(challenge => ({
          ...challenge,
          startDate: challenge.startDate?.toISOString(),
          lastCheckIn: challenge.lastCheckIn?.toISOString(),
        })),
      };
      
      localStorage.setItem('sweetStreaksApp', JSON.stringify(dataToSave));
    }
  }, [appState]);

  // Monitor streak status
  useEffect(() => {
    if (!appState.isAuthenticated) return;

    const interval = setInterval(() => {
      const userTimezone = appState.user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const status = StreakManager.getStreakStatus(appState.streakData, userTimezone);
      setStreakStatus(status);
      
      if (status.status === 'critical' && status.canUseShield && !appState.showStreakShield) {
        setAppState(prev => ({ ...prev, showStreakShield: true }));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [appState.streakData, appState.showStreakShield, appState.user?.timezone, appState.isAuthenticated]);

  const checkMonthlyShieldReset = (streakData: StreakData) => {
    const now = new Date();
    const currentMonthKey = StreakManager.getMonthKey(now);
    
    if (!streakData.monthlyShieldResets[currentMonthKey]) {
      const updatedStreakData = {
        ...streakData,
        monthlyShieldResets: {
          ...streakData.monthlyShieldResets,
          [currentMonthKey]: now.toISOString()
        }
      };
      
      setAppState(prev => ({
        ...prev,
        streakData: updatedStreakData
      }));
      
      const analytics = StreakManager.getStreakAnalytics(streakData);
      if (analytics.shieldsRemaining === 0) {
        toast.success('🛡️ Your monthly shields have been reset! You now have 3 shields available.');
      }
    }
  };

  const scheduleNotifications = (streakData: StreakData) => {
    const nextNotificationTime = StreakManager.getNextNotificationTime(streakData);
    if (nextNotificationTime) {
      const timeUntilNotification = nextNotificationTime.getTime() - Date.now();
      if (timeUntilNotification > 0 && timeUntilNotification < 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          const notificationTimezone = appState.user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
          const status = StreakManager.getStreakStatus(streakData, notificationTimezone);
          switch (status.nextNotification) {
            case 'reminder':
              toast.info('🔔 Reminder: Time for your daily check-in!');
              break;
            case 'warning':
              toast.warning('⚠️ Warning: Only 1 hour left to check in!');
              break;
            case 'critical':
              toast.error('🚨 Critical: Your streak expires in 1 hour!');
              break;
          }
        }, timeUntilNotification);
      }
    }
  };

  const checkAndResetMissedChallenges = (challenges: Challenge[]) => {
    const today = new Date();
    const updatedChallenges = challenges.map(challenge => {
      if (!challenge.isActive || !challenge.lastCheckIn) return challenge;

      const lastCheckIn = new Date(challenge.lastCheckIn);
      const hoursElapsed = (today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);

      if (hoursElapsed > 26) {
        return {
          ...challenge,
          currentDay: 0,
          lastCheckIn: undefined,
        };
      }

      return challenge;
    });

    const hasResets = updatedChallenges.some((challenge, index) => 
      challenge.currentDay !== challenges[index].currentDay
    );

    if (hasResets) {
      setAppState(prev => ({ ...prev, challenges: updatedChallenges }));
      toast.error('Some challenges were reset due to missed check-ins. Keep going!');
    }
  };

  const hasCheckedInToday = () => {
    const timezone = appState.user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    return StreakManager.hasCheckedInToday(appState.streakData, timezone);
  };

  const handleCheckIn = () => {
    if (hasCheckedInToday()) {
      toast.info(`You've already checked in today, ${appState.user?.name.split(' ')[0] || 'champion'}! Come back tomorrow.`);
      return;
    }

    try {
      const timezone = appState.user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const updatedStreakData = StreakManager.checkIn(appState.streakData, timezone);
      
      setAppState(prev => ({
        ...prev,
        streakData: updatedStreakData
      }));

      const firstName = appState.user?.name.split(' ')[0] || 'Champion';
      const newStreak = updatedStreakData.currentStreak;

      if (newStreak === 1) {
        toast.success(`🎉 Great start, ${firstName}! Your sugar-free journey begins!`, { duration: 4000 });
      } else if (newStreak === 7) {
        toast.success(`🚀 One week sugar-free, ${firstName}! You're on fire!`, { duration: 4000 });
      } else if (newStreak === 30) {
        toast.success(`🌟 One month, ${firstName}! You're absolutely amazing!`, { duration: 4000 });
      } else if (newStreak === 100) {
        toast.success(`💎 100 days, ${firstName}! You're a legend!`, { duration: 4000 });
      } else if (newStreak % 10 === 0) {
        toast.success(`🔥 ${newStreak} days strong, ${firstName}! Keep going!`, { duration: 4000 });
      } else {
        toast.success(`✅ Another day conquered, ${firstName}! You're building something amazing!`, { duration: 3000 });
      }

      const status = StreakManager.getStreakStatus(updatedStreakData, timezone);
      setStreakStatus(status);

    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Already checked in today') {
          toast.info('You\'ve already checked in today!');
        } else if (error.message === 'Check-in window expired') {
          toast.error('Check-in window expired! Use a Streak Shield to save your streak.');
          setAppState(prev => ({ ...prev, showStreakShield: true }));
        } else {
          toast.error(`Check-in failed: ${error.message}`);
        }
      }
    }
  };

  const handleUseStreakShield = () => {
    try {
      const now = new Date();
      const missedDate = appState.streakData.lastCheckIn 
        ? new Date(appState.streakData.lastCheckIn.getTime() + 24 * 60 * 60 * 1000)
        : new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const updatedStreakData = StreakManager.useStreakShield(appState.streakData, missedDate);
      
      setAppState(prev => ({
        ...prev,
        streakData: updatedStreakData,
        showStreakShield: false
      }));

      const firstName = appState.user?.name.split(' ')[0] || 'Champion';
      toast.success(`🛡️ Shield activated, ${firstName}! Your streak is safe and sound.`, { duration: 4000 });

      const timezone = appState.user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const status = StreakManager.getStreakStatus(updatedStreakData, timezone);
      setStreakStatus(status);

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleChallengeCheckIn = (challengeId: string) => {
    const today = new Date();
    const firstName = appState.user?.name.split(' ')[0] || 'Champion';
    
    setAppState(prev => ({
      ...prev,
      challenges: prev.challenges.map(challenge => {
        if (challenge.id === challengeId && challenge.isActive) {
          const newCurrentDay = challenge.currentDay + 1;
          const isNowCompleted = newCurrentDay >= challenge.duration;
          
          if (isNowCompleted) {
            toast.success(`🎉 Challenge completed, ${firstName}! You finished the ${challenge.title}!`, { duration: 5000 });
          } else {
            toast.success(`💪 Day ${newCurrentDay} complete, ${firstName}! Keep going!`);
          }
          
          return {
            ...challenge,
            currentDay: newCurrentDay,
            lastCheckIn: today,
            isActive: !isNowCompleted,
            isCompleted: isNowCompleted,
          };
        }
        return challenge;
      })
    }));
  };

  const handleDateChange = (newDate: Date) => {
    const retroactiveDays = StreakManager.calculateRetroactiveStreak(
      newDate, 
      appState.streakData.lastCheckIn || new Date()
    );
    
    const updatedStreakData = {
      ...appState.streakData,
      startDate: newDate,
      currentStreak: Math.max(appState.streakData.currentStreak, retroactiveDays + appState.streakData.totalCheckIns)
    };
    
    setAppState(prev => ({
      ...prev,
      streakData: updatedStreakData
    }));
    
    toast.success('Start date updated! Your streak includes retroactive days!');
  };

  const handleChallengeUpdate = (challenges: Challenge[]) => {
    setAppState(prev => ({ ...prev, challenges }));
  };

  const handleSplashComplete = () => {
    setAppState(prev => ({ ...prev, showSplash: false }));
  };

  const handleOnboardingComplete = () => {
    setAppState(prev => ({ 
      ...prev, 
      hasCompletedOnboarding: true 
    }));
  };

  const handleUpdateProfile = (userData: UserData) => {
    setAppState(prev => ({ ...prev, user: userData }));
  };

  const activeChallenges = appState.challenges.filter(c => c.isActive);
  const completedChallenges = appState.challenges.filter(c => c.isCompleted).length;
  const analytics = StreakManager.getStreakAnalytics(appState.streakData);

  const contextValue: AppContextType = {
    appState,
    streakStatus,
    setAppState,
    handleCheckIn,
    handleUseStreakShield,
    handleChallengeCheckIn,
    handleDateChange,
    handleChallengeUpdate,
    handleSplashComplete,
    handleOnboardingComplete,
    handleUpdateProfile,
    hasCheckedInToday,
    activeChallenges,
    completedChallenges,
    analytics,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};