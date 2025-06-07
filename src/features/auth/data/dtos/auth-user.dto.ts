/**
 * Auth User DTO - Data Transfer Object
 * Maps between external auth service and internal domain models
 */

export interface AuthUserDto {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  roles?: string[];
  metadata?: Record<string, any>;
  
  // Additional properties for repository compatibility
  displayName: string | null;
  photoURL: string | null;
  
  // OAuth provider support
  provider?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokenDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthResponseDto {
  user: AuthUserDto;
  tokens: AuthTokenDto;
} 