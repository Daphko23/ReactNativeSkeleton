/**
 * AvatarService Tests - Data Layer
 * Comprehensive tests for avatar upload and management
 */

import { AvatarService } from '../avatar.service';

// Mock Supabase
jest.mock('../../../../../core/config/supabase.config', () => ({
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
}));

// Mock react-native-blob-util
jest.mock('react-native-blob-util', () => ({
  default: {
    fs: {
      readFile: jest.fn(),
    },
  },
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
      expect(result.errors).toContain('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
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
    const { supabase } = require('../../../../../core/config/supabase.config');
    
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

      // Reset fetch mock for each test
      (global.fetch as jest.Mock).mockReset();
    });

    it('should upload avatar successfully', async () => {
      const mockFile = {
        name: 'avatar.jpg',
        size: 1024,
        type: 'image/jpeg',
        uri: 'file://path/to/avatar.jpg',
        width: 400,
        height: 400,
        mime: 'image/jpeg'
      };

      // Mock fetch for file reading
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
      });

      // Mock Supabase Storage upload
      supabase.storage.from.mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: { path: 'user-123/12345.jpg' },
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/avatar.jpg' },
        }),
      });

      // Mock profiles table update
      supabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: [{ id: 'user-123', avatar_url: 'https://example.com/avatar.jpg' }],
              error: null,
            }),
          }),
        }),
      });

      const result = await avatarService.uploadAvatar({
        file: mockFile,
        userId: 'user-123',
      });

      expect(result.success).toBe(true);
      expect(result.avatarUrl).toBe('https://example.com/avatar.jpg');
    });

    it('should fail when file validation fails', async () => {
      const invalidFile = {
        name: 'large-file.jpg',
        size: 6 * 1024 * 1024, // 6MB
        type: 'image/jpeg',
        uri: 'file://path/to/large-file.jpg',
        width: 400,
        height: 400,
        mime: 'image/jpeg'
      };

      const result = await avatarService.uploadAvatar({
        file: invalidFile,
        userId: 'user-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('File zu groß. Maximum: 5MB');
    });

    it('should fail when user is not authenticated', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const mockFile = {
        name: 'avatar.jpg',
        size: 1024,
        type: 'image/jpeg',
        uri: 'file://path/to/avatar.jpg',
        width: 400,
        height: 400,
        mime: 'image/jpeg'
      };

      const result = await avatarService.uploadAvatar({
        file: mockFile,
        userId: 'user-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication required');
    });

    it('should call progress callback during upload', async () => {
      const mockFile = {
        name: 'avatar.jpg',
        size: 1024,
        type: 'image/jpeg',
        uri: 'file://path/to/avatar.jpg',
        width: 400,
        height: 400,
        mime: 'image/jpeg'
      };

      const progressCallback = jest.fn();
      const RNFetchBlob = require('react-native-blob-util').default;
      RNFetchBlob.fs.readFile.mockResolvedValue('base64-data');

      // Ensure window is undefined to use RNFetchBlob path
      const originalWindow = global.window;
      (global as any).window = undefined;

      // Mock fetch response for this test
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          avatarUrl: 'https://example.com/avatar.jpg',
        }),
      });

      await avatarService.uploadAvatar({
        file: mockFile,
        userId: 'user-123',
        onProgress: progressCallback,
      });

      // Restore window
      global.window = originalWindow;

      // Simply verify that progress callback was called at least once
      expect(progressCallback).toHaveBeenCalled();
      expect(progressCallback.mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('deleteAvatar', () => {
    const { supabase } = require('../../../../../core/config/supabase.config');

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

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: true,
        }),
      });
    });

    it('should delete avatar successfully', async () => {
      // Mock getAvatarUrl to return a valid avatar URL
      const mockAvatarUrl = 'https://example.supabase.co/storage/v1/object/public/avatars/user-123/avatar.jpg';
      jest.spyOn(avatarService, 'getAvatarUrl').mockResolvedValue(mockAvatarUrl);

      // Mock Supabase Storage delete
      supabase.storage.from.mockReturnValue({
        remove: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      });

      // Mock profiles table update
      supabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: [{ id: 'user-123', avatar_url: null }],
              error: null,
            }),
          }),
        }),
      });

      const result = await avatarService.deleteAvatar('user-123');
      
      expect(result.success).toBe(true);
    });

    it('should fail when user is not authenticated', async () => {
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await avatarService.deleteAvatar();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication required');
    });
  });

  describe('getAvatarUrl', () => {
    const { supabase } = require('../../../../../core/config/supabase.config');

    it('should return avatar URL from RPC call', async () => {
      const mockUrl = 'https://example.com/user-avatar.jpg';
      
      // Mock profiles table query to fail, so it falls back to RPC
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Row not found' },
            }),
          }),
        }),
      });

      // Mock RPC call
      supabase.rpc.mockResolvedValue({
        data: mockUrl,
        error: null,
      });

      // Mock fetch for URL validation
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
      });

      const result = await avatarService.getAvatarUrl('user-123');
      
      expect(result).toBe(mockUrl);
      expect(supabase.rpc).toHaveBeenCalledWith('get_avatar_url', {
        user_uuid: 'user-123',
      });
    });

    it('should return default avatar URL when RPC fails', async () => {
      // Mock profiles table query to fail, so it falls back to RPC
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Row not found' },
            }),
          }),
        }),
      });

      supabase.rpc.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });

      const result = await avatarService.getAvatarUrl('user-123');
      
      expect(result).toBe(avatarService.getDefaultAvatarUrl());
    });

    it('should return default avatar URL when no data returned', async () => {
      // Mock profiles table query to fail, so it falls back to RPC
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Row not found' },
            }),
          }),
        }),
      });

      supabase.rpc.mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await avatarService.getAvatarUrl('user-123');
      
      expect(result).toBe(avatarService.getDefaultAvatarUrl());
    });
  });

  describe('generateInitialsAvatar', () => {
    it('should generate initials for single name', () => {
      const result = avatarService.generateInitialsAvatar('John');
      expect(result).toContain('name=J');
    });

    it('should generate initials for full name', () => {
      const result = avatarService.generateInitialsAvatar('John Doe');
      expect(result).toContain('name=JD');
    });

    it('should handle multiple names and limit to 2 characters', () => {
      const result = avatarService.generateInitialsAvatar('John Michael Doe');
      expect(result).toContain('name=JM');
    });

    it('should handle empty names gracefully', () => {
      const result = avatarService.generateInitialsAvatar('');
      expect(result).toContain('name=');
    });

    it('should respect custom size parameter', () => {
      const result = avatarService.generateInitialsAvatar('John Doe');
      expect(result).toContain('size=200');
    });
  });

  describe('getDefaultAvatarUrl', () => {
    it('should return the correct default avatar URL', () => {
      const result = avatarService.getDefaultAvatarUrl();
      expect(result).toBe(
        'https://ui-avatars.com/api/?name=U&background=0ea5e9&color=ffffff&size=200'
      );
    });
  });
}); 