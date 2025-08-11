'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

interface UserData {
  name: string;
  email: string;
  timezone?: string;
}

interface LoginProps {
  onLogin: (userData: UserData) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (isSignUp && !formData.name) {
      toast.error('Please enter your name');
      setIsLoading(false);
      return;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const userData: UserData = {
        name: isSignUp ? formData.name : formData.email.split('@')[0],
        email: formData.email,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      if (isSignUp) {
        toast.success(`Welcome to SweetStreaks, ${userData.name.split(' ')[0]}! 🎉`);
      } else {
        toast.success(`Welcome back, ${userData.name.split(' ')[0]}! 🍃`);
      }

      onLogin(userData);
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 bg-emerald-200/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-16 w-32 h-32 bg-mint-300/25 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-sage-200/30 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card premium className="p-8 rounded-3xl shadow-premium-lg relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-mint-100/20 rounded-full transform translate-x-16 -translate-y-16"></div>
          
          <div className="relative z-10">
            {/* Premium Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-20 h-20 premium-gradient rounded-3xl flex items-center justify-center shadow-glow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20,
                    delay: 0.3
                  }}
                >
                  <span className="text-white text-3xl">🍃</span>
                </motion.div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isSignUp ? 'Join SweetStreaks' : 'Welcome Back'}
              </h1>
              <p className="text-foreground-muted">
                {isSignUp 
                  ? 'Start your sugar-free journey today' 
                  : 'Continue your wellness journey'
                }
              </p>
            </motion.div>

            {/* Premium Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {/* Name field for signup */}
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-11 pr-4 py-3 rounded-xl border-border focus:border-emerald-400 focus:ring-emerald-400/20 bg-background-secondary/50 backdrop-blur-sm transition-all duration-200"
                      required={isSignUp}
                    />
                  </div>
                </motion.div>
              )}

              {/* Email field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-11 pr-4 py-3 rounded-xl border-border focus:border-emerald-400 focus:ring-emerald-400/20 bg-background-secondary/50 backdrop-blur-sm transition-all duration-200"
                  required
                />
              </div>
              
              {/* Password field */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-11 pr-12 py-3 rounded-xl border-border focus:border-emerald-400 focus:ring-emerald-400/20 bg-background-secondary/50 backdrop-blur-sm transition-all duration-200"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm password for signup */}
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-5 h-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-11 pr-4 py-3 rounded-xl border-border focus:border-emerald-400 focus:ring-emerald-400/20 bg-background-secondary/50 backdrop-blur-sm transition-all duration-200"
                      required={isSignUp}
                      minLength={6}
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                variant="premium"
                size="lg"
                className="w-full rounded-xl py-4 mt-8 shadow-glow hover:shadow-glow-strong disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </motion.form>

            {/* Toggle between login/signup */}
            <motion.div 
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-foreground-muted">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}