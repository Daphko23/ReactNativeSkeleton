/**
 * ✅ VALIDATE PROFILE DATA USE CASE - React Native 2025 Enterprise Standards
 * 
 * 🎯 ECHTE BUSINESS LOGIC:
 * - Cross-field validation rules
 * - GDPR compliance checking  
 * - Professional consistency
 * - Completion scoring algorithm
 */

import { UserProfile } from '../../domain/entities/user-profile.entity';
import { ProfileValidationError } from '../../domain/errors/profile-validation.error';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

export interface ProfileValidationResult {
  isValid: boolean;
  errors: ProfileValidationError[];
  warnings: string[];
  completionScore: number;
  missingFields: string[];
  recommendations: string[];
}

export interface ValidationContext {
  userRole: 'user' | 'admin' | 'moderator';
  isNewProfile: boolean;
  strictMode: boolean;
  gdprRequired: boolean;
}

export class ValidateProfileDataUseCase {
  private logger = LoggerFactory.createServiceLogger('ValidateProfileDataUseCase');

  async execute(
    profile: Partial<UserProfile>,
    context: ValidationContext
  ): Promise<ProfileValidationResult> {
    this.logger.info('Starting profile validation', LogCategory.BUSINESS, {});

    const result: ProfileValidationResult = {
      isValid: false,
      errors: [],
      warnings: [],
      completionScore: 0,
      missingFields: [],
      recommendations: []
    };

    try {
      // 🎯 CORE BUSINESS LOGIC
      await this.validateBusinessRules(profile, context, result);
      
      if (context.gdprRequired) {
        await this.validateGDPRCompliance(profile, result);
      }
      
      await this.validateProfessionalConsistency(profile, result);
      
      // Calculate completion score
      result.completionScore = this.calculateCompletionScore(profile);
      
      // Generate personalized recommendations
      this.generateRecommendations(profile, result);
      
      result.isValid = result.errors.length === 0;
      
      this.logger.info('Profile validation completed', LogCategory.BUSINESS, {});
      
      return result;
    } catch (error) {
      this.logger.error('Profile validation failed', LogCategory.BUSINESS, {}, error as Error);
      
      throw new ProfileValidationError(
        'VALIDATION_SYSTEM_ERROR',
        'Validation system encountered an error'
      );
    }
  }

  /**
   * 🎯 ECHTE BUSINESS LOGIC: Cross-Field Business Rules
   */
  private async validateBusinessRules(
    profile: Partial<UserProfile>,
    context: ValidationContext,
    result: ProfileValidationResult
  ): Promise<void> {
    // Business Rule: Professional profiles need company info
    if (profile.professional?.jobTitle && !profile.professional?.company) {
      result.errors.push(new ProfileValidationError(
        'PROFESSIONAL_COMPANY_REQUIRED',
        'Company is required when job title is provided'
      ));
    }

    // Business Rule: LinkedIn required for senior positions
    if (profile.professional?.experience === 'senior' || profile.professional?.experience === 'lead') {
      if (!profile.socialLinks?.linkedIn) {
        result.warnings.push('LinkedIn profile recommended for senior positions');
      }
    }

    // Business Rule: Contact info consistency
    if (profile.phone && profile.location) {
      if (!this.isPhoneNumberValidForLocation(profile.phone, profile.location)) {
        result.errors.push(new ProfileValidationError(
          'PHONE_LOCATION_MISMATCH',
          'Phone number format does not match the specified location'
        ));
      }
    }

    // Business Rule: Age restrictions for certain industries
    if (profile.dateOfBirth && profile.professional?.industry) {
      const age = this.calculateAge(profile.dateOfBirth);
      if (this.requiresMinimumAge(profile.professional.industry) && age < 18) {
        result.errors.push(new ProfileValidationError(
          'AGE_REQUIREMENT_NOT_MET',
          'Minimum age requirement not met for selected industry'
        ));
      }
    }
  }

  /**
   * 🎯 BUSINESS LOGIC: Completeness Scoring Algorithm
   */
  private calculateCompletionScore(profile: Partial<UserProfile>): number {
    const weights = {
      basicInfo: 30, // firstName, lastName, email
      contactInfo: 20, // phone, location
      professional: 25, // company, jobTitle, industry
      social: 15, // at least one social link
      avatar: 10 // profile picture
    };

    let score = 0;
    let maxScore = 0;

    // Basic Info (30%)
    maxScore += weights.basicInfo;
    if (profile.firstName && profile.lastName && profile.email) {
      score += weights.basicInfo;
    } else if ((profile.firstName || profile.lastName) && profile.email) {
      score += weights.basicInfo * 0.7;
    }

    // Contact Info (20%)
    maxScore += weights.contactInfo;
    const contactFields = [profile.phone, profile.location].filter(Boolean);
    score += (contactFields.length / 2) * weights.contactInfo;

    // Professional Info (25%)
    maxScore += weights.professional;
    const professionalFields = [
      profile.professional?.company,
      profile.professional?.jobTitle,
      profile.professional?.industry
    ].filter(Boolean);
    score += (professionalFields.length / 3) * weights.professional;

    // Social Links (15%)
    maxScore += weights.social;
    const socialLinks = Object.values(profile.socialLinks || {}).filter(Boolean);
    if (socialLinks.length > 0) {
      score += weights.social;
    }

    // Avatar (10%)
    maxScore += weights.avatar;
    if (profile.avatar) {
      score += weights.avatar;
    }

    return Math.round((score / maxScore) * 100);
  }

