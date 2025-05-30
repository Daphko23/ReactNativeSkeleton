import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

/**
 * 🔍 Enterprise Sentry Configuration für Auth Feature
 *
 * Optimiert für:
 * - Auth-spezifisches Error Tracking
 * - Security Event Integration
 * - Performance Monitoring für Auth-Flows
 * - Sensible Daten-Filterung
 * - OAuth Provider URL-Sanitization
 * - Biometric/MFA Error Categorization
 */

interface SentryConfig {
  dsn: string;
  environment: string;
  debug: boolean;
  enableAutoSessionTracking: boolean;
  enableOutOfMemoryTracking: boolean;
  enableNativeCrashHandling: boolean;
  enableAutoPerformanceTracing: boolean;
  tracesSampleRate: number;
  beforeSend?: (event: Sentry.Event) => Sentry.Event | null;
}

interface AuthContext {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  roles?: string[];
  mfaEnabled?: boolean;
  biometricEnabled?: boolean;
  lastLoginAt?: string;
  sessionId?: string;
  authMethod?: string;
  securityLevel?: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityEvent {
  id: string;
  type:
    | 'login'
    | 'logout'
    | 'mfa_enabled'
    | 'password_change'
    | 'suspicious_activity';
  userId: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

class SentryService {
  private isInitialized = false;
  private authContext: AuthContext = {isAuthenticated: false};
  private securityEvents: SecurityEvent[] = [];

  /**
   * Initialisiert Sentry mit Enterprise Auth-Konfiguration
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('Sentry already initialized');
      return;
    }

    try {
      const config = await this.getConfig();

      Sentry.init({
        dsn: config.dsn,
        environment: config.environment,
        debug: config.debug,
        enableAutoSessionTracking: config.enableAutoSessionTracking,
        // enableOutOfMemoryTracking: config.enableOutOfMemoryTracking, // Not available in current Sentry version
        enableNativeCrashHandling: config.enableNativeCrashHandling,
        enableAutoPerformanceTracing: config.enableAutoPerformanceTracing,
        tracesSampleRate: config.tracesSampleRate,
        beforeSend: config.beforeSend as any, // Type compatibility fix

        // Release & Distribution Tracking
        release: await this.getRelease(),
        dist: await this.getDistribution(),

        // Integration Configuration
        integrations: [
          // Note: Use new Sentry v4+ API - old ReactNativeTracing is deprecated
          // TODO: Update to new performance monitoring when upgrading Sentry
        ],

        // Scope Configuration
        beforeBreadcrumb: this.beforeBreadcrumb,
        initialScope: {
          tags: await this.getInitialTags(),
          contexts: await this.getInitialContexts(),
        },
      });

      // Set initial User Context
      await this.setUserContext();

      this.isInitialized = true;
      console.log('✅ Sentry initialized successfully with Auth optimization');
    } catch (error) {
      console.error('❌ Failed to initialize Sentry:', error);
    }
  }

  /**
   * Generiert Enterprise Sentry-Konfiguration
   */
  private async getConfig(): Promise<SentryConfig> {
    const environment = Config.APP_ENV || 'development';
    const isProduction = environment === 'production';
    const isStaging = environment === 'staging';

    return {
      dsn: Config.SENTRY_DSN || '',
      environment,
      debug: !isProduction,
      enableAutoSessionTracking: true,
      enableOutOfMemoryTracking: isProduction || isStaging,
      enableNativeCrashHandling: true,
      enableAutoPerformanceTracing: isProduction || isStaging,
      tracesSampleRate: isProduction ? 0.1 : isStaging ? 0.5 : 1.0,
      beforeSend: this.beforeSend,
    };
  }

  /**
   * Enterprise Auth-aware Event Filter
   */
  private beforeSend = (event: Sentry.Event): Sentry.Event | null => {
    // Filtere Development-Errors
    if (Config.APP_ENV === 'development') {
      if (
        event.exception?.values?.[0]?.value?.includes('Network request failed')
      ) {
        return null;
      }
    }

    // Filtere sensible Auth-Daten
    if (event.request?.data) {
      event.request.data = this.sanitizeAuthData(event.request.data);
    }

    // Filtere sensible URLs
    if (event.request?.url) {
      event.request.url = this.sanitizeAuthUrl(event.request.url);
    }

    // Füge Auth-Context hinzu
    event.contexts = {
      ...event.contexts,
      auth: {
        ...this.authContext,
      },
      security: {
        recentEvents: this.securityEvents.slice(-5), // Letzte 5 Security Events
        riskLevel: this.calculateRiskLevel(),
      },
    };

    // Füge Enterprise Context hinzu
    event.extra = {
      ...event.extra,
      timestamp: new Date().toISOString(),
      buildNumber: Config.APP_BUILD_NUMBER,
      authState: this.authContext.isAuthenticated
        ? 'authenticated'
        : 'anonymous',
      securityLevel: this.authContext.securityLevel || 'low',
      sessionId: this.authContext.sessionId,
    };

    // Kategorisiere Auth-Errors
    if (this.isAuthError(event)) {
      event.tags = {
        ...event.tags,
        errorCategory: 'auth',
        authMethod: this.getAuthMethodFromError(event),
        securityImpact: this.getSecurityImpact(event),
      };

      // Füge Auth-spezifische Fingerprints hinzu
      event.fingerprint = this.getAuthFingerprint(event);
    }

    // Kategorisiere Biometric Errors
    if (this.isBiometricError(event)) {
      event.tags = {
        ...event.tags,
        errorCategory: 'biometric',
        biometricType: this.getBiometricType(event),
      };
    }

    // Kategorisiere MFA Errors
    if (this.isMFAError(event)) {
      event.tags = {
        ...event.tags,
        errorCategory: 'mfa',
        mfaType: this.getMFAType(event),
      };
    }

    return event;
  };

  /**
   * Enterprise Auth-aware Breadcrumb Filter
   */
  private beforeBreadcrumb = (
    breadcrumb: Sentry.Breadcrumb
  ): Sentry.Breadcrumb | null => {
    // Filtere sensible Navigation-Events
    if (
      breadcrumb.category === 'navigation' &&
      breadcrumb.data?.to?.includes('password')
    ) {
      return null;
    }

    // Filtere sensible HTTP-Breadcrumbs
    if (breadcrumb.category === 'http') {
      if (breadcrumb.data?.url) {
        breadcrumb.data.url = this.sanitizeAuthUrl(breadcrumb.data.url);
      }
      if (breadcrumb.data?.data) {
        breadcrumb.data.data = this.sanitizeAuthData(breadcrumb.data.data);
      }
    }

    // Füge Auth-Context zu relevanten Breadcrumbs hinzu
    if (this.isAuthRelatedBreadcrumb(breadcrumb)) {
      breadcrumb.data = {
        ...breadcrumb.data,
        authState: this.authContext.isAuthenticated,
        userId: this.authContext.userId,
      };
    }

    return breadcrumb;
  };

  /**
   * Generiert Release-Information
   */
  private async getRelease(): Promise<string> {
    const version = await DeviceInfo.getVersion();
    const buildNumber = await DeviceInfo.getBuildNumber();
    return `${Config.APP_NAME}@${version}+${buildNumber}`;
  }

  /**
   * Generiert Distribution-Information
   */
  private async getDistribution(): Promise<string> {
    return await DeviceInfo.getBuildNumber();
  }

  /**
   * Generiert initiale Tags
   */
  private async getInitialTags(): Promise<Record<string, string>> {
    return {
      platform: await DeviceInfo.getSystemName(),
      version: await DeviceInfo.getSystemVersion(),
      device: await DeviceInfo.getModel(),
      brand: await DeviceInfo.getBrand(),
      carrier: await DeviceInfo.getCarrier(),
      buildType: Config.APP_ENV || 'development',
      hasHermes:
        typeof HermesInternal === 'object' && HermesInternal !== null
          ? 'true'
          : 'false',
      isBridgeless:
        typeof (global as any).RN$Bridgeless === 'boolean'
          ? (global as any).RN$Bridgeless.toString()
          : 'false',
    };
  }

  /**
   * Generiert initiale Contexts
   */
  private async getInitialContexts(): Promise<Record<string, any>> {
    return {
      device: {
        name: await DeviceInfo.getDeviceName(),
        id: await DeviceInfo.getUniqueId(),
        type: await DeviceInfo.getDeviceType(),
        isEmulator: await DeviceInfo.isEmulator(),
        isTablet: await DeviceInfo.isTablet(),
        hasNotch: await DeviceInfo.hasNotch(),
        hasDynamicIsland: await DeviceInfo.hasDynamicIsland(),
      },
      app: {
        name: Config.APP_NAME,
        version: await DeviceInfo.getVersion(),
        buildNumber: await DeviceInfo.getBuildNumber(),
        bundleId: await DeviceInfo.getBundleId(),
        environment: Config.APP_ENV,
      },
    };
  }

  // ==========================================
  // 🔐 AUTH CONTEXT MANAGEMENT
  // ==========================================

  /**
   * Setzt User Context mit Enterprise Auth-Informationen
   */
  async setUserContext(user?: {
    id: string;
    email?: string;
    username?: string;
    roles?: string[];
    mfaEnabled?: boolean;
    biometricEnabled?: boolean;
    lastLoginAt?: Date;
    sessionId?: string;
    authMethod?: string;
    [key: string]: any;
  }): Promise<void> {
    if (user) {
      this.authContext = {
        isAuthenticated: true,
        userId: user.id,
        email: user.email,
        roles: user.roles,
        mfaEnabled: user.mfaEnabled,
        biometricEnabled: user.biometricEnabled,
        lastLoginAt: user.lastLoginAt?.toISOString(),
        sessionId: user.sessionId,
        authMethod: user.authMethod,
        securityLevel: this.calculateSecurityLevel(user),
      };

      Sentry.setUser({
        ...user,
      });

      // Setze Auth-spezifische Tags
      this.setAuthTag('user_authenticated', 'true');
      this.setAuthTag('mfa_enabled', user.mfaEnabled ? 'true' : 'false');
      this.setAuthTag(
        'biometric_enabled',
        user.biometricEnabled ? 'true' : 'false'
      );
      this.setAuthTag('auth_method', user.authMethod || 'unknown');
      this.setAuthTag(
        'security_level',
        this.authContext.securityLevel || 'low'
      );

      if (user.roles && user.roles.length > 0) {
        this.setAuthTag('user_roles', user.roles.join(','));
      }
    } else {
      this.authContext = {isAuthenticated: false};
      Sentry.setUser(null);
      this.setAuthTag('user_authenticated', 'false');
    }
  }

  /**
   * Setzt Auth-spezifische Tags
   */
  setAuthTag(key: string, value: string): void {
    Sentry.setTag(`auth.${key}`, value);
  }

  /**
   * Setzt allgemeine Tags
   */
  setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  /**
   * Setzt Context-Informationen
   */
  setContext(key: string, context: Record<string, any>): void {
    Sentry.setContext(key, context);
  }

  // ==========================================
  // 🍞 BREADCRUMB MANAGEMENT
  // ==========================================

  /**
   * Fügt Auth-spezifische Breadcrumbs hinzu
   */
  addAuthBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
  }): void {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'auth',
      level: breadcrumb.level || 'info',
      data: {
        ...breadcrumb.data,
        authState: this.authContext.isAuthenticated,
        userId: this.authContext.userId,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Fügt allgemeine Breadcrumbs hinzu
   */
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
  }): void {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'app',
      level: breadcrumb.level || 'info',
      data: {
        ...breadcrumb.data,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // ==========================================
  // 🚨 ERROR TRACKING
  // ==========================================

  /**
   * Erfasst Auth-spezifische Exceptions
   */
  captureAuthException(
    error: Error,
    context?: {
      authMethod?: string;
      step?: string;
      tags?: Record<string, string>;
      extra?: Record<string, any>;
      level?: Sentry.SeverityLevel;
    }
  ): void {
    Sentry.withScope((scope: Sentry.Scope) => {
      // Setze Auth-spezifische Tags
      scope.setTag('errorCategory', 'auth');
      if (context?.authMethod) {
        scope.setTag('authMethod', context.authMethod);
      }
      if (context?.step) {
        scope.setTag('authStep', context.step);
      }

      // Setze zusätzliche Tags
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      // Setze zusätzliche Daten
      scope.setExtra('authContext', this.authContext);
      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      // Setze Level
      if (context?.level) {
        scope.setLevel(context.level);
      }

      Sentry.captureException(error);
    });
  }

  /**
   * Erfasst allgemeine Exceptions
   */
  captureException(
    error: Error,
    context?: {
      tags?: Record<string, string>;
      extra?: Record<string, any>;
      level?: Sentry.SeverityLevel;
    }
  ): void {
    Sentry.withScope((scope: Sentry.Scope) => {
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      if (context?.level) {
        scope.setLevel(context.level);
      }

      Sentry.captureException(error);
    });
  }

  // ==========================================
  // 📝 MESSAGE TRACKING
  // ==========================================

  /**
   * Erfasst Auth-spezifische Messages
   */
  captureAuthMessage(
    message: string,
    context?: {
      authMethod?: string;
      step?: string;
      level?: Sentry.SeverityLevel;
      tags?: Record<string, string>;
      extra?: Record<string, any>;
    }
  ): void {
    Sentry.withScope((scope: Sentry.Scope) => {
      scope.setTag('messageCategory', 'auth');
      if (context?.authMethod) {
        scope.setTag('authMethod', context.authMethod);
      }
      if (context?.step) {
        scope.setTag('authStep', context.step);
      }

      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      scope.setExtra('authContext', this.authContext);
      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      Sentry.captureMessage(message, context?.level || 'info');
    });
  }

  /**
   * Erfasst allgemeine Messages
   */
  captureMessage(
    message: string,
    context?: {
      level?: Sentry.SeverityLevel;
      tags?: Record<string, string>;
      extra?: Record<string, any>;
    }
  ): void {
    Sentry.withScope((scope: Sentry.Scope) => {
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      Sentry.captureMessage(message, context?.level || 'info');
    });
  }

  // ==========================================
  // 📊 PERFORMANCE TRACKING
  // ==========================================

  /**
   * Startet Auth-spezifische Performance-Transaktion
   */
  startAuthTransaction(name: string, op: string): any {
    // TODO: Update to new Sentry v4+ transaction API
    console.log('Auth transaction started:', name, op);
    return null;
  }

  /**
   * Startet allgemeine Performance-Transaktion
   */
  startTransaction(name: string, op: string): any {
    // TODO: Update to new Sentry v4+ transaction API
    console.log('Transaction started:', name, op);
    return null;
  }

  // ==========================================
  // 🛡️ SECURITY EVENT TRACKING
  // ==========================================

  /**
   * Fügt Security Event hinzu
   */
  addSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);

    // Behalte nur die letzten 50 Events
    if (this.securityEvents.length > 50) {
      this.securityEvents = this.securityEvents.slice(-50);
    }

    // Sende kritische Events sofort an Sentry
    if (event.severity === 'critical' || event.severity === 'high') {
      this.captureAuthMessage(`Security Event: ${event.type}`, {
        level: event.severity === 'critical' ? 'error' : 'warning',
        tags: {
          securityEventType: event.type,
          severity: event.severity,
        },
        extra: {
          securityEvent: event,
        },
      });
    }
  }

