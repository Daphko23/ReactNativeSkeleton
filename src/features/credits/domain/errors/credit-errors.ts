/**
 * Credit System Domain Errors
 * Definiert spezifische Fehlertypen für das Credit-System
 */

export abstract class CreditDomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly context?: Record<string, any>;
  
  constructor(
    message: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
  }
}

// Balance & Transaction Errors
export class InsufficientCreditsError extends CreditDomainError {
  readonly code = 'INSUFFICIENT_CREDITS';
  readonly statusCode = 400;
  
  constructor(required: number, available: number) {
    super(`Insufficient credits. Required: ${required}, Available: ${available}`, { required, available });
  }
}

export class InvalidTransactionAmountError extends CreditDomainError {
  readonly code = 'INVALID_TRANSACTION_AMOUNT';
  readonly statusCode = 400;
  
  constructor(amount: number) {
    super(`Invalid transaction amount: ${amount}. Must be positive number.`, { amount });
  }
}

export class TransactionNotFoundError extends CreditDomainError {
  readonly code = 'TRANSACTION_NOT_FOUND';
  readonly statusCode = 404;
  
  constructor(transactionId: string) {
    super(`Transaction not found: ${transactionId}`, { transactionId });
  }
}

export class DuplicateTransactionError extends CreditDomainError {
  readonly code = 'DUPLICATE_TRANSACTION';
  readonly statusCode = 409;
  
  constructor(referenceId: string) {
    super(`Duplicate transaction detected: ${referenceId}`, { referenceId });
  }
}

// Daily Bonus Errors
export class DailyBonusAlreadyClaimedError extends CreditDomainError {
  readonly code = 'DAILY_BONUS_ALREADY_CLAIMED';
  readonly statusCode = 409;
  
  constructor(nextBonusAt: Date) {
    super(`Daily bonus already claimed. Next bonus available at: ${nextBonusAt.toISOString()}`, { nextBonusAt });
  }
}

export class DailyBonusNotAvailableError extends CreditDomainError {
  readonly code = 'DAILY_BONUS_NOT_AVAILABLE';
  readonly statusCode = 400;
  
  constructor(reason: string) {
    super(`Daily bonus not available: ${reason}`, { reason });
  }
}

// Purchase Errors
export class ProductNotFoundError extends CreditDomainError {
  readonly code = 'PRODUCT_NOT_FOUND';
  readonly statusCode = 404;
  
  constructor(productId: string) {
    super(`Credit product not found: ${productId}`, { productId });
  }
}

export class ProductNotActiveError extends CreditDomainError {
  readonly code = 'PRODUCT_NOT_ACTIVE';
  readonly statusCode = 400;
  
  constructor(productId: string) {
    super(`Credit product not active: ${productId}`, { productId });
  }
}

export class PurchaseVerificationError extends CreditDomainError {
  readonly code = 'PURCHASE_VERIFICATION_FAILED';
  readonly statusCode = 400;
  
  constructor(reason: string, receipt?: string) {
    super(`Purchase verification failed: ${reason}`, { reason, receipt });
  }
}

export class PurchaseAlreadyProcessedError extends CreditDomainError {
  readonly code = 'PURCHASE_ALREADY_PROCESSED';
  readonly statusCode = 409;
  
  constructor(transactionId: string) {
    super(`Purchase already processed: ${transactionId}`, { transactionId });
  }
}

// Referral Errors
export class InvalidReferralCodeError extends CreditDomainError {
  readonly code = 'INVALID_REFERRAL_CODE';
  readonly statusCode = 400;
  
  constructor(code: string) {
    super(`Invalid referral code: ${code}`, { code });
  }
}

export class SelfReferralError extends CreditDomainError {
  readonly code = 'SELF_REFERRAL_NOT_ALLOWED';
  readonly statusCode = 400;
  
  constructor(userId: string) {
    super(`Self-referral not allowed`, { userId });
  }
}

export class ReferralAlreadyUsedError extends CreditDomainError {
  readonly code = 'REFERRAL_ALREADY_USED';
  readonly statusCode = 409;
  
  constructor(userId: string, referralCode: string) {
    super(`User has already used a referral code`, { userId, referralCode });
  }
}

// Admin Errors
export class InvalidAdminActionError extends CreditDomainError {
  readonly code = 'INVALID_ADMIN_ACTION';
  readonly statusCode = 403;
  
  constructor(action: string, reason: string) {
    super(`Invalid admin action '${action}': ${reason}`, { action, reason });
  }
}

export class CreditSystemMaintenanceError extends CreditDomainError {
  readonly code = 'CREDIT_SYSTEM_MAINTENANCE';
  readonly statusCode = 503;
  
  constructor(estimatedEndTime?: Date) {
    super(`Credit system is currently under maintenance`, { estimatedEndTime });
  }
} 