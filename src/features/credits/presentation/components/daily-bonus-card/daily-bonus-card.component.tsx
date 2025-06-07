import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDailyBonus } from '../../hooks/use-daily-bonus.hook';

interface DailyBonusCardProps {
  style?: any;
}

export const DailyBonusCard: React.FC<DailyBonusCardProps> = ({ style }) => {
  const { t } = useTranslation();
  const {
    canClaim,
    isLoading,
    currentStreak,
    timeUntilNext,
    potentialBonusAmount,
    hasActiveStreak,
    isMaxStreak,
    claimBonus,
    error
  } = useDailyBonus();

  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimBonus = async () => {
    if (!canClaim || isClaiming) return;

    setIsClaiming(true);
    try {
      const result = await claimBonus();
      
      Alert.alert(
        '🎉 Bonus erhalten!',
        `Du hast ${result.bonusAmount} Credits erhalten!\nAktuelle Serie: ${result.streak} Tage`,
        [{ text: 'Super!', style: 'default' }]
      );
    } catch (error) {
      Alert.alert(
        'Fehler',
        error instanceof Error ? error.message : 'Bonus konnte nicht eingelöst werden',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsClaiming(false);
    }
  };

  const getStreakBadgeColor = () => {
    if (isMaxStreak) return '#ffd700'; // Gold
    if (hasActiveStreak) return '#28a745'; // Green
    return '#6c757d'; // Gray
  };

  const getStreakEmoji = () => {
    if (isMaxStreak) return '🔥';
    if (hasActiveStreak) return '⚡';
    return '📅';
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Täglicher Bonus</Text>
        
        {currentStreak > 0 && (
          <View style={[styles.streakBadge, { backgroundColor: getStreakBadgeColor() }]}>
            <Text style={styles.streakEmoji}>{getStreakEmoji()}</Text>
            <Text style={styles.streakText}>{currentStreak}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {canClaim ? (
          <>
            <Text style={styles.bonusAmount}>+{potentialBonusAmount} ⭐</Text>
            <Text style={styles.bonusDescription}>
              {hasActiveStreak 
                ? `Serie-Bonus! Tag ${currentStreak + 1}` 
                : 'Dein täglicher Bonus wartet!'
              }
            </Text>
            
            <TouchableOpacity
              style={[styles.claimButton, isClaiming && styles.claimButtonDisabled]}
              onPress={handleClaimBonus}
              disabled={isClaiming || isLoading}
            >
              <Text style={styles.claimButtonText}>
                {isClaiming ? 'Wird eingelöst...' : 'Bonus holen 🎁'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.waitingTitle}>Nächster Bonus in:</Text>
            <Text style={styles.countdown}>{timeUntilNext || 'Berechnung...'}</Text>
            <Text style={styles.waitingDescription}>
              Komm täglich zurück für Bonus-Credits!
            </Text>
            
            {hasActiveStreak && (
              <Text style={styles.streakKeepGoing}>
                🔥 Halte deine {currentStreak}-Tage Serie aufrecht!
              </Text>
            )}
          </>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.description}>
        {t('dailyBonusMessage')}
      </Text>
    </View>
  );
};

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