  // ==========================================
  // 🔧 PRIVATE HELPER METHODS
  // ==========================================

  /**
   * Sanitisiert sensible Auth-Daten
   */
  private sanitizeAuthData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sensitiveFields = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'key',
      'credential',
      'authorization',
      'auth',
      'session',
      'cookie',
      'mfaCode',
      'verificationCode',
      'otp',
      'pin',
      'biometric',
    ];

    const sanitized = {...data};

    const sanitizeRecursive = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;

      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          obj[key] = '[FILTERED]';
        } else if (typeof value === 'object' && value !== null) {
          obj[key] = sanitizeRecursive(value);
        }
      }
      return obj;
    };

    return sanitizeRecursive(sanitized);
  }

  /**
   * Sanitisiert sensible URLs
   */
  private sanitizeAuthUrl(url: string): string {
    if (!url) return url;

    // OAuth Provider URLs
    if (this.isOAuthUrl(url)) {
      const urlObj = new URL(url);
      urlObj.searchParams.delete('access_token');
      urlObj.searchParams.delete('refresh_token');
      urlObj.searchParams.delete('code');
      urlObj.searchParams.delete('state');
      urlObj.searchParams.delete('client_secret');
      return urlObj.toString();
    }

    // Allgemeine Auth-Parameter
    return url.replace(
      /([?&])(token|key|secret|password|auth)=[^&]*/gi,
      '$1$2=[FILTERED]'
    );
  }

  /**
   * Prüft ob URL eine OAuth-URL ist
   */
  private isOAuthUrl(url?: string): boolean {
    if (!url) return false;

    const oauthDomains = [
      'accounts.google.com',
      'appleid.apple.com',
      'login.microsoftonline.com',
      'oauth.twitter.com',
      'www.facebook.com',
      'github.com',
      'linkedin.com',
    ];

    return oauthDomains.some(domain => url.includes(domain));
  }

  /**
   * Prüft ob Event ein Auth-Error ist
   */
  private isAuthError(event: Sentry.Event): boolean {
    const authKeywords = [
      'auth',
      'login',
      'password',
      'token',
      'credential',
      'session',
      'mfa',
      'biometric',
      'oauth',
      'unauthorized',
      'forbidden',
    ];

    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';
    const errorType = event.exception?.values?.[0]?.type?.toLowerCase() || '';

    return authKeywords.some(
      keyword => errorMessage.includes(keyword) || errorType.includes(keyword)
    );
  }

  /**
   * Prüft ob Event ein Biometric-Error ist
   */
  private isBiometricError(event: Sentry.Event): boolean {
    const biometricKeywords = ['biometric', 'touchid', 'faceid', 'fingerprint'];
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';
    return biometricKeywords.some(keyword => errorMessage.includes(keyword));
  }

  /**
   * Prüft ob Event ein MFA-Error ist
   */
  private isMFAError(event: Sentry.Event): boolean {
    const mfaKeywords = ['mfa', 'totp', 'otp', 'verification', 'factor'];
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';
    return mfaKeywords.some(keyword => errorMessage.includes(keyword));
  }

  /**
   * Extrahiert Auth-Methode aus Error
   */
  private getAuthMethodFromError(event: Sentry.Event): string {
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';

    if (errorMessage.includes('google')) return 'google';
    if (errorMessage.includes('apple')) return 'apple';
    if (errorMessage.includes('microsoft')) return 'microsoft';
    if (errorMessage.includes('biometric')) return 'biometric';
    if (errorMessage.includes('mfa') || errorMessage.includes('totp'))
      return 'mfa';
    if (errorMessage.includes('email')) return 'email';

    return 'unknown';
  }

  /**
   * Bestimmt Security Impact
   */
  private getSecurityImpact(event: Sentry.Event): string {
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';

    if (
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('forbidden')
    )
      return 'high';
    if (errorMessage.includes('mfa') || errorMessage.includes('biometric'))
      return 'medium';

    return 'low';
  }

  /**
   * Generiert Auth-spezifische Fingerprints
   */
  private getAuthFingerprint(event: Sentry.Event): string[] {
    const authMethod = this.getAuthMethodFromError(event);
    const errorType = event.exception?.values?.[0]?.type || 'unknown';

    return ['auth', authMethod, errorType];
  }

  /**
   * Extrahiert Biometric-Type
   */
  private getBiometricType(event: Sentry.Event): string {
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';

    if (errorMessage.includes('touchid')) return 'touchid';
    if (errorMessage.includes('faceid')) return 'faceid';
    if (errorMessage.includes('fingerprint')) return 'fingerprint';

    return 'unknown';
  }

  /**
   * Extrahiert MFA-Type
   */
  private getMFAType(event: Sentry.Event): string {
    const errorMessage =
      event.exception?.values?.[0]?.value?.toLowerCase() || '';

    if (errorMessage.includes('totp')) return 'totp';
    if (errorMessage.includes('sms')) return 'sms';
    if (errorMessage.includes('email')) return 'email';

    return 'unknown';
  }

  /**
   * Prüft ob Breadcrumb Auth-related ist
   */
  private isAuthRelatedBreadcrumb(breadcrumb: Sentry.Breadcrumb): boolean {
    const authCategories = ['auth', 'navigation', 'http'];
    const authKeywords = ['login', 'logout', 'auth', 'mfa', 'biometric'];

    if (authCategories.includes(breadcrumb.category || '')) {
      return true;
    }

    const message = breadcrumb.message?.toLowerCase() || '';
    return authKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Berechnet Security Level basierend auf User-Daten
   */
  private calculateSecurityLevel(
    user: any
  ): 'low' | 'medium' | 'high' | 'critical' {
    let score = 0;

    if (user.mfaEnabled) score += 2;
    if (user.biometricEnabled) score += 1;
    if (user.roles?.includes('admin')) score += 2;
    if (user.roles?.includes('moderator')) score += 1;

    if (score >= 4) return 'critical';
    if (score >= 3) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }

  /**
   * Berechnet Risk Level basierend auf Security Events
   */
  private calculateRiskLevel(): 'low' | 'medium' | 'high' | 'critical' {
    const recentEvents = this.securityEvents.filter(
      event => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000 // Letzte 24h
    );

    const criticalEvents = recentEvents.filter(
      e => e.severity === 'critical'
    ).length;
    const highEvents = recentEvents.filter(e => e.severity === 'high').length;

    if (criticalEvents > 0) return 'critical';
    if (highEvents > 2) return 'high';
    if (recentEvents.length > 5) return 'medium';
    return 'low';
  }

  /**
   * Getter für Initialisierungsstatus
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}

// Singleton Export
export const sentryService = new SentryService();
export default sentryService;
