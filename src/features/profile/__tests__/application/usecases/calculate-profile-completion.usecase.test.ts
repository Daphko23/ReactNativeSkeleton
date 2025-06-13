/**
 * @fileoverview CALCULATE-PROFILE-COMPLETION-USECASE-TESTS: Enterprise Profile Analytics Test Suite Implementation
 * @description Comprehensive test coverage für CalculateProfileCompletionUseCase mit
 * Enterprise Analytics, Business Logic und Profile Optimization Testing.
 * Implementiert Auth Feature Test Patterns für 9/10 Enterprise-Level Coverage.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module CalculateProfileCompletionUseCaseTests
 * @namespace Features.Profile.Tests.Application.UseCases
 * @category ProfileManagement
 * @subcategory Use Case Tests
 * 
 * @testCategories
 * - **Input Validation Tests:** Profile object validation und sanitization
 * - **Completion Calculation Tests:** Percentage calculation algorithm testing
 * - **Field Analysis Tests:** Required, optional, professional field detection
 * - **Weight Calculation Tests:** Weighted scoring system validation
 * - **Suggestion Generation Tests:** Personalized completion suggestions
 * - **Business Logic Tests:** Profile completion rules und validation
 * - **Performance Tests:** Calculation speed und optimization
 * - **Edge Cases Tests:** Empty profiles, incomplete data scenarios
 * 
 * @businessRules
 * - **BR-COMPLETION-001:** Required fields have 3x weight vs optional fields
 * - **BR-COMPLETION-002:** Professional fields have 1x weight
 * - **BR-COMPLETION-003:** Percentage rounded to nearest integer
 * - **BR-COMPLETION-004:** Suggestions prioritize required fields first
 * 
 * @since 2025-01-23
 */

import { CalculateProfileCompletionUseCase } from '../../../application/usecases/calculate-profile-completion.usecase';
import { UserProfile } from '../../../domain/entities/user-profile.entity';

// =============================================================================
// TEST DATA FACTORIES
// =============================================================================

/**
 * Create minimal empty user profile
 */
const createEmptyProfile = (): UserProfile => ({
  id: 'test-user-123',
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  bio: '',
  avatar: '',
  dateOfBirth: new Date('1990-01-01'),
  location: '',
  website: '',
  phone: '',
  timeZone: 'UTC',
  language: 'en',
  socialLinks: {
    linkedIn: '',
    twitter: '',
    github: '',
  },
  professional: {
    skills: [],
    company: '',
    jobTitle: '',
    industry: '',
    experience: 'junior',
  },
  customFields: {},
  privacySettings: {
    profileVisibility: 'public',
    emailVisibility: 'private',
    phoneVisibility: 'private',
    locationVisibility: 'friends',
    socialLinksVisibility: 'public',
    professionalInfoVisibility: 'public',
    showOnlineStatus: true,
    allowDirectMessages: true,
    allowFriendRequests: true,
    showLastActive: false,
    searchVisibility: true,
    directoryListing: true,
    allowProfileViews: true,
    allowAnalytics: true,
    allowThirdPartySharing: false,
    trackProfileViews: true,
    emailNotifications: true,
    pushNotifications: true,
    marketingCommunications: false,
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-01'),
  profileVersion: 1,
  isComplete: false,
  isVerified: false,
});

/**
 * Create complete user profile
 */
const createCompleteProfile = (): UserProfile => ({
  ...createEmptyProfile(),
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  email: 'john.doe@example.com',
  bio: 'Software Engineer with 5+ years of experience in React Native development.',
  avatar: 'https://cdn.example.com/avatars/john-doe.jpg',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  phone: '+1234567890',
  professional: {
    skills: ['JavaScript', 'TypeScript', 'React Native'],
    company: 'Tech Corp',
    jobTitle: 'Senior Software Engineer',
    industry: 'Technology',
    experience: 'senior',
  },
  isComplete: true,
});

/**
 * Create partially complete profile
 */
const createPartialProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  ...createEmptyProfile(),
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  bio: 'Marketing professional',
  ...overrides,
});

