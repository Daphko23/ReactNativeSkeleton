/**
 * ProfileInteraction Entity - Enterprise User Behavior Analytics
 * 🚀 ENTERPRISE: User Interaction Tracking, Behavioral Analytics, Engagement Metrics
 * ✅ DOMAIN LAYER: Business Intelligence für Profile Screen Usage
 */

/**
 * @enum InteractionType - Types of user interactions
 */
export enum ProfileInteractionType {
  VIEW = 'view',
  EDIT = 'edit',
  NAVIGATION = 'navigation',
  SHARE = 'share',
  EXPORT = 'export',
  AVATAR_CHANGE = 'avatar_change',
  SETTING_CHANGE = 'setting_change',
  CUSTOM_FIELD_EDIT = 'custom_field_edit',
  SCROLL = 'scroll',
  TAP = 'tap'
}

/**
 * @enum EngagementLevel - User engagement classification
 */
export enum EngagementLevel {
  LOW = 'low',          // < 30 seconds, minimal interactions
  MEDIUM = 'medium',    // 30-180 seconds, moderate interactions
  HIGH = 'high',        // 180+ seconds, many interactions
  POWER_USER = 'power_user'  // Frequent visitor, many edits
}

/**
 * @interface InteractionEvent - Single user interaction event
 */
export interface ProfileInteractionEvent {
  readonly id: string;
  readonly type: ProfileInteractionType;
  readonly timestamp: Date;
  readonly elementId: string;
  readonly screenPosition: { x: number; y: number };
  readonly metadata: Record<string, any>;
  readonly sessionId: string;
}

/**
 * @interface UserBehaviorMetrics - Behavioral analytics data
 */
export interface UserBehaviorMetrics {
  totalInteractions: number;
  uniqueElementsInteracted: number;
  readonly averageInteractionTime: number;
  mostUsedFeatures: string[];
  readonly navigationPatterns: string[];
  readonly timeSpentPerSection: Record<string, number>;
  readonly errorCount: number;
  readonly successfulActionsCount: number;
}

/**
 * @interface EngagementMetrics - Profile engagement analytics
 */
export interface ProfileEngagementMetrics {
  engagementLevel: EngagementLevel;
  engagementScore: number; // 0-100
  readonly profileViewsToday: number;
  readonly profileEditSessionsToday: number;
  readonly avgSessionDuration: number;
  readonly returnVisitRate: number;
  readonly completionTasksCompleted: number;
  readonly socialShareCount: number;
}

/**
 * @interface DeviceContext - Device and environment context
 */
export interface DeviceInteractionContext {
  readonly deviceType: 'phone' | 'tablet';
  readonly screenSize: { width: number; height: number };
  readonly orientation: 'portrait' | 'landscape';
  readonly connectionType: 'wifi' | 'cellular' | 'offline';
  readonly batteryLevel: number;
  readonly isLowPowerMode: boolean;
  readonly isDarkMode: boolean;
}

/**
 * @interface SessionAnalytics - Session-specific analytics
 */
export interface ProfileSessionAnalytics {
  readonly sessionId: string;
  readonly startTime: Date;
  endTime: Date | null;
  totalEvents: number;
  readonly featureUsage: Record<string, number>;
  readonly errorsEncountered: string[];
  readonly performanceMetrics: {
    avgResponseTime: number;
    slowestAction: string;
    fastestAction: string;
  };
  bounceRate: number; // Left quickly without meaningful interaction
}

/**
 * @class ProfileInteraction - Enterprise User Interaction Analytics
 */
export class ProfileInteraction {
  private readonly _userId: string;
  private readonly _sessionId: string;
  private _events: ProfileInteractionEvent[];
  private _behaviorMetrics: UserBehaviorMetrics;
  private _engagementMetrics: ProfileEngagementMetrics;
  private _deviceContext: DeviceInteractionContext;
  private _sessionAnalytics: ProfileSessionAnalytics;
  private readonly _createdAt: Date;
  private _lastInteraction: Date;

  constructor(config: {
    userId: string;
    sessionId: string;
    deviceContext: DeviceInteractionContext;
  }) {
    this._userId = config.userId;
    this._sessionId = config.sessionId;
    this._deviceContext = config.deviceContext;
    this._createdAt = new Date();
    this._lastInteraction = new Date();
    this._events = [];

    this._behaviorMetrics = {
      totalInteractions: 0,
      uniqueElementsInteracted: 0,
      averageInteractionTime: 0,
      mostUsedFeatures: [],
      navigationPatterns: [],
      timeSpentPerSection: {},
      errorCount: 0,
      successfulActionsCount: 0
    };

    this._engagementMetrics = {
      engagementLevel: EngagementLevel.LOW,
      engagementScore: 0,
      profileViewsToday: 1,
      profileEditSessionsToday: 0,
      avgSessionDuration: 0,
      returnVisitRate: 0,
      completionTasksCompleted: 0,
      socialShareCount: 0
    };

    this._sessionAnalytics = {
      sessionId: config.sessionId,
      startTime: new Date(),
      endTime: null,
      totalEvents: 0,
      featureUsage: {},
      errorsEncountered: [],
      performanceMetrics: {
        avgResponseTime: 0,
        slowestAction: '',
        fastestAction: ''
      },
      bounceRate: 0
    };
  }

