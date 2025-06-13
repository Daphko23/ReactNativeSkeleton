/**
 * 🏛️ CUSTOM FIELDS REPOSITORY INTERFACE - Enterprise Domain Contract
 * 
 * 🎯 CLEAN ARCHITECTURE DOMAIN LAYER:
 * - Defines business contracts for Custom Fields management
 * - Storage-agnostic interface for maximum testability
 * - Enterprise features: Analytics, Templates, GDPR compliance
 * - Advanced operations: Bulk updates, Field dependencies, Validation
 * 
 * 📊 ENTERPRISE CAPABILITIES:
 * - Field template management and recommendations
 * - Usage analytics and behavior tracking
 * - Advanced validation with business rules
 * - GDPR-compliant data lifecycle management
 * - Performance monitoring and health checks
 * - Multi-device synchronization support
 */

import { Result } from '@core/types/result.type';

// =============================================
// 🎯 CORE DOMAIN ENTITIES
// =============================================

/**
 * 📝 Custom Field Entity - Enhanced Enterprise Version
 */
export interface CustomField {
  key: string;
  value: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'phone' | 'number' | 'textarea' | 'select' | 'multiselect';
  placeholder: string;
  required: boolean;
  order: number;
  category?: 'personal' | 'professional' | 'contact' | 'social' | 'education' | 'certifications' | 'other';
  
  // 🎯 ENTERPRISE METADATA
  lastModified?: Date;
  createdAt?: Date;
  version?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string; // Regex pattern for validation
  options?: string[]; // For select/multiselect types
  
  // 🎯 BUSINESS FEATURES
  isPublic?: boolean; // GDPR: User-controlled visibility
  isSearchable?: boolean; // Search engine optimization
  businessImpact?: 'low' | 'medium' | 'high'; // Business value indicator
  
  // 🎯 ANALYTICS METADATA
  usageCount?: number;
  lastAccessed?: Date;
  effectivenessScore?: number; // 0-100 based on profile completeness impact
}

/**
 * 📋 Custom Field Template - Enterprise Template System
 */
export interface CustomFieldTemplate {
  id: string;
  key: string;
  label: string;
  type: CustomField['type'];
  placeholder: string;
  category: CustomField['category'];
  
  // 🎯 TEMPLATE METADATA
  description?: string;
  helpText?: string;
  isRecommended?: boolean;
  priority?: number; // 1-10 for sorting recommendations
  
  // 🎯 BUSINESS INTELLIGENCE
  usageRate?: number; // Percentage of users who use this template
  completionRate?: number; // Percentage of users who complete this field
  businessValue?: number; // Business impact score 0-100
  
  // 🎯 INDUSTRY CUSTOMIZATION
  industries?: string[]; // Recommended for specific industries
  careerLevels?: string[]; // Recommended for specific career levels
  regions?: string[]; // Regional customization
  
  // 🎯 VALIDATION RULES
  validationRules?: FieldValidationRule[];
  dependencies?: FieldDependency[]; // Other fields this depends on
  
  // 🎯 METADATA
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string; // Admin who created the template
  isActive?: boolean;
}

/**
 * 🔧 Field Validation Rule
 */
export interface FieldValidationRule {
  type: 'required' | 'length' | 'pattern' | 'custom';
  value?: any;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * 🔗 Field Dependency
 */
export interface FieldDependency {
  fieldKey: string;
  condition: 'exists' | 'equals' | 'contains' | 'not_empty';
  value?: string;
  message?: string;
}

/**
 * 📊 Field Usage Analytics
 */
export interface FieldUsageAnalytics {
  fieldKey: string;
  userId: string;
  action: 'view' | 'edit' | 'complete' | 'delete' | 'template_applied';
  timestamp: Date;
  sessionId?: string;
  source?: 'manual' | 'template' | 'recommendation' | 'import';
  
  // 🎯 PERFORMANCE METRICS
  timeSpent?: number; // Milliseconds
  characterCount?: number;
  revisionCount?: number;
  
  // 🎯 BUSINESS CONTEXT
  profileCompletnessBefore?: number;
  profileCompletenessAfter?: number;
  businessImpact?: number;
  
  // 🎯 USER CONTEXT
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  platform?: 'ios' | 'android' | 'web';
  appVersion?: string;
}

/**
 * 📈 Field Effectiveness Report
 */
export interface FieldEffectivenessReport {
  fieldKey: string;
  category: CustomField['category'];
  
