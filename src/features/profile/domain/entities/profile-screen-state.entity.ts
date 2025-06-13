/**
 * ProfileScreenState Entity - Enterprise Profile Screen State Management
 * 🚀 ENTERPRISE: Real-time View State, Performance Monitoring, UI State Management
 * ✅ DOMAIN LAYER: Business Rules für Profile Screen Behavior
 */

/**
 * @enum ViewMode - Different display modes for the profile screen
 */
export enum ProfileViewMode {
  STANDARD = 'standard',
  COMPACT = 'compact', 
  DETAILED = 'detailed',
  ACCESSIBILITY = 'accessibility',
  READ_ONLY = 'read_only',
  EDIT_MODE = 'edit_mode'
}

/**
 * @enum InteractionState - Current user interaction state
 */
export enum ProfileInteractionState {
  IDLE = 'idle',
  NAVIGATING = 'navigating',
  EDITING = 'editing',
  SHARING = 'sharing',
  AVATAR_UPLOAD = 'avatar_upload',
  SETTINGS = 'settings',
  SYNCING = 'syncing',
  ERROR_STATE = 'error_state'
}

/**
 * @interface PerformanceMetrics - Real-time performance monitoring
 */
export interface ProfileScreenPerformanceMetrics {
  readonly loadTime: number;
  readonly renderTime: number;
  readonly memoryUsage: number;
  readonly rerenderCount: number;
  readonly networkLatency: number;
  readonly cacheHitRatio: number;
  readonly frameRate: number;
}

/**
 * @interface UIStateData - Current UI state and preferences
 */
export interface ProfileScreenUIState {
  readonly scrollPosition: number;
  readonly selectedSection: string;
  readonly activeModal: string | null;
  readonly showCompletionBanner: boolean;
  readonly showErrorBanner: boolean;
  readonly themePreference: 'light' | 'dark' | 'auto';
  readonly orientation: 'portrait' | 'landscape';
  readonly lastStateChange: Date;
}

/**
 * @class ProfileScreenState - Enterprise Profile Screen State Management
 */
export class ProfileScreenState {
  private readonly _userId: string;
  private _viewMode: ProfileViewMode;
  private _interactionState: ProfileInteractionState;
  private _performanceMetrics: ProfileScreenPerformanceMetrics;
  private _uiState: ProfileScreenUIState;
  private readonly _createdAt: Date;
  private _lastUpdated: Date;

  constructor(config: {
    userId: string;
    viewMode?: ProfileViewMode;
    interactionState?: ProfileInteractionState;
  }) {
    this._userId = config.userId;
    this._viewMode = config.viewMode || ProfileViewMode.STANDARD;
    this._interactionState = config.interactionState || ProfileInteractionState.IDLE;
    this._createdAt = new Date();
    this._lastUpdated = new Date();

    this._performanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      rerenderCount: 0,
      networkLatency: 0,
      cacheHitRatio: 1.0,
      frameRate: 60
    };

    this._uiState = {
      scrollPosition: 0,
      selectedSection: 'main',
      activeModal: null,
      showCompletionBanner: true,
      showErrorBanner: false,
      themePreference: 'auto',
      orientation: 'portrait',
      lastStateChange: new Date()
    };
  }

  // Getters
  get userId(): string { return this._userId; }
  get viewMode(): ProfileViewMode { return this._viewMode; }
  get interactionState(): ProfileInteractionState { return this._interactionState; }
  get performanceMetrics(): ProfileScreenPerformanceMetrics { return { ...this._performanceMetrics }; }
  get uiState(): ProfileScreenUIState { return { ...this._uiState }; }
  get lastUpdated(): Date { return this._lastUpdated; }

  // Business Logic Methods
  updateViewMode(newMode: ProfileViewMode): boolean {
    if (this.canChangeViewMode(newMode)) {
      this._viewMode = newMode;
      this._lastUpdated = new Date();
      return true;
    }
    return false;
  }

  updateInteractionState(newState: ProfileInteractionState): void {
    this._interactionState = newState;
    this._lastUpdated = new Date();
    this._performanceMetrics = {
      ...this._performanceMetrics,
      rerenderCount: this._performanceMetrics.rerenderCount + 1
    };
  }

  updatePerformanceMetrics(metrics: Partial<ProfileScreenPerformanceMetrics>): void {
    this._performanceMetrics = { ...this._performanceMetrics, ...metrics };
    this._lastUpdated = new Date();
  }

  updateUIState(state: Partial<ProfileScreenUIState>): void {
    this._uiState = { ...this._uiState, ...state, lastStateChange: new Date() };
    this._lastUpdated = new Date();
  }

  // Validation
  private canChangeViewMode(newMode: ProfileViewMode): boolean {
    if (this._interactionState === ProfileInteractionState.EDITING && 
        newMode === ProfileViewMode.READ_ONLY) {
      return false;
    }
    return true;
  }

  // Utilities
  isActive(): boolean {
    return this._interactionState !== ProfileInteractionState.IDLE;
  }

  getPerformanceScore(): number {
    const { loadTime, renderTime, cacheHitRatio, frameRate } = this._performanceMetrics;
    let score = 100;
    if (loadTime > 2000) score -= 20;
    if (renderTime > 100) score -= 15;
    if (cacheHitRatio < 0.8) score -= 15;
    if (frameRate < 30) score -= 20;
    return Math.max(0, score);
  }

  toJSON(): Record<string, any> {
    return {
      userId: this._userId,
      viewMode: this._viewMode,
      interactionState: this._interactionState,
      performanceMetrics: this._performanceMetrics,
      uiState: this._uiState,
      createdAt: this._createdAt.toISOString(),
      lastUpdated: this._lastUpdated.toISOString()
    };
  }
}

export const createProfileScreenState = (config: {
  userId: string;
  viewMode?: ProfileViewMode;
  interactionState?: ProfileInteractionState;
}): ProfileScreenState => {
  return new ProfileScreenState(config);
}; 