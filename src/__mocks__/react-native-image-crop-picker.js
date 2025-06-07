/**
 * @fileoverview REACT-NATIVE-IMAGE-CROP-PICKER-MOCK: Image Cropping and Selection Mock
 * @description Jest mock for react-native-image-crop-picker providing image selection, capture, and cropping simulation for testing
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Mocks
 * @namespace Mocks.ReactNativeImageCropPicker
 * @category Testing
 * @subcategory Mocks
 */

/**
 * Image Crop Picker Mock
 * 
 * Comprehensive mock implementation for react-native-image-crop-picker library
 * providing image selection, camera capture, cropping functionality, and cleanup
 * operations for testing environment. Ensures tests run without native dependencies.
 * 
 * @constant {object} ImagePicker
 * @since 1.0.0
 * @version 1.0.0
 * @category Mocks
 * @subcategory ImageProcessing
 * 
 * @example
 * Testing image picker functionality:
 * ```js
 * import ImagePicker from 'react-native-image-crop-picker';
 * 
 * describe('Image Picker Operations', () => {
 *   it('should open image picker', async () => {
 *     const image = await ImagePicker.openPicker({
 *       width: 300,
 *       height: 300,
 *       cropping: true
 *     });
 *     
 *     expect(image.width).toBe(300);
 *     expect(image.height).toBe(300);
 *     expect(image.mime).toBe('image/jpeg');
 *   });
 * });
 * ```
 * 
 * @features
 * - Image picker simulation
 * - Camera capture mocking
 * - Image cropping functionality
 * - Cleanup operation mocking
 * - Base64 data simulation
 * - Realistic image metadata
 * - Promise-based API
 * - Error-free test execution
 * 
 * @architecture
 * - Jest mock functions for all operations
 * - Consistent mock data structure
 * - Promise-based return values
 * - Realistic image processing simulation
 * - Memory management mocking
 */
