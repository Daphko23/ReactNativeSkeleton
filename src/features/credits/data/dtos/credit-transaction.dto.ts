/**
 * Credit Transaction DTOs - Data Layer
 * Supabase Database Transfer Objects
 */

export interface CreditTransactionDTO {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  reference_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreditBalanceDTO {
  user_id: string;
  total_credits: number;
  last_updated: string;
  last_free_credit?: string;
  daily_streak_days: number;
}

export interface DailyBonusDTO {
  id: string;
  user_id: string;
  credits_earned: number;
  streak_days: number;
  claimed_at: string;
  next_bonus_at: string;
}

export interface PurchaseReceiptDTO {
  id: string;
  user_id: string;
  transaction_id: string;
  product_id: string;
  platform: string;
  receipt_data: string;
  purchase_token?: string;
  is_verified: boolean;
  credits_added: number;
  processed_at: string;
  created_at: string;
}

export interface ReferralDTO {
  id: string;
  referrer_user_id: string;
  referred_user_id: string;
  referral_code: string;
  credits_earned: number;
  processed_at: string;
  created_at: string;
}

// Database Views
export interface CreditStatsViewDTO {
  user_id: string;
  total_credits_earned: number;
  total_credits_spent: number;
  current_balance: number;
  purchase_count: number;
  referral_count: number;
  daily_bonus_count: number;
  last_activity: string;
}

export interface SystemStatsViewDTO {
  total_users: number;
  total_credits_issued: number;
  total_credits_spent: number;
  total_purchases: number;
  total_revenue: number;
  average_credits_per_user: number;
  daily_active_users: number;
  conversion_rate: number;
}

// Request/Response DTOs for API endpoints
export interface CreateTransactionRequestDTO {
  user_id: string;
  amount: number;
  transaction_type: string;
  reference_id?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface ClaimDailyBonusRequestDTO {
  user_id: string;
}

export interface ClaimDailyBonusResponseDTO {
  success: boolean;
  credits_earned: number;
  new_balance: number;
  is_streak: boolean;
  streak_days: number;
  next_bonus_at: string;
}

export interface ProcessPurchaseRequestDTO {
  user_id: string;
  product_id: string;
  transaction_id: string;
  receipt_data: string;
  platform: string;
  purchase_token?: string;
}

export interface ProcessPurchaseResponseDTO {
  success: boolean;
  transaction_id: string;
  credits_added: number;
  new_balance: number;
  receipt_verified: boolean;
} 