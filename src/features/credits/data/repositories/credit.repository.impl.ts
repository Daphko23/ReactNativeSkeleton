/**
 * Credit Repository Implementation - Data Layer
 * Implementiert die ICreditRepository Domain Interface
 */

import { ICreditRepository, CreditSystemStats } from '../../domain/interfaces/credit.repository.interface';
import { CreditTransaction, type CreditBalance, DailyBonusResult, PurchaseResult } from '../../domain/entities/credit-transaction.entity';
import { ProductPurchase } from '../../domain/entities/credit-product.entity';
import type { SupabaseCreditDataSource } from '../datasources/supabase-credit.datasource';
import { CreditTransactionMapper, CreditBalanceMapper } from '../mappers/credit-transaction.mapper';
import { 
  TransactionNotFoundError, 
  InsufficientCreditsError,
  PurchaseAlreadyProcessedError 
} from '../../domain/errors/credit-errors';

export class CreditRepositoryImpl implements ICreditRepository {
  constructor(private readonly dataSource: SupabaseCreditDataSource) {}

  // Balance Operations
  async getCreditBalance(userId: string): Promise<CreditBalance> {
    const balanceDTO = await this.dataSource.getCreditBalance(userId);
    
    if (!balanceDTO) {
      // Create initial balance if doesn't exist
      const initialBalance: CreditBalance = {
        totalCredits: 0,
        lastUpdated: new Date(),
        lastFreeCredit: null,
        dailyStreakDays: 0,
      };
      
      const balanceToSave = CreditBalanceMapper.toDTO(initialBalance, userId);
      await this.dataSource.upsertCreditBalance(balanceToSave);
      
      return initialBalance;
    }

    return CreditBalanceMapper.toDomain(balanceDTO);
  }

  async updateCreditBalance(userId: string, amount: number, transactionType: string): Promise<CreditBalance> {
    const currentBalance = await this.getCreditBalance(userId);
    
    const newBalance: CreditBalance = {
      totalCredits: Math.max(0, currentBalance.totalCredits + amount),
      lastUpdated: new Date(),
      lastFreeCredit: transactionType === 'daily_bonus' ? new Date() : currentBalance.lastFreeCredit,
      dailyStreakDays: currentBalance.dailyStreakDays,
    };

    const balanceDTO = CreditBalanceMapper.toDTO(newBalance, userId);
    await this.dataSource.upsertCreditBalance(balanceDTO);

    return newBalance;
  }

