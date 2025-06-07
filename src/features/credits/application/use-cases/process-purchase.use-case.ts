/**
 * @fileoverview APPLICATION-USE-CASE-001: Process Purchase Use Case
 * @description Use Case für die Verarbeitung von In-App-Käufen im Credit-System.
 * Koordiniert Purchase-Verifikation, Credit-Vergabe und Transaktions-Tracking.
 * 
 * @businessRule BR-700: Purchase transaction processing und validation
 * @businessRule BR-701: Credit allocation nach verified purchases
 * @businessRule BR-702: Transaction tracking für purchase history
 * @businessRule BR-703: Error handling für purchase failures
 * 
 * @architecture Application Use Case Pattern
 * @architecture Cross-cutting transaction management
 * @architecture Domain service coordination
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module ProcessPurchaseUseCase
 * @namespace Credits.Application.UseCases
 */

// Application imports
import type { ICreditOrchestratorService } from '../interfaces/credit-orchestrator.service.interface';
import type { CreditTransaction } from '../../domain/entities/credit-transaction.entity';

// Domain errors
import { PurchaseVerificationError } from '../../domain/errors/purchase-verification.error';

/**
 * @interface ProcessPurchaseRequest
 * @description Request für purchase processing
 */
export interface ProcessPurchaseRequest {
  /** User ID */
  userId: string;
  
  /** Product ID */
  productId: string;
  
  /** Platform purchase token */
  purchaseToken: string;
  
  /** Platform (iOS/Android) */
  platform: 'ios' | 'android';
  
  /** Purchase timestamp */
  purchaseTime: Date;
  
  /** Transaction ID from platform */
  transactionId: string;
  
  /** Purchase receipt data */
  receiptData?: string;
}

/**
 * @interface ProcessPurchaseResponse
 * @description Response von purchase processing
 */
export interface ProcessPurchaseResponse {
  /** Processing erfolgreich */
  success: boolean;
  
  /** Granted credits */
  creditsGranted: number;
  
  /** Bonus credits */
  bonusCredits: number;
  
  /** Total credits nach purchase */
  totalCredits: number;
  
  /** Transaction record */
  transaction: CreditTransaction;
  
  /** Error message bei failure */
  error?: string;
}

/**
 * @class ProcessPurchaseUseCase
 * @description Application Use Case für Purchase Processing through orchestrator
 */
export class ProcessPurchaseUseCase {
  constructor(private readonly orchestratorService: ICreditOrchestratorService) {}

  /**
   * @method execute
   * @description Execute purchase processing through orchestrator
   */
  async execute(request: ProcessPurchaseRequest): Promise<ProcessPurchaseResponse> {
    try {
      // 1. Validate purchase token
      await this.validatePurchaseToken(request);

      // 2. Process purchase through orchestrator
      const result = await this.orchestratorService.processPurchase({
        userId: request.userId,
        productId: request.productId,
        purchaseToken: request.purchaseToken,
        platform: request.platform,
        transactionId: request.transactionId,
        receiptData: request.receiptData
      });

      // 3. Get updated balance
      const balance = await this.orchestratorService.getBalance(request.userId);
      const currentBalance = balance?.totalCredits || 0;

      return {
        success: true,
        creditsGranted: result.creditsGranted,
        bonusCredits: result.bonusCredits,
        totalCredits: currentBalance,
        transaction: result.transaction
      };

    } catch (error) {
      console.error('Purchase processing failed:', error);
      
      return {
        success: false,
        creditsGranted: 0,
        bonusCredits: 0,
        totalCredits: 0,
        transaction: {} as CreditTransaction,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * @private
   * @method validatePurchaseToken
   * @description Validate purchase token mit platform
   */
  private async validatePurchaseToken(request: ProcessPurchaseRequest): Promise<void> {
    // TODO: Implement actual purchase token validation
    // For now, basic validation
    if (!request.purchaseToken || request.purchaseToken.length < 10) {
      throw new PurchaseVerificationError('Invalid purchase token');
    }

    if (!request.transactionId) {
      throw new PurchaseVerificationError('Missing transaction ID');
    }
  }
} 