/**
 * @fileoverview REACT-NATIVE-IMAGE-PICKER-MOCK: Image Selection Mock
 * @description Jest mock for react-native-image-picker providing camera and gallery access simulation for testing
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Mocks
 * @namespace Mocks.ReactNativeImagePicker
 * @category Testing
 * @subcategory Mocks
 */

/**
 * Mock Image Library Launcher
 * 
 * Simulates opening the device image library and selecting photos.
 * Provides consistent mock responses for testing image selection workflows
 * without requiring device permissions or native module interactions.
 * 
 * @function launchImageLibrary
 * @param {object} options - Image picker configuration options
 * @param {function} [callback] - Optional callback function for response
 * @returns {Promise<object>} Promise resolving to image picker response
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory ImageSelection
 * 
 * @example
 * Testing image library selection:
 * ```js
 * import { launchImageLibrary } from 'react-native-image-picker';
 * 
 * describe('Image Selection', () => {
 *   it('should select image from library', async () => {
 *     const response = await launchImageLibrary({
 *       mediaType: 'photo',
 *       quality: 0.8
 *     });
 *     
 *     expect(response.didCancel).toBe(false);
 *     expect(response.assets).toHaveLength(1);
 *     expect(response.assets[0].type).toBe('image/jpeg');
 *   });
 * });
 * ```
 * 
 * @example
 * Testing with callback:
 * ```js
 * launchImageLibrary({ mediaType: 'photo' }, (response) => {
 *   expect(response.assets[0].uri).toBe('mock://path/to/image.jpg');
 * });
 * ```
 * 
 * @features
 * - Mock image selection from library
 * - Consistent response format
 * - Callback and Promise support
 * - Realistic image metadata
 * - Error-free test execution
 * - No permission requirements
 */
export const launchImageLibrary = jest.fn((options, callback) => {
  const response = {
    didCancel: false,
    errorMessage: null,
    assets: [{
      uri: 'mock://path/to/image.jpg',
      fileName: 'image.jpg',
      type: 'image/jpeg',
      fileSize: 100000,
      width: 300,
      height: 300,
    }],
  };
  
  if (callback) {
    callback(response);
  }
  return Promise.resolve(response);
});

/**
 * Mock Camera Launcher
 * 
 * Simulates opening the device camera and capturing photos.
 * Provides consistent mock responses for testing camera capture workflows
 * without requiring camera permissions or native module interactions.
 * 
 * @function launchCamera
 * @param {object} options - Camera configuration options
 * @param {function} [callback] - Optional callback function for response
 * @returns {Promise<object>} Promise resolving to camera capture response
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory CameraCapture
 * 
 * @example
 * Testing camera capture:
 * ```js
 * import { launchCamera } from 'react-native-image-picker';
 * 
 * describe('Camera Capture', () => {
 *   it('should capture photo from camera', async () => {
 *     const response = await launchCamera({
 *       mediaType: 'photo',
 *       quality: 1.0
 *     });
 *     
 *     expect(response.didCancel).toBe(false);
 *     expect(response.assets).toHaveLength(1);
 *     expect(response.assets[0].fileName).toBe('image.jpg');
 *   });
 * });
 * ```
 * 
 * @example
 * Testing camera with error handling:
 * ```js
 * const handleCameraCapture = async () => {
 *   try {
 *     const result = await launchCamera({ mediaType: 'photo' });
 *     if (!result.didCancel && !result.errorMessage) {
 *       setSelectedImage(result.assets[0]);
 *     }
 *   } catch (error) {
 *     console.error('Camera capture failed:', error);
 *   }
 * };
 * ```
 * 
 * @features
 * - Mock camera photo capture
 * - Consistent response format
 * - Callback and Promise support
 * - Realistic image metadata
 * - Error-free test execution
 * - No camera permission requirements
 */
export const launchCamera = jest.fn((options, callback) => {
  const response = {
    didCancel: false,
    errorMessage: null,
    assets: [{
      uri: 'mock://path/to/image.jpg',
      fileName: 'image.jpg',
      type: 'image/jpeg',
      fileSize: 100000,
      width: 300,
      height: 300,
    }],
  };
  
  if (callback) {
    callback(response);
  }
  return Promise.resolve(response);
});

/**
 * Media Type Constants
 * 
 * Defines supported media types for image picker operations.
 * Provides consistent constants for specifying media selection preferences.
 * 
 * @constant {object} MediaType
 * @since 1.0.0
 * @version 1.0.0
 * @category Constants
 * @subcategory MediaTypes
 * 
 * @property {string} photo - Photo media type identifier
 * @property {string} video - Video media type identifier  
 * @property {string} mixed - Mixed media type identifier
 * 
 * @example
 * Using media type constants:
 * ```js
 * import { MediaType, launchImageLibrary } from 'react-native-image-picker';
 * 
 * const selectPhoto = () => {
 *   launchImageLibrary({
 *     mediaType: MediaType.photo,
 *     quality: 0.8
 *   });
 * };
 * 
 * const selectVideo = () => {
 *   launchImageLibrary({
 *     mediaType: MediaType.video,
 *     videoQuality: 'high'
 *   });
 * };
 * 
 * const selectAny = () => {
 *   launchImageLibrary({
 *     mediaType: MediaType.mixed,
 *     selectionLimit: 5
 *   });
 * };
 * ```
 * 
 * @example
 * Form integration:
 * ```js
 * const AvatarUploader = () => {
 *   const selectAvatar = () => {
 *     launchImageLibrary({
 *       mediaType: MediaType.photo,
 *       maxWidth: 400,
 *       maxHeight: 400,
 *       quality: 0.8
 *     }, (response) => {
 *       if (response.assets?.[0]) {
 *         uploadAvatar(response.assets[0]);
 *       }
 *     });
 *   };
 * 
 *   return (
 *     <Button title="Avatar auswählen" onPress={selectAvatar} />
 *   );
 * };
 * ```
 */
export const MediaType = {
  photo: 'photo',
  video: 'video',
  mixed: 'mixed',
}; 