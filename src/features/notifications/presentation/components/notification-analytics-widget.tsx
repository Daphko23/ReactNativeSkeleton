/**
 * NotificationAnalyticsWidget - Advanced Analytics for Notifications
 * Comprehensive notification analytics with charts, trends, and insights
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Surface,
  Chip,
  ProgressBar,
  List,
  Divider,
  IconButton,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme, createThemedStyles } from '../../../../core/theme/theme.system';

interface NotificationMetrics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  averageResponseTime: number; // minutes
  engagementRate: number; // percentage
  categoryBreakdown: {
    [category: string]: {
      sent: number;
      opened: number;
      clicked: number;
    };
  };
  timeSeriesData: {
    date: string;
    sent: number;
    opened: number;
    clicked: number;
  }[];
  topicPerformance: {
    topic: string;
    subscribers: number;
    delivered: number;
    openRate: number;
    clickRate: number;
  }[];
}

interface AnalyticsPeriod {
  label: string;
  value: '24h' | '7d' | '30d' | '90d';
}

const analyticsPeriods: AnalyticsPeriod[] = [
  { label: '24h', value: '24h' },
  { label: '7 Tage', value: '7d' },
  { label: '30 Tage', value: '30d' },
  { label: '90 Tage', value: '90d' },
];

// Mock analytics data
const mockMetrics: Record<string, NotificationMetrics> = {
  '24h': {
    totalSent: 156,
    totalDelivered: 152,
    totalOpened: 89,
    totalClicked: 23,
    averageResponseTime: 45,
    engagementRate: 58.6,
    categoryBreakdown: {
      security: { sent: 12, opened: 11, clicked: 8 },
      updates: { sent: 45, opened: 32, clicked: 12 },
      maintenance: { sent: 8, opened: 6, clicked: 1 },
      promotions: { sent: 67, opened: 28, clicked: 2 },
      news: { sent: 24, opened: 12, clicked: 0 },
    },
    timeSeriesData: [
      { date: '00:00', sent: 12, opened: 8, clicked: 2 },
      { date: '06:00', sent: 23, opened: 15, clicked: 4 },
      { date: '12:00', sent: 45, opened: 28, clicked: 8 },
      { date: '18:00', sent: 76, opened: 38, clicked: 9 },
    ],
    topicPerformance: [
      { topic: 'security-alerts', subscribers: 1250, delivered: 12, openRate: 91.7, clickRate: 66.7 },
      { topic: 'app-updates', subscribers: 980, delivered: 45, openRate: 71.1, clickRate: 26.7 },
      { topic: 'maintenance', subscribers: 890, delivered: 8, openRate: 75.0, clickRate: 12.5 },
      { topic: 'news', subscribers: 756, delivered: 24, openRate: 50.0, clickRate: 0.0 },
    ],
  },
  // Add more periods as needed
};

interface NotificationAnalyticsWidgetProps {
  compact?: boolean;
  onViewDetails?: () => void;
}

const useStyles = createThemedStyles((theme) => {
  const { width } = Dimensions.get('window');
  
  return {
    container: {
      marginBottom: theme.spacing[4],
    },
    compactContainer: {
      marginBottom: theme.spacing[4],
    },
    header: {
      marginBottom: theme.spacing[4],
    },
    title: {
      fontSize: theme.typography.fontSizes.xl,
      fontWeight: theme.typography.fontWeights.semibold,
      marginBottom: theme.spacing[1],
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.fontSizes.sm,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    compactHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: theme.spacing[4],
    },
    compactTitle: {
      fontSize: theme.typography.fontSizes.lg,
      fontWeight: theme.typography.fontWeights.semibold,
      color: theme.colors.text,
    },
    
    // Period Selector
    periodSelector: {
      flexDirection: 'row' as const,
      marginBottom: theme.spacing[5],
      gap: theme.spacing[2],
    },
    periodChip: {
      flex: 1,
    },
    periodChipText: {
      fontSize: theme.typography.fontSizes.xs,
    },
    
    // Metrics Grid
    metricsGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: theme.spacing[3],
      marginBottom: theme.spacing[5],
    },
    metricCard: {
      flex: 1,
      minWidth: (width - 64) / 2 - 6,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.sm,
    },
    metricContent: {
      alignItems: 'center' as const,
    },
    metricValue: {
      fontSize: theme.typography.fontSizes['2xl'],
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: theme.spacing[1],
      color: theme.colors.text,
    },
    metricLabel: {
      fontSize: theme.typography.fontSizes.xs,
      color: theme.colors.textSecondary,
      textAlign: 'center' as const,
    },
    
    // Category Performance
    categoryPerformance: {
      marginBottom: theme.spacing[5],
    },
    sectionTitle: {
      fontSize: theme.typography.fontSizes.base,
      fontWeight: theme.typography.fontWeights.semibold,
      marginBottom: theme.spacing[3],
      color: theme.colors.text,
    },
    categoryItem: {
      marginBottom: theme.spacing[4],
    },
    categoryHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: theme.spacing[2],
    },
    categoryName: {
      fontSize: theme.typography.fontSizes.sm,
      fontWeight: theme.typography.fontWeights.medium,
      color: theme.colors.text,
    },
    categoryRate: {
      fontSize: theme.typography.fontSizes.sm,
      fontWeight: theme.typography.fontWeights.semibold,
    },
    categoryProgress: {
      height: 6,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing[1],
    },
    categoryStats: {
      marginTop: theme.spacing[1],
    },
    categoryStatText: {
      fontSize: theme.typography.fontSizes.xs,
      color: theme.colors.textSecondary,
    },
    
    // Topic Performance
    topicPerformance: {
      marginBottom: theme.spacing[5],
    },
    topicMetrics: {
      alignItems: 'flex-end' as const,
    },
    topicChip: {
      marginBottom: theme.spacing[1],
    },
    topicChipText: {
      fontSize: theme.typography.fontSizes.xs,
    },
    
    // Insights
    insights: {
      marginBottom: theme.spacing[5],
    },
    insightCard: {
      marginBottom: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.sm,
    },
    
    // Compact
    compactInsight: {
      marginTop: theme.spacing[3],
      padding: theme.spacing[2],
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.sm,
    },
    compactInsightText: {
      fontSize: theme.typography.fontSizes.xs,
      textAlign: 'center' as const,
      color: theme.colors.textSecondary,
    },
    
    // Toggle
    toggleContainer: {
      alignItems: 'center' as const,
      marginTop: theme.spacing[3],
    },
    
    // Dividers
    sectionDivider: {
      marginVertical: theme.spacing[4],
    },
  };
});

export const NotificationAnalyticsWidget: React.FC<NotificationAnalyticsWidgetProps> = ({
  compact = false,
  onViewDetails,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod['value']>('24h');
  const [showDetails, setShowDetails] = useState(!compact);

  const metrics = mockMetrics[selectedPeriod] || mockMetrics['24h'];

  const analytics = useMemo(() => {
    const deliveryRate = (metrics.totalDelivered / metrics.totalSent) * 100;
    const openRate = (metrics.totalOpened / metrics.totalDelivered) * 100;
    const clickRate = (metrics.totalClicked / metrics.totalOpened) * 100;
    
    const bestPerformingCategory = Object.entries(metrics.categoryBreakdown)
      .map(([category, data]) => ({
        category,
        openRate: (data.opened / data.sent) * 100,
        clickRate: (data.clicked / data.opened) * 100 || 0,
      }))
      .sort((a, b) => b.openRate - a.openRate)[0];

    const topTopic = metrics.topicPerformance
      .sort((a, b) => b.openRate - a.openRate)[0];

    return {
      deliveryRate,
      openRate,
      clickRate,
      bestPerformingCategory,
      topTopic,
      totalEngagement: metrics.totalOpened + metrics.totalClicked,
    };
  }, [metrics]);

  const getPerformanceColor = (rate: number): string => {
    if (rate >= 70) return theme.colors.success;
    if (rate >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  const getPerformanceLabel = (rate: number): string => {
    if (rate >= 70) return t('notifications:analytics.excellent');
    if (rate >= 50) return t('notifications:analytics.good');
    return t('notifications:analytics.needsImprovement');
  };

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {analyticsPeriods.map((period) => (
        <Chip
          key={period.value}
          mode={selectedPeriod === period.value ? 'flat' : 'outlined'}
          selected={selectedPeriod === period.value}
          onPress={() => setSelectedPeriod(period.value)}
          style={styles.periodChip}
          textStyle={styles.periodChipText}
        >
          {period.label}
        </Chip>
      ))}
    </View>
  );

  const renderKeyMetrics = () => (
    <View style={styles.metricsGrid}>
      <Surface style={styles.metricCard}>
        <View style={styles.metricContent}>
          <Paragraph style={styles.metricValue}>
            {metrics.totalSent}
          </Paragraph>
          <Paragraph style={styles.metricLabel}>
            {t('notifications:analytics.sent')}
          </Paragraph>
        </View>
      </Surface>

      <Surface style={styles.metricCard}>
        <View style={styles.metricContent}>
          <Paragraph style={[
            styles.metricValue,
            { color: getPerformanceColor(analytics.deliveryRate) }
          ]}>
            {analytics.deliveryRate.toFixed(1)}%
          </Paragraph>
          <Paragraph style={styles.metricLabel}>
            {t('notifications:analytics.delivered')}
          </Paragraph>
        </View>
      </Surface>

      <Surface style={styles.metricCard}>
        <View style={styles.metricContent}>
          <Paragraph style={[
            styles.metricValue,
            { color: getPerformanceColor(analytics.openRate) }
          ]}>
            {analytics.openRate.toFixed(1)}%
          </Paragraph>
          <Paragraph style={styles.metricLabel}>
            {t('notifications:analytics.opened')}
          </Paragraph>
        </View>
      </Surface>

      <Surface style={styles.metricCard}>
        <View style={styles.metricContent}>
          <Paragraph style={[
            styles.metricValue,
            { color: getPerformanceColor(analytics.clickRate) }
          ]}>
            {analytics.clickRate.toFixed(1)}%
          </Paragraph>
          <Paragraph style={styles.metricLabel}>
            {t('notifications:analytics.clicked')}
          </Paragraph>
        </View>
      </Surface>
    </View>
  );

  const renderCategoryPerformance = () => (
    <View style={styles.categoryPerformance}>
      <Title style={styles.sectionTitle}>
        {t('notifications:analytics.categoryPerformance')}
      </Title>
      
      {Object.entries(metrics.categoryBreakdown).map(([category, data]) => {
        const openRate = (data.opened / data.sent) * 100;
        return (
          <View key={category} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Paragraph style={styles.categoryName}>
                {t(`notifications:categories.${category}`)}
              </Paragraph>
              <Paragraph style={[
                styles.categoryRate,
                { color: getPerformanceColor(openRate) }
              ]}>
                {openRate.toFixed(1)}%
              </Paragraph>
            </View>
            <ProgressBar
              progress={openRate / 100}
              color={getPerformanceColor(openRate)}
              style={styles.categoryProgress}
            />
            <View style={styles.categoryStats}>
              <Paragraph style={styles.categoryStatText}>
                {data.sent} {t('notifications:analytics.sent')} • {data.opened} {t('notifications:analytics.opened')} • {data.clicked} {t('notifications:analytics.clicked')}
              </Paragraph>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderTopicPerformance = () => (
    <View style={styles.topicPerformance}>
      <Title style={styles.sectionTitle}>
        {t('notifications:analytics.topicPerformance')}
      </Title>
      
      {metrics.topicPerformance.slice(0, compact ? 2 : 4).map((topic) => (
        <List.Item
          key={topic.topic}
          title={t(`notifications:topics.${topic.topic}`, { defaultValue: topic.topic })}
          description={`${topic.subscribers} ${t('notifications:analytics.subscribers')} • ${topic.delivered} ${t('notifications:analytics.delivered')}`}
          left={props => <List.Icon {...props} icon="tag" />}
          right={() => (
            <View style={styles.topicMetrics}>
              <Chip
                mode="outlined"
                textStyle={[
                  styles.topicChipText,
                  { color: getPerformanceColor(topic.openRate) }
                ]}
                style={styles.topicChip}
              >
                {topic.openRate.toFixed(1)}% {t('notifications:analytics.openRate')}
              </Chip>
            </View>
          )}
        />
      ))}
    </View>
  );

  const renderInsights = () => (
    <View style={styles.insights}>
      <Title style={styles.sectionTitle}>
        {t('notifications:analytics.insights')}
      </Title>
      
      <Surface style={styles.insightCard}>
        <List.Item
          title={t('notifications:analytics.bestCategory')}
          description={`${t(`notifications:categories.${analytics.bestPerformingCategory?.category}`)} (${analytics.bestPerformingCategory?.openRate.toFixed(1)}%)`}
          left={props => <List.Icon {...props} icon="trophy" color="#FFD700" />}
        />
      </Surface>

      <Surface style={styles.insightCard}>
        <List.Item
          title={t('notifications:analytics.topTopic')}
          description={`${analytics.topTopic?.topic} (${analytics.topTopic?.openRate.toFixed(1)}% ${t('notifications:analytics.openRate')})`}
          left={props => <List.Icon {...props} icon="star" color="#FF9800" />}
        />
      </Surface>

      <Surface style={styles.insightCard}>
        <List.Item
          title={t('notifications:analytics.overallHealth')}
          description={getPerformanceLabel(analytics.openRate)}
          left={props => (
            <List.Icon 
              {...props} 
              icon="heart" 
              color={getPerformanceColor(analytics.openRate)} 
            />
          )}
        />
      </Surface>
    </View>
  );

  if (compact) {
    return (
      <Card style={styles.compactContainer}>
        <Card.Content>
          <View style={styles.compactHeader}>
            <Title style={styles.compactTitle}>
              {t('notifications:analytics.title')}
            </Title>
            {onViewDetails && (
              <IconButton
                icon="chevron-right"
                size={20}
                onPress={onViewDetails}
              />
            )}
          </View>
          
          {renderKeyMetrics()}
          
          <View style={styles.compactInsight}>
            <Paragraph style={styles.compactInsightText}>
              {t('notifications:analytics.overallPerformance')}: {getPerformanceLabel(analytics.openRate)}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>
            {t('notifications:analytics.title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('notifications:analytics.subtitle')}
          </Paragraph>
        </View>

        {renderPeriodSelector()}
        {renderKeyMetrics()}
        
        {showDetails && (
          <>
            <Divider style={styles.sectionDivider} />
            {renderCategoryPerformance()}
            
            <Divider style={styles.sectionDivider} />
            {renderTopicPerformance()}
            
            <Divider style={styles.sectionDivider} />
            {renderInsights()}
          </>
        )}

        <View style={styles.toggleContainer}>
          <Chip
            mode="outlined"
            icon={showDetails ? 'chevron-up' : 'chevron-down'}
            onPress={() => setShowDetails(!showDetails)}
          >
            {showDetails ? t('common:showLess') : t('common:showMore')}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );
} 