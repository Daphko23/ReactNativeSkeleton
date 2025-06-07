/**
 * Credit Transaction Mapper - Data Layer
 * Transformation zwischen Domain Entities und DTOs
 */

import { CreditTransaction, CreditBalance, DailyBonusResult, PurchaseResult, TransactionType, TransactionStatus } from '../../domain/entities/credit-transaction.entity';
import { 
  CreditTransactionDTO, 
  CreditBalanceDTO, 
  DailyBonusDTO,
  PurchaseReceiptDTO,
  ClaimDailyBonusResponseDTO,
  ProcessPurchaseResponseDTO
} from '../dtos/credit-transaction.dto';

export class CreditTransactionMapper {
  static toDomain(dto: CreditTransactionDTO): CreditTransaction {
    return {
      id: dto.id,
      userId: dto.user_id,
      amount: dto.amount,
      transactionType: dto.transaction_type as TransactionType,
      referenceId: dto.reference_id,
      description: dto.description,
      metadata: dto.metadata,
      status: dto.status as TransactionStatus,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDTO(domain: Omit<CreditTransaction, 'id' | 'createdAt' | 'updatedAt'>): Omit<CreditTransactionDTO, 'id' | 'created_at' | 'updated_at'> {
    return {
      user_id: domain.userId,
      amount: domain.amount,
      transaction_type: domain.transactionType,
      reference_id: domain.referenceId,
      description: domain.description,
      metadata: domain.metadata,
      status: domain.status,
    };
  }

  static toDomainArray(dtos: CreditTransactionDTO[]): CreditTransaction[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}

export class CreditBalanceMapper {
  static toDomain(dto: CreditBalanceDTO): CreditBalance {
    return {
      totalCredits: dto.total_credits,
      lastUpdated: new Date(dto.last_updated),
      lastFreeCredit: dto.last_free_credit ? new Date(dto.last_free_credit) : null,
      dailyStreakDays: dto.daily_streak_days,
    };
  }

  static toDTO(domain: CreditBalance, userId: string): CreditBalanceDTO {
    return {
      user_id: userId,
      total_credits: domain.totalCredits,
      last_updated: domain.lastUpdated.toISOString(),
      last_free_credit: domain.lastFreeCredit?.toISOString(),
      daily_streak_days: domain.dailyStreakDays,
    };
  }
}

export class DailyBonusMapper {
  static toDomainResult(dto: ClaimDailyBonusResponseDTO): DailyBonusResult {
    return {
      success: dto.success,
      creditsEarned: dto.credits_earned,
      newBalance: dto.new_balance,
      isStreak: dto.is_streak,
      streakDays: dto.streak_days,
      nextBonusAt: new Date(dto.next_bonus_at),
    };
  }

  static toResponseDTO(domain: DailyBonusResult): ClaimDailyBonusResponseDTO {
    return {
      success: domain.success,
      credits_earned: domain.creditsEarned,
      new_balance: domain.newBalance,
      is_streak: domain.isStreak,
      streak_days: domain.streakDays,
      next_bonus_at: domain.nextBonusAt.toISOString(),
    };
  }

  static bonusDataToDomain(dto: DailyBonusDTO): {
    creditsEarned: number;
    streakDays: number;
    claimedAt: Date;
    nextBonusAt: Date;
  } {
    return {
      creditsEarned: dto.credits_earned,
      streakDays: dto.streak_days,
      claimedAt: new Date(dto.claimed_at),
      nextBonusAt: new Date(dto.next_bonus_at),
    };
  }
}

export class PurchaseMapper {
  static toDomainResult(dto: ProcessPurchaseResponseDTO): PurchaseResult {
    return {
      success: dto.success,
      transactionId: dto.transaction_id,
      creditsAdded: dto.credits_added,
      newBalance: dto.new_balance,
      receiptVerified: dto.receipt_verified,
    };
  }

  static toResponseDTO(domain: PurchaseResult): ProcessPurchaseResponseDTO {
    return {
      success: domain.success,
      transaction_id: domain.transactionId,
      credits_added: domain.creditsAdded,
      new_balance: domain.newBalance,
      receipt_verified: domain.receiptVerified,
    };
  }

  static receiptToDomain(dto: PurchaseReceiptDTO): {
    transactionId: string;
    productId: string;
    platform: string;
    isVerified: boolean;
    creditsAdded: number;
    processedAt: Date;
  } {
    return {
      transactionId: dto.transaction_id,
      productId: dto.product_id,
      platform: dto.platform,
      isVerified: dto.is_verified,
      creditsAdded: dto.credits_added,
      processedAt: new Date(dto.processed_at),
    };
  }
}

// Utility Functions
export class CreditMapperUtils {
  static parseTransactionType(type: string): TransactionType {
    const validTypes: TransactionType[] = [
      'purchase', 'daily_bonus', 'referral', 'admin_grant', 
      'refund', 'usage', 'expiry'
    ];
    
    if (validTypes.includes(type as TransactionType)) {
      return type as TransactionType;
    }
    
    throw new Error(`Invalid transaction type: ${type}`);
  }

  static parseTransactionStatus(status: string): TransactionStatus {
    const validStatuses: TransactionStatus[] = [
      'pending', 'completed', 'failed', 'cancelled', 'refunded'
    ];
    
    if (validStatuses.includes(status as TransactionStatus)) {
      return status as TransactionStatus;
    }
    
    throw new Error(`Invalid transaction status: ${status}`);
  }

  static validateAmount(amount: number): void {
    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }
  }

  static sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) return undefined;
    
    // Remove any potentially dangerous keys or values
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof key === 'string' && key.length <= 100) {
        // Only allow primitive types and simple objects
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          sanitized[key] = value;
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Allow simple objects, but limit depth
          sanitized[key] = JSON.parse(JSON.stringify(value));
        }
      }
    }
    
    return Object.keys(sanitized).length > 0 ? sanitized : undefined;
  }
} 