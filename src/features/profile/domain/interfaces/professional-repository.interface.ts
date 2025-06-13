/**
 * @fileoverview Professional Repository Interface - Enterprise Clean Architecture 2025
 * 
 * 🎯 ENTERPRISE DATA LAYER INTERFACE:
 * - Professional Intelligence Repository Contracts
 * - Skills Analysis & Career Progression Data
 * - Industry Benchmarking & Network Management
 * - Cache Management & Performance Optimization
 * 
 * 🔥 CLEAN ARCHITECTURE PATTERNS:
 * - Repository Pattern with Domain Isolation
 * - Result Type Safety with Error Handling
 * - Async/Await with Promise-based Operations
 * - Interface Segregation Principle
 * 
 * 🚀 ENTERPRISE FEATURES:
 * - Multi-Entity Data Management
 * - Advanced Caching Strategies
 * - Performance Monitoring
 * - Transaction Support
 * - Batch Operations
 * 
 * @module ProfessionalRepositoryInterface
 * @since 3.0.0 (Enterprise Clean Architecture)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Domain (Repository Interface)
 * @architecture Clean Architecture + Repository Pattern
 */

import { 
  ProfessionalProfile 
} from '../entities/professional-profile.entity';
import { 
  SkillsAnalysis,
  SkillsGapAnalysis,
  SkillsPortfolioAssessment 
} from '../entities/skills-analysis.entity';
import { 
  CareerProgression,
  CareerMilestone,
  CareerGoal 
} from '../entities/career-progression.entity';
import { 
  IndustryBenchmark,
  SalaryAnalysis,
  MarketTrend 
} from '../entities/industry-benchmark.entity';
import { 
  ProfessionalNetwork,
  Connection,
  NetworkAnalysis 
} from '../entities/professional-network.entity';

// =============================================================================
// RESULT TYPES & ERROR HANDLING
// =============================================================================

export type Result<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  code: string;
};

export interface RepositoryError {
  code: string;
  message: string;
  field?: string;
  timestamp?: Date;
}

export interface RepositoryMetrics {
  operationTime: number;
  cacheHit: boolean;
  dataSource: 'cache' | 'database' | 'external';
  recordsAffected: number;
}

// =============================================================================
// QUERY & FILTER INTERFACES
// =============================================================================

export interface ProfessionalQuery {
  userId: string;
  includeSkills?: boolean;
  includeCareer?: boolean;
  includeBenchmarks?: boolean;
  includeNetwork?: boolean;
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
  
  // Advanced Filtering
  filters?: {
    skillCategories?: string[];
    industries?: string[];
    experienceLevels?: string[];
    locations?: string[];
  };
}

export interface SkillsQuery {
  userId: string;
  includeAnalysis?: boolean;
  includeGapAnalysis?: boolean;
  includePortfolio?: boolean;
  includeMarketData?: boolean;
  categories?: string[];
}

export interface CareerQuery {
  userId: string;
  includeGoals?: boolean;
  includeMilestones?: boolean;
  includeAnalytics?: boolean;
  timeframe?: 'month' | 'quarter' | 'year' | 'all';
}

export interface BenchmarkQuery {
  userId: string;
  industry?: string;
  role?: string;
  experience?: string;
  location?: string;
  includeComparison?: boolean;
  includeTrends?: boolean;
}

export interface NetworkQuery {
  userId: string;
  includeAnalysis?: boolean;
  includeMetrics?: boolean;
  connectionTypes?: string[];
  strengthLevels?: string[];
}

// =============================================================================
// BATCH OPERATION INTERFACES
// =============================================================================

export interface BatchOperation<T> {
  operation: 'create' | 'update' | 'delete';
  data: T[];
  options?: {
    skipValidation?: boolean;
    continueOnError?: boolean;
    transactional?: boolean;
  };
}

export interface BatchResult<T> {
  success: boolean;
  totalItems: number;
  successCount: number;
  failureCount: number;
  results: Array<{ success: boolean; data?: T; error?: string }>;
  errors: RepositoryError[];
  metrics: RepositoryMetrics;
}

// =============================================================================
// CACHE MANAGEMENT INTERFACES
// =============================================================================

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  invalidateRelated?: boolean;
  warmup?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  size: number;
  totalOperations: number;
  lastCleanup: Date;
}

// =============================================================================
// PROFESSIONAL REPOSITORY INTERFACE
// =============================================================================

