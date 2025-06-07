/**
 * Profile Update Data Interface - Application Layer
 * Defines the structure for profile update operations
 */

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedIn?: string;
    github?: string;
  };
}

export interface ProfileValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
} 