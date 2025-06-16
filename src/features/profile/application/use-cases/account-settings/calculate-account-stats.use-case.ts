/**
 * @fileoverview Calculate Account Stats Use Case - Enterprise Business Logic
 * 
 * ✅ APPLICATION LAYER - USE CASE:
 * - Profile Summary Business Logic
 * - Security Statistics Calculation
 * - Data Usage Analytics
 * - Enterprise Compliance Metrics
 */

import { UserProfile, PrivacySettings } from '../../../domain/entities/user-profile.entity';
import { AccountSettings } from '../../../domain/repositories/account-settings.repository.interface';

// Core Types
export type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const Success = <T>(data: T): Result<T, never> => ({ success: true, data });
export const Failure = <E>(error: E): Result<never, E> => ({ success: false, error });

/**
 * Account Stats Calculation Request
 */
export interface CalculateAccountStatsRequest {
  userId: string;
  profile: UserProfile | null;
  accountSettings: AccountSettings | null;
  privacySettings?: PrivacySettings;
}

/**
 * Profile Summary Result
 */
export interface ProfileSummaryResult {
  completionPercentage: number;
  missingFields: string[];
  profileStrength: 'weak' | 'moderate' | 'strong' | 'excellent';
  lastUpdated: Date;
  memberSince: Date;
  profileViews: number;
  connectionsCount: number;
}

/**
 * Account Stats Result
 */
export interface AccountStatsResult {
  totalLogins: number;
  lastLoginAt: Date | null;
  averageSessionDuration: number;
  dataSize: number; // in KB
  storageUsed: number;
  storageLimit: number;
  backupsCount: number;
  lastBackupAt: Date | null;
}

/**
 * Security Stats Result
 */
export interface SecurityStatsResult {
  mfaEnabled: boolean;
  biometricEnabled: boolean;
  activeSessions: number;
  securityLevel: 'low' | 'medium' | 'high' | 'maximum';
  trustedDevices: number;
  loginAttempts: {
    successful: number;
    failed: number;
  };
  passwordStrength: 'weak' | 'moderate' | 'strong';
  lastPasswordChange: Date | null;
}

/**
 * Data Usage Stats Result
 */
export interface DataUsageStatsResult {
  storageUsed: number;
  storageLimit: number;
  backupEnabled: boolean;
  exportHistory: {
    count: number;
    lastExportAt: Date | null;
  };
  dataRetentionPeriod: number;
  gdprCompliance: {
    consentGiven: boolean;
    dataMinimization: boolean;
    purposeLimitation: boolean;
  };
}

/**
 * Complete Account Stats Response
 */
export interface AccountStatsResponse {
  profileSummary: ProfileSummaryResult;
  accountStats: AccountStatsResult;
  securityStats: SecurityStatsResult;
  dataUsageStats: DataUsageStatsResult;
  recommendations: string[];
}

/**
 * 🎯 CALCULATE ACCOUNT STATS USE CASE
 * 
 * ✅ ENTERPRISE BUSINESS LOGIC:
 * - Profile Completion Analysis mit Weighted Fields
 * - Security Level Assessment
 * - Data Usage Analytics
 * - GDPR Compliance Tracking
 * - Personalized Recommendations
 */
