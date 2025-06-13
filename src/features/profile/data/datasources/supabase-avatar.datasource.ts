/**
 * @fileoverview SUPABASE-AVATAR-DATASOURCE: Concrete Supabase Storage Implementation
 * @description Supabase Storage DataSource Implementation für Avatar Management
 * mit Enterprise-Grade Funktionalität und Clean Architecture Compliance.
 * 
 * @version 1.0.0
 * @since 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

import { supabase, avatarStorageConfig } from '@core/config/supabase.config';
import { decode } from 'base64-arraybuffer';
import {
  IAvatarDataSource,
  AvatarUploadOptions,
  AvatarUploadResult,
  AvatarDeleteResult,
  StorageHealthResult
} from '@features/profile/domain/interfaces/avatar-datasource.interface';

/**
 * Supabase Avatar DataSource
 * 
 * Konkrete Implementierung des Avatar DataSource Interface für Supabase Storage.
 * Behandelt alle Supabase-spezifischen Storage-Operationen und Konfigurationen.
 * 
 * @class SupabaseAvatarDataSource
 * @implements {IAvatarDataSource}
 * @since 2.0.0
 * 
 * @description
 * Enterprise-Grade Supabase Storage DataSource mit vollständiger CRUD-Funktionalität,
 * Progress Tracking, Error Handling und Performance-Optimierungen für
 * produktive Avatar-Management-Systeme.
 * 
 * @features
 * - **File Upload**: Sichere Avatar-Uploads mit Progress Tracking
 * - **File Deletion**: Vollständige Bereinigung aller User-Avatar-Dateien  
 * - **URL Generation**: Automatische Public URL Generation
 * - **Health Monitoring**: Storage-Service Gesundheitsprüfung
 * - **File Validation**: Umfassende Datei-Validierung nach Konfiguration
 * - **Error Handling**: Robuste Fehlerbehandlung mit detaillierten Meldungen
 * 
 * @architectural_compliance
 * - Clean Architecture Data Layer Implementation
 * - Repository Pattern DataSource
 * - SOLID Principles (Single Responsibility, Dependency Inversion)
 * - Enterprise Error Handling Standards
 * 
 * @performance_optimizations
 * - Efficient blob conversion for uploads
 * - Optimized file path generation
 * - Cached configuration access
 * - Minimal API calls for operations
 * 
 * @security_features
 * - Row Level Security (RLS) policy enforcement
 * - Secure file path generation
 * - Content type validation
 * - File size restrictions
 * 
 * @example
 * Basic usage:
 * ```typescript
 * const dataSource = new SupabaseAvatarDataSource();
 * 
 * const uploadResult = await dataSource.uploadAvatar({
 *   userId: 'user-123',
 *   file: {
 *     uri: 'file://avatar.jpg',
 *     fileName: 'avatar.jpg',
 *     size: 1024000,
 *     mime: 'image/jpeg'
 *   },
 *   onProgress: (progress) => console.log(`Upload: ${progress}%`)
 * });
 * ```
 * 
 * @example
 * With dependency injection:
 * ```typescript
 * class AvatarRepository {
 *   constructor(private dataSource: IAvatarDataSource) {}
 *   
 *   async uploadUserAvatar(userId: string, file: File) {
 *     return this.dataSource.uploadAvatar({ userId, file });
 *   }
 * }
 * 
 * // Injection
 * const repository = new AvatarRepository(new SupabaseAvatarDataSource());
 * ```
 */
