import { create } from 'zustand';
import { CreditTransaction } from '../../domain/entities/credit-transaction.entity';
import { CreditProduct } from '../../domain/entities/credit-product.entity';
import { ICreditOrchestratorService } from '../../application/interfaces/credit-orchestrator.service.interface';
import { CreditServiceContainer } from '../../data/factories/credit-service.container';

interface CreditState {
  // State
  balance: number;
  transactions: CreditTransaction[];
  products: CreditProduct[];
  isLoading: boolean;
  error: string;
  
  // Daily Bonus State
  dailyBonus: {
    canClaim: boolean;
    nextClaimTime?: Date;
    currentStreak: number;
    isLoading: boolean;
  };
  
  // Purchase State
  isPurchasing: boolean;
  purchaseError: string;
  
  // Transaction History State
  isLoadingTransactions: boolean;
  hasMoreTransactions: boolean;
  transactionFilters: {
    type?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  };

  // Actions - Balance Operations
  getUserBalance: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  deductCredits: (amount: number, reason: string, metadata?: Record<string, any>) => Promise<CreditTransaction>;
  
  // Actions - Daily Bonus
  claimDailyBonus: () => Promise<{ bonusAmount: number; streak: number }>;
  getDailyBonusStatus: () => Promise<void>;
  
  // Actions - Purchases
  getAvailableProducts: () => Promise<void>;
  processPurchase: (productId: string, purchaseData: Record<string, any>) => Promise<CreditTransaction>;
  
  // Actions - Transactions
  getUserTransactions: (limit?: number, offset?: number) => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  filterTransactions: (filters: any) => Promise<void>;
  clearTransactionFilters: () => void;
  
  // Actions - Referrals
  processReferral: (referrerId: string) => Promise<{ referrerTransaction: CreditTransaction; referredTransaction: CreditTransaction }>;
  
  // Actions - Admin (if user has admin permissions)
  adminAddCredits: (userId: string, amount: number, reason: string) => Promise<CreditTransaction>;
  adminDeductCredits: (userId: string, amount: number, reason: string) => Promise<CreditTransaction>;
  adminGetAnalytics: () => Promise<any>;
  
  // Utility Actions
  clearError: () => void;
  clearPurchaseError: () => void;
  reset: () => void;
}

/**
 * @function getCreditService
 * @description Get credit service from container
 */
const getCreditService = (): ICreditOrchestratorService => {
  const container = CreditServiceContainer.getInstance();
  
  if (!container.isInitialized()) {
    throw new Error('CreditServiceContainer ist nicht initialisiert. Initialisieren Sie es in der App-Startup.');
  }
  
  return container.getCreditOrchestratorService();
};

