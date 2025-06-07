import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  RefreshControl, 
  Text,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { 
  CreditBalance, 
  DailyBonusCard, 
  TransactionItem 
} from '../components';
import { 
  useCredits, 
  useDailyBonus, 
  useCreditTransactions 
} from '../hooks';
import { useTranslation } from 'react-i18next';

interface CreditDashboardProps {
  navigation?: any; // React Navigation prop
}

export const CreditDashboard: React.FC<CreditDashboardProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { balance: _balance, isLoading: _isLoading, refreshBalance, error, clearError } = useCredits();
  const { canClaim } = useDailyBonus();
  const { 
    transactions, 
    isLoading: transactionsLoading, 
    refresh: refreshTransactions 
  } = useCreditTransactions();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshBalance(),
        refreshTransactions()
      ]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBalancePress = () => {
    if (navigation) {
      navigation.navigate('CreditTransactions');
    }
  };

  const handlePurchasePress = () => {
    if (navigation) {
      navigation.navigate('CreditShop');
    }
  };

  const handleTransactionPress = (transaction: any) => {
    if (navigation) {
      navigation.navigate('TransactionDetail', { transactionId: transaction.id });
    }
  };

  const recentTransactions = transactions.slice(0, 5); // Nur die letzten 5

  React.useEffect(() => {
    if (error) {
      Alert.alert(
        t('common.error'),
        error,
        [
          { text: t('common.ok'), onPress: clearError }
        ]
      );
    }
  }, [error, clearError, t]);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor="#007bff"
        />
      }
    >
      {/* Credit Balance */}
      <CreditBalance
        showRefreshButton={true}
        onPress={handleBalancePress}
        style={styles.balanceCard}
      />

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handlePurchasePress}
        >
          <Text style={styles.actionIcon}>🛒</Text>
          <Text style={styles.actionText}>{t('dashboard.buyCredits')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, canClaim && styles.actionButtonHighlight]}
          onPress={() => navigation?.navigate('DailyBonus')}
        >
          <Text style={styles.actionIcon}>🎁</Text>
          <Text style={styles.actionText}>
            {canClaim ? t('dashboard.claimBonus') : t('dashboard.dailyBonus')}
          </Text>
          {canClaim && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      {/* Daily Bonus Card */}
      <DailyBonusCard style={styles.bonusCard} />

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('dashboard.recentTransactions')}</Text>
          
          {transactions.length > 5 && (
            <TouchableOpacity 
              onPress={() => navigation?.navigate('CreditTransactions')}
            >
              <Text style={styles.seeAllText}>{t('dashboard.seeAll')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {transactionsLoading && recentTransactions.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('dashboard.loadingTransactions')}</Text>
          </View>
        ) : recentTransactions.length > 0 ? (
          <View style={styles.transactionsList}>
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={handleTransactionPress}
                style={index === recentTransactions.length - 1 ? styles.lastTransaction : null}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>{t('dashboard.noTransactions')}</Text>
            <Text style={styles.emptyDescription}>
              {t('dashboard.noTransactionsMessage')}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  balanceCard: {
    margin: 16,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  actionButtonHighlight: {
    borderColor: '#007bff',
    backgroundColor: '#e3f2fd',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#dc3545',
    borderRadius: 4,
  },
  bonusCard: {
    marginHorizontal: 0,
    marginVertical: 8,
  },
  transactionsSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  transactionsList: {
    paddingBottom: 0,
  },
  lastTransaction: {
    borderBottomWidth: 0,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
}); 