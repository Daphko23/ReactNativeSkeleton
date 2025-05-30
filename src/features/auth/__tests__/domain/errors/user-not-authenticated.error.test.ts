/**
 * @file user-not-authenticated.error.test.ts
 * @description Comprehensive tests for UserNotAuthenticatedError
 * Tests error creation, properties, inheritance, and business rules
 */

import { UserNotAuthenticatedError } from '../../../domain/errors/user-not-authenticated.error';
import { AppError, ErrorSeverity, ErrorCategory } from '../../../../../shared/errors';

describe('UserNotAuthenticatedError - ERROR-007', () => {
  describe('Constructor', () => {
    it('should create error with default properties', () => {
      const error = new UserNotAuthenticatedError();

      expect(error).toBeInstanceOf(UserNotAuthenticatedError);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('UserNotAuthenticatedError');
    });

    it('should create error without cause', () => {
      const error = new UserNotAuthenticatedError();

      expect(error.code).toBe('AUTH_NOT_AUTHENTICATED_001');
      expect(error.message).toBe('Authentication required');
      expect(error.description).toBe('User must be authenticated to access this resource');
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.category).toBe(ErrorCategory.AUTHORIZATION);
      expect(error.retryable).toBe(true);
      expect(error.cause).toBeUndefined();
    });

    it('should create error with Error cause', () => {
      const originalError = new Error('Session validation failed');
      const error = new UserNotAuthenticatedError(originalError);

      expect(error.cause).toBe(originalError);
      expect(error.code).toBe('AUTH_NOT_AUTHENTICATED_001');
      expect(error.message).toBe('Authentication required');
    });

    it('should create error with non-Error cause', () => {
      const nonErrorCause = 'string error';
      const error = new UserNotAuthenticatedError(nonErrorCause);

      expect(error.cause).toBeUndefined(); // Non-Error causes should be undefined
      expect(error.code).toBe('AUTH_NOT_AUTHENTICATED_001');
    });

    it('should include proper context information', () => {
      const error = new UserNotAuthenticatedError();

      expect(error.context).toBeDefined();
      expect(error.context!.feature).toBe('auth');
      expect(error.context!.action).toBe('authentication_check');
      expect(error.context!.metadata).toEqual({ 
        securityEvent: 'unauthorized_access_attempt' 
      });
    });
  });

  describe('Error Properties', () => {
    let error: UserNotAuthenticatedError;

    beforeEach(() => {
      error = new UserNotAuthenticatedError();
    });

    it('should have correct error code', () => {
      expect(error.code).toBe('AUTH_NOT_AUTHENTICATED_001');
    });

    it('should have medium severity', () => {
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
    });

    it('should have authorization category', () => {
      expect(error.category).toBe(ErrorCategory.AUTHORIZATION);
    });

    it('should be retryable', () => {
      expect(error.retryable).toBe(true);
    });

    it('should have appropriate suggestions', () => {
      expect(error.suggestions).toEqual([
        'Please log in to continue',
        'Check if your session has expired',
        'Refresh the page and try again'
      ]);
    });

    it('should have timestamp', () => {
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should have unique error ID', () => {
      const error2 = new UserNotAuthenticatedError();
      expect(error.errorId).toBeDefined();
      expect(error.errorId).not.toBe(error2.errorId);
    });
  });

  describe('Inheritance and Type Checking', () => {
    it('should be instance of all parent classes', () => {
      const error = new UserNotAuthenticatedError();

      expect(error instanceof UserNotAuthenticatedError).toBe(true);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should have correct constructor name', () => {
      const error = new UserNotAuthenticatedError();
      expect(error.constructor.name).toBe('UserNotAuthenticatedError');
    });

    it('should maintain prototype chain', () => {
      const error = new UserNotAuthenticatedError();
      expect(Object.getPrototypeOf(error)).toBe(UserNotAuthenticatedError.prototype);
    });
  });

  describe('Business Rules - BR-172 to BR-175', () => {
    it('should fulfill BR-172: Authentication verification before protected resource access', () => {
      const error = new UserNotAuthenticatedError();
      
      // Error should indicate authentication requirement
      expect(error.message).toContain('Authentication required');
      expect(error.category).toBe(ErrorCategory.AUTHORIZATION);
      expect(error.context!.action).toBe('authentication_check');
    });

    it('should fulfill BR-173: Session validation and expiration handling', () => {
      const sessionError = new Error('Session expired');
      const error = new UserNotAuthenticatedError(sessionError);
      
      // Should properly handle session validation context
      expect(error.cause).toBe(sessionError);
      expect(error.retryable).toBe(true);
      expect(error.suggestions).toContain('Check if your session has expired');
    });

    it('should fulfill BR-174: Graceful authentication redirection for expired sessions', () => {
      const error = new UserNotAuthenticatedError();
      
      // Should provide guidance for re-authentication
      expect(error.suggestions).toContain('Please log in to continue');
      expect(error.retryable).toBe(true);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM); // Not critical for graceful handling
    });

    it('should fulfill BR-175: Security context preservation during re-authentication', () => {
      const error = new UserNotAuthenticatedError();
      
      // Should include security event tracking
      expect(error.context!.metadata).toEqual({ 
        securityEvent: 'unauthorized_access_attempt' 
      });
      expect(error.context!.feature).toBe('auth');
    });
  });

  describe('Security and Compliance', () => {
    it('should log security events for monitoring', () => {
      const error = new UserNotAuthenticatedError();
      
      expect(error.context!.metadata!.securityEvent).toBe('unauthorized_access_attempt');
      expect(error.category).toBe(ErrorCategory.AUTHORIZATION);
    });

    it('should support NIST 800-63B compliance', () => {
      const error = new UserNotAuthenticatedError();
      
      // Should provide appropriate guidance for authentication requirements
      expect(error.description).toContain('User must be authenticated');
      expect(error.retryable).toBe(true);
    });

    it('should support audit logging requirements', () => {
      const error = new UserNotAuthenticatedError();
      
      expect(error.context!.action).toBe('authentication_check');
      expect(error.context!.feature).toBe('auth');
      expect(error.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Error Serialization', () => {
    it('should serialize to JSON properly', () => {
      const error = new UserNotAuthenticatedError();
      const serialized = JSON.stringify(error);
      const parsed = JSON.parse(serialized);
      
      expect(parsed.message).toBe(error.message);
      expect(parsed.name).toBe(error.name);
      expect(parsed.code).toBe(error.code);
    });

    it('should include stack trace', () => {
      const error = new UserNotAuthenticatedError();
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('UserNotAuthenticatedError');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle session expiration scenario', () => {
      const sessionError = new Error('JWT token expired');
      const error = new UserNotAuthenticatedError(sessionError);
      
      expect(error.cause).toBe(sessionError);
      expect(error.retryable).toBe(true);
      expect(error.suggestions).toContain('Check if your session has expired');
    });

    it('should handle missing authentication context scenario', () => {
      const error = new UserNotAuthenticatedError();
      
      expect(error.message).toBe('Authentication required');
      expect(error.suggestions).toContain('Please log in to continue');
    });

    it('should handle token validation failure scenario', () => {
      const tokenError = new Error('Invalid token signature');
      const error = new UserNotAuthenticatedError(tokenError);
      
      expect(error.cause).toBe(tokenError);
      expect(error.category).toBe(ErrorCategory.AUTHORIZATION);
    });
  });

  describe('Integration with Error Handling', () => {
    it('should work with try-catch blocks', () => {
      const throwError = () => {
        throw new UserNotAuthenticatedError();
      };
      
      expect(throwError).toThrow(UserNotAuthenticatedError);
      expect(throwError).toThrow('Authentication required');
    });

    it('should work with instanceof checks', () => {
      try {
        throw new UserNotAuthenticatedError();
      } catch (error) {
        expect(error instanceof UserNotAuthenticatedError).toBe(true);
        expect(error instanceof AppError).toBe(true);
        expect(error instanceof Error).toBe(true);
      }
    });

    it('should work with error type guards', () => {
      const error = new UserNotAuthenticatedError();
      
      if (error instanceof UserNotAuthenticatedError) {
        expect(error.code).toBe('AUTH_NOT_AUTHENTICATED_001');
        expect(error.retryable).toBe(true);
      }
    });
  });
}); 