  // 🎯 USAGE STATISTICS
  totalUsage: number;
  uniqueUsers: number;
  averageTimeToComplete: number;
  completionRate: number;
  
  // 🎯 BUSINESS METRICS
  profileCompletenessImpact: number;
  userEngagementScore: number;
  businessValueScore: number;
  
  // 🎯 RECOMMENDATIONS
  optimizationSuggestions: string[];
  performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  
  // 🎯 TRENDS
  usageTrend: 'increasing' | 'stable' | 'decreasing';
  periodStart: Date;
  periodEnd: Date;
}

// =============================================
// 🎯 REQUEST/RESPONSE INTERFACES
// =============================================

/**
 * 📥 Update Custom Fields Request
 */
export interface UpdateCustomFieldsRequest {
  userId: string;
  fields: CustomField[];
  
  // 🎯 ENTERPRISE OPTIONS
  validateDependencies?: boolean;
  trackAnalytics?: boolean;
  performanceProfile?: boolean;
  
  // 🎯 GDPR COMPLIANCE
  userConsent?: boolean;
  dataRetentionPeriod?: number; // Days
  privacyLevel?: 'public' | 'private' | 'restricted';
  
  // 🎯 BUSINESS CONTEXT
  source?: 'manual' | 'template' | 'import' | 'migration';
  businessJustification?: string;
  expectedImpact?: 'profile_completion' | 'search_optimization' | 'networking';
}

/**
 * 📤 Update Custom Fields Response
 */
export interface UpdateCustomFieldsResponse {
  success: boolean;
  fields: CustomField[];
  
  // 🎯 VALIDATION RESULTS
  validationResults: FieldValidationResult[];
  dependencyWarnings: string[];
  
  // 🎯 BUSINESS IMPACT
  profileCompletenessChange: number;
  businessValueAdded: number;
  optimizationSuggestions: string[];
  
  // 🎯 PERFORMANCE METRICS
  operationTime: number;
  cacheHitRate?: number;
  
  // 🎯 ANALYTICS
  analyticsTracked: boolean;
  trackingId?: string;
}

/**
 * ✅ Field Validation Result
 */
export interface FieldValidationResult {
  fieldKey: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  
  // 🎯 BUSINESS VALIDATION
  businessRulesPassed: boolean;
  dependenciesSatisfied: boolean;
  gdprCompliant: boolean;
  
  // 🎯 PERFORMANCE IMPACT
  validationTime: number;
  complexityScore: number;
}

/**
 * 📊 Templates Request
 */
export interface GetTemplatesRequest {
  userId?: string;
  category?: CustomField['category'];
  
  // 🎯 PERSONALIZATION
  userIndustry?: string;
  careerLevel?: string;
  region?: string;
  
  // 🎯 FILTERING
  onlyRecommended?: boolean;
  excludeUsed?: boolean;
  maxResults?: number;
  
  // 🎯 BUSINESS INTELLIGENCE
  includeTrends?: boolean;
  includeEffectiveness?: boolean;
  includeComparisons?: boolean;
}

/**
 * 📈 Templates Response
 */
export interface GetTemplatesResponse {
  templates: CustomFieldTemplate[];
  
  // 🎯 PERSONALIZED RECOMMENDATIONS
  recommendedForUser: CustomFieldTemplate[];
  trendingTemplates: CustomFieldTemplate[];
  industrySpecific: CustomFieldTemplate[];
  
  // 🎯 BUSINESS INTELLIGENCE
  effectivenessReports?: FieldEffectivenessReport[];
  usageTrends?: Record<string, number>;
  
  // 🎯 METADATA
  totalAvailable: number;
  lastUpdated: Date;
  cacheHit: boolean;
}

/**
 * 🔍 Analytics Query Request
 */
export interface GetAnalyticsRequest {
  userId?: string;
  fieldKeys?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  
  // 🎯 AGGREGATION OPTIONS
  groupBy?: 'day' | 'week' | 'month';
  includeComparisons?: boolean;
  includePredictions?: boolean;
  
  // 🎯 BUSINESS INTELLIGENCE
  includeBusinessImpact?: boolean;
  includeUserSegmentation?: boolean;
  includePerformanceMetrics?: boolean;
}

/**
 * 📊 Analytics Response
 */
export interface GetAnalyticsResponse {
  analytics: FieldUsageAnalytics[];
  
