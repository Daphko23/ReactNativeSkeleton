/**
 * @fileoverview Professional Data Sources Interface - Enterprise Clean Architecture 2025
 * 
 * 🎯 ENTERPRISE DATA SOURCE LAYER:
 * - Multi-Source Data Integration (Supabase, API, Cache)
 * - Professional Intelligence Data Management
 * - Real-time Data Synchronization
 * - Offline-First Architecture Support
 * 
 * 🔥 CLEAN ARCHITECTURE PATTERNS:
 * - Data Source Abstraction
 * - Repository Pattern Support
 * - Interface Segregation
 * - Dependency Injection Ready
 * 
 * 🚀 ENTERPRISE FEATURES:
 * - Multi-Provider Data Sources
 * - Batch Operations Support
 * - Real-time Updates
 * - Conflict Resolution
 * - Data Validation
 * 
 * @module ProfessionalDataSourceInterface
 * @since 3.0.0 (Enterprise Clean Architecture)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Data (Data Source Interface)
 * @architecture Clean Architecture + Multi-Source Pattern
 */

import { 
  ProfessionalProfile 
} from '../../domain/entities/professional-profile.entity';
import { 
  SkillsAnalysis,
  SkillsGapAnalysis,
  SkillsPortfolioAssessment 
} from '../../domain/entities/skills-analysis.entity';
import { 
  CareerProgression,
  CareerMilestone,
  CareerGoal 
} from '../../domain/entities/career-progression.entity';
import { 
  IndustryBenchmark,
  SalaryAnalysis,
  MarketTrend 
} from '../../domain/entities/industry-benchmark.entity';
import { 
  ProfessionalNetwork,
  Connection,
  NetworkAnalysis 
} from '../../domain/entities/professional-network.entity';

// =============================================================================
// RESULT TYPES & ERROR HANDLING
// =============================================================================

export type DataSourceResult<T> = {
  success: true;
  data: T;
  metadata?: {
    source: 'cache' | 'database' | 'api' | 'offline';
    timestamp: Date;
    version: string;
    conflict?: boolean;
  };
} | {
  success: false;
  error: string;
  code: string;
  retryable?: boolean;
};

export interface DataSourceMetrics {
  responseTime: number;
  dataSource: 'primary' | 'fallback' | 'cache';
  recordsReturned: number;
  cacheHit: boolean;
}

// =============================================================================
// QUERY INTERFACES
// =============================================================================

export interface DataSourceQuery {
  userId: string;
  filters?: Record<string, any>;
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    offset: number;
    limit: number;
  };
  includeMetadata?: boolean;
}

export interface BatchQuery<T> {
  queries: T[];
  options?: {
    parallel?: boolean;
    failFast?: boolean;
    maxConcurrency?: number;
  };
}

// =============================================================================
// PROFESSIONAL PROFILE DATA SOURCE
// =============================================================================

export interface IProfessionalProfileDataSource {
  /**
   * Get professional profile by user ID
   */
  getProfile(userId: string): Promise<DataSourceResult<ProfessionalProfile>>;
  
  /**
   * Update professional profile
   */
  updateProfile(
    userId: string, 
    data: Partial<ProfessionalProfile>
  ): Promise<DataSourceResult<ProfessionalProfile>>;
  
  /**
   * Create new professional profile
   */
  createProfile(
    userId: string,
    data: Omit<ProfessionalProfile, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DataSourceResult<ProfessionalProfile>>;
  
  /**
   * Delete professional profile
   */
  deleteProfile(userId: string): Promise<DataSourceResult<boolean>>;
  
  /**
   * Batch get profiles
   */
  batchGetProfiles(userIds: string[]): Promise<DataSourceResult<ProfessionalProfile[]>>;
  
  /**
   * Search profiles
   */
  searchProfiles(query: DataSourceQuery): Promise<DataSourceResult<ProfessionalProfile[]>>;
}

// =============================================================================
// SKILLS ANALYSIS DATA SOURCE
// =============================================================================

export interface ISkillsAnalysisDataSource {
  /**
   * Get skills analysis for user
   */
  getSkillsAnalysis(userId: string): Promise<DataSourceResult<SkillsAnalysis>>;
  
