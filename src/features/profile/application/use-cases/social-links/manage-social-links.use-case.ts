/**
 * @fileoverview Manage Social Links Use Case - Enterprise Business Logic
 * 
 * ✅ APPLICATION LAYER - USE CASE:
 * - Echte Business Logic für Social Links Management
 * - GDPR Compliance und Privacy Controls
 * - Security Validation und URL Verification
 * - Cross-Platform Consistency Rules
 * - Enterprise Audit Logging
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('SocialLinksUseCase');

// Domain Types
import { 
  SocialLink, 
  SocialPlatformKey, 
  SocialLinksCollection,
  SocialLinksValidationResult,
  SOCIAL_LINKS_DOMAIN_CONSTANTS 
} from '../../../domain/types/social-links.types';

// Core Types
export type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const Success = <T>(data: T): Result<T, never> => ({ success: true, data });
export const Failure = <E>(error: E): Result<never, E> => ({ success: false, error });

// Audit Log Interface
interface AuditLogEntry {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  changes?: any;
  gdprCompliance?: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface AuditLogService {
  logActivity(entry: AuditLogEntry): Promise<string>;
  logError(entry: { userId: string; action: string; error: string; timestamp: Date }): Promise<void>;
}

// Simple Audit Log Implementation
class SimpleAuditLogService implements AuditLogService {
  async logActivity(entry: AuditLogEntry): Promise<string> {
    const logId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Social links audit entry created', LogCategory.BUSINESS, {
      auditLogId: logId,
      userId: entry.userId,
      action: entry.action,
      entityType: entry.entityType,
      timestamp: entry.timestamp,
      gdprCompliance: entry.gdprCompliance
    });
    
    return logId;
  }

  async logError(entry: { userId: string; action: string; error: string; timestamp: Date }): Promise<void> {
    logger.error('Social links audit error', LogCategory.BUSINESS, {
      userId: entry.userId,
      action: entry.action,
      error: entry.error,
      timestamp: entry.timestamp
    });
  }
}

/**
 * Social Links Management Request DTO
 */
export interface ManageSocialLinksRequest {
  userId: string;
  links: SocialLink[];
  visibility: 'public' | 'friends' | 'private';
  gdprConsent: boolean;
  securityLevel: 'basic' | 'enhanced' | 'maximum';
}

/**
 * Social Links Management Response DTO
 */
export interface ManageSocialLinksResponse {
  success: boolean;
  links: SocialLink[];
  validatedLinks: number;
  securityWarnings: string[];
  gdprCompliance: {
    dataMinimization: boolean;
    purposeLimitation: boolean;
    accuracyMaintained: boolean;
  };
  auditLogId: string;
}

/**
 * 🎯 MANAGE SOCIAL LINKS USE CASE
 * 
 * ✅ ENTERPRISE BUSINESS LOGIC:
 * - GDPR Data Minimization and Purpose Limitation
 * - Security Validation with Threat Detection
 * - Platform-specific Business Rules
 * - Cross-field Consistency Validation
 * - Professional Profile Compliance
 * - Enterprise Audit Trail
 */
export class ManageSocialLinksUseCase {
  private readonly auditLogService: AuditLogService;

  constructor(auditLogService?: AuditLogService) {
    this.auditLogService = auditLogService || new SimpleAuditLogService();
  }

