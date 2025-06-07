/**
 * @fileoverview APPLICATION-USE-CASE-003: Get Credit Analytics Use Case
 * @description Use Case für Credit Analytics und Reporting.
 * 
 * @businessRule BR-720: Credit analytics und reporting
 * @businessRule BR-721: User transaction statistics
 * @businessRule BR-722: Revenue and usage metrics
 * 
 * @architecture Application Use Case Pattern
 * @architecture Analytics aggregation service
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module GetCreditAnalyticsUseCase
 * @namespace Credits.Application.UseCases
 */

// Application imports
import type { ICreditOrchestratorService } from '../interfaces/credit-orchestrator.service.interface';

/**
 * @interface CreditAnalyticsRequest
 * @description Request für credit analytics
 */
export interface CreditAnalyticsRequest {
  /** User ID */
  userId: string;
  
  /** Start date für analytics */
  startDate?: Date;
  
  /** End date für analytics */
  endDate?: Date;
  
  /** Include admin transactions */
  includeAdmin?: boolean;
}

/**
 * @interface CreditAnalyticsResponse
 * @description Response mit credit analytics
 */
export interface CreditAnalyticsResponse {
  /** Current balance */
  currentBalance: number;
  
  /** Total credits earned */
  totalEarned: number;
  
  /** Total credits spent */
  totalSpent: number;
  
  /** Total purchases */
  totalPurchases: number;
  
  /** Total daily bonuses claimed */
  dailyBonusesClaimed: number;
  
  /** Total referral credits */
  referralCredits: number;
  
  /** Transaction count by type */
  transactionsByType: Record<string, number>;
  
  /** Credits by month */
  creditsByMonth: Array<{
    month: string;
    earned: number;
    spent: number;
  }>;
}

/**
 * @class GetCreditAnalyticsUseCase
 * @description Application Use Case für Credit Analytics through orchestrator
 */
export class GetCreditAnalyticsUseCase {
  constructor(
    private readonly orchestratorService: ICreditOrchestratorService
  ) {}

  /**
   * @method execute
   * @description Execute analytics generation through orchestrator
   */
  async execute(request: CreditAnalyticsRequest): Promise<CreditAnalyticsResponse> {
    return await this.orchestratorService.getCreditAnalytics({
      userId: request.userId,
      startDate: request.startDate,
      endDate: request.endDate,
      includeAdmin: request.includeAdmin
    });
  }
} 