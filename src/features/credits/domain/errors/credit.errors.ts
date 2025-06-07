/**
 * @fileoverview Credit System Error Definitions
 * @description Domain errors for the credit system
 * 
 * @module CreditErrors
 */

export enum CreditErrorCode {
  INVALID_OPERATION = 'INVALID_OPERATION',
  INSUFFICIENT_CREDITS = 'INSUFFICIENT_CREDITS',
  BALANCE_NOT_FOUND = 'BALANCE_NOT_FOUND',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  DAILY_BONUS_ALREADY_CLAIMED = 'DAILY_BONUS_ALREADY_CLAIMED',
  INVALID_PURCHASE = 'INVALID_PURCHASE',
  REFERRAL_NOT_VALID = 'REFERRAL_NOT_VALID',
}

export class CreditError extends Error {
  public readonly code: CreditErrorCode;
  public readonly timestamp: Date;

  constructor(message: string, code: CreditErrorCode, _context?: any) {
    super(message);
    this.name = 'CreditError';
    this.code = code;
    this.timestamp = new Date();
    
    // Preserve original stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CreditError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
    };
  }
} 