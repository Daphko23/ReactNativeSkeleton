/**
 * @fileoverview Profile Refresh Repository Interface - Enterprise Domain Layer
 * 
 * ✅ ENTERPRISE REPOSITORY CONTRACT:
 * - Advanced Caching with TTL/LRU strategies
 * - Business Intelligence & Analytics
 * - Health Monitoring & Performance Metrics
 * - GDPR Compliance & Data Lifecycle Management
 * - A/B Testing & Feature Flag Integration
 * - Audit Trails & Enterprise Logging
 * 
 * @module ProfileRefreshRepositoryInterface
 * @since 3.0.0 (Enterprise Clean Architecture)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Domain (Repository Interface)
 * @architecture Clean Architecture - Domain Layer
 */

import { Result } from '@core/types/result.type';

// =============================================================================
// CORE DOMAIN ENTITIES - Enhanced for Enterprise
// =============================================================================

export interface RefreshData {
  userId: string;
  refreshId: string;
  timestamp: number;
  scope: RefreshScope;
  strategy: RefreshStrategy;
  duration: number;
  success: boolean;
  
  // Enterprise Extensions
  sessionId: string;
  userAgent: string;
  appVersion: string;
  platform: 'ios' | 'android';
  networkType: 'wifi' | 'cellular' | 'unknown';
  batteryLevel?: number;
  memoryUsage: number;
  cacheHitRate: number;
}

export interface RefreshEvent {
  eventId: string;
  userId: string;
  timestamp: number;
  trigger: RefreshTrigger;
  context: RefreshEventContext;
  result: RefreshEventResult;
  
  // Analytics Data
  userBehaviorPattern: string;
  sessionDuration: number;
  previousRefreshTime?: number;
  
  // Business Intelligence
  businessImpact: BusinessImpactMetrics;
  performanceMetrics: PerformanceMetrics;
}

export interface RefreshEventContext {
  screenName?: string;
  navigationStack: string[];
  pendingUpdates: Record<string, boolean>;
  cacheState: CacheStateSnapshot;
  deviceContext: DeviceContext;
}

export interface RefreshEventResult {
  success: boolean;
  duration: number;
  itemsRefreshed: string[];
  errors: string[];
  cacheOperations: CacheOperation[];
  networkRequests: NetworkRequest[];
}

export interface BusinessImpactMetrics {
  userEngagementScore: number;
  conversionImpact: number;
  retentionEffect: number;
  performanceGain: number;
  costEfficiency: number;
}

export interface PerformanceMetrics {
  startTime: number;
  endTime: number;
  totalDuration: number;
  networkLatency: number;
  renderTime: number;
  memoryDelta: number;
  cpuUsage: number;
  batteryImpact: number;
}

export interface CacheStateSnapshot {
  totalItems: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  memoryUsage: number;
  oldestItem: number;
  newestItem: number;
}

export interface DeviceContext {
  platform: 'ios' | 'android';
  osVersion: string;
  appVersion: string;
  deviceModel: string;
  screenDimensions: { width: number; height: number };
  orientation: 'portrait' | 'landscape';
  networkType: string;
  batteryLevel?: number;
  isLowPowerMode?: boolean;
  availableMemory: number;
}

export interface CacheOperation {
  type: 'hit' | 'miss' | 'set' | 'evict' | 'clear';
  key: string;
  timestamp: number;
  size?: number;
  ttl?: number;
}

export interface NetworkRequest {
  url: string;
  method: string;
  startTime: number;
  endTime: number;
  statusCode: number;
  responseSize: number;
  cached: boolean;
}

// =============================================================================
// ANALYTICS & BUSINESS INTELLIGENCE
// =============================================================================

export interface RefreshAnalytics {
  userId: string;
  timeframe: TimeFrame;
  totalRefreshes: number;
  successRate: number;
  averageDuration: number;
  
  // User Behavior Insights
  userBehaviorPattern: 'frequent' | 'normal' | 'occasional' | 'power_user';
  refreshFrequency: number;
  peakUsageHours: number[];
  preferredTriggers: RefreshTrigger[];
  
  // Performance Analytics
  performanceTrends: PerformanceTrend[];
  errorPatterns: ErrorPattern[];
  cacheEfficiency: CacheEfficiencyMetrics;
  
  // Business Intelligence
  engagementMetrics: UserEngagementMetrics;
  conversionMetrics: ConversionMetrics;
  retentionMetrics: RetentionMetrics;
}

