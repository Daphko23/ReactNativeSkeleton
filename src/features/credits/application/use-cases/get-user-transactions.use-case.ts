/**
 * @fileoverview APPLICATION-USE-CASE-004: Get User Transactions Use Case
 * @description Use Case für das Abrufen von User Transaction History.
 * 
 * @businessRule BR-730: User transaction history retrieval
 * @businessRule BR-731: Transaction filtering und pagination
 * @businessRule BR-732: Transaction grouping und sorting
 * 
 * @architecture Application Use Case Pattern
 * @architecture Data aggregation und formatting
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module GetUserTransactionsUseCase
 * @namespace Credits.Application.UseCases
 */

// Application imports
import type { ICreditOrchestratorService } from '../interfaces/credit-orchestrator.service.interface';
import type { CreditTransaction } from '../../domain/entities/credit-transaction.entity';

/**
 * @interface GetUserTransactionsRequest
 * @description Request für user transactions
 */
export interface GetUserTransactionsRequest {
  /** User ID */
  userId: string;
  
  /** Transaction type filter */
  type?: string;
  
  /** Start date für filtering */
  startDate?: Date;
  
  /** End date für filtering */
  endDate?: Date;
  
  /** Page number */
  page?: number;
  
  /** Items per page */
  limit?: number;
  
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
}

/**
 * @interface GetUserTransactionsResponse
 * @description Response mit user transactions
 */
export interface GetUserTransactionsResponse {
  /** Transaction list */
  transactions: CreditTransaction[];
  
  /** Total count */
  totalCount: number;
  
  /** Current page */
  currentPage: number;
  
  /** Total pages */
  totalPages: number;
  
  /** Has more pages */
  hasMore: boolean;
  
  /** Grouped by date */
  groupedByDate: Record<string, CreditTransaction[]>;
}

/**
 * @class GetUserTransactionsUseCase
 * @description Application Use Case für User Transactions through orchestrator
 */
export class GetUserTransactionsUseCase {
  constructor(
    private readonly orchestratorService: ICreditOrchestratorService
  ) {}

  /**
   * @method execute
   * @description Execute transaction retrieval through orchestrator
   */
  async execute(request: GetUserTransactionsRequest): Promise<GetUserTransactionsResponse> {
    const result = await this.orchestratorService.getUserTransactions({
      userId: request.userId,
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      page: request.page || 1,
      limit: request.limit || 20,
      sortDirection: request.sortDirection || 'desc'
    });

    // Group by date
    const groupedByDate = this.groupTransactionsByDate(result.transactions);

    return {
      ...result,
      groupedByDate
    };
  }

  /**
   * @private
   * @method groupTransactionsByDate
   * @description Group transactions by date
   */
  private groupTransactionsByDate(transactions: CreditTransaction[]): Record<string, CreditTransaction[]> {
    return transactions.reduce((groups, transaction) => {
      const date = new Date(transaction.createdAt).toISOString().split('T')[0];
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(transaction);
      
      return groups;
    }, {} as Record<string, CreditTransaction[]>);
  }
} 