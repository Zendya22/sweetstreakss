export interface StreakShield {
  id: string;
  usedAt: Date;
  recoveredDay: Date;
  reason: 'manual' | 'admin_override';
  cooldownUntil: Date;
  evidence?: {
    type: 'screenshot' | 'bug_report' | 'technical_issue';
    description: string;
    submittedAt: Date;
    supportTicketId?: string;
  };
}

export interface StreakHistory {
  date: Date;
  checkInTime: Date;
  type: 'normal' | 'shield_recovery' | 'grace_period';
  qualityScore: number;
  timingScore: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  startDate: Date;
  totalCheckIns: number;
  streakShields: StreakShield[];
  streakHistory: StreakHistory[];
  qualityScore: number;
  consistencyPercentage: number;
  monthlyShieldResets: { [monthKey: string]: number }; // Track monthly resets
}

export interface StreakStatus {
  status: 'active' | 'warning' | 'critical' | 'broken';
  hoursRemaining: number;
  canUseShield: boolean;
  shieldCooldownHours?: number;
  missedCheckInHours?: number;
  nextNotification: 'reminder' | 'warning' | 'critical' | 'recovery' | null;
}

export interface StreakAnalytics {
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

export interface ManualRecoveryRequest {
  id: string;
  userId: string;
  submittedAt: Date;
  missedDate: Date;
  evidence: {
    type: 'screenshot' | 'bug_report' | 'technical_issue';
    description: string;
    attachments?: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  processedAt?: Date;
  processedBy?: string;
}

export class StreakManager {
  private static readonly CHECK_IN_WINDOW_HOURS = 24;
  private static readonly GRACE_PERIOD_HOURS = 2;
  private static readonly SHIELDS_PER_MONTH = 3;
  private static readonly SHIELD_COOLDOWN_DAYS = 7;
  private static readonly SHIELD_USAGE_WINDOW_HOURS = 48;
  private static readonly MANUAL_RECOVERY_WINDOW_HOURS = 72;

  static hasCheckedInToday(streakData: StreakData, timezone: string): boolean {
    if (!streakData.lastCheckIn) return false;

    const now = new Date();
    const lastCheckIn = new Date(streakData.lastCheckIn);
    
    // Convert to user's timezone
    const nowInTimezone = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const lastCheckInTimezone = new Date(lastCheckIn.toLocaleString("en-US", { timeZone: timezone }));
    
    return (
      nowInTimezone.getFullYear() === lastCheckInTimezone.getFullYear() &&
      nowInTimezone.getMonth() === lastCheckInTimezone.getMonth() &&
      nowInTimezone.getDate() === lastCheckInTimezone.getDate()
    );
  }

  static getStreakStatus(streakData: StreakData, timezone?: string): StreakStatus {
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    
    if (!streakData.lastCheckIn) {
      return {
        status: 'active',
        hoursRemaining: this.CHECK_IN_WINDOW_HOURS,
        canUseShield: false,
        nextNotification: null
      };
    }

    const lastCheckIn = new Date(streakData.lastCheckIn);
    const hoursElapsed = (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);
    const totalWindow = this.CHECK_IN_WINDOW_HOURS + this.GRACE_PERIOD_HOURS;
    const hoursRemaining = Math.max(0, totalWindow - hoursElapsed);

    // Check if user can use shield
    const canUseShield = this.canUseStreakShield(streakData, now);
    const shieldCooldown = this.getShieldCooldownHours(streakData, now);
    const missedHours = Math.max(0, hoursElapsed - this.CHECK_IN_WINDOW_HOURS);

    if (hoursElapsed <= this.CHECK_IN_WINDOW_HOURS) {
      return {
        status: 'active',
        hoursRemaining: this.CHECK_IN_WINDOW_HOURS - hoursElapsed,
        canUseShield: false,
        nextNotification: this.getNextNotificationType(hoursRemaining)
      };
    } else if (hoursElapsed <= this.CHECK_IN_WINDOW_HOURS + 1) {
      return {
        status: 'warning',
        hoursRemaining,
        canUseShield,
        shieldCooldownHours: shieldCooldown,
        missedCheckInHours: missedHours,
        nextNotification: 'warning'
      };
    } else if (hoursElapsed <= totalWindow) {
      return {
        status: 'critical',
        hoursRemaining,
        canUseShield,
        shieldCooldownHours: shieldCooldown,
        missedCheckInHours: missedHours,
        nextNotification: 'critical'
      };
    } else {
      return {
        status: 'broken',
        hoursRemaining: 0,
        canUseShield: canUseShield && missedHours <= this.SHIELD_USAGE_WINDOW_HOURS,
        shieldCooldownHours: shieldCooldown,
        missedCheckInHours: missedHours,
        nextNotification: canUseShield ? 'recovery' : null
      };
    }
  }

