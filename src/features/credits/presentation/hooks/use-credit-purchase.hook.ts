import { useEffect } from 'react';
import { useCreditStore } from '../store/credit.store';
import { CreditProduct } from '../../domain/entities/credit-product.entity';

export const useCreditPurchase = () => {
  const {
    products,
    isPurchasing,
    purchaseError,
    isLoading,
    getAvailableProducts,
    processPurchase,
    clearPurchaseError
  } = useCreditStore();

  // Auto-load products on mount
  useEffect(() => {
    getAvailableProducts();
  }, [getAvailableProducts]);

  const handlePurchase = async (productId: string, purchaseData: Record<string, any>) => {
    try {
      clearPurchaseError();
      const transaction = await processPurchase(productId, purchaseData);
      return transaction;
    } catch (error) {
      throw error;
    }
  };

  const getProductByTier = (tier: string): CreditProduct | undefined => {
    return products.find(product => 
      product.name.toLowerCase().includes(tier.toLowerCase()) ||
      product.metadata?.originalProductId?.includes(tier)
    );
  };

  const getMostPopularProduct = (): CreditProduct | undefined => {
    return products.find(product => product.isPopular);
  };

  const getBestValueProduct = (): CreditProduct | undefined => {
    // Calculate credits per price ratio
    return products.reduce((best, current) => {
      const currentValue = (current.credits + current.bonusCredits) / current.price;
      const bestValue = best ? (best.credits + best.bonusCredits) / best.price : 0;
      
      return currentValue > bestValue ? current : best;
    }, undefined as CreditProduct | undefined);
  };

  const formatProductValue = (product: CreditProduct): string => {
    const totalCredits = product.credits + product.bonusCredits;
    const baseCredits = product.credits;
    
    if (product.bonusCredits > 0) {
      return `${baseCredits} + ${product.bonusCredits} Bonus = ${totalCredits} Credits`;
    }
    
    return `${totalCredits} Credits`;
  };

  const sortedProducts = [...products].sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    // State
    products: sortedProducts,
    isPurchasing,
    purchaseError,
    isLoading,
    
    // Actions
    purchase: handlePurchase,
    refreshProducts: getAvailableProducts,
    clearError: clearPurchaseError,
    
    // Utilities
    getProductByTier,
    getMostPopularProduct,
    getBestValueProduct,
    formatProductValue,
    
    // Computed
    hasProducts: products.length > 0,
    popularProduct: getMostPopularProduct(),
    bestValueProduct: getBestValueProduct()
  };
}; 