export class SupabaseAvatarDataSource implements IAvatarDataSource {
  /**
   * Upload avatar to Supabase Storage
   * 
   * @param options - Upload configuration with file data and progress callback
   * @returns Promise resolving to upload result with success status and avatar URL
   * 
   * @throws {Error} When file processing fails or storage is unavailable
   * 
   * @example
   * ```typescript
   * const result = await dataSource.uploadAvatar({
   *   userId: 'user-123',
   *   file: {
   *     uri: 'file://avatar.jpg',
   *     fileName: 'avatar.jpg', 
   *     size: 2048000,
   *     mime: 'image/jpeg'
   *   },
   *   onProgress: (progress) => updateUI(progress)
   * });
   * 
   * if (result.success) {
   *   console.log('Avatar uploaded:', result.avatarUrl);
   * } else {
   *   console.error('Upload failed:', result.error);
   * }
   * ```
   */
  async uploadAvatar(options: AvatarUploadOptions): Promise<AvatarUploadResult> {
    try {
      // Validate file first
      const validation = this.validateAvatarFile({
        name: options.file.fileName || 'avatar.jpg',
        size: options.file.size,
        type: options.file.mime,
        uri: options.file.uri
      });
      
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Progress tracking - initialization
      if (options.onProgress) {
        options.onProgress(10);
      }

      // Generate file path with timestamp for uniqueness
      const timestamp = Date.now();
      const fileExtension = this.getFileExtension(options.file.fileName || 'avatar.jpg');
      const filePath = `users/${options.userId}/avatar_${timestamp}.${fileExtension}`;

      // Progress tracking - path generation complete
      if (options.onProgress) {
        options.onProgress(25);
      }

      // Convert file URI to ArrayBuffer for Supabase upload (React Native official method)
      const fileArrayBuffer = await this.uriToBlob(options.file.uri);
      
      // Progress tracking - ArrayBuffer conversion complete
      if (options.onProgress) {
        options.onProgress(50);
      }

      // Determine MIME type from file extension for contentType
      const extension = this.getFileExtension(options.file.fileName || 'avatar.jpg');
      const contentType = this.getMimeTypeFromExtension(extension);

      // Upload to Supabase Storage using configured bucket with ArrayBuffer
      const { error: uploadError } = await supabase.storage
        .from(avatarStorageConfig.bucket)
        .upload(filePath, fileArrayBuffer, {
          contentType: contentType,
          cacheControl: avatarStorageConfig.cacheControl,
          upsert: true // Allow overwriting existing files
        });

      if (uploadError) {
        console.error('SupabaseAvatarDataSource: Upload error:', uploadError);
        return {
          success: false,
          error: `Upload failed: ${uploadError.message}`
        };
      }

      // Progress tracking - upload complete
      if (options.onProgress) {
        options.onProgress(75);
      }

      // Generate public URL for uploaded file
      const { data: publicUrlData } = supabase.storage
        .from(avatarStorageConfig.bucket)
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        return {
          success: false,
          error: 'Failed to generate public URL'
        };
      }

      // Progress tracking - complete
      if (options.onProgress) {
        options.onProgress(100);
      }

      console.log('SupabaseAvatarDataSource: Avatar upload successful');
      console.log('SupabaseAvatarDataSource: Bucket:', avatarStorageConfig.bucket);
      console.log('SupabaseAvatarDataSource: File path:', filePath);
      console.log('SupabaseAvatarDataSource: Public URL:', publicUrlData.publicUrl);

      return {
        success: true,
        avatarUrl: publicUrlData.publicUrl
      };

    } catch (error) {
      console.error('SupabaseAvatarDataSource: Upload exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Delete avatar from Supabase Storage
   * 
   * @param userId - User identifier for avatar deletion
   * @returns Promise resolving to deletion result
   * 
   * @example
   * ```typescript
   * const result = await dataSource.deleteAvatar('user-123');
   * if (result.success) {
   *   console.log('Avatar deleted successfully');
   * } else {
   *   console.error('Deletion failed:', result.error);
   * }
   * ```
   */
  async deleteAvatar(userId: string): Promise<AvatarDeleteResult> {
    try {
      // List all files for the user
      const { data: files, error: listError } = await supabase.storage
        .from(avatarStorageConfig.bucket)
        .list(`users/${userId}`);

      if (listError) {
        console.error('SupabaseAvatarDataSource: Error listing user files:', listError);
        return {
          success: false,
          error: `Failed to list files: ${listError.message}`
        };
      }

      if (!files || files.length === 0) {
        console.log('SupabaseAvatarDataSource: No avatar files found for user:', userId);
        return { success: true }; // No files to delete is success
      }

      // Delete all avatar files for the user
      const filePaths = files.map(file => `users/${userId}/${file.name}`);
      
      const { error: deleteError } = await supabase.storage
        .from(avatarStorageConfig.bucket)
        .remove(filePaths);

      if (deleteError) {
        console.error('SupabaseAvatarDataSource: Error deleting files:', deleteError);
        return {
          success: false,
          error: `Failed to delete files: ${deleteError.message}`
        };
      }

      console.log('SupabaseAvatarDataSource: Avatar files deleted for user:', userId);
      return { success: true };

    } catch (error) {
      console.error('SupabaseAvatarDataSource: Delete exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deletion failed'
      };
    }
  }

  /**
   * Get avatar URL from Supabase Storage
   * 
   * @param userId - User identifier
   * @returns Promise resolving to avatar URL or null if not found
   * 
   * @example
   * ```typescript
   * const avatarUrl = await dataSource.getAvatarUrl('user-123');
   * if (avatarUrl) {
   *   displayAvatar(avatarUrl);
   * } else {
   *   displayDefaultAvatar();
   * }
   * ```
   */
  async getAvatarUrl(userId: string): Promise<string | null> {
    try {
      // List files for the user to find the most recent avatar
      const { data: files, error: listError } = await supabase.storage
        .from(avatarStorageConfig.bucket)
        .list(`users/${userId}`);

      if (listError) {
        console.error('SupabaseAvatarDataSource: Error listing files:', listError);
        return null;
      }

      if (!files || files.length === 0) {
        console.log('SupabaseAvatarDataSource: No avatar found for user:', userId);
        return null;
      }

      // Find the most recent avatar file
      const avatarFiles = files
        .filter(file => file.name.startsWith('avatar_'))
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

      if (avatarFiles.length === 0) {
        console.log('SupabaseAvatarDataSource: No avatar files found for user:', userId);
        return null;
      }

      // Get public URL for the most recent avatar
      const latestAvatar = avatarFiles[0];
      const filePath = `users/${userId}/${latestAvatar.name}`;
      
      const { data: publicUrlData } = supabase.storage
        .from(avatarStorageConfig.bucket)
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        console.error('SupabaseAvatarDataSource: Failed to get public URL for:', filePath);
        return null;
      }

      console.log('SupabaseAvatarDataSource: Found custom avatar for user:', userId);
      return publicUrlData.publicUrl;

    } catch (error) {
      console.error('SupabaseAvatarDataSource: Error getting avatar URL:', error);
      return null;
    }
  }

  /**
   * Check Supabase Storage health
   * 
   * @returns Promise resolving to health check result
   * 
   * @example
   * ```typescript
   * const health = await dataSource.checkStorageHealth();
   * if (!health.healthy) {
   *   showError('Storage service unavailable');
   * }
   * ```
   */
  async checkStorageHealth(): Promise<StorageHealthResult> {
    try {
      // Try to list the bucket to verify connectivity
      const { error } = await supabase.storage
        .from(avatarStorageConfig.bucket)
        .list('', { limit: 1 });

      if (error) {
        return {
          healthy: false,
          error: `Storage bucket '${avatarStorageConfig.bucket}' not accessible: ${error.message}`
        };
      }

      return { healthy: true };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Storage health check failed'
      };
    }
  }

