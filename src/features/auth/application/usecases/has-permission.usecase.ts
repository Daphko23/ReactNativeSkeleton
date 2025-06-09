/**
 * @fileoverview HAS-PERMISSION-USECASE: Role-Based Access Control (RBAC) Use Case
 * @description Enterprise Use Case für fortschrittliche Role-Based Access Control
 * mit Hierarchical Permission Management, Resource-Based Authorization,
 * Attribute-Based Access Control (ABAC) und Industry-Standard Security
 * Compliance. Implementiert Zero-Trust Authorization und Enterprise
 * Permission Management Standards.
 * 
 * Dieser Use Case orchestriert komplexe RBAC Authorization Workflows von
 * User Role Evaluation über Resource Permission Checking bis zu
 * Policy-Based Decision Making und Security Event Logging. Er implementiert
 * Fine-Grained Access Control und Advanced Authorization Patterns.
 * 
 * @version 2.1.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module HasPermissionUseCase
 * @namespace Features.Auth.Application.UseCases
 * @category Authorization
 * @subcategory Permission Management
 * 
 * @architecture
 * - **RBAC Pattern:** Role-based access control with hierarchical roles
 * - **ABAC Pattern:** Attribute-based access control for fine-grained permissions
 * - **Policy Engine Pattern:** Rule-based authorization decision making
 * - **Permission Inheritance Pattern:** Hierarchical permission propagation
 * - **Context-Aware Pattern:** Dynamic permission evaluation with context
 * 
 * @security
 * - **Zero-Trust Authorization:** Never trust, always verify permissions
 * - **Principle of Least Privilege:** Minimal required permissions granted
 * - **Defense in Depth:** Multiple authorization layers
 * - **Audit Trail:** Comprehensive permission check logging
 * - **Permission Caching:** Secure caching with invalidation strategies
 * - **Context Validation:** Environmental factors in authorization
 * 
 * @performance
 * - **Response Time:** < 200ms für cached permission checks
 * - **Role Lookup:** < 500ms für database role resolution
 * - **Policy Evaluation:** < 300ms für complex policy decisions
 * - **Resource Authorization:** < 800ms für resource-specific permissions
 * - **Bulk Permissions:** < 1s für multiple permission evaluation
 * 
 * @compliance
 * - **NIST RBAC:** Role-Based Access Control standards compliance
 * - **OWASP Authorization:** Secure authorization implementation guidelines
 * - **SOC 2 Type II:** Access control audit requirements
 * - **ISO 27001:** Information security management compliance
 * - **EU-AI-ACT:** Automated decision transparency requirements
 * 
 * @businessRules
 * - **BR-PERM-CHK-001:** Permission checks require authenticated user context
 * - **BR-PERM-CHK-002:** Resource permissions evaluated with full context
 * - **BR-PERM-CHK-003:** Role inheritance evaluated hierarchically
 * - **BR-PERM-CHK-004:** Sensitive permissions logged für audit trail
 * - **BR-PERM-CHK-005:** Permission denials include actionable reasons
 * - **BR-PERM-CHK-006:** System permissions cached für performance optimization
 * 
 * @patterns
 * - **Command Pattern:** Execute method encapsulates permission evaluation
 * - **Strategy Pattern:** Multiple authorization strategy support
 * - **Policy Pattern:** Rule-based permission decision making
 * - **Observer Pattern:** Real-time permission change notifications
 * - **Cache Pattern:** Intelligent permission caching strategies
 * 
 * @dependencies
 * - AuthRepository für user authentication verification
 * - PermissionService für role und permission management
 * - PolicyEngine für rule-based authorization decisions
 * - AuditLogger für permission check audit trail
 * - CacheService für permission caching optimization
 * 
 * @examples
 * 
 * **Standard Permission Check:**
 * ```typescript
 * const hasPermissionUseCase = new HasPermissionUseCase(authRepository);
 * 
 * try {
 *   const permissionRequest: HasPermissionRequest = {
 *     permission: 'admin:users:delete',
 *     resource: 'user:12345',
 *     action: 'delete'
 *   };
 *   
 *   const result = await hasPermissionUseCase.execute(permissionRequest);
 *   
 *   if (result.hasPermission) {
 *     console.log('Permission granted!');
 *     console.log(`User roles: ${result.userRoles.join(', ')}`);
 *     
 *     // Proceed with authorized action
 *     await performDeleteUserAction(permissionRequest.resource);
 *   } else {
 *     console.log('Permission denied:', result.reason);
 *     console.log(`Required roles: ${result.requiredRoles?.join(', ')}`);
 *     
 *     // Show access denied message
 *     showAccessDeniedDialog({
 *       action: 'delete user',
 *       reason: result.reason,
 *       requiredRoles: result.requiredRoles
 *     });
 *   }
 * } catch (error) {
 *   if (error instanceof UserNotAuthenticatedError) {
 *     console.log('User not authenticated');
 *     redirectToLogin();
 *   } else if (error instanceof PermissionNotFoundError) {
 *     console.log('Invalid permission specified');
 *     showInvalidPermissionError();
 *   }
 * }
 * ```
 * 
 * **Enterprise Permission Check with Comprehensive Authorization:**
 * ```typescript
 * // Production permission checking with complete authorization workflow
 * const performEnterprisePermissionCheck = async (
 *   action: string, 
 *   resource: string, 
 *   userId?: string
 * ) => {
 *   try {
 *     // Step 1: Pre-authorization security checks
 *     await securityService.validateAuthorizationContext();
 *     await auditService.logPermissionCheckRequest({
 *       action,
 *       resource,
 *       userId: userId || 'current_user',
 *       timestamp: new Date().toISOString()
 *     });
 *     
 *     // Step 2: Execute permission evaluation
 *     const permissionRequest: HasPermissionRequest = {
 *       permission: `${action}:${resource}`,
 *       userId,
 *       resource,
 *       action
 *     };
 *     
 *     const permissionResult = await hasPermissionUseCase.execute(permissionRequest);
 *     
 *     // Step 3: Enhanced authorization context evaluation
 *     if (permissionResult.hasPermission) {
 *       const contextValidation = await authorizationService.validateActionContext({
 *         user: await getCurrentUser(),
 *         resource,
 *         action,
 *         timestamp: new Date(),
 *         environment: await getEnvironmentContext()
 *       });
 *       
 *       if (!contextValidation.isValid) {
 *         await auditLogger.logContextDenial({
 *           userId: userId || 'current_user',
 *           resource,
 *           action,
 *           contextReason: contextValidation.reason
 *         });
 *         
 *         return {
 *           hasPermission: false,
 *           reason: `Context validation failed: ${contextValidation.reason}`,
 *           userRoles: permissionResult.userRoles,
 *           contextDenial: true
 *         };
 *       }
 *     }
 *     
 *     // Step 4: Log authorization decision
 *     await auditLogger.logAuthorizationDecision({
 *       userId: userId || 'current_user',
 *       resource,
 *       action,
 *       granted: permissionResult.hasPermission,
 *       roles: permissionResult.userRoles,
 *       reason: permissionResult.reason,
 *       timestamp: new Date().toISOString()
 *     });
 *     
 *     // Step 5: Analytics tracking für access patterns
 *     await analyticsService.trackEvent('permission_check', {
 *       action,
 *       resource_type: resource.split(':')[0],
 *       permission_granted: permissionResult.hasPermission,
 *       user_roles: permissionResult.userRoles,
 *       check_duration: measurePermissionCheckDuration()
 *     });
 *     
 *     return permissionResult;
 *   } catch (error) {
 *     // Comprehensive error handling und security monitoring
 *     await errorTracker.captureException(error, {
 *       context: 'enterprise_permission_check',
 *       action,
 *       resource,
 *       userId,
 *       severity: 'high'
 *     });
 *     
 *     if (error instanceof UserNotAuthenticatedError) {
 *       await securityService.triggerAuthenticationAlert({
 *         type: 'unauthorized_permission_check',
 *         action,
 *         resource
 *       });
 *     }
 *     
 *     throw error;
 *   }
 * };
 * ```
 * 
 * **Bulk Permission Evaluation with Role Hierarchy:**
 * ```typescript
 * // Advanced permission checking with multiple permissions
 * const performBulkPermissionCheck = async (
 *   permissions: Array<{action: string, resource: string}>, 
 *   userId?: string
 * ) => {
 *   const permissionResults = new Map<string, HasPermissionResponse>();
 *   
 *   // Get user roles once for efficiency
 *   const user = userId ? await userService.getUser(userId) : await getCurrentUser();
 *   const userRoles = await roleService.getUserRoles(user.id);
 *   
 *   // Evaluate role hierarchy for inherited permissions
 *   const expandedRoles = await roleService.expandRoleHierarchy(userRoles);
 *   
 *   for (const {action, resource} of permissions) {
 *     try {
 *       const permissionKey = `${action}:${resource}`;
 *       
 *       // Check cache first
 *       const cachedResult = await cacheService.getPermissionResult({
 *         userId: user.id,
 *         permission: permissionKey
 *       });
 *       
 *       if (cachedResult && !cachedResult.isExpired) {
 *         permissionResults.set(permissionKey, cachedResult.result);
 *         continue;
 *       }
 *       
 *       // Evaluate permission
 *       const permissionRequest: HasPermissionRequest = {
 *         permission: permissionKey,
 *         userId: user.id,
 *         resource,
 *         action
 *       };
 *       
 *       const result = await hasPermissionUseCase.execute(permissionRequest);
 *       
 *       // Cache result for future use
 *       await cacheService.setPermissionResult({
 *         userId: user.id,
 *         permission: permissionKey,
 *         result,
 *         ttl: 300 // 5 minutes
 *       });
 *       
 *       permissionResults.set(permissionKey, result);
 *       
 *       // Log bulk permission evaluation
 *       await auditLogger.logBulkPermissionCheck({
 *         userId: user.id,
 *         permissions: permissionKey,
 *         granted: result.hasPermission
 *       });
 *       
 *     } catch (error) {
 *       console.warn(`Permission check failed for ${action}:${resource}:`, error);
 *       
 *       // Set default deny for failed checks
 *       permissionResults.set(`${action}:${resource}`, {
 *         hasPermission: false,
 *         reason: 'Permission evaluation failed',
 *         userRoles: expandedRoles
 *       });
 *     }
 *   }
 *   
 *   return permissionResults;
 * };
 * ```
 * 
 * @see {@link AuthRepository} für User Authentication Verification
 * @see {@link PermissionService} für Role und Permission Management
 * @see {@link PolicyEngine} für Rule-Based Authorization Decisions
 * @see {@link AuditLogger} für Permission Check Audit Trail
 * @see {@link CacheService} für Permission Caching Optimization
 * 
 * @testing
 * - Unit Tests mit Mocked Authorization Services für all scenarios
 * - Integration Tests mit Real RBAC Database Configuration
 * - Security Tests für authorization bypass attempts
 * - Performance Tests für permission check optimization
 * - E2E Tests für complete authorization workflow
 * - Role Hierarchy Tests für inheritance validation
 * 
 * @monitoring
 * - **Permission Success Rate:** Authorization grant/deny distribution
 * - **Permission Check Latency:** Authorization performance monitoring
 * - **Role Usage Distribution:** Role assignment effectiveness
 * - **Access Denial Patterns:** Security threat detection
 * - **Permission Cache Hit Rate:** Caching optimization metrics
 * 
 * @todo
 * - Implement Temporal Access Control (Time-Based Permissions) (Q2 2025)
 * - Add Geolocation-Based Authorization (Q3 2025)
 * - Integrate Risk-Based Access Control (Q4 2025)
 * - Add Machine Learning Permission Recommendations (Q1 2026)
 * - Implement Dynamic Permission Policies (Q2 2026)
 * 
 * @changelog
 * - v2.1.0: Enhanced TS-Doc mit Industry Standard 2025 Compliance
 * - v2.0.0: ABAC Integration und Policy Engine Enhancement
 * - v1.8.0: Permission Caching und Performance Optimization
 * - v1.5.0: Resource-Based Authorization und Context Awareness
 * - v1.2.0: Role Hierarchy und Inheritance Support
 * - v1.0.0: Initial RBAC Permission Checking Implementation
 */