  /**
   * 🔒 GDPR COMPLIANCE VALIDATION
   */
  private async validateGDPRCompliance(
    profile: Partial<UserProfile>,
    result: ProfileValidationResult
  ): Promise<void> {
    // Check privacy settings exist
    if (!profile.privacySettings) {
      result.errors.push(new ProfileValidationError(
        'GDPR_PRIVACY_SETTINGS_REQUIRED',
        'Privacy settings are required for GDPR compliance'
      ));
    }

    // Validate data minimization principle
    if (profile.customFields && Object.keys(profile.customFields).length > 10) {
      result.warnings.push('Consider reducing custom fields for GDPR data minimization');
    }

    // Check for sensitive data in wrong fields
    this.checkForSensitiveDataMisplacement(profile, result);
  }

  /**
   * 💼 PROFESSIONAL CONSISTENCY CHECKS
   */
  private async validateProfessionalConsistency(
    profile: Partial<UserProfile>,
    result: ProfileValidationResult
  ): Promise<void> {
    if (!profile.professional) return;

    // Industry-specific validation
    if (profile.professional.industry === 'Technology' && profile.professional.skills) {
      const hasTechSkills = profile.professional.skills.some(skill => 
        ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'].some(tech =>
          skill.toLowerCase().includes(tech.toLowerCase())
        )
      );
      
      if (!hasTechSkills) {
        result.warnings.push('Consider adding technology-specific skills for tech industry profile');
      }
    }

    // Experience level consistency
    if (profile.professional.experience === 'entry' && 
        profile.professional.skills && 
        profile.professional.skills.length > 10) {
      result.warnings.push('Skills list seems extensive for entry-level experience');
    }
  }

  /**
   * 🎯 PERSONALIZED RECOMMENDATIONS
   */
  private generateRecommendations(
    profile: Partial<UserProfile>,
    result: ProfileValidationResult
  ): void {
    // Completion recommendations
    if (result.completionScore < 70) {
      result.recommendations.push('Complete your profile to improve visibility and networking opportunities');
    }

    // Professional recommendations
    if (profile.professional?.jobTitle && !profile.professional?.industry) {
      result.recommendations.push('Add your industry to help others find you');
    }

    // Social networking recommendations
    const socialCount = Object.values(profile.socialLinks || {}).filter(Boolean).length;
    if (socialCount === 0) {
      result.recommendations.push('Add social media links to expand your professional network');
    }

    // Avatar recommendation
    if (!profile.avatar) {
      result.recommendations.push('Add a profile picture to make your profile more engaging');
    }
  }

  // 🛠️ HELPER METHODS
  private isPhoneNumberValidForLocation(phone: string, location: string): boolean {
    // Simplified validation - in real app, use libphonenumber
    const germanPattern = /^(\+49|0)[1-9]\d{8,11}$/;
    const usPattern = /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    
    if (location.toLowerCase().includes('germany') || location.toLowerCase().includes('deutschland')) {
      return germanPattern.test(phone.replace(/\s/g, ''));
    }
    
    if (location.toLowerCase().includes('usa') || location.toLowerCase().includes('united states')) {
      return usPattern.test(phone.replace(/\D/g, ''));
    }
    
    return true; // Default to valid for other countries
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  private requiresMinimumAge(industry: string): boolean {
    // Industries that require minimum age
    const restrictedIndustries = ['Finance', 'Legal', 'Healthcare', 'Government'];
    return restrictedIndustries.includes(industry);
  }

  private checkForSensitiveDataMisplacement(
    profile: Partial<UserProfile>,
    result: ProfileValidationResult
  ): void {
    // Check for SSN, ID numbers in wrong fields
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{3}\s\d{2}\s\d{4}\b/, // SSN with spaces
      /\b[A-Z]\d{8}\b/ // ID patterns
    ];

    const fieldsToCheck = [profile.bio, profile.website, ...(profile.professional?.skills || [])];
    
    for (const field of fieldsToCheck) {
      if (typeof field === 'string') {
        for (const pattern of sensitivePatterns) {
          if (pattern.test(field)) {
            result.errors.push(new ProfileValidationError(
              'SENSITIVE_DATA_MISPLACED',
              'Sensitive personal data detected in public field'
            ));
          }
        }
      }
    }
  }
}