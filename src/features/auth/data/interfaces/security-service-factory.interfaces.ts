/**
 * Security Service Factory Interfaces
 * Type definitions for security service configuration and factory
 */

export interface SecurityServiceConfig {
  encryption: {
    algorithm: string;
    keyLength: number;
  };
  mfa: {
    enabled: boolean;
    methods: string[];
    backupCodes: number;
  };
  session: {
    timeout: number;
    maxConcurrent: number;
  };
  biometric: {
    enabled: boolean;
    fallbackToPin: boolean;
  };
}

export interface EnhancedSecurityServiceConfig extends SecurityServiceConfig {
  advancedThreats: {
    enabled: boolean;
    ml: {
      enabled: boolean;
      models: string[];
    };
  };
  audit: {
    enabled: boolean;
    retention: number;
  };
  compliance: {
    gdpr: boolean;
    hipaa: boolean;
    sox: boolean;
  };
  
  // Additional properties used in factories
  enableThreatAssessment?: boolean;
  enableDeviceFingerprinting?: boolean;
  enableLocationMonitoring?: boolean;
  
  riskThresholds?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  
  monitoringIntervals?: {
    deviceCheck: number;
    locationCheck: number;
    threatAssessment: number;
    healthCheck: number;
  };
  
  cache?: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
    cleanupInterval: number;
  };
  
  performance?: {
    enableMetrics: boolean;
    enableCircuitBreaker: boolean;
    circuitBreakerThreshold: number;
    circuitBreakerTimeout: number;
    enableLazyLoading: boolean;
  };
  
  resources?: {
    enableAutoCleanup: boolean;
    cleanupThreshold: number;
    memoryLimitMB: number;
  };
}

export interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeSessions: number;
  suspiciousActivities: number;
  lastSecurityScan: Date;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface SecurityServiceFactory {
  createSecurityService(config: SecurityServiceConfig): any;
  createEnhancedSecurityService(config: EnhancedSecurityServiceConfig): any;
  getSecurityMetrics(): Promise<SecurityMetrics>;
}

// Additional interfaces used by security factory
export interface IAdvancedSecurityService {
  assessThreat(request: any): Promise<any>;
  generateDeviceFingerprint(): Promise<any>;
  getGeolocationData?(): Promise<any>;
  performThreatAssessment?(userId: string, deviceFingerprint: any, geolocation: any): Promise<any>;
  monitorSecurityEvents?(callback: (event: any) => void): () => void;
  logSecurityEvent?(event: any): Promise<void>;
  getSecurityMetrics?(): Promise<any>;
  detectAnomalies?(data: any): Promise<string[]>;
  calculateRiskScore?(factors: any): Promise<number>;
}

export interface SecurityServiceDependencies {
  config: EnhancedSecurityServiceConfig;
  logger?: any;
  metrics?: any;
  cache?: any;
  healthCheck?: any;
}

export interface CacheEntry {
  service: IAdvancedSecurityService;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  config: EnhancedSecurityServiceConfig;
}

export interface FactoryMetrics {
  totalCreated: number;
  cacheHits: number;
  cacheMisses: number;
  totalMemoryMB: number;
  averageCreationTime: number;
  circuitBreakerTrips: number;
  lastCleanup: number;
}

export interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

export interface FactoryHealthStatus {
  healthy: boolean;
  status?: 'healthy' | 'degraded' | 'unhealthy';
  cacheUtilization: number;
  circuitBreakerOpen: boolean;
  memoryUsage: number;
  uptime: number;
  lastHealthCheck: number;
  details: {
    cacheEntries: number;
    avgCreationTime: number;
    cacheHitRatio: number;
  };
  checks?: Array<{
    name: string;
    status: 'pass' | 'fail';
    details?: string;
  }>;
  metrics?: FactoryMetrics;
}

export interface FactoryCreateOptions {
  enableCaching?: boolean;
  validateConfig?: boolean;
  useCircuitBreaker?: boolean;
  timeout?: number;
}

export interface SecurityServiceConfigPreset {
  name: string;
  description: string;
  config: Partial<EnhancedSecurityServiceConfig>;
}

export interface ConfigPresetOptions {
  includePerformance?: boolean;
  includeAdvancedFeatures?: boolean;
  targetEnvironment?: 'development' | 'staging' | 'production';
} 