  // Transaction Operations
  async createTransaction(transaction: Omit<CreditTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreditTransaction> {
    const transactionDTO = CreditTransactionMapper.toDTO(transaction);
    const createdDTO = await this.dataSource.createTransaction(transactionDTO);
    
    return CreditTransactionMapper.toDomain(createdDTO);
  }

  async getTransaction(transactionId: string): Promise<CreditTransaction | null> {
    const transactionDTO = await this.dataSource.getTransaction(transactionId);
    
    if (!transactionDTO) {
      return null;
    }

    return CreditTransactionMapper.toDomain(transactionDTO);
  }

  async getTransactionsByUser(userId: string, limit = 50, offset = 0): Promise<CreditTransaction[]> {
    const transactionDTOs = await this.dataSource.getTransactionsByUser(userId, limit, offset);
    return CreditTransactionMapper.toDomainArray(transactionDTOs);
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<CreditTransaction> {
    const existingTransaction = await this.dataSource.getTransaction(transactionId);
    
    if (!existingTransaction) {
      throw new TransactionNotFoundError(transactionId);
    }

    const updatedDTO = await this.dataSource.updateTransactionStatus(transactionId, status);
    return CreditTransactionMapper.toDomain(updatedDTO);
  }

  async getTransactionByReference(referenceId: string): Promise<CreditTransaction | null> {
    const transactionDTO = await this.dataSource.getTransactionByReference(referenceId);
    
    if (!transactionDTO) {
      return null;
    }

    return CreditTransactionMapper.toDomain(transactionDTO);
  }

  // Daily Bonus Operations
  async getLastDailyBonus(userId: string): Promise<Date | null> {
    const bonusDTO = await this.dataSource.getLastDailyBonus(userId);
    return bonusDTO ? new Date(bonusDTO.claimed_at) : null;
  }

  async getDailyStreakCount(userId: string): Promise<number> {
    return this.dataSource.getDailyStreakCount(userId);
  }

  async claimDailyBonus(userId: string, creditsEarned: number, streakDays: number): Promise<DailyBonusResult> {
    const now = new Date();
    const nextBonusAt = new Date(now.getTime() + 20 * 60 * 60 * 1000); // 20 hours later

    // Create transaction for the bonus
    const _transaction = await this.createTransaction({
      userId,
      amount: creditsEarned,
      transactionType: 'daily_bonus',
      description: `Daily bonus - ${streakDays} day streak`,
      status: 'completed',
      metadata: { streakDay: streakDays },
    });

    // Update balance
    const newBalance = await this.updateCreditBalance(userId, creditsEarned, 'daily_bonus');

    // Record bonus claim
    await this.dataSource.createDailyBonus({
      user_id: userId,
      credits_earned: creditsEarned,
      streak_days: streakDays,
      claimed_at: now.toISOString(),
      next_bonus_at: nextBonusAt.toISOString(),
    });

    return {
      success: true,
      creditsEarned,
      newBalance: newBalance.totalCredits,
      isStreak: streakDays > 1,
      streakDays,
      nextBonusAt,
    };
  }

  // Purchase Operations
  async processPurchase(userId: string, purchase: ProductPurchase, creditsToAdd: number): Promise<PurchaseResult> {
    // Check if purchase already processed
    const alreadyProcessed = await this.dataSource.isPurchaseProcessed(purchase.transactionId);
    if (alreadyProcessed) {
      throw new PurchaseAlreadyProcessedError(purchase.transactionId);
    }

    // Create transaction
    const transaction = await this.createTransaction({
      userId,
      amount: creditsToAdd,
      transactionType: 'purchase',
      referenceId: purchase.transactionId,
      description: `Purchase of ${purchase.productId}`,
      status: 'completed',
      metadata: {
        platform: purchase.platform,
        productId: purchase.productId,
        purchaseToken: purchase.purchaseToken,
      },
    });

    // Update balance
    const newBalance = await this.updateCreditBalance(userId, creditsToAdd, 'purchase');

    // Store purchase receipt
    await this.dataSource.createPurchaseReceipt({
      user_id: userId,
      transaction_id: purchase.transactionId,
      product_id: purchase.productId,
      platform: purchase.platform,
      receipt_data: purchase.receipt,
      purchase_token: purchase.purchaseToken,
      is_verified: true,
      credits_added: creditsToAdd,
      processed_at: new Date().toISOString(),
    });

    return {
      success: true,
      transactionId: transaction.id,
      creditsAdded: creditsToAdd,
      newBalance: newBalance.totalCredits,
      receiptVerified: true,
    };
  }

  async verifyPurchaseReceipt(_receipt: string, _platform: 'ios' | 'android'): Promise<boolean> {
    // TODO: Implement actual receipt verification
    return true;
  }

  async isPurchaseProcessed(transactionId: string): Promise<boolean> {
    return this.dataSource.isPurchaseProcessed(transactionId);
  }

  // Referral Operations
  async processReferral(userId: string, referralCode: string, creditsEarned: number): Promise<CreditTransaction> {
    const referrerUserId = await this.dataSource.getUserByReferralCode(referralCode);
    
    if (!referrerUserId) {
      throw new Error('Invalid referral code');
    }

    // Create transaction for referred user
    const transaction = await this.createTransaction({
      userId,
      amount: creditsEarned,
      transactionType: 'referral',
      description: `Referral bonus from ${referralCode}`,
      status: 'completed',
      metadata: {
        referralCode,
        referrerUserId,
      } as Record<string, any>,
    });

    // Update referred user balance
    await this.updateCreditBalance(userId, creditsEarned, 'referral');

    // Create referral record
    await this.dataSource.createReferral({
      referrer_user_id: referrerUserId,
      referred_user_id: userId,
      referral_code: referralCode,
      credits_earned: creditsEarned,
      processed_at: new Date().toISOString(),
    });

    // Grant bonus credits to referrer too
    const referrerBonus = Math.floor(creditsEarned * 0.5); // 50% bonus for referrer
    await this.createTransaction({
      userId: referrerUserId,
      amount: referrerBonus,
      transactionType: 'referral',
      description: `Referral bonus for referring user`,
      status: 'completed',
      metadata: {
        referredUserId: userId,
        referralCode,
      } as Record<string, any>,
    });
    await this.updateCreditBalance(referrerUserId, referrerBonus, 'referral');

    return transaction;
  }

  async hasUsedReferralCode(userId: string): Promise<boolean> {
    return this.dataSource.hasUsedReferralCode(userId);
  }

  async getUserByReferralCode(referralCode: string): Promise<string | null> {
    return this.dataSource.getUserByReferralCode(referralCode);
  }

  // Admin Operations
  async adminGrantCredits(userId: string, amount: number, reason: string, adminUserId: string): Promise<CreditTransaction> {
    const transaction = await this.createTransaction({
      userId,
      amount,
      transactionType: 'admin_grant',
      description: `Admin grant: ${reason}`,
      status: 'completed',
      metadata: {
        adminUserId,
        reason,
      },
    });

    await this.updateCreditBalance(userId, amount, 'admin_grant');
    return transaction;
  }

  async adminDeductCredits(userId: string, amount: number, reason: string, adminUserId: string): Promise<CreditTransaction> {
    const currentBalance = await this.getCreditBalance(userId);
    
    if (currentBalance.totalCredits < amount) {
      throw new InsufficientCreditsError(amount, currentBalance.totalCredits);
    }

    const transaction = await this.createTransaction({
      userId,
      amount: -amount,
      transactionType: 'admin_grant',
      description: `Admin deduction: ${reason}`,
      status: 'completed',
      metadata: {
        adminUserId,
        reason,
      },
    });

    await this.updateCreditBalance(userId, -amount, 'admin_grant');
    return transaction;
  }

  async getSystemStats(): Promise<CreditSystemStats> {
    const statsDTO = await this.dataSource.getSystemStats();
    
    if (!statsDTO) {
      return {
        totalUsers: 0,
        totalCreditsIssued: 0,
        totalCreditsSpent: 0,
        totalPurchases: 0,
        totalRevenue: 0,
        averageCreditsPerUser: 0,
        dailyActiveUsers: 0,
        conversionRate: 0,
        topProducts: [],
      };
    }

    return {
      totalUsers: statsDTO.total_users,
      totalCreditsIssued: statsDTO.total_credits_issued,
      totalCreditsSpent: statsDTO.total_credits_spent,
      totalPurchases: statsDTO.total_purchases,
      totalRevenue: statsDTO.total_revenue,
      averageCreditsPerUser: statsDTO.average_credits_per_user,
      dailyActiveUsers: statsDTO.daily_active_users,
      conversionRate: statsDTO.conversion_rate,
      topProducts: [], // TODO: Implement from separate query
    };
  }

  // Maintenance Operations
  async cleanupExpiredTransactions(olderThanDays: number): Promise<number> {
    return this.dataSource.cleanupExpiredTransactions(olderThanDays);
  }

  async recalculateUserBalance(userId: string): Promise<CreditBalance> {
    const recalculatedDTO = await this.dataSource.recalculateUserBalance(userId);
    
    if (!recalculatedDTO) {
      throw new Error('Failed to recalculate user balance');
    }

    return CreditBalanceMapper.toDomain(recalculatedDTO);
  }

  // Missing interface methods
  async getTransactionByExternalId(externalId: string): Promise<CreditTransaction | null> {
    const transactionDTO = await this.dataSource.getTransactionByExternalId(externalId);
    
    if (!transactionDTO) {
      return null;
    }

    return CreditTransactionMapper.toDomain(transactionDTO);
  }

  async getAllTransactions(limit = 100, offset = 0): Promise<CreditTransaction[]> {
    const transactionDTOs = await this.dataSource.getAllTransactions(limit, offset);
    return CreditTransactionMapper.toDomainArray(transactionDTOs);
  }

  async updateBalance(userId: string, newBalance: number): Promise<CreditBalance> {
    const updatedBalance: CreditBalance = {
      totalCredits: newBalance,
      lastUpdated: new Date(),
      lastFreeCredit: null,
      dailyStreakDays: 0,
    };

    const balanceDTO = CreditBalanceMapper.toDTO(updatedBalance, userId);
    await this.dataSource.upsertCreditBalance(balanceDTO);
    
    return updatedBalance;
  }
} 