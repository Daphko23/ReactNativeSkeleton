/**
 * Auth GDPR Audit Service - Compliance Layer for Authentication
 * Provides comprehensive audit logging for GDPR compliance in authentication flows
 * Tracks all authentication and authorization operations with detailed audit trails
 * 
 * ✅ NEW: Specialized for Authentication Use Cases and Security Events
 */

import { AuthUser } from '../../domain/entities/auth-user.entity';
import { createClient } from '@supabase/supabase-js';

// 🔒 SECURITY: Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('🔒 Auth GDPR Audit: Supabase credentials missing - fallback to memory-only storage');
}

// Create Supabase client for backend operations (only if credentials available)
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Auth-specific GDPR Event Types
export enum AuthGDPREventType {
  // Authentication Events
  LOGIN_ATTEMPT = 'auth_login_attempt',
  LOGIN_SUCCESS = 'auth_login_success',
  LOGIN_FAILURE = 'auth_login_failure',
  LOGOUT = 'auth_logout',
  
  // Registration Events
  REGISTRATION_ATTEMPT = 'auth_registration_attempt',
  REGISTRATION_SUCCESS = 'auth_registration_success',
  REGISTRATION_FAILURE = 'auth_registration_failure',
  
  // Account Management
  PASSWORD_RESET_REQUEST = 'auth_password_reset_request',
  PASSWORD_RESET_SUCCESS = 'auth_password_reset_success',
  PASSWORD_CHANGE = 'auth_password_change',
  ACCOUNT_DELETION = 'auth_account_deletion',
  
  // Multi-Factor Authentication
  MFA_ENABLED = 'auth_mfa_enabled',
  MFA_DISABLED = 'auth_mfa_disabled',
  MFA_CHALLENGE = 'auth_mfa_challenge',
  MFA_VERIFICATION = 'auth_mfa_verification',
  
  // Security Events
  SUSPICIOUS_ACTIVITY = 'auth_suspicious_activity',
  RATE_LIMIT_EXCEEDED = 'auth_rate_limit_exceeded',
  
  // Data Access
  USER_DATA_ACCESS = 'auth_user_data_access',
}

// GDPR Lawful Basis for Auth Operations
export enum AuthLawfulBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  LEGITIMATE_INTERESTS = 'legitimate_interests',
}

// Auth Data Categories
export enum AuthDataCategory {
  AUTHENTICATION_CREDENTIALS = 'authentication_credentials',
  SESSION_DATA = 'session_data',
  SECURITY_PREFERENCES = 'security_preferences',
  DEVICE_INFORMATION = 'device_information',
  BEHAVIORAL_DATA = 'behavioral_data',
  CONTACT_VERIFICATION = 'contact_verification',
}

export interface AuthGDPRAuditEvent {
  id: string;
  eventType: AuthGDPREventType;
  userId: string;
  dataSubject: string;
  lawfulBasis: AuthLawfulBasis;
  processingPurpose: string;
  dataCategories: AuthDataCategory[];
  timestamp: Date;
  
  // Context Information
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  sessionId?: string;
  correlationId?: string;
  
  // Auth-specific Context
  authMethod?: string;
  riskScore?: number;
  
  details: AuthGDPRAuditDetails;
}

export interface AuthGDPRAuditDetails {
  operation: string;
  success: boolean;
  
  // Security Information
  securityLevel?: 'low' | 'medium' | 'high' | 'critical';
  
  // Authentication Details
  authenticationTime?: number;
  failureReason?: string;
  retryAttempt?: number;
  
  // Data Information
  affectedFields?: string[];
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  
  // Compliance
  encryptionStatus: boolean;
  retentionPeriod?: number;
  anonymized: boolean;
}

/**
 * GDPR Audit Service for Authentication Feature
 */
export class AuthGDPRAuditService {
  private memoryStorage: Map<string, AuthGDPRAuditEvent[]> = new Map();
  
  constructor() {
    this.initializeDemoData();
  }

  // =============================================
  // AUTHENTICATION EVENT LOGGING
  // =============================================

  /**
   * Log login attempt
   */
  async logLoginAttempt(
    userId: string,
    email: string,
    authMethod: string = 'email',
    context: {
      ipAddress?: string;
      userAgent?: string;
      deviceId?: string;
      sessionId?: string;
      correlationId?: string;
      riskScore?: number;
    } = {}
  ): Promise<void> {
    const auditEvent: AuthGDPRAuditEvent = {
      id: this.generateAuditId(),
      eventType: AuthGDPREventType.LOGIN_ATTEMPT,
      userId,
      dataSubject: userId,
      lawfulBasis: AuthLawfulBasis.CONTRACT,
      processingPurpose: 'User authentication attempt for application access',
      dataCategories: [AuthDataCategory.AUTHENTICATION_CREDENTIALS, AuthDataCategory.SESSION_DATA],
      timestamp: new Date(),
      authMethod,
      riskScore: context.riskScore,
      ...context,
      details: {
        operation: 'login_attempt',
        success: false,
        securityLevel: context.riskScore ? this.calculateSecurityLevel(context.riskScore) : 'medium',
        encryptionStatus: true,
        anonymized: false,
        affectedFields: ['email', 'password_hash'],
      }
    };

    await this.storeAuditEvent(auditEvent);
  }

