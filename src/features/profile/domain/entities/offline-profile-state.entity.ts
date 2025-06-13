/**
 * OfflineProfileState Entity - Enterprise Offline & Sync Management
 * 🚀 ENTERPRISE: Offline-first Profile Management, Conflict Resolution, Queue Systems
 * ✅ DOMAIN LAYER: Business Logic für Offline Profile Operations
 */

/**
 * @enum SyncStatus - Current synchronization status
 */
export enum ProfileSyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  SYNCING = 'syncing',
  CONFLICTED = 'conflicted',
  FAILED = 'failed',
  OFFLINE = 'offline'
}

/**
 * @enum ConflictResolutionStrategy - How to handle sync conflicts
 */
export enum ConflictResolutionStrategy {
  CLIENT_WINS = 'client_wins',
  SERVER_WINS = 'server_wins',
  MERGE = 'merge',
  MANUAL = 'manual',
  LAST_MODIFIED_WINS = 'last_modified_wins'
}

/**
 * @enum OperationType - Types of offline operations
 */
export enum OfflineOperationType {
  UPDATE_PROFILE = 'update_profile',
  UPLOAD_AVATAR = 'upload_avatar',
  DELETE_AVATAR = 'delete_avatar',
  UPDATE_CUSTOM_FIELDS = 'update_custom_fields',
  UPDATE_PRIVACY_SETTINGS = 'update_privacy_settings',
  SHARE_PROFILE = 'share_profile',
  EXPORT_PROFILE = 'export_profile'
}

/**
 * @interface QueuedOperation - Operation waiting to be synced
 */
export interface QueuedProfileOperation {
  readonly id: string;
  readonly type: OfflineOperationType;
  readonly payload: Record<string, any>;
  readonly timestamp: Date;
  readonly retryCount: number;
  readonly maxRetries: number;
  readonly priority: number; // 1-10, 10 = highest
  readonly userInitiated: boolean;
  readonly estimatedSyncTime: number; // milliseconds
}

/**
 * @interface SyncConflict - Data conflict between client and server
 */
export interface ProfileSyncConflict {
  readonly id: string;
  readonly fieldName: string;
  readonly clientValue: any;
  readonly serverValue: any;
  readonly clientTimestamp: Date;
  readonly serverTimestamp: Date;
  readonly resolutionStrategy: ConflictResolutionStrategy;
  readonly resolved: boolean;
  readonly resolvedValue?: any;
  readonly resolvedBy?: string;
  readonly resolvedAt?: Date;
}

/**
 * @interface CacheMetadata - Cache status and metadata
 */
export interface ProfileCacheMetadata {
  lastFullSync: Date;
  lastPartialSync: Date;
  readonly cacheSize: number; // bytes
  readonly cachedFields: string[];
  readonly expirationTimes: Record<string, Date>;
  readonly staleTolerance: number; // seconds
  readonly compressionEnabled: boolean;
  readonly encryptionEnabled: boolean;
}

/**
 * @interface NetworkState - Current network and connectivity state
 */
export interface NetworkConnectionState {
  readonly isOnline: boolean;
  readonly connectionType: 'wifi' | 'cellular' | 'none';
  readonly connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  readonly bandwidth: number; // kbps
  readonly latency: number; // milliseconds
  readonly lastConnectedAt: Date;
  readonly dataUsageOptimized: boolean;
  readonly backgroundSyncAllowed: boolean;
}

/**
 * @interface SyncMetrics - Performance metrics for sync operations
 */
export interface ProfileSyncMetrics {
  totalSyncCount: number;
  successfulSyncCount: number;
  failedSyncCount: number;
  averageSyncTime: number;
  dataTransferred: number; // bytes
  lastSyncDuration: number;
  conflictCount: number;
  autoResolvedConflicts: number;
  manualResolvedConflicts: number;
}

/**
 * @class OfflineProfileState - Enterprise Offline & Sync Management
 */
export class OfflineProfileState {
  private readonly _userId: string;
  private _syncStatus: ProfileSyncStatus;
  private _queuedOperations: QueuedProfileOperation[];
  private _conflicts: ProfileSyncConflict[];
  private _cacheMetadata: ProfileCacheMetadata;
  private _networkState: NetworkConnectionState;
  private _syncMetrics: ProfileSyncMetrics;
  private _resolutionStrategy: ConflictResolutionStrategy;
  private readonly _createdAt: Date;
  private _lastUpdated: Date;