export interface BehaviorInsights {
  userId: string;
  analysisDate: number;
  confidence: number; // 0-100%
  
  // Behavioral Patterns
  primaryUsagePattern: UsagePattern;
  secondaryPatterns: UsagePattern[];
  anomalies: BehaviorAnomaly[];
  
  // Predictions
  predictedNextRefresh: number;
  optimalRefreshTimes: number[];
  churnRisk: number; // 0-100%
  
  // Recommendations
  personalizedStrategies: PersonalizationStrategy[];
  performanceOptimizations: OptimizationRecommendation[];
}

export interface TimeFrame {
  start: number;
  end: number;
  granularity: 'hour' | 'day' | 'week' | 'month';
}

export interface PerformanceTrend {
  metric: string;
  timeline: { timestamp: number; value: number }[];
  trend: 'improving' | 'stable' | 'degrading';
  significance: number; // 0-100%
}

export interface ErrorPattern {
  errorType: string;
  frequency: number;
  contexts: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
}

export interface CacheEfficiencyMetrics {
  hitRate: number;
  missRate: number;
  evictionRate: number;
  memoryEfficiency: number;
  costSavings: number; // estimated API cost savings
}

export interface UserEngagementMetrics {
  sessionDuration: number;
  screenViews: number;
  interactionRate: number;
  bounceRate: number;
  conversionEvents: number;
}

export interface ConversionMetrics {
  conversionRate: number;
  revenueImpact: number;
  funnelOptimization: number;
  abTestEffectiveness: number;
}

export interface RetentionMetrics {
  dailyRetention: number;
  weeklyRetention: number;
  monthlyRetention: number;
  churnPrevention: number;
}

// =============================================================================
// HEALTH MONITORING & SERVICE METRICS
// =============================================================================

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'critical';
  timestamp: number;
  version: string;
  uptime: number;
  
  // Core Metrics
  responseTime: number;
  errorRate: number;
  throughput: number;
  availability: number;
  
  // Resource Metrics
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  networkLatency: number;
  
  // Business Metrics
  activeUsers: number;
  successfulRefreshes: number;
  businessImpactScore: number;
  
  // Health Indicators
  healthChecks: HealthCheck[];
  alerts: ServiceAlert[];
  dependencies: DependencyHealth[];
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  responseTime: number;
  details?: Record<string, any>;
  lastCheck: number;
}

export interface ServiceAlert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
  resolvedAt?: number;
}

export interface DependencyHealth {
  name: string;
  status: 'available' | 'degraded' | 'unavailable';
  responseTime: number;
  lastCheck: number;
  errorRate: number;
}

// =============================================================================
// GDPR & COMPLIANCE
// =============================================================================

export interface DataRetentionPolicy {
  personalDataTTL: number; // milliseconds
  analyticsDataTTL: number;
  logsDataTTL: number;
  complianceVersion: string;
  
  // GDPR Specific
  rightToBeForgettenEnabled: boolean;
  dataPortabilityEnabled: boolean;
  consentManagementEnabled: boolean;
  
  // Audit Requirements
  auditLogRetention: number;
  complianceReportingInterval: number;
}

export interface CleanupReport {
  executionTime: number;
  itemsProcessed: number;
  itemsDeleted: number;
  errorsEncountered: number;
  complianceScore: number; // 0-100%
  
  // Detailed Breakdown
  personalDataCleaned: number;
  analyticsDataCleaned: number;
  logDataCleaned: number;
  
  // Business Impact
  storageSaved: number; // bytes
  costSavings: number; // estimated cost
  riskReduction: number; // compliance risk reduction
}

export interface UserDataExport {
  userId: string;
  exportTime: number;
  format: 'json' | 'csv' | 'xml';
  includeAnalytics: boolean;
  
  // Data Categories
  profileData: Record<string, any>;
  refreshHistory: RefreshEvent[];
  analyticsData: RefreshAnalytics;
  preferencesData: Record<string, any>;
  
  // Compliance Metadata
  legalBasis: string;
  retentionPeriod: number;
  processingPurpose: string[];
  
  // Export Metadata
  exportSize: number; // bytes
  compressionUsed: boolean;
  encryptionUsed: boolean;
  checksumHash: string;
}

// =============================================================================
// A/B TESTING & EXPERIMENTATION
// =============================================================================

