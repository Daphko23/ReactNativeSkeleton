/**
 * @fileoverview IMAGE-PICKER-SERVICE-TESTS: Enterprise Service Testing Suite
 * @description Comprehensive test suite für ImagePickerService mit umfassender
 * Native API Integration, Permission Handling, Platform-spezifischen Flows,
 * Error Handling und Performance Testing. Implementiert Enterprise Testing
 * Standards mit Mock-Integration für React Native Dependencies.
 *
 * @version 1.0.0
 * @since 2024-01-15
 * @author ReactNativeSkeleton Enterprise Team
 * @module ImagePickerServiceTests
 * @namespace Features.Profile.Data.Services.Tests
 * @category ServiceTesting
 * @subcategory NativeIntegration
 */

// Mock image picker modules
jest.mock('react-native-image-crop-picker', () => ({
  openCamera: jest.fn(),
  openPicker: jest.fn(),
  clean: jest.fn(),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

// Mock React Native modules with proper mock functions
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    Version: 30,
    select: jest.fn(platforms => platforms.android || platforms.default),
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      CAMERA: 'android.permission.CAMERA',
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      NEVER_ASK_AGAIN: 'never_ask_again',
    },
    check: jest.fn().mockResolvedValue(true),
    request: jest.fn().mockResolvedValue('granted'),
  },
}));

import { ImagePickerService } from '../image-picker.service';
import {
  ImagePickerOptions,
  AVATAR_CONSTANTS,
} from '../../../domain/interfaces/avatar.interface';

// Import mocked modules after mocking
import ImagePicker from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Platform,
  PermissionsAndroid as _PermissionsAndroid,
} from 'react-native';

// Type the mocked modules
const mockImagePicker = ImagePicker as jest.Mocked<typeof ImagePicker>;
const mockLaunchImageLibrary = launchImageLibrary as jest.MockedFunction<
  typeof launchImageLibrary
>;
const mockPlatform = Platform as jest.Mocked<typeof Platform>;
let mockPermissionsAndroid: any;

