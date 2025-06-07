/**
 * Supabase Credit DataSource - Data Layer
 * Datenbankoperationen für das Credit-System
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { 
  CreditTransactionDTO, 
  CreditBalanceDTO, 
  DailyBonusDTO,
  PurchaseReceiptDTO,
  ReferralDTO,
  CreditStatsViewDTO,
  SystemStatsViewDTO
} from '../dtos/credit-transaction.dto';
import { CreditProductDTO } from '../dtos/credit-product.dto';

export class SupabaseCreditDataSource {
  constructor(private readonly supabase: SupabaseClient) {}

  // Credit Balance Operations
  async getCreditBalance(userId: string): Promise<CreditBalanceDTO | null> {
    const { data, error } = await this.supabase
      .from('credit_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get credit balance: ${error.message}`);
    }

    return data;
  }

  async upsertCreditBalance(balance: CreditBalanceDTO): Promise<CreditBalanceDTO> {
    const { data, error } = await this.supabase
      .from('credit_balances')
      .upsert(balance)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert credit balance: ${error.message}`);
    }

    return data;
  }

  // Transaction Operations
  async createTransaction(transaction: Omit<CreditTransactionDTO, 'id' | 'created_at' | 'updated_at'>): Promise<CreditTransactionDTO> {
    const { data, error } = await this.supabase
      .from('credit_transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }

    return data;
  }

  async getTransaction(transactionId: string): Promise<CreditTransactionDTO | null> {
    const { data, error } = await this.supabase
      .from('credit_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get transaction: ${error.message}`);
    }

    return data;
  }

  async getTransactionByReference(referenceId: string): Promise<CreditTransactionDTO | null> {
    const { data, error } = await this.supabase
      .from('credit_transactions')
      .select('*')
      .eq('reference_id', referenceId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get transaction by reference: ${error.message}`);
    }

    return data;
  }

  async getTransactionsByUser(userId: string, limit = 50, offset = 0): Promise<CreditTransactionDTO[]> {
    const { data, error } = await this.supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get user transactions: ${error.message}`);
    }

    return data || [];
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<CreditTransactionDTO> {
    const { data, error } = await this.supabase
      .from('credit_transactions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update transaction status: ${error.message}`);
    }

    return data;
  }

  // Daily Bonus Operations
  async getLastDailyBonus(userId: string): Promise<DailyBonusDTO | null> {
    const { data, error } = await this.supabase
      .from('daily_bonuses')
      .select('*')
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get last daily bonus: ${error.message}`);
    }

    return data;
  }

  async createDailyBonus(bonus: Omit<DailyBonusDTO, 'id'>): Promise<DailyBonusDTO> {
    const { data, error } = await this.supabase
      .from('daily_bonuses')
      .insert(bonus)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create daily bonus: ${error.message}`);
    }

    return data;
  }

  async getDailyStreakCount(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('daily_bonuses')
      .select('streak_days')
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return 0;
    }

    return data?.streak_days || 0;
  }

  // Purchase Operations
  async createPurchaseReceipt(receipt: Omit<PurchaseReceiptDTO, 'id' | 'created_at'>): Promise<PurchaseReceiptDTO> {
    const { data, error } = await this.supabase
      .from('purchase_receipts')
      .insert(receipt)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create purchase receipt: ${error.message}`);
    }

    return data;
  }

  async isPurchaseProcessed(transactionId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('purchase_receipts')
      .select('id')
      .eq('transaction_id', transactionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check purchase status: ${error.message}`);
    }

    return !!data;
  }

  // Referral Operations
  async createReferral(referral: Omit<ReferralDTO, 'id' | 'created_at'>): Promise<ReferralDTO> {
    const { data, error } = await this.supabase
      .from('referrals')
      .insert(referral)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create referral: ${error.message}`);
    }

    return data;
  }

  async hasUsedReferralCode(userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('referrals')
      .select('id')
      .eq('referred_user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to check referral usage: ${error.message}`);
    }

    return !!data;
  }

  async getUserByReferralCode(referralCode: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('user_referral_codes')
      .select('user_id')
      .eq('referral_code', referralCode)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user by referral code: ${error.message}`);
    }

    return data?.user_id || null;
  }

  // Product Operations
  async getActiveProducts(platform?: string): Promise<CreditProductDTO[]> {
    let query = this.supabase
      .from('credit_products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get active products: ${error.message}`);
    }

    return data || [];
  }

  async getProduct(productId: string): Promise<CreditProductDTO | null> {
    const { data, error } = await this.supabase
      .from('credit_products')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get product: ${error.message}`);
    }

    return data;
  }

  async updateProductActive(productId: string, isActive: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('credit_products')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('product_id', productId);

    if (error) {
      throw new Error(`Failed to update product active status: ${error.message}`);
    }
  }

  // Analytics & Stats
  async getUserStats(userId: string): Promise<CreditStatsViewDTO | null> {
    const { data, error } = await this.supabase
      .from('credit_user_stats_view')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user stats: ${error.message}`);
    }

    return data;
  }

  async getSystemStats(): Promise<SystemStatsViewDTO | null> {
    const { data, error } = await this.supabase
      .from('credit_system_stats_view')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get system stats: ${error.message}`);
    }

    return data;
  }

  // Maintenance Operations
  async cleanupExpiredTransactions(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const { data, error } = await this.supabase
      .rpc('cleanup_expired_transactions', {
        cutoff_date: cutoffDate.toISOString(),
      });

    if (error) {
      throw new Error(`Failed to cleanup expired transactions: ${error.message}`);
    }

    return data || 0;
  }

  async recalculateUserBalance(userId: string): Promise<CreditBalanceDTO | null> {
    const { data, error } = await this.supabase
      .rpc('recalculate_user_balance', {
        target_user_id: userId,
      });

    if (error) {
      throw new Error(`Failed to recalculate user balance: ${error.message}`);
    }

    return data;
  }

  // Missing methods
  async getTransactionByExternalId(externalId: string): Promise<CreditTransactionDTO | null> {
    const { data, error } = await this.supabase
      .from('credit_transactions')
      .select('*')
      .eq('reference_id', externalId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get transaction by external ID: ${error.message}`);
    }

    return data;
  }

  async getAllTransactions(limit = 100, offset = 0): Promise<CreditTransactionDTO[]> {
    const { data, error } = await this.supabase
      .from('credit_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get all transactions: ${error.message}`);
    }

    return data || [];
  }
} 