  /**
   * Update skills and trigger analysis
   */
  updateSkills(userId: string, skills: string[]): Promise<DataSourceResult<SkillsAnalysis>>;
  
  /**
   * Perform advanced skills analysis
   */
  analyzeSkills(
    userId: string,
    skills: string[],
    options?: {
      includeMarketData?: boolean;
      targetRole?: string;
      targetIndustry?: string;
    }
  ): Promise<DataSourceResult<SkillsAnalysis>>;
  
  /**
   * Get skills gap analysis
   */
  getSkillsGapAnalysis(
    userId: string,
    targetRole: string,
    targetIndustry: string
  ): Promise<DataSourceResult<SkillsGapAnalysis>>;
  
  /**
   * Get skills portfolio assessment
   */
  getSkillsPortfolio(userId: string): Promise<DataSourceResult<SkillsPortfolioAssessment>>;
  
  /**
   * Get market skills data
   */
  getMarketSkillsData(
    skills: string[],
    industry?: string,
    location?: string
  ): Promise<DataSourceResult<any>>;
}

// =============================================================================
// CAREER PROGRESSION DATA SOURCE
// =============================================================================

export interface ICareerProgressionDataSource {
  /**
   * Get career progression data
   */
  getCareerProgression(userId: string): Promise<DataSourceResult<CareerProgression>>;
  
  /**
   * Update career progression
   */
  updateCareerProgression(
    userId: string,
    data: Partial<CareerProgression>
  ): Promise<DataSourceResult<CareerProgression>>;
  
  /**
   * Add career milestone
   */
  addMilestone(
    userId: string,
    milestone: Omit<CareerMilestone, 'id' | 'createdAt'>
  ): Promise<DataSourceResult<CareerMilestone>>;
  
  /**
   * Update milestone
   */
  updateMilestone(
    userId: string,
    milestoneId: string,
    updates: Partial<CareerMilestone>
  ): Promise<DataSourceResult<CareerMilestone>>;
  
  /**
   * Delete milestone
   */
  deleteMilestone(userId: string, milestoneId: string): Promise<DataSourceResult<boolean>>;
  
  /**
   * Add career goal
   */
  addGoal(
    userId: string,
    goal: Omit<CareerGoal, 'id' | 'createdAt'>
  ): Promise<DataSourceResult<CareerGoal>>;
  
  /**
   * Update career goal
   */
  updateGoal(
    userId: string,
    goalId: string,
    updates: Partial<CareerGoal>
  ): Promise<DataSourceResult<CareerGoal>>;
  
  /**
   * Get career analytics
   */
  getCareerAnalytics(
    userId: string,
    timeframe: 'month' | 'quarter' | 'year'
  ): Promise<DataSourceResult<any>>;
}

// =============================================================================
// INDUSTRY BENCHMARK DATA SOURCE
// =============================================================================

export interface IIndustryBenchmarkDataSource {
  /**
   * Get industry benchmark data
   */
  getBenchmarkData(
    industry: string,
    role: string,
    experience: string,
    location: string
  ): Promise<DataSourceResult<IndustryBenchmark>>;
  
  /**
   * Get salary analysis
   */
  getSalaryAnalysis(
    industry: string,
    role: string,
    experience: string,
    location: string
  ): Promise<DataSourceResult<SalaryAnalysis>>;
  
  /**
   * Get market trends
   */
  getMarketTrends(
    industry: string,
    timeframe: 'month' | 'quarter' | 'year'
  ): Promise<DataSourceResult<MarketTrend[]>>;
  
  /**
   * Get competitive analysis
   */
  getCompetitiveAnalysis(
    userId: string,
    industry: string,
    role: string
  ): Promise<DataSourceResult<any>>;
  
  /**
   * Get industry insights
   */
  getIndustryInsights(industry: string): Promise<DataSourceResult<any>>;
  
