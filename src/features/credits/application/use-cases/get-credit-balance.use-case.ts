/**
 * @fileoverview Get Credit Balance Use Case
 * @description Gets current credit balance for a user
 * 
 * @businessRule BR-001: Users must have accessible credit balance information
 * 
 * @module GetCreditBalanceUseCase
 */

import { CreditBalance } from '../../domain/entities/credit-transaction.entity';
import { CreditError, CreditErrorCode } from '../../domain/errors/credit.errors';
import type { ICreditOrchestratorService } from '../interfaces/credit-orchestrator.service.interface';

/**
 * @interface GetCreditBalanceRequest
 */
export interface GetCreditBalanceRequest {
  userId: string;
}

/**
 * @interface GetCreditBalanceResponse
 */
export interface GetCreditBalanceResponse {
  balance: CreditBalance;
}

/**
 * @class GetCreditBalanceUseCase
 * @description Single responsibility: Get user's credit balance
 */
export class GetCreditBalanceUseCase {
  constructor(private readonly orchestratorService: ICreditOrchestratorService) {}

  /**
   * @method execute
   * @description Execute get credit balance operation
   */
  async execute(request: GetCreditBalanceRequest): Promise<GetCreditBalanceResponse> {
    if (!request.userId || request.userId.trim() === '') {
      throw new CreditError(
        'User ID ist erforderlich',
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

    return { balance };
  }
} 