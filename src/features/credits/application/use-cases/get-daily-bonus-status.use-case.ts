/**
 * @fileoverview Get Daily Bonus Status Use Case
 * @description Gets daily bonus status for a user
 * 
 * @businessRule BR-006: Users can check daily bonus availability
 * @businessRule BR-007: Daily bonus status includes streak information
 * 
 * @module GetDailyBonusStatusUseCase
 */

import { CreditError, CreditErrorCode } from '../../domain/errors/credit.errors';
import type { ICreditOrchestratorService } from '../interfaces/credit-orchestrator.service.interface';

/**
 * @interface GetDailyBonusStatusRequest
 */
export interface GetDailyBonusStatusRequest {
  userId: string;
}

/**
 * @interface GetDailyBonusStatusResponse
 */
export interface GetDailyBonusStatusResponse {
  canClaim: boolean;
  streak: number;
  nextBonusAmount: number;
}

/**
 * @class GetDailyBonusStatusUseCase
 * @description Single responsibility: Get daily bonus status
 */
export class GetDailyBonusStatusUseCase {
  constructor(private readonly orchestratorService: ICreditOrchestratorService) {}

  /**
   * @method execute
   * @description Execute get daily bonus status operation
   */
  async execute(request: GetDailyBonusStatusRequest): Promise<GetDailyBonusStatusResponse> {
    if (!request.userId || request.userId.trim() === '') {
      throw new CreditError(
        'User ID ist erforderlich',
        CreditErrorCode.INVALID_OPERATION
      );
    }

    const status = await this.orchestratorService.getDailyBonusStatus(request.userId);
    
    return {
      canClaim: status.canClaim,
      streak: status.streak,
      nextBonusAmount: this.calculateBonusAmount(status.streak)
    };
  }

  /**
   * @private
   * @method calculateBonusAmount
   * @description Calculate daily bonus amount based on streak
   */
  private calculateBonusAmount(streak: number): number {
    const baseAmount = 10;
    const streakBonus = Math.min(streak * 2, 14); // Max 14 bonus credits
    return baseAmount + streakBonus;
  }
} 