  // 🎯 AGGREGATED INSIGHTS
  summary: {
    totalFields: number;
    averageCompleteness: number;
    mostUsedFields: string[];
    leastUsedFields: string[];
  };
  
  // 🎯 BUSINESS INTELLIGENCE
  businessImpact: {
    profileCompletenessImprovement: number;
    userEngagementScore: number;
    estimatedBusinessValue: number;
  };
  
  // 🎯 PERFORMANCE METRICS
  performance: {
    averageOperationTime: number;
    cacheEfficiency: number;
    errorRate: number;
  };
  
  // 🎯 PREDICTIONS
  predictions?: {
    completionLikelihood: Record<string, number>;
    optimizationOpportunities: string[];
    futureUsageTrends: Record<string, number>;
  };
}

// =============================================
// 🏛️ REPOSITORY INTERFACE
// =============================================

/**
 * 🏛️ CUSTOM FIELDS REPOSITORY - Enterprise Domain Contract
 * 
 * 🎯 PRIMARY OPERATIONS:
 * - Complete CRUD for Custom Fields with validation
 * - Template management and recommendations
 * - Usage analytics and business intelligence
 * - GDPR-compliant data lifecycle management
 * 
 * 🚀 ENTERPRISE FEATURES:
 * - Advanced caching with TTL and performance monitoring
 * - Multi-device synchronization support
 * - Bulk operations with transaction support
 * - Health monitoring and diagnostics
 * - A/B testing infrastructure
 */
export interface ICustomFieldsRepository {
  
  // =============================================
  // 🎯 CORE CRUD OPERATIONS
  // =============================================
  
  /**
   * 📥 Get Custom Fields for User
   * @param userId - User identifier
   * @returns Promise<Result<CustomField[]>>
   */
  getCustomFields(userId: string): Promise<Result<CustomField[]>>;
  
  /**
   * 💾 Update Custom Fields with Enterprise Features
   * @param request - Update request with validation and analytics
   * @returns Promise<Result<UpdateCustomFieldsResponse>>
   */
  updateCustomFields(request: UpdateCustomFieldsRequest): Promise<Result<UpdateCustomFieldsResponse>>;
  
  /**
   * ❌ Delete Custom Field with GDPR Compliance
   * @param userId - User identifier
   * @param fieldKey - Field to delete
   * @param gdprJustification - GDPR deletion justification
   * @returns Promise<Result<void>>
   */
  deleteCustomField(userId: string, fieldKey: string, gdprJustification?: string): Promise<Result<void>>;
  
  /**
   * 🔄 Bulk Update with Transaction Support
   * @param requests - Multiple update requests
   * @returns Promise<Result<UpdateCustomFieldsResponse[]>>
   */
  bulkUpdateCustomFields(requests: UpdateCustomFieldsRequest[]): Promise<Result<UpdateCustomFieldsResponse[]>>;
  
  // =============================================
  // 📋 TEMPLATE MANAGEMENT
  // =============================================
  
  /**
   * 📋 Get Field Templates with Personalization
   * @param request - Template request with personalization options
   * @returns Promise<Result<GetTemplatesResponse>>
   */
  getTemplates(request: GetTemplatesRequest): Promise<Result<GetTemplatesResponse>>;
  
  /**
   * 🎯 Get Personalized Recommendations
   * @param userId - User identifier
   * @param context - User context for personalization
   * @returns Promise<Result<CustomFieldTemplate[]>>
   */
  getPersonalizedRecommendations(userId: string, context?: any): Promise<Result<CustomFieldTemplate[]>>;
  
  /**
   * 📊 Track Template Usage
   * @param userId - User identifier
   * @param templateId - Template identifier
   * @param applied - Whether template was applied
   * @returns Promise<Result<void>>
   */
  trackTemplateUsage(userId: string, templateId: string, applied: boolean): Promise<Result<void>>;
  
  // =============================================
  // 📊 ANALYTICS & BUSINESS INTELLIGENCE
  // =============================================
  
  /**
   * 📊 Save Field Usage Analytics
   * @param analytics - Usage analytics data
   * @returns Promise<Result<void>>
   */
  saveFieldUsageAnalytics(analytics: FieldUsageAnalytics): Promise<Result<void>>;
  
  /**
   * 📈 Get Analytics Data
   * @param request - Analytics query request
   * @returns Promise<Result<GetAnalyticsResponse>>
   */
  getAnalytics(request: GetAnalyticsRequest): Promise<Result<GetAnalyticsResponse>>;
  