  // Getters
  get userId(): string { return this._userId; }
  get sessionId(): string { return this._sessionId; }
  get events(): ProfileInteractionEvent[] { return [...this._events]; }
  get behaviorMetrics(): UserBehaviorMetrics { return { ...this._behaviorMetrics }; }
  get engagementMetrics(): ProfileEngagementMetrics { return { ...this._engagementMetrics }; }
  get deviceContext(): DeviceInteractionContext { return { ...this._deviceContext }; }
  get sessionAnalytics(): ProfileSessionAnalytics { return { ...this._sessionAnalytics }; }
  get lastInteraction(): Date { return this._lastInteraction; }

  // Business Logic Methods
  recordInteraction(event: Omit<ProfileInteractionEvent, 'id' | 'sessionId'>): void {
    const interactionEvent: ProfileInteractionEvent = {
      ...event,
      id: this.generateEventId(),
      sessionId: this._sessionId
    };

    this._events.push(interactionEvent);
    this._lastInteraction = new Date();
    this.updateMetrics(interactionEvent);
  }

  calculateEngagementScore(): number {
    const sessionDuration = this.getSessionDuration();
    const interactionDensity = this._events.length / Math.max(sessionDuration / 1000, 1);
    const featureUsageDiversity = Object.keys(this._sessionAnalytics.featureUsage).length;
    const errorRate = this._behaviorMetrics.errorCount / Math.max(this._events.length, 1);

    let score = 0;
    
    // Duration score (max 30 points)
    if (sessionDuration > 300000) score += 30; // 5+ minutes
    else if (sessionDuration > 120000) score += 20; // 2+ minutes
    else if (sessionDuration > 30000) score += 10; // 30+ seconds

    // Interaction density (max 30 points)
    if (interactionDensity > 0.5) score += 30;
    else if (interactionDensity > 0.2) score += 20;
    else if (interactionDensity > 0.1) score += 10;

    // Feature diversity (max 25 points)
    score += Math.min(featureUsageDiversity * 5, 25);

    // Error penalty (max -15 points)
    score -= Math.min(errorRate * 100, 15);

    return Math.max(0, Math.min(100, score));
  }

  updateEngagementLevel(): void {
    const score = this.calculateEngagementScore();
    
    if (score >= 80) this._engagementMetrics.engagementLevel = EngagementLevel.POWER_USER;
    else if (score >= 60) this._engagementMetrics.engagementLevel = EngagementLevel.HIGH;
    else if (score >= 30) this._engagementMetrics.engagementLevel = EngagementLevel.MEDIUM;
    else this._engagementMetrics.engagementLevel = EngagementLevel.LOW;
    
    this._engagementMetrics.engagementScore = score;
  }

  getInteractionHeatmap(): Record<string, number> {
    const heatmap: Record<string, number> = {};
    
    this._events.forEach(event => {
      const key = `${event.elementId}_${Math.floor(event.screenPosition.x / 50)}_${Math.floor(event.screenPosition.y / 50)}`;
      heatmap[key] = (heatmap[key] || 0) + 1;
    });

    return heatmap;
  }

  getNavigationFlow(): string[] {
    return this._events
      .filter(event => event.type === ProfileInteractionType.NAVIGATION)
      .map(event => event.elementId);
  }

  endSession(): void {
    this._sessionAnalytics.endTime = new Date();
    this._sessionAnalytics.totalEvents = this._events.length;
    this.updateEngagementLevel();
    this.calculateBounceRate();
  }

  // Private Methods
  private updateMetrics(event: ProfileInteractionEvent): void {
    // Update behavior metrics
    this._behaviorMetrics.totalInteractions++;
    
    // Update feature usage
    const featureKey = `${event.type}_${event.elementId}`;
    this._sessionAnalytics.featureUsage[featureKey] = 
      (this._sessionAnalytics.featureUsage[featureKey] || 0) + 1;

    // Track unique elements
    const uniqueElements = new Set(this._events.map(e => e.elementId));
    this._behaviorMetrics.uniqueElementsInteracted = uniqueElements.size;

    // Update most used features
    const sortedFeatures = Object.entries(this._sessionAnalytics.featureUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([feature]) => feature);
    this._behaviorMetrics.mostUsedFeatures = sortedFeatures;
  }

  private calculateBounceRate(): void {
    const sessionDuration = this.getSessionDuration();
    const meaningfulInteractions = this._events.filter(event => 
      event.type !== ProfileInteractionType.VIEW && 
      event.type !== ProfileInteractionType.SCROLL
    ).length;

    if (sessionDuration < 30000 && meaningfulInteractions < 2) {
      this._sessionAnalytics.bounceRate = 1.0; // High bounce
    } else if (sessionDuration < 60000 && meaningfulInteractions < 3) {
      this._sessionAnalytics.bounceRate = 0.5; // Medium bounce
    } else {
      this._sessionAnalytics.bounceRate = 0.0; // Low bounce
    }
  }

  private getSessionDuration(): number {
    const endTime = this._sessionAnalytics.endTime || new Date();
    return endTime.getTime() - this._sessionAnalytics.startTime.getTime();
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility Methods
  toAnalyticsPayload(): Record<string, any> {
    return {
      userId: this._userId,
      sessionId: this._sessionId,
      behaviorMetrics: this._behaviorMetrics,
      engagementMetrics: this._engagementMetrics,
      sessionAnalytics: this._sessionAnalytics,
      deviceContext: this._deviceContext,
      totalEvents: this._events.length,
      sessionDuration: this.getSessionDuration(),
      createdAt: this._createdAt.toISOString()
    };
  }
}

export const createProfileInteraction = (config: {
  userId: string;
  sessionId: string;
  deviceContext: DeviceInteractionContext;
}): ProfileInteraction => {
  return new ProfileInteraction(config);
}; 