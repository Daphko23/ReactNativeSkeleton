/**
 * NotificationCenter - Enhanced Notifications Management
 * Comprehensive notification center with history, settings, and topic management
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  List,
  Button,
  Switch,
  IconButton,
  Chip,
  Badge,
  Divider,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNotifications } from '../hooks/use-notifications.hook';
import { useTheme, createThemedStyles } from '../../../../core/theme/theme.system';
import type { PushNotificationMessage, NotificationSettings, TopicSubscription } from '../../domain/entities/notification.entity';

interface NotificationHistoryItem extends PushNotificationMessage {
  type: 'system' | 'user' | 'marketing' | 'security';
  actionRequired?: boolean;
  expiresAt?: Date;
}

interface EnhancedNotificationSettings extends NotificationSettings {
  // Advanced settings
  doNotDisturb: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string;   // "08:00"
    weekdays: boolean[];
  };
  categories: {
    [key: string]: {
      enabled: boolean;
      sound: boolean;
      vibration: boolean;
      priority: 'high' | 'normal' | 'low';
    };
  };
  location: {
    enabled: boolean;
    radius: number; // meters
  };
}

// Mock notification data
const mockNotificationHistory: NotificationHistoryItem[] = [
  {
    id: '1',
    title: 'Sicherheitswarnung',
    body: 'Neuer Login von unbekanntem Gerät erkannt',
    type: 'security',
    priority: 'high',
    actionRequired: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    category: 'security',
    data: { screen: 'SecuritySettings', action: 'review_login' },
  },
  {
    id: '2',
    title: 'Profil-Update verfügbar',
    body: 'Neue Features für dein Profil sind jetzt verfügbar',
    type: 'user',
    priority: 'normal',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true,
    category: 'updates',
    data: { screen: 'ProfileEdit' },
  },
  {
    id: '3',
    title: 'Wartungsarbeiten geplant',
    body: 'System-Wartung am Sonntag von 02:00-04:00 Uhr',
    type: 'system',
    priority: 'normal',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    category: 'maintenance',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    id: '4',
    title: 'Neue Funktionen entdecken',
    body: 'Entdecke die neuesten Features in der App!',
    type: 'marketing',
    priority: 'low',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    category: 'promotions',
  },
];

const mockTopicSubscriptions: TopicSubscription[] = [
  { topic: 'security-alerts', subscribed: true, subscribedAt: new Date('2024-01-01') },
  { topic: 'app-updates', subscribed: true, subscribedAt: new Date('2024-01-01') },
  { topic: 'maintenance', subscribed: true, subscribedAt: new Date('2024-01-01') },
  { topic: 'promotions', subscribed: false },
  { topic: 'news', subscribed: true, subscribedAt: new Date('2024-01-15') },
  { topic: 'beta-features', subscribed: false },
];

interface NotificationCenterScreenProps {
  navigation: any;
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[2],
  },
  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[2],
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
  },
  
  // Loading & Error
  loadingContainer: {
    alignItems: 'center' as const,
    paddingVertical: theme.spacing[8],
  },
  loadingText: {
    marginTop: theme.spacing[4],
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing[8],
  },
  errorText: {
    textAlign: 'center' as const,
    marginVertical: theme.spacing[4],
    color: theme.colors.textSecondary,
  },
  errorButton: {
    marginTop: theme.spacing[4],
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row' as const,
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[4],
    gap: theme.spacing[2],
  },
  tabButton: {
    flex: 1,
    position: 'relative' as const,
  },
  tabBadge: {
    position: 'absolute' as const,
    top: -theme.spacing[2],
    right: -theme.spacing[2],
  },
  
  // Content
  content: {
    paddingHorizontal: theme.spacing[4],
  },
  
  // Status Card
  statusCard: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  statusHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing[4],
  },
  statusTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  statusBadges: {
    flexDirection: 'row' as const,
    gap: theme.spacing[2],
  },
  urgentBadge: {
    backgroundColor: theme.colors.error,
  },
  unreadBadge: {
    backgroundColor: theme.colors.info,
  },
  statusInfo: {
    marginTop: theme.spacing[2],
  },
  statusActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  // History
  historyCard: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  historyHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing[4],
  },
  historyTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: theme.spacing[8],
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
  },
  notificationItem: {
    marginBottom: theme.spacing[2],
  },
  notificationIcon: {
    position: 'relative' as const,
  },
  unreadIndicator: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
  },
  notificationMeta: {
    alignItems: 'flex-end' as const,
  },
  notificationTime: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing[1],
  },
  actionChip: {
    borderColor: theme.colors.warning,
  },
  actionChipText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.warning,
  },
  notificationDivider: {
    marginTop: theme.spacing[2],
  },
  
  // Settings
  settingsCard: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  settingsTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[4],
    color: theme.colors.text,
  },
  categoryCard: {
    margin: theme.spacing[2],
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    ...theme.shadows.sm,
  },
  categoryHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing[2],
  },
  categoryName: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
  },
  categoryOptions: {
    marginTop: theme.spacing[2],
  },
  categoryOption: {
    paddingLeft: 0,
  },
  
  // Topics
  topicsCard: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  topicsTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[2],
    color: theme.colors.text,
  },
  topicsDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[4],
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  topicItem: {
    marginBottom: theme.spacing[2],
  },
  topicDivider: {
    marginTop: theme.spacing[2],
  },
  
  // Debug
  debugCard: {
    marginBottom: theme.spacing[4],
    borderColor: theme.colors.warning,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
  },
  debugTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.warning,
    marginBottom: theme.spacing[2],
  },
  debugText: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: 'monospace',
    color: theme.colors.textSecondary,
  },
  
  bottomSpacer: {
    height: theme.spacing[8],
  },
}));

export function NotificationCenterScreen({ navigation }: NotificationCenterScreenProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles(theme);
  
  // Notifications Hook
  const {
    isInitialized,
    hasPermission,
    fcmToken,
    isLoading,
    error,
    requestPermission,
    subscribeToTopic,
    unsubscribeFromTopic,
    initializeNotifications,
  } = useNotifications();

  // State
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings' | 'topics'>('notifications');
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistoryItem[]>(mockNotificationHistory);
  const [topicSubscriptions, setTopicSubscriptions] = useState<TopicSubscription[]>(mockTopicSubscriptions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [enhancedSettings, setEnhancedSettings] = useState<EnhancedNotificationSettings>({
    enabled: hasPermission,
    topics: [],
    soundEnabled: true,
    vibrationEnabled: true,
    showPreview: true,
    doNotDisturb: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
      weekdays: [true, true, true, true, true, false, false], // Mon-Fri
    },
    categories: {
      security: { enabled: true, sound: true, vibration: true, priority: 'high' },
      updates: { enabled: true, sound: true, vibration: false, priority: 'normal' },
      maintenance: { enabled: true, sound: false, vibration: false, priority: 'normal' },
      promotions: { enabled: false, sound: false, vibration: false, priority: 'low' },
      news: { enabled: true, sound: false, vibration: false, priority: 'low' },
    },
    location: {
      enabled: false,
      radius: 1000,
    },
  });

  // Initialize notifications on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeNotifications();
    }
  }, [isInitialized, initializeNotifications]);

  // Update settings when permission changes
  useEffect(() => {
    setEnhancedSettings(prev => ({
      ...prev,
      enabled: hasPermission,
    }));
  }, [hasPermission]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Mock refresh - in real app would fetch latest notifications
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark some notifications as read for demo
      setNotificationHistory(prev => 
        prev.map(notif => 
          notif.id === '1' ? { ...notif, isRead: true } : notif
        )
      );
    } catch {
      console.error('Failed to refresh notifications');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleNotificationPress = useCallback((notification: NotificationHistoryItem) => {
    // Mark as read
    setNotificationHistory(prev =>
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Handle navigation based on notification data
    if (notification.data?.screen) {
      if (notification.actionRequired) {
        Alert.alert(
          notification.title,
          notification.body,
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('notifications.centerScreen.actions.takeAction'),
              onPress: () => {
                navigation.navigate(notification.data?.screen, notification.data?.params);
              }
            }
          ]
        );
      } else {
        navigation.navigate(notification.data.screen, notification.data.params);
      }
    }
  }, [navigation, t]);

  const handleTopicToggle = useCallback(async (topic: string, subscribe: boolean) => {
    try {
      if (subscribe) {
        await subscribeToTopic(topic);
        setTopicSubscriptions(prev =>
          prev.map(sub =>
            sub.topic === topic
              ? { ...sub, subscribed: subscribe, subscribedAt: subscribe ? new Date() : undefined }
              : sub
          )
        );
      } else {
        await unsubscribeFromTopic(topic);
        setTopicSubscriptions(prev =>
          prev.map(sub =>
            sub.topic === topic
              ? { ...sub, subscribed: subscribe, subscribedAt: undefined }
              : sub
          )
        );
      }
    } catch {
      console.error('Fehler beim Abonnieren');
    }
  }, [subscribeToTopic, unsubscribeFromTopic]);

  const handleSettingChange = useCallback((
    category: keyof EnhancedNotificationSettings['categories'],
    setting: keyof EnhancedNotificationSettings['categories'][string],
    value: boolean
  ) => {
    setEnhancedSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [setting]: value,
        },
      },
    }));
  }, []);

  const handleRequestPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        t('notifications.centerScreen.permission.title'),
        t('notifications.centerScreen.permission.iosMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('notifications.centerScreen.permission.openSettings'),
            onPress: () => Linking.openSettings(),
          },
          {
            text: t('notifications.centerScreen.permission.grant'),
            onPress: requestPermission,
          },
        ]
      );
    } else {
      await requestPermission();
    }
  }, [requestPermission, t]);

  const getNotificationIcon = useCallback((notification: NotificationHistoryItem): string => {
    switch (notification.type) {
      case 'security': return 'shield-alert';
      case 'user': return 'account';
      case 'system': return 'cog';
      case 'marketing': return 'bullhorn';
      default: return 'bell';
    }
  }, []);

  const getNotificationColor = useCallback((notification: NotificationHistoryItem): string => {
    switch (notification.priority) {
      case 'high': return '#F44336';
      case 'normal': return '#2196F3';
      case 'low': return '#666';
      default: return '#666';
    }
  }, []);

  const formatNotificationTime = useCallback((date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return t('common:time.now');
    if (diffHours < 24) return t('common:time.hoursAgo', { hours: diffHours });
    if (diffDays < 7) return t('common:time.daysAgo', { days: diffDays });
    return date.toLocaleDateString();
  }, [t]);

  const unreadCount = notificationHistory.filter(n => !n.isRead).length;
  const urgentCount = notificationHistory.filter(n => !n.isRead && n.priority === 'high').length;

  const renderTabButtons = () => (
    <View style={styles.tabContainer}>
      <Button
        mode={activeTab === 'notifications' ? 'contained' : 'outlined'}
        onPress={() => setActiveTab('notifications')}
        style={styles.tabButton}
        compact
        icon="bell"
      >
        {t('notifications:tabs.notifications')}
        {unreadCount > 0 && (
          <Badge style={styles.tabBadge} size={16}>
            {unreadCount}
          </Badge>
        )}
      </Button>
      <Button
        mode={activeTab === 'settings' ? 'contained' : 'outlined'}
        onPress={() => setActiveTab('settings')}
        style={styles.tabButton}
        compact
        icon="cog"
      >
        {t('notifications:tabs.settings')}
      </Button>
      <Button
        mode={activeTab === 'topics' ? 'contained' : 'outlined'}
        onPress={() => setActiveTab('topics')}
        style={styles.tabButton}
        compact
        icon="tag-multiple"
      >
        {t('notifications:tabs.topics')}
      </Button>
    </View>
  );

  const renderNotificationsTab = () => (
    <View style={styles.content}>
      {/* Status Overview */}
      <Card style={styles.statusCard}>
        <Card.Content>
          <View style={styles.statusHeader}>
            <Title style={styles.statusTitle}>
              {t('notifications:status.title')}
            </Title>
            <View style={styles.statusBadges}>
              {urgentCount > 0 && (
                <Badge style={styles.urgentBadge} size={20}>
                  {`${urgentCount} ${t('notifications:status.urgent')}`}
                </Badge>
              )}
              <Badge style={styles.unreadBadge} size={20}>
                {`${unreadCount} ${t('notifications:status.unread')}`}
              </Badge>
            </View>
          </View>
          
          <View style={styles.statusInfo}>
            <List.Item
              title={hasPermission ? t('notifications:status.enabled') : t('notifications:status.disabled')}
              description={hasPermission ? t('notifications:status.receivingNotifications') : t('notifications:status.permissionRequired')}
              left={props => <List.Icon {...props} icon={hasPermission ? 'check-circle' : 'alert-circle'} />}
              right={() => (
                <View style={styles.statusActions}>
                  {!hasPermission && (
                    <Button
                      mode="outlined"
                      onPress={handleRequestPermission}
                      compact
                    >
                      {t('notifications:permission.enable')}
                    </Button>
                  )}
                </View>
              )}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Notification History */}
      <Card style={styles.historyCard}>
        <Card.Content>
          <View style={styles.historyHeader}>
            <Title style={styles.historyTitle}>
              {t('notifications:history.title')} ({notificationHistory.length})
            </Title>
            <IconButton
              icon="delete-sweep"
              size={20}
              onPress={() => {
                Alert.alert(
                  t('notifications:history.clearAll'),
                  t('notifications:history.clearAllConfirm'),
                  [
                    { text: t('common:cancel'), style: 'cancel' },
                    {
                      text: t('notifications:history.clear'),
                      style: 'destructive',
                      onPress: () => setNotificationHistory([]),
                    },
                  ]
                );
              }}
            />
          </View>

          {notificationHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Paragraph style={styles.emptyText}>
                {t('notifications:history.empty')}
              </Paragraph>
            </View>
          ) : (
            notificationHistory.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <List.Item
                  title={notification.title}
                  description={notification.body}
                  onPress={() => handleNotificationPress(notification)}
                  left={props => (
                    <View style={styles.notificationIcon}>
                      <List.Icon
                        {...props}
                        icon={getNotificationIcon(notification)}
                        color={getNotificationColor(notification)}
                      />
                      {!notification.isRead && (
                        <Badge style={styles.unreadIndicator} size={8} />
                      )}
                    </View>
                  )}
                  right={() => (
                    <View style={styles.notificationMeta}>
                      <Paragraph style={styles.notificationTime}>
                        {formatNotificationTime(notification.timestamp)}
                      </Paragraph>
                      {notification.actionRequired && (
                        <Chip
                          mode="outlined"
                          style={styles.actionChip}
                          textStyle={styles.actionChipText}
                        >
                          {t('notifications:actionRequired')}
                        </Chip>
                      )}
                    </View>
                  )}
                />
                <Divider style={styles.notificationDivider} />
              </View>
            ))
          )}
        </Card.Content>
      </Card>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.content}>
      {/* Global Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.settingsTitle}>
            {t('notifications:settings.global')}
          </Title>
          
          <List.Item
            title={t('notifications:settings.enabled')}
            description={t('notifications:settings.enabledDescription')}
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={enhancedSettings.enabled}
                onValueChange={hasPermission ? undefined : handleRequestPermission}
                disabled={!hasPermission}
              />
            )}
          />

          <List.Item
            title={t('notifications:settings.sound')}
            description={t('notifications:settings.soundDescription')}
            left={props => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={enhancedSettings.soundEnabled}
                onValueChange={(value) =>
                  setEnhancedSettings(prev => ({ ...prev, soundEnabled: value }))
                }
              />
            )}
          />

          <List.Item
            title={t('notifications:settings.vibration')}
            description={t('notifications:settings.vibrationDescription')}
            left={props => <List.Icon {...props} icon="vibrate" />}
            right={() => (
              <Switch
                value={enhancedSettings.vibrationEnabled}
                onValueChange={(value) =>
                  setEnhancedSettings(prev => ({ ...prev, vibrationEnabled: value }))
                }
              />
            )}
          />

          <List.Item
            title={t('notifications:settings.preview')}
            description={t('notifications:settings.previewDescription')}
            left={props => <List.Icon {...props} icon="eye" />}
            right={() => (
              <Switch
                value={enhancedSettings.showPreview}
                onValueChange={(value) =>
                  setEnhancedSettings(prev => ({ ...prev, showPreview: value }))
                }
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Do Not Disturb */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.settingsTitle}>
            {t('notifications:settings.doNotDisturb')}
          </Title>
          
          <List.Item
            title={t('notifications:settings.dndEnabled')}
            description={`${enhancedSettings.doNotDisturb.startTime} - ${enhancedSettings.doNotDisturb.endTime}`}
            left={props => <List.Icon {...props} icon="moon-waning-crescent" />}
            right={() => (
              <Switch
                value={enhancedSettings.doNotDisturb.enabled}
                onValueChange={(value) =>
                  setEnhancedSettings(prev => ({
                    ...prev,
                    doNotDisturb: { ...prev.doNotDisturb, enabled: value },
                  }))
                }
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Category Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.settingsTitle}>
            {t('notifications:settings.categories')}
          </Title>
          
          {Object.entries(enhancedSettings.categories).map(([category, settings]) => (
            <Surface key={category} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Paragraph style={styles.categoryName}>
                  {t(`notifications:categories.${category}`)}
                </Paragraph>
                <Switch
                  value={settings.enabled}
                  onValueChange={(value) => handleSettingChange(category as any, 'enabled', value)}
                />
              </View>
              
              {settings.enabled && (
                <View style={styles.categoryOptions}>
                  <List.Item
                    title={t('notifications:settings.sound')}
                    left={props => <List.Icon {...props} icon="volume-high" />}
                    right={() => (
                      <Switch
                        value={settings.sound}
                        onValueChange={(value) => handleSettingChange(category as any, 'sound', value)}
                      />
                    )}
                    style={styles.categoryOption}
                  />
                  <List.Item
                    title={t('notifications:settings.vibration')}
                    left={props => <List.Icon {...props} icon="vibrate" />}
                    right={() => (
                      <Switch
                        value={settings.vibration}
                        onValueChange={(value) => handleSettingChange(category as any, 'vibration', value)}
                      />
                    )}
                    style={styles.categoryOption}
                  />
                </View>
              )}
            </Surface>
          ))}
        </Card.Content>
      </Card>

      {/* Debug Info */}
      {__DEV__ && fcmToken && (
        <Card style={styles.debugCard}>
          <Card.Content>
            <Title style={styles.debugTitle}>Debug Info</Title>
            <Paragraph style={styles.debugText}>
              FCM Token: {fcmToken.substring(0, 50)}...
            </Paragraph>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  const renderTopicsTab = () => (
    <View style={styles.content}>
      <Card style={styles.topicsCard}>
        <Card.Content>
          <Title style={styles.topicsTitle}>
            {t('notifications:topics.title')}
          </Title>
          <Paragraph style={styles.topicsDescription}>
            {t('notifications:topics.description')}
          </Paragraph>

          {topicSubscriptions.map((subscription) => (
            <View key={subscription.topic} style={styles.topicItem}>
              <List.Item
                title={t(`notifications:topics.${subscription.topic}`, { 
                  defaultValue: subscription.topic 
                })}
                description={
                  subscription.subscribed && subscription.subscribedAt
                    ? t('notifications:topics.subscribedAt', { 
                        date: subscription.subscribedAt.toLocaleDateString() 
                      })
                    : t('notifications:topics.notSubscribed')
                }
                left={props => <List.Icon {...props} icon="tag" />}
                right={() => (
                  <Switch
                    value={subscription.subscribed}
                    onValueChange={(value) => handleTopicToggle(subscription.topic, value)}
                    disabled={isLoading}
                  />
                )}
              />
              <Divider style={styles.topicDivider} />
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Title>{t('notifications:error.title')}</Title>
          <Paragraph style={styles.errorText}>{error}</Paragraph>
          <Button
            mode="contained"
            onPress={initializeNotifications}
            style={styles.errorButton}
          >
            {t('notifications:error.retry')}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Title style={styles.title}>
            {t('notifications:title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('notifications:subtitle')}
          </Paragraph>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Paragraph style={styles.loadingText}>
              {t('notifications:initializing')}
            </Paragraph>
          </View>
        )}

        {/* Tab Navigation */}
        {renderTabButtons()}

        {/* Tab Content */}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
        {activeTab === 'topics' && renderTopicsTab()}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
} 