/**
 * @fileoverview Refresh Health Entity - Enterprise Service Monitoring
 * 
 * ✅ ENTERPRISE HEALTH MONITORING ENTITY:
 * - Service Health & Status Tracking
 * - Performance Monitoring & Alerting
 * - Dependency Health Management
 * - SLA & Uptime Tracking
 * - Automated Health Checks
 * - Business Impact Assessment
 * 
 * @module RefreshHealthEntity
 * @since 3.0.0 (Enterprise Clean Architecture)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Domain (Entity)
 * @architecture Clean Architecture - Domain Layer
 */

// =============================================================================
// CORE HEALTH ENTITY
// =============================================================================

/**
 * RefreshHealthEntity - Comprehensive service health monitoring
 * 
 * Represents the complete health status of the profile refresh service
 * including performance metrics, dependency health, and business impact.
 */
export class RefreshHealthEntity {
  // Core Identification
  readonly healthId: string;
  readonly serviceId: string;
  readonly timestamp: number;
  readonly version: string;

  // Overall Health Status
  readonly overallStatus: ServiceHealthStatus;
  readonly healthScore: number; // 0-100
  readonly uptimePercentage: number; // 0-100
  readonly lastHealthCheck: number;

  // Core Service Metrics
  readonly performanceMetrics: ServicePerformanceMetrics;
  readonly availabilityMetrics: ServiceAvailabilityMetrics;
  readonly reliabilityMetrics: ServiceReliabilityMetrics;
  readonly capacityMetrics: ServiceCapacityMetrics;

  // Dependency Health
  readonly dependencyHealth: DependencyHealthMap;
  readonly criticalDependencies: CriticalDependencyStatus[];

  // Health Checks & Monitoring
  readonly healthChecks: HealthCheckResult[];
  readonly activeAlerts: ServiceAlert[];
  readonly recentIncidents: HealthIncident[];

  // Business Impact Assessment
  readonly businessImpact: BusinessHealthImpact;
  readonly slaCompliance: SLAComplianceMetrics;
  readonly userExperienceImpact: UserExperienceHealthMetrics;

  // Predictive Health Insights
  readonly healthTrends: HealthTrendAnalysis;
  readonly riskAssessment: HealthRiskAssessment;
  readonly recommendations: HealthRecommendation[];

  constructor(data: RefreshHealthEntityData) {
    this.healthId = data.healthId;
    this.serviceId = data.serviceId;
    this.timestamp = data.timestamp;
    this.version = data.version || '1.0.0';

    this.overallStatus = this.calculateOverallStatus(data);
    this.healthScore = this.calculateHealthScore(data);
    this.uptimePercentage = data.availabilityMetrics.uptimePercentage;
    this.lastHealthCheck = data.lastHealthCheck || Date.now();

    this.performanceMetrics = data.performanceMetrics;
    this.availabilityMetrics = data.availabilityMetrics;
    this.reliabilityMetrics = data.reliabilityMetrics;
    this.capacityMetrics = data.capacityMetrics;

    this.dependencyHealth = data.dependencyHealth;
    this.criticalDependencies = this.identifyCriticalDependencies(data.dependencyHealth);

    this.healthChecks = data.healthChecks;
    this.activeAlerts = data.activeAlerts || [];
    this.recentIncidents = data.recentIncidents || [];

    this.businessImpact = data.businessImpact;
    this.slaCompliance = data.slaCompliance;
    this.userExperienceImpact = data.userExperienceImpact;

    this.healthTrends = data.healthTrends;
    this.riskAssessment = this.assessHealthRisks(data);
    this.recommendations = this.generateHealthRecommendations(data);
  }

  // =============================================================================
  // BUSINESS LOGIC METHODS
  // =============================================================================

  /**
   * Calculate overall service health status
   */
  private calculateOverallStatus(data: RefreshHealthEntityData): ServiceHealthStatus {
    const criticalIssues = data.activeAlerts?.filter(alert => alert.severity === 'critical').length || 0;
    const highPriorityIssues = data.activeAlerts?.filter(alert => alert.severity === 'error').length || 0;
    
    if (criticalIssues > 0) return 'critical';
    if (data.availabilityMetrics.uptimePercentage < 95) return 'unhealthy';
    if (highPriorityIssues > 2 || data.performanceMetrics.averageResponseTime > 2000) return 'degraded';
    
    return 'healthy';
  }

