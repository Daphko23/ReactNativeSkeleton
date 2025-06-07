/**
 * @fileoverview Validate Sufficient Credits Use Case
 * @description Validates if user has sufficient credits for an operation
 * 
 * @businessRule BR-004: Users must have sufficient credits for transactions
 * @businessRule BR-005: Credit validation must prevent overdrafts
 * 
 * @module ValidateSufficientCreditsUseCase
 */

import { CreditError, CreditErrorCode } from '../../domain/errors/credit.errors';
import type { ICreditOrchestratorService } from '../interfaces/credit-orchestrator.service.interface';

/**
 * @interface ValidateSufficientCreditsRequest
 */
export interface ValidateSufficientCreditsRequest {
  userId: string;
  requiredAmount: number;
}

/**
 * @interface ValidateSufficientCreditsResponse
 */
export interface ValidateSufficientCreditsResponse {
  hasEnoughCredits: boolean;
  currentBalance: number;
  requiredAmount: number;
  shortfall?: number;
}

/**
 * @class ValidateSufficientCreditsUseCase
 * @description Single responsibility: Validate user has sufficient credits
 */
export class ValidateSufficientCreditsUseCase {
  constructor(private readonly orchestratorService: ICreditOrchestratorService) {}

  /**
   * @method execute
   * @description Execute credit sufficiency validation
   */
  async execute(request: ValidateSufficientCreditsRequest): Promise<ValidateSufficientCreditsResponse> {
    if (!request.userId || request.userId.trim() === '') {
      throw new CreditError(
        'User ID ist erforderlich',
        CreditErrorCode.INVALID_OPERATION
      );
    }

    if (request.requiredAmount < 0) {
      throw new CreditError(
        'Betrag muss positiv sein',
        CreditErrorCode.INVALID_OPERATION
      );
    }

    const balance = await this.orchestratorService.getBalance(request.userId);
    
    if (!balance) {
      throw new CreditError(
        'Credit Balance nicht gefunden',
        CreditErrorCode.BALANCE_NOT_FOUND
      );
    }

    const currentBalance = balance.totalCredits;
    const hasEnoughCredits = currentBalance >= request.requiredAmount;
    
    const response: ValidateSufficientCreditsResponse = {
      hasEnoughCredits,
      currentBalance,
      requiredAmount: request.requiredAmount
    };

    if (!hasEnoughCredits) {
      response.shortfall = request.requiredAmount - currentBalance;
    }

    return response;
  }
} 