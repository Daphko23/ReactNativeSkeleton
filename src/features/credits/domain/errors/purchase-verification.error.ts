/**
 * @fileoverview Purchase Verification Error
 * @description Fehler für Purchase Verification Probleme
 * 
 * @module PurchaseVerificationError
 */

export class PurchaseVerificationError extends Error {
  public readonly code = 'PURCHASE_VERIFICATION_FAILED';
  
  constructor(message: string = 'Purchase verification failed') {
    super(message);
    this.name = 'PurchaseVerificationError';
  }
} 