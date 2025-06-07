/**
 * Avatar Business Rules Interface - Application Layer
 * Defines the structure for avatar business rules configuration
 */

export interface AvatarBusinessRules {
  maxFileSize: number;
  allowedTypes: string[];
  enableThumbnails: boolean;
  enableMultipleFormats: boolean;
  compressionQuality: number;
}

export interface AvatarUrlOptions {
  preferThumbnail?: boolean;
  enableThumbnails?: boolean;
  size?: number;
} 