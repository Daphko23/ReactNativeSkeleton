/**
 * @fileoverview Profile Completeness Repository Interface - Enterprise Domain Contracts
 * 
 * ✅ ENTERPRISE REPOSITORY PATTERN:
 * - Clean Architecture separation
 * - Testable interface contracts
 * - Advanced completeness analytics
 * - GDPR-compliant data handling
 * - Performance monitoring capabilities
 */

import { UserProfile } from '../entities/user-profile.entity';

// 🎯 CORE COMPLETENESS TYPES
export interface ProfileCompleteness {
  percentage: number;
  missingFields: string[];
  recommendations: string[];
  score: 'excellent' | 'good' | 'fair' | 'poor';
  nextSteps: string[];
  // 🚀 ENTERPRISE: Enhanced metadata
  calculatedAt: number;
  version: string;
  personalizedInsights?: PersonalizedInsights;
  performanceMetrics?: CompletenessPerformanceMetrics;
}

export interface PersonalizedInsights {
  userType: 'professional' | 'casual' | 'social' | 'minimal';
  priorityFields: string[];
  completionTimeEstimate: number; // minutes
  industryBenchmark?: number;
  similarUserCompletion?: number;
}

export interface CompletenessPerformanceMetrics {
  calculationTime: number;
  fieldAnalysisTime: number;
  recommendationGenerationTime: number;
  cacheHit: boolean;
}

export interface CompletionHistoryEntry {
  timestamp: number;
  percentage: number;
  changedFields: string[];
  actionType: 'field_added' | 'field_updated' | 'field_removed';
  improvementDelta: number;
}

export interface CompletionAnalytics {
  userId: string;
  totalCalculations: number;
  averageCompletionRate: number;
  completionTrend: 'improving' | 'stable' | 'declining';
  fieldCompletionRates: Record<string, number>;
  recommendationEffectiveness: Record<string, number>;
  sessionMetrics: {
    calculationsPerSession: number;
    averageSessionDuration: number;
    lastSessionTime: number;
  };
  // 🚀 ENTERPRISE: Advanced analytics
  userBehaviorInsights?: {
    preferredCompletionStrategy: 'incremental' | 'bulk' | 'guided';
    mostIgnoredRecommendations: string[];
    fieldCompletionPatterns: Record<string, number>;
    timeToCompletion: Record<string, number>; // field -> average minutes
  };
}

export interface CompletionRecommendation {
  id: string;
  fieldName: string;
  priority: 'high' | 'medium' | 'low';
  impact: number; // percentage points improvement
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // minutes
  description: string;
  actionText: string;
  category: 'basic' | 'professional' | 'social' | 'advanced';
  // 🚀 ENTERPRISE: Personalization
  personalizedReason?: string;
  abTestVariant?: string;
  businessImpact?: {
    profileViews: number;
    connectionRequests: number;
    jobOpportunities: number;
  };
}

export interface CompletionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  validatedFields: string[];
  invalidFields: string[];
}

export interface CompletenessExportData {
  completeness: ProfileCompleteness;
  history: CompletionHistoryEntry[];
  analytics: CompletionAnalytics;
  recommendations: CompletionRecommendation[];
  metadata: {
    userId: string;
    exportTime: number;
    version: string;
    dataSize: number;
    gdprCompliant: boolean;
  };
}

// 🏛️ REPOSITORY INTERFACE
export interface IProfileCompletenessRepository {
  // 🎯 CORE COMPLETENESS OPERATIONS
  calculateCompleteness(
    profile: UserProfile, 
    options?: {
      includePersonalization?: boolean;
      includePerformanceMetrics?: boolean;
      useCache?: boolean;
    }
  ): Promise<ProfileCompleteness>;
  
  validateProfileData(profile: UserProfile): Promise<CompletionValidationResult>;
  
  // 📊 RECOMMENDATIONS ENGINE
  generateRecommendations(
    profile: UserProfile, 
    completeness: ProfileCompleteness,
    options?: {
      maxRecommendations?: number;
      personalize?: boolean;
      includeBusinessImpact?: boolean;
    }
  ): Promise<CompletionRecommendation[]>;
  
  // 📈 ANALYTICS & HISTORY
  getCompletionHistory(
    userId: string,
    options?: {
      limit?: number;
      startDate?: number;
      endDate?: number;
    }
  ): Promise<CompletionHistoryEntry[]>;
  
  saveCompletionEntry(userId: string, entry: CompletionHistoryEntry): Promise<void>;
  
  getCompletionAnalytics(userId: string): Promise<CompletionAnalytics | null>;
  updateCompletionAnalytics(userId: string, analytics: Partial<CompletionAnalytics>): Promise<void>;
  resetCompletionAnalytics(userId: string): Promise<void>;
  
  // 🎯 PERSONALIZATION
  getPersonalizedInsights(
    userId: string, 
    profile: UserProfile
  ): Promise<PersonalizedInsights | null>;
  
  updateUserType(userId: string, userType: PersonalizedInsights['userType']): Promise<void>;
  
  // 📊 EXPORT & GDPR
  exportUserData(userId: string): Promise<CompletenessExportData>;
  deleteUserData(userId: string): Promise<void>;
  
  // 🔄 SYNC & CACHING
  syncCompletenessData(userId: string, deviceId: string): Promise<ProfileCompleteness | null>;
  clearCache(userId?: string): Promise<void>;
  
  // 🚀 ENTERPRISE: HEALTH & PERFORMANCE
  checkRepositoryHealth(): Promise<{
    isHealthy: boolean;
    cachePerformance: {
      hitRate: number;
      averageResponseTime: number;
      totalRequests: number;
    };
    storageMetrics: {
      totalUsers: number;
      averageDataSize: number;
      oldestEntry: number;
    };
    systemMetrics: {
      memoryUsage: number;
      cpuUsage: number;
      errorRate: number;
    };
  }>;
  
  getPerformanceMetrics(userId?: string): Promise<{
    calculationPerformance: {
      averageTime: number;
      slowCalculations: number;
      cacheEfficiency: number;
    };
    userMetrics?: {
      totalCalculations: number;
      averageCompletionRate: number;
      lastCalculationTime: number;
    };
  }>;
  
  // 🎯 A/B TESTING & EXPERIMENTATION
  getRecommendationVariant(userId: string): Promise<'control' | 'prioritized' | 'personalized'>;
  trackRecommendationEffectiveness(
    userId: string, 
    recommendationId: string, 
    action: 'viewed' | 'clicked' | 'completed' | 'ignored'
  ): Promise<void>;
}