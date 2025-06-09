/**
 * @file auth-user-test.factory.ts
 * @description Factory for creating mock AuthUser instances for testing purposes.
 */

import { AuthUser, AuthUserMetadata, AuthUserProfile } from '../domain/entities/auth-user.entity';
import { UserStatus, UserRole } from '../domain/types/security.types';

/**
 * @interface AuthUserTestData
 * @description Simplified data structure for creating test AuthUser entities
 */
export interface AuthUserTestData {
  id?: string;
  email?: string;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
  role?: UserRole;
  displayName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  mfaEnabled?: boolean;
  biometricEnabled?: boolean;
  lastLoginAt?: string | Date | null;
  // Legacy properties for test compatibility
  roles?: string[];
  permissions?: string[];
  photoURL?: string;
  mfaFactors?: any[];
}

/**
 * @function createMockAuthUser
 * @description Create a mock AuthUser entity for testing
 * @param overrides - Partial data to override defaults
 * @returns AuthUser entity instance
 */
export function createMockAuthUser(overrides: AuthUserTestData = {}): AuthUser {
  const now = new Date().toISOString();
  
  // Convert lastLoginAt to string if it's a Date object, or keep as string/null/undefined
  let lastLoginAtString: string | undefined;
  if (overrides.lastLoginAt !== undefined && overrides.lastLoginAt !== null) {
    if (overrides.lastLoginAt instanceof Date) {
      lastLoginAtString = overrides.lastLoginAt.toISOString();
    } else {
      lastLoginAtString = overrides.lastLoginAt;
    }
  } else {
    lastLoginAtString = undefined;
  }
  
  const metadata: AuthUserMetadata = {
    lastLoginAt: lastLoginAtString,
    lastActiveAt: now,
    loginCount: 1,
    deviceCount: 1,
    mfaEnabled: overrides.mfaEnabled || false,
    biometricEnabled: overrides.biometricEnabled || false,
    securityScore: 75,
    riskLevel: 'low',
    language: 'en',
    timezone: 'UTC',
    // Legacy compatibility fields
    firstName: overrides.firstName || 'Test',
    lastName: overrides.lastName || 'User',
    displayName: overrides.displayName || `${overrides.firstName || 'Test'} ${overrides.lastName || 'User'}`,
    theme: 'light',
    sessionTimeout: 3600,
    preferences: {},
  };

  const profile: AuthUserProfile = {
    displayName: overrides.displayName || `${overrides.firstName || 'Test'} ${overrides.lastName || 'User'}`,
    avatarUrl: overrides.avatarUrl || overrides.photoURL,
    phoneNumber: overrides.phoneNumber,
    phoneVerified: overrides.phoneVerified || false,
  };

  const user = new AuthUser({
    id: overrides.id || 'test-user-id',
    email: overrides.email || 'test@example.com',
    emailVerified: overrides.emailVerified ?? true,
    firstName: overrides.firstName || 'Test',
    lastName: overrides.lastName || 'User',
    status: overrides.status || UserStatus.ACTIVE,
    role: overrides.role || UserRole.USER,
    createdAt: now,
    updatedAt: now,
    profile,
    metadata,
  });

  // Add legacy properties for backward compatibility in tests
  if (overrides.roles) {
    (user as any).roles = overrides.roles;
  }
  if (overrides.permissions) {
    (user as any).permissions = overrides.permissions;
  }
  if (overrides.mfaFactors) {
    (user as any).mfaFactors = overrides.mfaFactors;
  }
  if (overrides.photoURL) {
    (user as any).photoURL = overrides.photoURL;
  }
  if (overrides.phoneVerified !== undefined) {
    (user as any).phoneVerified = overrides.phoneVerified;
  }
  
  // Set lastLoginAt as both string (for metadata) and Date (for legacy compatibility)
  if (lastLoginAtString) {
    (user as any).lastLoginAt = new Date(lastLoginAtString);
  } else {
    (user as any).lastLoginAt = undefined;
  }
  
  (user as any).displayName = profile.displayName;
  (user as any).mfaEnabled = metadata.mfaEnabled;
  
  return user;
}

/**
 * @function createMockAuthUserWithRole
 * @description Create a mock AuthUser with specific role
 */
export function createMockAuthUserWithRole(role: UserRole, overrides: AuthUserTestData = {}): AuthUser {
  return createMockAuthUser({ ...overrides, role });
}

/**
 * @function createMockAuthUserWithStatus
 * @description Create a mock AuthUser with specific status
 */
export function createMockAuthUserWithStatus(status: UserStatus, overrides: AuthUserTestData = {}): AuthUser {
  return createMockAuthUser({ ...overrides, status });
}

/**
 * @function createMockPendingUser
 * @description Create a mock AuthUser with pending verification status
 */
export function createMockPendingUser(overrides: AuthUserTestData = {}): AuthUser {
  return createMockAuthUser({
    ...overrides,
    status: UserStatus.PENDING_VERIFICATION,
    emailVerified: false,
  });
}

/**
 * @function createMockAdminUser
 * @description Create a mock AuthUser with admin role
 */
export function createMockAdminUser(overrides: AuthUserTestData = {}): AuthUser {
  return createMockAuthUser({
    ...overrides,
    role: UserRole.ADMIN,
    email: overrides.email || 'admin@example.com',
  });
}

/**
 * @function createMockModeratorUser
 * @description Create a mock AuthUser with moderator role
 */
export function createMockModeratorUser(overrides: AuthUserTestData = {}): AuthUser {
  return createMockAuthUser({
    ...overrides,
    role: UserRole.MODERATOR,
    email: overrides.email || 'moderator@example.com',
  });
}

/**
 * @function createLegacyMockAuthUser
 * @description Create a mock AuthUser compatible with legacy interface format
 * This function creates AuthUser entity instances that support legacy property access
 */
export function createLegacyMockAuthUser(legacyData: any): AuthUser {
  const user = createMockAuthUser({
    id: legacyData.id,
    email: legacyData.email,
    emailVerified: legacyData.emailVerified,
    firstName: legacyData.displayName?.split(' ')[0] || 'Test',
    lastName: legacyData.displayName?.split(' ').slice(1).join(' ') || 'User',
    status: legacyData.status === 'active' ? UserStatus.ACTIVE :
            legacyData.status === 'suspended' ? UserStatus.SUSPENDED :
            legacyData.status === 'pending_verification' ? UserStatus.PENDING_VERIFICATION :
            UserStatus.ACTIVE,
    role: UserRole.USER,
    phoneNumber: legacyData.phoneNumber,
    phoneVerified: legacyData.phoneVerified,
    mfaEnabled: legacyData.mfaEnabled,
    lastLoginAt: legacyData.lastLoginAt?.toISOString(),
  });
  
  // Add legacy properties for backward compatibility
  (user as any).displayName = legacyData.displayName;
  (user as any).photoURL = legacyData.photoURL;
  (user as any).roles = legacyData.roles;
  (user as any).permissions = legacyData.permissions;
  (user as any).mfaEnabled = legacyData.mfaEnabled;
  (user as any).mfaFactors = legacyData.mfaFactors;
  (user as any).lastLoginAt = legacyData.lastLoginAt;
  (user as any).phoneVerified = legacyData.phoneVerified;
  
  return user;
} 