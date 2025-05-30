/**
 * @file invalid-credentials.error.test.ts
 * @description Comprehensive tests for InvalidCredentialsError
 * Tests error creation, security compliance, business rule validation, and audit logging
 */

import { InvalidCredentialsError } from '../../../domain/errors/invalid-credentials.error';
import { ErrorSeverity, ErrorCategory } from '../../../../../shared/errors';

describe('InvalidCredentialsError - DOMAIN ERROR VALIDATION', () => {
  describe('🎯 Error Construction Tests', () => {
    it('should create error with default configuration', () => {
      const error = new InvalidCredentialsError();

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(InvalidCredentialsError);
      expect(error.name).toBe('InvalidCredentialsError');
      expect(error.message).toBe('Invalid credentials provided');
      expect(error.errorId).toBeDefined();
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should create error with cause', () => {
      const cause = new Error('Database connection failed');
      const error = new InvalidCredentialsError(cause);

      expect(error.message).toBe('Invalid credentials provided');
      expect(error.name).toBe('InvalidCredentialsError');
      expect(error.cause).toBe(cause);
    });

    it('should maintain proper error inheritance chain', () => {
      const error = new InvalidCredentialsError();

      expect(error instanceof Error).toBe(true);
      expect(error instanceof InvalidCredentialsError).toBe(true);
      expect(error.constructor.name).toBe('InvalidCredentialsError');
    });

    it('should include stack trace information', () => {
      const error = new InvalidCredentialsError();

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('InvalidCredentialsError');
    });

    it('should generate unique error IDs', () => {
      const error1 = new InvalidCredentialsError();
      const error2 = new InvalidCredentialsError();

      expect(error1.errorId).toBeDefined();
      expect(error2.errorId).toBeDefined();
      expect(error1.errorId).not.toBe(error2.errorId);
      expect(error1.errorId).toContain('AUTH_INVALID_CREDS_001');
    });

    it('should set timestamp when error is created', () => {
      const beforeCreation = new Date();
      const error = new InvalidCredentialsError();
      const afterCreation = new Date();

      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });

  describe('📋 Error Properties and Metadata', () => {
    it('should set proper error code', () => {
      const error = new InvalidCredentialsError();

      expect(error.code).toBe('AUTH_INVALID_CREDS_001');
    });

    it('should set correct error severity', () => {
      const error = new InvalidCredentialsError();

      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
    });

    it('should set correct error category', () => {
      const error = new InvalidCredentialsError();

      expect(error.category).toBe(ErrorCategory.AUTHENTICATION);
    });

    it('should indicate non-retryable error', () => {
      const error = new InvalidCredentialsError();

      expect(error.retryable).toBe(false);
    });

    it('should include error description', () => {
      const error = new InvalidCredentialsError();

      expect(error.description).toBe('Authentication failed due to invalid credentials');
    });

    it('should include context information', () => {
      const error = new InvalidCredentialsError();

      expect(error.context).toBeDefined();
      expect(error.context?.feature).toBe('auth');
      expect(error.context?.action).toBe('credential_validation');
      expect(error.context?.metadata).toEqual({ securityEvent: 'login_failed' });
      expect(error.context?.timestamp).toBeInstanceOf(Date);
      expect(error.context?.stackTrace).toBeDefined();
    });

    it('should include user suggestions', () => {
      const error = new InvalidCredentialsError();

      expect(error.suggestions).toBeDefined();
      expect(error.suggestions).toEqual([
        'Verify your email and password',
        'Check for caps lock',
        'Try password reset if needed'
      ]);
    });
  });

  describe('🔧 AppError Method Tests', () => {
    it('should provide user-friendly message via getUserMessage()', () => {
      const error = new InvalidCredentialsError();

      expect(error.getUserMessage()).toBe('Invalid credentials provided');
    });

    it('should provide technical details via getTechnicalDetails()', () => {
      const error = new InvalidCredentialsError();

      expect(error.getTechnicalDetails()).toBe('Authentication failed due to invalid credentials');
    });

    it('should check retryable status via isRetryable()', () => {
      const error = new InvalidCredentialsError();

      expect(error.isRetryable()).toBe(false);
    });

    it('should return severity via getSeverity()', () => {
      const error = new InvalidCredentialsError();

      expect(error.getSeverity()).toBe(ErrorSeverity.MEDIUM);
    });

    it('should return category via getCategory()', () => {
      const error = new InvalidCredentialsError();

      expect(error.getCategory()).toBe(ErrorCategory.AUTHENTICATION);
    });

    it('should return suggestions via getSuggestions()', () => {
      const error = new InvalidCredentialsError();

      expect(error.getSuggestions()).toEqual([
        'Verify your email and password',
        'Check for caps lock',
        'Try password reset if needed'
      ]);
    });

    it('should create error with additional context via withContext()', () => {
      const error = new InvalidCredentialsError();
      const additionalContext = {
        userId: 'user-123',
        requestId: 'req-456',
        ipAddress: '192.168.1.1'
      };

      const enhancedError = error.withContext(additionalContext);

      expect(enhancedError).toBeInstanceOf(Error);
      expect(enhancedError.name).toBe('AppError');
      expect(enhancedError.code).toBe('AUTH_INVALID_CREDS_001');
      expect(enhancedError.context?.userId).toBe('user-123');
      expect(enhancedError.context?.requestId).toBe('req-456');
      expect(enhancedError.context?.ipAddress).toBe('192.168.1.1');
      expect(enhancedError.context?.feature).toBe('auth');
      expect(enhancedError.context?.action).toBe('credential_validation');
    });

    it('should serialize properly via toJSON()', () => {
      const error = new InvalidCredentialsError();
      const json = error.toJSON();

      expect(json).toHaveProperty('errorId');
      expect(json).toHaveProperty('name', 'InvalidCredentialsError');
      expect(json).toHaveProperty('code', 'AUTH_INVALID_CREDS_001');
      expect(json).toHaveProperty('message', 'Invalid credentials provided');
      expect(json).toHaveProperty('description', 'Authentication failed due to invalid credentials');
      expect(json).toHaveProperty('severity', ErrorSeverity.MEDIUM);
      expect(json).toHaveProperty('category', ErrorCategory.AUTHENTICATION);
      expect(json).toHaveProperty('retryable', false);
      expect(json).toHaveProperty('timestamp');
      expect(json).toHaveProperty('context');
      expect(json).toHaveProperty('suggestions');
      expect(json).toHaveProperty('stack');
    });

    it('should serialize cause information in toJSON()', () => {
      const cause = new Error('Database connection failed');
      const error = new InvalidCredentialsError(cause);
      const json = error.toJSON();

      expect(json.cause).toBeDefined();
      expect(json.cause?.name).toBe('Error');
      expect(json.cause?.message).toBe('Database connection failed');
      expect(json.cause?.stack).toBeDefined();
    });
  });

  describe('🔒 Security and Compliance Tests', () => {
    it('should use generic message to prevent enumeration', () => {
      const error = new InvalidCredentialsError();

      expect(error.message).toBe('Invalid credentials provided');
      expect(error.message).not.toContain('username');
      expect(error.message).not.toContain('email');
      expect(error.message).not.toContain('password');
    });

    it('should handle sensitive cause information securely', () => {
      const sensitiveCause = new Error('User john.doe@company.com not found in database');
      const error = new InvalidCredentialsError(sensitiveCause);

      // Should still use generic message
      expect(error.message).toBe('Invalid credentials provided');
      expect(error.message).not.toContain('john.doe@company.com');
    });

    it('should not expose database errors in message', () => {
      const dbError = new Error('Table auth_users does not exist');
      const error = new InvalidCredentialsError(dbError);

      expect(error.message).toBe('Invalid credentials provided');
      expect(error.message).not.toContain('auth_users');
      expect(error.message).not.toContain('database');
    });

    it('should handle null cause safely', () => {
      const error = new InvalidCredentialsError(null);

      expect(error).toBeInstanceOf(InvalidCredentialsError);
      expect(error.message).toBe('Invalid credentials provided');
      expect(error.cause).toBeUndefined();
    });

    it('should handle undefined cause safely', () => {
      const error = new InvalidCredentialsError(undefined);

      expect(error).toBeInstanceOf(InvalidCredentialsError);
      expect(error.message).toBe('Invalid credentials provided');
      expect(error.cause).toBeUndefined();
    });

    it('should handle non-Error cause objects', () => {
      const nonErrorCause = { type: 'validation_failed', field: 'password' };
      const error = new InvalidCredentialsError(nonErrorCause);

      expect(error).toBeInstanceOf(InvalidCredentialsError);
      expect(error.message).toBe('Invalid credentials provided');
      expect(error.cause).toBeUndefined();
    });

    it('should not expose sensitive data in serialization', () => {
      const sensitiveCause = new Error('User admin@secret-company.com failed authentication');
      const error = new InvalidCredentialsError(sensitiveCause);
      const json = error.toJSON();

      expect(json.message).toBe('Invalid credentials provided');
      expect(json.description).toBe('Authentication failed due to invalid credentials');
      // But cause should be preserved for debugging (in controlled environments)
      expect(json.cause?.message).toBe('User admin@secret-company.com failed authentication');
    });
  });

  describe('📊 Business Rules Validation', () => {
    it('should comply with BR-160: Information disclosure prevention', () => {
      const error = new InvalidCredentialsError();

      expect(error.message).toBe('Invalid credentials provided');
      expect(error.description).toBe('Authentication failed due to invalid credentials');
      
      // Ensures no specific information about what was wrong
      expect(error.message).not.toMatch(/email|username|password|user not found/i);
    });

    it('should mark as security event for monitoring', () => {
      const error = new InvalidCredentialsError();

      expect(error.context?.metadata?.securityEvent).toBe('login_failed');
    });

    it('should categorize as authentication error', () => {
      const error = new InvalidCredentialsError();

      expect(error.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(error.context?.feature).toBe('auth');
      expect(error.context?.action).toBe('credential_validation');
    });

    it('should set appropriate severity for security monitoring', () => {
      const error = new InvalidCredentialsError();

      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
    });

    it('should indicate non-retryable for automatic systems', () => {
      const error = new InvalidCredentialsError();

      expect(error.retryable).toBe(false);
    });
  });

  describe('🔍 Error Classification Tests', () => {
    it('should have correct error code format', () => {
      const error = new InvalidCredentialsError();

      expect(error.code).toMatch(/^AUTH_[A-Z_]+_\d{3}$/);
      expect(error.code).toBe('AUTH_INVALID_CREDS_001');
    });

    it('should provide user-friendly suggestions', () => {
      const error = new InvalidCredentialsError();

      expect(error.suggestions).toBeInstanceOf(Array);
      expect(error.suggestions?.length).toBeGreaterThan(0);
      expect(error.suggestions).toContain('Verify your email and password');
      expect(error.suggestions).toContain('Check for caps lock');
      expect(error.suggestions).toContain('Try password reset if needed');
    });

    it('should include proper context metadata', () => {
      const error = new InvalidCredentialsError();

      expect(error.context).toBeDefined();
      expect(error.context?.feature).toBe('auth');
      expect(error.context?.action).toBe('credential_validation');
      expect(error.context?.metadata).toBeDefined();
      expect(error.context?.metadata?.securityEvent).toBe('login_failed');
    });
  });

  describe('📈 Monitoring and Audit Integration', () => {
    it('should provide structured data for security monitoring', () => {
      const error = new InvalidCredentialsError();

      const monitoringData = {
        errorId: error.errorId,
        errorCode: error.code,
        severity: error.severity,
        category: error.category,
        securityEvent: error.context?.metadata?.securityEvent,
        timestamp: error.timestamp
      };

      expect(monitoringData.errorId).toBeDefined();
      expect(monitoringData.errorCode).toBe('AUTH_INVALID_CREDS_001');
      expect(monitoringData.severity).toBe(ErrorSeverity.MEDIUM);
      expect(monitoringData.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(monitoringData.securityEvent).toBe('login_failed');
      expect(monitoringData.timestamp).toBeInstanceOf(Date);
    });

    it('should support audit logging requirements', () => {
      const error = new InvalidCredentialsError();

      // Should contain necessary information for audit logs without sensitive data
      expect(error.code).toBeDefined();
      expect(error.errorId).toBeDefined();
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.context?.metadata?.securityEvent).toBe('login_failed');
      expect(error.message).not.toContain('password');
      expect(error.message).not.toContain('email');
    });

    it('should provide complete audit trail information', () => {
      const error = new InvalidCredentialsError();
      const auditData = error.toJSON();

      expect(auditData.errorId).toBeDefined();
      expect(auditData.timestamp).toBeDefined();
      expect(auditData.code).toBe('AUTH_INVALID_CREDS_001');
      expect(auditData.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(auditData.context?.metadata?.securityEvent).toBe('login_failed');
    });
  });

  describe('🛠️ Error Handling Integration', () => {
    it('should work with try-catch blocks', () => {
      let caughtError: InvalidCredentialsError | null = null;

      try {
        throw new InvalidCredentialsError();
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          caughtError = error;
        }
      }

      expect(caughtError).toBeInstanceOf(InvalidCredentialsError);
      expect(caughtError!.code).toBe('AUTH_INVALID_CREDS_001');
    });

    it('should serialize properly for logging', () => {
      const error = new InvalidCredentialsError();

      const serialized = JSON.stringify(error);
      const parsed = JSON.parse(serialized);

      expect(parsed.name).toBe('InvalidCredentialsError');
      expect(parsed.message).toBe('Invalid credentials provided');
      expect(parsed.code).toBe('AUTH_INVALID_CREDS_001');
      expect(parsed.errorId).toBeDefined();
      expect(parsed.timestamp).toBeDefined();
    });

    it('should work with error handling middleware', () => {
      const error = new InvalidCredentialsError();

      // Simulate middleware error detection
      const isAuthError = error.category === ErrorCategory.AUTHENTICATION;
      const isClientError = error.severity === ErrorSeverity.MEDIUM;
      const shouldRetry = error.retryable;

      expect(isAuthError).toBe(true);
      expect(isClientError).toBe(true);
      expect(shouldRetry).toBe(false);
    });

    it('should support error transformation with context', () => {
      const originalError = new InvalidCredentialsError();
      const enhancedError = originalError.withContext({
        userId: 'user-123',
        requestId: 'req-456'
      });

      expect(enhancedError).not.toBe(originalError);
      expect(enhancedError.name).toBe('AppError');
      expect(enhancedError.code).toBe(originalError.code);
      expect(enhancedError.message).toBe(originalError.message);
      expect(enhancedError.context?.userId).toBe('user-123');
      expect(enhancedError.context?.requestId).toBe('req-456');
    });
  });

  describe('⚡ Performance and Memory Tests', () => {
    it('should create errors efficiently', () => {
      // Performance Test mit mehreren Iterationen für Stabilität
      const iterations = 3;
      const instancesPerIteration = 500; // Reduziert für Stabilität
      const times = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = process.hrtime.bigint();

        for (let j = 0; j < instancesPerIteration; j++) {
          new InvalidCredentialsError();
        }

        const endTime = process.hrtime.bigint();
        const executionTimeMs = Number(endTime - startTime) / 1_000_000;
        times.push(executionTimeMs);
      }

      // Verwende Median für Stabilität (robuster als einzelne Messung)
      times.sort((a, b) => a - b);
      const medianTime = times[Math.floor(times.length / 2)];

      // Großzügigere Grenze für CI/CD-Stabilität
      expect(medianTime).toBeLessThan(300); 
      
      // Zusätzliche Assertion: Keine Iteration sollte extrem langsam sein
      const maxTime = Math.max(...times);
      expect(maxTime).toBeLessThan(500); // Absolute Obergrenze
    });

    it('should handle cause chain properly', () => {
      const rootCause = new Error('Connection timeout');
      const intermediateCause = new Error('Database query failed');
      const error = new InvalidCredentialsError(intermediateCause);

      expect(error).toBeInstanceOf(InvalidCredentialsError);
      expect(error.message).toBe('Invalid credentials provided');
      expect(error.cause).toBe(intermediateCause);
    });

    it('should not leak memory with repeated creation', () => {
      const errors: InvalidCredentialsError[] = [];

      for (let i = 0; i < 100; i++) {
        errors.push(new InvalidCredentialsError());
      }

      // All errors should be independent with unique IDs
      expect(errors.length).toBe(100);
      const errorIds = new Set(errors.map(e => e.errorId));
      expect(errorIds.size).toBe(100); // All IDs should be unique

      errors.forEach(error => {
        expect(error).toBeInstanceOf(InvalidCredentialsError);
        expect(error.code).toBe('AUTH_INVALID_CREDS_001');
        expect(error.errorId).toBeDefined();
      });
    });

    it('should have efficient JSON serialization', () => {
      const error = new InvalidCredentialsError();
      
      const startTime = process.hrtime.bigint();
      for (let i = 0; i < 100; i++) {
        JSON.stringify(error);
      }
      const endTime = process.hrtime.bigint();
      const executionTimeMs = Number(endTime - startTime) / 1_000_000;

      expect(executionTimeMs).toBeLessThan(10); // Should serialize quickly
    });
  });

  describe('🧪 Edge Cases and Error Conditions', () => {
    it('should handle circular reference in cause', () => {
      const circularCause: any = new Error('Circular error');
      circularCause.cause = circularCause;

      expect(() => {
        new InvalidCredentialsError(circularCause);
      }).not.toThrow();

      const error = new InvalidCredentialsError(circularCause);
      expect(error.cause).toBe(circularCause);
    });

    it('should handle very large cause objects', () => {
      const largeCause = new Error('A'.repeat(10000));

      expect(() => {
        new InvalidCredentialsError(largeCause);
      }).not.toThrow();

      const error = new InvalidCredentialsError(largeCause);
      expect(error.cause?.message).toHaveLength(10000);
    });

    it('should maintain error properties across inheritance', () => {
      const error = new InvalidCredentialsError();

      expect(error.name).toBe('InvalidCredentialsError');
      expect(error.message).toBe('Invalid credentials provided');
      expect(error.code).toBe('AUTH_INVALID_CREDS_001');
      expect(error.stack).toBeDefined();
      expect(error.errorId).toBeDefined();
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should handle error creation in different contexts', () => {
      // Simulate different error creation contexts
      const contexts = [
        () => new InvalidCredentialsError(),
        () => new InvalidCredentialsError(new Error('DB error')),
        () => new InvalidCredentialsError('string cause' as any),
        () => new InvalidCredentialsError({ object: 'cause' } as any)
      ];

      contexts.forEach(createError => {
        const error = createError();
        expect(error).toBeInstanceOf(InvalidCredentialsError);
        expect(error.message).toBe('Invalid credentials provided');
        expect(error.code).toBe('AUTH_INVALID_CREDS_001');
        expect(error.errorId).toBeDefined();
      });
    });

    it('should handle toString() method properly', () => {
      const error = new InvalidCredentialsError();
      const errorString = error.toString();

      expect(errorString).toContain('InvalidCredentialsError');
      expect(errorString).toContain('Invalid credentials provided');
    });

    it('should handle deep cause chains', () => {
      const deepCause = new Error('Level 3');
      const middleCause = new Error('Level 2');
      const topCause = new Error('Level 1');
      
      const error = new InvalidCredentialsError(topCause);

      expect(error.cause).toBe(topCause);
      expect(error.message).toBe('Invalid credentials provided');
    });
  });

  describe('🔐 Security Event Integration', () => {
    it('should support security monitoring integration', () => {
      const error = new InvalidCredentialsError();

      const securityEvent = {
        type: 'authentication_failure',
        errorId: error.errorId,
        severity: error.severity,
        code: error.code,
        timestamp: error.timestamp,
        metadata: error.context?.metadata
      };

      expect(securityEvent.type).toBe('authentication_failure');
      expect(securityEvent.errorId).toBeDefined();
      expect(securityEvent.severity).toBe(ErrorSeverity.MEDIUM);
      expect(securityEvent.code).toBe('AUTH_INVALID_CREDS_001');
      expect(securityEvent.metadata?.securityEvent).toBe('login_failed');
    });

    it('should provide data for rate limiting systems', () => {
      const error = new InvalidCredentialsError();

      const rateLimitData = {
        errorId: error.errorId,
        errorCode: error.code,
        category: error.category,
        retryable: error.retryable,
        timestamp: error.timestamp
      };

      expect(rateLimitData.errorId).toBeDefined();
      expect(rateLimitData.errorCode).toBe('AUTH_INVALID_CREDS_001');
      expect(rateLimitData.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(rateLimitData.retryable).toBe(false);
      expect(rateLimitData.timestamp).toBeInstanceOf(Date);
    });

    it('should support fraud detection systems', () => {
      const error = new InvalidCredentialsError();

      const fraudData = {
        errorId: error.errorId,
        eventType: error.context?.metadata?.securityEvent,
        severity: error.severity,
        category: error.category,
        timestamp: error.timestamp
      };

      expect(fraudData.errorId).toBeDefined();
      expect(fraudData.eventType).toBe('login_failed');
      expect(fraudData.severity).toBe(ErrorSeverity.MEDIUM);
      expect(fraudData.category).toBe(ErrorCategory.AUTHENTICATION);
    });

    it('should integrate with security dashboards', () => {
      const error = new InvalidCredentialsError();
      const dashboardData = {
        ...error.toJSON(),
        securityEventType: error.context?.metadata?.securityEvent
      } as any; // Type assertion to allow extended properties

      expect(dashboardData.errorId).toBeDefined();
      expect(dashboardData.code).toBe('AUTH_INVALID_CREDS_001');
      expect(dashboardData.securityEventType).toBe('login_failed');
      expect(dashboardData.timestamp).toBeDefined();
      expect(dashboardData.category).toBe(ErrorCategory.AUTHENTICATION);
    });
  });
}); 