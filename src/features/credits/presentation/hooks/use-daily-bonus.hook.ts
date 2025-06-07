import { useEffect } from 'react';
import { useCreditStore } from '../store/credit.store';

export const useDailyBonus = () => {
  const {
    dailyBonus,
    error,
    claimDailyBonus,
    getDailyBonusStatus,
    clearError
  } = useCreditStore();

  // Auto-load bonus status on mount
  useEffect(() => {
    getDailyBonusStatus();
  }, [getDailyBonusStatus]);

  const handleClaimBonus = async () => {
    try {
      const result = await claimDailyBonus();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getTimeUntilNextBonus = (): string | null => {
    if (!dailyBonus.nextClaimTime) return null;
    
    const now = new Date();
    const nextClaim = new Date(dailyBonus.nextClaimTime);
    const timeDiff = nextClaim.getTime() - now.getTime();
    
    if (timeDiff <= 0) return null;
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getBonusAmount = (): number => {
    // Base bonus is 2, plus 1 for each streak day (max 5 bonus)
    const baseBonus = 2;
    const streakBonus = Math.min(dailyBonus.currentStreak, 5);
    return baseBonus + streakBonus;
  };

  return {
    // State
    canClaim: dailyBonus.canClaim,
    isLoading: dailyBonus.isLoading,
    currentStreak: dailyBonus.currentStreak,
    nextClaimTime: dailyBonus.nextClaimTime,
    error,
    
    // Actions
    claimBonus: handleClaimBonus,
    refreshStatus: getDailyBonusStatus,
    clearError,
    
    // Computed
    timeUntilNext: getTimeUntilNextBonus(),
    potentialBonusAmount: getBonusAmount(),
    hasActiveStreak: dailyBonus.currentStreak > 1,
    isMaxStreak: dailyBonus.currentStreak >= 7
  };
}; 