  /**
   * 📊 Get Field Effectiveness Reports
   * @param fieldKeys - Specific fields to analyze
   * @param period - Analysis period
   * @returns Promise<Result<FieldEffectivenessReport[]>>
   */
  getFieldEffectivenessReports(fieldKeys?: string[], period?: { start: Date; end: Date }): Promise<Result<FieldEffectivenessReport[]>>;
  
  // =============================================
  // ✅ VALIDATION & BUSINESS RULES
  // =============================================
  
  /**
   * ✅ Validate Field Configuration
   * @param fields - Fields to validate
   * @param userId - User context for validation
   * @returns Promise<Result<FieldValidationResult[]>>
   */
  validateFieldConfiguration(fields: CustomField[], userId?: string): Promise<Result<FieldValidationResult[]>>;
  
  /**
   * 🔗 Check Field Dependencies
   * @param fields - Fields to check
   * @returns Promise<Result<string[]>> - Dependency warnings
   */
  checkFieldDependencies(fields: CustomField[]): Promise<Result<string[]>>;
  
  /**
   * 🛡️ Validate GDPR Compliance
   * @param fields - Fields to validate
   * @param userConsent - User consent information
   * @returns Promise<Result<boolean>>
   */
  validateGDPRCompliance(fields: CustomField[], userConsent?: any): Promise<Result<boolean>>;
  
  // =============================================
  // 🚀 PERFORMANCE & HEALTH
  // =============================================
  
  /**
   * 🏥 Health Check
   * @returns Promise<Result<RepositoryHealthStatus>>
   */
  checkHealth(): Promise<Result<RepositoryHealthStatus>>;
  
  /**
   * 📊 Get Performance Metrics
   * @returns Promise<Result<PerformanceMetrics>>
   */
  getPerformanceMetrics(): Promise<Result<PerformanceMetrics>>;
  
  /**
   * 🗑️ Clear Cache
   * @param userId - Specific user or all users
   * @returns Promise<Result<void>>
   */
  clearCache(userId?: string): Promise<Result<void>>;
  
  /**
   * 🔄 Synchronize Data
   * @param userId - User identifier
   * @returns Promise<Result<void>>
   */
  synchronizeData(userId: string): Promise<Result<void>>;
  
  // =============================================
  // 🔬 GDPR & DATA LIFECYCLE
  // =============================================
  
  /**
   * 📋 Export User Data (GDPR Right to Portability)
   * @param userId - User identifier
   * @param format - Export format
   * @returns Promise<Result<any>>
   */
  exportUserData(userId: string, format?: 'json' | 'csv' | 'xml'): Promise<Result<any>>;
  
  /**
   * 🗑️ Delete All User Data (GDPR Right to Erasure)
   * @param userId - User identifier
   * @param justification - GDPR deletion justification
   * @returns Promise<Result<void>>
   */
  deleteAllUserData(userId: string, justification: string): Promise<Result<void>>;
  
  /**
   * 📜 Get Data Processing History
   * @param userId - User identifier
   * @returns Promise<Result<DataProcessingRecord[]>>
   */
  getDataProcessingHistory(userId: string): Promise<Result<DataProcessingRecord[]>>;
}

// =============================================
// 🎯 SUPPORTING INTERFACES
// =============================================

/**
 * 🏥 Repository Health Status
 */
export interface RepositoryHealthStatus {
  isHealthy: boolean;
  services: {
    database: 'healthy' | 'degraded' | 'failed';
    cache: 'healthy' | 'degraded' | 'failed';
    analytics: 'healthy' | 'degraded' | 'failed';
  };
  performance: {
    averageResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
  lastCheck: Date;
  details?: string;
}

/**
 * 📊 Performance Metrics
 */
export interface PerformanceMetrics {
  operations: {
    reads: { count: number; averageTime: number; };
    writes: { count: number; averageTime: number; };
    deletes: { count: number; averageTime: number; };
  };
  cache: {
    hitRate: number;
    missRate: number;
    size: number;
    lastCleared: Date;
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    recentErrors: string[];
  };
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * 📜 Data Processing Record (GDPR Audit Trail)
 */
export interface DataProcessingRecord {
  id: string;
  userId: string;
  operation: 'create' | 'read' | 'update' | 'delete' | 'export';
  fieldKeys: string[];
  timestamp: Date;
  source: string;
  purpose: string;
  legalBasis: string;
  userConsent: boolean;
  dataRetentionUntil?: Date;
}