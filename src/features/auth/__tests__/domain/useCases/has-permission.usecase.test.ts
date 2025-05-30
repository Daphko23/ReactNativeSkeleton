/**
 * @file has-permission.usecase.test.ts
 * @description Comprehensive tests for HasPermission UseCase
 * Tests RBAC, authorization, security logging and error scenarios
 */

import { HasPermissionUseCase, HasPermissionRequest } from '../../../application/usecases/has-permission.usecase';
import { UserNotAuthenticatedError } from '../../../domain/errors/user-not-authenticated.error';
import { SecurityEventType, SecurityEventSeverity } from '../../../domain/types/security.types';
import { createMockAuthRepository, mockAuthUser } from '../../mocks/auth-repository.mock';

describe('HasPermissionUseCase', () => {
  const mockRepository = createMockAuthRepository();
  const useCase = new HasPermissionUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when repository is not provided', () => {
      expect(() => new HasPermissionUseCase(null as any)).toThrow('AuthRepository is required for HasPermissionUseCase');
    });

    it('should create instance with valid repository', () => {
      expect(useCase).toBeInstanceOf(HasPermissionUseCase);
    });
  });

  describe('User Authentication', () => {
    it('should throw UserNotAuthenticatedError when user is not authenticated and no userId provided', async () => {
      const request: HasPermissionRequest = {
        permission: 'feature:analytics'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(null);

      await expect(useCase.execute(request))
        .rejects.toThrow(UserNotAuthenticatedError);
      
      expect(mockRepository.hasPermission).not.toHaveBeenCalled();
    });

    it('should use current user when no userId is specified', async () => {
      const request: HasPermissionRequest = {
        permission: 'feature:analytics'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockResolvedValueOnce(true);
      mockRepository.getUserRoles.mockResolvedValueOnce(['user']);

      await useCase.execute(request);

      expect(mockRepository.hasPermission).toHaveBeenCalledWith('feature:analytics', mockAuthUser.id);
    });

    it('should use specified userId when provided', async () => {
      const request: HasPermissionRequest = {
        permission: 'admin:users:edit',
        userId: 'specific-user-123'
      };

      mockRepository.hasPermission.mockResolvedValueOnce(true);
      mockRepository.getUserRoles.mockResolvedValueOnce(['admin']);

      await useCase.execute(request);

      expect(mockRepository.hasPermission).toHaveBeenCalledWith('admin:users:edit', 'specific-user-123');
      expect(mockRepository.getCurrentUser).not.toHaveBeenCalled();
    });
  });

  describe('Permission Checks', () => {
    const baseRequest: HasPermissionRequest = {
      permission: 'feature:reports'
    };

    it('should return permission granted when user has permission', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockResolvedValueOnce(true);
      mockRepository.getUserRoles.mockResolvedValueOnce(['manager', 'user']);

      const result = await useCase.execute(baseRequest);

      expect(result).toEqual({
        hasPermission: true,
        userRoles: ['manager', 'user'],
        reason: 'Permission granted'
      });
    });

    it('should return permission denied when user lacks permission', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockResolvedValueOnce(false);
      mockRepository.getUserRoles.mockResolvedValueOnce(['user']);

      const result = await useCase.execute(baseRequest);

      expect(result).toEqual({
        hasPermission: false,
        userRoles: ['user'],
        reason: 'User lacks required permission: feature:reports'
      });
    });

    it('should handle empty user roles', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockResolvedValueOnce(false);
      mockRepository.getUserRoles.mockResolvedValueOnce([]);

      const result = await useCase.execute(baseRequest);

      expect(result).toEqual({
        hasPermission: false,
        userRoles: [],
        reason: 'User lacks required permission: feature:reports'
      });
    });
  });

  describe('Resource-Based Permissions', () => {
    it('should handle resource-based permission checks', async () => {
      const resourceRequest: HasPermissionRequest = {
        permission: 'admin:users:edit',
        resource: 'user:12345',
        action: 'edit'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockResolvedValueOnce(true);
      mockRepository.getUserRoles.mockResolvedValueOnce(['admin']);

      const result = await useCase.execute(resourceRequest);

      expect(mockRepository.hasPermission).toHaveBeenCalledWith('admin:users:edit', mockAuthUser.id);
      expect(result.hasPermission).toBe(true);
      expect(result.userRoles).toEqual(['admin']);
    });

    it('should include resource and action information in permission checks', async () => {
      const complexRequest: HasPermissionRequest = {
        permission: 'project:documents:delete',
        resource: 'project:abc123',
        action: 'delete',
        userId: 'project-manager-456'
      };

      mockRepository.hasPermission.mockResolvedValueOnce(false);
      mockRepository.getUserRoles.mockResolvedValueOnce(['project_member']);

      const result = await useCase.execute(complexRequest);

      expect(result.hasPermission).toBe(false);
      expect(result.reason).toBe('User lacks required permission: project:documents:delete');
    });
  });

  describe('Sensitive Permission Logging', () => {
    const sensitivePermissions = [
      'admin:system:configure',
      'admin:users:delete',
      'manage_users:all',
      'view_sensitive_data:financial',
      'system_config:database'
    ];

    sensitivePermissions.forEach(permission => {
      it(`should log security event for sensitive permission: ${permission}`, async () => {
        const request: HasPermissionRequest = { permission };

        mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
        mockRepository.hasPermission.mockResolvedValueOnce(true);
        mockRepository.getUserRoles.mockResolvedValueOnce(['admin']);
        mockRepository.logSecurityEvent.mockResolvedValueOnce();

        await useCase.execute(request);

        expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            type: SecurityEventType.SUSPICIOUS_ACTIVITY,
            userId: mockAuthUser.id,
            severity: SecurityEventSeverity.LOW,
            details: expect.objectContaining({
              action: 'permission_check',
              permission,
              hasPermission: true,
              userRoles: ['admin'],
              message: `Permission check for ${permission}`
            })
          })
        );
      });
    });

    it('should include resource and action in security log when provided', async () => {
      const request: HasPermissionRequest = {
        permission: 'admin:users:delete',
        resource: 'user:target123',
        action: 'delete'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockResolvedValueOnce(false);
      mockRepository.getUserRoles.mockResolvedValueOnce(['manager']);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute(request);

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            resource: 'user:target123',
            actionType: 'delete',
            hasPermission: false
          })
        })
      );
    });

    it('should not log non-sensitive permissions', async () => {
      const nonSensitiveRequest: HasPermissionRequest = {
        permission: 'feature:basic_reports'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockResolvedValueOnce(true);
      mockRepository.getUserRoles.mockResolvedValueOnce(['user']);

      await useCase.execute(nonSensitiveRequest);

      expect(mockRepository.logSecurityEvent).not.toHaveBeenCalled();
    });

    it('should generate unique security event IDs', async () => {
      const request: HasPermissionRequest = {
        permission: 'admin:system:config'
      };

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockResolvedValueOnce(true);
      mockRepository.getUserRoles.mockResolvedValueOnce(['admin']);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await useCase.execute(request);

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^permission-check-\d+$/)
        })
      );
    });
  });

  describe('Error Handling', () => {
    const request: HasPermissionRequest = {
      permission: 'feature:analytics'
    };

    it('should handle and log repository errors', async () => {
      const repositoryError = new Error('Permission service unavailable');

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockRejectedValueOnce(repositoryError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute(request))
        .rejects.toThrow('Permission service unavailable');

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          userId: mockAuthUser.id,
          severity: SecurityEventSeverity.MEDIUM,
          details: expect.objectContaining({
            action: 'permission_check_failed',
            permission: 'feature:analytics',
            error: 'Permission service unavailable',
            message: 'Failed to check user permission'
          })
        })
      );
    });

    it('should handle unknown errors in logging', async () => {
      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockRejectedValueOnce('String error');
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute(request))
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
      const customError = new Error('Custom permission error');

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockRejectedValueOnce(customError);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute(request))
        .rejects.toThrow(customError);
    });

    it('should generate unique error event IDs', async () => {
      const error = new Error('Test error');

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockRejectedValueOnce(error);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      await expect(useCase.execute(request)).rejects.toThrow();

      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^permission-check-failed-\d+$/)
        })
      );
    });
  });

  describe('Role Context', () => {
    it('should include user roles in response for administrative decisions', async () => {
      const request: HasPermissionRequest = {
        permission: 'admin:dashboard'
      };

      const userRoles = ['admin', 'manager', 'user'];

      mockRepository.getCurrentUser.mockResolvedValueOnce(mockAuthUser);
      mockRepository.hasPermission.mockResolvedValueOnce(true);
      mockRepository.getUserRoles.mockResolvedValueOnce(userRoles);

      const result = await useCase.execute(request);

      expect(result.userRoles).toEqual(userRoles);
      expect(mockRepository.getUserRoles).toHaveBeenCalledWith(mockAuthUser.id);
    });

    it('should handle role retrieval for specified userId', async () => {
      const request: HasPermissionRequest = {
        permission: 'feature:reports',
        userId: 'other-user-789'
      };

      mockRepository.hasPermission.mockResolvedValueOnce(false);
      mockRepository.getUserRoles.mockResolvedValueOnce(['guest']);

      const result = await useCase.execute(request);

      expect(mockRepository.getUserRoles).toHaveBeenCalledWith('other-user-789');
      expect(result.userRoles).toEqual(['guest']);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete permission check flow with resource and action', async () => {
      const comprehensiveRequest: HasPermissionRequest = {
        permission: 'admin:users:manage',
        userId: 'admin-user-123',
        resource: 'user:employee456',
        action: 'update_role'
      };

      mockRepository.hasPermission.mockResolvedValueOnce(true);
      mockRepository.getUserRoles.mockResolvedValueOnce(['admin', 'hr_manager']);
      mockRepository.logSecurityEvent.mockResolvedValueOnce();

      const result = await useCase.execute(comprehensiveRequest);

      // Verify complete flow
      expect(mockRepository.hasPermission).toHaveBeenCalledWith('admin:users:manage', 'admin-user-123');
      expect(mockRepository.getUserRoles).toHaveBeenCalledWith('admin-user-123');
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        hasPermission: true,
        userRoles: ['admin', 'hr_manager'],
        reason: 'Permission granted'
      });

      // Verify security logging includes all context
      expect(mockRepository.logSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            permission: 'admin:users:manage',
            resource: 'user:employee456',
            actionType: 'update_role',
            hasPermission: true,
            userRoles: ['admin', 'hr_manager']
          })
        })
      );
    });
  });
}); 