/**
 * ProfileServiceImpl Tests
 * Comprehensive test coverage for profile service
 */

import { ProfileServiceImpl } from '../profile.service.impl';
import { UserProfile, PrivacySettings } from '../../../domain/entities/user-profile.entity';

// Mock the repository
const mockRepository = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  deleteProfile: jest.fn(),
  getProfileHistory: jest.fn(),
  restoreProfileVersion: jest.fn(),
};

describe('ProfileServiceImpl', () => {
  let profileService: ProfileServiceImpl;
  
  const mockUserProfile: UserProfile = {
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software Developer',
    avatar: 'https://example.com/avatar.jpg',
    dateOfBirth: new Date('1990-01-01'),
    location: 'New York, NY',
    website: 'https://johndoe.dev',
    phone: '+1234567890',
    timeZone: 'America/New_York',
    language: 'en',
    socialLinks: {
      linkedIn: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe',
    },
    professional: {
      skills: ['JavaScript', 'TypeScript', 'React Native'],
      company: 'Tech Corp',
      jobTitle: 'Senior Developer',
      experience: 'senior',
    },
    customFields: {},
    privacySettings: {
      profileVisibility: 'public',
      emailVisibility: 'private',
      phoneVisibility: 'private',
      locationVisibility: 'public',
      socialLinksVisibility: 'public',
      professionalInfoVisibility: 'public',
      showOnlineStatus: true,
      allowDirectMessages: true,
      allowFriendRequests: true,
      emailNotifications: true,
      pushNotifications: true,
      marketingCommunications: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    profileVersion: 1,
    isComplete: true,
    isVerified: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    profileService = new ProfileServiceImpl(mockRepository as any, {
      enableRealTimeSync: true,
      enableVersioning: true,
      enableAnalytics: false,
    });
  });

  describe('Initialization', () => {
    it('should initialize with default options', async () => {
      const service = new ProfileServiceImpl(mockRepository as any);
      await service.initialize();
      
      expect(service).toBeDefined();
    });

    it('should initialize with custom options', async () => {
      const options = {
        enableRealTimeSync: false,
        enableVersioning: false,
        enableAnalytics: true,
        maxVersions: 100,
      };
      
      const service = new ProfileServiceImpl(mockRepository as any, options);
      await service.initialize();
      
      expect(service).toBeDefined();
    });
  });

  describe('Core Profile Operations', () => {
    it('should get profile successfully', async () => {
      mockRepository.getProfile.mockResolvedValue(mockUserProfile);

      const result = await profileService.getProfile('user-123');

      expect(mockRepository.getProfile).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockUserProfile);
    });

    it('should return null when profile not found', async () => {
      mockRepository.getProfile.mockResolvedValue(null);

      const result = await profileService.getProfile('user-123');

      expect(result).toBeNull();
      expect(mockRepository.getProfile).toHaveBeenCalledWith('user-123');
    });

    it('should update profile successfully', async () => {
      const updateData = { firstName: 'Jane', lastName: 'Smith' };
      const updatedProfile = { ...mockUserProfile, ...updateData };
      
      mockRepository.updateProfile.mockResolvedValue(updatedProfile);

      const result = await profileService.updateProfile('user-123', updateData);

      expect(mockRepository.updateProfile).toHaveBeenCalledWith('user-123', updateData);
      expect(result).toEqual(updatedProfile);
    });

    it('should validate profile before update', async () => {
      const invalidData = { email: 'invalid-email' };
      
      await expect(profileService.updateProfile('user-123', invalidData))
        .rejects.toThrow('Profile validation failed');
    });

    it('should delete profile successfully', async () => {
      mockRepository.deleteProfile.mockResolvedValue(undefined);

      await profileService.deleteProfile('user-123', false);

      expect(mockRepository.deleteProfile).toHaveBeenCalledWith('user-123');
    });
  });

  describe('Avatar Management', () => {
    it('should upload avatar successfully', async () => {
      const imageUri = 'https://example.com/new-avatar.jpg';
      mockRepository.getProfile.mockResolvedValue(mockUserProfile);
      mockRepository.updateProfile.mockResolvedValue(undefined);

      const result = await profileService.uploadAvatar('user-123', imageUri);

      expect(mockRepository.getProfile).toHaveBeenCalledWith('user-123');
      expect(mockRepository.updateProfile).toHaveBeenCalledWith('user-123', { avatar: imageUri });
      expect(result).toBe(imageUri);
    });

    it('should throw error when uploading avatar for non-existent profile', async () => {
      mockRepository.getProfile.mockResolvedValue(null);

      await expect(profileService.uploadAvatar('user-123', 'image-uri'))
        .rejects.toThrow('Profile not found');
    });

    it('should delete avatar successfully', async () => {
      mockRepository.updateProfile.mockResolvedValue(undefined);

      await profileService.deleteAvatar('user-123');

      expect(mockRepository.updateProfile).toHaveBeenCalledWith('user-123', { avatar: undefined });
    });
  });

  describe('Privacy Settings', () => {
    it('should get privacy settings from profile', async () => {
      mockRepository.getProfile.mockResolvedValue(mockUserProfile);

      const result = await profileService.getPrivacySettings('user-123');

      expect(result).toEqual(mockUserProfile.privacySettings);
    });

    it('should return default privacy settings when profile has none', async () => {
      const profileWithoutPrivacy = { ...mockUserProfile, privacySettings: undefined };
      mockRepository.getProfile.mockResolvedValue(profileWithoutPrivacy);

      const result = await profileService.getPrivacySettings('user-123');

      expect(result).toEqual({
        profileVisibility: 'public',
        emailVisibility: 'private',
        phoneVisibility: 'private',
        locationVisibility: 'public',
        socialLinksVisibility: 'public',
        professionalInfoVisibility: 'public',
        showOnlineStatus: true,
        allowDirectMessages: true,
        allowFriendRequests: true,
        emailNotifications: true,
        pushNotifications: true,
        marketingCommunications: false,
      });
    });

    it('should update privacy settings successfully', async () => {
      mockRepository.getProfile.mockResolvedValue(mockUserProfile);
      mockRepository.updateProfile.mockResolvedValue(undefined);

      const newSettings: Partial<PrivacySettings> = {
        emailVisibility: 'public',
        allowDirectMessages: false,
      };

      const result = await profileService.updatePrivacySettings('user-123', newSettings);

      expect(mockRepository.updateProfile).toHaveBeenCalledWith('user-123', {
        privacySettings: {
          ...mockUserProfile.privacySettings,
          ...newSettings,
        },
      });
      expect(result.emailVisibility).toBe('public');
      expect(result.allowDirectMessages).toBe(false);
    });
  });

  describe('Profile History & Versioning', () => {
    it('should get profile history', async () => {
      const mockHistoryItems = [
        {
          id: 'history-1',
          userId: 'user-123',
          fieldName: 'firstName',
          oldValue: 'John',
          newValue: 'Jane',
          changedAt: new Date().toISOString(),
          changeReason: 'User update',
        },
      ];

      mockRepository.getProfileHistory.mockResolvedValue(mockHistoryItems);

      const result = await profileService.getProfileHistory('user-123');

      expect(mockRepository.getProfileHistory).toHaveBeenCalledWith('user-123');
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'history-1',
        profileId: 'user-123',
        changes: {
          firstName: {
            oldValue: 'John',
            newValue: 'Jane',
          },
        },
      });
    });

    it('should restore profile version', async () => {
      const restoredProfile = { ...mockUserProfile, firstName: 'Restored' };
      mockRepository.restoreProfileVersion.mockResolvedValue(restoredProfile);

      const result = await profileService.restoreProfileVersion('user-123', 'version-1');

      expect(mockRepository.restoreProfileVersion).toHaveBeenCalledWith('user-123', 'version-1');
      expect(result.firstName).toBe('Restored');
    });
  });

  describe('Data Management', () => {
    it('should export profile data in JSON format', async () => {
      mockRepository.getProfile.mockResolvedValue(mockUserProfile);

      const result = await profileService.exportProfileData('user-123', 'json');

      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('format', 'json');
      expect(result).toHaveProperty('privacySettings');
      expect(result).toHaveProperty('exportedAt');
      expect(result.profile.id).toBe('user-123');
    });

    it('should export profile data in CSV format', async () => {
      mockRepository.getProfile.mockResolvedValue(mockUserProfile);

      const result = await profileService.exportProfileData('user-123', 'csv');

      expect(result.format).toBe('csv');
    });

    it('should export profile data in XML format', async () => {
      mockRepository.getProfile.mockResolvedValue(mockUserProfile);

      const result = await profileService.exportProfileData('user-123', 'xml');

      expect(result.format).toBe('xml');
    });
  });

  describe('Profile Validation', () => {
    it('should validate valid profile data', async () => {
      const validProfile = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        website: 'https://johndoe.dev',
      };

      const result = await profileService.validateProfile(validProfile);

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should invalidate profile with invalid email', async () => {
      const invalidProfile = {
        email: 'invalid-email',
      };

      const result = await profileService.validateProfile(invalidProfile);

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toContain('Please enter a valid email address');
    });

    it('should invalidate profile with invalid website URL', async () => {
      const invalidProfile = {
        website: 'not-a-url',
      };

      const result = await profileService.validateProfile(invalidProfile);

      expect(result.isValid).toBe(false);
      expect(result.errors.website).toContain('Please enter a valid URL');
    });
  });

  describe('Custom Fields', () => {
    it('should get custom field definitions', async () => {
      const result = await profileService.getCustomFieldDefinitions();

      expect(Array.isArray(result)).toBe(true);
    });

    it('should update custom field', async () => {
      mockRepository.getProfile.mockResolvedValue(mockUserProfile);
      mockRepository.updateProfile.mockResolvedValue({ ...mockUserProfile });

      await profileService.updateCustomField('user-123', 'department', 'Engineering');

      expect(mockRepository.updateProfile).toHaveBeenCalledWith('user-123', {
        customFields: {
          department: 'Engineering',
        },
      });
    });
  });

  describe('Profile Analytics', () => {
    it('should calculate profile completeness', () => {
      const result = profileService.calculateCompleteness(mockUserProfile);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should calculate lower completeness for incomplete profile', () => {
      const incompleteProfile: UserProfile = {
        id: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        profileVersion: 1,
        isComplete: false,
        isVerified: false,
      };

      const result = profileService.calculateCompleteness(incompleteProfile);

      expect(result).toBeLessThan(profileService.calculateCompleteness(mockUserProfile));
    });
  });

  describe('Real-time Features', () => {
    it('should sync profile', async () => {
      mockRepository.getProfile.mockResolvedValue(mockUserProfile);

      const result = await profileService.syncProfile('user-123');

      expect(result).toEqual(mockUserProfile);
    });

    it('should subscribe to profile changes', () => {
      const callback = jest.fn();
      
      const unsubscribe = profileService.subscribeToProfileChanges('user-123', callback);

      expect(typeof unsubscribe).toBe('function');
      
      // Call unsubscribe to test the function
      unsubscribe();
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors in getProfile', async () => {
      mockRepository.getProfile.mockRejectedValue(new Error('Database error'));

      await expect(profileService.getProfile('user-123')).rejects.toThrow('Database error');
    });

    it('should handle repository errors in updateProfile', async () => {
      mockRepository.updateProfile.mockRejectedValue(new Error('Database error'));

      await expect(profileService.updateProfile('user-123', { firstName: 'Jane' }))
        .rejects.toThrow('Database error');
    });

    it('should handle repository errors in deleteProfile', async () => {
      mockRepository.deleteProfile.mockRejectedValue(new Error('Database error'));

      await expect(profileService.deleteProfile('user-123', false)).rejects.toThrow('Database error');
    });
  });
}); 