/**
 * Profile Security Service - Enterprise Security for Profile Feature
 * Provides comprehensive security features including rate limiting, input validation,
 * CSRF protection, and security monitoring specifically for Profile operations
 * 
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Profile.Data.Services
 * @namespace Profile.Data.Services.Security
 * @category Security
 * @subcategory ProfileSecurity
 */

import { ILoggerService, LogCategory, LogContext } from '../../../../core/logging/logger.service.interface';
import { ConsoleLogger } from '../../../../core/logging/console.logger';

// Security Types
export interface RateLimitEntry {
  userId: string;
  operation: ProfileSecurityOperation;
  attempts: number;
  windowStart: Date;
  lastAttempt: Date;
  blocked: boolean;
}

export type ProfileSecurityOperation = 
  | 'profile_read' 
  | 'profile_update' 
  | 'profile_delete' 
  | 'avatar_upload' 
  | 'avatar_delete' 
  | 'privacy_update'
  | 'data_export';

export interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  riskScore: number;
  blockedReasons: string[];
  sanitizedData?: any;
}

export interface RateLimitConfig {
  windowMinutes: number;
  maxAttempts: number;
  blockDurationMinutes: number;
}

export interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  suspiciousActivity: number;
  validationFailures: number;
  rateLimitViolations: number;
  lastUpdated: Date;
}

/**
 * Profile Security Service
 * 
 * Provides enterprise-grade security features for Profile operations:
 * - Rate limiting per user and operation type
 * - Input validation and sanitization
 * - CSRF token validation
 * - Security monitoring and alerting
 * - Risk assessment and threat detection
 * - Security audit logging
 */
export class ProfileSecurityService {
  private logger: ILoggerService;
  private rateLimitStore: Map<string, RateLimitEntry> = new Map();
  private securityMetrics: SecurityMetrics;
  private readonly cleanupInterval: NodeJS.Timeout;

  // Rate limit configurations per operation
  private readonly rateLimitConfigs: Record<ProfileSecurityOperation, RateLimitConfig> = {
    profile_read: { windowMinutes: 5, maxAttempts: 100, blockDurationMinutes: 5 },
    profile_update: { windowMinutes: 10, maxAttempts: 10, blockDurationMinutes: 15 },
    profile_delete: { windowMinutes: 60, maxAttempts: 2, blockDurationMinutes: 60 },
    avatar_upload: { windowMinutes: 15, maxAttempts: 5, blockDurationMinutes: 30 },
    avatar_delete: { windowMinutes: 30, maxAttempts: 3, blockDurationMinutes: 30 },
    privacy_update: { windowMinutes: 30, maxAttempts: 5, blockDurationMinutes: 30 },
    data_export: { windowMinutes: 60, maxAttempts: 2, blockDurationMinutes: 120 },
  };

