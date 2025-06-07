/**
 * @fileoverview Claim Daily Bonus Use Case
 * @description Claims daily bonus for a user
 * 
 * @businessRule BR-008: Users can claim daily bonus once per day
 * @businessRule BR-009: Daily bonus increases with streak
 * @businessRule BR-010: Claimed bonuses are tracked
 * 
 * @module ClaimDailyBonusUseCase
 */

import { CreditError, CreditErrorCode } from '../../domain/errors/credit.errors';
import type { ICreditOrchestratorService } from '../interfaces/credit-orchestrator.service.interface';

/**
 * @interface ClaimDailyBonusRequest
 */
export interface ClaimDailyBonusRequest {
  userId: string;
}

/**
 * @interface ClaimDailyBonusResponse
 */
export interface ClaimDailyBonusResponse {
  success: boolean;
  creditsGranted: number;
  newStreak: number;
  newBalance: number;
}

/**
 * @class ClaimDailyBonusUseCase
 * @description Single responsibility: Claim daily bonus
 */
export class ClaimDailyBonusUseCase {
  constructor(private readonly orchestratorService: ICreditOrchestratorService) {}

  /**
   * @method execute
   * @description Execute claim daily bonus operation
   */
  async execute(request: ClaimDailyBonusRequest): Promise<ClaimDailyBonusResponse> {
    if (!request.userId || request.userId.trim() === '') {
      throw new CreditError(
        'User ID ist erforderlich',
        CreditErrorCode.INVALID_OPERATION
      );
    }

    try {
      const bonusResult = await this.orchestratorService.claimDailyBonus(request.userId);
      
      // Get updated balance
      const balance = await this.orchestratorService.getBalance(request.userId);

      return {
        success: true,
        creditsGranted: bonusResult.creditsGranted,
        newStreak: bonusResult.streak,
        newBalance: balance?.totalCredits || 0
      };

    } catch (error) {
      if (error instanceof Error && error.message.includes('already claimed')) {
        throw new CreditError(
          'Daily Bonus bereits heute beansprucht',
          CreditErrorCode.DAILY_BONUS_ALREADY_CLAIMED
        );
      }
      throw error;
    }
  }
} 