  /**
   * Calculate composite health score (0-100)
   */
  private calculateHealthScore(data: RefreshHealthEntityData): number {
    const weights = {
      performance: 0.3,
      availability: 0.3,
      reliability: 0.2,
      capacity: 0.1,
      dependencies: 0.1
    };

    const performanceScore = this.calculatePerformanceScore(data.performanceMetrics);
    const availabilityScore = data.availabilityMetrics.uptimePercentage;
    const reliabilityScore = this.calculateReliabilityScore(data.reliabilityMetrics);
    const capacityScore = this.calculateCapacityScore(data.capacityMetrics);
    const dependencyScore = this.calculateDependencyScore(data.dependencyHealth);

    return Math.round(
      performanceScore * weights.performance +
      availabilityScore * weights.availability +
      reliabilityScore * weights.reliability +
      capacityScore * weights.capacity +
      dependencyScore * weights.dependencies
    );
  }

  /**
   * Identify critical dependencies that affect service health
   */
  private identifyCriticalDependencies(dependencyHealth: DependencyHealthMap): CriticalDependencyStatus[] {
    const critical: CriticalDependencyStatus[] = [];
    
    Object.entries(dependencyHealth).forEach(([name, health]) => {
      if (health.criticality === 'critical' || health.status === 'unavailable') {
        critical.push({
          dependencyName: name,
          status: health.status,
          impact: health.businessImpact,
          lastCheck: health.lastCheck,
          errorRate: health.errorRate,
          responseTime: health.responseTime
        });
      }
    });

    return critical;
  }

