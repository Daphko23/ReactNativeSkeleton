/**
 * @fileoverview Track UI Interaction Use Case - Enterprise UI Analytics
 * 
 * ✅ ENTERPRISE USE CASE:
 * - Business logic for UI interaction tracking
 * - Performance analysis and optimization suggestions
 * - User behavior insights and pattern detection
 * - GDPR-compliant analytics processing
 */

import { 
  UIAnalytics,
  IUIPreferencesRepository 
} from '../../../domain/interfaces/ui-preferences-repository.interface';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// 🎯 USE CASE INTERFACES
export interface TrackUIInteractionRequest {
  userId: string;
  interactionType: 'section_toggle' | 'quick_action' | 'modal_open' | 'preference_change';
  sectionName?: string;
  actionId?: string;
  modalType?: string;
  preferenceKey?: string;
  interactionDuration?: number;
  sessionContext: {
    variant: 'compact' | 'detailed' | 'admin';
    deviceType: 'phone' | 'tablet';
    connectionSpeed: 'slow' | 'medium' | 'fast';
  };
  performanceMetrics?: {
    renderTime: number;
    responseTime: number;
    memoryUsage: number;
  };
}

export interface TrackUIInteractionResponse {
  success: boolean;
  analytics: UIAnalytics;
  insights: {
    userEfficiencyScore: number;
    recommendedOptimizations: string[];
    behaviorPattern: 'power_user' | 'casual' | 'explorer' | 'focused';
    sessionQuality: 'excellent' | 'good' | 'poor';
  };
  performanceAlerts?: string[];
}

export interface UserBehaviorInsights {
  mostUsedFeatures: string[];
  sessionPatterns: Record<string, number>;
  efficiencyScore: number;
  preferredInteractionStyle: 'quick' | 'thorough' | 'exploratory';
  timeOfDayPatterns: Record<string, number>;
}

export class TrackUIInteractionUseCase {
  private readonly logger = LoggerFactory.createServiceLogger('TrackUIInteractionUseCase');

  constructor(
    private readonly repository: IUIPreferencesRepository
  ) {}

  async execute(request: TrackUIInteractionRequest): Promise<TrackUIInteractionResponse> {
    try {
      this.logger.info('Tracking UI interaction', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: {
          interactionType: request.interactionType,
          variant: request.sessionContext.variant
        }
      });

      // 🔍 GET CURRENT ANALYTICS
      const currentAnalytics = await this.repository.getAnalytics(request.userId) || this.createDefaultAnalytics();

      // 🚀 PROCESS INTERACTION
      const updatedAnalytics = await this.processInteraction(currentAnalytics, request);

      // 📊 GENERATE INSIGHTS
      const insights = this.generateUserInsights(updatedAnalytics, request);

      // 💾 SAVE UPDATED ANALYTICS
      await this.repository.saveAnalytics(request.userId, updatedAnalytics);

      // 🔍 CHECK PERFORMANCE ALERTS
      const performanceAlerts = this.checkPerformanceAlerts(request, updatedAnalytics);

      const response: TrackUIInteractionResponse = {
        success: true,
        analytics: updatedAnalytics,
        insights,
        performanceAlerts: performanceAlerts.length > 0 ? performanceAlerts : undefined
      };

      this.logger.info('UI interaction tracked successfully', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: {
          totalInteractions: updatedAnalytics.totalInteractions,
          efficiencyScore: insights.userEfficiencyScore,
          behaviorPattern: insights.behaviorPattern
        }
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to track UI interaction', LogCategory.BUSINESS, {
        userId: request.userId
      }, error as Error);