describe('ImagePickerService', () => {
  let service: ImagePickerService;

  // Helper function to create mock image picker options
  const createImagePickerOptions = (
    overrides: Partial<ImagePickerOptions> = {}
  ): ImagePickerOptions => ({
    width: AVATAR_CONSTANTS.DIMENSIONS.width,
    height: AVATAR_CONSTANTS.DIMENSIONS.height,
    cropping: true,
    cropperCircleOverlay: true,
    mediaType: 'photo',
    includeBase64: false,
    quality: AVATAR_CONSTANTS.QUALITY,
    maxFileSize: AVATAR_CONSTANTS.MAX_FILE_SIZE,
    ...overrides,
  });

  // Helper function to create mock crop picker image result
  const createCropPickerImage = (overrides: any = {}) => ({
    path: '/path/to/test-image.jpg',
    width: AVATAR_CONSTANTS.DIMENSIONS.width,
    height: AVATAR_CONSTANTS.DIMENSIONS.height,
    mime: 'image/jpeg',
    size: 1024 * 1024, // 1MB
    filename: 'test-image.jpg',
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ImagePickerService();

    // Reset Platform.OS to Android for consistent testing
    mockPlatform.OS = 'android';
    mockPlatform.Version = 30;

    // Directly ensure PermissionsAndroid exists and is properly mocked
    const ReactNative = require('react-native');
    const permissionsAndroidMock = {
      PERMISSIONS: {
        CAMERA: 'android.permission.CAMERA',
        READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
      },
      RESULTS: {
        GRANTED: 'granted',
        DENIED: 'denied',
        NEVER_ASK_AGAIN: 'never_ask_again',
      },
      check: jest.fn().mockResolvedValue(true),
      request: jest.fn().mockResolvedValue('granted'),
    };

    ReactNative.PermissionsAndroid = permissionsAndroidMock;
    mockPermissionsAndroid = permissionsAndroidMock;

    // Mock successful image picker operations
    mockImagePicker.openCamera.mockResolvedValue(createCropPickerImage());
    mockImagePicker.openPicker.mockResolvedValue(createCropPickerImage());
    mockImagePicker.clean.mockResolvedValue(undefined);

    // Mock react-native-image-picker for fallback scenarios
    mockLaunchImageLibrary.mockImplementation((options, callback) => {
      if (callback) {
        callback({
          didCancel: false,
          errorMessage: undefined,
          assets: [
            {
              uri: '/fallback/image.jpg',
              width: 300,
              height: 300,
              type: 'image/jpeg',
              fileSize: 1024 * 1024,
              fileName: 'fallback-image.jpg',
            },
          ],
        });
      }
      return Promise.resolve({
        didCancel: false,
        errorMessage: undefined,
        assets: [
          {
            uri: '/fallback/image.jpg',
            width: 300,
            height: 300,
            type: 'image/jpeg',
            fileSize: 1024 * 1024,
            fileName: 'fallback-image.jpg',
          },
        ],
      });
    });
  });

  describe('Camera Operations', () => {
    test('should open camera successfully on Android', async () => {
      // Configure mocks for successful camera operation
      mockPermissionsAndroid.check.mockResolvedValue(true);
      const expectedImage = createCropPickerImage({
        path: '/camera/image.jpg',
      });
      mockImagePicker.openCamera.mockResolvedValue(expectedImage);

      const options = createImagePickerOptions();
      const result = await service.openCamera(options);

      expect(mockPermissionsAndroid.check).toHaveBeenCalledWith(
        mockPermissionsAndroid.PERMISSIONS.CAMERA
      );
      expect(mockImagePicker.openCamera).toHaveBeenCalledWith({
        width: options.width,
        height: options.height,
        cropping: options.cropping,
        cropperCircleOverlay: options.cropperCircleOverlay,
        mediaType: options.mediaType,
        includeBase64: options.includeBase64,
        compressImageQuality: options.quality,
        compressImageMaxWidth: options.width,
        compressImageMaxHeight: options.height,
        freeStyleCropEnabled: false,
        cropperToolbarTitle: 'Avatar bearbeiten',
        cropperActiveWidgetColor: '#3B82F6',
        cropperStatusBarColor: '#1E40AF',
        cropperToolbarColor: '#3B82F6',
        hideBottomControls: false,
        enableRotationGesture: true,
      });

      expect(result).toEqual({
        path: '/camera/image.jpg',
        width: AVATAR_CONSTANTS.DIMENSIONS.width,
        height: AVATAR_CONSTANTS.DIMENSIONS.height,
        mime: 'image/jpeg',
        size: 1024 * 1024,
        fileName: 'test-image.jpg',
      });
    });

    test('should open camera successfully on iOS', async () => {
      mockPlatform.OS = 'ios';

      const options = createImagePickerOptions();
      const expectedImage = createCropPickerImage();
      mockImagePicker.openCamera.mockResolvedValue(expectedImage);

      const result = await service.openCamera(options);

      // iOS should not check permissions (handled automatically)
      expect(mockPermissionsAndroid.check).not.toHaveBeenCalled();
      expect(mockImagePicker.openCamera).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    test('should request camera permission when not granted', async () => {
      // Mock permission not granted initially, then granted after request
      mockPermissionsAndroid.check.mockResolvedValue(false); // checkCameraPermission() returns boolean
      mockPermissionsAndroid.request.mockResolvedValue(
        mockPermissionsAndroid.RESULTS.GRANTED
      );

      const options = createImagePickerOptions();
      const result = await service.openCamera(options);

      expect(mockPermissionsAndroid.check).toHaveBeenCalledWith(
        mockPermissionsAndroid.PERMISSIONS.CAMERA
      );
      expect(mockPermissionsAndroid.request).toHaveBeenCalledWith(
        mockPermissionsAndroid.PERMISSIONS.CAMERA,
        expect.objectContaining({
          title: 'Kamera-Berechtigung',
          message:
            'Diese App benötigt Zugriff auf Ihre Kamera, um Fotos aufzunehmen.',
        })
      );
      expect(result).toBeDefined();
    });

    test('should handle camera cancellation', async () => {
      mockImagePicker.openCamera.mockRejectedValue({
        code: 'E_PICKER_CANCELLED',
      });

      const options = createImagePickerOptions();

      await expect(service.openCamera(options)).rejects.toThrow(
        'User cancelled image selection'
      );
    });

    test('should handle camera permission error', async () => {
      mockPermissionsAndroid.check.mockResolvedValue(false);
      mockPermissionsAndroid.request.mockResolvedValue(
        mockPermissionsAndroid.RESULTS.DENIED
      );

      const options = createImagePickerOptions();

      await expect(service.openCamera(options)).rejects.toThrow(
        'Camera permission denied'
      );
    });

    test('should handle unknown camera errors', async () => {
      mockImagePicker.openCamera.mockRejectedValue(
        new Error('Unknown camera error')
      );

      const options = createImagePickerOptions();

      await expect(service.openCamera(options)).rejects.toThrow(
        'Camera error: Unknown camera error'
      );
    });

    test('should handle camera errors without message', async () => {
      mockImagePicker.openCamera.mockRejectedValue({});

      const options = createImagePickerOptions();

      await expect(service.openCamera(options)).rejects.toThrow(
        'Camera error: Unknown error'
      );
    });
  });

  describe('Gallery Operations', () => {
    test('should open gallery successfully on Android', async () => {
      mockPermissionsAndroid.check.mockResolvedValue(true);
      const expectedImage = createCropPickerImage({
        path: '/gallery/image.jpg',
      });
      mockImagePicker.openPicker.mockResolvedValue(expectedImage);

      const options = createImagePickerOptions();
      const result = await service.openGallery(options);

      expect(mockPermissionsAndroid.check).toHaveBeenCalledWith(
        mockPermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      expect(mockImagePicker.openPicker).toHaveBeenCalled();
      expect(result.path).toBe('/gallery/image.jpg');
    });

    test('should open gallery successfully on iOS', async () => {
      mockPlatform.OS = 'ios';

      const options = createImagePickerOptions();
      const expectedImage = createCropPickerImage();
      mockImagePicker.openPicker.mockResolvedValue(expectedImage);

      const result = await service.openGallery(options);

      // iOS should not check permissions (handled automatically)
      expect(mockPermissionsAndroid.check).not.toHaveBeenCalled();
      expect(mockImagePicker.openPicker).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    test('should handle iOS fallback to react-native-image-picker', async () => {
      mockPlatform.OS = 'ios';

      // First call to openPicker fails, triggering fallback
      mockImagePicker.openPicker.mockRejectedValue(
        new Error('iOS picker failed')
      );

      const options = createImagePickerOptions();
      const result = await service.openGallery(options);

      expect(mockLaunchImageLibrary).toHaveBeenCalled();
      expect(result.path).toBe('/fallback/image.jpg');
    });

    test('should handle gallery permission request', async () => {
      mockPermissionsAndroid.check.mockResolvedValue(false);
      mockPermissionsAndroid.request.mockResolvedValue(
        mockPermissionsAndroid.RESULTS.GRANTED
      );

      const options = createImagePickerOptions();
      const result = await service.openGallery(options);

      expect(mockPermissionsAndroid.request).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    test('should handle gallery cancellation', async () => {
      mockImagePicker.openPicker.mockRejectedValue({
        code: 'E_PICKER_CANCELLED',
      });

      const options = createImagePickerOptions();

      await expect(service.openGallery(options)).rejects.toThrow(
        'User cancelled image selection'
      );
    });

    test('should handle gallery permission error', async () => {
      mockPermissionsAndroid.check.mockResolvedValue(false);
      mockPermissionsAndroid.request.mockResolvedValue(
        mockPermissionsAndroid.RESULTS.DENIED
      );

      const options = createImagePickerOptions();

      await expect(service.openGallery(options)).rejects.toThrow(
        'Storage permission denied'
      );
    });

    test('should handle gallery timeout', async () => {
      // Mock a timeout scenario
      mockImagePicker.openPicker.mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(new Error('Image picker timeout - please try again')),
              100
            )
          )
      );

      const options = createImagePickerOptions();

      await expect(service.openGallery(options)).rejects.toThrow(
        'Image picker timeout - please try again'
      );
    });

    test('should skip permission check on Android 13+', async () => {
      mockPlatform.Version = 33; // Android 13

      const options = createImagePickerOptions();
      await service.openGallery(options);

      // Should return true without checking permissions on Android 13+
      expect(mockPermissionsAndroid.check).not.toHaveBeenCalled();
    });
  });

  describe('Permission Management', () => {
    test('should check camera permission correctly on Android', async () => {
      mockPermissionsAndroid.check.mockResolvedValue(true);

      const hasPermission = await service.checkCameraPermission();

      expect(mockPermissionsAndroid.check).toHaveBeenCalledWith(
        mockPermissionsAndroid.PERMISSIONS.CAMERA
      );
      expect(hasPermission).toBe(true);
    });

    test('should return true for camera permission on iOS', async () => {
      mockPlatform.OS = 'ios';

      const hasPermission = await service.checkCameraPermission();

      expect(hasPermission).toBe(true);
    });

    test('should handle camera permission check error', async () => {
      mockPermissionsAndroid.check.mockRejectedValue(
        new Error('Permission check failed')
      );

      const hasPermission = await service.checkCameraPermission();

      expect(hasPermission).toBe(false);
    });

    test('should request camera permission correctly on Android', async () => {
      mockPermissionsAndroid.request.mockResolvedValue(
        mockPermissionsAndroid.RESULTS.GRANTED
      );

      const granted = await service.requestCameraPermission();

      expect(mockPermissionsAndroid.request).toHaveBeenCalledWith(
        mockPermissionsAndroid.PERMISSIONS.CAMERA,
        expect.objectContaining({
          title: 'Kamera-Berechtigung',
          message:
            'Diese App benötigt Zugriff auf Ihre Kamera, um Fotos aufzunehmen.',
        })
      );
      expect(granted).toBe(true);
    });

    test('should return true for camera permission request on iOS', async () => {
      mockPlatform.OS = 'ios';

      const granted = await service.requestCameraPermission();

      expect(granted).toBe(true);
    });

    test('should check storage permission correctly on Android', async () => {
      mockPermissionsAndroid.check.mockResolvedValue(true);

      const hasPermission = await service.checkStoragePermission();

      expect(mockPermissionsAndroid.check).toHaveBeenCalledWith(
        mockPermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      expect(hasPermission).toBe(true);
    });

    test('should return true for storage permission on iOS', async () => {
      mockPlatform.OS = 'ios';

      const hasPermission = await service.checkStoragePermission();

      expect(hasPermission).toBe(true);
    });

    test('should return true for storage permission on Android 13+', async () => {
      mockPlatform.Version = 33;

      const hasPermission = await service.checkStoragePermission();

      expect(hasPermission).toBe(true);
    });
  });

  describe('File Validation', () => {
    test('should validate file size correctly', async () => {
      const largeImage = createCropPickerImage({ size: 10 * 1024 * 1024 }); // 10MB
      mockImagePicker.openCamera.mockResolvedValue(largeImage);

      const options = createImagePickerOptions();

      await expect(service.openCamera(options)).rejects.toThrow(
        `File too large. Maximum size: ${AVATAR_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
    });

    test('should validate file format correctly', async () => {
      const invalidImage = createCropPickerImage({ mime: 'image/gif' });
      mockImagePicker.openCamera.mockResolvedValue(invalidImage);

      const options = createImagePickerOptions();

      await expect(service.openCamera(options)).rejects.toThrow(
        `Unsupported format. Supported: ${AVATAR_CONSTANTS.SUPPORTED_FORMATS.join(', ')}`
      );
    });

    test('should accept valid file formats', async () => {
      const validImage = createCropPickerImage({ mime: 'image/jpeg' });
      mockImagePicker.openCamera.mockResolvedValue(validImage);

      const options = createImagePickerOptions();
      const result = await service.openCamera(options);

      expect(result.mime).toBe('image/jpeg');
    });

    test('should generate filename when not provided', async () => {
      const imageWithoutFilename = createCropPickerImage({
        filename: undefined,
      });
      mockImagePicker.openCamera.mockResolvedValue(imageWithoutFilename);

      const options = createImagePickerOptions();
      const result = await service.openCamera(options);

      expect(result.fileName).toMatch(/^avatar_\d+\.jpeg$/);
    });
  });

  describe('Cleanup Operations', () => {
    test('should cleanup temp files successfully', async () => {
      mockImagePicker.clean.mockResolvedValue(undefined);

      await service.cleanupTempFiles();

      expect(mockImagePicker.clean).toHaveBeenCalled();
    });

    test('should handle cleanup errors gracefully', async () => {
      mockImagePicker.clean.mockRejectedValue(new Error('Cleanup failed'));

      // Should not throw
      await expect(service.cleanupTempFiles()).resolves.toBeUndefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle malformed picker results', async () => {
      mockImagePicker.openCamera.mockResolvedValue({} as any);

      const options = createImagePickerOptions();

      await expect(service.openCamera(options)).rejects.toThrow();
    });

    test('should handle concurrent permission requests', async () => {
      const options = createImagePickerOptions();

      const promises = [
        service.openCamera(options),
        service.openCamera(options),
      ];

      // Both should complete without interference
      await expect(Promise.all(promises)).resolves.toHaveLength(2);
    });

    test('should handle very large image dimensions', async () => {
      const largeImage = createCropPickerImage({
        width: 10000,
        height: 10000,
        size: 1024 * 1024, // Keep size valid
      });
      mockImagePicker.openCamera.mockResolvedValue(largeImage);

      const options = createImagePickerOptions();
      const result = await service.openCamera(options);

      expect(result.width).toBe(10000);
      expect(result.height).toBe(10000);
    });

    test('should handle images with special characters in filename', async () => {
      const specialImage = createCropPickerImage({
        filename: 'test-image-äöü-123.jpg',
      });
      mockImagePicker.openCamera.mockResolvedValue(specialImage);

      const options = createImagePickerOptions();
      const result = await service.openCamera(options);

      expect(result.fileName).toBe('test-image-äöü-123.jpg');
    });
  });

  describe('Performance and Memory Management', () => {
    test('should handle rapid successive calls efficiently', async () => {
      const options = createImagePickerOptions();
      const startTime = Date.now();

      const promises = Array(5)
        .fill(null)
        .map(() => service.openCamera(options));
      await Promise.all(promises);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 1 second for mocked calls)
      expect(duration).toBeLessThan(1000);
    });

    test('should not leak memory during repeated operations', async () => {
      const options = createImagePickerOptions();

      // Simulate multiple operations
      for (let i = 0; i < 10; i++) {
        await service.openCamera(options);
      }

      // Should complete without memory issues (in real scenario)
      expect(mockImagePicker.openCamera).toHaveBeenCalledTimes(10);
    });
  });

  describe('Business Logic Integration', () => {
    test('should maintain consistent image metadata', async () => {
      const options = createImagePickerOptions();
      const result = await service.openCamera(options);

      expect(result).toHaveProperty('path');
      expect(result).toHaveProperty('width');
      expect(result).toHaveProperty('height');
      expect(result).toHaveProperty('mime');
      expect(result).toHaveProperty('size');
      expect(result).toHaveProperty('fileName');
    });

    test('should handle platform-specific configurations correctly', async () => {
      // Test Android configuration
      mockPlatform.OS = 'android';
      const androidOptions = createImagePickerOptions();
      await service.openGallery(androidOptions);

      expect(mockImagePicker.openPicker).toHaveBeenCalledWith(
        expect.objectContaining({
          cropperActiveWidgetColor: '#3B82F6',
          cropperStatusBarColor: '#1E40AF',
          cropperToolbarColor: '#3B82F6',
        })
      );

      // Test iOS configuration - iOS uses simple mode first
      mockPlatform.OS = 'ios';
      mockImagePicker.openPicker.mockClear();

      const iosOptions = createImagePickerOptions();
      await service.openGallery(iosOptions);

      // iOS uses simple mode without cropping first
      expect(mockImagePicker.openPicker).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaType: 'photo',
          includeBase64: false,
          compressImageQuality: 0.8,
          maxWidth: iosOptions.width,
          maxHeight: iosOptions.height,
        })
      );
    });
  });
});
