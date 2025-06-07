import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CreditTransaction } from '../../../domain/entities/credit-transaction.entity';

interface TransactionItemProps {
  transaction: CreditTransaction;
  onPress?: (transaction: CreditTransaction) => void;
  style?: any;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  style
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(transaction);
    }
  };

  const getTransactionIcon = (): string => {
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

  const getTransactionTypeLabel = (): string => {
    switch (transaction.transactionType) {
      case 'purchase':
        return 'Kauf';
      case 'daily_bonus':
        return 'Täglicher Bonus';
      case 'referral':
        return 'Empfehlung';
      case 'admin_grant':
        return 'Admin-Gutschrift';
      case 'usage':
        return 'Verwendet';
      case 'refund':
        return 'Rückerstattung';
      default:
        return 'Transaktion';
    }
  };

  const getAmountColor = (): string => {
    if (transaction.amount > 0) return '#28a745'; // Green for positive
    if (transaction.amount < 0) return '#dc3545'; // Red for negative
    return '#6c757d'; // Gray for zero
  };

  const formatAmount = (): string => {
    const sign = transaction.amount >= 0 ? '+' : '';
    return `${sign}${transaction.amount}`;
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const transactionDate = new Date(date);
    
    if (transactionDate.toDateString() === today.toDateString()) {
      return transactionDate.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (transactionDate.toDateString() === yesterday.toDateString()) {
      return 'Gestern';
    } else {
      return transactionDate.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: transactionDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getStatusColor = (): string => {
    switch (transaction.status) {
      case 'completed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'failed':
        return '#dc3545';
      case 'cancelled':
        return '#6c757d';
      case 'refunded':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const getStatusLabel = (): string => {
    switch (transaction.status) {
      case 'completed':
        return 'Abgeschlossen';
      case 'pending':
        return 'Ausstehend';
      case 'failed':
        return 'Fehlgeschlagen';
      case 'cancelled':
        return 'Abgebrochen';
      case 'refunded':
        return 'Erstattet';
      default:
        return transaction.status;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getTransactionIcon()}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.type}>{getTransactionTypeLabel()}</Text>
          <Text style={[styles.amount, { color: getAmountColor() }]}>
            {formatAmount()} ⭐
          </Text>
        </View>

        {transaction.description && (
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
          
          {transaction.status !== 'completed' && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusLabel()}</Text>
            </View>
          )}
        </View>

        {/* Metadata details für bestimmte Transaktionstypen */}
        {transaction.metadata?.streakDay && (
          <Text style={styles.metadata}>
            Serie: Tag {transaction.metadata.streakDay}
          </Text>
        )}

        {transaction.metadata?.productId && (
          <Text style={styles.metadata}>
            Produkt-ID: {transaction.metadata.productId}
          </Text>
        )}
      </View>

      {onPress && (
        <View style={styles.chevron}>
          <Text style={styles.chevronText}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#6c757d',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  metadata: {
    fontSize: 12,
    color: '#007bff',
    marginTop: 2,
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 20,
    color: '#6c757d',
  },
}); 