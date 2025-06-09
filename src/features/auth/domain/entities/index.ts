/**
 * @fileoverview AUTH ENTITIES INDEX - Einheitliche Exports für Type-Consistency
 * @description Zentrale Export-Datei für alle Auth-Entities und Typen.
 * Löst TypeScript-Type-Missmatches zwischen Interface und Entity.
 * 
 * @businessRule BR-625: Einheitliche AuthUser Type Definition
 * @businessRule BR-626: Kompatibilität zwischen Interface und Entity
 * @businessRule BR-627: Clean Architecture Type-Abstraction
 * 
 * @author ReactNativeSkeleton Enterprise Team
 * @since 2.0.0
 * @module Auth.Domain.Entities
 */

// ==========================================
// 🏗️ UNIFIED AUTH USER EXPORTS
// ==========================================

/**
 * Hauptexport: AuthUser Entity Class (bevorzugt für neue Implementierungen)
 * Diese Class-basierte Implementation bietet vollständige Enterprise-Features
 */
export { 
  AuthUser
} from './auth-user.entity';

export type { 
  AuthUserData,
  CreateAuthUserData,
  UpdateAuthUserData,
  AuthUserMetadata,
  AuthUserProfile
} from './auth-user.entity';

/**
 * Legacy Interface Support (für Kompatibilität)
 * Diese Interface-Version wird schrittweise durch Entity ersetzt
 */
export type { 
  AuthUser as AuthUserInterface,
  MFAFactor,
  UserSession
} from './auth-user.interface';

// ==========================================
// 🔄 TYPE COMPATIBILITY BRIDGE
// ==========================================

/**
 * @type AuthUserType
 * @description Unified type für beide Implementierungen
 * 
 * Ermöglicht schrittweise Migration von Interface zu Entity
 * ohne Breaking Changes in der gesamten Codebase.
 */
import type { AuthUser as AuthUserEntity } from './auth-user.entity';
import type { AuthUser as AuthUserInterface } from './auth-user.interface';

/**
 * Unified AuthUser Type für konsistente Verwendung
 * Bevorzugt Entity, fallback zu Interface
 */
export type UnifiedAuthUser = AuthUserEntity;

/**
 * Legacy compatibility - wird schrittweise entfernt
 * @deprecated Verwenden Sie AuthUser aus auth-user.entity.ts
 */
export type LegacyAuthUser = AuthUserInterface;

// ==========================================
// 🚀 MIGRATION GUIDE
// ==========================================

/**
 * MIGRATION GUIDE - Interface zu Entity:
 * 
 * ALT (Interface):
 * ```typescript
 * import { AuthUser } from '@features/auth/domain/entities/auth-user.interface';
 * const user: AuthUser = { id: '1', email: 'test@test.com', ... };
 * ```
 * 
 * NEU (Entity):
 * ```typescript
 * import { AuthUser } from '@features/auth/domain/entities/auth-user.entity';
 * const user = new AuthUser({ id: '1', email: 'test@test.com', ... });
 * ```
 * 
 * ÜBERGANG (Unified):
 * ```typescript
 * import { AuthUser } from '@features/auth/domain/entities';
 * // Verwendet automatisch die Entity-Implementation
 * ```
 */ 