/**
 * IProfessionalRepository - Enterprise Data Layer Interface
 * 
 * 🎯 CORE RESPONSIBILITIES:
 * - Professional profile data management
 * - Skills analysis & portfolio operations
 * - Career progression tracking
 * - Industry benchmarking data
 * - Professional network management
 * 
 * 🔥 ENTERPRISE FEATURES:
 * - Advanced caching with invalidation
 * - Batch operations for performance
 * - Transaction support
 * - Performance monitoring
 * - Error handling with codes
 */
export interface IProfessionalRepository {
  
  // =============================================================================
  // PROFESSIONAL PROFILE OPERATIONS
  // =============================================================================
  
  /**
   * Get professional profile with related data
   */
  getProfessionalProfile(
    query: ProfessionalQuery,
    options?: CacheOptions
  ): Promise<Result<ProfessionalProfile>>;
  
  /**
   * Update professional profile data
   */
  updateProfessionalProfile(
    userId: string,
    profile: Partial<ProfessionalProfile>,
    options?: { validateData?: boolean }
  ): Promise<Result<ProfessionalProfile>>;
  
  /**
   * Delete professional profile
   */
  deleteProfessionalProfile(
    userId: string,
    options?: { hardDelete?: boolean }
  ): Promise<Result<boolean>>;
  
  // =============================================================================
  // SKILLS ANALYSIS OPERATIONS
  // =============================================================================
  
  /**
   * Get skills analysis with market intelligence
   */
  getSkillsAnalysis(
    query: SkillsQuery,
    options?: CacheOptions
  ): Promise<Result<SkillsAnalysis>>;
  
  /**
   * Update skills data and trigger analysis
   */
  updateSkillsAnalysis(
    userId: string,
    skills: string[],
    options?: { 
      triggerAnalysis?: boolean;
      includeMarketData?: boolean;
    }
  ): Promise<Result<SkillsAnalysis>>;
  
  /**
   * Get skills gap analysis
   */
  getSkillsGapAnalysis(
    userId: string,
    targetRole?: string,
    targetIndustry?: string
  ): Promise<Result<SkillsGapAnalysis>>;
  
  /**
   * Get skills portfolio assessment
   */
  getSkillsPortfolio(
    userId: string,
    options?: CacheOptions
  ): Promise<Result<SkillsPortfolioAssessment>>;
  
  // =============================================================================
  // CAREER PROGRESSION OPERATIONS
  // =============================================================================
  
  /**
   * Get career progression data
   */
  getCareerProgression(
    query: CareerQuery,
    options?: CacheOptions
  ): Promise<Result<CareerProgression>>;
  
  /**
   * Update career progression
   */
  updateCareerProgression(
    userId: string,
    progression: Partial<CareerProgression>
  ): Promise<Result<CareerProgression>>;
  
  /**
   * Add career milestone
   */
  addCareerMilestone(
    userId: string,
    milestone: Omit<CareerMilestone, 'id' | 'createdAt'>
  ): Promise<Result<CareerMilestone>>;
  
  /**
   * Update career goal
   */
  updateCareerGoal(
    userId: string,
    goalId: string,
    updates: Partial<CareerGoal>
  ): Promise<Result<CareerGoal>>;
  
  /**
   * Get career analytics
   */
  getCareerAnalytics(
    userId: string,
    timeframe: 'month' | 'quarter' | 'year'
  ): Promise<Result<any>>; // TODO: Define CareerAnalytics interface
  
  // =============================================================================
  // INDUSTRY BENCHMARK OPERATIONS
  // =============================================================================
  
  /**
   * Get industry benchmark data
   */
  getIndustryBenchmark(
    query: BenchmarkQuery,
    options?: CacheOptions
  ): Promise<Result<IndustryBenchmark>>;
  
  /**
   * Update benchmark data
   */
  updateBenchmarkData(
    userId: string,
    benchmarkData: Partial<IndustryBenchmark>
  ): Promise<Result<IndustryBenchmark>>;
  
  /**
   * Get salary analysis
   */
  getSalaryAnalysis(
    userId: string,
    industry: string,
    role: string,
    experience: string,
    location: string
  ): Promise<Result<SalaryAnalysis>>;
  
  /**
   * Get market trends
   */
  getMarketTrends(
    industry: string,
    timeframe: 'month' | 'quarter' | 'year'
  ): Promise<Result<MarketTrend[]>>;
  
