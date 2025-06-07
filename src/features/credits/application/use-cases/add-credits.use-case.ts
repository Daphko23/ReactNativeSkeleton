/**
 * @fileoverview Add Credits Use Case
 * @description Adds credits to a user's balance
 * 
 * @businessRule BR-002: Only positive credit amounts can be added
 * @businessRule BR-003: Credit additions must be tracked
 * 
 * @module AddCreditsUseCase
 */

import { CreditError, CreditErrorCode } from '../../domain/errors/credit.errors';
import type { ICreditOrchestratorService } from '../interfaces/credit-orchestrator.service.interface';

/**
 * @interface AddCreditsRequest
 */
export interface AddCreditsRequest {
  userId: string;
  amount: number;
  description: string;
}

/**
 * @interface AddCreditsResponse
 */
export interface AddCreditsResponse {
  success: boolean;
  newBalance: number;
}

/**
 * @class AddCreditsUseCase
 * @description Single responsibility: Add credits to user balance
 */
export class AddCreditsUseCase {
  constructor(private readonly orchestratorService: ICreditOrchestratorService) {}

  /**
   * @method execute
   * @description Execute add credits operation
   */
  async execute(request: AddCreditsRequest): Promise<AddCreditsResponse> {
    if (!request.userId || request.userId.trim() === '') {
      throw new CreditError(
        'User ID ist erforderlich',
        CreditErrorCode.INVALID_OPERATION
      );
    }

    if (request.amount <= 0) {
      throw new CreditError(
        'Betrag muss positiv sein',
        CreditErrorCode.INVALID_OPERATION
      );
    }

    await this.orchestratorService.addCredits(
      request.userId, 
      request.amount, 
      request.description
    );

    // Get updated balance
    const balance = await this.orchestratorService.getBalance(request.userId);
    
    return {
      success: true,
      newBalance: balance?.totalCredits || 0
    };
  }
} 