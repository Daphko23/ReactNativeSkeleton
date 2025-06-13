/**
 * ImagePickerService - Enterprise Edition
 * Real implementation using react-native-image-crop-picker
 */

import ImagePicker, { Image as CropPickerImage } from 'react-native-image-crop-picker';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';
import { 
  IImagePickerService, 
  ImagePickerOptions, 
  ImagePickerResult,
  AVATAR_CONSTANTS 
} from '../../domain/interfaces/avatar.interface';

export class ImagePickerService implements IImagePickerService {
  
  async openCamera(options: ImagePickerOptions): Promise<ImagePickerResult> {
    try {
      // Check and request camera permission
      const hasPermission = await this.checkCameraPermission();
      if (!hasPermission) {
        const granted = await this.requestCameraPermission();
        if (!granted) {
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

      return this.mapToImagePickerResult(image);
    } catch (error: any) {
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
    console.log('📱 ImagePickerService.openGallery: Starting with options:', options);
    
    try {
      console.log('📱 ImagePickerService.openGallery: Checking storage permission...');
      // Check and request storage permission
      const hasPermission = await this.checkStoragePermission();
      console.log('📱 ImagePickerService.openGallery: Has permission:', hasPermission);
      
      if (!hasPermission) {
        console.log('📱 ImagePickerService.openGallery: Requesting storage permission...');
        const granted = await this.requestStoragePermission();
        console.log('📱 ImagePickerService.openGallery: Permission granted:', granted);
        
        if (!granted) {
          console.log('📱 ImagePickerService.openGallery: Permission denied, throwing error');
          throw new Error('Storage permission denied');
        }
      }

      // Versuche zunächst ohne Cropping für bessere Kompatibilität
      if (Platform.OS === 'ios') {
        console.log('📱 ImagePickerService.openGallery: Trying simple iOS approach without cropping...');
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
          
          console.log('📱 ImagePickerService.openGallery: Image picked successfully (simple mode):', image.path);
          const result = this.mapToImagePickerResult(image);
          console.log('📱 ImagePickerService.openGallery: Mapped result:', result);
          return result;
        } catch (simpleError: any) {
          console.log('📱 ImagePickerService.openGallery: Simple mode failed, trying react-native-image-picker fallback...', simpleError);
          
          // Fallback zu react-native-image-picker für iOS
          try {
            console.log('📱 ImagePickerService.openGallery: Using react-native-image-picker as fallback...');
            
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
                  console.log('📱 ImagePickerService.openGallery: react-native-image-picker response:', response);
                  
                  if (response.didCancel) {
                    console.log('📱 ImagePickerService.openGallery: User cancelled (fallback)');
                    reject(new Error('User cancelled image selection'));
                    return;
                  }
                  
                  if (response.errorMessage) {
                    console.log('📱 ImagePickerService.openGallery: Error (fallback):', response.errorMessage);
                    reject(new Error(response.errorMessage));
                    return;
                  }
                  
                  if (response.assets && response.assets.length > 0) {
                    const asset = response.assets[0];
                    console.log('📱 ImagePickerService.openGallery: Asset selected (fallback):', asset.uri);
                    
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
            
            console.log('📱 ImagePickerService.openGallery: Fallback successful:', result);
            return result;
          } catch (fallbackError: any) {
            console.log('📱 ImagePickerService.openGallery: Fallback also failed:', fallbackError);
            // Weiter zur ursprünglichen Methode
          }
        }
      }

      console.log('📱 ImagePickerService.openGallery: Opening picker with ImagePicker.openPicker...');
      
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
          console.log('📱 ImagePickerService.openGallery: Timeout after 30 seconds');
          reject(new Error('Image picker timeout - please try again'));
        }, 30000)
      );

      const image: CropPickerImage = await Promise.race([pickerPromise, timeoutPromise]);

      console.log('📱 ImagePickerService.openGallery: Image picked successfully:', image.path);
      const result = this.mapToImagePickerResult(image);
      console.log('📱 ImagePickerService.openGallery: Mapped result:', result);
      return result;
    } catch (error: any) {
      console.log('📱 ImagePickerService.openGallery: Error caught:', error);
      
      if (error?.code === 'E_PICKER_CANCELLED') {
        console.log('📱 ImagePickerService.openGallery: User cancelled');
        throw new Error('User cancelled image selection');
      }
      
      if (error?.code === 'E_NO_LIBRARY_PERMISSION') {
        console.log('📱 ImagePickerService.openGallery: No library permission');
        throw new Error('Gallery permission required');
      }
      
      console.log('📱 ImagePickerService.openGallery: Unknown error, re-throwing');
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
    } catch (error) {
      // Ignore cleanup errors
      console.warn('Failed to cleanup temp files:', error);
    }
  }
}

// Export singleton instance
export const imagePickerService = new ImagePickerService(); 