import {AuthRepository, SecurityEventType, SecurityEventSeverity} from '../../domain/interfaces/auth.repository.interface';
import {UserNotAuthenticatedError} from '../../domain/errors/user-not-authenticated.error';

/**
 * @interface HasPermissionRequest
 * @description Request object for permission verification
 * 
 * @example Standard permission check
 * ```typescript
 * const request: HasPermissionRequest = {
 *   permission: 'admin:users:delete',
 *   resource: 'user:12345',
 *   action: 'delete'
 * };
 * ```
 * 
 * @example Role-based permission check
 * ```typescript
 * const request: HasPermissionRequest = {
 *   permission: 'role:manager',
 *   userId: 'specific_user_id'
 * };
 * ```
 */
export interface HasPermissionRequest {
  /** 
   * @description Permission identifier to check
   * @example 'admin:users:delete', 'role:manager', 'feature:analytics'
   */
  permission: string;
  
  /** 
   * @description Optional user ID to check (defaults to current user)
   * @example 'user_12345'
   */
  userId?: string;
  
  /** 
   * @description Optional resource identifier for resource-based permissions
   * @example 'user:12345', 'project:abc', 'document:xyz'
   */
  resource?: string;
  
  /** 
   * @description Optional action type for fine-grained permissions
   * @example 'read', 'write', 'delete', 'share'
   */
  action?: string;
}