  static canUseStreakShield(streakData: StreakData, currentTime: Date = new Date()): boolean {
    // Check monthly limit
    const monthKey = this.getMonthKey(currentTime);
    const shieldsUsedThisMonth = this.getShieldsUsedInMonth(streakData, monthKey);
    
    if (shieldsUsedThisMonth >= this.SHIELDS_PER_MONTH) {
      return false;
    }

    // Check cooldown
    const lastShield = streakData.streakShields
      .sort((a, b) => b.usedAt.getTime() - a.usedAt.getTime())[0];
    
    if (lastShield) {
      const hoursSinceLastUse = (currentTime.getTime() - lastShield.usedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastUse < this.SHIELD_COOLDOWN_DAYS * 24) {
        return false;
      }
    }

    // Check usage window (can only use within 48 hours of missed check-in)
    if (streakData.lastCheckIn) {
      const hoursSinceLastCheckIn = (currentTime.getTime() - streakData.lastCheckIn.getTime()) / (1000 * 60 * 60);
      const missedHours = Math.max(0, hoursSinceLastCheckIn - this.CHECK_IN_WINDOW_HOURS - this.GRACE_PERIOD_HOURS);
      
      if (missedHours > this.SHIELD_USAGE_WINDOW_HOURS) {
        return false;
      }
    }

    return true;
  }

  static getShieldsUsedInMonth(streakData: StreakData, monthKey: string): number {
    return streakData.streakShields.filter(shield => {
      const shieldMonthKey = this.getMonthKey(shield.usedAt);
      return shieldMonthKey === monthKey;
    }).length;
  }

  static getShieldCooldownHours(streakData: StreakData, currentTime: Date): number {
    const lastShield = streakData.streakShields
      .sort((a, b) => b.usedAt.getTime() - a.usedAt.getTime())[0];
    
    if (!lastShield) return 0;
    
    const hoursSinceLastUse = (currentTime.getTime() - lastShield.usedAt.getTime()) / (1000 * 60 * 60);
    const cooldownHours = this.SHIELD_COOLDOWN_DAYS * 24;
    
    return Math.max(0, cooldownHours - hoursSinceLastUse);
  }

  static getMonthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  static checkIn(streakData: StreakData, timezone: string): StreakData {
    const now = new Date();
    
    if (this.hasCheckedInToday(streakData, timezone)) {
      throw new Error('Already checked in today');
    }

    const status = this.getStreakStatus(streakData, timezone);
    
    if (status.status === 'broken' && !status.canUseShield) {
      throw new Error('Check-in window expired');
    }

    const qualityScore = this.calculateQualityScore(now, streakData.lastCheckIn);
    const timingScore = this.calculateTimingScore(now);

    const newHistory: StreakHistory = {
      date: now,
      checkInTime: now,
      type: status.status === 'broken' ? 'shield_recovery' : 
            (status.hoursRemaining < this.GRACE_PERIOD_HOURS ? 'grace_period' : 'normal'),
      qualityScore,
      timingScore
    };

    const newStreak = streakData.currentStreak + 1;
    
    return {
      ...streakData,
      currentStreak: newStreak,
      longestStreak: Math.max(streakData.longestStreak, newStreak),
      lastCheckIn: now,
      totalCheckIns: streakData.totalCheckIns + 1,
      streakHistory: [...streakData.streakHistory, newHistory],
      qualityScore: this.updateQualityScore(streakData.qualityScore, qualityScore),
      consistencyPercentage: this.calculateConsistencyPercentage([...streakData.streakHistory, newHistory])
    };
  }

