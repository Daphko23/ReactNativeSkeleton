/**
 * @fileoverview Daily Bonus Card Component - HOOK-CENTRIC UI Component
 * 
 * @description Pure UI component for daily bonus card display.
 * NO BUSINESS LOGIC - all logic handled by useDailyBonusCard hook.
 * Follows HOOK-CENTRIC architecture with complete separation of concerns.
 * 
 * @module DailyBonusCardComponent  
 * @since 2.0.0 (HOOK-CENTRIC Refactor)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation (Pure UI Component)
 * @architecture HOOK-CENTRIC - Components only for UI rendering
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDailyBonusCard } from '../../hooks/use-daily-bonus-card.hook';

// =============================================================================
// TYPES
// =============================================================================

interface DailyBonusCardProps {
  style?: any;
}

// =============================================================================
// HOOK-CENTRIC COMPONENT - PURE UI ONLY
// =============================================================================

/**
 * DailyBonusCard - Pure UI Component
 * 
 * @description HOOK-CENTRIC daily bonus card:
 * - ALL business logic in useDailyBonusCard hook
 * - Component only handles UI rendering and user interactions
 * - Bonus claiming logic in hook
 * - Zero business logic, zero state management, zero service calls
 */
export const DailyBonusCard: React.FC<DailyBonusCardProps> = ({ style }) => {
  const { t } = useTranslation();
  
  // 🎯 HOOK-CENTRIC - ALL BUSINESS LOGIC FROM HOOK
  const {
    // Server State
    canClaim,
    isLoading: _isLoading,
    currentStreak,
    timeUntilNext,
    potentialBonusAmount,
    hasActiveStreak,
    isMaxStreak: _isMaxStreak,
    
    // UI State
    isClaiming: _isClaiming,
    
    // Actions
    handleClaimBonus,
    
    // Visual Styling
    getStreakBadgeColor: _getStreakBadgeColor,
    getStreakEmoji: _getStreakEmoji,
    streakBadgeData,
    
    // Computed States
    canInteract: _canInteract,
    showStreakBadge,
    bonusDescription,
    waitingDescription: _waitingDescription,
    claimButtonText,
    isClaimButtonDisabled,
    
    // Error Handling
    displayError,
  } = useDailyBonusCard();

  // =============================================================================
  // UI RENDERING FUNCTIONS
  // =============================================================================

  const renderHeader = () => (
    <View style={styles.header}>
      <Text 
        style={styles.title}
        accessibilityRole="header"
        testID="daily-bonus-title"
      >
        Täglicher Bonus
      </Text>
      
      {showStreakBadge && (
        <View 
          style={[styles.streakBadge, { backgroundColor: streakBadgeData.color }]}
          accessibilityRole="text"
          accessibilityLabel={`Aktuelle Serie: ${currentStreak} Tage`}
          testID="streak-badge"
        >
          <Text style={styles.streakEmoji}>{streakBadgeData.emoji}</Text>
          <Text style={styles.streakText}>{streakBadgeData.text}</Text>
        </View>
      )}
    </View>
  );

  const renderClaimableBonus = () => (
    <>
      <Text 
        style={styles.bonusAmount}
        accessibilityRole="text"
        accessibilityLabel={`Bonus: ${potentialBonusAmount} Credits`}
        testID="bonus-amount"
      >
        +{potentialBonusAmount} ⭐
      </Text>
      
      <Text 
        style={styles.bonusDescription}
        accessibilityRole="text"
        testID="bonus-description"
      >
        {bonusDescription}
      </Text>
      
      <TouchableOpacity
        style={[styles.claimButton, isClaimButtonDisabled && styles.claimButtonDisabled]}
        onPress={handleClaimBonus}
        disabled={isClaimButtonDisabled}
        accessibilityRole="button"
        accessibilityLabel={claimButtonText}
        accessibilityState={{ disabled: isClaimButtonDisabled }}
        testID="claim-bonus-button"
      >
        <Text style={styles.claimButtonText}>
          {claimButtonText}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderWaitingState = () => (
    <>
      <Text 
        style={styles.waitingTitle}
        accessibilityRole="text"
        testID="waiting-title"
      >
        Nächster Bonus in:
      </Text>
      
      <Text 
        style={styles.countdown}
        accessibilityRole="text"
        accessibilityLabel={`Nächster Bonus in ${timeUntilNext || 'Berechnung läuft'}`}
        testID="countdown"
      >
        {timeUntilNext || 'Berechnung...'}
      </Text>
      
      <Text 
        style={styles.waitingDescription}
        accessibilityRole="text"
        testID="waiting-description"
      >
        Komm täglich zurück für Bonus-Credits!
      </Text>
      
      {hasActiveStreak && (
        <Text 
          style={styles.streakKeepGoing}
          accessibilityRole="text"
          accessibilityLabel={`Halte deine ${currentStreak} Tage Serie aufrecht`}
          testID="streak-motivation"
        >
          🔥 Halte deine {currentStreak}-Tage Serie aufrecht!
        </Text>
      )}
    </>
  );

  const renderError = () => {
    if (!displayError) return null;

    return (
      <View style={styles.errorContainer}>
        <Text 
          style={styles.errorText}
          accessibilityRole="alert"
          testID="error-message"
        >
          {displayError}
        </Text>
      </View>
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <View 
      style={[styles.container, style]}
      accessibilityLabel="Täglicher Bonus Karte"
      testID="daily-bonus-card"
    >
      {renderHeader()}

      <View style={styles.content}>
        {canClaim ? renderClaimableBonus() : renderWaitingState()}
      </View>

      {renderError()}

      <Text 
        style={styles.description}
        accessibilityRole="text"
        testID="bonus-description-footer"
      >
        {t('dailyBonusMessage')}
      </Text>
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    alignItems: 'center',
  },
  bonusAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 8,
  },
  bonusDescription: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  claimButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    minWidth: 200,
  },
  claimButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  waitingTitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  countdown: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  waitingDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 12,
  },
  streakKeepGoing: {
    fontSize: 14,
    color: '#ff6b35',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 12,
  },
}); 