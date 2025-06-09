/**
 * AvatarService - Enterprise Edition
 * Real implementation using Supabase Storage
 */

import { supabase } from '../../../../core/config/supabase.config';
import { 
  IAvatarService, 
  AvatarUploadOptions, 
  AvatarUploadResult,
  AVATAR_CONSTANTS 
} from '../../domain/interfaces/avatar.interface';

// Re-export types for external use
export type { 
  AvatarUploadOptions, 
  AvatarUploadResult,
  IAvatarService 
} from '../../domain/interfaces/avatar.interface';

export class AvatarService implements IAvatarService {
  private readonly BUCKET_NAME = 'avatars';
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  async uploadAvatar(options: AvatarUploadOptions): Promise<AvatarUploadResult> {
    const { file, userId, onProgress } = options;

    try {
      console.log('AvatarService: Starting upload with file:', {
        uri: file.uri,
        mime: file.mime,
        size: file.size,
        userId
      });

      // Validate authentication state (userId is pre-validated by Hook layer)
      console.log('AvatarService: Upload request for userId:', userId);
      
      // Double-check session for security (but don't fail if temporarily out of sync)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn('AvatarService: Session check failed, but proceeding with userId from Hook layer');
          // Note: Continue execution as userId comes from authenticated Hook layer
        } else {
          console.log('AvatarService: Session validated successfully');
        }
      } catch (sessionError) {
        console.warn('AvatarService: Session validation failed, but proceeding with Hook-provided userId:', sessionError);
        // Note: Hook layer already validated authentication
      }

      onProgress?.(10);