  /**
   * Execute Social Links Management with Enterprise Business Logic
   */
  async execute(request: ManageSocialLinksRequest): Promise<Result<ManageSocialLinksResponse, string>> {
    try {
      // 🎯 BUSINESS RULE 1: GDPR Consent Validation
      if (!request.gdprConsent) {
        return Failure('GDPR consent required for social links processing');
      }

      // 🎯 BUSINESS RULE 2: Data Minimization Check
      const minimizationResult = this.validateDataMinimization(request.links);
      if (!minimizationResult.isValid) {
        return Failure(`Data minimization violation: ${minimizationResult.reason}`);
      }

      // 🎯 BUSINESS RULE 3: Security Validation
      const securityResult = await this.performSecurityValidation(request.links, request.securityLevel);
      if (!securityResult.isValid) {
        return Failure(`Security validation failed: ${securityResult.reason}`);
      }

      // 🎯 BUSINESS RULE 4: Professional Consistency
      const consistencyResult = this.validateProfessionalConsistency(request.links);
      if (!consistencyResult.isValid) {
        return Failure(`Professional consistency violation: ${consistencyResult.reason}`);
      }

      // 🎯 BUSINESS RULE 5: Platform-specific Validation
      const platformResult = this.validatePlatformRules(request.links);
      if (!platformResult.isValid) {
        return Failure(`Platform validation failed: ${platformResult.reason}`);
      }

      // 🎯 BUSINESS LOGIC: Link Processing and Enhancement
      const processedLinks = await this.processAndEnhanceLinks(request.links);

      // 🎯 BUSINESS LOGIC: GDPR Compliance Assessment
      const gdprCompliance = this.assessGdprCompliance(processedLinks, request);

      // 🎯 ENTERPRISE AUDIT: Log Business Activity
      const auditLogId = await this.auditLogService.logActivity({
        userId: request.userId,
        action: 'SOCIAL_LINKS_UPDATED',
        entityType: 'PROFILE',
        entityId: request.userId,
        changes: {
          linksCount: processedLinks.length,
          visibility: request.visibility,
          platforms: processedLinks.map(l => l.platform),
          securityLevel: request.securityLevel
        },
        gdprCompliance,
        timestamp: new Date(),
        ipAddress: 'system', // TODO: Get from request context
        userAgent: 'enterprise-app'
      });

      return Success({
        success: true,
        links: processedLinks,
        validatedLinks: processedLinks.filter(l => l.verified).length,
        securityWarnings: securityResult.warnings || [],
        gdprCompliance,
        auditLogId
      });

    } catch (error) {
      // 🎯 ENTERPRISE ERROR HANDLING
      await this.auditLogService.logError({
        userId: request.userId,
        action: 'SOCIAL_LINKS_UPDATE_FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });

      return Failure(`Social links management failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 🎯 BUSINESS LOGIC: GDPR Data Minimization Validation
   */
  private validateDataMinimization(links: SocialLink[]): { isValid: boolean; reason?: string } {
    // Maximum links per user (business rule)
    if (links.length > SOCIAL_LINKS_DOMAIN_CONSTANTS.MAX_LINKS_PER_USER) {
      return {
        isValid: false,
        reason: `Exceeds maximum allowed links (${SOCIAL_LINKS_DOMAIN_CONSTANTS.MAX_LINKS_PER_USER})`
      };
    }

    // No duplicate platforms (data quality rule)
    const platforms = links.map(l => l.platform);
    const uniquePlatforms = new Set(platforms);
    if (platforms.length !== uniquePlatforms.size) {
      return {
        isValid: false,
        reason: 'Duplicate platforms not allowed for data minimization'
      };
    }

    // URL length validation (security rule)
    const longUrls = links.filter(l => l.url.length > SOCIAL_LINKS_DOMAIN_CONSTANTS.MAX_URL_LENGTH);
    if (longUrls.length > 0) {
      return {
        isValid: false,
        reason: `URLs exceed maximum length (${SOCIAL_LINKS_DOMAIN_CONSTANTS.MAX_URL_LENGTH} characters)`
      };
    }

    return { isValid: true };
  }

  /**
   * 🎯 BUSINESS LOGIC: Enterprise Security Validation
   */
  private async performSecurityValidation(
    links: SocialLink[], 
    securityLevel: string
  ): Promise<{ isValid: boolean; reason?: string; warnings?: string[] }> {
    const warnings: string[] = [];

    for (const link of links) {
      // URL Security Check
      if (!this.isSecureUrl(link.url)) {
        if (securityLevel === 'maximum') {
          return {
            isValid: false,
            reason: `Insecure URL detected: ${link.url} (HTTPS required for maximum security)`
          };
        }
        warnings.push(`Insecure URL: ${link.platform} - Consider using HTTPS`);
      }

      // Malicious Domain Check (simulated)
      if (await this.isSuspiciousDomain(link.url)) {
        return {
          isValid: false,
          reason: `Suspicious domain detected: ${link.url}`
        };
      }

      // Professional Platform Security
      if (this.isProfessionalPlatform(link.platform) && securityLevel !== 'basic') {
        if (!this.validateProfessionalSecurity(link.url)) {
          warnings.push(`Professional platform ${link.platform} may need additional verification`);
        }
      }
    }

    return { isValid: true, warnings };
  }

  /**
   * 🎯 BUSINESS LOGIC: Professional Consistency Validation
   */
  private validateProfessionalConsistency(links: SocialLink[]): { isValid: boolean; reason?: string } {
    const professionalPlatforms = ['linkedin', 'github'];
    const socialPlatforms = ['twitter', 'instagram', 'facebook'];
    
    const professionalLinks = links.filter(l => professionalPlatforms.includes(l.platform));
    const socialLinks = links.filter(l => socialPlatforms.includes(l.platform));

    // Business Rule: If professional platforms exist, they must be public for networking
    if (professionalLinks.length > 0) {
      const privateProfessional = professionalLinks.filter(l => l.isPublic === false);
      if (privateProfessional.length > 0) {
        return {
          isValid: false,
          reason: 'Professional platforms (LinkedIn, GitHub) should be public for networking purposes'
        };
      }
    }

    // Business Rule: Consistent username across platforms (professional requirement)
    if (professionalLinks.length > 1) {
      const usernames = professionalLinks
        .map(l => this.extractUsername(l.url))
        .filter(username => username !== null);
      
      const uniqueUsernames = new Set(usernames);
      if (uniqueUsernames.size > 1 && usernames.length > 1) {
        return {
          isValid: false,
          reason: 'Professional platforms should use consistent usernames for brand identity'
        };
      }
    }

    return { isValid: true };
  }

  /**
   * 🎯 BUSINESS LOGIC: Platform-specific Business Rules
   */
  private validatePlatformRules(links: SocialLink[]): { isValid: boolean; reason?: string } {
    for (const link of links) {
      switch (link.platform) {
        case 'linkedin':
          if (!link.url.includes('/in/') && !link.url.includes('/company/')) {
            return {
              isValid: false,
              reason: 'LinkedIn URL must be a personal profile (/in/) or company page (/company/)'
            };
          }
          break;

        case 'github':
          if (link.url.includes('/repos/') || link.url.includes('/issues/')) {
            return {
              isValid: false,
              reason: 'GitHub URL must be a user profile, not a repository or issue page'
            };
          }
          break;

        case 'twitter':
          if (link.url.includes('/status/') || link.url.includes('/search')) {
            return {
              isValid: false,
              reason: 'Twitter URL must be a user profile, not a tweet or search'
            };
          }
          break;
      }
    }

    return { isValid: true };
  }

  /**
   * 🎯 BUSINESS LOGIC: Link Processing and Enhancement
   */
  private async processAndEnhanceLinks(links: SocialLink[]): Promise<SocialLink[]> {
    return Promise.all(links.map(async (link) => {
      // Extract username for consistency
      const username = this.extractUsername(link.url);
      
      // Enhance with metadata
      const enhancedLink: SocialLink = {
        ...link,
        username: username || undefined,
        metadata: {
          ...link.metadata,
          lastVerified: new Date(),
          source: 'manual_entry'
        }
      };

      // Verify link if possible (simulated)
      if (await this.canVerifyLink(link.platform)) {
        enhancedLink.verified = await this.verifyLinkValidity(link.url);
      }

      return enhancedLink;
    }));
  }

  /**
   * 🎯 BUSINESS LOGIC: GDPR Compliance Assessment
   */
  private assessGdprCompliance(
    links: SocialLink[], 
    request: ManageSocialLinksRequest
  ) {
    return {
      dataMinimization: links.length <= SOCIAL_LINKS_DOMAIN_CONSTANTS.MAX_LINKS_PER_USER,
      purposeLimitation: this.validatePurposeLimitation(links, request.visibility),
      accuracyMaintained: links.every(l => this.isAccurateLink(l))
    };
  }

  // 🎯 HELPER METHODS
  private isSecureUrl(url: string): boolean {
    return url.startsWith('https://');
  }

  private async isSuspiciousDomain(url: string): Promise<boolean> {
    // Simulated malicious domain check
    const suspiciousDomains = ['malicious-site.com', 'phishing-example.org'];
    try {
      const domain = new URL(url).hostname;
      return suspiciousDomains.includes(domain);
    } catch {
      return true; // Invalid URLs are suspicious
    }
  }

  private isProfessionalPlatform(platform: string): boolean {
    return ['linkedin', 'github', 'medium'].includes(platform);
  }

  private validateProfessionalSecurity(url: string): boolean {
    // Additional security checks for professional platforms
    return this.isSecureUrl(url) && !url.includes('?utm_');
  }

  private extractUsername(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length > 0) {
        // Handle platform-specific patterns
        if (url.includes('linkedin.com/in/')) {
          return pathParts[pathParts.indexOf('in') + 1] || null;
        }
        return pathParts[pathParts.length - 1];
      }
      return null;
    } catch {
      return null;
    }
  }

  private async canVerifyLink(platform: string): Promise<boolean> {
    // Some platforms allow verification, others don't
    return ['linkedin', 'github', 'twitter'].includes(platform);
  }

  private async verifyLinkValidity(url: string): Promise<boolean> {
    // Simulated link verification
    try {
      // In real implementation: HTTP HEAD request to check if URL is accessible
      return Math.random() > 0.1; // 90% success rate simulation
    } catch {
      return false;
    }
  }

  private validatePurposeLimitation(links: SocialLink[], visibility: string): boolean {
    // Purpose limitation: links must align with stated purpose (professional networking)
    if (visibility === 'public') {
      // Public profiles should focus on professional networking
      const professionalPlatforms = ['linkedin', 'github', 'medium', 'behance', 'dribbble'];
      const professionalLinks = links.filter(l => professionalPlatforms.includes(l.platform));
      
      // At least 60% should be professional for public profiles
      return professionalLinks.length / links.length >= 0.6;
    }
    return true;
  }

  private isAccurateLink(link: SocialLink): boolean {
    // Data accuracy check
    return link.url.trim().length > 0 && 
           link.platform.trim().length > 0 &&
           this.isValidUrl(link.url);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
} 