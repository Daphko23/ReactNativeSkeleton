/**
 * @fileoverview UI Preferences Repository Interface - Enterprise UI State Management
 * 
 * ✅ ENTERPRISE REPOSITORY PATTERN:
 * - Clean Architecture separation
 * - Testable interface contracts
 * - Multi-device sync capabilities
 * - GDPR-compliant data handling
 */

export interface ExpandedSections {
  completeness: boolean;
  enhancements: boolean;
  security: boolean;
  quickActions: boolean;
  permissions: boolean;
}

export interface UIPreferences {
  expandedSections: ExpandedSections;
  compactMode: boolean;
  showAdvancedFeatures: boolean;
  lastUpdated: number;
  version: string;
  // 🚀 ENTERPRISE: Multi-device sync
  deviceId?: string;
  syncEnabled?: boolean;
  syncTimestamp?: number;
}

export interface UIAnalytics {
  sectionToggleCount: Record<string, number>;
  quickActionUsage: Record<string, number>;
  sessionStartTime: number;
  totalInteractions: number;
  averageSessionDuration: number;
  lastInteractionTime: number;
  preferredSections: string[];
  performanceMetrics: {
    averageToggleTime: number;
    slowToggleCount: number;
    totalToggleTime: number;
  };
  // 🚀 ENTERPRISE: Enhanced analytics
  userBehaviorInsights?: {
    mostUsedFeatures: string[];
    sessionPatterns: Record<string, number>;
    efficiencyScore: number;
  };
}

export interface UIAnalyticsExport {
  analytics: UIAnalytics;
  metadata: {
    userId: string;
    exportTime: number;
    variant: string;
    version: string;
    dataSize: number;
  };
}

export interface IUIPreferencesRepository {
  // 🎯 PREFERENCES MANAGEMENT
  getPreferences(userId: string): Promise<UIPreferences | null>;
  savePreferences(userId: string, preferences: UIPreferences): Promise<void>;
  updatePreferences(userId: string, updates: Partial<UIPreferences>): Promise<void>;
  deletePreferences(userId: string): Promise<void>;
  
  // 🚀 ANALYTICS MANAGEMENT
  getAnalytics(userId: string): Promise<UIAnalytics | null>;
  saveAnalytics(userId: string, analytics: UIAnalytics): Promise<void>;
  updateAnalytics(userId: string, updates: Partial<UIAnalytics>): Promise<void>;
  resetAnalytics(userId: string): Promise<void>;
  
  // 📊 EXPORT & GDPR
  exportUserData(userId: string): Promise<UIAnalyticsExport>;
  deleteUserData(userId: string): Promise<void>;
  
  // 🔄 SYNC & BACKUP
  syncPreferences(userId: string, deviceId: string): Promise<UIPreferences | null>;
  backupAnalytics(userId: string): Promise<boolean>;
  
  // 🚀 ENTERPRISE: Health & Performance
  checkStorageHealth(): Promise<{
    isHealthy: boolean;
    storageUsed: number;
    storageAvailable: number;
    lastBackup?: number;
  }>;
} 