  /**
   * Assess health risks and potential issues
   */
  private assessHealthRisks(data: RefreshHealthEntityData): HealthRiskAssessment {
    const risks: HealthRisk[] = [];
    let overallRiskLevel: RiskLevel = 'low';

    // Performance risks
    if (data.performanceMetrics.averageResponseTime > 1500) {
      risks.push({
        type: 'performance',
        severity: 'medium',
        description: 'Response time above acceptable threshold',
        likelihood: 0.7,
        impact: 'medium',
        mitigation: 'Optimize caching and database queries'
      });
      overallRiskLevel = 'medium';
    }

    // Availability risks
    if (data.availabilityMetrics.uptimePercentage < 99) {
      risks.push({
        type: 'availability',
        severity: 'high',
        description: 'Uptime below enterprise SLA requirements',
        likelihood: 0.8,
        impact: 'business_critical',
        mitigation: 'Implement redundancy and failover mechanisms'
      });
      overallRiskLevel = 'high';
    }

    // Capacity risks
    if (data.capacityMetrics.currentUtilization > 0.8) {
      risks.push({
        type: 'capacity',
        severity: 'medium',
        description: 'High resource utilization may lead to performance degradation',
        likelihood: 0.6,
        impact: 'medium',
        mitigation: 'Scale resources or optimize resource usage'
      });
    }

    return {
      overallRiskLevel,
      risks,
      riskScore: this.calculateRiskScore(risks),
      assessmentTime: Date.now(),
      nextAssessment: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
  }

  /**
   * Generate actionable health recommendations
   */
  private generateHealthRecommendations(data: RefreshHealthEntityData): HealthRecommendation[] {
    const recommendations: HealthRecommendation[] = [];

    // Performance recommendations
    if (data.performanceMetrics.averageResponseTime > 1000) {
      recommendations.push({
        id: 'performance-opt-001',
        type: 'performance',
        priority: 'high',
        title: 'Optimize Response Time',
        description: 'Current response time exceeds optimal thresholds',
        actionItems: [
          'Implement advanced caching strategies',
          'Optimize database queries',
          'Enable response compression',
          'Consider CDN implementation'
        ],
        expectedImpact: 'Reduce response time by 30-50%',
        effort: 'medium',
        timeline: '2-3 weeks'
      });
    }

    // Reliability recommendations
    if (data.reliabilityMetrics.errorRate > 0.01) {
      recommendations.push({
        id: 'reliability-imp-001',
        type: 'reliability',
        priority: 'high',
        title: 'Reduce Error Rate',
        description: 'Error rate above acceptable threshold',
        actionItems: [
          'Implement comprehensive error handling',
          'Add retry mechanisms with exponential backoff',
          'Improve input validation',
          'Enhanced monitoring and alerting'
        ],
        expectedImpact: 'Reduce error rate by 50-70%',
        effort: 'medium',
        timeline: '1-2 weeks'
      });
    }

    // Capacity recommendations
    if (data.capacityMetrics.currentUtilization > 0.7) {
      recommendations.push({
        id: 'capacity-scale-001',
        type: 'capacity',
        priority: 'medium',
        title: 'Scale Infrastructure',
        description: 'Current utilization approaching capacity limits',
        actionItems: [
          'Implement auto-scaling policies',
          'Optimize resource allocation',
          'Add load balancing',
          'Monitor capacity trends'
        ],
        expectedImpact: 'Ensure consistent performance under load',
        effort: 'high',
        timeline: '3-4 weeks'
      });
    }

    return recommendations;
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private calculatePerformanceScore(metrics: ServicePerformanceMetrics): number {
    const responseTimeScore = Math.max(0, 100 - (metrics.averageResponseTime / 10));
    const throughputScore = Math.min(100, metrics.requestsPerSecond * 2);
    return Math.round((responseTimeScore + throughputScore) / 2);
  }

  private calculateReliabilityScore(metrics: ServiceReliabilityMetrics): number {
    const errorRateScore = Math.max(0, 100 - (metrics.errorRate * 10000));
    const uptimeScore = metrics.uptimePercentage;
    return Math.round((errorRateScore + uptimeScore) / 2);
  }

  private calculateCapacityScore(metrics: ServiceCapacityMetrics): number {
    const utilizationScore = Math.max(0, 100 - (metrics.currentUtilization * 100));
    const growthScore = Math.max(0, 100 - (metrics.growthRate * 50));
    return Math.round((utilizationScore + growthScore) / 2);
  }

  private calculateDependencyScore(dependencyHealth: DependencyHealthMap): number {
    const dependencies = Object.values(dependencyHealth);
    if (dependencies.length === 0) return 100;

    const healthyCount = dependencies.filter(dep => dep.status === 'available').length;
    return Math.round((healthyCount / dependencies.length) * 100);
  }

  private calculateRiskScore(risks: HealthRisk[]): number {
    if (risks.length === 0) return 0;

    const totalRisk = risks.reduce((sum, risk) => {
      const severityWeight = { low: 1, medium: 2, high: 3, critical: 4 };
      return sum + (severityWeight[risk.severity] * risk.likelihood);
    }, 0);

    return Math.min(100, Math.round(totalRisk * 10));
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  /**
   * Check if service is healthy enough for production traffic
   */
  isHealthyForProduction(): boolean {
    return this.overallStatus === 'healthy' && 
           this.healthScore >= 80 && 
           this.uptimePercentage >= 99;
  }

  /**
   * Check if immediate action is required
   */
  requiresImmediateAttention(): boolean {
    return this.overallStatus === 'critical' || 
           this.healthScore < 50 || 
           this.activeAlerts.some(alert => alert.severity === 'critical');
  }

  /**
   * Get prioritized action items
   */
  getPrioritizedActions(): string[] {
    const actions: string[] = [];

    // Critical alerts first
    this.activeAlerts
      .filter(alert => alert.severity === 'critical')
      .forEach(alert => actions.push(`CRITICAL: ${alert.message}`));

    // High-priority recommendations
    this.recommendations
      .filter(rec => rec.priority === 'high')
      .forEach(rec => actions.push(`HIGH: ${rec.title}`));

    // Dependency issues
    this.criticalDependencies
      .filter(dep => dep.status === 'unavailable')
      .forEach(dep => actions.push(`DEPENDENCY: ${dep.dependencyName} unavailable`));

    return actions;
  }

  /**
   * Generate health summary for dashboards
   */
  getHealthSummary(): HealthSummary {
    return {
      overallStatus: this.overallStatus,
      healthScore: this.healthScore,
      uptimePercentage: this.uptimePercentage,
      
      keyMetrics: {
        averageResponseTime: this.performanceMetrics.averageResponseTime,
        errorRate: this.reliabilityMetrics.errorRate,
        requestsPerSecond: this.performanceMetrics.requestsPerSecond,
        activeUsers: this.businessImpact.activeUsers
      },
      
      alerts: {
        critical: this.activeAlerts.filter(a => a.severity === 'critical').length,
        error: this.activeAlerts.filter(a => a.severity === 'error').length,
        warning: this.activeAlerts.filter(a => a.severity === 'warning').length
      },
      
      trends: {
        healthTrend: this.healthTrends.overallTrend,
        performanceTrend: this.healthTrends.performanceTrend,
        reliabilityTrend: this.healthTrends.reliabilityTrend
      },
      
      recommendations: this.recommendations.length,
      riskLevel: this.riskAssessment.overallRiskLevel,
      
      lastUpdated: this.timestamp
    };
  }

  /**
   * Export health data for external monitoring systems
   */
  exportForMonitoring(): MonitoringExport {
    return {
      serviceId: this.serviceId,
      timestamp: this.timestamp,
      status: this.overallStatus,
      metrics: {
        health_score: this.healthScore,
        uptime_percentage: this.uptimePercentage,
        response_time_avg: this.performanceMetrics.averageResponseTime,
        response_time_p95: this.performanceMetrics.p95ResponseTime,
        error_rate: this.reliabilityMetrics.errorRate,
        requests_per_second: this.performanceMetrics.requestsPerSecond,
        memory_usage: this.capacityMetrics.memoryUsage,
        cpu_usage: this.capacityMetrics.cpuUsage
      },
      alerts: this.activeAlerts.map(alert => ({
        severity: alert.severity,
        message: alert.message,
        timestamp: alert.timestamp
      })),
      dependencies: Object.entries(this.dependencyHealth).map(([name, health]) => ({
        name,
        status: health.status,
        response_time: health.responseTime,
        error_rate: health.errorRate
      }))
    };
  }
}

// =============================================================================
// SUPPORTING INTERFACES & TYPES
// =============================================================================

export interface RefreshHealthEntityData {
  healthId: string;
  serviceId: string;
  timestamp: number;
  version?: string;
  lastHealthCheck?: number;

  performanceMetrics: ServicePerformanceMetrics;
  availabilityMetrics: ServiceAvailabilityMetrics;
  reliabilityMetrics: ServiceReliabilityMetrics;
  capacityMetrics: ServiceCapacityMetrics;

  dependencyHealth: DependencyHealthMap;
  healthChecks: HealthCheckResult[];
  activeAlerts?: ServiceAlert[];
  recentIncidents?: HealthIncident[];

  businessImpact: BusinessHealthImpact;
  slaCompliance: SLAComplianceMetrics;
  userExperienceImpact: UserExperienceHealthMetrics;
  healthTrends: HealthTrendAnalysis;
}

export type ServiceHealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TrendDirection = 'improving' | 'stable' | 'declining';

export interface ServicePerformanceMetrics {
  averageResponseTime: number; // milliseconds
  medianResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  
  requestsPerSecond: number;
  successfulRequests: number;
  failedRequests: number;
  
  throughputTrend: TrendDirection;
  latencyTrend: TrendDirection;
}

export interface ServiceAvailabilityMetrics {
  uptimePercentage: number; // 0-100
  downtimeMinutes: number;
  plannedMaintenanceMinutes: number;
  unplannedDowntimeMinutes: number;
  
  mtbf: number; // Mean Time Between Failures (hours)
  mttr: number; // Mean Time To Recovery (minutes)
  
  availabilityTrend: TrendDirection;
  incidentFrequency: number; // incidents per week
}

export interface ServiceReliabilityMetrics {
  errorRate: number; // 0-1
  successRate: number; // 0-1
  timeoutRate: number; // 0-1
  
  uptimePercentage: number;
  consistencyScore: number; // 0-100
  
  errorTrend: TrendDirection;
  reliabilityTrend: TrendDirection;
}

export interface ServiceCapacityMetrics {
  currentUtilization: number; // 0-1
  peakUtilization: number; // 0-1
  averageUtilization: number; // 0-1
  
  memoryUsage: number; // bytes
  cpuUsage: number; // 0-1
  diskUsage: number; // bytes
  networkUsage: number; // bytes/second
  
  capacityTrend: TrendDirection;
  growthRate: number; // monthly growth rate
  projectedCapacityNeed: number; // months until capacity limit
}

export interface DependencyHealth {
  status: 'available' | 'degraded' | 'unavailable';
  responseTime: number; // milliseconds
  errorRate: number; // 0-1
  lastCheck: number; // timestamp
  criticality: 'low' | 'medium' | 'high' | 'critical';
  businessImpact: string;
}

export type DependencyHealthMap = Record<string, DependencyHealth>;

export interface CriticalDependencyStatus {
  dependencyName: string;
  status: 'available' | 'degraded' | 'unavailable';
  impact: string;
  lastCheck: number;
  errorRate: number;
  responseTime: number;
}

export interface HealthCheckResult {
  checkId: string;
  name: string;
  status: 'pass' | 'fail' | 'warn';
  responseTime: number;
  timestamp: number;
  details?: Record<string, any>;
  errorMessage?: string;
}

export interface ServiceAlert {
  alertId: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: number;
  resolvedAt?: number;
  source: string;
  tags: string[];
}

export interface HealthIncident {
  incidentId: string;
  title: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startTime: number;
  endTime?: number;
  duration?: number;
  impactedServices: string[];
  rootCause?: string;
  resolution?: string;
  postMortemUrl?: string;
}

export interface BusinessHealthImpact {
  activeUsers: number;
  affectedUsers: number;
  revenueImpact: number; // estimated impact in currency
  businessContinuity: number; // 0-100 score
  customerSatisfaction: number; // 0-100 score
  reputationImpact: 'none' | 'minor' | 'moderate' | 'significant' | 'severe';
}

export interface SLAComplianceMetrics {
  availabilitySLA: number; // target percentage
  performanceSLA: number; // target response time
  reliabilitySLA: number; // target error rate
  
  availabilityCompliance: number; // actual percentage
  performanceCompliance: number; // actual response time
  reliabilityCompliance: number; // actual error rate
  
  slaBreaches: number;
  complianceScore: number; // 0-100
  
  penaltiesIncurred: number;
  creditsOwed: number;
}

export interface UserExperienceHealthMetrics {
  userSatisfactionScore: number; // 0-100
  npsScore: number; // -100 to 100
  completionRate: number; // 0-1
  bounceRate: number; // 0-1
  averageSessionDuration: number; // milliseconds
  
  performancePerceptionScore: number; // 0-100
  reliabilityPerceptionScore: number; // 0-100
  
  supportTicketsRelated: number;
  userComplaintsRate: number; // complaints per 1000 users
}

export interface HealthTrendAnalysis {
  overallTrend: TrendDirection;
  performanceTrend: TrendDirection;
  availabilityTrend: TrendDirection;
  reliabilityTrend: TrendDirection;
  capacityTrend: TrendDirection;
  
  trendConfidence: number; // 0-100
  trendPeriod: number; // days of data used
  
  seasonalPatterns: SeasonalPattern[];
  anomalies: HealthAnomaly[];
  
  predictedHealth: {
    nextWeek: number; // predicted health score
    nextMonth: number;
    confidence: number;
  };
}

export interface SeasonalPattern {
  pattern: string;
  strength: number; // 0-1
  period: string; // daily, weekly, monthly
  impact: string;
}

export interface HealthAnomaly {
  timestamp: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  resolved: boolean;
}

export interface HealthRiskAssessment {
  overallRiskLevel: RiskLevel;
  risks: HealthRisk[];
  riskScore: number; // 0-100
  assessmentTime: number;
  nextAssessment: number;
}

export interface HealthRisk {
  type: 'performance' | 'availability' | 'reliability' | 'capacity' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  likelihood: number; // 0-1
  impact: 'low' | 'medium' | 'high' | 'user_experience' | 'business_critical';
  mitigation: string;
}

export interface HealthRecommendation {
  id: string;
  type: 'performance' | 'availability' | 'reliability' | 'capacity' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actionItems: string[];
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
}

export interface HealthSummary {
  overallStatus: ServiceHealthStatus;
  healthScore: number;
  uptimePercentage: number;
  
  keyMetrics: {
    averageResponseTime: number;
    errorRate: number;
    requestsPerSecond: number;
    activeUsers: number;
  };
  
  alerts: {
    critical: number;
    error: number;
    warning: number;
  };
  
  trends: {
    healthTrend: TrendDirection;
    performanceTrend: TrendDirection;
    reliabilityTrend: TrendDirection;
  };
  
  recommendations: number;
  riskLevel: RiskLevel;
  lastUpdated: number;
}

export interface MonitoringExport {
  serviceId: string;
  timestamp: number;
  status: ServiceHealthStatus;
  metrics: Record<string, number>;
  alerts: Array<{
    severity: string;
    message: string;
    timestamp: number;
  }>;
  dependencies: Array<{
    name: string;
    status: string;
    response_time: number;
    error_rate: number;
  }>;
}