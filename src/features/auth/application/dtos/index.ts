/**
 * 📋 Auth Domain DTOs Barrel Export
 *
 * Zentrale Export-Datei für alle Auth Domain DTOs.
 * Domain Layer - definiert die "Sprache" der Anwendung.
 */

// Domain DTOs
export * from './auth.dto';

// Re-export commonly used types for convenience
export type {
  // Authentication
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,

  // Password Management
  UpdatePasswordRequest,
  PasswordResetRequest,
  PasswordValidationResult,

  // MFA
  EnableMFARequest,
  EnableMFAResponse,
  VerifyMFARequest,
  VerifyMFAResponse,

  // Biometric
  BiometricAuthRequest,
  BiometricAuthResponse,

  // OAuth
  OAuthLoginRequest,
  OAuthLoginResponse,

  // Security
  SecurityEventRequest,
  SecurityEventResponse,
  SuspiciousActivityResponse,

  // Sessions
  SessionRequest,
  SessionResponse,
  ActiveSessionsResponse,

  // RBAC
  PermissionRequest,
  PermissionResponse,
  UserRolesRequest,
  UserRolesResponse,

  // Common
  AuthResponse,
  PaginationRequest,
  PaginatedResponse,
} from './auth.dto';
