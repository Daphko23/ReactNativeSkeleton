import { CreditTransaction } from '../../domain/entities/credit-transaction.entity';
import { ICreditRepository } from '../../domain/interfaces/credit.repository.interface';
import { IProductRepository } from '../../domain/interfaces/product.repository.interface';
import type { ICreditOrchestratorService } from '../interfaces/credit-orchestrator.service.interface';

export class CreditOrchestratorServiceImpl implements ICreditOrchestratorService {
  constructor(
    private creditRepository: ICreditRepository,
    private productRepository: IProductRepository
  ) {}

  async getBalance(userId: string) {
    return await this.creditRepository.getCreditBalance(userId);
  }

  // Store-Convenience Methods
  async getUserCreditBalance(userId: string): Promise<number> {
    const balance = await this.getBalance(userId);
    return balance.totalCredits;
  }

  async deductCredits(userId: string, amount: number, reason: string, metadata?: Record<string, any>): Promise<CreditTransaction> {
    const transaction = await this.creditRepository.createTransaction({
      userId,
      amount: -amount,
      transactionType: 'usage',
      status: 'completed',
      description: reason,
      metadata
    });

    await this.creditRepository.updateCreditBalance(userId, -amount, 'usage');
    return transaction;
  }

  async getAvailableProducts() {
    return await this.productRepository.getProducts();
  }

  async addCredits(userId: string, amount: number, description: string): Promise<void> {
    await this.creditRepository.createTransaction({
      userId,
      amount,
      transactionType: 'admin_grant',
      status: 'completed',
      description
    });

    await this.creditRepository.updateCreditBalance(userId, amount, 'admin_grant');
  }

  async subtractCredits(userId: string, amount: number, description: string): Promise<void> {
    await this.creditRepository.createTransaction({
      userId,
      amount: -amount,
      transactionType: 'usage',
      status: 'completed',
      description
    });

    await this.creditRepository.updateCreditBalance(userId, -amount, 'usage');
  }

  async processTransaction(userId: string, type: string, amount: number, description: string): Promise<void> {
    await this.creditRepository.createTransaction({
      userId,
      amount,
      transactionType: type as any,
      status: 'completed',
      description
    });
  }

