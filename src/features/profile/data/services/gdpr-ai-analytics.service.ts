/**
 * GDPR AI Analytics Service - Enterprise Compliance Intelligence
 * KI-basierte Auswertung von GDPR Audit Logs für automatische Compliance-Überwachung
 * 
 * ✅ Features:
 * - Automatische Anomalieerkennung
 * - Compliance Risk Scoring
 * - Predictive Analysis für GDPR-Verstöße
 * - Intelligente Reporting
 * - Real-time Monitoring Alerts
 */

import { 
  GDPRAuditEvent, 
  GDPRAuditEventType,
  DataCategory,
  ConsentRecord,
  gdprAuditService 
} from './gdpr-audit.service';

// =============================================
// AI ANALYTICS INTERFACES
// =============================================

export interface GDPRRiskAssessment {
  overallRiskScore: number; // 0-100 (100 = highest risk)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  categories: {
    dataMinimization: number;
    consentCompliance: number;
    retentionPolicy: number;
    accessControl: number;
    dataPortability: number;
  };
  recommendations: ComplianceRecommendation[];
  alerts: ComplianceAlert[];
}

export interface ComplianceRecommendation {
  id: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  title: string;
  description: string;
  actionRequired: string;
  estimatedImpact: number; // 0-100
  timeToImplement: string;
  complianceFramework: string[];
}

export interface ComplianceAlert {
  id: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  type: 'ANOMALY' | 'POLICY_VIOLATION' | 'CONSENT_ISSUE' | 'DATA_BREACH_RISK';
  title: string;
  description: string;
  affectedUsers: string[];
  detectedAt: Date;
  requiresImmediateAction: boolean;
  gdprArticle?: string;
}

export interface ComplianceMetrics {
  totalUsers: number;
  totalEvents: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  consentMetrics: {
    validConsents: number;
    expiredConsents: number;
    withdrawnConsents: number;
    missingConsents: number;
  };
  dataProcessingMetrics: {
    accessEvents: number;
    updateEvents: number;
    deleteEvents: number;
    exportEvents: number;
  };
  complianceScore: number; // 0-100
}

export interface AnomalyDetection {
  userId: string;
  anomalyType: 'UNUSUAL_ACCESS_PATTERN' | 'BULK_DATA_EXPORT' | 'SUSPICIOUS_DELETION' | 'CONSENT_ANOMALY';
  confidence: number; // 0-100
  description: string;
  events: GDPRAuditEvent[];
  riskScore: number;
  detectedAt: Date;
}

// =============================================
// GDPR AI ANALYTICS SERVICE
// =============================================

