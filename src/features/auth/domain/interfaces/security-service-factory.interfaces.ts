/**
 * @fileoverview DATA-INTERFACES-001: Security Service Factory Interfaces
 * @description Interfaces für die Optimized Security Service Factory.
 * Ausgelagert für bessere Modularität und Clean Architecture Compliance.
 * 
 * @businessRule BR-310: Interface separation for better modularity
 * @businessRule BR-311: Type safety through dedicated interface files
 * @businessRule BR-312: Clean Architecture interface organization
 * 
 * @architecture Separated interfaces for better dependency management
 * @architecture Type-safe factory configuration contracts
 * @architecture Modular interface design for extensibility
 * 
 * @since 1.0.0
 * @version 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module SecurityServiceFactoryInterfaces
 * @namespace Auth.Data.Interfaces
 */

import type { ILoggerService } from '../../../../core/logging/logger.service.interface';
import { Environment, type EnvironmentValue } from '../../../../core/config/environment.config.interface';
import type {
  DeviceFingerprint,
  ThreatAssessment,
  SecurityMetrics,
  SecurityEvent
} from '../../domain/interfaces/advanced-security.service.interface';

/**
 * @interface IAdvancedSecurityService
 * @description Properly typed Advanced Security Service Interface
 * 
 * Complete interface definition for the Advanced Security Service
 * with strict TypeScript typing and comprehensive method contracts.
 */
export interface IAdvancedSecurityService {
  /** Generate device fingerprint for security analysis */
  generateDeviceFingerprint(): Promise<DeviceFingerprint>;
  
  /** Get geolocation data for location-based security */
  getGeolocationData(): Promise<any>;
  
  /** Perform comprehensive threat assessment */
  performThreatAssessment(
    userId: string, 
    deviceFingerprint: DeviceFingerprint, 
    geolocation: any
  ): Promise<ThreatAssessment>;
  
  /** Monitor device changes for security violations */
  monitorDeviceChanges(userId: string, previousFingerprint?: string): Promise<void>;
  
  /** Monitor location changes for suspicious activity */
  monitorLocationChanges(userId: string, previousLocation?: any): Promise<void>;
  
  /** Log security events to monitoring system */
  logSecurityEvent(event: SecurityEvent): Promise<void>;
  
  /** Get comprehensive security metrics */
  getSecurityMetrics(): Promise<SecurityMetrics>;
  
  /** Detect anomalies in provided data */
  detectAnomalies(data: any): Promise<string[]>;
  
  /** Calculate risk score based on factors */
  calculateRiskScore(factors: any): Promise<number>;
  
  /** Assess security threats for given context */
  assessThreat(context: any): Promise<ThreatAssessment>;
  
  /** Monitor real-time security events */
  monitorSecurityEvents(callback: (event: any) => void): () => void;
}

/**
 * @interface EnhancedSecurityServiceConfig
 * @description Enhanced configuration with optimization features
 * 
 * Comprehensive configuration interface for all security service
 * features including performance optimizations and resource management.
 */
export interface EnhancedSecurityServiceConfig {
  /** Enable threat assessment functionality */
  enableThreatAssessment?: boolean;
  
  /** Enable device fingerprinting */
  enableDeviceFingerprinting?: boolean;
  
  /** Enable location monitoring */
  enableLocationMonitoring?: boolean;
  
  /** Risk assessment thresholds configuration */
  riskThresholds?: {
    /** Low risk threshold (0-100) */
    low: number;
    /** Medium risk threshold (0-100) */
    medium: number;
    /** High risk threshold (0-100) */
    high: number;
    /** Critical risk threshold (0-100) */
    critical: number;
  };
  
  /** Monitoring intervals configuration */
  monitoringIntervals?: {
    /** Device check interval (ms) */
    deviceCheck: number;
    /** Location check interval (ms) */
    locationCheck: number;
    /** Threat assessment interval (ms) */
    threatAssessment: number;
    /** Health check interval (ms) */
    healthCheck: number;
  };
  
  /** Enhanced cache configuration */
  cache?: {
    /** Enable caching */
    enabled: boolean;
    /** Time-to-live in milliseconds */
    ttl: number;
    /** Maximum cache size */
    maxSize: number;
    /** Cleanup interval in milliseconds */
    cleanupInterval: number;
  };
  
  /** Performance optimization configuration */
  performance?: {
    /** Enable performance metrics collection */
    enableMetrics: boolean;
    /** Enable circuit breaker pattern */
    enableCircuitBreaker: boolean;
    /** Circuit breaker failure threshold */
    circuitBreakerThreshold: number;
    /** Circuit breaker timeout (ms) */
    circuitBreakerTimeout: number;
    /** Enable lazy loading */
    enableLazyLoading: boolean;
  };
  
