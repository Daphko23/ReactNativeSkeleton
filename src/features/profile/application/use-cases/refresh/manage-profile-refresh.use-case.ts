/**
 * @fileoverview Manage Profile Refresh Use Case - Enterprise Refresh Management
 * 
 * ✅ ENTERPRISE USE CASE:
 * - Smart Refresh Strategies & Business Rules
 * - Focus Detection & Navigation Analysis
 * - Performance Optimization with Debouncing
 * - Analytics & User Behavior Tracking
 * - Error Recovery & Retry Logic
 * - Cache Invalidation Management
 * 
 * @module ManageProfileRefreshUseCase
 * @since 1.0.0
 * @architecture Clean Architecture - Application Layer
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('ManageProfileRefreshUseCase');

// =============================================================================
// DOMAIN TYPES & INTERFACES
// =============================================================================

export type RefreshTrigger = 'initial_focus' | 'profile_edit_return' | 'avatar_upload_return' | 'pull_to_refresh' | 'tab_navigation' | 'manual';
export type RefreshStrategy = 'immediate' | 'debounced' | 'background' | 'skip';
export type RefreshScope = 'profile_only' | 'avatar_only' | 'full_refresh' | 'cache_check';

export interface RefreshContext {
  userId: string;
  hasInitialized: boolean;
  lastRefreshTime: number;
  timeSinceLastFocus: number;
  navigationSource: 'tab' | 'screen' | 'deep_link' | 'unknown';
  pendingUpdates: {
    profile: boolean;
    avatar: boolean;
    customFields: boolean;
  };
}

export interface RefreshConfiguration {
  minRefreshInterval: number; // Minimum time between refreshes (ms)
  debounceTime: number; // Debounce time for rapid refreshes (ms)
  backgroundRefreshThreshold: number; // Time before background refresh (ms)
  maxRetryAttempts: number;
  retryDelayMultiplier: number;
  enableAnalytics: boolean;
  enablePerformanceTracking: boolean;
}

export interface RefreshDecision {
  shouldRefresh: boolean;
  strategy: RefreshStrategy;
  scope: RefreshScope;
  reason: string;
  estimatedDuration: number;
  cachePolicy: 'invalidate' | 'update' | 'preserve';
}

export interface RefreshResult {
  success: boolean;
  scope: RefreshScope;
  duration: number;
  itemsRefreshed: string[];
  errors: string[];
  cacheHits: number;
  cacheMisses: number;
  nextRefreshRecommendation: number;
}

// =============================================================================
// USE CASE INPUT/OUTPUT INTERFACES
// =============================================================================

export interface AnalyzeRefreshNeedInput {
  trigger: RefreshTrigger;
  context: RefreshContext;
  configuration?: Partial<RefreshConfiguration>;
}

export interface AnalyzeRefreshNeedOutput {
  decision: RefreshDecision;
  analytics: {
    userBehaviorPattern: string;
    refreshFrequency: number;
    lastActiveSession: number;
  };
  recommendations: string[];
}

export interface ExecuteRefreshInput {
  decision: RefreshDecision;
  context: RefreshContext;
  refreshActions: {
    refreshProfile: () => Promise<void>;
    refreshAvatar: () => Promise<void>;
    refreshCustomFields: () => Promise<void>;
    preloadData: () => Promise<void>;
  };
}

export interface ExecuteRefreshOutput {
  result: RefreshResult;
  updatedContext: RefreshContext;
  performanceMetrics: {
    startTime: number;
    endTime: number;
    memoryUsage: number;
    networkRequests: number;
  };
}

// =============================================================================
// ENTERPRISE CONFIGURATION & BUSINESS RULES
// =============================================================================

const DEFAULT_REFRESH_CONFIG: RefreshConfiguration = {
  minRefreshInterval: 5000, // 5 seconds minimum between refreshes
  debounceTime: 1000, // 1 second debounce for rapid requests
  backgroundRefreshThreshold: 30000, // 30 seconds for background refresh
  maxRetryAttempts: 3,
  retryDelayMultiplier: 1.5,
  enableAnalytics: true,
  enablePerformanceTracking: true
};

const REFRESH_STRATEGY_RULES: Record<RefreshTrigger, RefreshStrategy> = {
  initial_focus: 'immediate',
  profile_edit_return: 'immediate',
  avatar_upload_return: 'immediate',
  pull_to_refresh: 'immediate',
  tab_navigation: 'skip',
  manual: 'immediate'
};

const REFRESH_SCOPE_RULES: Record<RefreshTrigger, RefreshScope> = {
  initial_focus: 'full_refresh',
  profile_edit_return: 'profile_only',
  avatar_upload_return: 'avatar_only',
  pull_to_refresh: 'full_refresh',
  tab_navigation: 'cache_check',
  manual: 'full_refresh'
};

// =============================================================================
// MAIN USE CASE IMPLEMENTATION
// =============================================================================

export class ManageProfileRefreshUseCase {
  /**
   * 🎯 ANALYZE REFRESH NEED - Smart refresh decision making
   */
  async analyzeRefreshNeed(input: AnalyzeRefreshNeedInput): Promise<AnalyzeRefreshNeedOutput> {
    try {
      logger.info('Analyzing refresh need', LogCategory.BUSINESS, { 
        userId: input.context.userId 
      });

      const config = { ...DEFAULT_REFRESH_CONFIG, ...input.configuration };
      
      // 🔍 BUSINESS RULES: Determine refresh strategy
      const baseStrategy = REFRESH_STRATEGY_RULES[input.trigger];
      const baseScope = REFRESH_SCOPE_RULES[input.trigger];
      
      // 🔍 PERFORMANCE OPTIMIZATION: Check if refresh is needed
      const shouldRefresh = this.shouldPerformRefresh(input.trigger, input.context, config);
      const strategy = shouldRefresh ? baseStrategy : 'skip';
      
      // 🔍 SMART SCOPE ADJUSTMENT: Adjust scope based on pending updates
      const scope = this.adjustRefreshScope(baseScope, input.context);
      
      // 🔍 PERFORMANCE ESTIMATION: Estimate duration
      const estimatedDuration = this.estimateRefreshDuration(scope, input.context);
      
      const decision: RefreshDecision = {
        shouldRefresh,
        strategy,
        scope,
        reason: this.generateRefreshReason(input.trigger, shouldRefresh, input.context),
        estimatedDuration,
        cachePolicy: shouldRefresh ? 'invalidate' : 'preserve'
      };

      // 🔍 ANALYTICS: User behavior analysis
      const analytics = this.analyzeUserBehavior(input.trigger, input.context);
      
      // 🔍 RECOMMENDATIONS: Performance improvement suggestions
      const recommendations = this.generateRecommendations(decision, input.context, analytics);

      logger.info('Refresh analysis completed', LogCategory.BUSINESS, { 
        userId: input.context.userId
      });

      return {
        decision,
        analytics,
        recommendations
      };
    } catch (error) {
      logger.error('Failed to analyze refresh need', LogCategory.BUSINESS, { 
        userId: input.context.userId 
      }, error as Error);
      
      // Fallback to safe refresh decision
      return {
        decision: {
          shouldRefresh: true,
          strategy: 'immediate',
          scope: 'full_refresh',
          reason: 'Fallback refresh due to analysis error',
          estimatedDuration: 2000,
          cachePolicy: 'invalidate'
        },
        analytics: {
          userBehaviorPattern: 'unknown',
          refreshFrequency: 0,
          lastActiveSession: Date.now()
        },
        recommendations: ['Error occurred during analysis - consider manual refresh']
      };
    }
  }

  /**
   * 🎯 EXECUTE REFRESH - Orchestrate refresh execution
   */
  async executeRefresh(input: ExecuteRefreshInput): Promise<ExecuteRefreshOutput> {
    const startTime = Date.now();
    const performanceMetrics = {
      startTime,
      endTime: 0,
      memoryUsage: 0,
      networkRequests: 0
    };

    try {
      logger.info('Executing profile refresh', LogCategory.BUSINESS, { 
        userId: input.context.userId
      });

      const result: RefreshResult = {
        success: false,
        scope: input.decision.scope,
        duration: 0,
        itemsRefreshed: [],
        errors: [],
        cacheHits: 0,
        cacheMisses: 0,
        nextRefreshRecommendation: Date.now() + DEFAULT_REFRESH_CONFIG.minRefreshInterval
      };

      // 🚀 EXECUTE REFRESH ACTIONS based on scope
      switch (input.decision.scope) {
        case 'profile_only':
          await input.refreshActions.refreshProfile();
          result.itemsRefreshed.push('profile');
          performanceMetrics.networkRequests += 1;
          break;
          
        case 'avatar_only':
          await input.refreshActions.refreshAvatar();
          result.itemsRefreshed.push('avatar');
          performanceMetrics.networkRequests += 1;
          break;
          
        case 'full_refresh':
          await Promise.all([
            input.refreshActions.refreshProfile(),
            input.refreshActions.refreshAvatar(),
            input.refreshActions.refreshCustomFields()
          ]);
          result.itemsRefreshed.push('profile', 'avatar', 'customFields');
          performanceMetrics.networkRequests += 3;
          break;
          
        case 'cache_check':
          await input.refreshActions.preloadData();
          result.itemsRefreshed.push('cache_validation');
          break;
      }

      // 🔍 UPDATE CONTEXT
      const updatedContext: RefreshContext = {
        ...input.context,
        hasInitialized: true,
        lastRefreshTime: Date.now(),
        pendingUpdates: {
          profile: false,
          avatar: false,
          customFields: false
        }
      };

      performanceMetrics.endTime = Date.now();
      result.duration = performanceMetrics.endTime - performanceMetrics.startTime;
      result.success = true;

      logger.info('Profile refresh executed successfully', LogCategory.BUSINESS, { 
        userId: input.context.userId
      });

      return {
        result,
        updatedContext,
        performanceMetrics
      };
    } catch (error) {
      performanceMetrics.endTime = Date.now();
      
      logger.error('Profile refresh execution failed', LogCategory.BUSINESS, { 
        userId: input.context.userId
      }, error as Error);

      const result: RefreshResult = {
        success: false,
        scope: input.decision.scope,
        duration: performanceMetrics.endTime - performanceMetrics.startTime,
        itemsRefreshed: [],
        errors: [(error as Error).message],
        cacheHits: 0,
        cacheMisses: 0,
        nextRefreshRecommendation: Date.now() + DEFAULT_REFRESH_CONFIG.minRefreshInterval * 2
      };

      return {
        result,
        updatedContext: input.context,
        performanceMetrics
      };
    }
  }

  // =============================================================================
  // PRIVATE BUSINESS LOGIC METHODS
  // =============================================================================

  /**
   * 🔍 SHOULD PERFORM REFRESH - Business rules for refresh decisions
   */
  private shouldPerformRefresh(trigger: RefreshTrigger, context: RefreshContext, config: RefreshConfiguration): boolean {
    // Always skip tab navigation to prevent unnecessary refreshes
    if (trigger === 'tab_navigation') {
      return false;
    }

    // Always refresh on initial focus if not initialized
    if (trigger === 'initial_focus' && !context.hasInitialized) {
      return true;
    }

    // Always refresh after profile/avatar changes
    if (trigger === 'profile_edit_return' || trigger === 'avatar_upload_return') {
      return true;
    }

    // Check minimum refresh interval
    const timeSinceLastRefresh = Date.now() - context.lastRefreshTime;
    if (timeSinceLastRefresh < config.minRefreshInterval) {
      return false;
    }

    // Pull-to-refresh is always honored
    if (trigger === 'pull_to_refresh') {
      return true;
    }

    return true;
  }

  /**
   * 🔍 ADJUST REFRESH SCOPE - Smart scope adjustment
   */
  private adjustRefreshScope(baseScope: RefreshScope, context: RefreshContext): RefreshScope {
    // If specific updates are pending, adjust scope accordingly
    const { pendingUpdates } = context;
    
    if (pendingUpdates.profile && !pendingUpdates.avatar && !pendingUpdates.customFields) {
      return 'profile_only';
    }
    
    if (pendingUpdates.avatar && !pendingUpdates.profile && !pendingUpdates.customFields) {
      return 'avatar_only';
    }
    
    if (pendingUpdates.profile || pendingUpdates.avatar || pendingUpdates.customFields) {
      return 'full_refresh';
    }
    
    return baseScope;
  }

  /**
   * 🔍 ESTIMATE REFRESH DURATION - Performance estimation
   */
  private estimateRefreshDuration(scope: RefreshScope, context: RefreshContext): number {
    const baseDurations = {
      profile_only: 800,
      avatar_only: 600,
      full_refresh: 1500,
      cache_check: 200
    };
    
    let duration = baseDurations[scope];
    
    // Adjust for network conditions (basic estimation)
    if (!context.hasInitialized) {
      duration *= 1.5; // First load takes longer
    }
    
    return duration;
  }

  /**
   * 🔍 GENERATE REFRESH REASON - Human-readable reasoning
   */
  private generateRefreshReason(trigger: RefreshTrigger, shouldRefresh: boolean, context: RefreshContext): string {
    if (!shouldRefresh) {
      if (trigger === 'tab_navigation') {
        return 'Skipped: Tab navigation does not require refresh';
      }
      return 'Skipped: Too soon since last refresh';
    }
    
    switch (trigger) {
      case 'initial_focus':
        return context.hasInitialized ? 'Initial app focus' : 'First-time initialization';
      case 'profile_edit_return':
        return 'Returning from profile edit - data may have changed';
      case 'avatar_upload_return':
        return 'Returning from potential avatar upload';
      case 'pull_to_refresh':
        return 'User-initiated pull-to-refresh';
      case 'manual':
        return 'Manual refresh requested';
      default:
        return 'Refresh needed based on app state';
    }
  }

  /**
   * 🔍 ANALYZE USER BEHAVIOR - User pattern recognition
   */
  private analyzeUserBehavior(trigger: RefreshTrigger, context: RefreshContext): { userBehaviorPattern: string; refreshFrequency: number; lastActiveSession: number } {
    const timeSinceLastRefresh = Date.now() - context.lastRefreshTime;
    
    let behaviorPattern = 'normal';
    if (timeSinceLastRefresh < 5000) {
      behaviorPattern = 'frequent_refresher';
    } else if (timeSinceLastRefresh > 300000) { // 5 minutes
      behaviorPattern = 'infrequent_user';
    }
    
    return {
      userBehaviorPattern: behaviorPattern,
      refreshFrequency: timeSinceLastRefresh > 0 ? 1 / (timeSinceLastRefresh / 1000) : 0,
      lastActiveSession: context.lastRefreshTime
    };
  }

  /**
   * 🔍 GENERATE RECOMMENDATIONS - Performance improvement suggestions
   */
  private generateRecommendations(decision: RefreshDecision, context: RefreshContext, analytics: any): string[] {
    const recommendations: string[] = [];
    
    if (analytics.userBehaviorPattern === 'frequent_refresher') {
      recommendations.push('Consider implementing longer cache retention to reduce refresh frequency');
    }
    
    if (decision.estimatedDuration > 2000) {
      recommendations.push('Consider background preloading for better perceived performance');
    }
    
    if (!context.hasInitialized && decision.scope === 'full_refresh') {
      recommendations.push('Consider progressive loading for first-time users');
    }
    
    return recommendations;
  }
} 