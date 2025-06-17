/**
 * @fileoverview AVATAR-DI-CONTAINER: Dependency Injection für Avatar Module
 * @description Dependency Injection Container für Avatar Repository/DataSource Setup
 * mit Clean Architecture Compliance und Enterprise IoC Pattern.
 * 
 * @version 1.0.0
 * @since 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

import { IAvatarRepository } from '@features/profile/domain/interfaces/avatar-repository.interface';
import { IAvatarDataSource } from '@features/profile/domain/interfaces/avatar-datasource.interface';
import { AvatarRepositoryImpl } from '@features/profile/data/repositories/avatar-repository.impl';
import { SupabaseAvatarDataSource } from '@features/profile/data/datasources/supabase-avatar.datasource';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Logger for Avatar DI Container
const logger = LoggerFactory.createServiceLogger('AvatarDIContainer');

/**
 * Avatar Dependency Injection Container
 * 
 * Container für Avatar Module Dependency Injection nach Enterprise IoC Pattern.
 * Konfiguriert Repository-DataSource Dependencies für Clean Architecture.
 * 
 * @class AvatarDIContainer
 * @since 2.0.0
 * 
 * @description
 * Enterprise-Grade Dependency Injection Container für Avatar Module.
 * Implementiert Inversion of Control Pattern für lose Kopplung und
 * bessere Testbarkeit in Clean Architecture Umgebungen.
 * 
 * @architectural_benefits
 * - **Inversion of Control**: Dependencies werden injiziert, nicht hart gekoppelt
 * - **Testability**: Einfacher Austausch für Unit Tests (Mock Implementations)
 * - **Maintainability**: Zentrale Konfiguration aller Avatar Dependencies
 * - **Flexibility**: Verschiedene DataSource Provider ohne Code-Änderungen
 * - **Enterprise Standards**: Standard IoC Container Pattern für große Projekte
 * 
 * @example
 * Production Usage:
 * ```typescript
 * import { avatarDIContainer } from '@core/di/avatar-di.container';
 * 
 * const avatarRepository = avatarDIContainer.getAvatarRepository();
 * const result = await avatarRepository.uploadAvatar(userId, file);
 * ```
 * 
 * @example
 * Testing Usage:
 * ```typescript
 * import { avatarDIContainer } from '@core/di/avatar-di.container';
 * 
 * // Setup mock für Tests
 * avatarDIContainer.setAvatarDataSource(new MockAvatarDataSource());
 * const repository = avatarDIContainer.getAvatarRepository();
 * ```
 * 
 * @example
 * Alternative DataSource:
 * ```typescript
 * import { AWSS3AvatarDataSource } from './aws-s3-avatar.datasource';
 * 
 * // Wechsel zu AWS S3 ohne Code-Änderungen
 * avatarDIContainer.setAvatarDataSource(new AWSS3AvatarDataSource());
 * ```
 */
export class AvatarDIContainer {
  private static instance: AvatarDIContainer;
  private avatarDataSource: IAvatarDataSource;
  private avatarRepository: IAvatarRepository;

  /**
   * Private constructor für Singleton Pattern
   */
  private constructor() {
    // Default Supabase DataSource Configuration
    this.avatarDataSource = new SupabaseAvatarDataSource();
    this.avatarRepository = new AvatarRepositoryImpl(this.avatarDataSource);
  }

  /**
   * Get singleton instance of Avatar DI Container
   * 
   * @returns Avatar DI Container instance
   * 
   * @example
   * ```typescript
   * const container = AvatarDIContainer.getInstance();
   * const repository = container.getAvatarRepository();
   * ```
   */
  public static getInstance(): AvatarDIContainer {
    if (!AvatarDIContainer.instance) {
      AvatarDIContainer.instance = new AvatarDIContainer();
    }
    return AvatarDIContainer.instance;
  }

  /**
   * Get Avatar Repository instance
   * 
   * @returns Configured Avatar Repository
   * 
   * @description
   * Gibt die konfigurierte Avatar Repository Instanz zurück.
   * Repository ist bereits mit DataSource injiziert.
   * 
   * @example
   * ```typescript
   * const repository = container.getAvatarRepository();
   * const result = await repository.uploadAvatar(userId, file);
   * ```
   */
  public getAvatarRepository(): IAvatarRepository {
    return this.avatarRepository;
  }

