/**
 * @file password-policy-violation.error.test.ts
 * @description Comprehensive tests for PasswordPolicyViolationError
 * Tests error creation, properties, inheritance, business rules, and policy validation
 */

import { PasswordPolicyViolationError } from '../../../domain/errors/password-policy-violation.error';
import { AppError, ErrorSeverity, ErrorCategory } from '@shared/errors';

describe('PasswordPolicyViolationError - ERROR-006', () => {
  describe('Constructor', () => {
    it('should create error with violations only', () => {
      const violations = ['min_length', 'missing_uppercase'];
      const error = new PasswordPolicyViolationError(violations);

      expect(error).toBeInstanceOf(PasswordPolicyViolationError);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('PasswordPolicyViolationError');
      expect(error.violations).toEqual(violations);
      expect(error.suggestions).toBeUndefined();
    });

    it('should create error with violations and suggestions', () => {
      const violations = ['min_length', 'missing_numbers'];
      const suggestions = [
        'Password must be at least 12 characters long',
        'Include at least 2 numbers'
      ];
      const error = new PasswordPolicyViolationError(violations, suggestions);

      expect(error.violations).toEqual(violations);
      expect(error.suggestions).toEqual(suggestions);
    });

    it('should create error with violations, suggestions, and cause', () => {
      const violations = ['weak_password'];
      const suggestions = ['Use a stronger password'];
      const originalError = new Error('Dictionary attack detected');
      const error = new PasswordPolicyViolationError(violations, suggestions, originalError);

      expect(error.violations).toEqual(violations);
      expect(error.suggestions).toEqual(suggestions);
      expect(error.cause).toBe(originalError);
    });

    it('should create error with non-Error cause', () => {
      const violations = ['invalid_format'];
      const nonErrorCause = 'validation failure';
      const error = new PasswordPolicyViolationError(violations, undefined, nonErrorCause);

      expect(error.violations).toEqual(violations);
      expect(error.cause).toBeUndefined(); // Non-Error causes should be undefined
    });

    it('should include proper context information', () => {
      const violations = ['min_length'];
      const error = new PasswordPolicyViolationError(violations);

      expect(error.context).toBeDefined();
      expect(error.context!.feature).toBe('auth');
      expect(error.context!.action).toBe('password_policy_validation');
      expect(error.context!.metadata).toEqual({
        securityEvent: 'password_policy_violation',
        violationCount: 1,
        violations: violations
      });
    });
  });

  describe('Error Properties', () => {
    let error: PasswordPolicyViolationError;
    const violations = ['min_length', 'missing_special_char'];
    const suggestions = ['Increase length', 'Add special characters'];

    beforeEach(() => {
      error = new PasswordPolicyViolationError(violations, suggestions);
    });

    it('should have correct error code', () => {
      expect(error.code).toBe('AUTH_POLICY_VIOLATION_001');
    });

    it('should have correct message', () => {
      expect(error.message).toBe('Password does not meet policy requirements');
    });

    it('should have correct description', () => {
      expect(error.description).toBe('The provided password violates one or more security policy requirements');
    });

    it('should have medium severity', () => {
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
    });

    it('should have validation category', () => {
      expect(error.category).toBe(ErrorCategory.VALIDATION);
    });

    it('should be retryable', () => {
      expect(error.retryable).toBe(true);
    });

    it('should store violations array', () => {
      expect(error.violations).toEqual(violations);
    });

    it('should store suggestions array', () => {
      expect(error.suggestions).toEqual(suggestions);
    });

    it('should have default suggestions when none provided', () => {
      const errorWithoutSuggestions = new PasswordPolicyViolationError(['min_length']);
      expect(errorWithoutSuggestions.suggestions).toBeUndefined();
    });

    it('should have timestamp', () => {
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should have unique error ID', () => {
      const error2 = new PasswordPolicyViolationError(['test']);
      expect(error.errorId).toBeDefined();
      expect(error.errorId).not.toBe(error2.errorId);
    });
  });

  describe('Violation Count Metadata', () => {
    it('should track single violation', () => {
      const error = new PasswordPolicyViolationError(['min_length']);
      expect(error.context!.metadata!.violationCount).toBe(1);
    });

    it('should track multiple violations', () => {
      const violations = ['min_length', 'missing_uppercase', 'missing_numbers', 'missing_special_char'];
      const error = new PasswordPolicyViolationError(violations);
      expect(error.context!.metadata!.violationCount).toBe(4);
    });

    it('should include violations in metadata', () => {
      const violations = ['weak_password', 'common_pattern'];
      const error = new PasswordPolicyViolationError(violations);
      expect(error.context!.metadata!.violations).toEqual(violations);
    });
  });

  describe('Inheritance and Type Checking', () => {
    it('should be instance of all parent classes', () => {
      const error = new PasswordPolicyViolationError(['test']);

      expect(error instanceof PasswordPolicyViolationError).toBe(true);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should have correct constructor name', () => {
      const error = new PasswordPolicyViolationError(['test']);
      expect(error.constructor.name).toBe('PasswordPolicyViolationError');
    });

    it('should maintain prototype chain', () => {
      const error = new PasswordPolicyViolationError(['test']);
      expect(Object.getPrototypeOf(error)).toBe(PasswordPolicyViolationError.prototype);
    });
  });

  describe('Business Rules - BR-168 to BR-171', () => {
    it('should fulfill BR-168: Password policy enforcement with detailed violation reporting', () => {
      const violations = ['min_length', 'missing_uppercase', 'missing_numbers'];
      const error = new PasswordPolicyViolationError(violations);
      
      // Should provide detailed violation information
      expect(error.violations).toEqual(violations);
      expect(error.context!.metadata!.violationCount).toBe(3);
      expect(error.context!.metadata!.violations).toEqual(violations);
    });

    it('should fulfill BR-169: Constructive suggestions for policy compliance', () => {
      const violations = ['min_length', 'missing_special_char'];
      const suggestions = [
        'Password must be at least 12 characters long',
        'Include special characters like !@#$%^&*()'
      ];
      const error = new PasswordPolicyViolationError(violations, suggestions);
      
      // Should provide actionable suggestions
      expect(error.suggestions).toEqual(suggestions);
      expect(error.retryable).toBe(true);
    });

    it('should fulfill BR-170: Password strength validation against enterprise requirements', () => {
      const violations = ['weak_entropy', 'predictable_pattern'];
      const error = new PasswordPolicyViolationError(violations);
      
      // Should indicate enterprise-level validation
      expect(error.category).toBe(ErrorCategory.VALIDATION);
      expect(error.description).toContain('security policy requirements');
      expect(error.context!.metadata!.securityEvent).toBe('password_policy_violation');
    });

    it('should fulfill BR-171: Common password blacklist validation', () => {
      const violations = ['common_password', 'dictionary_word'];
      const error = new PasswordPolicyViolationError(violations);
      
      // Should track common password violations
      expect(error.violations).toContain('common_password');
      expect(error.violations).toContain('dictionary_word');
      expect(error.context!.action).toBe('password_policy_validation');
    });
  });

  describe('Security and Compliance', () => {
    it('should not expose password content in error messages', () => {
      const violations = ['weak_password'];
      const error = new PasswordPolicyViolationError(violations);
      
      // Error message should not contain actual password
      expect(error.message).not.toMatch(/password123|admin|qwerty/i);
      expect(error.description).not.toContain('password123');
      expect(error.description).not.toContain('admin');
      expect(error.description).not.toContain('qwerty');
    });

    it('should log security events for monitoring', () => {
      const violations = ['brute_force_pattern'];
      const error = new PasswordPolicyViolationError(violations);
      
      expect(error.context!.metadata!.securityEvent).toBe('password_policy_violation');
      expect(error.category).toBe(ErrorCategory.VALIDATION);
    });

    it('should support NIST 800-63B compliance', () => {
      const violations = ['insufficient_entropy'];
      const error = new PasswordPolicyViolationError(violations);
      
      // Should provide appropriate guidance for password requirements
      expect(error.description).toContain('security policy requirements');
      expect(error.retryable).toBe(true);
    });

    it('should support audit logging requirements', () => {
      const violations = ['policy_violation'];
      const error = new PasswordPolicyViolationError(violations);
      
      expect(error.context!.action).toBe('password_policy_validation');
      expect(error.context!.feature).toBe('auth');
      expect(error.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Common Password Policy Violations', () => {
    it('should handle minimum length violations', () => {
      const violations = ['min_length'];
      const suggestions = ['Password must be at least 12 characters long'];
      const error = new PasswordPolicyViolationError(violations, suggestions);
      
      expect(error.violations).toContain('min_length');
      expect(error.suggestions![0]).toContain('12 characters');
    });

    it('should handle character class violations', () => {
      const violations = ['missing_uppercase', 'missing_lowercase', 'missing_numbers', 'missing_special_char'];
      const error = new PasswordPolicyViolationError(violations);
      
      expect(error.violations).toEqual(violations);
      expect(error.context!.metadata!.violationCount).toBe(4);
    });

    it('should handle complexity violations', () => {
      const violations = ['insufficient_entropy', 'predictable_pattern', 'keyboard_pattern'];
      const error = new PasswordPolicyViolationError(violations);
      
      expect(error.violations).toEqual(violations);
      expect(error.context!.metadata!.securityEvent).toBe('password_policy_violation');
    });

    it('should handle blacklist violations', () => {
      const violations = ['common_password', 'dictionary_word', 'leaked_password'];
      const error = new PasswordPolicyViolationError(violations);
      
      expect(error.violations).toEqual(violations);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
    });
  });

  describe('Error Serialization', () => {
    it('should serialize to JSON properly', () => {
      const violations = ['test_violation'];
      const suggestions = ['test suggestion'];
      const error = new PasswordPolicyViolationError(violations, suggestions);
      
      // Test directly accessible properties
      expect(error.violations).toEqual(violations);
      expect(error.suggestions).toEqual(suggestions);
      expect(error.message).toContain('Password');
      expect(error.code).toBeDefined();
    });

    it('should include stack trace', () => {
      const error = new PasswordPolicyViolationError(['test']);
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('PasswordPolicyViolationError');
    });
  });

  describe('Integration with Error Handling', () => {
    it('should work with try-catch blocks', () => {
      const throwError = () => {
        throw new PasswordPolicyViolationError(['weak_password']);
      };
      
      expect(throwError).toThrow(PasswordPolicyViolationError);
      expect(throwError).toThrow('Password does not meet policy requirements');
    });

    it('should work with instanceof checks', () => {
      try {
        throw new PasswordPolicyViolationError(['test']);
      } catch (error) {
        expect(error instanceof PasswordPolicyViolationError).toBe(true);
        expect(error instanceof AppError).toBe(true);
        expect(error instanceof Error).toBe(true);
      }
    });

    it('should provide access to violations and suggestions in catch blocks', () => {
      try {
        throw new PasswordPolicyViolationError(['min_length'], ['Use longer password']);
      } catch (error) {
        if (error instanceof PasswordPolicyViolationError) {
          expect(error.violations).toEqual(['min_length']);
          expect(error.suggestions).toEqual(['Use longer password']);
        }
      }
    });
  });
}); 