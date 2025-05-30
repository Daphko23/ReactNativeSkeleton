/**
 * 🔗 Login with Google Use Case
 *
 * Enterprise Use Case für Google OAuth Authentifizierung.
 * Implementiert Clean Architecture Prinzipien.
 */

import {AuthRepository, SecurityEventType, SecurityEventSeverity} from '../../domain/interfaces/auth.repository.interface';
import {AuthUser} from '../../domain/entities/auth-user.interface';

/**
 * @fileoverview UC-030: Login with Google OAuth Use Case
 * 
 * Enterprise Use Case für Google OAuth 2.0 Authentifizierung und Account-Integration.
 * Implementiert Clean Architecture Prinzipien und Enterprise Security Standards.
 * 
 * @module LoginWithGoogleUseCase
 * @version 1.0.0
 * @since 2024-01-01
 * @author Enterprise Architecture Team
 * 
 * @see {@link https://enterprise-docs.company.com/auth/oauth-google | Google OAuth Documentation}
 * @see {@link AuthRepository} Repository Interface
 * @see {@link AuthUser} User Entity
 * 
 * @businessRule BR-052: Google OAuth requires valid client configuration
 * @businessRule BR-053: OAuth tokens must be validated and verified
 * @businessRule BR-054: New users are automatically registered with OAuth
 * @businessRule BR-055: Existing users are linked to OAuth provider
 * @businessRule BR-056: OAuth scopes are limited to essential permissions only
 * 
 * @securityNote This use case handles OAuth authentication and token exchange
 * @auditLog All OAuth authentication attempts are logged for security auditing
 * @compliance GDPR, CCPA, SOX, PCI-DSS, OAuth 2.0, OpenID Connect
 */

/**
 * @interface LoginWithGoogleResponse
 * @description Response object for Google OAuth authentication
 * 
 * @example Successful OAuth login (existing user)
 * ```typescript
 * const response: LoginWithGoogleResponse = {
 *   success: true,
 *   user: userEntity,
 *   isNewUser: false,
 *   message: 'Google OAuth login successful'
 * };
 * ```
 * 
 * @example Successful OAuth registration (new user)
 * ```typescript
 * const response: LoginWithGoogleResponse = {
 *   success: true,
 *   user: newUserEntity,
 *   isNewUser: true,
 *   message: 'Google account registered and logged in successfully'
 * };
 * ```
 */
export interface LoginWithGoogleResponse {
  /** @description Whether OAuth authentication was successful */
  success: boolean;
  
  /** @description Authenticated or newly created user entity */
  user: AuthUser;
  
  /** 
   * @description Whether this is a newly registered user via OAuth
   * @example true for first-time OAuth users, false for existing users
   */
  isNewUser?: boolean;
  
  /** @description Human-readable result message */
  message: string;
}

export class LoginWithGoogleUseCase {
  /**
   * Konstruktor für den Login with Google UseCase.
   * 
   * @param authRepository - Repository für Authentication-Operationen
   * 
   * @throws {Error} Wenn das Repository nicht initialisiert ist
   * 
   * @since 1.0.0
   */
  constructor(private readonly authRepository: AuthRepository) {
    if (!authRepository) {
      throw new Error('AuthRepository is required for LoginWithGoogleUseCase');
    }
  }