export interface ExperimentConfig {
  experimentId: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  
  // Experiment Parameters
  trafficAllocation: number; // 0-100%
  variants: ExperimentVariant[];
  targetAudience: AudienceSegment;
  
  // Business Objectives
  primaryMetric: string;
  secondaryMetrics: string[];
  successCriteria: SuccessCriteria;
  
  // Timeline
  startDate: number;
  endDate: number;
  duration: number;
  
  // Statistical Configuration
  confidenceLevel: number; // e.g., 95%
  minimumDetectableEffect: number;
  sampleSizeRequired: number;
  
  // Results (if completed)
  results?: ExperimentResults;
}

export interface ExperimentVariant {
  variantId: string;
  name: string;
  description: string;
  trafficPercentage: number;
  configuration: Record<string, any>;
  
  // Performance Data
  conversionRate?: number;
  engagementMetrics?: UserEngagementMetrics;
  businessMetrics?: BusinessImpactMetrics;
}

export interface AudienceSegment {
  segmentId: string;
  name: string;
  criteria: SegmentCriteria[];
  estimatedSize: number;
}

export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface SuccessCriteria {
  metric: string;
  targetValue: number;
  comparison: 'greater_than' | 'less_than' | 'equals';
  confidenceLevel: number;
}

export interface ExperimentResults {
  totalParticipants: number;
  statisticalSignificance: boolean;
  pValue: number;
  confidenceInterval: [number, number];
  
  // Variant Performance
  variantResults: VariantResult[];
  winningVariant?: string;
  liftPercent?: number;
  
  // Business Impact
  estimatedImpact: BusinessImpactEstimate;
  recommendations: string[];
}

export interface VariantResult {
  variantId: string;
  participants: number;
  conversionRate: number;
  confidenceInterval: [number, number];
  businessMetrics: BusinessImpactMetrics;
}

export interface BusinessImpactEstimate {
  revenueImpact: number;
  costImpact: number;
  userExperienceImpact: number;
  operationalImpact: number;
  riskAssessment: string;
}

// =============================================================================
// MAIN REPOSITORY INTERFACE - Enterprise Contract
// =============================================================================

/**
 * ProfileRefreshRepositoryInterface - Enterprise Repository Contract
 * 
 * Comprehensive enterprise data management for profile refresh operations
 * including advanced caching, analytics, health monitoring, and compliance.
 */
export interface ProfileRefreshRepositoryInterface {
  // =============================================================================
  // ADVANCED CACHING OPERATIONS
  // =============================================================================
  
  /**
   * Get cached refresh data with enterprise features
   */
  getCachedRefreshData(userId: string): Promise<Result<RefreshData | null>>;
  
  /**
   * Set cached refresh data with TTL and business metadata
   */
  setCachedRefreshData(userId: string, data: RefreshData, ttl: number): Promise<Result<void>>;
  
  /**
   * Invalidate cache with smart invalidation strategies
   */
  invalidateCache(userId: string, scope?: 'user' | 'global'): Promise<Result<void>>;
  
  /**
   * Get cache statistics for monitoring and optimization
   */
  getCacheStatistics(): Promise<Result<CacheEfficiencyMetrics>>;
  
  /**
   * Warm cache with predictive preloading
   */
  warmCache(userIds: string[], priority?: 'high' | 'normal' | 'low'): Promise<Result<void>>;
  
  // =============================================================================
  // ANALYTICS & BUSINESS INTELLIGENCE
  // =============================================================================
  
  /**
   * Track refresh event with comprehensive business context
   */
  trackRefreshEvent(event: RefreshEvent): Promise<Result<void>>;
  
  /**
   * Get refresh analytics with business intelligence insights
   */
  getRefreshAnalytics(userId: string, timeframe: TimeFrame): Promise<Result<RefreshAnalytics>>;
  
  /**
   * Get user behavior insights with ML-powered analysis
   */
  getUserBehaviorInsights(userId: string): Promise<Result<BehaviorInsights>>;
  
  /**
   * Get aggregated business metrics across all users
   */
  getBusinessMetrics(timeframe: TimeFrame): Promise<Result<BusinessImpactMetrics>>;
  
  /**
   * Generate predictive insights for business optimization
   */
  generatePredictiveInsights(userId: string): Promise<Result<BehaviorInsights>>;
  
  // =============================================================================
  // HEALTH MONITORING & PERFORMANCE
  // =============================================================================
  
