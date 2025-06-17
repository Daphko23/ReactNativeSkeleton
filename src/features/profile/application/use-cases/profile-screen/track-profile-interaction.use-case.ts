/**
 * TrackProfileInteractionUseCase - Enterprise User Interaction Analytics
 * 🚀 ENTERPRISE: User Behavior Tracking, Analytics, Engagement Metrics
 * ✅ APPLICATION LAYER: Business Logic für Profile Screen Analytics
 */

import { Result } from '@core/types/result.type';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import {
  ProfileInteraction,
  ProfileInteractionType,
  ProfileInteractionEvent as _ProfileInteractionEvent,
  EngagementLevel,
  DeviceInteractionContext,
  createProfileInteraction
} from '../../../domain/entities/profile-interaction.entity';

const logger = LoggerFactory.createServiceLogger('TrackProfileInteractionUseCase');

/**
 * @interface TrackInteractionRequest - Input for interaction tracking
 */
export interface TrackInteractionRequest {
  userId: string;
  sessionId: string;
  interactionType: ProfileInteractionType;
  elementId: string;
  screenPosition: { x: number; y: number };
  metadata?: Record<string, any>;
  deviceContext: DeviceInteractionContext;
}

/**
 * @interface TrackInteractionResponse - Result of interaction tracking
 */
export interface TrackInteractionResponse {
  interactionId: string;
  engagementScore: number;
  engagementLevel: EngagementLevel;
  sessionAnalytics: {
    totalInteractions: number;
    sessionDuration: number;
    mostUsedFeature: string;
    bounceRisk: number; // 0-1
  };
  insights: {
    isEngaged: boolean;
    suggestedNextAction?: string;
    usagePattern: 'exploring' | 'focused' | 'power_user' | 'casual';
  };
}

/**
 * @interface StartSessionRequest - Input for session initialization
 */
export interface StartSessionRequest {
  userId: string;
  sessionId: string;
  deviceContext: DeviceInteractionContext;
  entryPoint?: string;
  referrer?: string;
}

/**
 * @interface EndSessionRequest - Input for session termination
 */
export interface EndSessionRequest {
  userId: string;
  sessionId: string;
}

/**
 * @interface GetAnalyticsRequest - Input for analytics retrieval
 */
export interface GetAnalyticsRequest {
  userId: string;
  timeRange?: {
    start: Date;
    end: Date;
  };
  includeDeviceBreakdown?: boolean;
  includeHeatmap?: boolean;
}

/**
 * @interface AnalyticsResponse - User analytics summary
 */
export interface AnalyticsResponse {
  engagementSummary: {
    averageEngagementScore: number;
    engagementTrend: 'improving' | 'declining' | 'stable';
    totalSessions: number;
    averageSessionDuration: number;
  };
  behaviorInsights: {
    mostUsedFeatures: string[];
    preferredInteractionTimes: string[];
    devicePreferences: Record<string, number>;
    navigationPatterns: string[];
  };
  heatmapData?: Record<string, number>;
  recommendations: string[];
}

/**
 * @class TrackProfileInteractionUseCase
 * Enterprise Use Case for Profile Screen Interaction Analytics
 * 
 * Handles:
 * - Real-time interaction tracking
 * - Engagement score calculation
 * - Behavioral analytics
 * - Session management
 * - Usage insights generation
 * - Performance recommendations
 */
export class TrackProfileInteractionUseCase {
  private activeInteractions: Map<string, ProfileInteraction> = new Map();

  constructor() {
    logger.info('TrackProfileInteractionUseCase initialized', LogCategory.BUSINESS);
  }