  /**
   * Validate avatar file according to configuration
   * 
   * @param file - File information to validate
   * @returns Validation result with detailed error messages
   * 
   * @example
   * ```typescript
   * const validation = dataSource.validateAvatarFile({
   *   name: 'avatar.jpg',
   *   size: 1024000,
   *   type: 'image/jpeg',
   *   uri: 'file://avatar.jpg'
   * });
   * 
   * if (!validation.valid) {
   *   showValidationErrors(validation.errors);
   * }
   * ```
   */
  validateAvatarFile(file: {
    name: string;
    size: number;
    type: string;
    uri: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check file size using configuration
    if (file.size > avatarStorageConfig.maxFileSize) {
      errors.push(`File size exceeds ${Math.round(avatarStorageConfig.maxFileSize / (1024 * 1024))}MB limit`);
    }
    
    // Check file type using configuration
    if (!avatarStorageConfig.allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed: ${avatarStorageConfig.allowedTypes.join(', ')}`);
    }
    
    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    if (!hasValidExtension) {
      errors.push('Invalid file extension');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert URI to ArrayBuffer for Supabase upload (React Native optimized)
   * 
   * @private
   * @param uri - File URI to convert
   * @returns Promise resolving to ArrayBuffer object
   * @throws {Error} When file cannot be fetched or converted
   */
  private async uriToBlob(uri: string): Promise<ArrayBuffer> {
    try {
      // For React Native, we need to handle local file URIs differently
      if (uri.startsWith('file://') || uri.startsWith('/')) {
        // React Native local file - use official Supabase method with base64-arraybuffer
        const RNBlobUtil = require('react-native-blob-util').default;
        
        // Ensure we have the correct file path
        const cleanPath = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
        
        console.log('SupabaseAvatarDataSource: Reading local file:', cleanPath);
        
        // Read file as base64
        const base64Data = await RNBlobUtil.fs.readFile(cleanPath, 'base64');
        
        if (!base64Data) {
          throw new Error('Failed to read file content');
        }
        
        console.log('SupabaseAvatarDataSource: File read successfully, base64 length:', base64Data.length);
        
        // Use official Supabase React Native method: base64-arraybuffer
        const arrayBuffer = decode(base64Data);
        
        console.log('SupabaseAvatarDataSource: ArrayBuffer created successfully');
        console.log('SupabaseAvatarDataSource: - ArrayBuffer size:', arrayBuffer.byteLength);
        console.log('SupabaseAvatarDataSource: - Base64 length:', base64Data.length);
        
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          throw new Error('Generated ArrayBuffer is empty - base64 conversion failed');
        }
        
        return arrayBuffer;
      } else {
        // Network URL - use fetch
        console.log('SupabaseAvatarDataSource: Fetching network URL:', uri);
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        console.log('SupabaseAvatarDataSource: Network ArrayBuffer created, size:', arrayBuffer.byteLength);
        return arrayBuffer;
      }
    } catch (error) {
      console.error('SupabaseAvatarDataSource: Error converting URI to ArrayBuffer:', error);
      throw new Error(`Failed to process image file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get MIME type from file extension
   * 
   * @private
   * @param extension - File extension
   * @returns MIME type string
   */
  private getMimeTypeFromExtension(extension: string): string {
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif',
      'heic': 'image/heic',
      'heif': 'image/heif'
    };
    
    return mimeTypes[extension.toLowerCase()] || 'image/jpeg';
  }

  /**
   * Extract file extension from filename
   * 
   * @private
   * @param filename - Filename to extract extension from
   * @returns File extension in lowercase
   */
  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() || 'jpg' : 'jpg';
  }
}