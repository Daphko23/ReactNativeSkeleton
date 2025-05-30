/**
 * @fileoverview DOMAIN-INTERFACE-003: OAuth Service Interface - Enterprise Standard
 * @description Domain Layer Interface für OAuth Provider Integration Service.
 * Definiert Verträge für OAuth-Authentication mit Google, Apple und Microsoft.
 * 
 * @businessRule BR-234: OAuth domain service interface definition
 * @businessRule BR-235: Multi-provider OAuth contracts
 * @businessRule BR-236: Secure OAuth token management interface
 * 
 * @securityNote OAuth flow interface specifications defined
 * @securityNote Provider authentication contracts established
 * @securityNote Token management interface requirements
 * 
 * @compliance OAuth 2.0 RFC 6749 interface compliance
 * @compliance OpenID Connect Core 1.0 interface standards
 * @compliance GDPR Article 20 data portability interface
 * 
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module IOAuthService
 * @namespace Auth.Domain.Services.Interfaces
 */

/**
 * @interface OAuthUser
 * @description OAuth user information from provider
 */
export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  provider: 'google' | 'apple' | 'microsoft';
}

/**
 * @interface OAuthResult
 * @description OAuth authentication result
 */
export interface OAuthResult {
  success: boolean;
  user?: OAuthUser;
  accessToken?: string;
  idToken?: string;
  error?: string;
}

/**
 * @interface GoogleOAuthConfig
 * @description Google OAuth configuration
 */
export interface GoogleOAuthConfig {
  webClientId: string;
  iosClientId?: string;
  androidClientId?: string;
}

/**
 * @interface MicrosoftOAuthConfig
 * @description Microsoft OAuth configuration
 */
export interface MicrosoftOAuthConfig {
  clientId: string;
  redirectUrl: string;
  scopes: string[];
}

/**
 * @interface AppleOAuthConfig
 * @description Apple OAuth configuration
 */
export interface AppleOAuthConfig {
  enabled: boolean;
}

/**
 * @interface OAuthConfig
 * @description OAuth provider configuration
 */
export interface OAuthConfig {
  google: GoogleOAuthConfig;
  apple: AppleOAuthConfig;
  microsoft: MicrosoftOAuthConfig;
}

/**
 * @interface IOAuthService
 * @description DOMAIN-INTERFACE-003: OAuth Service Contract
 */
export interface IOAuthService {
  signInWithGoogle(): Promise<OAuthResult>;
  signInWithApple(): Promise<OAuthResult>;
  signInWithMicrosoft(): Promise<OAuthResult>;
  getAvailableProviders(): Promise<{id: string; name: string; available: boolean}[]>;
  isProviderAvailable(provider: 'google' | 'apple' | 'microsoft'): Promise<boolean>;
  signOut(provider: 'google' | 'apple' | 'microsoft'): Promise<void>;
} 