/**
 * Auth Datasource Interface
 * Defines contract for external auth data sources
 */

import { AuthUserDto, LoginRequestDto, RegisterRequestDto, AuthResponseDto } from '../dtos/auth-user.dto';

export interface AuthDatasource {
  login(request: LoginRequestDto): Promise<AuthResponseDto>;
  register(request: RegisterRequestDto): Promise<AuthResponseDto>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUserDto | null>;
  refreshToken(refreshToken: string): Promise<AuthResponseDto>;
  verifyEmail(token: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updatePassword(currentPassword: string, newPassword: string): Promise<void>;
  onAuthStateChanged(callback: (user: AuthUserDto | null) => void): () => void;
} 