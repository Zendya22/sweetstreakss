'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../lib/AppContext';
import SplashScreen from '../components/SplashScreen';
import Onboarding from '../components/Onboarding';

export default function HomePage() {
  const router = useRouter();
  const { appState, handleSplashComplete, handleOnboardingComplete } = useApp();

  useEffect(() => {
    // If user is authenticated and has completed onboarding, redirect to dashboard
    if (appState.isAuthenticated && appState.hasCompletedOnboarding) {
      router.push('/dashboard');
    }
    // If user is authenticated but hasn't completed onboarding, stay on this page to show onboarding
    // If user is not authenticated, redirect to login after splash/onboarding
    else if (!appState.isAuthenticated && !appState.showSplash && appState.hasCompletedOnboarding) {
      router.push('/login');
    }
  }, [appState.isAuthenticated, appState.hasCompletedOnboarding, appState.showSplash, router]);

  if (!appState.mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-mint-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-emerald-600">Loading SweetStreaks...</p>
        </div>
      </div>
    );
  }

  if (appState.showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!appState.hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // This shouldn't render for long as useEffect will redirect
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-mint-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-emerald-600">Redirecting...</p>
      </div>
    </div>
  );
}