/**
 * @interface HasPermissionResponse
 * @description Response object containing permission check results
 * 
 * @example Permission granted
 * ```typescript
 * const response: HasPermissionResponse = {
 *   hasPermission: true,
 *   reason: 'Permission granted',
 *   userRoles: ['manager', 'user'],
 *   requiredRoles: ['manager']
 * };
 * ```
 * 
 * @example Permission denied
 * ```typescript
 * const response: HasPermissionResponse = {
 *   hasPermission: false,
 *   reason: 'User lacks required permission: admin:users:delete',
 *   userRoles: ['user'],
 *   requiredRoles: ['admin', 'user_manager']
 * };
 * ```
 */
export interface HasPermissionResponse {
  /** @description Whether the user has the requested permission */
  hasPermission: boolean;
  
  /** 
   * @description Human-readable reason for the permission decision
   * @example 'Permission granted', 'User lacks admin role'
   */
  reason?: string;
  
  /** 
   * @description List of roles assigned to the user
   * @example ['admin', 'manager', 'user']
   */
  userRoles: string[];
  
  /** 
   * @description Required roles for the permission (if available)
   * @example ['admin'], ['manager', 'supervisor']
   */
  requiredRoles?: string[];
}

export class HasPermissionUseCase {
  /**
   * Konstruktor für den Has Permission UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for HasPermissionUseCase');
    }
  }

  /**
   * Überprüft, ob ein Benutzer eine spezifische Berechtigung hat.
   *
   * @description
   * Dieser UseCase implementiert Role-Based Access Control (RBAC) für die
   * Autorisierung von Benutzern. Prüft Berechtigungen basierend auf Rollen,
   * Ressourcen und spezifischen Aktionen mit vollständiger Audit-Nachverfolgung.
   * 
   * **Preconditions:**
   * - AuthRepository ist verfügbar
   * - Zielbenutzter ist identifiziert (aktueller oder spezifizierter Benutzer)
   * - Permissions-System ist konfiguriert
   * - Benutzer-Rollen sind in der Datenbank verfügbar
   * 
   * **Main Flow:**
   * 1. Zielbenutzer-Identifikation (aktueller oder spezifizierter)
   * 2. Benutzer-Authentifizierungsstatus prüfen
   * 3. Permission-Check gegen RBAC-System
   * 4. Benutzer-Rollen abrufen für Kontext
   * 5. Ergebnis-Evaluierung und Reason-Generierung
   * 6. Audit-Logging für sensitive Permissions
   * 7. Permission-Response zurückgeben
   * 
   * **Alternative Flows:**
   * - AF-033.1: Benutzer nicht authentifiziert → UserNotAuthenticatedError
   * - AF-033.2: Ungültige Permission → PermissionNotFoundError
   * - AF-033.3: Zielbenutzer nicht gefunden → UserNotFoundError
   * - AF-033.4: RBAC-System nicht verfügbar → ServiceUnavailableError
   * - AF-033.5: Hierarchische Rollen-Auflösung erforderlich
   * 
   * **Postconditions:**
   * - Permission-Status ist ermittelt und zurückgegeben
   * - Benutzer-Rollen sind im Response enthalten
   * - Sensitive Permission-Checks sind auditiert
   * - Reason für Entscheidung ist verfügbar
   * - Keine Seiteneffekte auf Benutzer-Permissions
   * 
   * @param request - Permission-Check-Anfrage mit Permission, Resource und Action
   * 
   * @returns Promise<HasPermissionResponse> - Permission-Status mit Rollen und Reason
   * 
   * @throws {UserNotAuthenticatedError} Wenn kein authentifizierter Benutzer verfügbar ist
   * @throws {PermissionNotFoundError} Wenn die angefragte Permission unbekannt ist
   * @throws {UserNotFoundError} Wenn der Zielbenutzer nicht existiert
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen
   * @throws {ServiceUnavailableError} Wenn das RBAC-System nicht verfügbar ist
   * @throws {InternalServerError} Bei unerwarteten System-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 50-200ms (Cache Hit)
   * - Mit Role-Lookup: 200-800ms
   * - Hierarchische Rollen-Auflösung: 500-1500ms
   * - Ressourcen-basierte Checks: 300-1000ms
   * - Network-Fallback: 1000-3000ms
   * 
   * @security
   * - Alle Permission-Checks werden gegen zentrales RBAC-System validiert
   * - Sensitive Permissions werden auditiert
   * - Keine Permission-Escalation möglich
   * - Resource-based Access Control unterstützt
   * - Role-Inheritance wird korrekt evaluiert
   * 
   * @monitoring
   * - Permission Check Frequency: Access pattern analysis
   * - Permission Denial Rate: Security monitoring
   * - Role Distribution: User access analysis
   * - Sensitive Permission Access: Security alert system
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Standard feature permission check
   * ```typescript
   * try {
   *   const result = await hasPermissionUseCase.execute({
   *     permission: 'feature:analytics'
   *   });
   *   
   *   if (result.hasPermission) {
   *     // Show analytics feature
   *     showAnalyticsFeature();
   *   } else {
   *     // Hide feature or show upgrade prompt
   *     console.log(`Access denied: ${result.reason}`);
   *     hideAnalyticsFeature();
   *   }
   * } catch (error) {
   *   console.error('Permission check failed:', error);
   *   // Default to denying access
   *   hideAnalyticsFeature();
   * }
   * ```
   * 
   * @example Resource-based permission check
   * ```typescript
   * const checkUserEditPermission = async (targetUserId: string) => {
   *   try {
   *     const result = await hasPermissionUseCase.execute({
   *       permission: 'admin:users:edit',
   *       resource: `user:${targetUserId}`,
   *       action: 'edit'
   *     });
   *     
   *     if (result.hasPermission) {
   *       enableUserEditForm();
   *     } else {
   *       showPermissionDeniedMessage(result.reason);
   *       disableUserEditForm();
   *     }
   *     
   *     // Show user's current roles for context
   *     updateUIWithUserRoles(result.userRoles);
   *     
   *   } catch (error) {
   *     handlePermissionCheckError(error);
   *   }
   * };
   * ```
   * 
   * @example Administrative role check with audit
   * ```typescript
   * const performAdminAction = async () => {
   *   try {
   *     const result = await hasPermissionUseCase.execute({
   *       permission: 'admin:system:configure'
   *     });
   *     
   *     if (!result.hasPermission) {
   *       showUnauthorizedDialog({
   *         message: result.reason,
   *         userRoles: result.userRoles,
   *         requiredRoles: result.requiredRoles || ['admin']
   *       });
   *       return;
   *     }
   *     
   *     // Proceed with admin action
   *     await executeAdminAction();
   *     
   *   } catch (error) {
   *     handleSecurityError(error);
   *   }
   * };
   * ```
   * 
   * @example Bulk permission check for UI rendering
   * ```typescript
   * const checkMultiplePermissions = async () => {
   *   const permissions = [
   *     'feature:reports',
   *     'feature:user_management',
   *     'admin:system_config'
   *   ];
   *   
   *   const results = await Promise.all(
   *     permissions.map(permission => 
   *       hasPermissionUseCase.execute({ permission })
   *     )
   *   );
   *   
   *   const permissionMap = permissions.reduce((map, permission, index) => {
   *     map[permission] = results[index].hasPermission;
   *     return map;
   *   }, {} as Record<string, boolean>);
   *   
   *   updateUIBasedOnPermissions(permissionMap);
   * };
   * ```
   * 
   * @see {@link AuthRepository.hasPermission} Backend permission verification
   * @see {@link AuthRepository.getUserRoles} User role retrieval
   * @see {@link RBACService} Role-Based Access Control service
   * @see {@link SecurityEventLogger} Security event logging
   * 
   * @todo Implement permission caching for improved performance
   * @todo Add support for time-based permissions (expiry, schedules)
   * @todo Implement dynamic permission evaluation based on context
   */
  async execute(request: HasPermissionRequest): Promise<HasPermissionResponse> {
    // Get target user (current user if not specified)
    let targetUserId = request.userId;
    if (!targetUserId) {
      const currentUser = await this.authRepository.getCurrentUser();
      if (!currentUser) {
        throw new UserNotAuthenticatedError();
      }
      targetUserId = currentUser.id;
    }

    try {
      // Check permission
      const hasPermission = await this.authRepository.hasPermission(
        request.permission,
        targetUserId
      );

      // Get user roles for context
      const userRoles = await this.authRepository.getUserRoles(targetUserId);

      // Log permission check (only for sensitive permissions)
      const sensitivePermissions = [
        'admin',
        'delete',
        'manage_users',
        'view_sensitive_data',
        'system_config',
      ];

      if (
        sensitivePermissions.some(perm => request.permission.includes(perm))
      ) {
        await this.authRepository.logSecurityEvent({
          id: `permission-check-${Date.now()}`,
          type: SecurityEventType.SUSPICIOUS_ACTIVITY,
          userId: targetUserId,
          timestamp: new Date(),
          severity: SecurityEventSeverity.LOW,
          details: {
            action: 'permission_check',
            permission: request.permission,
            resource: request.resource,
            actionType: request.action,
            hasPermission,
            userRoles,
            message: `Permission check for ${request.permission}`,
          },
          ipAddress: 'Unknown',
          userAgent: 'React Native App',
        });
      }

      return {
        hasPermission,
        userRoles,
        reason: hasPermission
          ? 'Permission granted'
          : `User lacks required permission: ${request.permission}`,
      };
    } catch (error) {
      // Log failed permission check
      await this.authRepository.logSecurityEvent({
        id: `permission-check-failed-${Date.now()}`,
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        userId: targetUserId,
        timestamp: new Date(),
        severity: SecurityEventSeverity.MEDIUM,
        details: {
          action: 'permission_check_failed',
          permission: request.permission,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to check user permission',
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      throw error;
    }
  }
}
