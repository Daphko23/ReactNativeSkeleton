/**
 * @fileoverview useDailyBonusCard Hook - HOOK-CENTRIC Business Logic
 * 
 * @description Custom hook for daily bonus card business logic.
 * ALL BUSINESS LOGIC - extracted from DailyBonusCard component.
 * Follows HOOK-CENTRIC architecture with complete separation of concerns.
 * 
 * @module useDailyBonusCardHook
 * @since 2.0.0 (HOOK-CENTRIC Refactor)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation (Business Logic Hook)
 * @architecture HOOK-CENTRIC - Hooks contain all business logic
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDailyBonus } from './use-daily-bonus.hook';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface UseDailyBonusCardProps {
  onSuccess?: (result: { bonusAmount: number; streak: number }) => void;
  onError?: (error: string) => void;
}

interface ClaimResult {
  bonusAmount: number;
  streak: number;
}

// =============================================================================
// HOOK-CENTRIC BUSINESS LOGIC HOOK
// =============================================================================

/**
 * useDailyBonusCard - Business Logic Hook
 * 
 * @description HOOK-CENTRIC daily bonus card hook:
 * - ALL business logic for daily bonus card interactions
 * - Bonus claiming logic with error handling
 * - UI state management and visual feedback
 * - Complete separation from UI rendering logic
 */
export const useDailyBonusCard = ({
  onSuccess,
  onError,
}: UseDailyBonusCardProps = {}) => {
  const { t } = useTranslation();

  // =============================================================================
  // BASE DAILY BONUS HOOK
  // =============================================================================

  const {
    canClaim,
    isLoading,
    currentStreak,
    timeUntilNext,
    potentialBonusAmount,
    hasActiveStreak,
    isMaxStreak,
    claimBonus,
    error: dailyBonusError
  } = useDailyBonus();

  // =============================================================================
  // UI STATE MANAGEMENT
  // =============================================================================

  const [isClaiming, setIsClaiming] = useState(false);

  // =============================================================================
  // BUSINESS LOGIC - Bonus Claiming
  // =============================================================================

  const handleClaimBonus = useCallback(async (): Promise<ClaimResult | null> => {
    if (!canClaim || isClaiming) return null;

    setIsClaiming(true);
    
    try {
      const result = await claimBonus();
      
      // Show success alert
      Alert.alert(
        '🎉 Bonus erhalten!',
        `Du hast ${result.bonusAmount} Credits erhalten!\nAktuelle Serie: ${result.streak} Tage`,
        [{ text: 'Super!', style: 'default' }]
      );

      // Call success callback if provided
      onSuccess?.(result);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bonus konnte nicht eingelöst werden';
      
      // Show error alert
      Alert.alert(
        'Fehler',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );

      // Call error callback if provided
      onError?.(errorMessage);
      
      return null;
    } finally {
      setIsClaiming(false);
    }
  }, [canClaim, isClaiming, claimBonus, onSuccess, onError]);

  // =============================================================================
  // BUSINESS LOGIC - Visual Styling Logic
  // =============================================================================

  const getStreakBadgeColor = useCallback((): string => {
    if (isMaxStreak) return '#ffd700'; // Gold
    if (hasActiveStreak) return '#28a745'; // Green
    return '#6c757d'; // Gray
  }, [isMaxStreak, hasActiveStreak]);

  const getStreakEmoji = useCallback((): string => {
    if (isMaxStreak) return '🔥';
    if (hasActiveStreak) return '⚡';
    return '📅';
  }, [isMaxStreak, hasActiveStreak]);

  // =============================================================================
  // COMPUTED STATES
  // =============================================================================

  const canInteract = useMemo(() => {
    return !isClaiming && !isLoading;
  }, [isClaiming, isLoading]);

  const showStreakBadge = useMemo(() => {
    return currentStreak > 0;
  }, [currentStreak]);

  const streakBadgeData = useMemo(() => ({
    color: getStreakBadgeColor(),
    emoji: getStreakEmoji(),
    text: currentStreak.toString(),
  }), [currentStreak, getStreakBadgeColor, getStreakEmoji]);

  const bonusDescription = useMemo(() => {
    if (!canClaim) return '';
    
    return hasActiveStreak 
      ? `Serie-Bonus! Tag ${currentStreak + 1}` 
      : 'Dein täglicher Bonus wartet!';
  }, [canClaim, hasActiveStreak, currentStreak]);

  const waitingDescription = useMemo(() => {
    if (canClaim) return '';
    
    return hasActiveStreak 
      ? `🔥 Halte deine ${currentStreak}-Tage Serie aufrecht!`
      : 'Komm täglich zurück für Bonus-Credits!';
  }, [canClaim, hasActiveStreak, currentStreak]);

  const claimButtonText = useMemo(() => {
    if (isClaiming) return 'Wird eingelöst...';
    return 'Bonus holen 🎁';
  }, [isClaiming]);

  const isClaimButtonDisabled = useMemo(() => {
    return isClaiming || isLoading || !canClaim;
  }, [isClaiming, isLoading, canClaim]);

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  const displayError = useMemo(() => {
    return dailyBonusError;
  }, [dailyBonusError]);

  // =============================================================================
  // RETURN HOOK API
  // =============================================================================

  return {
    // Server State (from base hook)
    canClaim,
    isLoading,
    currentStreak,
    timeUntilNext,
    potentialBonusAmount,
    hasActiveStreak,
    isMaxStreak,
    
    // UI State
    isClaiming,
    
    // Actions
    handleClaimBonus,
    
    // Visual Styling
    getStreakBadgeColor,
    getStreakEmoji,
    streakBadgeData,
    
    // Computed States
    canInteract,
    showStreakBadge,
    bonusDescription,
    waitingDescription,
    claimButtonText,
    isClaimButtonDisabled,
    
    // Error Handling
    displayError,
    
    // UI Dependencies
    t,
  };
}; 