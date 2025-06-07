/**
 * @fileoverview Credit Orchestrator Service Interface
 * @description Service interface for coordinating credit operations
 * 
 * @module ICreditOrchestratorService
 */

import { CreditBalance } from '../../domain/entities/credit-transaction.entity';
import { CreditTransaction } from '../../domain/entities/credit-transaction.entity';
import { CreditProduct } from '../../domain/entities/credit-product.entity';

export interface ICreditOrchestratorService {
  // Balance Operations
  getBalance(userId: string): Promise<CreditBalance>;
  addCredits(userId: string, amount: number, description: string): Promise<void>;
  subtractCredits(userId: string, amount: number, description: string): Promise<void>;
  processTransaction(userId: string, type: string, amount: number, description: string): Promise<void>;
  
  // Store-Convenience Methods (high-level operations)
  getUserCreditBalance(userId: string): Promise<number>;
  deductCredits(userId: string, amount: number, reason: string, metadata?: Record<string, any>): Promise<CreditTransaction>;
  
  // Product Operations
  getAvailableProducts(): Promise<CreditProduct[]>;
  
  // Purchase Operations
  processPurchase(request: {
    userId: string;
    productId: string;
    purchaseToken: string;
    platform: 'ios' | 'android';
    transactionId: string;
    receiptData?: string;
  }): Promise<{
    creditsGranted: number;
    bonusCredits: number;
    transaction: CreditTransaction;
  }>;

  // Transaction Operations
  getUserTransactions(request: {
    userId: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sortDirection?: 'asc' | 'desc';
  }): Promise<{
    transactions: CreditTransaction[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  }>;

  // Analytics Operations
  getCreditAnalytics(request: {
    userId: string;
    startDate?: Date;
    endDate?: Date;
    includeAdmin?: boolean;
  }): Promise<{
    currentBalance: number;
    totalEarned: number;
    totalSpent: number;
    totalPurchases: number;
    dailyBonusesClaimed: number;
    referralCredits: number;
    transactionsByType: Record<string, number>;
    creditsByMonth: Array<{
      month: string;
      earned: number;
      spent: number;
    }>;
  }>;

  // Referral Operations
  processReferral(request: {
    referrerUserId: string;
    refereeUserId: string;
    referralCode: string;
    type: 'signup' | 'purchase' | 'achievement';
    metadata?: Record<string, any>;
  }): Promise<{
    referrerCredits: number;
    refereeCredits: number;
  }>;

  // Daily Bonus Operations (Enhanced for Store)
  getDailyBonusStatus(userId: string): Promise<{ 
    canClaim: boolean; 
    streak: number;
    nextClaimTime?: Date;
    currentStreak: number;
  }>;
  claimDailyBonus(userId: string): Promise<{
    creditsGranted: number;
    bonusAmount: number;
    streak: number;
    transaction: CreditTransaction;
  }>;

  // Admin Operations
  adminAddCredits(userId: string, amount: number, reason: string, adminId: string): Promise<CreditTransaction>;
  adminDeductCredits(userId: string, amount: number, reason: string, adminId: string): Promise<CreditTransaction>;
  adminGetAnalytics(): Promise<any>;
} 