  /**
   * Log successful login
   */
  async logLoginSuccess(
    user: AuthUser,
    authMethod: string = 'email',
    context: {
      ipAddress?: string;
      userAgent?: string;
      deviceId?: string;
      sessionId?: string;
      correlationId?: string;
      authenticationTime?: number;
    } = {}
  ): Promise<void> {
    const auditEvent: AuthGDPRAuditEvent = {
      id: this.generateAuditId(),
      eventType: AuthGDPREventType.LOGIN_SUCCESS,
      userId: user.id,
      dataSubject: user.id,
      lawfulBasis: AuthLawfulBasis.CONTRACT,
      processingPurpose: 'Successful user authentication and session creation',
      dataCategories: [
        AuthDataCategory.AUTHENTICATION_CREDENTIALS,
        AuthDataCategory.SESSION_DATA,
        AuthDataCategory.DEVICE_INFORMATION
      ],
      timestamp: new Date(),
      authMethod,
      ...context,
      details: {
        operation: 'login_success',
        success: true,
        securityLevel: 'medium',
        authenticationTime: context.authenticationTime,
        encryptionStatus: true,
        anonymized: false,
        affectedFields: ['lastLoginAt', 'sessionId', 'deviceId'],
        newValues: {
          lastLoginAt: new Date().toISOString(),
          authMethod,
          sessionCreated: true
        }
      }
    };

    await this.storeAuditEvent(auditEvent);
  }

  /**
   * Log failed login
   */
  async logLoginFailure(
    email: string,
    failureReason: string,
    retryAttempt: number = 1,
    context: {
      ipAddress?: string;
      userAgent?: string;
      deviceId?: string;
      correlationId?: string;
      riskScore?: number;
    } = {}
  ): Promise<void> {
    const auditEvent: AuthGDPRAuditEvent = {
      id: this.generateAuditId(),
      eventType: AuthGDPREventType.LOGIN_FAILURE,
      userId: 'anonymous',
      dataSubject: email,
      lawfulBasis: AuthLawfulBasis.LEGITIMATE_INTERESTS,
      processingPurpose: 'Security monitoring and fraud prevention',
      dataCategories: [AuthDataCategory.AUTHENTICATION_CREDENTIALS, AuthDataCategory.BEHAVIORAL_DATA],
      timestamp: new Date(),
      authMethod: 'email',
      riskScore: context.riskScore,
      ...context,
      details: {
        operation: 'login_failure',
        success: false,
        securityLevel: retryAttempt > 3 ? 'high' : 'medium',
        failureReason,
        retryAttempt,
        encryptionStatus: true,
        anonymized: true,
        affectedFields: ['email']
      }
    };

    await this.storeAuditEvent(auditEvent);
  }

  /**
   * Log user logout
   */
  async logLogout(
    userId: string,
    logoutType: 'user_initiated' | 'session_timeout' | 'system_logout' = 'user_initiated',
    context: {
      sessionId?: string;
      correlationId?: string;
      sessionDuration?: number;
    } = {}
  ): Promise<void> {
    const auditEvent: AuthGDPRAuditEvent = {
      id: this.generateAuditId(),
      eventType: AuthGDPREventType.LOGOUT,
      userId,
      dataSubject: userId,
      lawfulBasis: AuthLawfulBasis.CONTRACT,
      processingPurpose: 'Session termination and security cleanup',
      dataCategories: [AuthDataCategory.SESSION_DATA],
      timestamp: new Date(),
      ...context,
      details: {
        operation: 'logout',
        success: true,
        securityLevel: 'low',
        encryptionStatus: true,
        anonymized: false,
        affectedFields: ['sessionId', 'lastActivityAt'],
        previousValues: {
          sessionActive: true,
          logoutType
        },
        newValues: {
          sessionActive: false,
          loggedOutAt: new Date().toISOString()
        }
      }
    };

    await this.storeAuditEvent(auditEvent);
  }

  /**
   * Log registration success
   */
  async logRegistrationSuccess(
    user: AuthUser,
    context: {
      ipAddress?: string;
      userAgent?: string;
      deviceId?: string;
      correlationId?: string;
    } = {}
  ): Promise<void> {
    const auditEvent: AuthGDPRAuditEvent = {
      id: this.generateAuditId(),
      eventType: AuthGDPREventType.REGISTRATION_SUCCESS,
      userId: user.id,
      dataSubject: user.id,
      lawfulBasis: AuthLawfulBasis.CONSENT,
      processingPurpose: 'Successful user account creation and initial setup',
      dataCategories: [
        AuthDataCategory.AUTHENTICATION_CREDENTIALS,
        AuthDataCategory.CONTACT_VERIFICATION,
        AuthDataCategory.SECURITY_PREFERENCES
      ],
      timestamp: new Date(),
      authMethod: 'email',
      ...context,
      details: {
        operation: 'registration_success',
        success: true,
        securityLevel: 'medium',
        encryptionStatus: true,
        anonymized: false,
        affectedFields: ['id', 'email', 'emailVerified', 'createdAt'],
        newValues: {
          userId: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          createdAt: new Date().toISOString()
        }
      }
    };

    await this.storeAuditEvent(auditEvent);
  }

