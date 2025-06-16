/**
 * ImagePickerService - Enterprise Edition
 * Real implementation using react-native-image-crop-picker
 */

import ImagePicker, { Image as CropPickerImage } from 'react-native-image-crop-picker';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';
import { 
  IImagePickerService, 
  ImagePickerOptions, 
  ImagePickerResult,
  AVATAR_CONSTANTS 
} from '../../domain/interfaces/avatar.interface';

const logger = LoggerFactory.createServiceLogger('ImagePickerService');

export class ImagePickerService implements IImagePickerService {
  
  async openCamera(options: ImagePickerOptions): Promise<ImagePickerResult> {
    const correlationId = `camera_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Opening camera for image capture', LogCategory.BUSINESS, {
      userId: 'system',
      metadata: {
        correlationId,
        options: {
          width: options.width,
          height: options.height,
          cropping: options.cropping,
          mediaType: options.mediaType
        }
      }
    });

    try {
      // Check and request camera permission
      const hasPermission = await this.checkCameraPermission();
      if (!hasPermission) {
        logger.warn('Camera permission not granted, requesting', LogCategory.SECURITY, {
          userId: 'system',
          metadata: { correlationId }
        });
        const granted = await this.requestCameraPermission();
        if (!granted) {
          logger.error('Camera permission denied by user', LogCategory.SECURITY, {
            userId: 'system',
            metadata: { correlationId }
          });
          throw new Error('Camera permission denied');
        }
      }

      const image: CropPickerImage = await ImagePicker.openCamera({
        width: options.width,
        height: options.height,
        cropping: options.cropping,
        cropperCircleOverlay: options.cropperCircleOverlay,
        mediaType: options.mediaType,
        includeBase64: options.includeBase64,
        compressImageQuality: options.quality || AVATAR_CONSTANTS.QUALITY,
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

      const result = this.mapToImagePickerResult(image);
      
      logger.info('Camera image capture successful', LogCategory.BUSINESS, {
        userId: 'system',
        metadata: {
          correlationId,
          imagePath: image.path,
          imageSize: image.size,
          imageWidth: image.width,
          imageHeight: image.height
        }
      });

      return result;
    } catch (error: any) {
      logger.error('Camera image capture failed', LogCategory.BUSINESS, {
        userId: 'system',
        metadata: { correlationId }
      }, error);
      
      if (error?.code === 'E_PICKER_CANCELLED') {
        throw new Error('User cancelled image selection');
      }
      
      if (error?.code === 'E_NO_CAMERA_PERMISSION') {
        throw new Error('Camera permission required');
      }
      
      throw new Error(`Camera error: ${error?.message || 'Unknown error'}`);
    }
  }

  async openGallery(options: ImagePickerOptions): Promise<ImagePickerResult> {
    const correlationId = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Opening gallery for image selection', LogCategory.BUSINESS, {
      userId: 'system',
      metadata: {
        correlationId,
        platform: Platform.OS,
        options: {
          width: options.width,
          height: options.height,
          cropping: options.cropping,
          mediaType: options.mediaType
        }
      }
    });
    
    try {
      logger.info('Checking storage permission', LogCategory.SECURITY, {
        userId: 'system',
        metadata: { correlationId }
      });
      // Check and request storage permission
      const hasPermission = await this.checkStoragePermission();
      logger.info('Storage permission status', LogCategory.SECURITY, {
        userId: 'system',
        metadata: {
          correlationId,
          hasPermission
        }
      });
      
      if (!hasPermission) {
        logger.warn('Storage permission not granted, requesting', LogCategory.SECURITY, {
          userId: 'system',
          metadata: { correlationId }
        });
        const granted = await this.requestStoragePermission();
        logger.info('Storage permission request result', LogCategory.SECURITY, {
          userId: 'system',
          metadata: {
            correlationId,
            granted
          }
        });
        
        if (!granted) {
          logger.error('Storage permission denied by user', LogCategory.SECURITY, {
            userId: 'system',
            metadata: { correlationId }
          });
          throw new Error('Storage permission denied');
        }
      }

      // Versuche zunächst ohne Cropping für bessere Kompatibilität
      if (Platform.OS === 'ios') {
        logger.info('Attempting iOS simple approach without cropping', LogCategory.BUSINESS, {
          userId: 'system',
          metadata: { correlationId }
        });
        try {
          const image: CropPickerImage = await Promise.race([
            ImagePicker.openPicker({
              mediaType: 'photo',
              includeBase64: false, // No base64 needed for cloud storage
              compressImageQuality: 0.8,
              maxWidth: options.width,
              maxHeight: options.height,
            }),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 5000)
            )
          ]);
          
          logger.info('iOS simple image selection successful', LogCategory.BUSINESS, {
            userId: 'system',
            metadata: {
              correlationId,
              imagePath: image.path,
              imageSize: image.size
            }
          });
          
          const result = this.mapToImagePickerResult(image);
          logger.info('iOS simple result mapped successfully', LogCategory.BUSINESS, {
            userId: 'system',
            metadata: {
              correlationId,
              resultPath: result.path,
              resultSize: result.size
            }
          });
          return result;
        } catch (simpleError: any) {
          logger.warn('iOS simple mode failed, trying fallback', LogCategory.BUSINESS, {
            userId: 'system',
            metadata: {
              correlationId,
              error: simpleError.message
            }
          });
          
          // Fallback zu react-native-image-picker für iOS
          try {
            logger.info('Using react-native-image-picker as iOS fallback', LogCategory.BUSINESS, {
              userId: 'system',
              metadata: { correlationId }
            });
            
            const result = await new Promise<ImagePickerResult>((resolve, reject) => {
              launchImageLibrary(
                {
                  mediaType: 'photo' as MediaType,
                  includeBase64: false, // No base64 needed for cloud storage
                  maxWidth: options.width,
                  maxHeight: options.height,
                  quality: (options.quality || 0.8) as any,
                  selectionLimit: 1,
                },
                (response: ImagePickerResponse) => {
                  logger.info('react-native-image-picker response received', LogCategory.BUSINESS, {
                    userId: 'system',
                    metadata: {
                      correlationId,
                      didCancel: response.didCancel,
                      hasAssets: !!response.assets?.length,
                      hasError: !!response.errorMessage
                    }
                  });
                  
                  if (response.didCancel) {
                    logger.info('User cancelled image selection (fallback)', LogCategory.BUSINESS, {
                      userId: 'system',
                      metadata: { correlationId }
                    });
                    reject(new Error('User cancelled image selection'));
                    return;
                  }
                  
                  if (response.errorMessage) {
                    logger.error('react-native-image-picker error', LogCategory.BUSINESS, {
                      userId: 'system',
                      metadata: {
                        correlationId,
                        errorMessage: response.errorMessage
                      }
                    });
                    reject(new Error(response.errorMessage));
                    return;
                  }
                  
                  if (response.assets && response.assets.length > 0) {
                    const asset = response.assets[0];
                    logger.info('Asset selected via fallback', LogCategory.BUSINESS, {
                      userId: 'system',
                      metadata: {
                        correlationId,
                        assetUri: asset.uri,
                        assetSize: asset.fileSize
                      }
                    });
                    
                    resolve({
                      path: asset.uri || '',
                      width: asset.width || options.width,
                      height: asset.height || options.height,
                      mime: asset.type || 'image/jpeg',
                      size: asset.fileSize || 0,
                      fileName: asset.fileName || `avatar_${Date.now()}.jpg`,
                    });
                  } else {
                    reject(new Error('No image selected'));
                  }
                }
              );
            });
            
            logger.info('iOS fallback image selection successful', LogCategory.BUSINESS, {
              userId: 'system',
              metadata: {
                correlationId,
                resultPath: result.path,
                resultSize: result.size
              }
            });
            return result;
          } catch (fallbackError: any) {
            logger.error('iOS fallback also failed', LogCategory.BUSINESS, {
              userId: 'system',
              metadata: {
                correlationId,
                fallbackError: fallbackError.message
              }
            });
            // Weiter zur ursprünglichen Methode
          }
        }
      }

      logger.info('Using standard ImagePicker.openPicker method', LogCategory.BUSINESS, {
        userId: 'system',
        metadata: { correlationId }
      });
      
      // Timeout für hängende Picker-Calls
      const pickerPromise = ImagePicker.openPicker({
        width: options.width,
        height: options.height,
        cropping: options.cropping,
        cropperCircleOverlay: options.cropperCircleOverlay,
        mediaType: options.mediaType,
        includeBase64: options.includeBase64,
        compressImageQuality: options.quality || AVATAR_CONSTANTS.QUALITY,
        compressImageMaxWidth: options.width,
        compressImageMaxHeight: options.height,
        freeStyleCropEnabled: false,
        // Vereinfachte iOS-kompatible Optionen
        ...(Platform.OS === 'ios' ? {
          cropperToolbarTitle: 'Avatar bearbeiten',
          hideBottomControls: false,
          enableRotationGesture: true,
        } : {
          cropperToolbarTitle: 'Avatar bearbeiten',
          cropperActiveWidgetColor: '#3B82F6',
          cropperStatusBarColor: '#1E40AF',
          cropperToolbarColor: '#3B82F6',
          hideBottomControls: false,
          enableRotationGesture: true,
          smartAlbums: ['UserLibrary', 'PhotoStream', 'Panoramas', 'Videos', 'Bursts'],
        })
      });

      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => {
          logger.warn('Image picker timeout reached (30 seconds)', LogCategory.BUSINESS, {
            userId: 'system',
            metadata: { correlationId }
          });
          reject(new Error('Image picker timeout - please try again'));
        }, 30000)
      );

      const image: CropPickerImage = await Promise.race([pickerPromise, timeoutPromise]);

      logger.info('Standard image picker selection successful', LogCategory.BUSINESS, {
        userId: 'system',
        metadata: {
          correlationId,
          imagePath: image.path,
          imageSize: image.size,
          imageWidth: image.width,
          imageHeight: image.height
        }
      });
      
      const result = this.mapToImagePickerResult(image);
      logger.info('Gallery image selection completed successfully', LogCategory.BUSINESS, {
        userId: 'system',
        metadata: {
          correlationId,
          resultPath: result.path,
          resultSize: result.size,
          resultMime: result.mime
        }
      });
      return result;
    } catch (error: any) {
      logger.error('Gallery image selection failed', LogCategory.BUSINESS, {
        userId: 'system',
        metadata: { correlationId }
      }, error);
      
      if (error?.code === 'E_PICKER_CANCELLED') {
        logger.info('User cancelled gallery image selection', LogCategory.BUSINESS, {
          userId: 'system',
          metadata: { correlationId }
        });
        throw new Error('User cancelled image selection');
      }
      
      if (error?.code === 'E_NO_LIBRARY_PERMISSION') {
        logger.error('Gallery permission required but not granted', LogCategory.SECURITY, {
          userId: 'system',
          metadata: { correlationId }
        });
        throw new Error('Gallery permission required');
      }
      
      logger.error('Unknown gallery error occurred', LogCategory.BUSINESS, {
        userId: 'system',
        metadata: {
          correlationId,
          errorCode: error?.code,
          errorMessage: error?.message
        }
      });
      throw new Error(`Gallery error: ${error?.message || 'Unknown error'}`);
    }
  }

  async checkCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions automatically
    }

    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted;
    } catch {
      return false;
    }
  }

  async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions automatically
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Kamera-Berechtigung',
          message: 'Diese App benötigt Zugriff auf Ihre Kamera, um Fotos aufzunehmen.',
          buttonNeutral: 'Später fragen',
          buttonNegative: 'Ablehnen',
          buttonPositive: 'Erlauben',
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }

  async checkStoragePermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions automatically
    }

    if (typeof Platform.Version === 'number' && Platform.Version >= 33) {
      // Android 13+ uses scoped storage
      return true;
    }

    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted;
    } catch {
      return false;
    }
  }

  async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions automatically
    }

    if (typeof Platform.Version === 'number' && Platform.Version >= 33) {
      // Android 13+ uses scoped storage
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Speicher-Berechtigung',
          message: 'Diese App benötigt Zugriff auf Ihren Speicher, um Bilder auszuwählen.',
          buttonNeutral: 'Später fragen',
          buttonNegative: 'Ablehnen',
          buttonPositive: 'Erlauben',
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }

  private mapToImagePickerResult(image: CropPickerImage): ImagePickerResult {
    // Validate file size
    if (image.size > AVATAR_CONSTANTS.MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size: ${AVATAR_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Validate file format
    if (!AVATAR_CONSTANTS.SUPPORTED_FORMATS.includes(image.mime as any)) {
      throw new Error(`Unsupported format. Supported: ${AVATAR_CONSTANTS.SUPPORTED_FORMATS.join(', ')}`);
    }

    return {
      path: image.path,
      width: image.width,
      height: image.height,
      mime: image.mime,
      size: image.size,
      fileName: image.filename || `avatar_${Date.now()}.${image.mime.split('/')[1]}`,
    };
  }

  /**
   * Clean up any temporary files created by the image picker
   */
  async cleanupTempFiles(): Promise<void> {
    try {
      await ImagePicker.clean();
    } catch {
      // Ignore cleanup errors
      logger.warn('Failed to cleanup temp files:', LogCategory.BUSINESS, { userId: 'system', metadata: {} });
    }
  }
}

// Export singleton instance
export const imagePickerService = new ImagePickerService(); 