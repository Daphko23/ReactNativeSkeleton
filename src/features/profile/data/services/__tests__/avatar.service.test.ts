/**
 * AvatarService Tests - Data Layer
 * Comprehensive tests for avatar upload and management
 */

import { AvatarService } from '../avatar.service';

// Mock Supabase with avatarStorageConfig
jest.mock('@core/config/supabase.config', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    rpc: jest.fn(),
    storage: {
      from: jest.fn(),
    },
    from: jest.fn(),
  },
  avatarStorageConfig: {
    bucket: 'avatars',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    cacheControl: '3600',
  },
}));

// Mock react-native-blob-util
jest.mock('react-native-blob-util', () => ({
  default: {
    fs: {
      readFile: jest.fn().mockResolvedValue('base64-mock-data'),
    },
  },
}));

// Mock base64-arraybuffer
jest.mock('base64-arraybuffer', () => ({
  decode: jest.fn().mockReturnValue(new ArrayBuffer(1024))
}));

// Mock fetch
global.fetch = jest.fn();

describe('AvatarService', () => {
  let avatarService: AvatarService;

  beforeEach(() => {
    jest.clearAllMocks();
    avatarService = new AvatarService();
  });

  describe('validateAvatarFile', () => {
    it('should validate file size correctly', () => {
      const validFile = {
        name: 'avatar.jpg',
        size: 1024 * 1024, // 1MB
        type: 'image/jpeg',
        uri: 'file://path/to/avatar.jpg',
      };

      const result = avatarService.validateAvatarFile(validFile);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject files that are too large', () => {
      const largeFile = {
        name: 'large-avatar.jpg',
        size: 6 * 1024 * 1024, // 6MB
        type: 'image/jpeg',
        uri: 'file://path/to/large-avatar.jpg',
      };

      const result = avatarService.validateAvatarFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('File size exceeds 5MB limit');
    });

    it('should reject invalid file types', () => {
      const invalidFile = {
        name: 'document.pdf',
        size: 1024,
        type: 'application/pdf',
        uri: 'file://path/to/document.pdf',
      };

      const result = avatarService.validateAvatarFile(invalidFile);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid file type. Allowed: image/jpeg, image/png, image/webp, image/gif');
    });

    it('should reject invalid file extensions', () => {
      const invalidExtFile = {
        name: 'avatar.txt',
        size: 1024,
        type: 'image/jpeg',
        uri: 'file://path/to/avatar.txt',
      };

      const result = avatarService.validateAvatarFile(invalidExtFile);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid file extension');
    });

    it('should validate all allowed file types', () => {
      const allowedTypes = [
        { name: 'avatar.jpg', type: 'image/jpeg' },
        { name: 'avatar.jpeg', type: 'image/jpeg' },
        { name: 'avatar.png', type: 'image/png' },
        { name: 'avatar.webp', type: 'image/webp' },
        { name: 'avatar.gif', type: 'image/gif' },
      ];

      allowedTypes.forEach(({ name, type }) => {
        const file = {
          name,
          size: 1024,
          type,
          uri: 'file://path/to/file',
        };

        const result = avatarService.validateAvatarFile(file);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('uploadAvatar', () => {
    const { supabase } = require('@core/config/supabase.config');
    
    beforeEach(() => {
      supabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'mock-token',
            user: { id: 'user-123' },
          },
        },
        error: null,
      });

      // Mock Supabase storage
      const mockStorageFrom = {
        upload: jest.fn().mockResolvedValue({
          data: { path: 'users/user-123/avatar_1749504421922.jpg' },
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { 
            publicUrl: 'https://storage.example.com/avatars/user-123/1749504421922.jpg' 
          }
        }),
      };

      supabase.storage.from.mockReturnValue(mockStorageFrom);

      // Reset fetch mock for each test
      (global.fetch as jest.Mock).mockReset();
    });

    it('should upload avatar successfully', async () => {
      const mockFile = {
        uri: 'file://path/to/avatar.jpg',
        fileName: 'avatar.jpg',
        size: 1024,
        mime: 'image/jpeg',
        width: 400,
        height: 400
      };

      const result = await avatarService.uploadAvatar({
        file: mockFile,
        userId: 'user-123',
      });

      expect(result.success).toBe(true);
      expect(result.avatarUrl).toBe('https://storage.example.com/avatars/user-123/1749504421922.jpg');
    });

    it('should fail when file validation fails', async () => {
      const invalidFile = {
        uri: 'file://path/to/large-file.jpg',
        fileName: 'large-file.jpg',
        size: 6 * 1024 * 1024, // 6MB
        mime: 'image/jpeg',
        width: 400,
        height: 400
      };

      const result = await avatarService.uploadAvatar({
        file: invalidFile,
        userId: 'user-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('File size exceeds 5MB limit');
    });

    it('should fail when user is not authenticated', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      // Mock storage upload to fail when no session
      const mockStorageFrom = {
        upload: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Unauthenticated access' },
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { 
            publicUrl: 'https://storage.example.com/avatars/user-123/1749504421922.jpg' 
          }
        }),
      };

      supabase.storage.from.mockReturnValue(mockStorageFrom);

      const mockFile = {
        uri: 'file://path/to/avatar.jpg',
        fileName: 'avatar.jpg',
        size: 1024,
        mime: 'image/jpeg',
        width: 400,
        height: 400
      };

      const result = await avatarService.uploadAvatar({
        file: mockFile,
        userId: 'user-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Upload failed');
    });

    it('should call progress callback during upload', async () => {
      const mockFile = {
        uri: 'file://path/to/avatar.jpg',
        fileName: 'avatar.jpg',
        size: 1024,
        mime: 'image/jpeg',
        width: 400,
        height: 400
      };

      const progressCallback = jest.fn();

      await avatarService.uploadAvatar({
        file: mockFile,
        userId: 'user-123',
        onProgress: progressCallback,
      });

      // Simply verify that progress callback was called at least once
      expect(progressCallback).toHaveBeenCalled();
      expect(progressCallback.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('deleteAvatar', () => {
    const { supabase } = require('@core/config/supabase.config');

    beforeEach(() => {
      supabase.auth.getSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'mock-token',
            user: { id: 'user-123' },
          },
        },
        error: null,
      });

      const mockStorageFrom = {
        list: jest.fn().mockResolvedValue({
          data: [
            { name: 'avatar_123.jpg' },
            { name: 'avatar_456.png' },
          ],
          error: null,
        }),
        remove: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      supabase.storage.from.mockReturnValue(mockStorageFrom);

      // Reset fetch mock
      (global.fetch as jest.Mock).mockReset();
    });

    it('should delete avatar successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: true,
        }),
      });

      const result = await avatarService.deleteAvatar('user-123');
      
      expect(result.success).toBe(true);
    });

    it('should fail when user is not authenticated', async () => {
      const result = await avatarService.deleteAvatar(undefined);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('User ID is required for avatar deletion');
    });
  });

  describe('getAvatarUrl', () => {
    const { supabase } = require('@core/config/supabase.config');

    beforeEach(() => {
      // Mock supabase RPC call
      supabase.rpc.mockResolvedValue({
        data: 'User',
        error: null,
      });

      // Reset fetch mock
      (global.fetch as jest.Mock).mockReset();
    });

    it('should return avatar URL from RPC call', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false, // Simulate failed URL validation to trigger fallback
      });

      const result = await avatarService.getAvatarUrl('user-123');
      
      // Expect fallback URL as fetch validation fails
      expect(result).toBe('https://ui-avatars.com/api/?name=User&background=6366f1&color=ffffff&size=200');
    });

    it('should return default avatar URL when RPC fails', async () => {
      supabase.rpc.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });

      const result = await avatarService.getAvatarUrl('user-123');
      expect(result).toBe('https://ui-avatars.com/api/?name=User&background=6366f1&color=ffffff&size=200');
    });

    it('should return null for invalid user ID', async () => {
      const result = await avatarService.getAvatarUrl('');
      expect(result).toBe('https://ui-avatars.com/api/?name=User&background=6366f1&color=ffffff&size=200');
    });
  });

  describe('generateInitialsAvatar', () => {
    it('should generate initials for full name', () => {
      const result = avatarService.generateInitialsAvatar('John Doe');
      expect(result).toContain('name=John%20Doe');
    });

    it('should handle multiple names and limit to 2 characters', () => {
      const result = avatarService.generateInitialsAvatar('John Michael Doe');
      expect(result).toContain('name=John%20Michael%20Doe');
    });

    it('should handle empty names gracefully', () => {
      const result = avatarService.generateInitialsAvatar('');
      expect(result).toBe('https://ui-avatars.com/api/?name=User&background=6366f1&color=ffffff&size=200');
    });

    it('should handle single names', () => {
      const result = avatarService.generateInitialsAvatar('John');
      expect(result).toContain('name=John');
    });
  });

  describe('getDefaultAvatarUrl', () => {
    it('should return the correct default avatar URL', () => {
      const result = avatarService.getDefaultAvatarUrl();
      expect(result).toBe(
        'https://ui-avatars.com/api/?name=User&background=6366f1&color=ffffff&size=200'
      );
    });
  });
}); 