      return {
        success: false,
        analytics: await this.repository.getAnalytics(request.userId) || this.createDefaultAnalytics(),
        insights: {
          userEfficiencyScore: 0,
          recommendedOptimizations: [],
          behaviorPattern: 'casual',
          sessionQuality: 'poor'
        }
      };
    }
  }

  // =============================================================================
  // 🚀 PRIVATE BUSINESS LOGIC
  // =============================================================================

  private createDefaultAnalytics(): UIAnalytics {
    return {
      sectionToggleCount: {},
      quickActionUsage: {},
      sessionStartTime: Date.now(),
      totalInteractions: 0,
      averageSessionDuration: 0,
      lastInteractionTime: Date.now(),
      preferredSections: [],
      performanceMetrics: {
        averageToggleTime: 0,
        slowToggleCount: 0,
        totalToggleTime: 0,
      },
      userBehaviorInsights: {
        mostUsedFeatures: [],
        sessionPatterns: {},
        efficiencyScore: 100
      }
    };
  }

  private async processInteraction(
    analytics: UIAnalytics, 
    request: TrackUIInteractionRequest
  ): Promise<UIAnalytics> {
    const now = Date.now();
    const sessionDuration = now - analytics.sessionStartTime;

    // 📊 UPDATE INTERACTION COUNTS
    const updatedAnalytics: UIAnalytics = {
      ...analytics,
      totalInteractions: analytics.totalInteractions + 1,
      lastInteractionTime: now,
      averageSessionDuration: this.calculateAverageSessionDuration(analytics, sessionDuration)
    };

    // 🎯 PROCESS SPECIFIC INTERACTION TYPES
    switch (request.interactionType) {
      case 'section_toggle':
        if (request.sectionName) {
          updatedAnalytics.sectionToggleCount = {
            ...analytics.sectionToggleCount,
            [request.sectionName]: (analytics.sectionToggleCount[request.sectionName] || 0) + 1
          };

          // 📈 UPDATE PERFORMANCE METRICS
          if (request.interactionDuration) {
            updatedAnalytics.performanceMetrics = this.updatePerformanceMetrics(
              analytics.performanceMetrics,
              request.interactionDuration
            );
          }
        }
        break;

      case 'quick_action':
        if (request.actionId) {
          updatedAnalytics.quickActionUsage = {
            ...analytics.quickActionUsage,
            [request.actionId]: (analytics.quickActionUsage[request.actionId] || 0) + 1
          };
        }
        break;

      case 'modal_open':
        // Track modal usage patterns
        if (request.modalType) {
          const modalKey = `modal_${request.modalType}`;
          updatedAnalytics.quickActionUsage = {
            ...analytics.quickActionUsage,
            [modalKey]: (analytics.quickActionUsage[modalKey] || 0) + 1
          };
        }
        break;

      case 'preference_change':
        // Track preference modification patterns
        if (request.preferenceKey) {
          const prefKey = `pref_${request.preferenceKey}`;
          updatedAnalytics.quickActionUsage = {
            ...analytics.quickActionUsage,
            [prefKey]: (analytics.quickActionUsage[prefKey] || 0) + 1
          };
        }
        break;
    }

    // 🧠 UPDATE USER BEHAVIOR INSIGHTS
    const defaultInsights: UserBehaviorInsights = {
      mostUsedFeatures: [],
      sessionPatterns: {},
      efficiencyScore: 100,
      preferredInteractionStyle: 'quick',
      timeOfDayPatterns: {}
    };
    
    const currentInsights: UserBehaviorInsights = analytics.userBehaviorInsights 
      ? { ...defaultInsights, ...analytics.userBehaviorInsights }
      : defaultInsights;
    
    updatedAnalytics.userBehaviorInsights = this.updateBehaviorInsights(
      currentInsights,
      request
    );

    // 📊 UPDATE PREFERRED SECTIONS
    updatedAnalytics.preferredSections = this.calculatePreferredSections(updatedAnalytics);

    return updatedAnalytics;
  }

  private updatePerformanceMetrics(
    currentMetrics: UIAnalytics['performanceMetrics'],
    interactionDuration: number
  ): UIAnalytics['performanceMetrics'] {
    const totalTime = currentMetrics.totalToggleTime + interactionDuration;
    const totalToggles = Math.floor(totalTime / currentMetrics.averageToggleTime) + 1;

    return {
      totalToggleTime: totalTime,
      averageToggleTime: totalTime / totalToggles,
      slowToggleCount: interactionDuration > 150 ? currentMetrics.slowToggleCount + 1 : currentMetrics.slowToggleCount
    };
  }

  private updateBehaviorInsights(
    currentInsights: UserBehaviorInsights,
    request: TrackUIInteractionRequest
  ): UserBehaviorInsights {
    const feature = request.sectionName || request.actionId || request.modalType || 'unknown';
    const timeSlot = this.getTimeSlot(new Date());

    return {
      ...currentInsights,
      mostUsedFeatures: this.updateMostUsedFeatures(currentInsights.mostUsedFeatures, feature),
      sessionPatterns: {
        ...currentInsights.sessionPatterns,
        [request.sessionContext.variant]: (currentInsights.sessionPatterns[request.sessionContext.variant] || 0) + 1
      },
      timeOfDayPatterns: {
        ...currentInsights.timeOfDayPatterns || {},
        [timeSlot]: ((currentInsights.timeOfDayPatterns || {})[timeSlot] || 0) + 1
      },
      efficiencyScore: this.calculateEfficiencyScore(currentInsights, request)
    };
  }

  private generateUserInsights(
    analytics: UIAnalytics, 
    request: TrackUIInteractionRequest
  ): TrackUIInteractionResponse['insights'] {
    const efficiencyScore = analytics.userBehaviorInsights?.efficiencyScore || 100;
    const behaviorPattern = this.determineBehaviorPattern(analytics);
    const sessionQuality = this.assessSessionQuality(analytics, request);
    const optimizations = this.generateOptimizationRecommendations(analytics, behaviorPattern);

    return {
      userEfficiencyScore: efficiencyScore,
      recommendedOptimizations: optimizations,
      behaviorPattern,
      sessionQuality
    };
  }

  private determineBehaviorPattern(analytics: UIAnalytics): 'power_user' | 'casual' | 'explorer' | 'focused' {
    const { totalInteractions, performanceMetrics, userBehaviorInsights } = analytics;
    const avgToggleTime = performanceMetrics.averageToggleTime;
    const featureVariety = userBehaviorInsights?.mostUsedFeatures?.length || 0;

    if (totalInteractions > 100 && avgToggleTime < 100) {
      return 'power_user';
    } else if (featureVariety > 8) {
      return 'explorer';
    } else if (featureVariety < 3 && avgToggleTime < 150) {
      return 'focused';
    } else {
      return 'casual';
    }
  }

  private assessSessionQuality(
    analytics: UIAnalytics, 
    request: TrackUIInteractionRequest
  ): 'excellent' | 'good' | 'poor' {
    const avgToggleTime = analytics.performanceMetrics.averageToggleTime;
    const slowToggleRate = analytics.performanceMetrics.slowToggleCount / Math.max(analytics.totalInteractions, 1);
    const hasPerformanceMetrics = Boolean(request.performanceMetrics);

    if (avgToggleTime < 100 && slowToggleRate < 0.1 && hasPerformanceMetrics) {
      return 'excellent';
    } else if (avgToggleTime < 200 && slowToggleRate < 0.3) {
      return 'good';
    } else {
      return 'poor';
    }
  }

  private generateOptimizationRecommendations(
    analytics: UIAnalytics, 
    behaviorPattern: string
  ): string[] {
    const recommendations: string[] = [];
    const { performanceMetrics, userBehaviorInsights } = analytics;

    // Performance-based recommendations
    if (performanceMetrics.averageToggleTime > 200) {
      recommendations.push('Consider enabling performance mode for faster interactions');
    }

    if (performanceMetrics.slowToggleCount > 5) {
      recommendations.push('Some interactions are slow - check device performance settings');
    }

    // Behavior-based recommendations
    if (behaviorPattern === 'power_user') {
      recommendations.push('Enable keyboard shortcuts for even faster navigation');
      recommendations.push('Consider admin mode for advanced features');
    } else if (behaviorPattern === 'explorer') {
      recommendations.push('Enable tooltips and help hints for better feature discovery');
    } else if (behaviorPattern === 'focused') {
      recommendations.push('Consider compact mode to reduce clutter');
    }

    // Feature usage recommendations
    const mostUsed = userBehaviorInsights?.mostUsedFeatures?.[0];
    if (mostUsed && mostUsed.includes('completeness')) {
      recommendations.push('Pin completion widget to dashboard for quick access');
    }

    return recommendations;
  }

  private checkPerformanceAlerts(
    request: TrackUIInteractionRequest, 
    analytics: UIAnalytics
  ): string[] {
    const alerts: string[] = [];

    // Performance threshold alerts
    if (request.interactionDuration && request.interactionDuration > 500) {
      alerts.push('Slow interaction detected - consider optimizing UI components');
    }

    if (analytics.performanceMetrics.averageToggleTime > 300) {
      alerts.push('Average interaction time is high - performance optimization recommended');
    }

    // Memory usage alerts
    if (request.performanceMetrics?.memoryUsage && request.performanceMetrics.memoryUsage > 100) {
      alerts.push('High memory usage detected during UI interaction');
    }

    return alerts;
  }

  // =============================================================================
  // 🔧 HELPER METHODS
  // =============================================================================

  private calculateAverageSessionDuration(analytics: UIAnalytics, currentDuration: number): number {
    // Simple moving average for session duration
    const weight = 0.1; // 10% weight for new session
    return analytics.averageSessionDuration * (1 - weight) + currentDuration * weight;
  }

  private updateMostUsedFeatures(currentFeatures: string[], newFeature: string): string[] {
    const updated = [...currentFeatures];
    const index = updated.indexOf(newFeature);
    
    if (index > -1) {
      // Move to front if already exists
      updated.splice(index, 1);
      updated.unshift(newFeature);
    } else {
      // Add to front and limit to 10 features
      updated.unshift(newFeature);
      updated.splice(10);
    }
    
    return updated;
  }

  private calculatePreferredSections(analytics: UIAnalytics): string[] {
    return Object.entries(analytics.sectionToggleCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([section]) => section);
  }

  private getTimeSlot(date: Date): string {
    const hour = date.getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private calculateEfficiencyScore(
    insights: UserBehaviorInsights, 
    request: TrackUIInteractionRequest
  ): number {
    let score = insights.efficiencyScore || 100;
    
    // Reduce score for slow interactions
    if (request.interactionDuration && request.interactionDuration > 200) {
      score = Math.max(0, score - 2);
    }
    
    // Increase score for fast interactions
    if (request.interactionDuration && request.interactionDuration < 100) {
      score = Math.min(100, score + 1);
    }
    
    return score;
  }
}