  /** Resource management configuration */
  resources?: {
    /** Enable automatic cleanup */
    enableAutoCleanup: boolean;
    /** Cleanup threshold percentage */
    cleanupThreshold: number;
    /** Memory limit in MB */
    memoryLimitMB: number;
  };
}

/**
 * @interface SecurityServiceDependencies
 * @description Enhanced dependencies with validation
 * 
 * Dependencies required for creating security service instances
 * with proper dependency injection support.
 */
export interface SecurityServiceDependencies {
  /** Logger service instance - required */
  logger: ILoggerService;
  
  /** Enhanced configuration object - required */
  config: EnhancedSecurityServiceConfig;
  
  /** Optional cache service implementation */
  cache?: any;
  
  /** Optional metrics service implementation */
  metrics?: any;
  
  /** Optional health check service implementation */
  healthCheck?: any;
}

/**
 * @interface CacheEntry
 * @description Cache entry with TTL and metadata
 * 
 * Internal cache entry structure with timing and access information
 * for intelligent cache management.
 */
export interface CacheEntry {
  /** Cached service instance */
  service: IAdvancedSecurityService;
  
  /** Creation timestamp */
  createdAt: number;
  
  /** Last access timestamp */
  lastAccessed: number;
  
  /** Access count for LRU calculation */
  accessCount: number;
  
  /** Configuration used for this instance */
  config: EnhancedSecurityServiceConfig;
}

/**
 * @interface FactoryMetrics
 * @description Factory performance metrics
 * 
 * Comprehensive metrics for monitoring factory performance
 * and optimization effectiveness.
 */
export interface FactoryMetrics {
  /** Total number of services created */
  totalCreated: number;
  
  /** Number of cache hits */
  cacheHits: number;
  
  /** Number of cache misses */
  cacheMisses: number;
  
  /** Total memory usage in MB */
  totalMemoryMB: number;
  
  /** Average service creation time in ms */
  averageCreationTime: number;
  
  /** Number of circuit breaker activations */
  circuitBreakerTrips: number;
  
  /** Last cleanup timestamp */
  lastCleanup: number;
}

/**
 * @interface CircuitBreakerState
 * @description Circuit breaker state management
 * 
 * Internal state for circuit breaker pattern implementation
 * to protect against cascading failures.
 */
export interface CircuitBreakerState {
  /** Whether circuit breaker is open */
  isOpen: boolean;
  
  /** Number of consecutive failures */
  failureCount: number;
  
  /** Timestamp of last failure */
  lastFailureTime: number;
  
  /** Next attempt timestamp when circuit is open */
  nextAttemptTime: number;
}

/**
 * @interface FactoryHealthStatus
 * @description Factory health status information
 * 
 * Health status metrics for monitoring factory operational state
 * and performance characteristics.
 */
export interface FactoryHealthStatus {
  /** Overall health status */
  healthy: boolean;
  
  /** Cache utilization percentage (0-100) */
  cacheUtilization: number;
  
  /** Whether circuit breaker is open */
  circuitBreakerOpen: boolean;
  
  /** Current memory usage in MB */
  memoryUsage: number;
  
  /** Factory uptime in milliseconds */
  uptime: number;
  
  /** Last health check timestamp */
  lastHealthCheck?: number;
  
  /** Health check details */
  details?: {
    /** Cache entry count */
    cacheEntries: number;
    /** Average creation time */
    avgCreationTime: number;
    /** Cache hit ratio */
    cacheHitRatio: number;
  };
}

/**
 * @interface FactoryCreateOptions
 * @description Options for factory service creation
 * 
 * Additional options that can be passed to factory methods
 * for customizing service creation behavior.
 */
export interface FactoryCreateOptions {
  /** Whether to enable caching for this instance */
  enableCaching?: boolean;
  
  /** Override cache key for this instance */
  cacheKey?: string;
  
  /** Force new instance creation */
  forceNew?: boolean;
  
  /** Additional metadata for this instance */
  metadata?: Record<string, any>;
  
  /** Timeout for service creation (ms) */
  creationTimeout?: number;
}

/**
 * @type SecurityServiceConfigPreset
 * @description Predefined configuration presets
 * 
 * Common configuration presets for different environments
 * and use cases.
 */
export type SecurityServiceConfigPreset = 
  | Environment.PRODUCTION
  | Environment.DEVELOPMENT 
  | Environment.TESTING
  | Environment.STAGING
  | 'performance' 
  | 'minimal';

/**
 * @interface ConfigPresetOptions
 * @description Options for configuration presets
 */
export interface ConfigPresetOptions {
  /** Base preset to extend */
  preset: SecurityServiceConfigPreset;
  
  /** Custom overrides for the preset */
  overrides?: Partial<EnhancedSecurityServiceConfig>;
  
  /** Environment-specific adjustments */
  environment?: Environment | EnvironmentValue;
} 