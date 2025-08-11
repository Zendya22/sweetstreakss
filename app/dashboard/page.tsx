'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../lib/AppContext';
import { signOut } from '../../lib/supabaseClient';
import Dashboard from '../../components/Dashboard';
import Milestones from '../../components/Milestones';
import Challenges from '../../components/Challenges';
import Settings from '../../components/Settings';
import Share from '../../components/Share';
import StreakShield from '../../components/StreakShield';
import StreakAnalytics from '../../components/StreakAnalytics';
import BottomNavigation from '../../components/BottomNavigation';
import { toast } from 'sonner@2.0.3';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    appState, 
    setAppState,
    streakStatus,
    handleCheckIn,
    handleUseStreakShield,
    handleChallengeCheckIn,
    handleDateChange,
    handleChallengeUpdate,
    handleUpdateProfile,
    hasCheckedInToday,
    activeChallenges,
    completedChallenges,
    analytics
  } = useApp();

  const [currentSection, setCurrentSection] = useState('dashboard');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (appState.mounted && !appState.isAuthenticated) {
      router.push('/login');
    }
  }, [appState.isAuthenticated, appState.mounted, router]);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Error signing out: ' + error.message);
      } else {
        // Clear local data
        localStorage.removeItem('sweetStreaksApp');
        toast.success('Signed out successfully');
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred while signing out');
    }
  };

  // Show loading while checking authentication
  if (!appState.mounted || !appState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-mint-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-emerald-600">Loading SweetStreaks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="pb-20">
        {currentSection === 'dashboard' && (
          <Dashboard
            startDate={appState.streakData.startDate}
            currentStreak={appState.streakData.currentStreak}
            onCheckIn={handleCheckIn}
            onNavigate={handleNavigate}
            hasCheckedInToday={hasCheckedInToday()}
            onDateChange={handleDateChange}
            activeChallenges={activeChallenges}
            onChallengeCheckIn={handleChallengeCheckIn}
            user={appState.user}
            streakStatus={streakStatus}
            analytics={analytics}
          />
        )}
        
        {currentSection === 'challenges' && (
          <Challenges
            challenges={appState.challenges}
            onChallengesUpdate={handleChallengeUpdate}
            user={appState.user}
          />
        )}
        
        {currentSection === 'milestones' && (
          <Milestones
            currentStreak={appState.streakData.currentStreak}
            longestStreak={appState.streakData.longestStreak}
            analytics={analytics}
            user={appState.user}
          />
        )}

        {currentSection === 'analytics' && (
          <StreakAnalytics analytics={analytics} />
        )}

        {currentSection === 'share' && (
          <Share
            currentStreak={appState.streakData.currentStreak}
            user={appState.user}
            analytics={analytics}
          />
        )}
        
        {currentSection === 'settings' && appState.user && (
          <Settings
            user={appState.user}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            onNavigateBack={() => handleNavigate('dashboard')}
            currentStreak={appState.streakData.currentStreak}
            totalDays={appState.streakData.totalCheckIns}
            startDate={appState.streakData.startDate}
            completedChallenges={completedChallenges}
            analytics={analytics}
          />
        )}
      </div>

      {/* Unified Bottom Navigation - Hide when in Settings */}
      {currentSection !== 'settings' && (
        <BottomNavigation 
          currentSection={currentSection}
          onNavigate={handleNavigate}
        />
      )}

      {/* Enhanced Streak Shield Modal */}
      <StreakShield
        isVisible={appState.showStreakShield}
        shieldsRemaining={analytics.shieldsRemaining}
        canUseShield={streakStatus.canUseShield}
        hoursUntilExpiry={streakStatus.hoursRemaining}
        streakDays={appState.streakData.currentStreak}
        onUseShield={handleUseStreakShield}
        onClose={() => setAppState(prev => ({ ...prev, showStreakShield: false }))}
        shieldCooldownHours={streakStatus.shieldCooldownHours}
        missedCheckInHours={streakStatus.missedCheckInHours}
      />
    </div>
  );
}