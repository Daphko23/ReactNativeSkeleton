/**
 * CreditTransaction Entity - Domain Layer
 * Repräsentiert eine Credit-Transaktion im System
 */

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: TransactionType;
  referenceId?: string;
  description?: string;
  metadata?: TransactionMetadata;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = 
  | 'purchase' 
  | 'daily_bonus' 
  | 'referral' 
  | 'admin_grant'
  | 'admin_deduct'
  | 'refund'
  | 'usage'
  | 'expiry';

export type TransactionStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface TransactionMetadata {
  platform?: 'ios' | 'android' | 'web';
  productId?: string;
  purchaseToken?: string;
  streakDay?: number;
  streak?: number;
  referredUserId?: string;
  storyId?: string;
  reason?: string;
  adminUserId?: string;
  adminId?: string;
  originalTransactionId?: string;
}

export interface DailyBonusResult {
  success: boolean;
  creditsEarned: number;
  newBalance: number;
  isStreak: boolean;
  streakDays: number;
  nextBonusAt: Date;
}

export interface PurchaseResult {
  success: boolean;
  transactionId: string;
  creditsAdded: number;
  newBalance: number;
  receiptVerified: boolean;
}

export interface CreditBalance {
  totalCredits: number;
  lastUpdated: Date;
  lastFreeCredit: Date | null;
  dailyStreakDays: number;
} 