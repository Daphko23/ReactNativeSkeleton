/**
 * Clear Notifications Use Case - Application Layer
 * Handles the business logic for clearing notifications
 */

import { NotificationService } from '../../domain/interfaces/notification-service.interface';

export class ClearNotificationsUseCase {
  constructor(private notificationService: NotificationService) {}

  async execute(): Promise<void> {
    await this.notificationService.clearAllNotifications();
  }
} 