export class CalculateAccountStatsUseCase {
  /**
   * Execute Account Stats Calculation
   */
  async execute(request: CalculateAccountStatsRequest): Promise<Result<AccountStatsResponse, string>> {
    try {
      const { userId: _userId, profile, accountSettings, privacySettings } = request;

      if (!profile) {
        return Failure('Profile data required for stats calculation');
      }

      // 🎯 BUSINESS LOGIC: Calculate Profile Summary
      const profileSummary = this.calculateProfileSummary(profile, accountSettings);

      // 🎯 BUSINESS LOGIC: Calculate Account Stats  
      const accountStats = this.calculateAccountStats(profile, accountSettings);

      // 🎯 BUSINESS LOGIC: Calculate Security Stats
      const securityStats = this.calculateSecurityStats(profile, accountSettings, privacySettings);

      // 🎯 BUSINESS LOGIC: Calculate Data Usage Stats
      const dataUsageStats = this.calculateDataUsageStats(profile, accountSettings, privacySettings);

      // 🎯 BUSINESS LOGIC: Generate Recommendations
      const recommendations = this.generateRecommendations(profileSummary, securityStats, dataUsageStats);

      return Success({
        profileSummary,
        accountStats,
        securityStats,
        dataUsageStats,
        recommendations
      });

    } catch (error) {
      return Failure(`Account stats calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 🎯 BUSINESS LOGIC: Calculate Profile Summary with Weighted Fields
   */
  private calculateProfileSummary(profile: UserProfile, accountSettings: AccountSettings | null): ProfileSummaryResult {
    const weightedFields = [
      { field: 'firstName', weight: 10, value: profile.firstName },
      { field: 'lastName', weight: 10, value: profile.lastName },
      { field: 'email', weight: 15, value: profile.email },
      { field: 'bio', weight: 15, value: profile.bio },
      { field: 'avatar', weight: 10, value: profile.avatar },
      { field: 'phone', weight: 8, value: profile.phone },
      { field: 'location', weight: 5, value: profile.location },
      { field: 'website', weight: 5, value: profile.website },
      { field: 'dateOfBirth', weight: 3, value: profile.dateOfBirth },
    ];

    // Professional fields (higher weight for business profiles)
    const professionalFields = [
      { field: 'company', weight: 8, value: profile.professional?.company },
      { field: 'jobTitle', weight: 8, value: profile.professional?.jobTitle },
      { field: 'industry', weight: 5, value: profile.professional?.industry },
    ];

    // Social links (engagement factor)
    const socialLinksWeight = profile.socialLinks && Object.keys(profile.socialLinks).length > 0 ? 10 : 0;

    let totalWeight = 0;
    let completedWeight = 0;
    const missingFields: string[] = [];

    // Calculate completion based on weighted fields
    [...weightedFields, ...professionalFields].forEach(({ field, weight, value }) => {
      totalWeight += weight;
      if (value && value.toString().trim()) {
        completedWeight += weight;
      } else {
        missingFields.push(field);
      }
    });

    // Add social links weight
    totalWeight += 10;
    completedWeight += socialLinksWeight;

    const completionPercentage = Math.round((completedWeight / totalWeight) * 100);

    // Determine profile strength based on completion and quality
    let profileStrength: 'weak' | 'moderate' | 'strong' | 'excellent';
    if (completionPercentage >= 90) profileStrength = 'excellent';
    else if (completionPercentage >= 75) profileStrength = 'strong';
    else if (completionPercentage >= 50) profileStrength = 'moderate';
    else profileStrength = 'weak';

    return {
      completionPercentage,
      missingFields,
      profileStrength,
      lastUpdated: accountSettings?.metadata.updatedAt || new Date(),
      memberSince: accountSettings?.metadata.createdAt || new Date(),
      profileViews: 0, // TODO: Implement view tracking
      connectionsCount: 0 // TODO: Implement connections
    };
  }

  /**
   * 🎯 BUSINESS LOGIC: Calculate Account Statistics
   */
  private calculateAccountStats(profile: UserProfile, accountSettings: AccountSettings | null): AccountStatsResult {
    const profileDataSize = this.calculateDataSize(profile);
    
    return {
      totalLogins: 0, // TODO: Implement login tracking
      lastLoginAt: accountSettings?.metadata.lastLoginAt || null,
      averageSessionDuration: 30, // TODO: Implement session tracking
      dataSize: profileDataSize,
      storageUsed: profileDataSize,
      storageLimit: 1024 * 1024, // 1GB default
      backupsCount: 0, // TODO: Implement backup tracking
      lastBackupAt: null // TODO: Implement backup tracking
    };
  }

  /**
   * 🎯 BUSINESS LOGIC: Calculate Security Statistics
   */
  private calculateSecurityStats(
    profile: UserProfile, 
    accountSettings: AccountSettings | null,
    privacySettings?: PrivacySettings
  ): SecurityStatsResult {
    const securityLevel = this.calculateSecurityLevel(profile, accountSettings, privacySettings);
    
    return {
      mfaEnabled: accountSettings?.securitySettings.twoFactorEnabled || false,
      biometricEnabled: false, // TODO: Implement biometric tracking
      activeSessions: 1, // TODO: Implement session tracking
      securityLevel,
      trustedDevices: 1, // TODO: Implement device tracking
      loginAttempts: {
        successful: 0, // TODO: Implement login attempt tracking
        failed: 0
      },
      passwordStrength: this.calculatePasswordStrength(profile),
      lastPasswordChange: null // TODO: Implement password change tracking
    };
  }

  /**
   * 🎯 BUSINESS LOGIC: Calculate Data Usage Statistics
   */
  private calculateDataUsageStats(
    profile: UserProfile, 
    accountSettings: AccountSettings | null,
    privacySettings?: PrivacySettings
  ): DataUsageStatsResult {
    const dataSize = this.calculateDataSize(profile);
    
    return {
      storageUsed: dataSize,
      storageLimit: 1024 * 1024, // 1GB
      backupEnabled: false, // TODO: Implement backup settings
      exportHistory: {
        count: 0, // TODO: Implement export history
        lastExportAt: null
      },
      dataRetentionPeriod: 365, // 1 year default
      gdprCompliance: {
        consentGiven: accountSettings?.metadata.gdprConsentGiven || false,
        dataMinimization: this.assessDataMinimization(profile),
        purposeLimitation: this.assessPurposeLimitation(privacySettings)
      }
    };
  }

  /**
   * 🎯 BUSINESS LOGIC: Generate Personalized Recommendations
   */
  private generateRecommendations(
    profileSummary: ProfileSummaryResult,
    securityStats: SecurityStatsResult,
    dataUsageStats: DataUsageStatsResult
  ): string[] {
    const recommendations: string[] = [];

    // Profile completion recommendations
    if (profileSummary.completionPercentage < 75) {
      recommendations.push('Complete your profile to improve visibility and networking opportunities');
    }

    if (profileSummary.missingFields.includes('bio')) {
      recommendations.push('Add a professional bio to help others understand your background');
    }

    if (profileSummary.missingFields.includes('avatar')) {
      recommendations.push('Upload a profile picture to increase trust and recognition');
    }

    // Security recommendations
    if (!securityStats.mfaEnabled) {
      recommendations.push('Enable two-factor authentication to secure your account');
    }

    if (securityStats.securityLevel === 'low') {
      recommendations.push('Improve your account security by updating your password and privacy settings');
    }

    if (securityStats.passwordStrength === 'weak') {
      recommendations.push('Use a stronger password with a mix of letters, numbers, and symbols');
    }

    // Data management recommendations
    if (!dataUsageStats.gdprCompliance.consentGiven) {
      recommendations.push('Review and update your data processing consent preferences');
    }

    if (dataUsageStats.storageUsed > dataUsageStats.storageLimit * 0.8) {
      recommendations.push('Your storage is nearly full. Consider removing unused data or upgrading your plan');
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  // 🎯 HELPER METHODS

  private calculateDataSize(profile: UserProfile): number {
    return Math.floor(JSON.stringify(profile).length / 1024); // KB
  }

  private calculateSecurityLevel(
    profile: UserProfile, 
    accountSettings: AccountSettings | null,
    privacySettings?: PrivacySettings
  ): 'low' | 'medium' | 'high' | 'maximum' {
    let score = 0;

    // Basic profile completeness
    if (profile.email && profile.firstName && profile.lastName) score += 1;
    
    // Contact verification
    if (profile.phone) score += 1;
    
    // MFA enabled
    if (accountSettings?.securitySettings.twoFactorEnabled) score += 2;
    
    // Privacy settings configured
    if (privacySettings && privacySettings.profileVisibility !== 'public') score += 1;
    
    // Professional information (indicates legitimate use)
    if (profile.professional?.company) score += 1;

    if (score >= 5) return 'maximum';
    if (score >= 3) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  private calculatePasswordStrength(_profile: UserProfile): 'weak' | 'moderate' | 'strong' {
    // TODO: Implement actual password strength analysis
    // This would require access to password metadata (not the actual password)
    return 'moderate';
  }

  private assessDataMinimization(profile: UserProfile): boolean {
    // Business rule: Profile should contain only necessary data
    const nonEssentialFields = [
      profile.website,
      profile.dateOfBirth,
      profile.location
    ].filter(Boolean);

    // If more than 50% of optional fields are filled, data minimization is not applied
    return nonEssentialFields.length <= 2;
  }

  private assessPurposeLimitation(privacySettings?: PrivacySettings): boolean {
    if (!privacySettings) return false;
    
    // Purpose limitation: data should be used only for stated purposes
    // Check if privacy settings align with stated purposes
    return privacySettings.profileVisibility !== 'public' || 
           !privacySettings.allowAnalytics ||
           !privacySettings.allowThirdPartySharing;
  }
} 