  static useStreakShield(streakData: StreakData, missedDate: Date, reason: 'manual' | 'admin_override' = 'manual', evidence?: StreakShield['evidence']): StreakData {
    const now = new Date();
    
    if (!this.canUseStreakShield(streakData, now)) {
      const monthKey = this.getMonthKey(now);
      const shieldsUsed = this.getShieldsUsedInMonth(streakData, monthKey);
      const cooldownHours = this.getShieldCooldownHours(streakData, now);
      
      if (shieldsUsed >= this.SHIELDS_PER_MONTH) {
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        throw new Error(`Maximum shields used this month (${this.SHIELDS_PER_MONTH}). Next shield available: ${nextMonth.toLocaleDateString()}`);
      }
      
      if (cooldownHours > 0) {
        const days = Math.ceil(cooldownHours / 24);
        throw new Error(`Shield on cooldown. Available in ${days} day${days > 1 ? 's' : ''}`);
      }
      
      throw new Error('Shield usage window expired (48 hours)');
    }

    const newShield: StreakShield = {
      id: `shield_${now.getTime()}`,
      usedAt: now,
      recoveredDay: missedDate,
      reason,
      cooldownUntil: new Date(now.getTime() + this.SHIELD_COOLDOWN_DAYS * 24 * 60 * 60 * 1000),
      evidence
    };

    // Create recovery history entry
    const recoveryHistory: StreakHistory = {
      date: missedDate,
      checkInTime: now,
      type: 'shield_recovery',
      qualityScore: 100, // Full points for shield recovery
      timingScore: 100
    };

    return {
      ...streakData,
      lastCheckIn: now,
      streakShields: [...streakData.streakShields, newShield],
      streakHistory: [...streakData.streakHistory, recoveryHistory],
      qualityScore: this.updateQualityScore(streakData.qualityScore, 100),
    };
  }

  static createManualRecoveryRequest(
    userId: string,
    missedDate: Date,
    evidence: ManualRecoveryRequest['evidence']
  ): ManualRecoveryRequest {
    const now = new Date();
    const hoursSinceMissed = (now.getTime() - missedDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceMissed > this.MANUAL_RECOVERY_WINDOW_HOURS) {
      throw new Error(`Manual recovery requests must be submitted within ${this.MANUAL_RECOVERY_WINDOW_HOURS} hours of the missed check-in`);
    }

    return {
      id: `recovery_${now.getTime()}`,
      userId,
      submittedAt: now,
      missedDate,
      evidence,
      status: 'pending'
    };
  }

  static processManualRecoveryRequest(
    request: ManualRecoveryRequest,
    approved: boolean,
    adminId: string,
    adminNotes?: string
  ): ManualRecoveryRequest {
    return {
      ...request,
      status: approved ? 'approved' : 'rejected',
      processedAt: new Date(),
      processedBy: adminId,
      adminNotes
    };
  }