  /**
   * Get comprehensive service health status
   */
  getServiceHealth(): Promise<Result<ServiceHealth>>;
  
  /**
   * Record detailed performance metrics
   */
  recordPerformanceMetrics(metrics: PerformanceMetrics): Promise<Result<void>>;
  
  /**
   * Get performance trends and analysis
   */
  getPerformanceTrends(timeframe: TimeFrame): Promise<Result<PerformanceTrend[]>>;
  
  /**
   * Monitor and alert on service degradation
   */
  checkHealthThresholds(): Promise<Result<ServiceAlert[]>>;
  
  // =============================================================================
  // GDPR & COMPLIANCE MANAGEMENT
  // =============================================================================
  
  /**
   * Get current data retention policy
   */
  getDataRetentionPolicy(): DataRetentionPolicy;
  
  /**
   * Execute automated compliance cleanup
   */
  cleanupExpiredData(): Promise<Result<CleanupReport>>;
  
  /**
   * Export user data for GDPR compliance
   */
  exportUserData(userId: string, format?: 'json' | 'csv' | 'xml'): Promise<Result<UserDataExport>>;
  
  /**
   * Delete user data (Right to be Forgotten)
   */
  deleteUserData(userId: string, verificationToken: string): Promise<Result<void>>;
  
  /**
   * Generate compliance audit report
   */
  generateComplianceReport(timeframe: TimeFrame): Promise<Result<any>>;
  
  // =============================================================================
  // A/B TESTING & EXPERIMENTATION
  // =============================================================================
  
  /**
   * Get active experiment configuration for user
   */
  getActiveExperiment(userId: string, experimentType: string): Promise<Result<ExperimentConfig | null>>;
  
  /**
   * Track experiment participation and metrics
   */
  trackExperimentMetrics(experimentId: string, userId: string, metrics: any): Promise<Result<void>>;
  
  /**
   * Get experiment results and statistical analysis
   */
  getExperimentResults(experimentId: string): Promise<Result<ExperimentResults>>;
  
  /**
   * Check feature flag status
   */
  getFeatureFlag(flagName: string, userId?: string): Promise<Result<boolean>>;
  
  // =============================================================================
  // ENTERPRISE SEARCH & REPORTING
  // =============================================================================
  
  /**
   * Search refresh events with advanced filtering
   */
  searchRefreshEvents(criteria: any, pagination?: any): Promise<Result<RefreshEvent[]>>;
  
  /**
   * Generate business intelligence reports
   */
  generateBIReport(reportType: string, parameters: any): Promise<Result<any>>;
  
  /**
   * Get real-time dashboard data
   */
  getDashboardData(dashboardId: string): Promise<Result<any>>;
  
  // =============================================================================
  // SERVICE LIFECYCLE MANAGEMENT
  // =============================================================================
  
  /**
   * Initialize repository with enterprise configuration
   */
  initialize(config: any): Promise<Result<void>>;
  
  /**
   * Gracefully shutdown repository services
   */
  shutdown(): Promise<Result<void>>;
  
  /**
   * Get repository configuration and status
   */
  getStatus(): Promise<Result<any>>;
}

// =============================================================================
// TYPE EXPORTS - Re-export for clean imports
// =============================================================================

export * from '../../application/use-cases/refresh/manage-profile-refresh.use-case';

// Additional type aliases for convenience
export type RefreshTrigger = 'initial_focus' | 'profile_edit_return' | 'avatar_upload_return' | 'pull_to_refresh' | 'tab_navigation' | 'manual';
export type RefreshStrategy = 'immediate' | 'debounced' | 'background' | 'skip';
export type RefreshScope = 'profile_only' | 'avatar_only' | 'full_refresh' | 'cache_check';

// Enterprise-specific types
export type UsagePattern = 'power_user' | 'regular' | 'casual' | 'new_user' | 'returning' | 'at_risk';
export type BehaviorAnomaly = {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: number;
  confidence: number;
};
export type PersonalizationStrategy = {
  strategyId: string;
  name: string;
  description: string;
  configuration: Record<string, any>;
  expectedImpact: number;
};
export type OptimizationRecommendation = {
  recommendationId: string;
  category: 'performance' | 'engagement' | 'retention' | 'conversion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  implementation: string;
  expectedBenefit: string;
  effort: 'low' | 'medium' | 'high';
};