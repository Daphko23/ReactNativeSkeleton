/**
 * Auth Services - Application Layer  
 * Orchestrates authentication business logic
 */

// Export Interface (Contract)
export type { IAuthService } from '../../domain/interfaces/auth-service.interface';

// Implementation removed - Hooks use Container directly for better architecture
// AuthOrchestratorService eliminated to reduce redundancy

// Export Factory/Container
export { AuthServiceContainer } from '../../data/factories/auth-service.container';

// Export Service Types for Dependency Injection
export type {
  ICoreAuthService,
  IMFAService,
  IBiometricAuthService,
  IOAuthService,
  ISecurityService,
  IPasswordService,
  ISessionService,
  IRBACService,
} from '../interfaces/auth-service.interface';
