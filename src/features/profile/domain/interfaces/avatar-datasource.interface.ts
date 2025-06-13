/**
 * @fileoverview AVATAR-DATASOURCE-INTERFACE: Storage DataSource Contract
 * @description Interface für Avatar Storage DataSources mit Clean Architecture
 * Separation zwischen Business Logic und konkreten Storage-Implementierungen.
 * 
 * @version 1.0.0
 * @since 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

/**
 * Avatar Upload Options für DataSource Operations
 */
export interface AvatarUploadOptions {
  userId: string;
  file: {
    uri: string;
    fileName?: string;
    size: number;
    mime: string;
  };
  onProgress?: (progress: number) => void;
}

/**
 * Avatar Upload Result für DataSource Operations
 */
export interface AvatarUploadResult {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

/**
 * Avatar Delete Result für DataSource Operations
 */
export interface AvatarDeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Storage Health Check Result
 */
export interface StorageHealthResult {
  healthy: boolean;
  error?: string;
}

/**
 * Avatar DataSource Interface
 * 
 * Contract für Avatar Storage DataSource Implementierungen.
 * Definiert die Storage-spezifischen Operationen ohne Business Logic.
 * 
 * @interface IAvatarDataSource
 * @since 2.0.0
 * 
 * @description
 * DataSource Interface für Avatar Storage Operationen nach Clean Architecture.
 * Ermöglicht austauschbare Storage-Implementierungen (Supabase, AWS S3, Firebase, etc.)
 * ohne Änderungen an der Business Logic.
 * 
 * @example
 * DataSource Implementation:
 * ```typescript
 * export class SupabaseAvatarDataSource implements IAvatarDataSource {
 *   async uploadAvatar(options: AvatarUploadOptions): Promise<AvatarUploadResult> {
 *     // Supabase-spezifische Upload-Implementierung
 *   }
 * }
 * ```
 * 
 * @example
 * Alternative DataSource:
 * ```typescript
 * export class AWSS3AvatarDataSource implements IAvatarDataSource {
 *   async uploadAvatar(options: AvatarUploadOptions): Promise<AvatarUploadResult> {
 *     // AWS S3-spezifische Upload-Implementierung
 *   }
 * }
 * ```
 * 
 * @architectural_benefits
 * - **Austauschbarkeit**: Verschiedene Storage Provider ohne Code-Änderungen
 * - **Testbarkeit**: Mock DataSources für Unit Tests
 * - **Separation of Concerns**: Storage-Details getrennt von Business Logic
 * - **Dependency Inversion**: Repository abhängig von Interface, nicht Implementierung
 * 
 * @compliance
 * - Clean Architecture Data Layer Contract
 * - Repository Pattern DataSource Interface
 * - SOLID Principles (Interface Segregation, Dependency Inversion)
 * - Enterprise Architecture Standards
 */
export interface IAvatarDataSource {
  /**
   * Upload avatar file to storage
   * 
   * @param options - Upload configuration and file information
   * @returns Promise with upload result containing success status and avatar URL
   * 
   * @example
   * ```typescript
   * const result = await dataSource.uploadAvatar({
   *   userId: 'user-123',
   *   file: {
   *     uri: 'file://avatar.jpg',
   *     fileName: 'avatar.jpg',
   *     size: 1024000,
   *     mime: 'image/jpeg'
   *   },
   *   onProgress: (progress) => console.log(`${progress}%`)
   * });
   * ```
   */
  uploadAvatar(options: AvatarUploadOptions): Promise<AvatarUploadResult>;

  /**
   * Delete avatar file from storage
   * 
   * @param userId - User identifier for avatar deletion
   * @returns Promise with deletion result
   * 
   * @example
   * ```typescript
   * const result = await dataSource.deleteAvatar('user-123');
   * if (result.success) {
   *   console.log('Avatar deleted successfully');
   * }
   * ```
   */
  deleteAvatar(userId: string): Promise<AvatarDeleteResult>;

  /**
   * Get avatar URL from storage
   * 
   * @param userId - User identifier
   * @returns Promise with avatar URL or null if not found
   * 
   * @example
   * ```typescript
   * const avatarUrl = await dataSource.getAvatarUrl('user-123');
   * if (avatarUrl) {
   *   console.log('Avatar found:', avatarUrl);
   * } else {
   *   console.log('No avatar found for user');
   * }
   * ```
   */
  getAvatarUrl(userId: string): Promise<string | null>;

  /**
   * Check storage service health
   * 
   * @returns Promise with health check result
   * 
   * @example
   * ```typescript
   * const health = await dataSource.checkStorageHealth();
   * if (!health.healthy) {
   *   console.error('Storage unavailable:', health.error);
   * }
   * ```
   */
  checkStorageHealth(): Promise<StorageHealthResult>;

  /**
   * Validate avatar file according to storage constraints
   * 
   * @param file - File information to validate
   * @returns Validation result with errors if any
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
   *   console.error('Validation failed:', validation.errors);
   * }
   * ```
   */
  validateAvatarFile(file: {
    name: string;
    size: number;
    type: string;
    uri: string;
  }): { valid: boolean; errors: string[] };
} 