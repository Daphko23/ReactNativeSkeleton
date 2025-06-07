import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCredits } from '../../hooks/use-credits.hook';

interface CreditBalanceProps {
  showRefreshButton?: boolean;
  onPress?: () => void;
  style?: any;
}

export const CreditBalance: React.FC<CreditBalanceProps> = ({
  showRefreshButton = false,
  onPress,
  style
}) => {
  const { t } = useTranslation();
  const { balance, isLoading, refreshBalance, hasCredits } = useCredits();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleRefresh = () => {
    refreshBalance();
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        <Text style={styles.label}>{t('yourCredits')}</Text>
        
        <View style={styles.balanceRow}>
          <Text style={[styles.balance, !hasCredits && styles.lowBalance]}>
            {isLoading ? '...' : balance.toLocaleString()}
          </Text>
          
          <Text style={styles.creditIcon}>⭐</Text>
          
          {showRefreshButton && (
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={isLoading}
            >
              <Text style={styles.refreshText}>↻</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {!hasCredits && (
          <Text style={styles.warning}>
            {t('creditsLow')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#495057',
  },
  lowBalance: {
    color: '#dc3545',
  },
  creditIcon: {
    fontSize: 24,
  },
  refreshButton: {
    padding: 4,
    marginLeft: 8,
  },
  refreshText: {
    fontSize: 18,
    color: '#007bff',
  },
  warning: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
    textAlign: 'center',
  },
}); 