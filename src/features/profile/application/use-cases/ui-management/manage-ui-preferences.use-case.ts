/**
 * @fileoverview Manage UI Preferences Use Case - Enterprise UI State Management
 * 
 * ✅ ENTERPRISE USE CASE:
 * - Business logic for UI preferences management
 * - Multi-device synchronization
 * - Preference validation and migration
 * - Performance optimization recommendations
 */

import { 
  UIPreferences,
  ExpandedSections as _ExpandedSections,
  IUIPreferencesRepository 
} from '../../../domain/interfaces/ui-preferences-repository.interface';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// 🎯 USE CASE INTERFACES
export interface ManageUIPreferencesRequest {
  userId: string;
  action: 'load' | 'save' | 'update' | 'reset' | 'sync';
  preferences?: Partial<UIPreferences>;
  deviceId?: string;
  validationRules?: {
    enforceDefaults: boolean;
    validateSections: boolean;
    migrateOldFormat: boolean;
  };
}

export interface ManageUIPreferencesResponse {
  success: boolean;
  preferences: UIPreferences;
  insights: {
    optimizationSuggestions: string[];
    compatibilityIssues: string[];
    migrationNotes?: string[];
    syncStatus: 'synced' | 'pending' | 'conflict' | 'disabled';
  };
  performance: {
    operationTime: number;
    storageUsed: number;
    cacheHit: boolean;
  };
}

export interface UIValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  migratedData?: UIPreferences;
}

export class ManageUIPreferencesUseCase {
  private readonly logger = LoggerFactory.createServiceLogger('ManageUIPreferencesUseCase');
  private readonly preferencesCache = new Map<string, { data: UIPreferences; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly repository: IUIPreferencesRepository
  ) {}

  async execute(request: ManageUIPreferencesRequest): Promise<ManageUIPreferencesResponse> {
    const startTime = Date.now();
    
    try {
      this.logger.info('Managing UI preferences', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: {
          action: request.action,
          hasPreferences: Boolean(request.preferences)
        }
      });

      let result: UIPreferences;
      let cacheHit = false;
      const insights = this.createDefaultInsights();

      switch (request.action) {
        case 'load':
          ({ preferences: result, cacheHit } = await this.loadPreferences(request.userId));
          break;
        
        case 'save':
          result = await this.savePreferences(request, insights);
          break;
        
        case 'update':
          result = await this.updatePreferences(request, insights);
          break;
        
        case 'reset':
          result = await this.resetPreferences(request.userId, insights);
          break;
        
        case 'sync':
          result = await this.syncPreferences(request, insights);
          break;
        
        default:
          throw new Error(`Unknown action: ${request.action}`);
      }

      // 🔍 GENERATE OPTIMIZATION SUGGESTIONS
      insights.optimizationSuggestions = this.generateOptimizationSuggestions(result);

      // 📊 CALCULATE PERFORMANCE METRICS
      const operationTime = Date.now() - startTime;
      const storageUsed = JSON.stringify(result).length;

      const response: ManageUIPreferencesResponse = {
        success: true,
        preferences: result,
        insights,
        performance: {
          operationTime,
          storageUsed,
          cacheHit
        }
      };

      this.logger.info('UI preferences managed successfully', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: {
          action: request.action,
          operationTime,
          storageUsed,
          cacheHit
        }
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to manage UI preferences', LogCategory.BUSINESS, {
        userId: request.userId,
        metadata: { action: request.action }
      }, error as Error);

