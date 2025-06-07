/**
 * Subscribe to Topic Use Case - Application Layer
 * Handles the business logic for topic subscriptions
 */

import { NotificationService } from '../../domain/interfaces/notification-service.interface';

export class SubscribeToTopicUseCase {
  constructor(private notificationService: NotificationService) {}

  async execute(topic: string): Promise<void> {
    await this.notificationService.subscribeToTopic(topic);
  }

  async unsubscribe(topic: string): Promise<void> {
    await this.notificationService.unsubscribeFromTopic(topic);
  }

  // Business logic methods
  async subscribeToUserTopics(userId: string): Promise<void> {
    const topics = [
      `user-${userId}`,
      'general-updates',
      'important-announcements'
    ];

    for (const topic of topics) {
      await this.execute(topic);
    }
  }

  async unsubscribeFromUserTopics(userId: string): Promise<void> {
    const topics = [
      `user-${userId}`,
      'general-updates',
      'important-announcements'
    ];

    for (const topic of topics) {
      await this.unsubscribe(topic);
    }
  }
} 