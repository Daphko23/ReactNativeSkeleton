/**
 * @fileoverview Credit Repository Interface - Domain Layer
 * @description Definiert Contracts für Credit-Datenoperationen
 * 
 * @module ICreditRepository
 */

import { CreditTransaction, CreditBalance, DailyBonusResult, PurchaseResult } from '../entities/credit-transaction.entity';
import { ProductPurchase } from '../entities/credit-product.entity';

export interface ICreditRepository {
  // Balance Operations
  getCreditBalance(userId: string): Promise<CreditBalance>;
  updateCreditBalance(userId: string, amount: number, transactionType: string): Promise<CreditBalance>;

  // Transaction Operations
  createTransaction(transaction: Omit<CreditTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreditTransaction>;
  getTransaction(transactionId: string): Promise<CreditTransaction | null>;
  getTransactionsByUser(userId: string, limit?: number, offset?: number): Promise<CreditTransaction[]>;
  updateTransactionStatus(transactionId: string, status: string): Promise<CreditTransaction>;
  getTransactionByReference(referenceId: string): Promise<CreditTransaction | null>;
  getTransactionByExternalId(externalId: string): Promise<CreditTransaction | null>;
  getAllTransactions(limit?: number, offset?: number): Promise<CreditTransaction[]>;

  // Daily Bonus Operations
  getLastDailyBonus(userId: string): Promise<Date | null>;
  getDailyStreakCount(userId: string): Promise<number>;
  claimDailyBonus(userId: string, creditsEarned: number, streakDays: number): Promise<DailyBonusResult>;

  // Purchase Operations
  processPurchase(userId: string, purchase: ProductPurchase, creditsToAdd: number): Promise<PurchaseResult>;
  verifyPurchaseReceipt(receipt: string, platform: string): Promise<boolean>;
  isPurchaseProcessed(transactionId: string): Promise<boolean>;

  // Referral Operations
  processReferral(userId: string, referralCode: string, creditsEarned: number): Promise<CreditTransaction>;
  hasUsedReferralCode(userId: string): Promise<boolean>;
  getUserByReferralCode(referralCode: string): Promise<string | null>;

  // Admin Operations
  adminGrantCredits(userId: string, amount: number, reason: string, adminUserId: string): Promise<CreditTransaction>;
  adminDeductCredits(userId: string, amount: number, reason: string, adminUserId: string): Promise<CreditTransaction>;
  getSystemStats(): Promise<CreditSystemStats>;

  // Maintenance Operations
  cleanupExpiredTransactions(olderThanDays: number): Promise<number>;
  recalculateUserBalance(userId: string): Promise<CreditBalance>;
}

export interface CreditSystemStats {
  totalUsers: number;
  totalCreditsIssued: number;
  totalCreditsSpent: number;
  totalPurchases: number;
  totalRevenue: number;
  averageCreditsPerUser: number;
  dailyActiveUsers: number;
  conversionRate: number;
  topProducts: Array<{
    productId: string;
    sales: number;
    revenue: number;
  }>;
} 