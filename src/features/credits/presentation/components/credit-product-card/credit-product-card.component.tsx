import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CreditProduct } from '../../../domain/entities/credit-product.entity';

interface CreditProductCardProps {
  product: CreditProduct;
  onPurchase: (productId: string) => void;
  isPurchasing?: boolean;
  style?: any;
}

export const CreditProductCard: React.FC<CreditProductCardProps> = ({
  product,
  onPurchase,
  isPurchasing = false,
  style
}) => {
  const { t } = useTranslation();
  const totalCredits = product.credits + product.bonusCredits;
  const hasBonus = product.bonusCredits > 0;
  
  const handlePurchase = () => {
    if (!isPurchasing) {
      onPurchase(product.id);
    }
  };

  const getCardStyle = () => {
    if (product.isPopular) {
      return [styles.container, styles.popularCard];
    }
    return styles.container;
  };

  return (
    <TouchableOpacity 
      style={[getCardStyle(), style]} 
      onPress={handlePurchase}
      disabled={isPurchasing || !product.isActive}
      activeOpacity={0.8}
    >
      {product.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>🔥 BELIEBT</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.productName}>{product.name}</Text>
        {product.metadata?.discountPercentage && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{product.metadata.discountPercentage}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.creditsSection}>
        <View style={styles.creditsRow}>
          <Text style={styles.baseCredits}>{product.credits}</Text>
          <Text style={styles.creditIcon}>⭐</Text>
        </View>
        
        {hasBonus && (
          <View style={styles.bonusRow}>
            <Text style={styles.bonusText}>+ {product.bonusCredits} {t('bonusText')}</Text>
            <Text style={styles.totalCredits}>= {totalCredits} {t('totalText')}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.footer}>
        <View style={styles.priceSection}>
          <Text style={styles.price}>{product.localizedPrice}</Text>
          {product.metadata?.introductoryPrice && (
            <Text style={styles.originalPrice}>{product.metadata.introductoryPrice}</Text>
          )}
        </View>

        <View style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}>
          <Text style={styles.purchaseButtonText}>
            {isPurchasing ? 'Kaufe...' : 'Kaufen'}
          </Text>
        </View>
      </View>

      {product.metadata?.limitedTimeOffer && product.metadata?.offerEndDate && (
        <View style={styles.offerBadge}>
          <Text style={styles.offerText}>
            ⏰ Begrenzte Zeit!
          </Text>
        </View>
      )}

      {!product.isActive && (
        <View style={styles.inactiveOverlay}>
          <Text style={styles.inactiveText}>Nicht verfügbar</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  popularCard: {
    borderColor: '#ff6b35',
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#ff6b35',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  creditsSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  baseCredits: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#495057',
  },
  creditIcon: {
    fontSize: 28,
  },
  bonusRow: {
    alignItems: 'center',
    marginTop: 4,
  },
  bonusText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  totalCredits: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  originalPrice: {
    fontSize: 12,
    color: '#6c757d',
    textDecorationLine: 'line-through',
  },
  purchaseButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  purchaseButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  offerBadge: {
    position: 'absolute',
    bottom: -8,
    right: 16,
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  offerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: 'bold',
  },
}); 