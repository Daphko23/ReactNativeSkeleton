/**
 * @fileoverview Avatar Dependency Injection Container
 * 
 * ✅ ENTERPRISE DI CONTAINER:
 * - Repository Pattern Registration
 * - Use Cases Dependency Injection
 * - Service Layer Configuration
 * - Clean Architecture Compliance
 */

import { SupabaseAvatarDataSource } from '../datasources/supabase-avatar.datasource';
import { AvatarRepositoryImpl } from '../repositories/avatar-repository.impl';
import { UploadAvatarUseCase } from '../../application/use-cases/avatar/upload-avatar.usecase';
import { DeleteAvatarUseCase } from '../../application/use-cases/avatar/delete-avatar.usecase';

// Core Services
import { LoggerFactory as _LoggerFactory } from '../../../../core/logging/logger.factory';
import { GDPRAuditService } from '../../../../core/compliance/gdpr-audit.service';

/**
 * Avatar Feature DI Container
 * 
 * ✅ ENTERPRISE ARCHITECTURE:
 * - Singleton Pattern for Container
 * - Lazy Loading für Performance
 * - Clean Architecture Layer Registration
 */
class AvatarDIContainer {
  private static instance: AvatarDIContainer;
  
  // Data Layer
  private _avatarDataSource?: SupabaseAvatarDataSource;
  private _avatarRepository?: AvatarRepositoryImpl;
  
  // Application Layer
  private _uploadAvatarUseCase?: UploadAvatarUseCase;
  private _deleteAvatarUseCase?: DeleteAvatarUseCase;
  
  // Core Services
  private _gdprAuditService?: GDPRAuditService;

  private constructor() {}

  public static getInstance(): AvatarDIContainer {
    if (!AvatarDIContainer.instance) {
      AvatarDIContainer.instance = new AvatarDIContainer();
    }
    return AvatarDIContainer.instance;
  }

  // 🎯 DATA LAYER REGISTRATION
  public getAvatarDataSource(): SupabaseAvatarDataSource {
    if (!this._avatarDataSource) {
      this._avatarDataSource = new SupabaseAvatarDataSource();
    }
    return this._avatarDataSource;
  }

  public getAvatarRepository(): AvatarRepositoryImpl {
    if (!this._avatarRepository) {
      this._avatarRepository = new AvatarRepositoryImpl(
        this.getAvatarDataSource()
      );
    }
    return this._avatarRepository;
  }

  // 🎯 APPLICATION LAYER REGISTRATION
  public getUploadAvatarUseCase(): UploadAvatarUseCase {
    if (!this._uploadAvatarUseCase) {
      this._uploadAvatarUseCase = new UploadAvatarUseCase(
        this.getAvatarRepository()
      );
    }
    return this._uploadAvatarUseCase;
  }

  public getDeleteAvatarUseCase(): DeleteAvatarUseCase {
    if (!this._deleteAvatarUseCase) {
      this._deleteAvatarUseCase = new DeleteAvatarUseCase(
        this.getAvatarRepository()
      );
    }
    return this._deleteAvatarUseCase;
  }

  // 🎯 CORE SERVICES REGISTRATION
  private getGDPRAuditService(): GDPRAuditService {
    if (!this._gdprAuditService) {
      this._gdprAuditService = new GDPRAuditService();
    }
    return this._gdprAuditService;
  }

  /**
   * Reset all instances (for testing)
   */
  public reset(): void {
    this._avatarDataSource = undefined;
    this._avatarRepository = undefined;
    this._uploadAvatarUseCase = undefined;
    this._deleteAvatarUseCase = undefined;
    this._gdprAuditService = undefined;
  }
}

// Export Singleton Instance
export const avatarDIContainer = AvatarDIContainer.getInstance(); 