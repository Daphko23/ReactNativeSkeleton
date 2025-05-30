/**
 * 🎼 Auth Services Barrel Export
 *
 * Zentrale Export-Datei für alle Auth Services.
 * Implementiert Clean Architecture mit Interface-Driven Design.
 */

// Export Interface (Contract)
export type {IAuthService} from '../interfaces/auth-service.interface';

// Export Implementation (.impl.ts kennzeichnet konkrete Implementierung)
export {AuthOrchestratorService} from './auth-orchestrator.service.impl';

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