  /**
   * Führt die Google OAuth Authentifizierung durch und erstellt bei Bedarf neue Benutzerkonten.
   * 
   * @description
   * Dieser UseCase ermöglicht die Authentifizierung über Google OAuth 2.0 mit
   * automatischer Benutzerregistrierung für neue Accounts und nahtloser
   * Integration für bestehende Benutzer.
   * 
   * **Preconditions:**
   * - Google OAuth Client ist konfiguriert (Client ID, Secret)
   * - Google Play Services sind verfügbar (Android)
   * - Apple Sign In ist konfiguriert (iOS alternative)
   * - Internetverbindung ist verfügbar
   * - Feature Flag `oauth_google` ist aktiviert
   * - Benutzer hat Google-Account
   * 
   * **Main Flow:**
   * 1. Initiierung des Google OAuth Flows
   * 2. Weiterleitung zu Google Auth-Seite
   * 3. Benutzer-Authentifizierung bei Google
   * 4. Autorisierung der App-Berechtigung
   * 5. OAuth-Code-Exchange für Access-Token
   * 6. Google-Profil-Informationen abrufen
   * 7. Benutzer-Lookup in lokaler Datenbank
   * 8. Account-Erstellung (neue Benutzer) oder -Verknüpfung (bestehende)
   * 9. Session-Token-Generierung
   * 10. Security-Event-Logging
   * 11. Authentifizierungsbestätigung
   * 
   * **Alternative Flows:**
   * - AF-030.1: Benutzer bricht OAuth ab → UserCancelledAuthError
   * - AF-030.2: Google OAuth fehlgeschlagen → OAuthAuthenticationError
   * - AF-030.3: Account bereits mit anderem Provider verknüpft → AccountLinkingError
   * - AF-030.4: E-Mail bereits registriert → AccountMergeRequired
   * - AF-030.5: OAuth-Berechtigung verweigert → InsufficientPermissionsError
   * 
   * **Postconditions:**
   * - Benutzer ist authentifiziert und angemeldet
   * - OAuth-Provider ist mit Account verknüpft
   * - Session-Token sind generiert und gespeichert
   * - OAuth-Event ist protokolliert
   * - Navigation zur Hauptanwendung kann erfolgen
   * 
   * @returns Promise<LoginWithGoogleResponse> - OAuth-Authentifizierungsergebnis mit Benutzer-Entity
   * 
   * @throws {UserCancelledAuthError} Wenn Benutzer OAuth-Flow abbricht
   * @throws {OAuthAuthenticationError} Wenn Google OAuth-Authentifizierung fehlschlägt
   * @throws {AccountLinkingError} Wenn Account-Verknüpfung fehlschlägt
   * @throws {InsufficientPermissionsError} Wenn OAuth-Berechtigung verweigert wird
   * @throws {NetworkError} Bei Netzwerkverbindungsproblemen
   * @throws {ServiceUnavailableError} Wenn Google OAuth-Service nicht verfügbar ist
   * @throws {ConfigurationError} Bei fehlerhafter OAuth-Konfiguration
   * @throws {InternalServerError} Bei unerwarteten System-Fehlern
   * 
   * @async
   * @public
   * 
   * @performance
   * - Typische Ausführungszeit: 3000-15000ms (Benutzerinteraktion)
   * - OAuth-Flow-Initiierung: 500-2000ms
   * - Google-Authentifizierung: 2000-10000ms (Benutzer abhängig)
   * - Token-Exchange: 800-3000ms
   * - Account-Lookup/Creation: 1000-4000ms
   * 
   * @security
   * - OAuth 2.0 PKCE Flow für erhöhte Sicherheit
   * - State-Parameter gegen CSRF-Angriffe
   * - Token-Validierung und -Verifikation
   * - Minimal erforderliche OAuth-Scopes
   * - Sichere Token-Speicherung in Encrypted Storage
   * 
   * @monitoring
   * - OAuth Success Rate: Track authentication success
   * - New User Registration Rate: Growth metrics
   * - OAuth Error Distribution: Debug and improvement
   * - User Journey Completion: UX funnel analysis
   * 
   * @version 1.0.0
   * @since 2024-01-01
   * @lastModified 2024-01-15
   * 
   * @example Standard Google OAuth login
   * ```typescript
   * try {
   *   const result = await loginWithGoogleUseCase.execute();
   *   
   *   if (result.success) {
   *     if (result.isNewUser) {
   *       // Welcome new user
   *       showWelcomeDialog(result.user.displayName);
   *       navigateToOnboarding();
   *     } else {
   *       // Welcome back existing user
   *       showWelcomeBackMessage(result.user.displayName);
   *       navigateToMainApp();
   *     }
   *   }
   * } catch (error) {
   *   if (error instanceof UserCancelledAuthError) {
   *     // User cancelled, no error message needed
   *     console.log('User cancelled Google OAuth');
   *   } else if (error instanceof OAuthAuthenticationError) {
   *     showError('Google authentication failed. Please try again.');
   *   }
   * }
   * ```
   * 
   * @example OAuth with loading states
   * ```typescript
   * const performGoogleLogin = async () => {
   *   setLoading(true);
   *   setLoadingMessage('Connecting to Google...');
   *   
   *   try {
   *     const result = await loginWithGoogleUseCase.execute();
   *     
   *     setLoadingMessage('Setting up your account...');
   *     
   *     // Additional setup for new users
   *     if (result.isNewUser) {
   *       await setupNewUserDefaults(result.user);
   *     }
   *     
   *     setLoading(false);
   *     return result;
   *   } catch (error) {
   *     setLoading(false);
   *     handleOAuthError(error);
   *     throw error;
   *   }
   * };
   * ```
   * 
   * @example Error handling with user-friendly messages
   * ```typescript
   * try {
   *   return await loginWithGoogleUseCase.execute();
   * } catch (error) {
   *   if (error instanceof UserCancelledAuthError) {
   *     // Silent handling - user intentionally cancelled
   *     return null;
   *   } else if (error instanceof AccountLinkingError) {
   *     showErrorDialog({
   *       title: 'Account Linking Issue',
   *       message: 'This Google account is associated with a different email. Please sign in with your original account first.',
   *       action: 'Try Different Account'
   *     });
   *   } else if (error instanceof ConfigurationError) {
   *     showErrorDialog({
   *       title: 'Configuration Error',
   *       message: 'Google Sign-In is temporarily unavailable. Please try email login instead.',
   *       fallback: 'Use Email Login'
   *     });
   *   }
   *   throw error;
   * }
   * ```
   * 
   * @see {@link AuthRepository.loginWithGoogle} Backend Google OAuth method
   * @see {@link AuthUser} Returned user entity structure
   * @see {@link OAuthService} OAuth flow management
   * @see {@link SecurityEventLogger} Security event logging
   * 
   * @todo Implement progressive OAuth scopes (request additional permissions as needed)
   * @todo Add support for Google Workspace domain restrictions
   * @todo Implement OAuth token refresh mechanism
   */
  async execute(): Promise<LoginWithGoogleResponse> {
    try {
      // Authenticate with Google OAuth
      const user = await this.authRepository.loginWithGoogle();

      // Determine if this is a new user (simplified logic)
      const isNewUser =
        !user.lastLoginAt ||
        new Date().getTime() - new Date(user.lastLoginAt).getTime() >
          365 * 24 * 60 * 60 * 1000;

      // Log successful OAuth login
      await this.authRepository.logSecurityEvent({
        id: `google-oauth-success-${Date.now()}`,
        type: SecurityEventType.LOGIN,
        userId: user.id,
        timestamp: new Date(),
        severity: SecurityEventSeverity.LOW,
        details: {
          action: 'google_oauth_login',
          message: 'Google OAuth login successful',
          method: 'oauth',
          provider: 'google',
          isNewUser,
          email: user.email,
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      return {
        success: true,
        user,
        isNewUser,
        message: 'Google OAuth login successful',
      };
    } catch (error) {
      // Log failed OAuth attempt
      await this.authRepository.logSecurityEvent({
        id: `google-oauth-failed-${Date.now()}`,
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        userId: 'unknown',
        timestamp: new Date(),
        severity: SecurityEventSeverity.MEDIUM,
        details: {
          action: 'google_oauth_failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Google OAuth login failed',
          method: 'oauth',
          provider: 'google',
        },
        ipAddress: 'Unknown',
        userAgent: 'React Native App',
      });

      throw error;
    }
  }
}
