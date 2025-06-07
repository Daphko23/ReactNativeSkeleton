import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  RefreshControl, 
  Text,
  Alert,
  Dimensions 
} from 'react-native';
import { 
  CreditBalance, 
  CreditProductCard 
} from '../components';
import { 
  useCredits, 
  useCreditPurchase 
} from '../hooks';
import { useTranslation } from 'react-i18next';

interface CreditShopProps {
  navigation?: any; // React Navigation prop
}

export const CreditShop: React.FC<CreditShopProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { balance: _balance, refreshBalance } = useCredits();
  const { 
    products, 
    isPurchasing: _isPurchasing, 
    purchaseError, 
    isLoading, 
    purchase, 
    refreshProducts,
    popularProduct,
    bestValueProduct,
    clearError 
  } = useCreditPurchase();

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [purchasingProductId, setPurchasingProductId] = React.useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshBalance(),
        refreshProducts()
      ]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePurchase = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setPurchasingProductId(productId);
    
    try {
      // Hier würde die echte In-App Purchase Logik stehen
      // Für Demo-Zwecke simulieren wir den Kauf
      const mockPurchaseData = {
        transactionId: `mock_${Date.now()}`,
        purchaseToken: `token_${Date.now()}`,
        receipt: 'mock_receipt_data',
        platform: 'mock' as const,
        purchaseDate: new Date(),
        isTestPurchase: true
      };

      const _transaction = await purchase(productId, mockPurchaseData);
      
      Alert.alert(
        t('credits.shopScreen.purchaseSuccess'),
        t('credits.shopScreen.purchaseSuccessMessage', { amount: product.credits + product.bonusCredits }),
        [
          { 
            text: t('credits.shopScreen.purchaseSuccessButton'), 
            onPress: () => {
              // Zurück zur Dashboard
              navigation?.goBack();
            }
          }
        ]
      );

    } catch (error) {
      Alert.alert(
        t('credits.shopScreen.purchaseFailed'),
        error instanceof Error ? error.message : t('credits.shopScreen.purchaseFailedMessage'),
        [{ text: t('common.ok'), style: 'default' }]
      );
    } finally {
      setPurchasingProductId(null);
    }
  };

  React.useEffect(() => {
    if (purchaseError) {
      Alert.alert(
        t('common.error'),
        purchaseError,
        [
          { text: t('common.ok'), onPress: clearError }
        ]
      );
    }
  }, [purchaseError, clearError, t]);

  // Group products into rows for better layout
  const productRows = [];
  for (let i = 0; i < products.length; i += 2) {
    productRows.push(products.slice(i, i + 2));
  }

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
      {/* Header Section */}
      <View style={styles.header}>
        <CreditBalance
          showRefreshButton={false}
          style={styles.balanceCard}
        />
        
        <Text style={styles.title}>{t('credits.shopScreen.packages')}</Text>
        <Text style={styles.subtitle}>
          {t('credits.shopScreen.subtitle')}
        </Text>
      </View>

      {/* Loading State */}
      {isLoading && products.length === 0 && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('credits.shopScreen.loadingProducts')}</Text>
        </View>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <View style={styles.productsContainer}>
          {productRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.productRow}>
              {row.map((product) => (
                <View key={product.id} style={styles.productContainer}>
                  <CreditProductCard
                    product={product}
                    onPurchase={handlePurchase}
                    isPurchasing={purchasingProductId === product.id}
                  />
                  
                  {/* Special Badges */}
                  {product.id === popularProduct?.id && (
                    <View style={styles.specialBadge}>
                      <Text style={styles.specialBadgeText}>{t('credits.shopScreen.popular')}</Text>
                    </View>
                  )}
                  
                  {product.id === bestValueProduct?.id && product.id !== popularProduct?.id && (
                    <View style={[styles.specialBadge, styles.bestValueBadge]}>
                      <Text style={styles.specialBadgeText}>{t('credits.shopScreen.bestValue')}</Text>
                    </View>
                  )}
                </View>
              ))}
              
              {/* Fill empty space if odd number of products */}
              {row.length === 1 && <View style={styles.productContainer} />}
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>{t('credits.shopScreen.noProducts')}</Text>
          <Text style={styles.emptyDescription}>
            {t('credits.shopScreen.noProductsMessage')}
          </Text>
        </View>
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('credits.shopScreen.whyBuyCredits')}</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>{t('credits.shopScreen.benefits.unlimitedAccess')}</Text>
            <Text style={styles.infoItem}>{t('credits.shopScreen.benefits.premiumFeatures')}</Text>
            <Text style={styles.infoItem}>{t('credits.shopScreen.benefits.noAds')}</Text>
            <Text style={styles.infoItem}>{t('credits.shopScreen.benefits.exclusiveContent')}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🎁 Bonus-Credits!</Text>
          <Text style={styles.infoText}>
            Größere Pakete enthalten Bonus-Credits! Je mehr du kaufst, desto mehr sparst du.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔒 Sicher & Verschlüsselt</Text>
          <Text style={styles.infoText}>
            Alle Zahlungen werden sicher über den App Store bzw. Google Play abgewickelt.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('shop.bonusCredits')}</Text>
          <Text style={styles.infoText}>
            {t('shop.bonusCreditsDescription')}
          </Text>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const productWidth = (width - 48) / 2; // 2 products per row with margins

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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  productsContainer: {
    padding: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productContainer: {
    width: productWidth,
    position: 'relative',
  },
  specialBadge: {
    position: 'absolute',
    top: -4,
    right: 8,
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  bestValueBadge: {
    backgroundColor: '#6f42c1',
  },
  specialBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 64,
    alignItems: 'center',
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
  },
  infoSection: {
    padding: 16,
    paddingTop: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  infoList: {
    gap: 4,
  },
  infoItem: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
}); 