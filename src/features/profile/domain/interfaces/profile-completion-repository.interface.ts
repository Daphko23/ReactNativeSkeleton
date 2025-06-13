/**
 * @fileoverview Profile Completion Repository Interface - Enterprise Data Layer
 * 
 * ✅ DOMAIN LAYER - REPOSITORY INTERFACE:
 * - Profile Completion Analytics Data Access
 * - Completion Preferences and User Settings
 * - Suggestion Analytics and A/B Testing Data
 * - Performance Metrics and Caching Interface
 */

import { CompletionSuggestion } from '../../application/use-cases/completion/generate-completion-suggestions.use-case';

/**
 * Completion Analytics Data
 */
export interface CompletionAnalytics {
  userId: string;
  completionHistory: CompletionHistoryEntry[];
  suggestionInteractions: SuggestionInteraction[];
  performanceMetrics: CompletionPerformanceMetrics;
  abTestData: AbTestData;
  lastUpdated: number;
  version: string;
}

/**
 * Completion History Entry
 */
export interface CompletionHistoryEntry {
  timestamp: number;
  field: string;
  action: 'completed' | 'dismissed' | 'viewed';
  suggestionId?: string;
  completionPercentageBefore: number;
  completionPercentageAfter: number;
  timeSpent: number; // seconds
  source: 'suggestion' | 'manual' | 'import';
}

/**
 * Suggestion Interaction Tracking
 */
export interface SuggestionInteraction {
  suggestionId: string;
  field: string;
  priority: string;
  category: string;
  timestamp: number;
  action: 'viewed' | 'clicked' | 'dismissed' | 'completed';
  timeToAction: number; // milliseconds from view to action
  abTestVariant?: string;
  personalizedReason?: string;
}

/**
 * Completion Performance Metrics
 */
export interface CompletionPerformanceMetrics {
  averageCompletionTime: Record<string, number>; // field -> avg time
  dropOffPoints: string[]; // fields where users commonly stop
  conversionRates: Record<string, number>; // suggestion -> completion rate
  engagementScore: number; // 0-100
  lastSessionDuration: number;
  totalCompletionSessions: number;
}

/**
 * A/B Testing Data
 */
export interface AbTestData {
  currentVariant: 'control' | 'prioritized' | 'personalized';
  variantAssignedAt: number;
  variantPerformance: {
    suggestionsViewed: number;
    suggestionsCompleted: number;
    conversionRate: number;
    engagementTime: number;
  };
  experimentId?: string;
}

/**
 * Completion Preferences
 */
export interface CompletionPreferences {
  userId: string;
  enableSuggestions: boolean;
  maxSuggestions: number;
  preferredCategories: ('identity' | 'professional' | 'social' | 'content')[];
  dismissedSuggestions: string[];
  notificationSettings: {
    enableCompletionReminders: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
    lastReminderSent: number;
  };
  privacySettings: {
    allowAnalytics: boolean;
    allowPersonalization: boolean;
    shareCompletionStats: boolean;
  };
  lastUpdated: number;
  version: string;
}

/**
 * Completion Cache Entry
 */
export interface CompletionCacheEntry {
  userId: string;
  cacheKey: string;
  data: any;
  expiresAt: number;
  tags: string[];
  metadata: {
    generationTime: number;
    accessCount: number;
    lastAccessed: number;
  };
}

/**
 * Repository Query Options
 */
export interface CompletionQueryOptions {
  includeAnalytics?: boolean;
  includeSuggestions?: boolean;
  fromDate?: number;
  toDate?: number;
  limit?: number;
  offset?: number;
  orderBy?: 'timestamp' | 'completion_percentage' | 'engagement_score';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Bulk Analytics Update
 */
export interface BulkAnalyticsUpdate {
  userId: string;
  updates: {
    historyEntries?: CompletionHistoryEntry[];
    interactions?: SuggestionInteraction[];
    performanceMetrics?: Partial<CompletionPerformanceMetrics>;
    abTestData?: Partial<AbTestData>;
  };
}

/**
 * 🏛️ PROFILE COMPLETION REPOSITORY INTERFACE
 * 
 * ✅ ENTERPRISE DATA ACCESS:
 * - Completion Analytics CRUD Operations
 * - Suggestion Interaction Tracking
 * - A/B Testing Data Management
 * - Performance Metrics and Caching
 * - GDPR-Compliant Data Export/Deletion
 * 
 * ✅ CLEAN ARCHITECTURE:
 * - Domain Layer Interface (Implementation-Independent)
 * - Comprehensive Error Handling
 * - Performance-Optimized Queries
 * - Caching and Analytics Support
 */
export interface IProfileCompletionRepository {
  
  // =============================================================================
  // ANALYTICS OPERATIONS
  // =============================================================================