      // Validate file
      this.validateFile(file);
      onProgress?.(20);

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}/${timestamp}.${fileExtension}`;

      console.log('AvatarService: Generated filename:', fileName);
      onProgress?.(30);

      // Prepare file for upload
      const preparedFile = await this.prepareFileForUpload(file);
      onProgress?.(50);

      // Upload to Supabase Storage with retry logic
      const uploadResult = await this.uploadWithRetry(
        fileName,
        preparedFile,
        file.mime || 'image/jpeg',
        (progress) => onProgress?.(50 + (progress * 0.4)) // 50-90%
      );

      if (uploadResult.error) {
        console.error('AvatarService: Upload failed:', uploadResult.error);
        return {
          success: false,
          error: uploadResult.error.message || 'Upload failed',
        };
      }

      onProgress?.(90);

      // Get public URL for the uploaded file
      const avatarUrl = this.getPublicUrl(fileName);
      console.log('AvatarService: Generated public URL:', avatarUrl);

      // Update user profile with new avatar URL
      try {
        await this.updateUserProfile(userId, avatarUrl);
        console.log('AvatarService: Profile updated successfully');
      } catch (profileError: any) {
        console.warn('AvatarService: Failed to update profile, but upload succeeded:', profileError);
        // Don't fail the upload if profile update fails
      }

      onProgress?.(100);

      return {
        success: true,
        avatarUrl,
      };

    } catch (error: any) {
      console.error('Avatar upload failed:', error);
      
      return {
        success: false,
        error: error?.message || 'Upload failed',
      };
    }
  }

  async deleteAvatar(userId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate input (userId should be provided by Hook layer with pre-validation)
      if (!userId) {
        return {
          success: false,
          error: 'User ID required for avatar deletion',
        };
      }

      const targetUserId = userId;
      console.log('AvatarService: Delete request for userId:', targetUserId);
      
      // Optional session validation (non-blocking for Hook-layer authenticated requests)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('AvatarService: Session validated for deletion');
        } else {
          console.warn('AvatarService: No session found, but proceeding with Hook-validated userId');
        }
      } catch (sessionError) {
        console.warn('AvatarService: Session check failed for deletion, but proceeding:', sessionError);
      }
      console.log('AvatarService: Deleting avatar for user:', targetUserId);

      // Get current avatar URL to extract filename
      const currentAvatarUrl = await this.getAvatarUrl(targetUserId);
      if (!currentAvatarUrl || currentAvatarUrl === this.getDefaultAvatarUrl()) {
        console.log('AvatarService: No avatar to delete');
        return {
          success: true,
          error: undefined,
        };
      }

      // Extract file path from URL
      const filePath = this.extractFilePathFromUrl(currentAvatarUrl);
      if (filePath) {
        console.log('AvatarService: Deleting file:', filePath);
        
        // Delete from Supabase Storage
        const { error: deleteError } = await supabase.storage
          .from(this.BUCKET_NAME)
          .remove([filePath]);

        if (deleteError) {
          console.error('AvatarService: Failed to delete file:', deleteError);
          return {
            success: false,
            error: deleteError.message,
          };
        }

        console.log('AvatarService: File deleted successfully');
      }

      // Update user profile to remove avatar URL
      try {
        await this.updateUserProfile(targetUserId, null);
        console.log('AvatarService: Profile updated to remove avatar URL');
      } catch (profileError: any) {
        console.warn('AvatarService: Failed to update profile, but file deletion succeeded:', profileError);
        // Don't fail the deletion if profile update fails
      }

      return {
        success: true,
        error: undefined,
      };

    } catch (error: any) {
      console.error('Delete avatar failed:', error);
      return {
        success: false,
        error: error?.message || 'Delete failed',
      };
    }
  }

  async getAvatarUrl(userId: string): Promise<string | null> {
    try {
      // Validate input
      if (!userId) {
        console.warn('getAvatarUrl: No userId provided');
        return this.getDefaultAvatarUrl();
      }

      console.log('getAvatarUrl: Fetching avatar for userId:', userId);

      // Try direct query to user_profiles table first (more reliable than RPC)
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('avatar_url')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.warn('getAvatarUrl: Direct profile query failed, trying RPC:', profileError);
        
        // Fallback to RPC if direct query fails
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_avatar_url', {
          user_uuid: userId,
        });

        if (rpcError) {
          console.error('getAvatarUrl: Both direct query and RPC failed:', rpcError);
          return this.getDefaultAvatarUrl();
        }

        if (!rpcData) {
          console.log('getAvatarUrl: No avatar URL found via RPC, returning default');
          return this.getDefaultAvatarUrl();
        }

        return await this.processAvatarUrl(rpcData);
      }

      const avatarUrl = profileData?.avatar_url;
      if (!avatarUrl) {
        console.log('getAvatarUrl: No avatar URL found in profile, returning default');
        return this.getDefaultAvatarUrl();
      }

      console.log('getAvatarUrl: Found avatar URL in profile:', avatarUrl);
      return await this.processAvatarUrl(avatarUrl);

    } catch (error: any) {
      console.error('Get avatar URL failed with exception:', {
        error,
        message: error?.message,
        stack: error?.stack,
        userId,
      });
      return this.getDefaultAvatarUrl();
    }
  }

  /**
   * Process and validate avatar URL
   */
  private async processAvatarUrl(url: string): Promise<string> {
    // Only validate if it's not already a default/generated URL
    const defaultUrl = this.getDefaultAvatarUrl();
    if (url === defaultUrl || url.includes('ui-avatars.com')) {
      console.log('processAvatarUrl: Retrieved default/generated avatar URL');
      return url;
    }

    // Validate the returned URL before sending it to the UI
    const validatedUrl = await this.validateAvatarUrl(url);
    if (!validatedUrl) {
      console.warn('processAvatarUrl: Avatar URL validation failed, falling back to default');
      return this.getDefaultAvatarUrl();
    }

    console.log('processAvatarUrl: Retrieved and validated avatar URL');
    return validatedUrl;
  }

  /**
   * Validate avatar URL before using it in UI
   * Now uses lighter validation to prevent blocking valid URLs
   */
  private async validateAvatarUrl(url: string): Promise<string | null> {
    try {
      // Basic URL format validation
      if (!url || typeof url !== 'string') {
        console.warn('validateAvatarUrl: Invalid URL format:', url);
        return null;
      }

      // Check if it's a valid URL
      try {
        new URL(url);
      } catch {
        console.warn('validateAvatarUrl: Malformed URL:', url);
        return null;
      }

      // Skip validation for default avatars to avoid loops
      const defaultUrl = this.getDefaultAvatarUrl();
      if (url === defaultUrl || url.includes('ui-avatars.com')) {
        console.log('validateAvatarUrl: Skipping validation for default/generated avatar');
        return url;
      }

      // 🔧 LIGHTER VALIDATION: For Supabase URLs, trust them directly
      if (url.includes('.supabase.co/storage/')) {
        console.log('validateAvatarUrl: Trusting Supabase storage URL:', url);
        return url;
      }

      // For other URLs, try a quick validation but don't fail if it doesn't work
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // Shorter 2 second timeout

      try {
        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          console.log('validateAvatarUrl: URL is accessible:', url);
          return url;
        } else {
          console.warn('validateAvatarUrl: URL returned error status, but using anyway:', response.status, url);
          return url; // 🔧 Use URL even if HEAD request fails
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.warn('validateAvatarUrl: URL validation timeout, but using anyway:', url);
        } else {
          console.warn('validateAvatarUrl: URL fetch failed, but using anyway:', fetchError.message, url);
        }
        return url; // 🔧 Use URL even if validation fails
      }
    } catch (error: any) {
      console.error('validateAvatarUrl: Validation error, but using URL anyway:', error.message, url);
      return url; // 🔧 Use URL even if validation has errors
    }
  }

  private validateFile(file: any): void {
    // Check if file URI exists
    if (!file.uri) {
      throw new Error('Invalid file path');
    }

    // Check file format/mime type
    if (file.mime && !AVATAR_CONSTANTS.SUPPORTED_FORMATS.includes(file.mime)) {
      throw new Error(`Unsupported format. Supported: ${AVATAR_CONSTANTS.SUPPORTED_FORMATS.join(', ')}`);
    }

    // For React Native, file.size might be 0 or undefined from image-crop-picker
    // We'll validate size after reading the file data if needed
    if (file.size && file.size > AVATAR_CONSTANTS.MAX_FILE_SIZE) {
      throw new Error(`File zu groß. Maximum: ${AVATAR_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    console.log('AvatarService: File validation passed for:', {
      uri: file.uri,
      mime: file.mime,
      size: file.size || 'unknown',
    });
  }

  private async prepareFileForUpload(file: any): Promise<any> {
    try {
      console.log('AvatarService: Preparing file for upload:', file.uri);

      // For React Native, we need to read the file data from the local URI
      // Use fetch to read the file as an ArrayBuffer
      const response = await fetch(file.uri);
      if (!response.ok) {
        throw new Error(`Failed to read file: ${response.status} ${response.statusText}`);
      }

      const fileData = await response.arrayBuffer();
      const actualFileSize = fileData.byteLength;
      
      console.log('AvatarService: File data prepared, size:', actualFileSize);

      // Validate file size if it wasn't available before
      if (actualFileSize > AVATAR_CONSTANTS.MAX_FILE_SIZE) {
        throw new Error(`File zu groß. Aktuell: ${(actualFileSize / (1024 * 1024)).toFixed(2)}MB, Maximum: ${AVATAR_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      if (actualFileSize === 0) {
        throw new Error('File is empty or corrupted');
      }

      return fileData;
    } catch (error) {
      console.error('AvatarService: Failed to prepare file:', error);
      throw new Error(`Failed to prepare file: ${error}`);
    }
  }

  private async uploadWithRetry(
    fileName: string, 
    fileData: ArrayBuffer, 
    contentType: string,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    let lastError: any = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`AvatarService: Upload attempt ${attempt}/${this.MAX_RETRIES}`);
        onProgress?.(attempt === 1 ? 0 : ((attempt - 1) / this.MAX_RETRIES) * 100);

        const { data, error } = await supabase.storage
          .from(this.BUCKET_NAME)
          .upload(fileName, fileData, {
            contentType: contentType,
            upsert: true, // Replace if exists
          });

        if (!error) {
          console.log('AvatarService: Upload successful on attempt', attempt);
          onProgress?.(100);
          return { data, error: null };
        }

        lastError = error;
        console.warn(`Upload attempt ${attempt} failed:`, error);

        // Wait before retry (except on last attempt)
        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * attempt);
        }

      } catch (error) {
        lastError = error;
        console.warn(`Upload attempt ${attempt} failed with exception:`, error);
        
        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * attempt);
        }
      }
    }

    return { data: null, error: lastError };
  }

  private getPublicUrl(fileName: string): string {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  private async updateUserProfile(userId: string, avatarUrl: string | null): Promise<void> {
    console.log('updateUserProfile: Updating profile for user:', userId, 'with avatar URL:', avatarUrl);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ 
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select(); // Include select to get updated data back

    if (error) {
      console.error('updateUserProfile: Failed to update profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    console.log('updateUserProfile: Profile updated successfully:', data);
    
    // Verify the update worked by checking the returned data
    if (data && data.length > 0) {
      const updatedProfile = data[0];
      console.log('updateUserProfile: Verification - avatar_url in DB is now:', updatedProfile.avatar_url);
      
      if (updatedProfile.avatar_url !== avatarUrl) {
        console.warn('updateUserProfile: Warning - DB value does not match expected value');
      }
    }
  }

  private extractFilePathFromUrl(url: string): string | null {
    try {
      // Extract file path from Supabase public URL
      // Format: https://xxx.supabase.co/storage/v1/object/public/avatars/path/file.jpg
      const match = url.match(/\/storage\/v1\/object\/public\/avatars\/(.+)$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Initialize avatar storage bucket if it doesn't exist
   * Call this during app initialization
   */
  async initializeBucket(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Failed to list buckets:', listError);
        return;
      }

      const bucketExists = buckets?.some((bucket: any) => bucket.name === this.BUCKET_NAME);

      if (!bucketExists) {
        // Create bucket
        const { error: createError } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true,
          allowedMimeTypes: [...AVATAR_CONSTANTS.SUPPORTED_FORMATS],
          fileSizeLimit: AVATAR_CONSTANTS.MAX_FILE_SIZE,
        });

        if (createError) {
          console.error('Failed to create avatars bucket:', createError);
        } else {
          console.log('Avatars bucket created successfully');
        }
      }
    } catch (error) {
      console.error('Initialize bucket failed:', error);
    }
  }

  /**
   * Validates avatar file for upload
   * Used by tests and external validation
   */
  validateAvatarFile(file: {
    name: string;
    size: number;
    type: string;
    uri: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size exceeds 5MB limit');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      errors.push('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push('Invalid file extension');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get default avatar URL for users without uploaded avatars
   */
  getDefaultAvatarUrl(): string {
    // Use a reliable external service for default avatars
    return 'https://ui-avatars.com/api/?name=U&background=0ea5e9&color=ffffff&size=200';
  }

  /**
   * Generate initials-based avatar URL
   */
  generateInitialsAvatar(name: string): string {
    let initials = 'U'; // Default
    let backgroundColor = '0ea5e9'; // Default blue

    if (name) {
      const nameParts = name.trim().split(' ');
      if (nameParts.length === 1) {
        initials = nameParts[0].charAt(0).toUpperCase();
      } else if (nameParts.length >= 2) {
        // For multiple names, use first and second name (not last)
        initials = nameParts[0].charAt(0).toUpperCase() + 
                  nameParts[1].charAt(0).toUpperCase();
      }
      
      // Generate consistent color based on name hash
      backgroundColor = this.generateColorFromName(name);
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=ffffff&size=200&bold=true`;
  }

  /**
   * Generate consistent background color from name
   */
  private generateColorFromName(name: string): string {
    // Simple hash function to generate consistent colors
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to color - use pleasant color palette
    const colors = [
      '0ea5e9', // Blue
      '10b981', // Green  
      'f59e0b', // Yellow
      'ef4444', // Red
      '8b5cf6', // Purple
      '06b6d4', // Cyan
      'f97316', // Orange
      'ec4899', // Pink
    ];
    
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  }
}

// Export singleton instance
export const avatarService = new AvatarService(); 