      return {
        success: false,
        preferences: this.createDefaultPreferences(),
        insights: {
          optimizationSuggestions: [],
          compatibilityIssues: ['Operation failed - using default preferences'],
          syncStatus: 'disabled'
        },
        performance: {
          operationTime: Date.now() - startTime,
          storageUsed: 0,
          cacheHit: false
        }
      };
    }
  }

  // =============================================================================
  // 🚀 PREFERENCE OPERATIONS
  // =============================================================================

  private async loadPreferences(userId: string): Promise<{ preferences: UIPreferences; cacheHit: boolean }> {
    // 🚀 CHECK CACHE FIRST
    const cached = this.preferencesCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.logger.info('Using cached UI preferences', LogCategory.PERFORMANCE, {
        userId,
        metadata: { cacheAge: Date.now() - cached.timestamp }
      });
      return { preferences: cached.data, cacheHit: true };
    }

    // 📥 LOAD FROM REPOSITORY
    const preferences = await this.repository.getPreferences(userId);
    const result = preferences || this.createDefaultPreferences();

    // 💾 CACHE THE RESULT
    this.preferencesCache.set(userId, {
      data: result,
      timestamp: Date.now()
    });

    return { preferences: result, cacheHit: false };
  }

  private async savePreferences(
    request: ManageUIPreferencesRequest, 
    insights: ManageUIPreferencesResponse['insights']
  ): Promise<UIPreferences> {
    if (!request.preferences) {
      throw new Error('Preferences data required for save operation');
    }

    // 🔍 VALIDATE PREFERENCES
    const validation = this.validatePreferences(request.preferences, request.validationRules);
    if (!validation.isValid) {
      insights.compatibilityIssues.push(...validation.errors);
      if (validation.migratedData) {
        insights.migrationNotes = [`Migrated ${validation.warnings.length} preference settings`];
      }
    }

    const preferencesToSave = validation.migratedData || request.preferences as UIPreferences;
    
    // 💾 SAVE TO REPOSITORY
    await this.repository.savePreferences(request.userId, preferencesToSave);

    // 🔄 UPDATE CACHE
    this.preferencesCache.set(request.userId, {
      data: preferencesToSave,
      timestamp: Date.now()
    });

    insights.syncStatus = 'synced';
    return preferencesToSave;
  }

  private async updatePreferences(
    request: ManageUIPreferencesRequest, 
    insights: ManageUIPreferencesResponse['insights']
  ): Promise<UIPreferences> {
    if (!request.preferences) {
      throw new Error('Preferences updates required for update operation');
    }

    // 📥 LOAD CURRENT PREFERENCES
    const { preferences: current } = await this.loadPreferences(request.userId);
    
    // 🔄 MERGE UPDATES
    const updated: UIPreferences = {
      ...current,
      ...request.preferences,
      lastUpdated: Date.now(),
      version: '1.0.0'
    };

    // 🔍 VALIDATE MERGED PREFERENCES
    const validation = this.validatePreferences(updated, request.validationRules);
    if (!validation.isValid) {
      insights.compatibilityIssues.push(...validation.errors);
    }

    const finalPreferences = validation.migratedData || updated;

    // 💾 SAVE UPDATED PREFERENCES
    await this.repository.savePreferences(request.userId, finalPreferences);

    // 🔄 UPDATE CACHE
    this.preferencesCache.set(request.userId, {
      data: finalPreferences,
      timestamp: Date.now()
    });

    insights.syncStatus = 'synced';
    return finalPreferences;
  }

  private async resetPreferences(
    userId: string, 
    insights: ManageUIPreferencesResponse['insights']
  ): Promise<UIPreferences> {
    const defaultPreferences = this.createDefaultPreferences();
    
    // 🗑️ DELETE OLD PREFERENCES
    await this.repository.deletePreferences(userId);
    
    // 💾 SAVE DEFAULT PREFERENCES
    await this.repository.savePreferences(userId, defaultPreferences);

    // 🔄 CLEAR CACHE
    this.preferencesCache.delete(userId);

    insights.syncStatus = 'synced';
    insights.migrationNotes = ['Preferences reset to default values'];
    
    return defaultPreferences;
  }

  private async syncPreferences(
    request: ManageUIPreferencesRequest, 
    insights: ManageUIPreferencesResponse['insights']
  ): Promise<UIPreferences> {
    if (!request.deviceId) {
      throw new Error('Device ID required for sync operation');
    }

    // 🔄 ATTEMPT SYNC WITH REPOSITORY
    const syncedPreferences = await this.repository.syncPreferences(request.userId, request.deviceId);
    
    if (syncedPreferences) {
      // 🔄 UPDATE CACHE WITH SYNCED DATA
      this.preferencesCache.set(request.userId, {
        data: syncedPreferences,
        timestamp: Date.now()
      });
      
      insights.syncStatus = 'synced';
      return syncedPreferences;
    } else {
      // 📥 FALLBACK TO LOCAL LOAD
      const { preferences } = await this.loadPreferences(request.userId);
      insights.syncStatus = 'pending';
      insights.compatibilityIssues.push('Sync unavailable - using local preferences');
      return preferences;
    }
  }

  // =============================================================================
  // 🔍 VALIDATION & MIGRATION
  // =============================================================================

  private validatePreferences(
    preferences: Partial<UIPreferences>, 
    rules?: ManageUIPreferencesRequest['validationRules']
  ): UIValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let migratedData: UIPreferences | undefined;

    // 🔍 BASIC STRUCTURE VALIDATION
    if (!preferences.expandedSections && rules?.enforceDefaults) {
      errors.push('Missing expandedSections configuration');
    }

    if (typeof preferences.compactMode !== 'boolean' && rules?.enforceDefaults) {
      warnings.push('Invalid compactMode value - will default to false');
    }

    // 🔄 MIGRATION LOGIC
    if (rules?.migrateOldFormat) {
      migratedData = this.migrateOldFormat(preferences);
      if (migratedData) {
        warnings.push('Migrated preferences from older format');
      }
    }

    // 🎯 SECTION VALIDATION
    if (rules?.validateSections && preferences.expandedSections) {
      const validSections = ['completeness', 'enhancements', 'security', 'quickActions', 'permissions'];
      const sections = preferences.expandedSections as unknown as Record<string, boolean>;
      
      for (const section of Object.keys(sections)) {
        if (!validSections.includes(section)) {
          warnings.push(`Unknown section: ${section}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      migratedData
    };
  }

  private migrateOldFormat(preferences: Partial<UIPreferences>): UIPreferences | undefined {
    // 🔄 MIGRATION: Handle old format preferences
    const anyPrefs = preferences as any;
    
    if (anyPrefs.expandedState && !preferences.expandedSections) {
      // Migrate old expandedState to expandedSections
      return {
        ...this.createDefaultPreferences(),
        ...preferences,
        expandedSections: {
          completeness: anyPrefs.expandedState.completeness || false,
          enhancements: anyPrefs.expandedState.enhancements || false,
          security: anyPrefs.expandedState.security || false,
          quickActions: anyPrefs.expandedState.quickActions || false,
          permissions: anyPrefs.expandedState.permissions || false,
        }
      } as UIPreferences;
    }

    return undefined;
  }

  // =============================================================================
  // 🚀 OPTIMIZATION SUGGESTIONS
  // =============================================================================

  private generateOptimizationSuggestions(preferences: UIPreferences): string[] {
    const suggestions: string[] = [];

    // 📊 USAGE PATTERN ANALYSIS
    const expandedCount = Object.values(preferences.expandedSections).filter(Boolean).length;
    
    if (expandedCount === 0) {
      suggestions.push('Consider expanding key sections for better feature visibility');
    } else if (expandedCount >= 4) {
      suggestions.push('Many sections expanded - consider compact mode for better performance');
    }

    // 🎨 UI MODE RECOMMENDATIONS
    if (!preferences.compactMode && expandedCount >= 3) {
      suggestions.push('Enable compact mode to reduce screen clutter');
    }

    if (preferences.compactMode && !preferences.showAdvancedFeatures) {
      suggestions.push('Consider enabling advanced features for power user capabilities');
    }

    // 🔄 SYNC RECOMMENDATIONS
    if (!preferences.syncEnabled) {
      suggestions.push('Enable sync for seamless multi-device experience');
    }

    // ⚡ PERFORMANCE RECOMMENDATIONS
    const dataAge = Date.now() - preferences.lastUpdated;
    if (dataAge > 7 * 24 * 60 * 60 * 1000) { // 7 days
      suggestions.push('Preferences are old - consider updating for latest features');
    }

    return suggestions;
  }

  // =============================================================================
  // 🔧 HELPER METHODS
  // =============================================================================

  private createDefaultPreferences(): UIPreferences {
    return {
      expandedSections: {
        completeness: true,
        enhancements: false,
        security: false,
        quickActions: true,
        permissions: false,
      },
      compactMode: false,
      showAdvancedFeatures: false,
      lastUpdated: Date.now(),
      version: '1.0.0',
      syncEnabled: true,
      syncTimestamp: Date.now()
    };
  }

  private createDefaultInsights(): ManageUIPreferencesResponse['insights'] {
    return {
      optimizationSuggestions: [],
      compatibilityIssues: [],
      syncStatus: 'disabled'
    };
  }
}