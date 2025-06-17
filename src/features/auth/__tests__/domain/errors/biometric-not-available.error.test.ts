/**
 * @file biometric-not-available.error.test.ts
 * @description Comprehensive tests for BiometricNotAvailableError
 * Tests error creation, properties, inheritance, and biometric availability scenarios
 */

import { BiometricNotAvailableError } from '../../../domain/errors/biometric-not-available.error';
import { AppError, ErrorSeverity, ErrorCategory } from '@shared/errors';

describe('BiometricNotAvailableError', () => {
  describe('Constructor', () => {
    it('should create error with default properties', () => {
      const error = new BiometricNotAvailableError();

      expect(error).toBeInstanceOf(BiometricNotAvailableError);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('BiometricNotAvailableError');
    });

    it('should create error without cause', () => {
      const error = new BiometricNotAvailableError();

      expect(error.message).toBe('Biometric authentication not available');
      expect(error.severity).toBe(ErrorSeverity.LOW);
      expect(error.category).toBe(ErrorCategory.SYSTEM);
      expect(error.retryable).toBe(false);
      expect(error.cause).toBeUndefined();
    });

    it('should create error with Error cause', () => {
      const originalError = new Error('Hardware not available');
      const error = new BiometricNotAvailableError('hardware_not_supported', originalError);

      expect(error.cause).toBe(originalError);
      expect(error.reason).toBe('hardware_not_supported');
    });

    it('should create error with non-Error cause', () => {
      const nonErrorCause = 'biometric hardware failure';
      const error = new BiometricNotAvailableError('hardware_failure', nonErrorCause);

      expect(error.cause).toBeUndefined(); // Non-Error causes should be undefined
      expect(error.reason).toBe('hardware_failure');
    });

    it('should include proper context information', () => {
      const error = new BiometricNotAvailableError();

      expect(error.context).toBeDefined();
      expect(error.context!.feature).toBe('auth');
      expect(error.context!.action).toBe('biometric_check');
    });
  });

  describe('Error Properties', () => {
    let error: BiometricNotAvailableError;

    beforeEach(() => {
      error = new BiometricNotAvailableError();
    });

    it('should have system category', () => {
      expect(error.category).toBe(ErrorCategory.SYSTEM);
    });

    it('should have low severity', () => {
      expect(error.severity).toBe(ErrorSeverity.LOW);
    });

    it('should not be retryable', () => {
      expect(error.retryable).toBe(false);
    });

    it('should have timestamp', () => {
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should have unique error ID', () => {
      const error2 = new BiometricNotAvailableError();
      expect(error.errorId).toBeDefined();
      expect(error.errorId).not.toBe(error2.errorId);
    });

    it('should have appropriate suggestions', () => {
      expect(error.suggestions).toBeDefined();
      expect(Array.isArray(error.suggestions)).toBe(true);
    });
  });

  describe('Inheritance and Type Checking', () => {
    it('should be instance of all parent classes', () => {
      const error = new BiometricNotAvailableError();

      expect(error instanceof BiometricNotAvailableError).toBe(true);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should have correct constructor name', () => {
      const error = new BiometricNotAvailableError();
      expect(error.constructor.name).toBe('BiometricNotAvailableError');
    });

    it('should maintain prototype chain', () => {
      const error = new BiometricNotAvailableError();
      expect(Object.getPrototypeOf(error)).toBe(BiometricNotAvailableError.prototype);
    });
  });

  describe('Biometric Availability Scenarios', () => {
    it('should handle hardware not available scenario', () => {
      const hardwareError = new Error('Touch ID sensor not found');
      const error = new BiometricNotAvailableError('hardware_not_supported', hardwareError);
      
      expect(error.cause).toBe(hardwareError);
      expect(error.retryable).toBe(false);
      expect(error.category).toBe(ErrorCategory.SYSTEM);
      expect(error.reason).toBe('hardware_not_supported');
    });

    it('should handle biometric not enrolled scenario', () => {
      const enrollmentError = new Error('No fingerprints enrolled');
      const error = new BiometricNotAvailableError('no_enrolled_biometrics', enrollmentError);
      
      expect(error.cause).toBe(enrollmentError);
      expect(error.context!.action).toBe('biometric_check');
      expect(error.reason).toBe('no_enrolled_biometrics');
    });

    it('should handle permission denied scenario', () => {
      const permissionError = new Error('Biometric permission denied');
      const error = new BiometricNotAvailableError('permission_denied', permissionError);
      
      expect(error.cause).toBe(permissionError);
      expect(error.severity).toBe(ErrorSeverity.LOW);
      expect(error.reason).toBe('permission_denied');
    });

    it('should handle device security not enabled scenario', () => {
      const securityError = new Error('Device lock screen not set up');
      const error = new BiometricNotAvailableError('device_security_disabled', securityError);
      
      expect(error.cause).toBe(securityError);
      expect(error.retryable).toBe(false);
      expect(error.reason).toBe('device_security_disabled');
    });
  });

  describe('Platform-Specific Scenarios', () => {
    it('should handle iOS Face ID not available', () => {
      const faceIdError = new Error('Face ID not available on this device');
      const error = new BiometricNotAvailableError('face_id_not_available', faceIdError);
      
      expect(error.cause).toBe(faceIdError);
      expect(error.category).toBe(ErrorCategory.SYSTEM);
      expect(error.reason).toBe('face_id_not_available');
    });

    it('should handle iOS Touch ID not available', () => {
      const touchIdError = new Error('Touch ID not available on this device');
      const error = new BiometricNotAvailableError('touch_id_not_available', touchIdError);
      
      expect(error.cause).toBe(touchIdError);
      expect(error.retryable).toBe(false);
      expect(error.reason).toBe('touch_id_not_available');
    });

    it('should handle Android fingerprint not available', () => {
      const fingerprintError = new Error('Fingerprint hardware not detected');
      const error = new BiometricNotAvailableError('fingerprint_not_available', fingerprintError);
      
      expect(error.cause).toBe(fingerprintError);
      expect(error.context!.feature).toBe('auth');
      expect(error.reason).toBe('fingerprint_not_available');
    });
  });

  describe('Error Serialization', () => {
    it('should serialize to JSON properly', () => {
      const error = new BiometricNotAvailableError();
      const serialized = JSON.stringify(error);
      const parsed = JSON.parse(serialized);
      
      expect(parsed.message).toBe(error.message);
      expect(parsed.name).toBe(error.name);
      expect(parsed.category).toBe(error.category);
    });

    it('should include stack trace', () => {
      const error = new BiometricNotAvailableError();
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('BiometricNotAvailableError');
    });
  });

  describe('Integration with Error Handling', () => {
    it('should work with try-catch blocks', () => {
      const throwError = () => {
        throw new BiometricNotAvailableError();
      };
      
      expect(throwError).toThrow(BiometricNotAvailableError);
      expect(throwError).toThrow(AppError);
    });

    it('should work with instanceof checks', () => {
      try {
        throw new BiometricNotAvailableError();
      } catch (error) {
        expect(error instanceof BiometricNotAvailableError).toBe(true);
        expect(error instanceof AppError).toBe(true);
        expect(error instanceof Error).toBe(true);
      }
    });

    it('should work with error type guards', () => {
      const error = new BiometricNotAvailableError();
      
      if (error instanceof BiometricNotAvailableError) {
        expect(error.category).toBe(ErrorCategory.SYSTEM);
        expect(error.retryable).toBe(false);
      }
    });
  });

  describe('Security Considerations', () => {
    it('should not expose sensitive device information', () => {
      const error = new BiometricNotAvailableError();
      
      // Error message should not contain device-specific identifiers
      expect(error.message).not.toMatch(/[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}/i);
      expect(error.description).not.toMatch(/serial|imei|uuid/i);
    });

    it('should provide user-friendly guidance', () => {
      const error = new BiometricNotAvailableError();
      
      expect(error.suggestions).toBeDefined();
      expect(error.retryable).toBe(false); // Hardware issues typically not retryable
    });
  });

  describe('Fallback Authentication', () => {
    it('should indicate fallback options available', () => {
      const error = new BiometricNotAvailableError();
      
      // Error should guide users to alternative authentication
      expect(error.retryable).toBe(false); // Biometric not retryable, use fallback
      expect(error.severity).toBe(ErrorSeverity.LOW); // Not critical as fallbacks exist
    });
  });
}); 