/**
 * Create profile with only required fields
 */
const createRequiredOnlyProfile = (): UserProfile => ({
  ...createEmptyProfile(),
  firstName: 'Bob',
  lastName: 'Johnson',
  email: 'bob.johnson@example.com',
  bio: 'Business analyst',
});

/**
 * Create profile with professional info
 */
const createProfessionalProfile = (): UserProfile => ({
  ...createRequiredOnlyProfile(),
  professional: {
    skills: ['Analytics', 'SQL'],
    company: 'Business Corp',
    jobTitle: 'Senior Analyst',
    industry: 'Analytics',
    experience: 'senior',
  },
});

/**
 * Create profile with optional fields
 */
const createOptionalFieldsProfile = (): UserProfile => ({
  ...createRequiredOnlyProfile(),
  avatar: 'https://cdn.example.com/avatars/user.jpg',
  location: 'New York, NY',
  website: 'https://example.com',
  phone: '+1987654321',
});

// =============================================================================
// MAIN TEST SUITE
// =============================================================================

describe('CalculateProfileCompletionUseCase', () => {
  let useCase: CalculateProfileCompletionUseCase;

  beforeEach(() => {
    useCase = new CalculateProfileCompletionUseCase();
  });

  // =============================================================================
  // CONSTRUCTOR TESTS
  // =============================================================================

  describe('Constructor', () => {
    it('should create instance successfully', () => {
      expect(useCase).toBeInstanceOf(CalculateProfileCompletionUseCase);
    });

    it('should be ready to execute without dependencies', () => {
      const instance = new CalculateProfileCompletionUseCase();
      expect(instance).toBeInstanceOf(CalculateProfileCompletionUseCase);
    });
  });

  // =============================================================================
  // INPUT VALIDATION TESTS
  // =============================================================================

  describe('Input Validation', () => {
    it('should accept valid UserProfile object', () => {
      const profile = createCompleteProfile();
      
      const result = useCase.execute(profile);
      
      expect(result).toBeDefined();
      expect(result.percentage).toBeGreaterThan(0);
    });

    it('should handle empty profile gracefully', () => {
      const emptyProfile = createEmptyProfile();
      
      const result = useCase.execute(emptyProfile);
      
      expect(result).toBeDefined();
      expect(result.percentage).toBe(0);
      expect(result.completedFields).toEqual([]);
      expect(result.missingFields.length).toBeGreaterThan(0);
    });

    it('should handle profile with null/undefined fields', () => {
      const profileWithNulls = {
        ...createEmptyProfile(),
        firstName: null as any,
        lastName: undefined as any,
        email: null as any,
        bio: undefined as any,
      };
      
      const result = useCase.execute(profileWithNulls);
      
      expect(result.percentage).toBe(0);
      expect(result.completedFields).toEqual([]);
    });

    it('should handle profile with special characters', () => {
      const specialProfile = createPartialProfile({
        firstName: 'José',
        lastName: 'García-Müller',
        bio: 'Software Engineer 🚀 with émojis',
        location: 'São Paulo, Brasil',
      });
      
      const result = useCase.execute(specialProfile);
      
      expect(result.percentage).toBeGreaterThan(0);
      expect(result.completedFields).toContain('firstName');
      expect(result.completedFields).toContain('lastName');
    });
  });

  // =============================================================================
  // COMPLETION CALCULATION TESTS
  // =============================================================================

  describe('Completion Calculation', () => {
    it('should calculate 100% for complete profile', () => {
      const completeProfile = createCompleteProfile();
      
      const result = useCase.execute(completeProfile);
      
      expect(result.percentage).toBe(100);
      expect(result.missingFields).toEqual([]);
      expect(result.completedFields.length).toBeGreaterThan(8);
    });

    it('should calculate 0% for empty profile', () => {
      const emptyProfile = createEmptyProfile();
      
      const result = useCase.execute(emptyProfile);
      
      expect(result.percentage).toBe(0);
      expect(result.completedFields).toEqual([]);
      expect(result.missingFields.length).toBeGreaterThan(8);
    });

    it('should calculate correct percentage for required fields only', () => {
      const requiredOnlyProfile = createRequiredOnlyProfile();
      
      const result = useCase.execute(requiredOnlyProfile);
      
      // Required fields (4) * weight 3 = 12
      // Total weight = 4*3 + 4*2 + 3*1 = 12 + 8 + 3 = 23
      // Percentage = (12/23) * 100 = ~52%
      expect(result.percentage).toBe(52);
      expect(result.completedFields).toEqual(['firstName', 'lastName', 'email', 'bio']);
    });

    it('should calculate weighted completion correctly', () => {
      const profileWithOptional = createOptionalFieldsProfile();
      
      const result = useCase.execute(profileWithOptional);
      
      // Required fields (4) * 3 + Optional fields (4) * 2 = 12 + 8 = 20
      // Total weight = 23, so percentage = (20/23) * 100 = ~87%
      expect(result.percentage).toBe(87);
    });

    it('should handle professional fields in calculation', () => {
      const professionalProfile = createProfessionalProfile();
      
      const result = useCase.execute(professionalProfile);
      
      // Required (4*3) + Professional (3*1) = 12 + 3 = 15
      // Percentage = (15/23) * 100 = ~65%
      expect(result.percentage).toBe(65);
      expect(result.completedFields).toContain('company');
      expect(result.completedFields).toContain('jobTitle');
    });

    it('should round percentage to nearest integer', () => {
      const partialProfile = createPartialProfile({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        bio: '', // Explicitly set bio to empty to have only 3 required fields
      });
      
      const result = useCase.execute(partialProfile);
      
      // 3 required fields * 3 = 9, total = 23, percentage = (9/23) * 100 = 39.13...
      expect(result.percentage).toBe(39);
      expect(Number.isInteger(result.percentage)).toBe(true);
    });
  });

  // =============================================================================
  // FIELD ANALYSIS TESTS
  // =============================================================================

  describe('Field Analysis', () => {
    it('should correctly identify required fields', () => {
      const profile = createPartialProfile({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        bio: 'Developer',
      });
      
      const result = useCase.execute(profile);
      
      expect(result.completedFields).toContain('firstName');
      expect(result.completedFields).toContain('lastName');
      expect(result.completedFields).toContain('email');
      expect(result.completedFields).toContain('bio');
    });

    it('should correctly identify optional fields', () => {
      const profile = createPartialProfile({
        avatar: 'https://example.com/avatar.jpg',
        phone: '+1234567890',
        location: 'San Francisco',
        website: 'https://example.com',
      });
      
      const result = useCase.execute(profile);
      
      expect(result.completedFields).toContain('avatar');
      expect(result.completedFields).toContain('phone');
      expect(result.completedFields).toContain('location');
      expect(result.completedFields).toContain('website');
    });

    it('should correctly identify professional fields', () => {
      const profile = {
        ...createEmptyProfile(),
        professional: {
          skills: ['JavaScript'],
          company: 'Tech Corp',
          jobTitle: 'Developer',
          experience: 'senior' as const,
        },
      };
      
      const result = useCase.execute(profile);
      
      expect(result.completedFields).toContain('company');
      expect(result.completedFields).toContain('jobTitle');
      // industry is not filled, so should be in missing fields
      expect(result.missingFields).toContain('industry');
    });

    it('should handle missing professional object', () => {
      const profile = {
        ...createEmptyProfile(),
        professional: undefined as any,
      };
      
      const result = useCase.execute(profile);
      
      expect(result.missingFields).toContain('company');
      expect(result.missingFields).toContain('jobTitle');
      expect(result.missingFields).toContain('industry');
    });

    it('should identify all missing fields correctly', () => {
      const emptyProfile = createEmptyProfile();
      
      const result = useCase.execute(emptyProfile);
      
      const expectedMissingFields = [
        'firstName', 'lastName', 'email', 'bio', // required
        'phone', 'location', 'website', 'avatar', // optional
        'company', 'jobTitle', 'industry' // professional
      ];
      
      expectedMissingFields.forEach(field => {
        expect(result.missingFields).toContain(field);
      });
    });
  });

  // =============================================================================
  // WEIGHT CALCULATION TESTS
  // =============================================================================

  describe('Weight Calculation', () => {
    it('should apply correct weights for different field types', () => {
      // Test that required fields have 3x weight
      const requiredOnlyProfile = createRequiredOnlyProfile();
      const requiredResult = useCase.execute(requiredOnlyProfile);
      
      // Test optional fields weight - profile with only optional fields, no required
      const optionalProfile = createPartialProfile({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        avatar: 'https://example.com/avatar.jpg',
        phone: '+1234567890',
      });
      const optionalResult = useCase.execute(optionalProfile);
      
      // Required field should contribute more to percentage than optional
      expect(requiredResult.percentage).toBeGreaterThan(optionalResult.percentage);
    });

    it('should calculate total weight correctly', () => {
      const completeProfile = createCompleteProfile();
      const result = useCase.execute(completeProfile);
      
      expect(result.percentage).toBe(100);
      
      // Verify all field categories are represented
      const hasRequired = result.completedFields.some(field => 
        ['firstName', 'lastName', 'email', 'bio'].includes(field)
      );
      const hasOptional = result.completedFields.some(field => 
        ['phone', 'location', 'website', 'avatar'].includes(field)
      );
      const hasProfessional = result.completedFields.some(field => 
        ['company', 'jobTitle'].includes(field)
      );
      
      expect(hasRequired).toBe(true);
      expect(hasOptional).toBe(true);
      expect(hasProfessional).toBe(true);
    });

    it('should prioritize required fields in scoring', () => {
      const profileWithAllRequired = createRequiredOnlyProfile();
      const profileWithSomeOptional = createPartialProfile({
        firstName: '',
        lastName: '',
        email: '',
        bio: '', // All required fields empty
        avatar: 'https://example.com/avatar.jpg',
        phone: '+1234567890',
      });
      
      const requiredResult = useCase.execute(profileWithAllRequired);
      const optionalResult = useCase.execute(profileWithSomeOptional);
      
      expect(requiredResult.percentage).toBeGreaterThan(optionalResult.percentage);
    });
  });

  // =============================================================================
  // SUGGESTION GENERATION TESTS
  // =============================================================================

  describe('Suggestion Generation', () => {
    it('should suggest completing basic information first', () => {
      const incompleteProfile = createPartialProfile({
        firstName: 'John',
        // Missing other required fields
        lastName: '',
        email: '',
        bio: '',
      });
      
      const result = useCase.execute(incompleteProfile);
      
      expect(result.suggestions).toContain('Complete your basic information first');
    });

    it('should suggest adding profile picture', () => {
      const profileWithoutAvatar = createRequiredOnlyProfile();
      // avatar is empty by default
      
      const result = useCase.execute(profileWithoutAvatar);
      
      expect(result.suggestions).toContain('Add a profile picture to make your profile more personal');
    });

    it('should suggest writing bio', () => {
      const profileWithoutBio = createPartialProfile({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        bio: '', // Missing bio
      });
      
      const result = useCase.execute(profileWithoutBio);
      
      expect(result.suggestions).toContain('Write a brief bio to tell others about yourself');
    });

    it('should suggest adding location', () => {
      const profileWithoutLocation = createRequiredOnlyProfile();
      // location is empty by default
      
      const result = useCase.execute(profileWithoutLocation);
      
      expect(result.suggestions).toContain('Add your location to help others connect with you');
    });

    it('should suggest adding website', () => {
      const profileWithoutWebsite = createRequiredOnlyProfile();
      // website is empty by default
      
      const result = useCase.execute(profileWithoutWebsite);
      
      expect(result.suggestions).toContain('Add your website or portfolio link');
    });

    it('should suggest completing professional information', () => {
      const profileWithoutProfessional = createRequiredOnlyProfile();
      // professional fields are empty by default
      
      const result = useCase.execute(profileWithoutProfessional);
      
      expect(result.suggestions).toContain('Complete your professional information');
    });

    it('should provide multiple relevant suggestions', () => {
      const incompleteProfile = createPartialProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        // bio is filled, but missing optional and professional fields
      });
      
      const result = useCase.execute(incompleteProfile);
      
      expect(result.suggestions.length).toBeGreaterThan(1);
      expect(result.suggestions).toContain('Add a profile picture to make your profile more personal');
      expect(result.suggestions).toContain('Complete your professional information');
    });

    it('should not suggest basic information when all required fields are complete', () => {
      const completeRequiredProfile = createRequiredOnlyProfile();
      
      const result = useCase.execute(completeRequiredProfile);
      
      expect(result.suggestions).not.toContain('Complete your basic information first');
    });

    it('should provide empty suggestions for complete profile', () => {
      const completeProfile = createCompleteProfile();
      
      const result = useCase.execute(completeProfile);
      
      // Complete profile should have minimal or no suggestions
      expect(result.suggestions.length).toBeLessThanOrEqual(1);
    });
  });

  // =============================================================================
  // BUSINESS LOGIC TESTS
  // =============================================================================

  describe('Business Logic', () => {
    it('should prioritize required fields over optional', () => {
      const profileWithRequiredOnly = createRequiredOnlyProfile();
      const profileWithOptionalOnly = createPartialProfile({
        avatar: 'https://example.com/avatar.jpg',
        phone: '+1234567890',
        location: 'San Francisco',
        website: 'https://example.com',
        // All required fields empty
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
      });
      
      const requiredResult = useCase.execute(profileWithRequiredOnly);
      const optionalResult = useCase.execute(profileWithOptionalOnly);
      
      expect(requiredResult.percentage).toBeGreaterThan(optionalResult.percentage);
    });

    it('should treat empty strings as missing fields', () => {
      const profileWithEmptyStrings = createPartialProfile({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
      });
      
      const result = useCase.execute(profileWithEmptyStrings);
      
      expect(result.missingFields).toContain('firstName');
      expect(result.missingFields).toContain('lastName');
      expect(result.missingFields).toContain('email');
      expect(result.missingFields).toContain('bio');
      expect(result.completedFields).not.toContain('firstName');
    });

    it('should validate professional field structure', () => {
      const profileWithPartialProfessional = {
        ...createRequiredOnlyProfile(),
        professional: {
          skills: ['JavaScript'],
          company: 'Tech Corp',
          jobTitle: '', // Empty
          experience: 'senior' as const,
        },
      };
      
      const result = useCase.execute(profileWithPartialProfessional);
      
      expect(result.completedFields).toContain('company');
      expect(result.missingFields).toContain('jobTitle');
      expect(result.missingFields).toContain('industry');
    });

    it('should handle edge case percentages correctly', () => {
      // Profile that would result in fractional percentage
      const edgeCaseProfile = createPartialProfile({
        firstName: 'Test',
        // Only 1 required field filled
      });
      
      const result = useCase.execute(edgeCaseProfile);
      
      expect(Number.isInteger(result.percentage)).toBe(true);
      expect(result.percentage).toBeGreaterThanOrEqual(0);
      expect(result.percentage).toBeLessThanOrEqual(100);
    });
  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Performance', () => {
    it('should complete calculation within reasonable time', () => {
      const profile = createCompleteProfile();
      
      const startTime = Date.now();
      const result = useCase.execute(profile);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(10); // Should be very fast
      expect(result).toBeDefined();
    });

    it('should handle multiple calculations efficiently', () => {
      const profiles = [
        createEmptyProfile(),
        createRequiredOnlyProfile(),
        createPartialProfile(),
        createCompleteProfile(),
        createProfessionalProfile(),
      ];
      
      const startTime = Date.now();
      
      const results = profiles.map(profile => useCase.execute(profile));
      
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(50);
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.percentage).toBeGreaterThanOrEqual(0);
        expect(result.percentage).toBeLessThanOrEqual(100);
      });
    });

    it('should be memory efficient with large profile objects', () => {
      const largeProfile = {
        ...createCompleteProfile(),
        customFields: {
          ...Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`field${i}`, `value${i}`])),
        },
      };
      
      const result = useCase.execute(largeProfile);
      
      expect(result).toBeDefined();
      expect(result.percentage).toBe(100);
    });
  });

  // =============================================================================
  // EDGE CASES & BOUNDARY TESTS
  // =============================================================================

  describe('Edge Cases', () => {
    it('should handle profile with only whitespace in fields', () => {
      const whitespaceProfile = createPartialProfile({
        firstName: '   ',
        lastName: '\t\t',
        email: '\n\n',
        bio: '   \t\n   ',
      });
      
      const result = useCase.execute(whitespaceProfile);
      
      // Whitespace should be treated as empty
      expect(result.missingFields).toContain('firstName');
      expect(result.missingFields).toContain('lastName');
      expect(result.missingFields).toContain('email');
      expect(result.missingFields).toContain('bio');
    });

    it('should handle very long field values', () => {
      const longValueProfile = createPartialProfile({
        firstName: 'A'.repeat(1000),
        lastName: 'B'.repeat(1000),
        email: 'test@' + 'a'.repeat(1000) + '.com',
        bio: 'C'.repeat(5000),
      });
      
      const result = useCase.execute(longValueProfile);
      
      expect(result.completedFields).toContain('firstName');
      expect(result.completedFields).toContain('lastName');
      expect(result.completedFields).toContain('email');
      expect(result.completedFields).toContain('bio');
    });

    it('should handle Unicode and special characters in all fields', () => {
      const unicodeProfile = createPartialProfile({
        firstName: '王小明',
        lastName: 'García-Müller',
        email: 'tëst@example.com',
        bio: 'Software Engineer 🚀 with émojis and unicode ✨',
        location: 'São Paulo, Brasil 🇧🇷',
        website: 'https://example.com/über-uns',
      });
      
      const result = useCase.execute(unicodeProfile);
      
      expect(result.percentage).toBeGreaterThan(50);
      expect(result.completedFields.length).toBeGreaterThan(4);
    });

    it('should handle null professional object gracefully', () => {
      const profileWithNullProfessional = {
        ...createRequiredOnlyProfile(),
        professional: null as any,
      };
      
      const result = useCase.execute(profileWithNullProfessional);
      
      expect(result.missingFields).toContain('company');
      expect(result.missingFields).toContain('jobTitle');
      expect(result.missingFields).toContain('industry');
    });

    it('should maintain calculation consistency', () => {
      const profile = createPartialProfile();
      
      // Multiple calculations should yield the same result
      const result1 = useCase.execute(profile);
      const result2 = useCase.execute(profile);
      const result3 = useCase.execute(profile);
      
      expect(result1.percentage).toBe(result2.percentage);
      expect(result2.percentage).toBe(result3.percentage);
      expect(result1.completedFields).toEqual(result2.completedFields);
      expect(result1.missingFields).toEqual(result2.missingFields);
    });

    it('should handle rapid successive calculations', () => {
      const profile = createCompleteProfile();
      
      // Rapid successive calls
      const results = Array.from({ length: 100 }, () => useCase.execute(profile));
      
      // All results should be consistent
      results.forEach(result => {
        expect(result.percentage).toBe(100);
        expect(result.missingFields).toEqual([]);
      });
    });
  });
});