export class GDPRAIAnalyticsService {
  private readonly RISK_THRESHOLDS = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 90
  };

  private readonly ANOMALY_PATTERNS = {
    BULK_ACCESS_THRESHOLD: 50, // Events per hour
    UNUSUAL_TIME_WINDOW: 2, // Hours outside normal business hours
    RAPID_DELETION_THRESHOLD: 10, // Deletions per minute
    CONSENT_WITHDRAWAL_SPIKE: 5 // Withdrawals per day
  };

  // =============================================
  // MAIN ANALYTICS METHODS
  // =============================================

  /**
   * 🤖 KI-basierte GDPR Risikobewertung
   */
  async analyzeGDPRCompliance(
    userId?: string,
    timeframe: 'LAST_24H' | 'LAST_7D' | 'LAST_30D' | 'LAST_90D' = 'LAST_30D'
  ): Promise<GDPRRiskAssessment> {
    const { startDate, endDate } = this.getTimeframeRange(timeframe);
    
    // Load audit events and consent records
    const events = await gdprAuditService.loadAuditEventsFromDatabase(userId, startDate, endDate);
    const consents = await gdprAuditService.loadConsentRecordsFromDatabase(userId);

    // AI Analysis
    const riskCategories = {
      dataMinimization: await this.analyzeDataMinimization(events),
      consentCompliance: await this.analyzeConsentCompliance(events, consents),
      retentionPolicy: await this.analyzeRetentionCompliance(events),
      accessControl: await this.analyzeAccessControl(events),
      dataPortability: await this.analyzeDataPortability(events)
    };

    // Calculate overall risk score using weighted average
    const overallRiskScore = this.calculateWeightedRiskScore(riskCategories);
    const riskLevel = this.getRiskLevel(overallRiskScore);

    // Generate recommendations and alerts
    const recommendations = await this.generateIntelligentRecommendations(events, consents, riskCategories);
    const alerts = await this.detectComplianceAlerts(events, consents);

    return {
      overallRiskScore,
      riskLevel,
      categories: riskCategories,
      recommendations,
      alerts
    };
  }

  /**
   * 🔍 Anomalieerkennung mit Machine Learning Patterns
   */
  async detectAnomalies(
    userId?: string,
    timeframe: 'LAST_24H' | 'LAST_7D' = 'LAST_24H'
  ): Promise<AnomalyDetection[]> {
    const { startDate, endDate } = this.getTimeframeRange(timeframe);
    const events = await gdprAuditService.loadAuditEventsFromDatabase(userId, startDate, endDate);
    
    const anomalies: AnomalyDetection[] = [];

    // Pattern 1: Unusual Access Patterns
    const accessAnomalies = await this.detectUnusualAccessPatterns(events);
    anomalies.push(...accessAnomalies);

    // Pattern 2: Bulk Data Export Detection
    const exportAnomalies = await this.detectBulkDataExports(events);
    anomalies.push(...exportAnomalies);

    // Pattern 3: Suspicious Deletion Patterns
    const deletionAnomalies = await this.detectSuspiciousDeletions(events);
    anomalies.push(...deletionAnomalies);

    // Pattern 4: Consent Anomalies
    const consentAnomalies = await this.detectConsentAnomalies(events);
    anomalies.push(...consentAnomalies);

    return anomalies.sort((a, b) => b.riskScore - a.riskScore);
  }

  /**
   * 📊 Comprehensive Compliance Metrics Dashboard
   */
  async generateComplianceMetrics(
    timeframe: 'LAST_7D' | 'LAST_30D' | 'LAST_90D' = 'LAST_30D'
  ): Promise<ComplianceMetrics> {
    const { startDate, endDate } = this.getTimeframeRange(timeframe);
    
    const events = await gdprAuditService.loadAuditEventsFromDatabase(undefined, startDate, endDate);
    const consents = await gdprAuditService.loadConsentRecordsFromDatabase();

    const uniqueUsers = new Set(events.map(e => e.dataSubjectId)).size;
    
    // Risk Distribution Analysis
    const userRisks = await Promise.all(
      Array.from(new Set(events.map(e => e.dataSubjectId))).map(async userId => {
        const userEvents = events.filter(e => e.dataSubjectId === userId);
        const userConsents = consents.filter(c => c.userId === userId);
        return this.calculateUserRiskScore(userEvents, userConsents);
      })
    );

    const riskDistribution = {
      low: userRisks.filter(r => r <= this.RISK_THRESHOLDS.LOW).length,
      medium: userRisks.filter(r => r > this.RISK_THRESHOLDS.LOW && r <= this.RISK_THRESHOLDS.MEDIUM).length,
      high: userRisks.filter(r => r > this.RISK_THRESHOLDS.MEDIUM && r <= this.RISK_THRESHOLDS.HIGH).length,
      critical: userRisks.filter(r => r > this.RISK_THRESHOLDS.HIGH).length
    };

    // Consent Analysis
    const activeConsents = consents.filter(c => !c.withdrawnAt);
    const withdrawnConsents = consents.filter(c => c.withdrawnAt);
    const expiredConsents = activeConsents.filter(c => 
      this.isConsentExpired(c.givenAt, 365) // 1 year expiry
    );

    const consentMetrics = {
      validConsents: activeConsents.length - expiredConsents.length,
      expiredConsents: expiredConsents.length,
      withdrawnConsents: withdrawnConsents.length,
      missingConsents: Math.max(0, uniqueUsers - activeConsents.length)
    };

    // Data Processing Metrics  
    const dataProcessingMetrics = {
      accessEvents: events.filter(e => e.eventType === 'data_access_request').length,
      updateEvents: events.filter(e => e.eventType === 'data_processing').length,
      deleteEvents: events.filter(e => e.eventType === 'data_deletion').length,
      exportEvents: events.filter(e => e.eventType === GDPRAuditEventType.DATA_PORTABILITY_REQUEST).length
    };

    // Overall Compliance Score (AI-calculated)
    const complianceScore = await this.calculateOverallComplianceScore(
      events, consents, riskDistribution, consentMetrics
    );

    return {
      totalUsers: uniqueUsers,
      totalEvents: events.length,
      riskDistribution,
      consentMetrics,
      dataProcessingMetrics,
      complianceScore
    };
  }

  /**
   * 🚨 Real-time Alert Generation
   */
  async generateRealTimeAlerts(): Promise<ComplianceAlert[]> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentEvents = await gdprAuditService.loadAuditEventsFromDatabase(
      undefined, last24Hours, now
    );

    const alerts: ComplianceAlert[] = [];

    // Critical Alert: Bulk Data Access
    const bulkAccess = this.detectBulkDataAccess(recentEvents);
    if (bulkAccess.length > 0) {
      alerts.push({
        id: `bulk_access_${Date.now()}`,
        severity: 'CRITICAL',
        type: 'ANOMALY',
        title: 'Bulk Data Access Detected',
        description: `Unusual pattern of data access detected for ${bulkAccess.length} user(s)`,
        affectedUsers: bulkAccess,
        detectedAt: now,
        requiresImmediateAction: true,
        gdprArticle: 'Article 32 - Security of processing'
      });
    }

    // Warning: Missing Consent for Data Processing
    const missingConsents = await this.detectMissingConsents(recentEvents);
    if (missingConsents.length > 0) {
      alerts.push({
        id: `missing_consent_${Date.now()}`,
        severity: 'WARNING',
        type: 'CONSENT_ISSUE',
        title: 'Missing Consent for Data Processing',
        description: `Data processing without valid consent detected for ${missingConsents.length} user(s)`,
        affectedUsers: missingConsents,
        detectedAt: now,
        requiresImmediateAction: false,
        gdprArticle: 'Article 6 - Lawfulness of processing'
      });
    }

    return alerts;
  }

  // =============================================
  // PRIVATE AI ANALYSIS METHODS
  // =============================================

  private async analyzeDataMinimization(events: GDPRAuditEvent[]): Promise<number> {
    // Check if only necessary data is being accessed/processed
    const accessEvents = events.filter(e => e.eventType === GDPRAuditEventType.DATA_ACCESS_REQUEST);
    
    let score = 100; // Start with perfect score
    
    if (accessEvents.length === 0) return score;
    
    // Penalty for accessing sensitive data categories frequently
    const sensitiveAccess = accessEvents.filter(e => 
      e.dataCategories?.includes(DataCategory.BIOMETRIC) ||
      e.dataCategories?.includes(DataCategory.SPECIAL_CATEGORY)
    ).length;
    
    if (sensitiveAccess > accessEvents.length * 0.3) score -= 25;
    
    // Penalty for too many access requests
    if (accessEvents.length > events.length * 0.7) score -= 20;
    
    return Math.max(0, score);
  }

  private async analyzeConsentCompliance(
    events: GDPRAuditEvent[], 
    consents: ConsentRecord[]
  ): Promise<number> {
    let score = 100;
    
    const processingEvents = events.filter(e => 
      e.eventType === GDPRAuditEventType.DATA_PROCESSING || 
      e.eventType === GDPRAuditEventType.DATA_ACCESS_REQUEST
    );

    const uniqueUsers = new Set(processingEvents.map(e => e.dataSubjectId));
    
    uniqueUsers.forEach(userId => {
      const userConsents = consents.filter(c => c.userId === userId && !c.withdrawnAt);
      const userProcessingEvents = processingEvents.filter(e => e.dataSubjectId === userId);
      
      // Check if processing events have valid consent
      if (userProcessingEvents.length > 0 && userConsents.length === 0) {
        score -= 20; // Major penalty for processing without consent
      }
      
      // Check for expired consents
      const expiredConsents = userConsents.filter(c => 
        this.isConsentExpired(c.givenAt, 365)
      );
      
      if (expiredConsents.length > 0) {
        score -= 10; // Minor penalty for expired consent
      }
    });
    
    return Math.max(0, score);
  }

  private async analyzeRetentionCompliance(events: GDPRAuditEvent[]): Promise<number> {
    let score = 100;
    
    // Check for old events that should have been deleted
    const oldEvents = events.filter(e => {
      const daysSinceEvent = (Date.now() - e.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceEvent > 730; // 2 years retention policy
    });
    
    if (oldEvents.length > 0) {
      score -= Math.min(50, oldEvents.length * 5); // Penalty for old data
    }
    
    // Check for deletion events (positive indicator)
    const deletionEvents = events.filter(e => e.eventType === GDPRAuditEventType.DATA_DELETION);
    const deletionRatio = deletionEvents.length / events.length;
    
    if (deletionRatio < 0.1) score -= 15; // Low deletion rate
    
    return Math.max(0, score);
  }

  private async analyzeAccessControl(events: GDPRAuditEvent[]): Promise<number> {
    let score = 100;
    
    // Check for unauthorized access events
    const unauthorizedAccess = events.filter(e => e.eventType === GDPRAuditEventType.UNAUTHORIZED_ACCESS);
    if (unauthorizedAccess.length > events.length * 0.05) {
      score -= 20; // Too many unauthorized attempts
    }
    
    // Check for access outside business hours
    const offHoursAccess = events.filter(e => {
      const hour = e.timestamp.getHours();
      return hour < 6 || hour > 22; // Outside 6 AM - 10 PM
    });
    
    if (offHoursAccess.length > events.length * 0.2) {
      score -= 15; // Too much off-hours access
    }
    
    return Math.max(0, score);
  }

  private async analyzeDataPortability(events: GDPRAuditEvent[]): Promise<number> {
    let score = 100;
    
    const exportEvents = events.filter(e => e.eventType === GDPRAuditEventType.DATA_PORTABILITY_REQUEST);
    const updateEvents = events.filter(e => e.eventType === GDPRAuditEventType.DATA_PROCESSING);
    
    // Good portability if exports are available and happening
    if (exportEvents.length === 0 && updateEvents.length > 10) {
      score -= 25; // No exports despite active data processing
    }
    
    // Score based on export activity (higher is better for portability)
    if (exportEvents.length === 0 && events.length > 10) {
      score -= 30; // No data portability despite significant activity
    } else if (exportEvents.length > 0) {
      score += 10; // Bonus for providing data portability
    }
    
    return Math.max(0, score);
  }

  private calculateWeightedRiskScore(categories: any): number {
    const weights = {
      consentCompliance: 0.3,     // 30% - most important
      dataMinimization: 0.25,     // 25%
      accessControl: 0.2,         // 20%
      retentionPolicy: 0.15,      // 15%
      dataPortability: 0.1        // 10%
    };
    
    return Object.entries(weights).reduce((score, [key, weight]) => {
      return score + (100 - categories[key]) * weight; // Convert to risk score
    }, 0);
  }

  private getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score <= this.RISK_THRESHOLDS.LOW) return 'LOW';
    if (score <= this.RISK_THRESHOLDS.MEDIUM) return 'MEDIUM';
    if (score <= this.RISK_THRESHOLDS.HIGH) return 'HIGH';
    return 'CRITICAL';
  }

  private async generateIntelligentRecommendations(
    events: GDPRAuditEvent[],
    consents: ConsentRecord[],
    riskCategories: any
  ): Promise<ComplianceRecommendation[]> {
    const recommendations: ComplianceRecommendation[] = [];
    
    // Consent-based recommendations
    if (riskCategories.consentCompliance < 80) {
      recommendations.push({
        id: `consent_${Date.now()}`,
        priority: 'HIGH',
        category: 'Consent Management',
        title: 'Improve Consent Compliance',
        description: 'Several data processing activities lack proper consent documentation',
        actionRequired: 'Review and obtain missing consents, update consent management system',
        estimatedImpact: 85,
        timeToImplement: '2-3 weeks',
        complianceFramework: ['GDPR Article 6', 'GDPR Article 7']
      });
    }
    
    // Data minimization recommendations
    if (riskCategories.dataMinimization < 70) {
      recommendations.push({
        id: `minimization_${Date.now()}`,
        priority: 'MEDIUM',
        category: 'Data Minimization',
        title: 'Reduce Data Processing Scope',
        description: 'System is accessing more data fields than necessary',
        actionRequired: 'Implement field-level access controls and data minimization policies',
        estimatedImpact: 70,
        timeToImplement: '1-2 weeks',
        complianceFramework: ['GDPR Article 5(1)(c)']
      });
    }
    
    return recommendations.sort((a, b) => b.estimatedImpact - a.estimatedImpact);
  }

  private async detectComplianceAlerts(
    events: GDPRAuditEvent[],
    consents: ConsentRecord[]
  ): Promise<ComplianceAlert[]> {
    const alerts: ComplianceAlert[] = [];
    
    // Check for recent consent withdrawals without data deletion
    const recentWithdrawals = consents.filter(c => 
      c.withdrawnAt && 
      (Date.now() - c.withdrawnAt.getTime()) < 72 * 60 * 60 * 1000 // 72 hours
    );
    
    for (const withdrawal of recentWithdrawals) {
      const postWithdrawalEvents = events.filter(e => 
        e.dataSubjectId === withdrawal.userId && 
        e.timestamp > withdrawal.withdrawnAt!
      );
      
      if (postWithdrawalEvents.length > 0) {
        alerts.push({
          id: `post_withdrawal_${withdrawal.id}`,
          severity: 'ERROR',
          type: 'CONSENT_ISSUE',
          title: 'Data Processing After Consent Withdrawal',
          description: `Continued data processing detected after consent withdrawal`,
          affectedUsers: [withdrawal.userId],
          detectedAt: new Date(),
          requiresImmediateAction: true,
          gdprArticle: 'Article 7(3) - Withdrawal of consent'
        });
      }
    }
    
    return alerts;
  }

  // Additional helper methods...
  private async detectUnusualAccessPatterns(events: GDPRAuditEvent[]): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = [];
    
    // Group events by user and hour
    const userHourlyAccess = new Map<string, Map<number, GDPRAuditEvent[]>>();
    
    events.filter(e => e.eventType === GDPRAuditEventType.DATA_ACCESS_REQUEST).forEach(event => {
      const hour = event.timestamp.getHours();
      if (!userHourlyAccess.has(event.dataSubjectId)) {
        userHourlyAccess.set(event.dataSubjectId, new Map());
      }
      if (!userHourlyAccess.get(event.dataSubjectId)!.has(hour)) {
        userHourlyAccess.get(event.dataSubjectId)!.set(hour, []);
      }
      userHourlyAccess.get(event.dataSubjectId)!.get(hour)!.push(event);
    });
    
    // Detect unusual patterns
    userHourlyAccess.forEach((hourlyData, userId) => {
      hourlyData.forEach((hourEvents, hour) => {
        if (hourEvents.length > this.ANOMALY_PATTERNS.BULK_ACCESS_THRESHOLD) {
          anomalies.push({
            userId,
            anomalyType: 'UNUSUAL_ACCESS_PATTERN',
            confidence: Math.min(100, (hourEvents.length / this.ANOMALY_PATTERNS.BULK_ACCESS_THRESHOLD) * 80),
            description: `Unusual high-frequency data access: ${hourEvents.length} events in hour ${hour}`,
            events: hourEvents,
            riskScore: Math.min(100, hourEvents.length * 2),
            detectedAt: new Date()
          });
        }
      });
    });
    
    return anomalies;
  }

  private async detectBulkDataExports(events: GDPRAuditEvent[]): Promise<AnomalyDetection[]> {
    const exportEvents = events.filter(e => e.eventType === GDPRAuditEventType.DATA_PORTABILITY_REQUEST);
    const anomalies: AnomalyDetection[] = [];
    
    // Group by user
    const userExports = new Map<string, GDPRAuditEvent[]>();
    exportEvents.forEach(event => {
      if (!userExports.has(event.dataSubjectId)) {
        userExports.set(event.dataSubjectId, []);
      }
      userExports.get(event.dataSubjectId)!.push(event);
    });
    
    userExports.forEach((userEvents, userId) => {
      // Simplified scoring based on number of exports instead of size
      const exportCount = userEvents.length;
      
      // Large export anomaly based on frequency
      if (exportCount > 5) { // More than 5 exports
        anomalies.push({
          userId,
          anomalyType: 'BULK_DATA_EXPORT',
          confidence: 85,
          description: `Multiple data exports detected: ${exportCount} export requests`,
          events: userEvents,
          riskScore: Math.min(100, exportCount * 15),
          detectedAt: new Date()
        });
      }
    });
    
    return anomalies;
  }

  private async detectSuspiciousDeletions(events: GDPRAuditEvent[]): Promise<AnomalyDetection[]> {
    const deletionEvents = events.filter(e => e.eventType === GDPRAuditEventType.DATA_DELETION);
    const anomalies: AnomalyDetection[] = [];
    
    // Check for rapid deletions (time-based clustering)
    const sortedDeletions = deletionEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    for (let i = 0; i < sortedDeletions.length - this.ANOMALY_PATTERNS.RAPID_DELETION_THRESHOLD; i++) {
      const window = sortedDeletions.slice(i, i + this.ANOMALY_PATTERNS.RAPID_DELETION_THRESHOLD);
      const timeSpan = window[window.length - 1].timestamp.getTime() - window[0].timestamp.getTime();
      
      if (timeSpan < 60 * 1000) { // Less than 1 minute
        anomalies.push({
          userId: window[0].dataSubjectId,
          anomalyType: 'SUSPICIOUS_DELETION',
          confidence: 90,
          description: `Rapid deletion pattern: ${window.length} deletions in ${timeSpan / 1000} seconds`,
          events: window,
          riskScore: 85,
          detectedAt: new Date()
        });
      }
    }
    
    return anomalies;
  }

  private async detectConsentAnomalies(events: GDPRAuditEvent[]): Promise<AnomalyDetection[]> {
    const consentEvents = events.filter(e => 
      e.eventType === GDPRAuditEventType.CONSENT_GIVEN || 
      e.eventType === GDPRAuditEventType.CONSENT_WITHDRAWN
    );
    
    const anomalies: AnomalyDetection[] = [];
    
    // Group by day to detect spikes
    const dailyWithdrawals = new Map<string, GDPRAuditEvent[]>();
    
    consentEvents.filter(e => e.eventType === GDPRAuditEventType.CONSENT_WITHDRAWN).forEach(event => {
      const day = event.timestamp.toISOString().split('T')[0];
      if (!dailyWithdrawals.has(day)) {
        dailyWithdrawals.set(day, []);
      }
      dailyWithdrawals.get(day)!.push(event);
    });
    
    // Check for withdrawal spikes
    dailyWithdrawals.forEach((dayEvents, day) => {
      if (dayEvents.length > this.ANOMALY_PATTERNS.CONSENT_WITHDRAWAL_SPIKE) {
        anomalies.push({
          userId: 'multiple',
          anomalyType: 'CONSENT_ANOMALY',
          confidence: 85,
          description: `Consent withdrawal spike: ${dayEvents.length} withdrawals on ${day}`,
          events: dayEvents,
          riskScore: dayEvents.length * 15,
          detectedAt: new Date()
        });
      }
    });
    
    return anomalies;
  }

  private getTimeframeRange(timeframe: string): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case 'LAST_24H':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case 'LAST_7D':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'LAST_30D':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'LAST_90D':
        startDate.setDate(startDate.getDate() - 90);
        break;
    }
    
    return { startDate, endDate };
  }

  private calculateUserRiskScore(events: GDPRAuditEvent[], consents: ConsentRecord[]): number {
    // Simplified user risk calculation
    let riskScore = 0;
    
    // Risk factors
    const hasValidConsent = consents.some(c => !c.withdrawnAt && !this.isConsentExpired(c.givenAt, 365));
    if (!hasValidConsent && events.length > 0) riskScore += 30;
    
    const sensitiveDataAccess = events.filter(e => 
      e.dataCategories?.includes(DataCategory.BIOMETRIC) ||
      e.dataCategories?.includes(DataCategory.SPECIAL_CATEGORY)
    ).length;
    riskScore += Math.min(25, sensitiveDataAccess * 5);
    
    const unauthorizedAccess = events.filter(e => e.eventType === GDPRAuditEventType.UNAUTHORIZED_ACCESS).length;
    riskScore += Math.min(20, unauthorizedAccess * 10);
    
    return Math.min(100, riskScore);
  }

  private async calculateOverallComplianceScore(
    events: GDPRAuditEvent[],
    consents: ConsentRecord[],
    riskDistribution: any,
    consentMetrics: any
  ): Promise<number> {
    let score = 100;
    
    // Penalty for high-risk users
    const totalUsers = Object.values(riskDistribution).reduce((sum: number, count: any) => sum + count, 0);
    if (totalUsers > 0) {
      const highRiskRatio = (riskDistribution.high + riskDistribution.critical) / totalUsers;
      score -= highRiskRatio * 30;
    }
    
    // Penalty for consent issues
    const totalConsentIssues = consentMetrics.expiredConsents + consentMetrics.missingConsents;
    if (totalConsentIssues > 0) {
      score -= Math.min(25, totalConsentIssues * 2);
    }
    
    // Bonus for good practices
    const deletionEvents = events.filter(e => e.eventType === GDPRAuditEventType.DATA_DELETION).length;
    if (deletionEvents > 0) {
      score += Math.min(10, deletionEvents * 0.5);
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private detectBulkDataAccess(events: GDPRAuditEvent[]): string[] {
    const userAccess = new Map<string, number>();
    
    events.filter(e => e.eventType === GDPRAuditEventType.DATA_ACCESS_REQUEST).forEach(event => {
      userAccess.set(event.dataSubjectId, (userAccess.get(event.dataSubjectId) || 0) + 1);
    });
    
    return Array.from(userAccess.entries())
      .filter(([_, count]) => count > this.ANOMALY_PATTERNS.BULK_ACCESS_THRESHOLD)
      .map(([userId, _]) => userId);
  }

  private async detectMissingConsents(events: GDPRAuditEvent[]): Promise<string[]> {
    const processingUsers = new Set(
      events.filter(e => 
        e.eventType === GDPRAuditEventType.DATA_PROCESSING || 
        e.eventType === GDPRAuditEventType.DATA_ACCESS_REQUEST
      ).map(e => e.dataSubjectId)
    );
    
    const consentUsers = new Set(
      (await gdprAuditService.loadConsentRecordsFromDatabase())
        .filter(c => !c.withdrawnAt && !this.isConsentExpired(c.givenAt, 365))
        .map(c => c.userId)
    );
    
    return Array.from(processingUsers).filter(userId => !consentUsers.has(userId));
  }

  private isConsentExpired(givenAt: Date, validityDays: number): boolean {
    const expiryDate = new Date(givenAt.getTime() + validityDays * 24 * 60 * 60 * 1000);
    return new Date() > expiryDate;
  }
}

// Singleton export
export const gdprAIAnalyticsService = new GDPRAIAnalyticsService();