  constructor(logger?: ILoggerService) {
    this.logger = logger || new ConsoleLogger();
    this.securityMetrics = {
      totalRequests: 0,
      blockedRequests: 0,
      suspiciousActivity: 0,
      validationFailures: 0,
      rateLimitViolations: 0,
      lastUpdated: new Date(),
    };

    // Cleanup expired rate limit entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredRateLimits();
    }, 5 * 60 * 1000);
  }

  // =============================================
  // RATE LIMITING
  // =============================================

  /**
   * Check if operation is allowed under rate limiting rules
   */
  async checkRateLimit(
    userId: string, 
    operation: ProfileSecurityOperation,
    correlationId?: string
  ): Promise<{ allowed: boolean; remainingAttempts: number; resetTime?: Date }> {
    const config = this.rateLimitConfigs[operation];
    const key = `${userId}:${operation}`;
    const now = new Date();
    
    let entry = this.rateLimitStore.get(key);

    // Check if user is currently blocked
    if (entry?.blocked) {
      const blockExpiry = new Date(entry.lastAttempt.getTime() + (config.blockDurationMinutes * 60 * 1000));
      if (now < blockExpiry) {
        this.securityMetrics.rateLimitViolations++;
        this.logSecurityEvent('rate_limit_blocked', userId, operation, correlationId, {
          remainingBlockTime: blockExpiry.getTime() - now.getTime(),
          attempts: entry.attempts
        });
        return { allowed: false, remainingAttempts: 0, resetTime: blockExpiry };
      } else {
        // Block period expired, reset entry
        entry = undefined;
        this.rateLimitStore.delete(key);
      }
    }

    // Initialize or update entry
    if (!entry || (now.getTime() - entry.windowStart.getTime()) > (config.windowMinutes * 60 * 1000)) {
      entry = {
        userId,
        operation,
        attempts: 1,
        windowStart: now,
        lastAttempt: now,
        blocked: false,
      };
    } else {
      entry.attempts++;
      entry.lastAttempt = now;
    }

    // Check if rate limit exceeded
    if (entry.attempts > config.maxAttempts) {
      entry.blocked = true;
      this.securityMetrics.rateLimitViolations++;
      this.logSecurityEvent('rate_limit_exceeded', userId, operation, correlationId, {
        attempts: entry.attempts,
        maxAttempts: config.maxAttempts,
        windowMinutes: config.windowMinutes
      });
      
      this.rateLimitStore.set(key, entry);
      return { 
        allowed: false, 
        remainingAttempts: 0, 
        resetTime: new Date(now.getTime() + (config.blockDurationMinutes * 60 * 1000))
      };
    }

    this.rateLimitStore.set(key, entry);
    const remainingAttempts = config.maxAttempts - entry.attempts;
    
    return { allowed: true, remainingAttempts };
  }

  // =============================================
  // INPUT VALIDATION & SANITIZATION
  // =============================================

  /**
   * Validate and sanitize profile data input
   */
  async validateProfileInput(
    data: any, 
    operation: ProfileSecurityOperation,
    correlationId?: string
  ): Promise<SecurityValidationResult> {
    const errors: string[] = [];
    let riskScore = 0;
    const blockedReasons: string[] = [];

    try {
      // Check for null/undefined
      if (!data || typeof data !== 'object') {
        errors.push('Invalid input data format');
        riskScore += 30;
      }

      // XSS Protection - check for script tags and malicious patterns
      const dangerousPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
        /eval\s*\(/gi,
        /document\.cookie/gi,
      ];

      const stringifiedData = JSON.stringify(data);
      for (const pattern of dangerousPatterns) {
        if (pattern.test(stringifiedData)) {
          errors.push('Potentially malicious content detected');
          riskScore += 50;
          blockedReasons.push('XSS_PATTERN_DETECTED');
          break;
        }
      }

      // SQL Injection Protection
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi,
        /(\b(UNION|WHERE|ORDER BY|GROUP BY)\b)/gi,
        /(--|#|\/\*|\*\/)/g,
        /(\b(OR|AND)\b.*=.*)/gi,
      ];

      for (const pattern of sqlPatterns) {
        if (pattern.test(stringifiedData)) {
          errors.push('SQL injection attempt detected');
          riskScore += 70;
          blockedReasons.push('SQL_INJECTION_DETECTED');
          break;
        }
      }

      // Email validation for profile updates
      if (data.email && typeof data.email === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          errors.push('Invalid email format');
          riskScore += 10;
        }
      }

      // Phone number validation
      if (data.phone && typeof data.phone === 'string') {
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.phone.replace(/[\s\-()]/g, ''))) {
          errors.push('Invalid phone number format');
          riskScore += 10;
        }
      }

      // URL validation for avatar, website, etc.
      if (data.avatar || data.website) {
        const url = data.avatar || data.website;
        if (typeof url === 'string' && url.length > 0) {
          try {
            new URL(url);
            // Check for suspicious domains
            const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'goo.gl'];
            const domain = new URL(url).hostname;
            if (suspiciousDomains.some(suspicious => domain.includes(suspicious))) {
              riskScore += 20;
              errors.push('Suspicious URL domain detected');
            }
          } catch {
            errors.push('Invalid URL format');
            riskScore += 15;
          }
        }
      }

      // File size validation for avatar uploads
      if (operation === 'avatar_upload' && data.size) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (data.size > maxSize) {
          errors.push('File size exceeds maximum allowed limit');
          riskScore += 25;
        }
      }

      // Sanitize data
      const sanitizedData = this.sanitizeInput(data);

      this.securityMetrics.totalRequests++;
      if (errors.length > 0) {
        this.securityMetrics.validationFailures++;
      }
      if (riskScore >= 50) {
        this.securityMetrics.suspiciousActivity++;
      }

      const isValid = errors.length === 0 && riskScore < 50;
      
      if (!isValid) {
        this.logSecurityEvent('validation_failed', 'unknown', operation, correlationId, {
          errors,
          riskScore,
          blockedReasons
        });
      }

      return {
        isValid,
        errors,
        riskScore,
        blockedReasons,
        sanitizedData,
      };

    } catch (error) {
      this.logger.error('Security validation error', LogCategory.SECURITY, {
        correlationId,
        metadata: { operation, error: error instanceof Error ? error.message : 'Unknown error' }
      });

      return {
        isValid: false,
        errors: ['Security validation system error'],
        riskScore: 100,
        blockedReasons: ['VALIDATION_SYSTEM_ERROR'],
      };
    }
  }

  // =============================================
  // CSRF PROTECTION
  // =============================================

  /**
   * Generate CSRF token for profile operations
   */
  generateCSRFToken(userId: string, operation: ProfileSecurityOperation): string {
    const timestamp = Date.now();
    const data = `${userId}:${operation}:${timestamp}`;
    return Buffer.from(data).toString('base64');
  }

  /**
   * Validate CSRF token
   */
  validateCSRFToken(
    token: string, 
    userId: string, 
    operation: ProfileSecurityOperation,
    maxAgeMinutes: number = 30
  ): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const [tokenUserId, tokenOperation, timestamp] = decoded.split(':');
      
      if (tokenUserId !== userId || tokenOperation !== operation) {
        return false;
      }

      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = maxAgeMinutes * 60 * 1000;
      
      return tokenAge <= maxAge;
    } catch {
      return false;
    }
  }

  // =============================================
  // SECURITY MONITORING
  // =============================================

  /**
   * Get current security metrics
   */
  getSecurityMetrics(): SecurityMetrics {
    return {
      ...this.securityMetrics,
      lastUpdated: new Date(),
    };
  }

  /**
   * Reset security metrics
   */
  resetSecurityMetrics(): void {
    this.securityMetrics = {
      totalRequests: 0,
      blockedRequests: 0,
      suspiciousActivity: 0,
      validationFailures: 0,
      rateLimitViolations: 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get rate limit status for user
   */
  getRateLimitStatus(userId: string): Array<{
    operation: ProfileSecurityOperation;
    attempts: number;
    maxAttempts: number;
    blocked: boolean;
    resetTime?: Date;
  }> {
    const status: Array<{
      operation: ProfileSecurityOperation;
      attempts: number;
      maxAttempts: number;
      blocked: boolean;
      resetTime?: Date;
    }> = [];

    for (const [_key, entry] of this.rateLimitStore.entries()) {
      if (entry.userId === userId) {
        const config = this.rateLimitConfigs[entry.operation];
        let resetTime: Date | undefined;
        
        if (entry.blocked) {
          resetTime = new Date(entry.lastAttempt.getTime() + (config.blockDurationMinutes * 60 * 1000));
        }

        status.push({
          operation: entry.operation,
          attempts: entry.attempts,
          maxAttempts: config.maxAttempts,
          blocked: entry.blocked,
          resetTime,
        });
      }
    }

    return status;
  }

  // =============================================
  // PRIVATE HELPER METHODS
  // =============================================

  /**
   * Sanitize input data
   */
  private sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      return data
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeInput(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Log security events
   */
  private logSecurityEvent(
    event: string,
    userId: string,
    operation: ProfileSecurityOperation,
    correlationId?: string,
    metadata: any = {}
  ): void {
    const context: LogContext = {
      correlationId: correlationId || `security-${Date.now()}`,
      userId,
      metadata: {
        securityEvent: event,
        operation,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };

    this.logger.logSecurity(`Profile security event: ${event}`, {
      eventType: event,
      riskLevel: metadata.riskScore >= 70 ? 'high' : metadata.riskScore >= 40 ? 'medium' : 'low',
      actionTaken: metadata.blocked ? 'request_blocked' : 'request_monitored'
    }, context);
  }

  /**
   * Cleanup expired rate limit entries
   */
  private cleanupExpiredRateLimits(): void {
    const now = new Date();
    let removedCount = 0;

    for (const [key, entry] of this.rateLimitStore.entries()) {
      const config = this.rateLimitConfigs[entry.operation];
      const windowExpiry = new Date(entry.windowStart.getTime() + (config.windowMinutes * 60 * 1000));
      const blockExpiry = entry.blocked 
        ? new Date(entry.lastAttempt.getTime() + (config.blockDurationMinutes * 60 * 1000))
        : windowExpiry;

      if (now > windowExpiry && now > blockExpiry) {
        this.rateLimitStore.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.logger.debug(`Cleaned up ${removedCount} expired rate limit entries`, LogCategory.PERFORMANCE, {
        metadata: { 
          cleanupOperation: 'rate_limit_cleanup',
          removedEntries: removedCount,
          remainingEntries: this.rateLimitStore.size
        }
      });
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.rateLimitStore.clear();
  }
}

// Export singleton instance
export const profileSecurityService = new ProfileSecurityService(); 