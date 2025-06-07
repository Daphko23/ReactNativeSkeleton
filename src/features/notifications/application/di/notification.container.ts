/**
 * NotificationContainer - Application Layer DI Container
 * Handles dependency injection for the notification feature following Clean Architecture
 */

import { FirebasePushServiceImpl } from '../../data/services/firebase-push-notification.service.impl';
import { NotificationDataSource } from '../../data/datasources/notification.datasource';
import { NotificationRepositoryImpl } from '../../data/repositories/notification.repository.impl';
import { InitializeNotificationsUseCase } from '../usecases/initialize-notifications.usecase';
import { SubscribeToTopicUseCase } from '../usecases/subscribe-to-topic.usecase';
import { ClearNotificationsUseCase } from '../usecases/clear-notifications.usecase';
import { NotificationService } from '../../domain/interfaces/notification-service.interface';
import type { INotificationRepository } from '../../data/repositories/notification.repository.impl';

class NotificationContainer {
  // Data Layer
  private _notificationDataSource: NotificationDataSource | null = null;
  private _notificationRepository: INotificationRepository | null = null;
  private _notificationService: NotificationService | null = null;
  
  // Application Layer
  private _initializeNotificationsUseCase: InitializeNotificationsUseCase | null = null;
  private _subscribeToTopicUseCase: SubscribeToTopicUseCase | null = null;
  private _clearNotificationsUseCase: ClearNotificationsUseCase | null = null;

  // === DATA LAYER DEPENDENCIES ===

  get notificationDataSource(): NotificationDataSource {
    if (!this._notificationDataSource) {
      this._notificationDataSource = new NotificationDataSource();
    }
    return this._notificationDataSource;
  }

  get notificationRepository(): INotificationRepository {
    if (!this._notificationRepository) {
      this._notificationRepository = new NotificationRepositoryImpl(this.notificationDataSource);
    }
    return this._notificationRepository;
  }

  get notificationService(): NotificationService {
    if (!this._notificationService) {
      this._notificationService = new FirebasePushServiceImpl();
    }
    return this._notificationService;
  }

  // === APPLICATION LAYER DEPENDENCIES ===

  get initializeNotificationsUseCase(): InitializeNotificationsUseCase {
    if (!this._initializeNotificationsUseCase) {
      this._initializeNotificationsUseCase = new InitializeNotificationsUseCase(this.notificationService);
    }
    return this._initializeNotificationsUseCase;
  }

  get subscribeToTopicUseCase(): SubscribeToTopicUseCase {
    if (!this._subscribeToTopicUseCase) {
      this._subscribeToTopicUseCase = new SubscribeToTopicUseCase(this.notificationService);
    }
    return this._subscribeToTopicUseCase;
  }

  get clearNotificationsUseCase(): ClearNotificationsUseCase {
    if (!this._clearNotificationsUseCase) {
      this._clearNotificationsUseCase = new ClearNotificationsUseCase(this.notificationService);
    }
    return this._clearNotificationsUseCase;
  }

  // === TESTING UTILITIES ===

  /**
   * For testing - allow injection of mock services
   */
  setNotificationService(service: NotificationService): void {
    this._notificationService = service;
    // Reset use cases to use new service
    this._initializeNotificationsUseCase = null;
    this._subscribeToTopicUseCase = null;
    this._clearNotificationsUseCase = null;
  }

  /**
   * For testing - allow injection of mock repository
   */
  setNotificationRepository(repository: INotificationRepository): void {
    this._notificationRepository = repository;
  }

  /**
   * For testing - allow injection of mock data source
   */
  setNotificationDataSource(dataSource: NotificationDataSource): void {
    this._notificationDataSource = dataSource;
    // Reset repository to use new data source
    this._notificationRepository = null;
  }

  /**
   * Reset all dependencies (for testing)
   */
  reset(): void {
    this._notificationDataSource = null;
    this._notificationRepository = null;
    this._notificationService = null;
    this._initializeNotificationsUseCase = null;
    this._subscribeToTopicUseCase = null;
    this._clearNotificationsUseCase = null;
  }
}

export const notificationContainer = new NotificationContainer(); 