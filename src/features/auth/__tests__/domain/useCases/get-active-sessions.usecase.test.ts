/**
 * @file get-active-sessions.usecase.test.ts
 * @description Comprehensive tests for GetActiveSessions UseCase
 * Tests session retrieval, authentication, security logging and error scenarios
 */

import { GetActiveSessionsUseCase } from '../../../application/usecases/get-active-sessions.usecase';
import { UserNotAuthenticatedError } from '../../../domain/errors/user-not-authenticated.error';
import { SecurityEventType, SecurityEventSeverity } from '../../../domain/types/security.types';
import { UserSession } from '../../../domain/entities/auth-user.interface';
import { createMockAuthRepository, mockAuthUser, mockUserSession } from '../../mocks/auth-repository.mock';

describe('GetActiveSessionsUseCase', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new GetActiveSessionsUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new GetActiveSessionsUseCase(null as any)).toThrow('AuthRepository is required for GetActiveSessionsUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(GetActiveSessionsUseCase);
    });
  });

  describe('Authentication Validation', () => {
    it('should throw UserNotAuthenticatedError when user is not authenticated', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(null);

      await expect(useCase.execute())
        .rejects.toThrow(UserNotAuthenticatedError);
      
      expect(mockRepository.getActiveSessions).not.toHaveBeenCalled();
    });
  });

  describe('Successful Session Retrieval', () => {
    const mockSession1: UserSession = {
      ...mockUserSession,
      id: 'session_001',
      deviceId: 'device_mobile_001'
    };

    const mockSession2: UserSession = {
      ...mockUserSession,
      id: 'session_002',
      deviceId: 'device_desktop_001',
      createdAt: new Date(Date.now() - 3600000) // 1 hour ago
    };

    it('should retrieve active sessions successfully', async () => {
      const mockSessions = [mockSession1, mockSession2];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(mockSessions);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(mockRepository.getActiveSessions).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        sessions: mockSessions,
        totalSessions: 2
      });
    });

    it('should handle single active session', async () => {
      const mockSessions = [mockSession1];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(mockSessions);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result).toEqual({
        sessions: mockSessions,
        totalSessions: 1
      });
    });

    it('should handle empty session list', async () => {
      const mockSessions: UserSession[] = [];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(mockSessions);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result).toEqual({
        sessions: [],
        totalSessions: 0
      });
    });
  });

  describe('Security Event Logging', () => {
    const mockSessions = [mockUserSession];

    it('should log security event on successful retrieval', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(mockSessions);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.LOGIN,
          userId: mockAuthUser.id,
          severity: SecurityEventSeverity.LOW,
          details: expect.objectContaining({
            action: 'sessions_viewed',
            message: 'User viewed active sessions',
            sessionCount: 1
          })
        })
      );
    });

    it('should include session count in security event', async () => {
      const multipleSessions = [mockUserSession, mockUserSession, mockUserSession];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(multipleSessions);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            sessionCount: 3
          })
        })
      );
    });

    it('should generate unique event IDs', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(mockSessions);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^sessions-viewed-\d+$/)
        })
      );
    });

    it('should include current timestamp in events', async () => {
      const beforeExecution = new Date();
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(mockSessions);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      const afterExecution = new Date();
      const logCall = mockRepository.logSecurityEvent.mock.calls[0][0];
      
      expect(logCall.timestamp).toBeInstanceOf(Date);
      expect(logCall.timestamp.getTime()).toBeGreaterThanOrEqual(beforeExecution.getTime());
      expect(logCall.timestamp.getTime()).toBeLessThanOrEqual(afterExecution.getTime());
    });

    it('should include standard metadata in events', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(mockSessions);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddress: 'Unknown',
          userAgent: 'React Native App'
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle and log repository errors', async () => {
      const repositoryError = new Error('Session database unavailable');
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockRejectedValueOnce(repositoryError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow('Session database unavailable');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          userId: mockAuthUser.id,
          severity: SecurityEventSeverity.MEDIUM,
          details: expect.objectContaining({
            action: 'sessions_view_failed',
            error: 'Session database unavailable',
            message: 'Failed to retrieve active sessions'
          })
        })
      );
    });

    it('should handle unknown errors in logging', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockRejectedValueOnce('String error');
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

    it('should propagate repository errors', async () => {
      const customError = new Error('Custom session error');
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockRejectedValueOnce(customError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute())
        .rejects.toThrow(customError);
    });

    it('should generate unique error event IDs', async () => {
      const error = new Error('Test error');
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockRejectedValueOnce(error);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute()).rejects.toThrow();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^sessions-view-failed-\d+$/)
        })
      );
    });
  });

  describe('Session Data Variations', () => {
    it('should handle sessions with different device types', async () => {
      const sessionsWithDevices: UserSession[] = [
        { ...mockUserSession, id: 'mobile_session', deviceId: 'iphone_14' },
        { ...mockUserSession, id: 'desktop_session', deviceId: 'macbook_pro' },
        { ...mockUserSession, id: 'tablet_session', deviceId: 'ipad_air' }
      ];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(sessionsWithDevices);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.sessions).toHaveLength(3);
      expect(result.totalSessions).toBe(3);
      expect(result.sessions.map(s => s.deviceId)).toEqual(['iphone_14', 'macbook_pro', 'ipad_air']);
    });

    it('should handle sessions with different activity times', async () => {
      const now = new Date();
      const sessionsWithActivity: UserSession[] = [
        { 
          ...mockUserSession, 
          id: 'recent_session',
          lastActiveAt: now
        },
        { 
          ...mockUserSession, 
          id: 'older_session',
          lastActiveAt: new Date(now.getTime() - 86400000) // 1 day ago
        }
      ];
      
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(sessionsWithActivity);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      expect(result.sessions).toHaveLength(2);
      expect(result.sessions[0].lastActiveAt.getTime()).toBeGreaterThan(
        result.sessions[1].lastActiveAt.getTime()
      );
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete session retrieval flow', async () => {
      const comprehensiveSessions: UserSession[] = [
        {
          ...mockUserSession,
          id: 'current_session_001',
          deviceId: 'mobile_primary',
          isActive: true
        },
        {
          ...mockUserSession,
          id: 'desktop_session_002',
          deviceId: 'desktop_work',
          isActive: true,
          createdAt: new Date(Date.now() - 7200000), // 2 hours ago
          lastActiveAt: new Date(Date.now() - 1800000) // 30 min ago
        }
      ];

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.getActiveSessions.mockResolvedValueOnce(comprehensiveSessions);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute();

      // Verify complete flow
      expect(mockRepository.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockRepository.getActiveSessions).toHaveBeenCalledTimes(1);
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(1);
      
      expect(result).toEqual({
        sessions: comprehensiveSessions,
        totalSessions: 2
      });

      // Verify sessions contain expected data
      expect(result.sessions[0]).toMatchObject({
        id: 'current_session_001',
        deviceId: 'mobile_primary',
        isActive: true
      });
      
      expect(result.sessions[1]).toMatchObject({
        id: 'desktop_session_002',
        deviceId: 'desktop_work',
        isActive: true
      });
    });
  });
}); 