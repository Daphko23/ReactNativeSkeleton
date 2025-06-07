import { useEffect } from 'react';
import { useCreditStore } from '../store/credit.store';

export const useCredits = () => {
  const {
    // State
    balance,
    isLoading,
    error,
    transactions,
    products,
    
    // Actions
    getUserBalance,
    refreshBalance,
    deductCredits,
    clearError
  } = useCreditStore();

  // Auto-load balance on mount
  useEffect(() => {
    getUserBalance();
  }, [getUserBalance]);

  return {
    // State
    balance,
    isLoading,
    error,
    transactions,
    products,
    
    // Actions
    refreshBalance,
    deductCredits,
    clearError,
    
    // Computed
    hasCredits: balance > 0,
    canAfford: (amount: number) => balance >= amount
  };
}; 