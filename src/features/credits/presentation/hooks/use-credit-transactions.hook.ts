import { useEffect, useMemo } from 'react';
import { useCreditStore } from '../store/credit.store';
import { CreditTransaction } from '../../domain/entities/credit-transaction.entity';

export const useCreditTransactions = (autoLoad = true) => {
  const {
    transactions,
    isLoadingTransactions,
    hasMoreTransactions,
    transactionFilters,
    error,
    getUserTransactions,
    loadMoreTransactions,
    filterTransactions,
    clearTransactionFilters,
    clearError
  } = useCreditStore();

  // Auto-load transactions on mount
  useEffect(() => {
    if (autoLoad && transactions.length === 0) {
      getUserTransactions();
    }
  }, [autoLoad, getUserTransactions, transactions.length]);

  const handleLoadMore = async () => {
    if (!isLoadingTransactions && hasMoreTransactions) {
      await loadMoreTransactions();
    }
  };

  const handleFilter = async (filters: {
    type?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    await filterTransactions(filters);
  };

  const refreshTransactions = async () => {
    await getUserTransactions();
  };

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, CreditTransaction[]> = {};
    
    transactions.forEach(transaction => {
      const date = transaction.createdAt.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });

    return groups;
  }, [transactions]);

  // Calculate transaction statistics
  const transactionStats = useMemo(() => {
    const stats = {
      totalCreditsEarned: 0,
      totalCreditsSpent: 0,
      totalTransactions: transactions.length,
      transactionsByType: {} as Record<string, number>
    };

    transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        stats.totalCreditsEarned += transaction.amount;
      } else {
        stats.totalCreditsSpent += Math.abs(transaction.amount);
      }

      stats.transactionsByType[transaction.transactionType] = 
        (stats.transactionsByType[transaction.transactionType] || 0) + 1;
    });

    return stats;
  }, [transactions]);

  // Filter transactions by type
  const getTransactionsByType = (type: string): CreditTransaction[] => {
    return transactions.filter(transaction => transaction.transactionType === type);
  };

  // Get recent transactions (last 7 days)
  const recentTransactions = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return transactions.filter(transaction => 
      transaction.createdAt >= sevenDaysAgo
    );
  }, [transactions]);

  // Format transaction amount with sign
  const formatTransactionAmount = (transaction: CreditTransaction): string => {
    const sign = transaction.amount >= 0 ? '+' : '';
    return `${sign}${transaction.amount}`;
  };

  // Get transaction icon based on type
  const getTransactionIcon = (transaction: CreditTransaction): string => {
    switch (transaction.transactionType) {
      case 'purchase':
        return '💳';
      case 'daily_bonus':
        return '🎁';
      case 'referral':
        return '👥';
      case 'admin_grant':
        return '⭐';
      case 'usage':
        return '📖';
      case 'refund':
        return '💸';
      default:
        return '💰';
    }
  };

  // Get transaction color based on amount
  const getTransactionColor = (transaction: CreditTransaction): 'green' | 'red' | 'gray' => {
    if (transaction.amount > 0) return 'green';
    if (transaction.amount < 0) return 'red';
    return 'gray';
  };

  return {
    // State
    transactions,
    groupedTransactions,
    isLoading: isLoadingTransactions,
    hasMore: hasMoreTransactions,
    filters: transactionFilters,
    error,
    
    // Actions
    loadMore: handleLoadMore,
    filter: handleFilter,
    clearFilters: clearTransactionFilters,
    refresh: refreshTransactions,
    clearError,
    
    // Data
    stats: transactionStats,
    recentTransactions,
    
    // Utilities
    getTransactionsByType,
    formatTransactionAmount,
    getTransactionIcon,
    getTransactionColor,
    
    // Computed
    hasTransactions: transactions.length > 0,
    hasActiveFilters: Object.keys(transactionFilters).length > 0,
    isEmpty: transactions.length === 0 && !isLoadingTransactions
  };
}; 