/**
 * Initialize Notifications Use Case - Application Layer
 * Handles the business logic for notification system initialization
 */

import { NotificationService } from '../../domain/interfaces/notification-service.interface';

export class InitializeNotificationsUseCase {
  constructor(private notificationService: NotificationService) {}

  async execute(): Promise<void> {
    await this.notificationService.initialize();
  }

  async requestPermission(): Promise<boolean> {
    return await this.notificationService.requestPermission();
  }

  async getFCMToken(): Promise<string | null> {
    return await this.notificationService.getToken();
  }
} 