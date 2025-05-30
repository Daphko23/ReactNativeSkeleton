/**
 * @fileoverview DOMAIN-CONSTANTS-001: Enterprise Permission Registry
 * @description Type-safe Permission Registry für das RBAC System.
 * Definiert alle verfügbaren Permissions mit Kategorisierung und Beschreibungen.
 * 
 * @businessRule BR-600: Centralized permission definition registry
 * @businessRule BR-601: Type-safe permission validation
 * @businessRule BR-602: Permission categorization for organization
 * @businessRule BR-603: Role-permission mapping definitions
 * 
 * @architecture Type-safe const assertions for permissions
 * @architecture Hierarchical permission structure
 * @architecture Self-documenting permission descriptions
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module PermissionRegistry
 * @namespace Auth.Domain.Constants
 */

// ==========================================
// 🔐 CORE PERMISSIONS
// ==========================================

/**
 * @const PERMISSIONS
 * @description Comprehensive permission registry with type-safe definitions
 */
export const PERMISSIONS = {
  // User Management
  USER: {
    READ: 'user:read',
    WRITE: 'user:write', 
    DELETE: 'user:delete',
    LIST: 'user:list',
    PROFILE_EDIT: 'user:profile:edit',
    PASSWORD_CHANGE: 'user:password:change',
    MFA_MANAGE: 'user:mfa:manage',
    BIOMETRIC_MANAGE: 'user:biometric:manage',
  },

  // Admin User Management
  ADMIN_USER: {
    READ: 'admin:user:read',
    WRITE: 'admin:user:write',
    DELETE: 'admin:user:delete',
    LIST: 'admin:user:list',
    CREATE: 'admin:user:create',
    SUSPEND: 'admin:user:suspend',
    ACTIVATE: 'admin:user:activate',
    IMPERSONATE: 'admin:user:impersonate',
    ROLE_ASSIGN: 'admin:user:role:assign',
    PERMISSION_GRANT: 'admin:user:permission:grant',
  },

  // Role Management
  ROLE: {
    READ: 'role:read',
    WRITE: 'role:write',
    DELETE: 'role:delete',
    LIST: 'role:list',
    CREATE: 'role:create',
    ASSIGN: 'role:assign',
    REVOKE: 'role:revoke',
  },

  // System Administration
  SYSTEM: {
    CONFIG: 'system:config',
    MAINTENANCE: 'system:maintenance',
    BACKUP: 'system:backup',
    RESTORE: 'system:restore',
    LOGS_VIEW: 'system:logs:view',
    METRICS_VIEW: 'system:metrics:view',
    HEALTH_CHECK: 'system:health:check',
  },

  // Security & Compliance
  SECURITY: {
    AUDIT_VIEW: 'security:audit:view',
    EVENTS_VIEW: 'security:events:view', 
    POLICIES_MANAGE: 'security:policies:manage',
    MFA_ENFORCE: 'security:mfa:enforce',
    SESSION_MANAGE: 'security:session:manage',
    COMPLIANCE_VIEW: 'security:compliance:view',
    THREAT_ANALYSIS: 'security:threat:analysis',
  },

  // Content Management
  CONTENT: {
    READ: 'content:read',
    WRITE: 'content:write',
    DELETE: 'content:delete',
    PUBLISH: 'content:publish',
    MODERATE: 'content:moderate',
    ARCHIVE: 'content:archive',
  },

  // Reports & Analytics
  ANALYTICS: {
    VIEW: 'analytics:view',
    EXPORT: 'analytics:export',
    ADVANCED: 'analytics:advanced',
    CUSTOM_REPORTS: 'analytics:reports:custom',
    USER_METRICS: 'analytics:users:metrics',
    FINANCIAL: 'analytics:financial',
  },

  // Feature Access
  FEATURE: {
    BETA_ACCESS: 'feature:beta:access',
    PREMIUM: 'feature:premium',
    ENTERPRISE: 'feature:enterprise',
    API_ACCESS: 'feature:api:access',
    INTEGRATIONS: 'feature:integrations',
    EXPORT_DATA: 'feature:export:data',
  },

  // Support & Communication
  SUPPORT: {
    TICKET_VIEW: 'support:ticket:view',
    TICKET_CREATE: 'support:ticket:create',
    TICKET_RESOLVE: 'support:ticket:resolve',
    CHAT_ACCESS: 'support:chat:access',
    PRIORITY_SUPPORT: 'support:priority',
  },
};

// ==========================================
// 🎭 ROLE DEFINITIONS
// ==========================================

/**
 * @const ROLES
 * @description Standard role definitions with descriptions
 */
