/**
 * @fileoverview AVATAR-REPOSITORY-INTERFACE: Domain Contract for Avatar Repository
 * @description Domain Layer Repository Interface für Avatar Management
 * nach Clean Architecture Prinzipien mit Business Logic Contracts.
 * 
 * @version 1.0.0
 * @since 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

/**
 * Avatar Upload Result for Business Logic
 */
export interface AvatarUploadResult {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

/**
 * Avatar Delete Result for Business Logic
 */
export interface AvatarDeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Avatar File Information
 */
export interface AvatarFile {
  uri: string;
  fileName?: string;
  size: number;
  mime: string;
}

/**
 * Avatar Repository Interface
 * 
 * Domain Layer Contract für Avatar Repository Implementierungen.
 * Definiert die Business Logic Operationen unabhängig von Storage-Details.
 * 
 * @interface IAvatarRepository
 * @since 2.0.0
 * 
 * @description
 * Repository Interface für Avatar-Management nach Clean Architecture.
 * Definiert Business Logic Contracts ohne Abhängigkeit zu konkreten
 * Storage-Implementierungen (Supabase, AWS S3, Firebase, etc.).
 * 
 * @architectural_patterns
 * - **Repository Pattern**: Abstrahiert Datenzugriff von Business Logic
 * - **Dependency Inversion**: Business Logic abhängig von Interface, nicht Implementierung
 * - **Clean Architecture**: Domain Layer Contract für Data Layer
 * - **SOLID Principles**: Interface Segregation, Single Responsibility
 * 
 * @benefits
 * - **Testbarkeit**: Mock Repository für Unit Tests ohne echte Storage-Abhängigkeiten
 * - **Austauschbarkeit**: Verschiedene Storage Provider ohne Business Logic Änderungen
 * - **Separation of Concerns**: Business Logic getrennt von Storage-Implementierungsdetails
 * - **Maintainability**: Klare Contracts für alle Repository Implementierungen
 * 
 * @example
 * Repository Implementation:
 * ```typescript
 * export class AvatarRepositoryImpl implements IAvatarRepository {
 *   constructor(private dataSource: IAvatarDataSource) {}
 *   
 *   async uploadAvatar(userId: string, file: AvatarFile, onProgress?: (progress: number) => void): Promise<AvatarUploadResult> {
 *     return this.dataSource.uploadAvatar({ userId, file, onProgress });
 *   }
 * }
 * ```
 * 
 * @example
 * Service using Repository:
 * ```typescript
 * export class AvatarService {
 *   constructor(private avatarRepository: IAvatarRepository) {}
 *   
 *   async uploadUserAvatar(userId: string, file: AvatarFile): Promise<AvatarUploadResult> {
 *     return this.avatarRepository.uploadAvatar(userId, file);
 *   }
 * }
 * ```
 * 
 * @example
 * Mock for Testing:
 * ```typescript
 * export class MockAvatarRepository implements IAvatarRepository {
 *   async uploadAvatar(): Promise<AvatarUploadResult> {
 *     return { success: true, avatarUrl: 'mock://avatar.jpg' };
 *   }
 * }
 * ```
 * 
 * @compliance
 * - Clean Architecture Domain Layer Interface
 * - Repository Pattern Business Contract
 * - SOLID Principles (Interface Segregation, Dependency Inversion)
 * - Enterprise Architecture Standards
 * - Domain-Driven Design Repository Pattern
 */
export interface IAvatarRepository {
  /**
   * Upload avatar for user
   * 
   * @param userId - User identifier
   * @param file - Avatar file information
   * @param onProgress - Optional progress callback (0-100)
   * @returns Promise with upload result
   * 
   * @description
   * Business Logic Contract für Avatar Upload ohne Storage-spezifische Details.
   * Die konkrete Implementierung entscheidet über Storage Provider und Details.
   * 
   * @example
   * ```typescript
   * const result = await repository.uploadAvatar(
   *   'user-123',
   *   {
   *     uri: 'file://avatar.jpg',
   *     fileName: 'avatar.jpg',
   *     size: 1024000,
   *     mime: 'image/jpeg'
   *   },
   *   (progress) => console.log(`${progress}%`)
   * );
   * 
   * if (result.success) {
   *   console.log('Avatar uploaded:', result.avatarUrl);
   * } else {
   *   console.error('Upload failed:', result.error);
   * }
   * ```
   */
  uploadAvatar(
    userId: string,
    file: AvatarFile,
    onProgress?: (progress: number) => void
  ): Promise<AvatarUploadResult>;

  /**
   * Delete avatar for user
   * 
   * @param userId - User identifier
   * @returns Promise with deletion result
   * 
   * @description
   * Business Logic Contract für Avatar Deletion.
   * Entfernt alle Avatar-Dateien für den angegebenen Benutzer.
   * 
   * @example
   * ```typescript
   * const result = await repository.deleteAvatar('user-123');
   * if (result.success) {
   *   console.log('Avatar deleted successfully');
   * } else {
   *   console.error('Deletion failed:', result.error);
   * }
   * ```
   */
  deleteAvatar(userId: string): Promise<AvatarDeleteResult>;

  /**
   * Get avatar URL for user
   * 
   * @param userId - User identifier
   * @returns Promise with avatar URL or null if not found
   * 
   * @description
   * Business Logic Contract für Avatar URL Retrieval.
   * Gibt die aktuelle Avatar-URL zurück oder null wenn kein Avatar vorhanden.
   * 
   * @example
   * ```typescript
   * const avatarUrl = await repository.getAvatarUrl('user-123');
   * if (avatarUrl) {
   *   displayUserAvatar(avatarUrl);
   * } else {
   *   displayDefaultAvatar();
   * }
   * ```
   */
  getAvatarUrl(userId: string): Promise<string | null>;

  /**
   * Check if avatar storage is healthy
   * 
   * @returns Promise with health status
   * 
   * @description
   * Business Logic Contract für Storage Health Check.
   * Prüft die Verfügbarkeit des Avatar Storage Services.
   * 
   * @example
   * ```typescript
   * const isHealthy = await repository.isStorageHealthy();
   * if (!isHealthy) {
   *   showServiceUnavailableMessage();
   * }
   * ```
   */
  isStorageHealthy(): Promise<boolean>;

  /**
   * Validate avatar file before upload
   * 
   * @param file - File to validate
   * @returns Validation result with errors if any
   * 
   * @description
   * Business Logic Contract für Avatar File Validation.
   * Prüft Dateiformat, Größe und andere Constraints vor dem Upload.
   * 
   * @example
   * ```typescript
   * const validation = repository.validateFile({
   *   uri: 'file://avatar.jpg',
   *   size: 2048000,
   *   mime: 'image/jpeg'
   * });
   * 
   * if (!validation.valid) {
   *   showValidationErrors(validation.errors);
   *   return;
   * }
   * ```
   */
  validateFile(file: AvatarFile): { valid: boolean; errors: string[] };
}