  constructor(config: {
    userId: string;
    resolutionStrategy?: ConflictResolutionStrategy;
  }) {
    this._userId = config.userId;
    this._syncStatus = ProfileSyncStatus.SYNCED;
    this._resolutionStrategy = config.resolutionStrategy || ConflictResolutionStrategy.LAST_MODIFIED_WINS;
    this._createdAt = new Date();
    this._lastUpdated = new Date();
    this._queuedOperations = [];
    this._conflicts = [];

    // Initialize cache metadata
    this._cacheMetadata = {
      lastFullSync: new Date(),
      lastPartialSync: new Date(),
      cacheSize: 0,
      cachedFields: [],
      expirationTimes: {},
      staleTolerance: 300, // 5 minutes
      compressionEnabled: true,
      encryptionEnabled: true
    };

    // Initialize network state
    this._networkState = {
      isOnline: navigator.onLine,
      connectionType: 'wifi',
      connectionQuality: 'excellent',
      bandwidth: 1000,
      latency: 50,
      lastConnectedAt: new Date(),
      dataUsageOptimized: false,
      backgroundSyncAllowed: true
    };

    // Initialize sync metrics
    this._syncMetrics = {
      totalSyncCount: 0,
      successfulSyncCount: 0,
      failedSyncCount: 0,
      averageSyncTime: 0,
      dataTransferred: 0,
      lastSyncDuration: 0,
      conflictCount: 0,
      autoResolvedConflicts: 0,
      manualResolvedConflicts: 0
    };
  }

  // Getters
  get userId(): string { return this._userId; }
  get syncStatus(): ProfileSyncStatus { return this._syncStatus; }
  get queuedOperations(): QueuedProfileOperation[] { return [...this._queuedOperations]; }
  get conflicts(): ProfileSyncConflict[] { return [...this._conflicts]; }
  get cacheMetadata(): ProfileCacheMetadata { return { ...this._cacheMetadata }; }
  get networkState(): NetworkConnectionState { return { ...this._networkState }; }
  get syncMetrics(): ProfileSyncMetrics { return { ...this._syncMetrics }; }
  get resolutionStrategy(): ConflictResolutionStrategy { return this._resolutionStrategy; }
  get lastUpdated(): Date { return this._lastUpdated; }

  // Queue Management Methods
  queueOperation(operation: Omit<QueuedProfileOperation, 'id' | 'timestamp' | 'retryCount'>): void {
    const queuedOp: QueuedProfileOperation = {
      ...operation,
      id: this.generateOperationId(),
      timestamp: new Date(),
      retryCount: 0
    };

    // Insert based on priority
    const insertIndex = this._queuedOperations.findIndex(op => op.priority < queuedOp.priority);
    if (insertIndex === -1) {
      this._queuedOperations.push(queuedOp);
    } else {
      this._queuedOperations.splice(insertIndex, 0, queuedOp);
    }

    this._syncStatus = ProfileSyncStatus.PENDING;
    this._lastUpdated = new Date();
  }

  removeOperation(operationId: string): boolean {
    const index = this._queuedOperations.findIndex(op => op.id === operationId);
    if (index !== -1) {
      this._queuedOperations.splice(index, 1);
      this._lastUpdated = new Date();
      return true;
    }
    return false;
  }

  retryOperation(operationId: string): boolean {
    const operation = this._queuedOperations.find(op => op.id === operationId);
    if (operation && operation.retryCount < operation.maxRetries) {
      const updatedOp = { ...operation, retryCount: operation.retryCount + 1 };
      this.removeOperation(operationId);
      this._queuedOperations.unshift(updatedOp); // Move to front for immediate retry
      this._lastUpdated = new Date();
      return true;
    }
    return false;
  }

  // Conflict Resolution Methods
  addConflict(conflict: Omit<ProfileSyncConflict, 'id' | 'resolved'>): void {
    const newConflict: ProfileSyncConflict = {
      ...conflict,
      id: this.generateConflictId(),
      resolved: false
    };
    
    this._conflicts.push(newConflict);
    this._syncStatus = ProfileSyncStatus.CONFLICTED;
    this._syncMetrics.conflictCount++;
    this._lastUpdated = new Date();
  }

  resolveConflict(conflictId: string, resolution: {
    resolvedValue: any;
    resolvedBy?: string;
  }): boolean {
    const conflictIndex = this._conflicts.findIndex(c => c.id === conflictId);
    if (conflictIndex !== -1) {
      this._conflicts[conflictIndex] = {
        ...this._conflicts[conflictIndex],
        resolved: true,
        resolvedValue: resolution.resolvedValue,
        resolvedBy: resolution.resolvedBy || 'system',
        resolvedAt: new Date()
      };

      // Check if all conflicts are resolved
      const hasUnresolvedConflicts = this._conflicts.some(c => !c.resolved);
      if (!hasUnresolvedConflicts && this._syncStatus === ProfileSyncStatus.CONFLICTED) {
        this._syncStatus = ProfileSyncStatus.PENDING;
      }

      this._syncMetrics.manualResolvedConflicts++;
      this._lastUpdated = new Date();
      return true;
    }
    return false;
  }