export const ROLES = {
  USER: {
    name: 'user',
    label: 'Standard User',
    description: 'Basic user with standard permissions',
    color: '#3b82f6',
    level: 1,
  },
  MODERATOR: {
    name: 'moderator', 
    label: 'Moderator',
    description: 'Content moderation and user support',
    color: '#f59e0b',
    level: 2,
  },
  ADMIN: {
    name: 'admin',
    label: 'Administrator', 
    description: 'System administration and user management',
    color: '#dc2626',
    level: 3,
  },
  SUPER_ADMIN: {
    name: 'super_admin',
    label: 'Super Administrator',
    description: 'Full system access and control',
    color: '#7c2d12',
    level: 4,
  },
};

// ==========================================
// 📋 ROLE-PERMISSION MAPPINGS
// ==========================================

/**
 * @const USER_PERMISSIONS
 * @description Base permissions for user role
 */
const USER_PERMISSIONS = [
  PERMISSIONS.USER.READ,
  PERMISSIONS.USER.PROFILE_EDIT,
  PERMISSIONS.USER.PASSWORD_CHANGE,
  PERMISSIONS.USER.MFA_MANAGE,
  PERMISSIONS.USER.BIOMETRIC_MANAGE,
  PERMISSIONS.CONTENT.READ,
  PERMISSIONS.SUPPORT.TICKET_CREATE,
  PERMISSIONS.SUPPORT.CHAT_ACCESS,
];

/**
 * @const MODERATOR_PERMISSIONS
 * @description Additional permissions for moderator role
 */
const MODERATOR_PERMISSIONS = [
  PERMISSIONS.CONTENT.MODERATE,
  PERMISSIONS.CONTENT.ARCHIVE,
  PERMISSIONS.SUPPORT.TICKET_VIEW,
  PERMISSIONS.SUPPORT.TICKET_RESOLVE,
  PERMISSIONS.ANALYTICS.VIEW,
  PERMISSIONS.USER.LIST,
];

/**
 * @const ADMIN_PERMISSIONS
 * @description Additional permissions for admin role
 */
const ADMIN_PERMISSIONS = [
  PERMISSIONS.ADMIN_USER.READ,
  PERMISSIONS.ADMIN_USER.WRITE,
  PERMISSIONS.ADMIN_USER.CREATE,
  PERMISSIONS.ADMIN_USER.SUSPEND,
  PERMISSIONS.ADMIN_USER.ACTIVATE,
  PERMISSIONS.ADMIN_USER.ROLE_ASSIGN,
  PERMISSIONS.ROLE.READ,
  PERMISSIONS.ROLE.LIST,
  PERMISSIONS.ROLE.ASSIGN,
  PERMISSIONS.ROLE.REVOKE,
  PERMISSIONS.SECURITY.AUDIT_VIEW,
  PERMISSIONS.SECURITY.EVENTS_VIEW,
  PERMISSIONS.SECURITY.SESSION_MANAGE,
  PERMISSIONS.ANALYTICS.EXPORT,
  PERMISSIONS.ANALYTICS.ADVANCED,
  PERMISSIONS.FEATURE.PREMIUM,
  PERMISSIONS.FEATURE.INTEGRATIONS,
  PERMISSIONS.CONTENT.WRITE,
  PERMISSIONS.CONTENT.DELETE,
  PERMISSIONS.CONTENT.PUBLISH,
];

/**
 * @const SUPER_ADMIN_PERMISSIONS
 * @description Additional permissions for super admin role
 */
const SUPER_ADMIN_PERMISSIONS = [
  PERMISSIONS.ADMIN_USER.DELETE,
  PERMISSIONS.ADMIN_USER.IMPERSONATE,
  PERMISSIONS.ADMIN_USER.PERMISSION_GRANT,
  PERMISSIONS.ROLE.WRITE,
  PERMISSIONS.ROLE.DELETE,
  PERMISSIONS.ROLE.CREATE,
  PERMISSIONS.SYSTEM.CONFIG,
  PERMISSIONS.SYSTEM.MAINTENANCE,
  PERMISSIONS.SYSTEM.BACKUP,
  PERMISSIONS.SYSTEM.RESTORE,
  PERMISSIONS.SYSTEM.LOGS_VIEW,
  PERMISSIONS.SYSTEM.METRICS_VIEW,
  PERMISSIONS.SYSTEM.HEALTH_CHECK,
  PERMISSIONS.SECURITY.POLICIES_MANAGE,
  PERMISSIONS.SECURITY.MFA_ENFORCE,
  PERMISSIONS.SECURITY.COMPLIANCE_VIEW,
  PERMISSIONS.SECURITY.THREAT_ANALYSIS,
  PERMISSIONS.ANALYTICS.FINANCIAL,
  PERMISSIONS.ANALYTICS.CUSTOM_REPORTS,
  PERMISSIONS.ANALYTICS.USER_METRICS,
  PERMISSIONS.FEATURE.BETA_ACCESS,
  PERMISSIONS.FEATURE.ENTERPRISE,
  PERMISSIONS.FEATURE.API_ACCESS,
  PERMISSIONS.FEATURE.EXPORT_DATA,
  PERMISSIONS.SUPPORT.PRIORITY_SUPPORT,
];