const ImagePicker = {
  /**
   * Mock Image Picker
   * 
   * Simulates opening the device image library with cropping capabilities.
   * Returns consistent mock image data for testing image selection workflows.
   * 
   * @function openPicker
   * @returns {Promise<object>} Promise resolving to image data object
   * 
   * @since 1.0.0
   * @version 1.0.0
   * @category Functions
   * @subcategory ImageSelection
   * 
   * @example
   * Basic image selection:
   * ```js
   * const selectImage = async () => {
   *   try {
   *     const image = await ImagePicker.openPicker({
   *       width: 400,
   *       height: 400,
   *       cropping: true,
   *       includeBase64: true
   *     });
   *     
   *     setSelectedImage(image);
   *   } catch (error) {
   *     console.log('User cancelled image picker');
   *   }
   * };
   * ```
   * 
   * @example
   * Multiple image selection:
   * ```js
   * const selectMultiple = async () => {
   *   const images = await ImagePicker.openPicker({
   *     multiple: true,
   *     maxFiles: 5,
   *     mediaType: 'photo'
   *   });
   *   
   *   setGalleryImages(images);
   * };
   * ```
   */
  openPicker: jest.fn(() => Promise.resolve({
    path: 'mock://path/to/image.jpg',
    sourceURL: 'mock://path/to/image.jpg',
    filename: 'image.jpg',
    width: 300,
    height: 300,
    mime: 'image/jpeg',
    size: 100000,
    data: 'base64data',
  })),

  /**
   * Mock Camera Opener
   * 
   * Simulates opening the device camera for photo capture with optional cropping.
   * Returns consistent mock camera capture data for testing camera workflows.
   * 
   * @function openCamera
   * @returns {Promise<object>} Promise resolving to captured image data
   * 
   * @since 1.0.0
   * @version 1.0.0
   * @category Functions
   * @subcategory CameraCapture
   * 
   * @example
   * Camera with cropping:
   * ```js
   * const capturePhoto = async () => {
   *   try {
   *     const image = await ImagePicker.openCamera({
   *       width: 300,
   *       height: 300,
   *       cropping: true,
   *       useFrontCamera: false
   *     });
   *     
   *     uploadPhoto(image);
   *   } catch (error) {
   *     console.log('Camera capture cancelled');
   *   }
   * };
   * ```
   * 
   * @example
   * Profile picture capture:
   * ```js
   * const captureProfilePic = async () => {
   *   const profileImage = await ImagePicker.openCamera({
   *     width: 200,
   *     height: 200,
   *     cropping: true,
   *     cropperCircleOverlay: true,
   *     includeBase64: true
   *   });
   *   
   *   setProfilePicture(profileImage);
   * };
   * ```
   */
  openCamera: jest.fn(() => Promise.resolve({
    path: 'mock://path/to/image.jpg',
    sourceURL: 'mock://path/to/image.jpg',
    filename: 'image.jpg',
    width: 300,
    height: 300,
    mime: 'image/jpeg',
    size: 100000,
    data: 'base64data',
  })),

  /**
   * Mock Image Cropper
   * 
   * Simulates opening the image cropping interface for existing images.
   * Returns consistent mock cropped image data for testing crop workflows.
   * 
   * @function openCropper
   * @returns {Promise<object>} Promise resolving to cropped image data
   * 
   * @since 1.0.0
   * @version 1.0.0
   * @category Functions
   * @subcategory ImageCropping
   * 
   * @example
   * Cropping existing image:
   * ```js
   * const cropImage = async (imagePath) => {
   *   try {
   *     const croppedImage = await ImagePicker.openCropper({
   *       path: imagePath,
   *       width: 300,
   *       height: 300,
   *       cropperToolbarTitle: 'Bild zuschneiden'
   *     });
   *     
   *     setEditedImage(croppedImage);
   *   } catch (error) {
   *     console.log('Cropping cancelled');
   *   }
   * };
   * ```
   * 
   * @example
   * Avatar cropping:
   * ```js
   * const cropAvatar = async (selectedImage) => {
   *   const avatar = await ImagePicker.openCropper({
   *     path: selectedImage.path,
   *     width: 150,
   *     height: 150,
   *     cropperCircleOverlay: true,
   *     freeStyleCropEnabled: false
   *   });
   *   
   *   updateUserAvatar(avatar);
   * };
   * ```
   */
  openCropper: jest.fn(() => Promise.resolve({
    path: 'mock://path/to/image.jpg',
    sourceURL: 'mock://path/to/image.jpg',
    filename: 'image.jpg',
    width: 300,
    height: 300,
    mime: 'image/jpeg',
    size: 100000,
    data: 'base64data',
  })),

  /**
   * Mock Cleanup All
   * 
   * Simulates cleaning up all temporary image files created by the picker.
   * Provides memory management simulation for testing cleanup workflows.
   * 
   * @function clean
   * @returns {Promise<void>} Promise resolving on successful cleanup
   * 
   * @since 1.0.0
   * @version 1.0.0
   * @category Functions
   * @subcategory MemoryManagement
   * 
   * @example
   * Cleanup on component unmount:
   * ```js
   * useEffect(() => {
   *   return () => {
   *     ImagePicker.clean().catch(console.error);
   *   };
   * }, []);
   * ```
   * 
   * @example
   * Manual cleanup:
   * ```js
   * const clearImageCache = async () => {
   *   try {
   *     await ImagePicker.clean();
   *     showMessage('Cache cleared successfully');
   *   } catch (error) {
   *     showError('Failed to clear cache');
   *   }
   * };
   * ```
   */
  clean: jest.fn(() => Promise.resolve()),

  /**
   * Mock Single File Cleanup
   * 
   * Simulates cleaning up a specific temporary image file.
   * Provides targeted memory management simulation for testing.
   * 
   * @function cleanSingle
   * @returns {Promise<void>} Promise resolving on successful single file cleanup
   * 
   * @since 1.0.0
   * @version 1.0.0
   * @category Functions
   * @subcategory MemoryManagement
   * 
   * @example
   * Single file cleanup:
   * ```js
   * const removeProcessedImage = async (imagePath) => {
   *   try {
   *     await ImagePicker.cleanSingle(imagePath);
   *     setProcessedImage(null);
   *   } catch (error) {
   *     console.error('Failed to cleanup single image:', error);
   *   }
   * };
   * ```
   * 
   * @example
   * Conditional cleanup:
   * ```js
   * const handleImageUpload = async (image) => {
   *   try {
   *     await uploadToServer(image);
   *     // Clean up temporary file after successful upload
   *     await ImagePicker.cleanSingle(image.path);
   *   } catch (error) {
   *     console.error('Upload failed, keeping temp file');
   *   }
   * };
   * ```
   */
  cleanSingle: jest.fn(() => Promise.resolve()),
};

export default ImagePicker; 