  autoResolveConflicts(): number {
    let resolvedCount = 0;
    
    this._conflicts.forEach(conflict => {
      if (!conflict.resolved) {
        let resolvedValue: any;
        
        switch (this._resolutionStrategy) {
          case ConflictResolutionStrategy.CLIENT_WINS:
            resolvedValue = conflict.clientValue;
            break;
          case ConflictResolutionStrategy.SERVER_WINS:
            resolvedValue = conflict.serverValue;
            break;
          case ConflictResolutionStrategy.LAST_MODIFIED_WINS:
            resolvedValue = conflict.clientTimestamp > conflict.serverTimestamp 
              ? conflict.clientValue 
              : conflict.serverValue;
            break;
          case ConflictResolutionStrategy.MERGE:
            resolvedValue = this.mergeValues(conflict.clientValue, conflict.serverValue);
            break;
          default:
            return; // Manual resolution required
        }

        this.resolveConflict(conflict.id, { 
          resolvedValue, 
          resolvedBy: 'auto-resolver' 
        });
        resolvedCount++;
      }
    });

    this._syncMetrics.autoResolvedConflicts += resolvedCount;
    return resolvedCount;
  }

  // Sync Status Methods
  updateSyncStatus(status: ProfileSyncStatus): void {
    this._syncStatus = status;
    this._lastUpdated = new Date();

    if (status === ProfileSyncStatus.SYNCING) {
      this._syncMetrics.totalSyncCount++;
    }
  }

  markSyncComplete(successful: boolean, duration: number, dataTransferred: number): void {
    if (successful) {
      this._syncStatus = ProfileSyncStatus.SYNCED;
      this._syncMetrics.successfulSyncCount++;
      this._cacheMetadata.lastFullSync = new Date();
    } else {
      this._syncStatus = ProfileSyncStatus.FAILED;
      this._syncMetrics.failedSyncCount++;
    }

    // Update metrics
    this._syncMetrics.lastSyncDuration = duration;
    this._syncMetrics.dataTransferred += dataTransferred;
    this._syncMetrics.averageSyncTime = 
      (this._syncMetrics.averageSyncTime * (this._syncMetrics.totalSyncCount - 1) + duration) / 
      this._syncMetrics.totalSyncCount;

    this._lastUpdated = new Date();
  }

  // Network State Methods
  updateNetworkState(state: Partial<NetworkConnectionState>): void {
    this._networkState = { ...this._networkState, ...state };
    
    if (state.isOnline !== undefined) {
      if (state.isOnline && !this._networkState.isOnline) {
        // Just came online - trigger sync if needed
        if (this._queuedOperations.length > 0) {
          this._syncStatus = ProfileSyncStatus.PENDING;
        }
      } else if (!state.isOnline) {
        this._syncStatus = ProfileSyncStatus.OFFLINE;
      }
    }

    this._lastUpdated = new Date();
  }

  // Cache Management Methods
  updateCacheMetadata(metadata: Partial<ProfileCacheMetadata>): void {
    this._cacheMetadata = { ...this._cacheMetadata, ...metadata };
    this._lastUpdated = new Date();
  }

  isCacheStale(fieldName?: string): boolean {
    if (fieldName && this._cacheMetadata.expirationTimes[fieldName]) {
      return new Date() > this._cacheMetadata.expirationTimes[fieldName];
    }
    
    const timeSinceLastSync = Date.now() - this._cacheMetadata.lastPartialSync.getTime();
    return timeSinceLastSync > (this._cacheMetadata.staleTolerance * 1000);
  }

  // Utility Methods
  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConflictId(): string {
    return `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private mergeValues(clientValue: any, serverValue: any): any {
    // Simple merge strategy - can be enhanced based on data type
    if (typeof clientValue === 'object' && typeof serverValue === 'object') {
      return { ...serverValue, ...clientValue };
    }
    return clientValue; // Default to client value
  }

  // Status Check Methods
  canSync(): boolean {
    return this._networkState.isOnline && 
           this._syncStatus !== ProfileSyncStatus.SYNCING &&
           (this._queuedOperations.length > 0 || this.isCacheStale());
  }

  hasUnresolvedConflicts(): boolean {
    return this._conflicts.some(conflict => !conflict.resolved);
  }

  getPendingOperationsCount(): number {
    return this._queuedOperations.length;
  }

  getEstimatedSyncTime(): number {
    return this._queuedOperations.reduce((total, op) => total + op.estimatedSyncTime, 0);
  }

  getSyncHealthScore(): number {
    const successRate = this._syncMetrics.successfulSyncCount / Math.max(this._syncMetrics.totalSyncCount, 1);
    const conflictRate = this._syncMetrics.conflictCount / Math.max(this._syncMetrics.totalSyncCount, 1);
    const queueHealth = Math.max(0, 1 - (this._queuedOperations.length / 10));
    
    return Math.round((successRate * 0.5 + (1 - conflictRate) * 0.3 + queueHealth * 0.2) * 100);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      userId: this._userId,
      syncStatus: this._syncStatus,
      queuedOperations: this._queuedOperations,
      conflicts: this._conflicts,
      cacheMetadata: this._cacheMetadata,
      networkState: this._networkState,
      syncMetrics: this._syncMetrics,
      resolutionStrategy: this._resolutionStrategy,
      createdAt: this._createdAt.toISOString(),
      lastUpdated: this._lastUpdated.toISOString()
    };
  }
}

export const createOfflineProfileState = (config: {
  userId: string;
  resolutionStrategy?: ConflictResolutionStrategy;
}): OfflineProfileState => {
  return new OfflineProfileState(config);
}; 