/**
 * Calculate Profile Completion Use Case - Application Layer
 * Handles the business logic for calculating profile completion percentage
 */

import { UserProfile } from '../../domain/entities/user-profile.entity';

export interface ProfileCompletionResult {
  percentage: number;
  missingFields: string[];
  completedFields: string[];
  suggestions: string[];
}

export class CalculateProfileCompletionUseCase {
  /**
   * Calculate profile completion percentage with detailed information
   */
  execute(profile: UserProfile): ProfileCompletionResult {
    const requiredFields = ['firstName', 'lastName', 'email', 'bio'];
    const optionalFields = ['phone', 'location', 'website', 'avatar'];
    const professionalFields = ['company', 'jobTitle', 'industry'];
    
    const filledRequired = requiredFields.filter(field => {
      const value = profile[field as keyof UserProfile];
      return value !== undefined && value !== null && value !== '';
    });
    
    const filledOptional = optionalFields.filter(field => {
      const value = profile[field as keyof UserProfile];
      return value !== undefined && value !== null && value !== '';
    });

    const filledProfessional = professionalFields.filter(field => {
      const professionalInfo = profile.professional as any;
      if (!professionalInfo) return false;
      const value = professionalInfo[field];
      return value !== undefined && value !== null && value !== '';
    });
    
    const missingFields = [
      ...requiredFields.filter(field => !filledRequired.includes(field)),
      ...optionalFields.filter(field => !filledOptional.includes(field)),
      ...professionalFields.filter(field => !filledProfessional.includes(field))
    ];

    const completedFields = [
      ...filledRequired,
      ...filledOptional,
      ...filledProfessional
    ];
    
    // Weight calculation: Required fields have higher weight
    const totalWeight = requiredFields.length * 3 + optionalFields.length * 2 + professionalFields.length * 1;
    const completedWeight = filledRequired.length * 3 + filledOptional.length * 2 + filledProfessional.length * 1;
    
    const percentage = Math.round((completedWeight / totalWeight) * 100);

    // Generate suggestions based on missing fields
    const suggestions = this.generateSuggestions(missingFields, filledRequired.length);
    
    return {
      percentage,
      missingFields,
      completedFields,
      suggestions,
    };
  }

  /**
   * Generate completion suggestions based on missing fields
   */
  private generateSuggestions(missingFields: string[], requiredCompleted: number): string[] {
    const suggestions: string[] = [];

    if (requiredCompleted < 4) {
      suggestions.push('Complete your basic information first');
    }

    if (missingFields.includes('avatar')) {
      suggestions.push('Add a profile picture to make your profile more personal');
    }

    if (missingFields.includes('bio')) {
      suggestions.push('Write a brief bio to tell others about yourself');
    }

    if (missingFields.includes('location')) {
      suggestions.push('Add your location to help others connect with you');
    }

    if (missingFields.includes('website')) {
      suggestions.push('Add your website or portfolio link');
    }

    if (missingFields.some(field => ['company', 'jobTitle', 'industry'].includes(field))) {
      suggestions.push('Complete your professional information');
    }

    return suggestions;
  }
} 