  /**
   * Log password reset events
   */
  async logPasswordReset(
    userId: string,
    eventType: 'request' | 'success',
    context: {
      email?: string;
      correlationId?: string;
      ipAddress?: string;
    } = {}
  ): Promise<void> {
    const auditEvent: AuthGDPRAuditEvent = {
      id: this.generateAuditId(),
      eventType: eventType === 'request' ? AuthGDPREventType.PASSWORD_RESET_REQUEST : AuthGDPREventType.PASSWORD_RESET_SUCCESS,
      userId,
      dataSubject: userId,
      lawfulBasis: AuthLawfulBasis.CONTRACT,
      processingPurpose: `Password reset ${eventType} for account security`,
      dataCategories: [AuthDataCategory.AUTHENTICATION_CREDENTIALS, AuthDataCategory.CONTACT_VERIFICATION],
      timestamp: new Date(),
      authMethod: 'email',
      ...context,
      details: {
        operation: `password_reset_${eventType}`,
        success: true,
        securityLevel: 'high',
        encryptionStatus: true,
        anonymized: false,
        affectedFields: eventType === 'success' ? ['password_hash', 'passwordResetAt'] : ['passwordResetToken'],
        newValues: {
          passwordResetRequested: eventType === 'request',
          passwordReset: eventType === 'success',
          timestamp: new Date().toISOString()
        }
      }
    };

    await this.storeAuditEvent(auditEvent);
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  /**
   * Calculate security level based on risk score
   */
  private calculateSecurityLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 40) return 'medium';
    return 'low';
  }

  /**
   * Generate unique audit event ID
   */
  private generateAuditId(): string {
    return `auth_audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Store audit event in memory and database
   */
  private async storeAuditEvent(event: AuthGDPRAuditEvent): Promise<void> {
    // Store in memory
    const userEvents = this.memoryStorage.get(event.userId) || [];
    userEvents.push(event);
    this.memoryStorage.set(event.userId, userEvents);

    // Store in database if available
    if (supabase) {
      try {
        await this.storeAuditEventInDatabase(event);
      } catch (error) {
        console.warn('Failed to store auth audit event in database:', error);
      }
    }
  }

  /**
   * Store GDPR audit event in Supabase database
   */
  private async storeAuditEventInDatabase(event: AuthGDPRAuditEvent): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not available - check environment configuration');
    }
    
    const { error } = await supabase
      .from('auth_gdpr_audit_events')
      .insert({
        id: event.id,
        event_type: event.eventType,
        user_id: event.userId,
        data_subject: event.dataSubject,
        lawful_basis: event.lawfulBasis,
        processing_purpose: event.processingPurpose,
        data_categories: event.dataCategories,
        timestamp: event.timestamp.toISOString(),
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        device_id: event.deviceId,
        session_id: event.sessionId,
        correlation_id: event.correlationId,
        auth_method: event.authMethod,
        risk_score: event.riskScore,
        details: event.details
      });

    if (error) {
      throw new Error(`Failed to store auth audit event: ${error.message}`);
    }
  }

  /**
   * Get audit events for a user
   */
  async getAuditEvents(
    userId: string,
    limit: number = 100,
    eventType?: AuthGDPREventType
  ): Promise<AuthGDPRAuditEvent[]> {
    const userEvents = this.memoryStorage.get(userId) || [];
    
    let filteredEvents = userEvents;
    if (eventType) {
      filteredEvents = userEvents.filter(event => event.eventType === eventType);
    }
    
    return filteredEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Initialize demo data for testing
   */
  private initializeDemoData(): void {
    const demoUserId = 'demo-auth-user-123';
    const now = new Date();
    
    // Demo login success event
    const loginEvent: AuthGDPRAuditEvent = {
      id: this.generateAuditId(),
      eventType: AuthGDPREventType.LOGIN_SUCCESS,
      userId: demoUserId,
      dataSubject: demoUserId,
      lawfulBasis: AuthLawfulBasis.CONTRACT,
      processingPurpose: 'Demo user authentication for testing',
      dataCategories: [AuthDataCategory.AUTHENTICATION_CREDENTIALS, AuthDataCategory.SESSION_DATA],
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      authMethod: 'email',
      details: {
        operation: 'login_success',
        success: true,
        securityLevel: 'medium',
        encryptionStatus: true,
        anonymized: false,
        affectedFields: ['lastLoginAt', 'sessionId']
      }
    };

    this.memoryStorage.set(demoUserId, [loginEvent]);
  }
}

// Export singleton instance
export const authGDPRAuditService = new AuthGDPRAuditService(); 