  // =============================================================================
  // PROFESSIONAL NETWORK OPERATIONS
  // =============================================================================
  
  /**
   * Get professional network
   */
  getProfessionalNetwork(
    query: NetworkQuery,
    options?: CacheOptions
  ): Promise<Result<ProfessionalNetwork>>;
  
  /**
   * Update network data
   */
  updateProfessionalNetwork(
    userId: string,
    network: Partial<ProfessionalNetwork>
  ): Promise<Result<ProfessionalNetwork>>;
  
  /**
   * Add connection
   */
  addConnection(
    userId: string,
    connection: Omit<Connection, 'id' | 'connectedAt'>
  ): Promise<Result<Connection>>;
  
  /**
   * Update connection
   */
  updateConnection(
    userId: string,
    connectionId: string,
    updates: Partial<Connection>
  ): Promise<Result<Connection>>;
  
  /**
   * Remove connection
   */
  removeConnection(
    userId: string,
    connectionId: string
  ): Promise<Result<boolean>>;
  
  /**
   * Get network analysis
   */
  getNetworkAnalysis(
    userId: string,
    options?: { includeInsights?: boolean }
  ): Promise<Result<NetworkAnalysis>>;
  
  // =============================================================================
  // BATCH OPERATIONS
  // =============================================================================
  
  /**
   * Batch update skills
   */
  batchUpdateSkills(
    operations: BatchOperation<{ userId: string; skills: string[] }>
  ): Promise<BatchResult<SkillsAnalysis>>;
  
  /**
   * Batch update connections
   */
  batchUpdateConnections(
    operations: BatchOperation<{ userId: string; connection: Connection }>
  ): Promise<BatchResult<Connection>>;
  
  /**
   * Batch update milestones
   */
  batchUpdateMilestones(
    operations: BatchOperation<{ userId: string; milestone: CareerMilestone }>
  ): Promise<BatchResult<CareerMilestone>>;
  
  // =============================================================================
  // CACHE MANAGEMENT
  // =============================================================================
  
  /**
   * Clear cache for user
   */
  clearUserCache(
    userId: string,
    options?: { 
      patterns?: string[];
      preserveRecent?: boolean;
    }
  ): Promise<Result<boolean>>;
  
  /**
   * Warm up cache for user
   */
  warmUpCache(
    userId: string,
    options?: {
      includeSkills?: boolean;
      includeCareer?: boolean;
      includeBenchmarks?: boolean;
      includeNetwork?: boolean;
    }
  ): Promise<Result<boolean>>;
  
  /**
   * Get cache metrics
   */
  getCacheMetrics(
    userId?: string
  ): Promise<Result<CacheMetrics>>;
  
  /**
   * Invalidate related caches
   */
  invalidateRelatedCaches(
    userId: string,
    entityType: 'profile' | 'skills' | 'career' | 'benchmark' | 'network'
  ): Promise<Result<boolean>>;
  
  // =============================================================================
  // PERFORMANCE & MONITORING
  // =============================================================================
  
  /**
   * Get repository health metrics
   */
  getHealthMetrics(): Promise<Result<{
    responseTime: number;
    errorRate: number;
    cachePerformance: CacheMetrics;
    activeConnections: number;
    lastOptimization: Date;
  }>>;
  
  /**
   * Optimize repository performance
   */
  optimizePerformance(
    options?: {
      cleanupCache?: boolean;
      optimizeQueries?: boolean;
      rebuildIndexes?: boolean;
    }
  ): Promise<Result<boolean>>;
  
  /**
   * Get operation metrics
   */
  getOperationMetrics(
    timeframe: 'hour' | 'day' | 'week'
  ): Promise<Result<{
    totalOperations: number;
    averageResponseTime: number;
    errorRate: number;
    cacheHitRate: number;
    topOperations: Array<{ operation: string; count: number; avgTime: number }>;
  }>>;
}

// =============================================================================
// REPOSITORY FACTORY INTERFACE
// =============================================================================

/**
 * Factory for creating professional repository instances
 */
export interface IProfessionalRepositoryFactory {
  createProfessionalRepository(
    config?: {
      cacheEnabled?: boolean;
      cacheTTL?: number;
      metricsEnabled?: boolean;
      optimizationLevel?: 'basic' | 'standard' | 'aggressive';
    }
  ): IProfessionalRepository;
}