/**
 * @const ROLE_PERMISSIONS
 * @description Default permissions for each role with inheritance
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.USER.name]: USER_PERMISSIONS,
  [ROLES.MODERATOR.name]: [...USER_PERMISSIONS, ...MODERATOR_PERMISSIONS],
  [ROLES.ADMIN.name]: [...USER_PERMISSIONS, ...MODERATOR_PERMISSIONS, ...ADMIN_PERMISSIONS],
  [ROLES.SUPER_ADMIN.name]: [...USER_PERMISSIONS, ...MODERATOR_PERMISSIONS, ...ADMIN_PERMISSIONS, ...SUPER_ADMIN_PERMISSIONS],
};

// ==========================================
// 🔍 PERMISSION METADATA
// ==========================================

/**
 * @interface PermissionMetadata
 * @description Permission metadata structure
 */
export interface PermissionMetadata {
  category: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  auditRequired: boolean;
}

/**
 * @interface RoleDefinition
 * @description Role definition structure
 */
export interface RoleDefinition {
  name: string;
  label: string;
  description: string;
  color: string;
  level: number;
}

/**
 * @const PERMISSION_METADATA
 * @description Detailed metadata for each permission
 */
export const PERMISSION_METADATA: Record<string, PermissionMetadata> = {
  [PERMISSIONS.USER.READ]: {
    category: 'User Management',
    description: 'View own user profile and basic information',
    riskLevel: 'low',
    auditRequired: false,
  },
  [PERMISSIONS.USER.PROFILE_EDIT]: {
    category: 'User Management', 
    description: 'Edit own user profile information',
    riskLevel: 'low',
    auditRequired: false,
  },
  [PERMISSIONS.ADMIN_USER.DELETE]: {
    category: 'Admin User Management',
    description: 'Permanently delete user accounts',
    riskLevel: 'critical',
    auditRequired: true,
  },
  [PERMISSIONS.SYSTEM.CONFIG]: {
    category: 'System Administration',
    description: 'Configure system-wide settings',
    riskLevel: 'critical', 
    auditRequired: true,
  },
  [PERMISSIONS.SECURITY.THREAT_ANALYSIS]: {
    category: 'Security & Compliance',
    description: 'Access threat analysis and security insights',
    riskLevel: 'high',
    auditRequired: true,
  },
};

// ==========================================
// 📝 TYPE DEFINITIONS
// ==========================================

/**
 * @type Permission
 * @description Type-safe permission string
 */
export type Permission = string;

/**
 * @type Role  
 * @description Type-safe role string
 */
export type Role = 'user' | 'moderator' | 'admin' | 'super_admin';

// ==========================================
// 🛠️ UTILITY FUNCTIONS
// ==========================================

/**
 * Get all permissions for a role including inherited permissions
 */
export const getPermissionsForRole = (role: Role): string[] => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Get all available permissions
 */
export const getAllPermissions = (): string[] => {
  const allPerms: string[] = [];
  
  Object.values(PERMISSIONS).forEach(category => {
    Object.values(category).forEach(permission => {
      allPerms.push(permission);
    });
  });
  
  return allPerms;
};

/**
 * Get permission metadata
 */
export const getPermissionMetadata = (permission: Permission): PermissionMetadata | undefined => {
  return PERMISSION_METADATA[permission];
};

/**
 * Check if permission requires audit logging
 */
export const requiresAudit = (permission: Permission): boolean => {
  const metadata = getPermissionMetadata(permission);
  return metadata?.auditRequired || false;
};

/**
 * Get role by name with validation
 */
export const getRoleDefinition = (roleName: string): RoleDefinition | undefined => {
  return Object.values(ROLES).find(role => role.name === roleName);
};

/**
 * Get all role definitions
 */
export const getAllRoles = (): RoleDefinition[] => {
  return Object.values(ROLES);
};

/**
 * Check if user role has higher or equal level than required role
 */
export const hasRoleLevel = (userRole: Role, requiredRole: Role): boolean => {
  const userRoleDef = getRoleDefinition(userRole);
  const requiredRoleDef = getRoleDefinition(requiredRole);
  
  if (!userRoleDef || !requiredRoleDef) return false;
  
  return userRoleDef.level >= requiredRoleDef.level;
}; 