  /**
   * Starts a new analytics session for user
   */
  async startSession(request: StartSessionRequest): Promise<Result<ProfileInteraction, string>> {
    try {
      logger.info('Starting profile interaction session', LogCategory.BUSINESS, {
        userId: request.userId,
        sessionId: request.sessionId,
        metadata: {
          entryPoint: request.entryPoint
        }
      });

      // Validate request
      if (!request.userId || !request.sessionId) {
        return Result.error('Invalid session start request');
      }

      // Create new interaction tracker
      const interaction = createProfileInteraction({
        userId: request.userId,
        sessionId: request.sessionId,
        deviceContext: request.deviceContext
      });

      // Store active session
      this.activeInteractions.set(request.sessionId, interaction);

      // Record session start event
      interaction.recordInteraction({
        type: ProfileInteractionType.VIEW,
        timestamp: new Date(),
        elementId: 'profile_screen',
        screenPosition: { x: 0, y: 0 },
        metadata: {
          entryPoint: request.entryPoint,
          referrer: request.referrer,
          sessionStart: true
        }
      });

      logger.info('Profile interaction session started', LogCategory.BUSINESS, {
        userId: request.userId,
        sessionId: request.sessionId
      });

      return Result.success(interaction);
    } catch (error) {
      logger.error('Failed to start interaction session', LogCategory.BUSINESS, 
        { userId: request.userId }, error as Error);
      return Result.error(`Failed to start session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Tracks a specific user interaction
   */
  async trackInteraction(request: TrackInteractionRequest): Promise<Result<TrackInteractionResponse, string>> {
    try {
      logger.info('Tracking profile interaction', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: {
          interactionType: request.interactionType,
          elementId: request.elementId
        }
      });

      // Get active session
      const interaction = this.activeInteractions.get(request.sessionId);
      if (!interaction) {
        return Result.error('No active session found');
      }

      // Generate interaction ID
      const interactionId = `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Record the interaction
      interaction.recordInteraction({
        type: request.interactionType,
        timestamp: new Date(),
        elementId: request.elementId,
        screenPosition: request.screenPosition,
        metadata: {
          ...request.metadata,
          interactionId
        }
      });

      // Calculate current engagement
      const engagementScore = interaction.calculateEngagementScore();
      interaction.updateEngagementLevel();
      
      const behaviorMetrics = interaction.behaviorMetrics;
      const _sessionAnalytics = interaction.sessionAnalytics;
      const engagementMetrics = interaction.engagementMetrics;

      // Generate insights
      const insights = this.generateInteractionInsights(interaction);
      
      // Calculate bounce risk
      const bounceRisk = this.calculateBounceRisk(interaction);

      const response: TrackInteractionResponse = {
        interactionId,
        engagementScore,
        engagementLevel: engagementMetrics.engagementLevel,
        sessionAnalytics: {
          totalInteractions: behaviorMetrics.totalInteractions,
          sessionDuration: this.getSessionDuration(interaction),
          mostUsedFeature: behaviorMetrics.mostUsedFeatures[0] || '',
          bounceRisk
        },
        insights
      };

      logger.info('Profile interaction tracked', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: {
          interactionId,
          engagementScore
        }
      });

      return Result.success(response);
    } catch (error) {
      logger.error('Failed to track interaction', LogCategory.BUSINESS, 
        { userId: request.userId }, error as Error);
      return Result.error(`Failed to track interaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ends an analytics session
   */
  async endSession(request: EndSessionRequest): Promise<Result<AnalyticsResponse, string>> {
    try {
      logger.info('Ending profile interaction session', LogCategory.BUSINESS, {
        userId: request.userId,
        sessionId: request.sessionId
      });

      // Get active session
      const interaction = this.activeInteractions.get(request.sessionId);
      if (!interaction) {
        return Result.error('No active session found');
      }

      // End the session
      interaction.endSession();

      // Generate final analytics
      const analytics = this.generateSessionAnalytics(interaction);

      // Remove from active sessions
      this.activeInteractions.delete(request.sessionId);

      logger.info('Profile interaction session ended', LogCategory.BUSINESS, {
        userId: request.userId,
        sessionId: request.sessionId,
        metadata: {
          totalInteractions: interaction.events.length
        }
      });

      return Result.success(analytics);
    } catch (error) {
      logger.error('Failed to end interaction session', LogCategory.BUSINESS, 
        { userId: request.userId }, error as Error);
      return Result.error(`Failed to end session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves analytics for user
   */
  async getAnalytics(request: GetAnalyticsRequest): Promise<Result<AnalyticsResponse, string>> {
    try {
      logger.info('Getting profile analytics', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: {
          timeRange: request.timeRange
        }
      });

      // For now, return mock analytics (would integrate with analytics service)
      const analytics: AnalyticsResponse = {
        engagementSummary: {
          averageEngagementScore: 75,
          engagementTrend: 'improving',
          totalSessions: 15,
          averageSessionDuration: 180000 // 3 minutes
        },
        behaviorInsights: {
          mostUsedFeatures: ['profile_edit', 'custom_fields', 'avatar_upload'],
          preferredInteractionTimes: ['morning', 'evening'],
          devicePreferences: { 'mobile': 80, 'tablet': 20 },
          navigationPatterns: ['profile_main -> edit', 'profile_main -> custom_fields']
        },
        recommendations: [
          'Consider adding quick edit shortcuts',
          'Profile completion wizard could improve engagement',
          'Avatar upload process is highly engaging'
        ]
      };

      // Add heatmap data if requested
      if (request.includeHeatmap) {
        // Get heatmap from active sessions or stored data
        analytics.heatmapData = this.generateHeatmapData(request.userId);
      }

      return Result.success(analytics);
    } catch (error) {
      logger.error('Failed to get analytics', LogCategory.BUSINESS, 
        { userId: request.userId }, error as Error);
      return Result.error(`Failed to get analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods
  private generateInteractionInsights(interaction: ProfileInteraction): TrackInteractionResponse['insights'] {
    const engagementMetrics = interaction.engagementMetrics;
    const behaviorMetrics = interaction.behaviorMetrics;
    const sessionDuration = this.getSessionDuration(interaction);

    // Determine usage pattern
    let usagePattern: 'exploring' | 'focused' | 'power_user' | 'casual' = 'casual';
    
    if (engagementMetrics.engagementLevel === EngagementLevel.POWER_USER) {
      usagePattern = 'power_user';
    } else if (behaviorMetrics.totalInteractions > 20 && sessionDuration > 300000) {
      usagePattern = 'exploring';
    } else if (behaviorMetrics.uniqueElementsInteracted > 5) {
      usagePattern = 'focused';
    }

    // Suggest next action
    let suggestedNextAction: string | undefined;
    if (behaviorMetrics.mostUsedFeatures.includes('profile_edit')) {
      suggestedNextAction = 'Consider adding custom fields';
    } else if (sessionDuration < 30000) {
      suggestedNextAction = 'Explore profile completion features';
    }

    return {
      isEngaged: engagementMetrics.engagementScore > 50,
      suggestedNextAction,
      usagePattern
    };
  }

  private calculateBounceRisk(interaction: ProfileInteraction): number {
    const sessionDuration = this.getSessionDuration(interaction);
    const interactionCount = interaction.events.length;
    
    // High bounce risk if short session with few interactions
    if (sessionDuration < 30000 && interactionCount < 3) {
      return 0.8;
    } else if (sessionDuration < 60000 && interactionCount < 5) {
      return 0.5;
    }
    
    return 0.2;
  }

  private getSessionDuration(interaction: ProfileInteraction): number {
    const sessionAnalytics = interaction.sessionAnalytics;
    const endTime = sessionAnalytics.endTime || new Date();
    return endTime.getTime() - sessionAnalytics.startTime.getTime();
  }

  private generateSessionAnalytics(interaction: ProfileInteraction): AnalyticsResponse {
    const behaviorMetrics = interaction.behaviorMetrics;
    const engagementMetrics = interaction.engagementMetrics;
    const sessionDuration = this.getSessionDuration(interaction);

    return {
      engagementSummary: {
        averageEngagementScore: engagementMetrics.engagementScore,
        engagementTrend: 'stable',
        totalSessions: 1,
        averageSessionDuration: sessionDuration
      },
      behaviorInsights: {
        mostUsedFeatures: behaviorMetrics.mostUsedFeatures,
        preferredInteractionTimes: ['current'],
        devicePreferences: { 'current_device': 100 },
        navigationPatterns: interaction.getNavigationFlow()
      },
      recommendations: this.generateRecommendations(interaction)
    };
  }

  private generateHeatmapData(_userId: string): Record<string, number> {
    // Mock heatmap data - would integrate with analytics service
    return {
      'profile_header_0_0': 15,
      'avatar_section_1_2': 25,
      'custom_fields_2_3': 12,
      'completion_banner_0_1': 8
    };
  }

  private generateRecommendations(interaction: ProfileInteraction): string[] {
    const recommendations: string[] = [];
    const engagementMetrics = interaction.engagementMetrics;
    const behaviorMetrics = interaction.behaviorMetrics;

    if (engagementMetrics.engagementScore < 30) {
      recommendations.push('Consider simplifying the profile interface');
    }

    if (behaviorMetrics.errorCount > 2) {
      recommendations.push('Improve error handling and user guidance');
    }

    if (behaviorMetrics.mostUsedFeatures.length < 2) {
      recommendations.push('Highlight additional profile features');
    }

    return recommendations;
  }
}

// Factory function
export const createTrackProfileInteractionUseCase = (): TrackProfileInteractionUseCase => {
  return new TrackProfileInteractionUseCase();
}; 