  static getStreakAnalytics(streakData: StreakData): StreakAnalytics {
    const now = new Date();
    const monthKey = this.getMonthKey(now);
    const shieldsUsedThisMonth = this.getShieldsUsedInMonth(streakData, monthKey);
    const shieldsRemaining = this.SHIELDS_PER_MONTH - shieldsUsedThisMonth;
    
    // Calculate next shield availability
    let nextShieldAvailable: Date | undefined;
    const lastShield = streakData.streakShields
      .sort((a, b) => b.usedAt.getTime() - a.usedAt.getTime())[0];
    
    if (lastShield) {
      const cooldownEnd = new Date(lastShield.usedAt.getTime() + this.SHIELD_COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
      if (cooldownEnd > now) {
        nextShieldAvailable = cooldownEnd;
      }
    }

    if (shieldsRemaining === 0 && !nextShieldAvailable) {
      nextShieldAvailable = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    const perfectDays = streakData.streakHistory.filter(h => h.type === 'normal' && h.qualityScore >= 90).length;
    const graceDays = streakData.streakHistory.filter(h => h.type === 'grace_period').length;
    const shieldDays = streakData.streakHistory.filter(h => h.type === 'shield_recovery').length;

    const monthlyPerformance = this.calculateMonthlyPerformance(streakData.streakHistory);
    const shieldUsageHistory = streakData.streakShields.map(shield => ({
      date: shield.usedAt,
      reason: shield.reason === 'admin_override' ? 'Technical Issue (Admin Recovery)' : 'Manual Shield Use',
      dayRecovered: shield.recoveredDay.getDate()
    }));

    return {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      totalCheckIns: streakData.totalCheckIns,
      consistencyPercentage: streakData.consistencyPercentage,
      qualityScore: streakData.qualityScore,
      perfectDays,
      graceDays,
      shieldDays,
      shieldsRemaining,
      shieldsUsedThisMonth,
      nextShieldAvailable,
      monthlyPerformance,
      shieldUsageHistory
    };
  }

  private static getNextNotificationType(hoursRemaining: number): 'reminder' | 'warning' | 'critical' | null {
    if (hoursRemaining <= 1) return 'critical';
    if (hoursRemaining <= 4) return 'warning';
    if (hoursRemaining <= 8) return 'reminder';
    return null;
  }

  private static calculateQualityScore(checkInTime: Date, lastCheckIn: Date | null): number {
    if (!lastCheckIn) return 100;
    
    const hoursSinceLastCheckIn = (checkInTime.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);
    const targetHours = 24;
    const variance = Math.abs(hoursSinceLastCheckIn - targetHours);
    
    if (variance <= 1) return 100;
    if (variance <= 2) return 90;
    if (variance <= 4) return 80;
    if (variance <= 8) return 70;
    return 60;
  }

  private static calculateTimingScore(checkInTime: Date): number {
    const hour = checkInTime.getHours();
    // Optimal times: morning (6-10) and evening (18-22)
    if ((hour >= 6 && hour <= 10) || (hour >= 18 && hour <= 22)) return 100;
    if ((hour >= 11 && hour <= 17) || (hour >= 23 || hour <= 5)) return 80;
    return 60;
  }

  private static updateQualityScore(currentScore: number, newScore: number): number {
    return Math.round((currentScore * 0.9) + (newScore * 0.1));
  }

  private static calculateConsistencyPercentage(history: StreakHistory[]): number {
    if (history.length === 0) return 100;
    
    const recentHistory = history.slice(-30); // Last 30 entries
    const onTimeCheckIns = recentHistory.filter(h => h.type === 'normal').length;
    
    return Math.round((onTimeCheckIns / recentHistory.length) * 100);
  }

  private static calculateMonthlyPerformance(history: StreakHistory[]): { month: string; checkIns: number; quality: number }[] {
    const monthlyData: { [key: string]: { checkIns: number; totalQuality: number } } = {};
    
    history.forEach(entry => {
      const monthKey = this.getMonthKey(entry.date);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { checkIns: 0, totalQuality: 0 };
      }
      monthlyData[monthKey].checkIns++;
      monthlyData[monthKey].totalQuality += entry.qualityScore;
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        checkIns: data.checkIns,
        quality: Math.round(data.totalQuality / data.checkIns)
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }

  static calculateRetroactiveStreak(startDate: Date, currentDate: Date): number {
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  static getNextNotificationTime(streakData: StreakData): Date | null {
    if (!streakData.lastCheckIn) return null;
    
    const lastCheckIn = new Date(streakData.lastCheckIn);
    const reminderTime = new Date(lastCheckIn.getTime() + 16 * 60 * 60 * 1000); // 16 hours later
    const warningTime = new Date(lastCheckIn.getTime() + 23 * 60 * 60 * 1000); // 23 hours later
    const criticalTime = new Date(lastCheckIn.getTime() + 25 * 60 * 60 * 1000); // 25 hours later
    
    const now = new Date();
    
    if (now < reminderTime) return reminderTime;
    if (now < warningTime) return warningTime;
    if (now < criticalTime) return criticalTime;
    
    return null;
  }
}