  /**
   * Get Avatar DataSource instance
   * 
   * @returns Configured Avatar DataSource
   * 
   * @description
   * Gibt die konfigurierte Avatar DataSource Instanz zurück.
   * Normalerweise nur für Testing oder erweiterte Konfiguration benötigt.
   * 
   * @example
   * ```typescript
   * const dataSource = container.getAvatarDataSource();
   * const health = await dataSource.checkStorageHealth();
   * ```
   */
  public getAvatarDataSource(): IAvatarDataSource {
    return this.avatarDataSource;
  }

  /**
   * Set Avatar DataSource (für Testing oder alternative Provider)
   * 
   * @param dataSource - DataSource implementation to use
   * 
   * @description
   * Ermöglicht das Setzen einer alternativen DataSource Implementierung.
   * Hauptsächlich für Unit Tests mit Mock DataSources verwendet.
   * 
   * @example
   * Testing Setup:
   * ```typescript
   * const mockDataSource = new MockAvatarDataSource();
   * container.setAvatarDataSource(mockDataSource);
   * 
   * // Repository verwendet jetzt Mock DataSource
   * const repository = container.getAvatarRepository();
   * ```
   * 
   * @example
   * Alternative Provider:
   * ```typescript
   * const s3DataSource = new AWSS3AvatarDataSource();
   * container.setAvatarDataSource(s3DataSource);
   * 
   * // App verwendet jetzt AWS S3 statt Supabase
   * const repository = container.getAvatarRepository();
   * ```
   */
  public setAvatarDataSource(dataSource: IAvatarDataSource): void {
    this.avatarDataSource = dataSource;
    // Repository mit neuer DataSource neu erstellen
    this.avatarRepository = new AvatarRepositoryImpl(this.avatarDataSource);
    
    logger.info('DataSource updated, Repository recreated', LogCategory.BUSINESS, {
      service: 'AvatarDIContainer',
      metadata: { operation: 'setAvatarDataSource', dataSourceType: dataSource.constructor.name }
    });
  }

  /**
   * Set Avatar Repository (für komplexe Testing Scenarios)
   * 
   * @param repository - Repository implementation to use
   * 
   * @description
   * Ermöglicht das direkte Setzen einer Repository Implementierung.
   * Hauptsächlich für komplexe Test-Szenarien verwendet.
   * 
   * @example
   * ```typescript
   * const mockRepository = new MockAvatarRepository();
   * container.setAvatarRepository(mockRepository);
   * ```
   */
  public setAvatarRepository(repository: IAvatarRepository): void {
    this.avatarRepository = repository;
    logger.info('Repository updated', LogCategory.BUSINESS, {
      service: 'AvatarDIContainer',
      metadata: { operation: 'setAvatarRepository', repositoryType: repository.constructor.name }
    });
  }

  /**
   * Reset to default configuration
   * 
   * @description
   * Setzt den Container auf die Standard-Konfiguration zurück.
   * Nützlich für Test Cleanup oder Umgebungswechsel.
   * 
   * @example
   * ```typescript
   * // Nach Tests zurück zu Standard
   * container.resetToDefaults();
   * ```
   */
  public resetToDefaults(): void {
    this.avatarDataSource = new SupabaseAvatarDataSource();
    this.avatarRepository = new AvatarRepositoryImpl(this.avatarDataSource);
    logger.info('Reset to default Supabase configuration', LogCategory.BUSINESS, {
      service: 'AvatarDIContainer',
      metadata: { operation: 'resetToDefaults', dataSourceType: 'SupabaseAvatarDataSource' }
    });
  }
}

/**
 * Global Avatar DI Container Instance
 * 
 * Globale Instanz für einfachen Zugriff im gesamten Avatar Module.
 * 
 * @example
 * ```typescript
 * import { avatarDIContainer } from '@core/di/avatar-di.container';
 * 
 * const repository = avatarDIContainer.getAvatarRepository();
 * ```
 */
export const avatarDIContainer = AvatarDIContainer.getInstance();