  /**
   * Get completion analytics for user
   */
  getCompletionAnalytics(
    userId: string, 
    options?: CompletionQueryOptions
  ): Promise<CompletionAnalytics | null>;

  /**
   * Save completion analytics
   */
  saveCompletionAnalytics(analytics: CompletionAnalytics): Promise<void>;

  /**
   * Update analytics with bulk data
   */
  updateAnalyticsBulk(update: BulkAnalyticsUpdate): Promise<void>;

  /**
   * Track suggestion interaction
   */
  trackSuggestionInteraction(interaction: SuggestionInteraction): Promise<void>;

  /**
   * Track completion history entry
   */
  trackCompletionHistory(entry: CompletionHistoryEntry): Promise<void>;

  // =============================================================================
  // PREFERENCES OPERATIONS
  // =============================================================================

  /**
   * Get user completion preferences
   */
  getCompletionPreferences(userId: string): Promise<CompletionPreferences | null>;

  /**
   * Save completion preferences
   */
  saveCompletionPreferences(preferences: CompletionPreferences): Promise<void>;

  /**
   * Update specific preference settings
   */
  updatePreferences(
    userId: string, 
    updates: Partial<CompletionPreferences>
  ): Promise<void>;

  // =============================================================================
  // CACHING OPERATIONS
  // =============================================================================

  /**
   * Get cached completion data
   */
  getCachedCompletion(userId: string, cacheKey: string): Promise<CompletionCacheEntry | null>;

  /**
   * Set cached completion data
   */
  setCachedCompletion(entry: CompletionCacheEntry): Promise<void>;

  /**
   * Invalidate cache entries by tags
   */
  invalidateCacheByTags(tags: string[]): Promise<void>;

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): Promise<number>; // Returns count of cleared entries

  // =============================================================================
  // A/B TESTING OPERATIONS
  // =============================================================================

  /**
   * Get A/B test assignment for user
   */
  getAbTestAssignment(userId: string): Promise<AbTestData | null>;

  /**
   * Update A/B test performance data
   */
  updateAbTestPerformance(
    userId: string, 
    performance: Partial<AbTestData['variantPerformance']>
  ): Promise<void>;

  /**
   * Get A/B test results summary
   */
  getAbTestResults(experimentId: string): Promise<{
    variants: Record<string, {
      users: number;
      averageConversionRate: number;
      averageEngagementTime: number;
    }>;
    statistical_significance: number;
  }>;

  // =============================================================================
  // ANALYTICS QUERIES
  // =============================================================================

  /**
   * Get completion trends over time
   */
  getCompletionTrends(
    userId: string,
    fromDate: number,
    toDate: number
  ): Promise<Array<{
    date: number;
    completionPercentage: number;
    fieldsCompleted: string[];
    timeSpent: number;
  }>>;

  /**
   * Get field completion statistics
   */
  getFieldCompletionStats(userId: string): Promise<Record<string, {
    completionRate: number;
    averageTimeToComplete: number;
    dropOffRate: number;
    lastCompleted?: number;
  }>>;

  /**
   * Get suggestion effectiveness metrics
   */
  getSuggestionEffectiveness(): Promise<Record<string, {
    field: string;
    category: string;
    viewRate: number;
    clickRate: number;
    completionRate: number;
    averageTimeToComplete: number;
  }>>;

  // =============================================================================
  // GDPR COMPLIANCE OPERATIONS
  // =============================================================================

  /**
   * Export all completion data for user (GDPR)
   */
  exportUserCompletionData(userId: string): Promise<{
    analytics: CompletionAnalytics;
    preferences: CompletionPreferences;
    interactions: SuggestionInteraction[];
    history: CompletionHistoryEntry[];
    exportTimestamp: number;
  }>;

  /**
   * Delete all completion data for user (GDPR)
   */
  deleteUserCompletionData(userId: string): Promise<{
    analyticsDeleted: boolean;
    preferencesDeleted: boolean;
    cacheCleared: boolean;
    interactionsDeleted: number;
    historyDeleted: number;
  }>;

  /**
   * Anonymize completion data (GDPR)
   */
  anonymizeUserCompletionData(userId: string): Promise<void>;

  // =============================================================================
  // HEALTH AND MONITORING
  // =============================================================================

  /**
   * Check repository health
   */
  checkHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: {
      responseTime: number;
      errorRate: number;
      cacheHitRate: number;
      storageUsage: number;
    };
    lastCheck: number;
  }>;

  /**
   * Get repository performance metrics
   */
  getPerformanceMetrics(): Promise<{
    averageQueryTime: number;
    slowestQueries: Array<{ query: string; duration: number }>;
    cacheStatistics: {
      hitRate: number;
      missRate: number;
      evictionRate: number;
    };
    storageStatistics: {
      totalSize: number;
      userDataSize: number;
      cacheSize: number;
    };
  }>;
}