  /**
   * Update benchmark data
   */
  updateBenchmarkData(
    userId: string,
    data: Partial<IndustryBenchmark>
  ): Promise<DataSourceResult<IndustryBenchmark>>;
}

// =============================================================================
// PROFESSIONAL NETWORK DATA SOURCE
// =============================================================================

export interface IProfessionalNetworkDataSource {
  /**
   * Get professional network
   */
  getNetwork(userId: string): Promise<DataSourceResult<ProfessionalNetwork>>;
  
  /**
   * Update network data
   */
  updateNetwork(
    userId: string,
    data: Partial<ProfessionalNetwork>
  ): Promise<DataSourceResult<ProfessionalNetwork>>;
  
  /**
   * Add connection
   */
  addConnection(
    userId: string,
    connection: Omit<Connection, 'id' | 'connectedAt'>
  ): Promise<DataSourceResult<Connection>>;
  
  /**
   * Update connection
   */
  updateConnection(
    userId: string,
    connectionId: string,
    updates: Partial<Connection>
  ): Promise<DataSourceResult<Connection>>;
  
  /**
   * Remove connection
   */
  removeConnection(userId: string, connectionId: string): Promise<DataSourceResult<boolean>>;
  
  /**
   * Get connections with filters
   */
  getConnections(
    userId: string,
    filters?: {
      types?: string[];
      strengths?: string[];
      industries?: string[];
      active?: boolean;
    }
  ): Promise<DataSourceResult<Connection[]>>;
  
  /**
   * Get network analysis
   */
  getNetworkAnalysis(userId: string): Promise<DataSourceResult<NetworkAnalysis>>;
  
  /**
   * Record interaction
   */
  recordInteraction(
    userId: string,
    connectionId: string,
    interaction: any
  ): Promise<DataSourceResult<any>>;
  
  /**
   * Get networking opportunities
   */
  getNetworkingOpportunities(userId: string): Promise<DataSourceResult<any[]>>;
}

// =============================================================================
// COMPOSITE DATA SOURCE
// =============================================================================

/**
 * Composite data source for professional intelligence
 * Combines all professional data sources
 */
export interface IProfessionalDataSource {
  readonly profile: IProfessionalProfileDataSource;
  readonly skills: ISkillsAnalysisDataSource;
  readonly career: ICareerProgressionDataSource;
  readonly benchmark: IIndustryBenchmarkDataSource;
  readonly network: IProfessionalNetworkDataSource;
  
  /**
   * Get comprehensive professional data
   */
  getComprehensiveData(userId: string): Promise<DataSourceResult<{
    profile: ProfessionalProfile;
    skills: SkillsAnalysis;
    career: CareerProgression;
    benchmark: IndustryBenchmark;
    network: ProfessionalNetwork;
  }>>;
  
  /**
   * Health check for all data sources
   */
  healthCheck(): Promise<{
    profile: boolean;
    skills: boolean;
    career: boolean;
    benchmark: boolean;
    network: boolean;
    overall: boolean;
  }>;
  
  /**
   * Get metrics for all data sources
   */
  getMetrics(): Promise<{
    profile: DataSourceMetrics;
    skills: DataSourceMetrics;
    career: DataSourceMetrics;
    benchmark: DataSourceMetrics;
    network: DataSourceMetrics;
  }>;
}

// =============================================================================
// DATA SOURCE FACTORY
// =============================================================================

export interface IProfessionalDataSourceFactory {
  /**
   * Create professional data source
   */
  createProfessionalDataSource(config: {
    provider: 'supabase' | 'firebase' | 'api';
    cacheEnabled?: boolean;
    offlineEnabled?: boolean;
    realTimeEnabled?: boolean;
  }): IProfessionalDataSource;
  
  /**
   * Create individual data sources
   */
  createProfileDataSource(): IProfessionalProfileDataSource;
  createSkillsDataSource(): ISkillsAnalysisDataSource;
  createCareerDataSource(): ICareerProgressionDataSource;
  createBenchmarkDataSource(): IIndustryBenchmarkDataSource;
  createNetworkDataSource(): IProfessionalNetworkDataSource;
}