  async processPurchase(request: {
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
  }> {
    // 1. Get product info to determine credits
    const product = await this.productRepository.getProductById(request.productId);
    if (!product) {
      throw new Error(`Product ${request.productId} not found`);
    }

    // 2. Verify purchase receipt
    const isVerified = await this.creditRepository.verifyPurchaseReceipt(
      request.receiptData || request.purchaseToken, 
      request.platform
    );
    
    if (!isVerified) {
      throw new Error('Purchase verification failed');
    }

    // 3. Check if already processed
    const alreadyProcessed = await this.creditRepository.isPurchaseProcessed(request.transactionId);
    if (alreadyProcessed) {
      throw new Error('Purchase already processed');
    }

    // 4. Calculate credits (with potential bonus)
    const baseCredits = product.creditAmount;
    const bonusCredits = Math.floor(baseCredits * 0.1); // 10% bonus
    const totalCredits = baseCredits + bonusCredits;

    // 5. Create transaction
    const transaction = await this.creditRepository.createTransaction({
      userId: request.userId,
      amount: totalCredits,
      transactionType: 'purchase',
      referenceId: request.transactionId,
      description: `Purchase: ${product.name}`,
      status: 'completed',
      metadata: {
        productId: request.productId,
        platform: request.platform,
        purchaseToken: request.purchaseToken
      }
    });

    // 6. Update balance
    await this.creditRepository.updateCreditBalance(request.userId, totalCredits, 'purchase');

    return {
      creditsGranted: baseCredits,
      bonusCredits,
      transaction
    };
  }

  async getUserTransactions(request: {
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
  }> {
    const page = request.page || 1;
    const limit = request.limit || 20;
    const offset = (page - 1) * limit;

    // Get user transactions
    let transactions = await this.creditRepository.getTransactionsByUser(
      request.userId, 
      limit + 1, // Get one extra to check if more pages exist
      offset
    );

    // Filter by type if specified
    if (request.type) {
      transactions = transactions.filter(t => t.transactionType === request.type);
    }

    // Filter by date range if specified
    if (request.startDate) {
      transactions = transactions.filter(t => t.createdAt >= request.startDate!);
    }
    if (request.endDate) {
      transactions = transactions.filter(t => t.createdAt <= request.endDate!);
    }

    // Check if there are more pages
    const hasMore = transactions.length > limit;
    if (hasMore) {
      transactions = transactions.slice(0, limit);
    }

    // Calculate totals
    const totalCount = transactions.length; // This is simplified - in production, need separate count query
    const totalPages = Math.ceil(totalCount / limit);

    return {
      transactions,
      totalCount,
      currentPage: page,
      totalPages,
      hasMore
    };
  }

  async getCreditAnalytics(request: {
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
  }> {
    // Get current balance
    const balance = await this.creditRepository.getCreditBalance(request.userId);
    
    // Get all user transactions
    const allTransactions = await this.creditRepository.getTransactionsByUser(
      request.userId, 
      1000, // Large limit for analytics
      0
    );

    // Filter by date range if specified
    let transactions = allTransactions;
    if (request.startDate) {
      transactions = transactions.filter(t => t.createdAt >= request.startDate!);
    }
    if (request.endDate) {
      transactions = transactions.filter(t => t.createdAt <= request.endDate!);
    }

    // Filter out admin transactions if not included
    if (!request.includeAdmin) {
      transactions = transactions.filter(t => t.transactionType !== 'admin_grant');
    }

    // Calculate metrics
    const totalEarned = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = Math.abs(transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));

    const totalPurchases = transactions
      .filter(t => t.transactionType === 'purchase').length;

    const dailyBonusesClaimed = transactions
      .filter(t => t.transactionType === 'daily_bonus').length;

    const referralCredits = transactions
      .filter(t => t.transactionType === 'referral')
      .reduce((sum, t) => sum + t.amount, 0);

    // Group by transaction type
    const transactionsByType = transactions.reduce((acc, t) => {
      acc[t.transactionType] = (acc[t.transactionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by month
    const creditsByMonth = transactions.reduce((acc, t) => {
      const month = t.createdAt.toISOString().slice(0, 7); // YYYY-MM format
      
      if (!acc[month]) {
        acc[month] = { month, earned: 0, spent: 0 };
      }
      
      if (t.amount > 0) {
        acc[month].earned += t.amount;
      } else {
        acc[month].spent += Math.abs(t.amount);
      }
      
      return acc;
    }, {} as Record<string, { month: string; earned: number; spent: number }>);

    return {
      currentBalance: balance.totalCredits,
      totalEarned,
      totalSpent,
      totalPurchases,
      dailyBonusesClaimed,
      referralCredits,
      transactionsByType,
      creditsByMonth: Object.values(creditsByMonth)
    };
  }

  async processReferral(request: {
    referrerUserId: string;
    refereeUserId: string;
    referralCode: string;
    type: 'signup' | 'purchase' | 'achievement';
    metadata?: Record<string, any>;
  }): Promise<{
    referrerCredits: number;
    refereeCredits: number;
  }> {
    // Check if referee already used a referral code
    const hasUsedReferral = await this.creditRepository.hasUsedReferralCode(request.refereeUserId);
    if (hasUsedReferral) {
      throw new Error('User has already used a referral code');
    }

    // Calculate credits based on type
    let refereeCredits = 0;
    let referrerCredits = 0;

    switch (request.type) {
      case 'signup':
        refereeCredits = 50;
        referrerCredits = 25;
        break;
      case 'purchase':
        refereeCredits = 20;
        referrerCredits = 30;
        break;
      case 'achievement':
        refereeCredits = 15;
        referrerCredits = 15;
        break;
    }

    // Process referral for referee
    await this.creditRepository.processReferral(
      request.refereeUserId, 
      request.referralCode, 
      refereeCredits
    );

    // Grant bonus to referrer
    await this.creditRepository.createTransaction({
      userId: request.referrerUserId,
      amount: referrerCredits,
      transactionType: 'referral',
      description: `Referral bonus - ${request.type}`,
      status: 'completed',
      metadata: {
        referredUserId: request.refereeUserId
      }
    });

    await this.creditRepository.updateCreditBalance(
      request.referrerUserId, 
      referrerCredits, 
      'referral'
    );

    return {
      referrerCredits,
      refereeCredits
    };
  }

  async getDailyBonusStatus(userId: string): Promise<{ 
    canClaim: boolean; 
    streak: number;
    nextClaimTime?: Date;
    currentStreak: number;
  }> {
    const streakCount = await this.creditRepository.getDailyStreakCount(userId);
    const lastBonus = await this.creditRepository.getLastDailyBonus(userId);
    
    const now = new Date();
    const canClaim = !lastBonus || (now.getTime() - lastBonus.getTime()) > 20 * 60 * 60 * 1000; // 20 hours
    
    const nextClaimTime = lastBonus ? new Date(lastBonus.getTime() + 20 * 60 * 60 * 1000) : undefined;
    
    return { 
      canClaim, 
      streak: streakCount,
      nextClaimTime,
      currentStreak: streakCount
    };
  }

  async claimDailyBonus(userId: string): Promise<{
    creditsGranted: number;
    bonusAmount: number;
    streak: number;
    transaction: CreditTransaction;
  }> {
    const streakCount = await this.creditRepository.getDailyStreakCount(userId);
    const creditsEarned = 10 + Math.min(streakCount * 2, 14); // Base 10 + streak bonus
    
    const result = await this.creditRepository.claimDailyBonus(userId, creditsEarned, streakCount + 1);
    
    const transaction = await this.creditRepository.createTransaction({
      userId,
      amount: creditsEarned,
      transactionType: 'daily_bonus',
      status: 'completed',
      description: `Daily bonus - streak ${streakCount + 1}`,
      metadata: { streak: streakCount + 1 }
    });

    return {
      creditsGranted: result.creditsEarned,
      bonusAmount: result.creditsEarned,
      streak: streakCount + 1,
      transaction
    };
  }

  // Admin Operations
  async adminAddCredits(userId: string, amount: number, reason: string, adminId: string): Promise<CreditTransaction> {
    const transaction = await this.creditRepository.createTransaction({
      userId,
      amount,
      transactionType: 'admin_grant',
      status: 'completed',
      description: reason,
      metadata: { adminId }
    });

    await this.creditRepository.updateCreditBalance(userId, amount, 'admin_grant');
    return transaction;
  }

  async adminDeductCredits(userId: string, amount: number, reason: string, adminId: string): Promise<CreditTransaction> {
    const transaction = await this.creditRepository.createTransaction({
      userId,
      amount: -amount,
      transactionType: 'admin_deduct',
      status: 'completed',
      description: reason,
      metadata: { adminId }
    });

    await this.creditRepository.updateCreditBalance(userId, -amount, 'admin_deduct');
    return transaction;
  }

  async adminGetAnalytics(): Promise<any> {
    // For admin analytics, we would aggregate across all users
    // Simplified implementation for now
    return {
      totalUsers: 0,
      totalCreditsIssued: 0,
      totalCreditsSpent: 0,
      totalRevenue: 0
    };
  }
} 