/**
 * @file check-suspicious-activity.usecase.test.ts
 * @description Comprehensive tests for CheckSuspiciousActivity UseCase
 * Tests security monitoring, threat detection, risk assessment and recommendations
 */

import { CheckSuspiciousActivityUseCase } from '../../../application/usecases/check-suspicious-activity.usecase';
import { UserNotAuthenticatedError } from '../../../domain/errors/user-not-authenticated.error';
import { SecurityEventType, SecurityEventSeverity } from '../../../domain/types/security.types';
import { SecurityAlert } from '../../../domain/interfaces/auth.repository.interface';
import { createMockAuthRepository } from '../../mocks/auth-repository.mock';
import { createMockAuthUser } from '../../../helpers/auth-user-test.factory';

describe('CheckSuspiciousActivityUseCase', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new CheckSuspiciousActivityUseCase(mockRepository);
  const mockAuthUser = createMockAuthUser();

  // Mock security alerts
  const mockCriticalAlert: SecurityAlert = {
    id: 'alert_critical_001',
    type: 'multiple_failed_logins',
    severity: SecurityEventSeverity.CRITICAL,
    message: 'Multiple failed login attempts detected',
    timestamp: new Date(),
    resolved: false
  };

  const mockHighAlert: SecurityAlert = {
    id: 'alert_high_001',
    type: 'unusual_location',
    severity: SecurityEventSeverity.HIGH,
    message: 'Login from unusual geographic location',
    timestamp: new Date(),
    resolved: false
  };

  const mockMediumAlert: SecurityAlert = {
    id: 'alert_medium_001',
    type: 'new_device',
    severity: SecurityEventSeverity.MEDIUM,
    message: 'New device registered',
    timestamp: new Date(),
    resolved: false
  };

  const mockLowAlert: SecurityAlert = {
    id: 'alert_low_001',
    type: 'suspicious_activity',
    severity: SecurityEventSeverity.LOW,
    message: 'Suspicious activity detected',
    timestamp: new Date(),
    resolved: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new CheckSuspiciousActivityUseCase(null as any))
        .toThrow('AuthRepository is required for CheckSuspiciousActivityUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(CheckSuspiciousActivityUseCase);
    });
  });

  describe('Authentication Validation', () => {
    it('should throw UserNotAuthenticatedError when user is not authenticated', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(null);

      await expect(useCase.execute())
        .rejects.toThrow(UserNotAuthenticatedError);
      
      expect(mockRepository.checkSuspiciousActivity).not.toHaveBeenCalled();
    });
  });

  describe('No Alerts Scenario', () => {
    it('should handle no security alerts successfully', async () => {
      const emptyAlerts: SecurityAlert[] = [];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(emptyAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result).toEqual({
        hasAlerts: false,
        alerts: [],
        riskLevel: 'low',
        recommendations: ['Continue following security best practices']
      });
    });

    it('should log security event for no alerts scenario', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce([]);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          userId: mockAuthUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'security_check_performed',
            message: 'Suspicious activity check completed',
            alertCount: 0,
            riskLevel: 'low',
            hasAlerts: false
          })
        })
      );
    });
  });

  describe('Risk Level Calculation', () => {
    it('should calculate low risk for few low-severity alerts', async () => {
      const lowRiskAlerts = [mockLowAlert];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(lowRiskAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.riskLevel).toBe('low');
      expect(result.hasAlerts).toBe(true);
      expect(result.alerts).toHaveLength(1);
    });

    it('should calculate medium risk for moderate alert count', async () => {
      const mediumRiskAlerts = [mockMediumAlert, mockMediumAlert, mockMediumAlert, mockMediumAlert];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(mediumRiskAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.riskLevel).toBe('medium');
      expect(result.recommendations).toContain('Monitor account activity closely');
      expect(result.recommendations).toContain('Ensure MFA is enabled');
    });

    it('should calculate medium risk for single high alert', async () => {
      const mediumRiskAlerts = [mockHighAlert];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(mediumRiskAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.riskLevel).toBe('medium');
    });

    it('should calculate high risk for multiple high alerts', async () => {
      const highRiskAlerts = [mockHighAlert, mockHighAlert, mockHighAlert];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(highRiskAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.riskLevel).toBe('high');
      expect(result.recommendations).toContain('Consider changing your password');
      expect(result.recommendations).toContain('Enable additional security measures');
      expect(result.recommendations).toContain('Review login locations and devices');
    });

    it('should calculate critical risk for any critical alert', async () => {
      const criticalRiskAlerts = [mockCriticalAlert];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(criticalRiskAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.riskLevel).toBe('critical');
      expect(result.recommendations).toContain('Immediately change your password');
      expect(result.recommendations).toContain('Enable MFA if not already active');
      expect(result.recommendations).toContain('Review recent account activity');
      expect(result.recommendations).toContain('Contact security team if suspicious activity continues');
    });

    it('should prioritize critical over other alerts', async () => {
      const mixedAlerts = [mockLowAlert, mockMediumAlert, mockHighAlert, mockCriticalAlert];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(mixedAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.riskLevel).toBe('critical');
      expect(result.alerts).toHaveLength(4);
    });
  });

  describe('Alert Type Specific Recommendations', () => {
    it('should add specific recommendation for multiple failed logins', async () => {
      const failedLoginAlert: SecurityAlert = {
        ...mockHighAlert,
        type: 'multiple_failed_logins'
      };
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce([failedLoginAlert]);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.recommendations).toContain('Consider enabling account lockout protection');
    });

    it('should add specific recommendation for unusual location', async () => {
      const locationAlert: SecurityAlert = {
        ...mockHighAlert,
        type: 'unusual_location'
      };
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce([locationAlert]);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.recommendations).toContain('Verify recent login locations');
    });

    it('should add specific recommendation for new device', async () => {
      const deviceAlert: SecurityAlert = {
        ...mockMediumAlert,
        type: 'new_device'
      };
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce([deviceAlert]);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.recommendations).toContain('Review authorized devices');
    });

    it('should add multiple specific recommendations for multiple alert types', async () => {
      const multipleTypeAlerts: SecurityAlert[] = [
        { ...mockHighAlert, type: 'multiple_failed_logins' },
        { ...mockMediumAlert, type: 'unusual_location' },
        { ...mockMediumAlert, type: 'new_device' }
      ];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(multipleTypeAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.recommendations).toContain('Consider enabling account lockout protection');
      expect(result.recommendations).toContain('Verify recent login locations');
      expect(result.recommendations).toContain('Review authorized devices');
    });
  });

  describe('Security Event Logging', () => {
    it('should log with correct severity for low risk', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce([mockLowAlert]);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: SecurityEventSeverity.LOW
        })
      );
    });

    it('should log with high severity for high risk', async () => {
      const highRiskAlerts = [mockHighAlert, mockHighAlert, mockHighAlert];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(highRiskAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: SecurityEventSeverity.HIGH
        })
      );
    });

    it('should log with critical severity for critical risk', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce([mockCriticalAlert]);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: SecurityEventSeverity.CRITICAL
        })
      );
    });

    it('should generate unique event IDs', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce([]);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^security-check-\d+$/)
        })
      );
    });

    it('should include alert count in security event details', async () => {
      const multipleAlerts = [mockLowAlert, mockMediumAlert, mockHighAlert];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(multipleAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            alertCount: 3,
            hasAlerts: true
          })
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle and log repository errors', async () => {
      const repositoryError = new Error('Security service unavailable');
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockRejectedValueOnce(repositoryError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow('Security service unavailable');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          userId: mockAuthUser.id,
          severity: SecurityEventSeverity.MEDIUM,
          details: expect.objectContaining({
            action: 'security_check_failed',
            error: 'Security service unavailable',
            message: 'Failed to check suspicious activity'
          })
        })
      );
    });

    it('should handle unknown errors in logging', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockRejectedValueOnce('String error');
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toBe('String error');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            error: 'Unknown error'
          })
        })
      );
    });

    it('should generate unique error event IDs', async () => {
      const error = new Error('Test error');
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockRejectedValueOnce(error);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute()).rejects.toThrow();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^security-check-failed-\d+$/)
        })
      );
    });

    it('should propagate repository errors', async () => {
      const customError = new Error('Custom security error');
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockRejectedValueOnce(customError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow(customError);
    });
  });

  describe('Complex Alert Scenarios', () => {
    it('should handle mixed severity alerts correctly', async () => {
      const complexAlerts: SecurityAlert[] = [
        mockLowAlert,
        mockMediumAlert,
        mockMediumAlert,
        mockHighAlert
      ];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(complexAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.riskLevel).toBe('medium'); // 1 high + 2 medium + 1 low = medium
      expect(result.alerts).toHaveLength(4);
      expect(result.hasAlerts).toBe(true);
    });

    it('should handle alerts with timestamp variations', async () => {
      const detailedAlert: SecurityAlert = {
        id: 'alert_detailed_001',
        type: 'suspicious_activity',
        severity: SecurityEventSeverity.HIGH,
        message: 'Unusual API access pattern detected',
        timestamp: new Date(),
        resolved: false
      };
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce([detailedAlert]);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.alerts[0]).toEqual(detailedAlert);
      expect(result.alerts[0].timestamp).toBeInstanceOf(Date);
    });

    it('should handle alerts from different time periods', async () => {
      const oldAlert: SecurityAlert = {
        ...mockMediumAlert,
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
      };
      
      const recentAlert: SecurityAlert = {
        ...mockHighAlert,
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      };
      
      const currentAlert: SecurityAlert = {
        ...mockMediumAlert,
        timestamp: new Date() // now
      };
      
      const timeBasedAlerts = [oldAlert, recentAlert, currentAlert];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(timeBasedAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.alerts).toHaveLength(3);
      expect(result.riskLevel).toBe('medium');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete security assessment flow', async () => {
      const comprehensiveAlerts: SecurityAlert[] = [
        {
          id: 'alert_comprehensive_001',
          type: 'multiple_failed_logins',
          severity: SecurityEventSeverity.HIGH,
          message: 'Multiple failed login attempts from various IPs',
          timestamp: new Date(),
          resolved: false
        },
        {
          id: 'alert_comprehensive_002',
          type: 'unusual_location',
          severity: SecurityEventSeverity.MEDIUM,
          message: 'Login from new geographic location',
          timestamp: new Date(Date.now() - 1800000), // 30 min ago
          resolved: false
        }
      ];

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.checkSuspiciousActivity.mockResolvedValueOnce(comprehensiveAlerts);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      // Verify complete flow
      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockRepository.checkSuspiciousActivity).toHaveBeenCalledTimes(1);
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(1);
      
      expect(result).toEqual({
        hasAlerts: true,
        alerts: comprehensiveAlerts,
        riskLevel: 'medium', // 1 high + 1 medium = medium
        recommendations: expect.arrayContaining([
          'Monitor account activity closely',
          'Ensure MFA is enabled',
          'Consider enabling account lockout protection',
          'Verify recent login locations'
        ])
      });

      // Verify security logging includes comprehensive details
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            action: 'security_check_performed',
            alertCount: 2,
            riskLevel: 'medium',
            hasAlerts: true
          })
        })
      );
    });
  });
}); 