/**
 * @fileoverview USE PROFILE COMPLETION HOOK - Enterprise Hook
 * @description Profile Completion Management Hook nach Enterprise Standards
 *
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

import { useMemo } from 'react';
import { useProfile } from './use-profile.hook';
import { UserProfile as _UserProfile } from '../../domain/entities/user-profile.entity'; // Mark as potentially unused

/**
 * Profile Completion Hook Interface
 */
export interface UseProfileCompletionReturn {
  completionPercentage: number;
  missingFields: string[];
  isComplete: boolean;
  requiredFieldsCount: number;
  completedFieldsCount: number;
  nextSuggestedField?: string;
}

/**
 * Profile fields configuration
 */
const PROFILE_FIELDS = {
  required: ['firstName', 'lastName', 'email'],
  optional: ['bio', 'avatar', 'phone', 'location', 'website', 'socialLinks'],
} as const;

/**
 * useProfileCompletion Hook
 *
 * @description
 * Calculates and manages profile completion status with Enterprise-grade
 * validation and recommendations.
 *
 * @returns Profile completion data and utilities
 */
export function useProfileCompletion(): UseProfileCompletionReturn {
  const { profile } = useProfile();

  return useMemo(() => {
    if (!profile) {
      return {
        completionPercentage: 0,
        missingFields: [...PROFILE_FIELDS.required, ...PROFILE_FIELDS.optional],
        isComplete: false,
        requiredFieldsCount: PROFILE_FIELDS.required.length,
        completedFieldsCount: 0,
        nextSuggestedField: PROFILE_FIELDS.required[0],
      };
    }

    // Check which fields are completed
    const completedFields: string[] = [];
    const missingFields: string[] = [];

    [...PROFILE_FIELDS.required, ...PROFILE_FIELDS.optional].forEach(field => {
      const value = (profile as any)[field];
      const isCompleted = value !== null && value !== undefined && value !== '';

      if (isCompleted) {
        completedFields.push(field);
      } else {
        missingFields.push(field);
      }
    });

    // Calculate completion percentage
    const totalFields =
      PROFILE_FIELDS.required.length + PROFILE_FIELDS.optional.length;
    const completionPercentage = Math.round(
      (completedFields.length / totalFields) * 100
    );

    // Check if required fields are complete
    const requiredCompleted = PROFILE_FIELDS.required.every(field => {
      const value = (profile as any)[field];
      return value !== null && value !== undefined && value !== '';
    });

    // Suggest next field to complete
    const nextSuggestedField =
      missingFields.find(field =>
        PROFILE_FIELDS.required.includes(field as any)
      ) || missingFields[0];

    return {
      completionPercentage,
      missingFields,
      isComplete: requiredCompleted && missingFields.length === 0,
      requiredFieldsCount: PROFILE_FIELDS.required.length,
      completedFieldsCount: completedFields.length,
      nextSuggestedField,
    };
  }, [profile]);
}
