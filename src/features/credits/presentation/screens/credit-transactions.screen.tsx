import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  RefreshControl, 
  Text,
  TouchableOpacity,
  FlatList 
} from 'react-native';
import { 
  CreditBalance, 
  TransactionItem 
} from '../components';
import { 
  useCredits, 
  useCreditTransactions 
} from '../hooks';
import { useTranslation } from 'react-i18next';

interface CreditTransactionsProps {
  navigation?: any; // React Navigation prop
}

export const CreditTransactions: React.FC<CreditTransactionsProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { refreshBalance } = useCredits();
  const { 
    transactions: _transactions,
    groupedTransactions,
    isLoading,
    hasMore,
    stats,
    error,
    loadMore,
    refresh,
    isEmpty,
    clearError
  } = useCreditTransactions();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshBalance(),
        refresh()
      ]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  };

  const handleTransactionPress = (transaction: any) => {
    // Navigate to transaction detail screen
    navigation?.navigate('TransactionDetail', { 
      transactionId: transaction.id 
    });
  };

  const handleStatsPress = () => {
    navigation?.navigate('CreditAnalytics');
  };

  const renderTransactionGroup = ({ item }: { item: [string, any[]] }) => {
    const [date, dayTransactions] = item;
    
    return (
      <View style={styles.dateGroup}>
        <Text style={styles.dateHeader}>{formatDateHeader(date)}</Text>
        {dayTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onPress={handleTransactionPress}
          />
        ))}
      </View>
    );
  };

  const formatDateHeader = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('transactions.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('transactions.yesterday');
    } else {
      return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>{t('transactions.loadingMore')}</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>{t('transactions.noTransactions')}</Text>
      <Text style={styles.emptyDescription}>
        {t('transactions.noTransactionsMessage')}
      </Text>
    </View>
  );

  React.useEffect(() => {
    if (error) {
      // Simple error handling - could be enhanced with better UX
      console.error('Transaction error:', error);
      clearError();
    }
  }, [error, clearError]);

  const groupedData = Object.entries(groupedTransactions);

  return (
    <View style={styles.container}>
      {/* Header with Balance and Stats */}
      <View style={styles.header}>
        <CreditBalance
          showRefreshButton={false}
          style={styles.balanceCard}
        />
        
        {stats.totalTransactions > 0 && (
          <TouchableOpacity 
            style={styles.statsCard}
            onPress={handleStatsPress}
          >
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>+{stats.totalCreditsEarned}</Text>
                <Text style={styles.statLabel}>{t('transactions.stats.earned')}</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-{stats.totalCreditsSpent}</Text>
                <Text style={styles.statLabel}>{t('transactions.stats.spent')}</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalTransactions}</Text>
                <Text style={styles.statLabel}>{t('transactions.stats.total')}</Text>
              </View>
            </View>
            
            <Text style={styles.statsHint}>{t('transactions.stats.tapForDetails')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Transactions List */}
      {isEmpty ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#007bff"
            />
          }
        >
          {renderEmpty()}
        </ScrollView>
      ) : (
        <FlatList
          data={groupedData}
          renderItem={renderTransactionGroup}
          keyExtractor={(item) => item[0]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#007bff"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  balanceCard: {
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e9ecef',
    marginHorizontal: 8,
  },
  statsHint: {
    fontSize: 12,
    color: '#007bff',
    textAlign: 'center',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  dateGroup: {
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6c757d',
  },
  emptyContainer: {
    padding: 64,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
}); 