export const useCreditStore = create<CreditState>((set, get) => ({
  // Initial State
  balance: 0,
  transactions: [],
  products: [],
  isLoading: false,
  error: '',
  
  dailyBonus: {
    canClaim: false,
    currentStreak: 0,
    isLoading: false
  },
  
  isPurchasing: false,
  purchaseError: '',
  
  isLoadingTransactions: false,
  hasMoreTransactions: true,
  transactionFilters: {},

  // Balance Operations
  getUserBalance: async () => {
    set({ isLoading: true, error: '' });
    try {
      const creditService = getCreditService();
      // TODO: User ID sollte vom Auth Store kommen
      const balance = await creditService.getUserCreditBalance('current-user-id');
      set({ balance, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler beim Laden des Guthabens',
        isLoading: false 
      });
    }
  },

  refreshBalance: async () => {
    await get().getUserBalance();
  },

  deductCredits: async (amount: number, reason: string, metadata?: Record<string, any>) => {
    set({ isLoading: true, error: '' });
    try {
      const creditService = getCreditService();
      const transaction = await creditService.deductCredits('current-user-id', amount, reason, metadata);
      
      // Update local balance
      const currentBalance = get().balance;
      set({ 
        balance: currentBalance - amount,
        isLoading: false 
      });
      
      // Add transaction to local state
      const currentTransactions = get().transactions;
      set({ transactions: [transaction, ...currentTransactions] });
      
      return transaction;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler beim Abziehen der Credits',
        isLoading: false 
      });
      throw error;
    }
  },

  // Daily Bonus Operations
  claimDailyBonus: async () => {
    set({ 
      dailyBonus: { ...get().dailyBonus, isLoading: true },
      error: '' 
    });
    
    try {
      const creditService = getCreditService();
      const result = await creditService.claimDailyBonus('current-user-id');
      
      // Update balance
      const currentBalance = get().balance;
      set({ balance: currentBalance + result.bonusAmount });
      
      // Update daily bonus state
      set({
        dailyBonus: {
          canClaim: false,
          currentStreak: result.streak,
          isLoading: false,
          nextClaimTime: new Date(Date.now() + 20 * 60 * 60 * 1000) // 20 hours from now
        }
      });

      // Add transaction to local state
      const currentTransactions = get().transactions;
      set({ transactions: [result.transaction, ...currentTransactions] });
      
      return { bonusAmount: result.bonusAmount, streak: result.streak };
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler beim Einlösen des täglichen Bonus',
        dailyBonus: { ...get().dailyBonus, isLoading: false }
      });
      throw error;
    }
  },

  getDailyBonusStatus: async () => {
    try {
      const creditService = getCreditService();
      const status = await creditService.getDailyBonusStatus('current-user-id');
      set({
        dailyBonus: {
          ...get().dailyBonus,
          canClaim: status.canClaim,
          nextClaimTime: status.nextClaimTime,
          currentStreak: status.currentStreak
        }
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler beim Laden des Bonus-Status'
      });
    }
  },

  // Purchase Operations
  getAvailableProducts: async () => {
    set({ isLoading: true, error: '' });
    try {
      const creditService = getCreditService();
      const products = await creditService.getAvailableProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler beim Laden der Produkte',
        isLoading: false 
      });
    }
  },

  processPurchase: async (productId: string, purchaseData: Record<string, any>) => {
    set({ isPurchasing: true, purchaseError: '' });
    try {
      const creditService = getCreditService();
      const result = await creditService.processPurchase({
        userId: 'current-user-id',
        productId,
        purchaseToken: purchaseData.purchaseToken || '',
        platform: purchaseData.platform || 'ios',
        transactionId: purchaseData.transactionId || '',
        receiptData: purchaseData.receiptData
      });
      
      // Update balance with total credits granted
      const totalCredits = result.creditsGranted + result.bonusCredits;
      const currentBalance = get().balance;
      set({ balance: currentBalance + totalCredits });
      
      // Add transaction to local state
      const currentTransactions = get().transactions;
      set({ 
        transactions: [result.transaction, ...currentTransactions],
        isPurchasing: false 
      });
      
      return result.transaction;
    } catch (error) {
      set({ 
        purchaseError: error instanceof Error ? error.message : 'Fehler beim Kauf',
        isPurchasing: false 
      });
      throw error;
    }
  },

  // Transaction Operations
  getUserTransactions: async (limit = 20, offset = 0) => {
    set({ isLoadingTransactions: true, error: '' });
    try {
      const creditService = getCreditService();
      const result = await creditService.getUserTransactions({
        userId: 'current-user-id',
        limit,
        page: Math.floor(offset / limit) + 1
      });
      
      if (offset === 0) {
        // Fresh load
        set({ 
          transactions: result.transactions, 
          isLoadingTransactions: false,
          hasMoreTransactions: result.hasMore
        });
      } else {
        // Load more
        const currentTransactions = get().transactions;
        set({ 
          transactions: [...currentTransactions, ...result.transactions],
          isLoadingTransactions: false,
          hasMoreTransactions: result.hasMore
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler beim Laden der Transaktionen',
        isLoadingTransactions: false 
      });
    }
  },

  loadMoreTransactions: async () => {
    const { transactions, hasMoreTransactions, isLoadingTransactions } = get();
    
    if (!hasMoreTransactions || isLoadingTransactions) {
      return;
    }
    
    await get().getUserTransactions(20, transactions.length);
  },

  filterTransactions: async (filters: any) => {
    set({ transactionFilters: filters });
    // Hier würde eine gefilterte Suche implementiert werden
    // Für jetzt laden wir einfach alle Transaktionen neu
    await get().getUserTransactions();
  },

  clearTransactionFilters: () => {
    set({ transactionFilters: {} });
  },

  // Referral Operations
  processReferral: async (referrerId: string) => {
    set({ isLoading: true, error: '' });
    try {
      const creditService = getCreditService();
      const result = await creditService.processReferral({
        referrerUserId: referrerId,
        refereeUserId: 'current-user-id',
        referralCode: '', // Should be provided by the UI
        type: 'signup'
      });
      
      // Update balance with referee bonus
      const currentBalance = get().balance;
      set({ balance: currentBalance + result.refereeCredits });
      
      // Note: We don't have access to the actual transactions here
      // In a real implementation, we would need to fetch the latest transactions
      await get().getUserTransactions();
      
      return {
        referrerTransaction: {} as CreditTransaction, // Placeholder
        referredTransaction: {} as CreditTransaction  // Placeholder
      };
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler bei der Empfehlung',
        isLoading: false 
      });
      throw error;
    }
  },

  // Admin Operations (placeholder)
  adminAddCredits: async (userId: string, amount: number, reason: string) => {
    set({ isLoading: true, error: '' });
    try {
      const creditService = getCreditService();
      return await creditService.adminAddCredits(userId, amount, reason, 'current-admin-id');
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler beim Hinzufügen der Credits',
        isLoading: false 
      });
      throw error;
    }
  },

  adminDeductCredits: async (userId: string, amount: number, reason: string) => {
    set({ isLoading: true, error: '' });
    try {
      const creditService = getCreditService();
      return await creditService.adminDeductCredits(userId, amount, reason, 'current-admin-id');
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler beim Abziehen der Credits',
        isLoading: false 
      });
      throw error;
    }
  },

  adminGetAnalytics: async () => {
    set({ isLoading: true, error: '' });
    try {
      const creditService = getCreditService();
      return await creditService.getCreditAnalytics({
        userId: 'current-admin-id', // For admin analytics, pass admin user ID
        includeAdmin: true
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fehler beim Laden der Analyse',
        isLoading: false 
      });
      throw error;
    }
  },

  // Utility Actions
  clearError: () => set({ error: '' }),
  clearPurchaseError: () => set({ purchaseError: '' }),
  
  reset: () => set({
    balance: 0,
    transactions: [],
    products: [],
    isLoading: false,
    error: '',
    dailyBonus: {
      canClaim: false,
      currentStreak: 0,
      isLoading: false
    },
    isPurchasing: false,
    purchaseError: '',
    isLoadingTransactions: false,
    hasMoreTransactions: true,
    transactionFilters: {}
  })
})); 