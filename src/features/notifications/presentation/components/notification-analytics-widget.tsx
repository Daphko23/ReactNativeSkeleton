/**
 * @fileoverview NotificationAnalyticsWidget Component - HOOK-CENTRIC UI Component
 * 
 * @description Pure UI component for notification analytics widget.
 * NO BUSINESS LOGIC - all logic handled by useNotificationAnalytics hook.
 * Follows HOOK-CENTRIC architecture with complete separation of concerns.
 * 
 * @module NotificationAnalyticsWidgetComponent
 * @since 2.0.0 (HOOK-CENTRIC Refactor)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation (Pure UI Component)
 * @architecture HOOK-CENTRIC - Components only for UI rendering
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Surface,
  ProgressBar,
  List,
  Badge,
  Button,
} from 'react-native-paper';
import { useTheme } from '../../../../core/theme/theme.system';
import { useNotificationAnalytics } from '../hooks/use-notification-analytics.hook';

// =============================================================================
// COMPONENT PROPS INTERFACE
// =============================================================================

interface NotificationAnalyticsWidgetProps {
  compact?: boolean;
  onViewDetails?: () => void;
}

// =============================================================================
// HOOK-CENTRIC COMPONENT - PURE UI ONLY
// =============================================================================

/**
 * NotificationAnalyticsWidget - Pure UI Component
 * 
 * @description HOOK-CENTRIC notification analytics widget:
 * - ALL business logic in useNotificationAnalytics hook
 * - Component only handles UI rendering and user interactions
 * - Metrics display, charts, and analytics visualization only
 * - Zero business logic, zero state management, zero calculations
 */
export const NotificationAnalyticsWidget: React.FC<NotificationAnalyticsWidgetProps> = ({
  compact = false,
  onViewDetails,
}) => {
  const { theme } = useTheme();
  const styles = useStyles(theme);

  // 🎯 HOOK-CENTRIC - ALL BUSINESS LOGIC FROM HOOK
  const {
    // Server/Computed State
    metrics,
    analytics,
    categoryPerformanceData,
    topicPerformanceData,
    analyticsPeriods,
    
    // UI State
    selectedPeriod,
    showDetails,
    
    // Actions
    handlePeriodChange,
    handleToggleDetails,
    handleViewDetails,
    
    // UI Helpers
    getPerformanceColor,
    getPerformanceLabel,
    
    // Computed States
    hasData,
    isPerformanceGood,
    
    // UI Dependencies (already extracted from hook)
    t,
  } = useNotificationAnalytics({ compact, onViewDetails });

  // =============================================================================
  // UI EVENT HANDLERS - DELEGATE TO HOOK
  // =============================================================================

  const handlePeriodSelect = (period: typeof selectedPeriod) => {
    handlePeriodChange(period);
  };

  const handleDetailsToggle = () => {
    handleToggleDetails();
  };

  const handleViewDetailsPress = () => {
    handleViewDetails();
  };

  // =============================================================================
  // UI RENDERING FUNCTIONS
  // =============================================================================

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {analyticsPeriods.map((period) => (
        <Chip
          key={period.value}
          mode={selectedPeriod === period.value ? 'flat' : 'outlined'}
          selected={selectedPeriod === period.value}
          onPress={() => handlePeriodSelect(period.value)}
          style={styles.periodChip}
          textStyle={styles.periodChipText}
          accessibilityRole="button"
          accessibilityLabel={`${t('notifications:analytics.selectPeriod')} ${period.label}`}
          testID={`period-${period.value}`}
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
      
      {categoryPerformanceData.map(({ category, data, openRate, performanceColor }) => (
        <View key={category} style={styles.categoryItem}>
          <View style={styles.categoryHeader}>
            <Paragraph style={styles.categoryName}>
              {t(`notifications:categories.${category}`)}
            </Paragraph>
            <Paragraph style={[
              styles.categoryRate,
              { color: performanceColor }
            ]}>
              {openRate.toFixed(1)}%
            </Paragraph>
          </View>
          <ProgressBar
            progress={openRate / 100}
            color={performanceColor}
            style={styles.categoryProgress}
          />
          <View style={styles.categoryStats}>
            <Paragraph style={styles.categoryStatText}>
              {data.sent} {t('notifications:analytics.sent')} • {data.opened} {t('notifications:analytics.opened')} • {data.clicked} {t('notifications:analytics.clicked')}
            </Paragraph>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTopicPerformance = () => (
    <View style={styles.topicPerformance}>
      <Title style={styles.sectionTitle}>
        {t('notifications:analytics.topicPerformance')}
      </Title>
      
      {topicPerformanceData.map((topic) => (
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
                  { color: topic.performanceColor }
                ]}
                style={styles.topicChip}
              >
                {topic.openRate.toFixed(1)}% {t('notifications:analytics.openRate')}
              </Chip>
            </View>
          )}
          accessibilityLabel={`${topic.topic}: ${topic.openRate.toFixed(1)}% open rate`}
          testID={`topic-${topic.topic}`}
        />
      ))}
    </View>
  );

  const renderInsights = () => {
    if (!hasData) return null;

    return (
      <View style={styles.insights}>
        <Title style={styles.sectionTitle}>
          {t('notifications:analytics.insights')}
        </Title>
        
        <View style={styles.insightItem}>
          <View style={styles.insightHeader}>
            <Badge
              style={[
                styles.insightBadge,
                { backgroundColor: isPerformanceGood ? theme.colors.success : theme.colors.warning }
              ]}
            >
              {getPerformanceLabel(analytics.openRate)}
            </Badge>
          </View>
          <Paragraph style={styles.insightText}>
            {isPerformanceGood 
              ? t('notifications:analytics.insights.goodPerformance', { rate: analytics.openRate.toFixed(1) })
              : t('notifications:analytics.insights.needsImprovement', { rate: analytics.openRate.toFixed(1) })
            }
          </Paragraph>
        </View>

        {analytics.bestPerformingCategory && (
          <View style={styles.insightItem}>
            <Paragraph style={styles.insightText}>
              {t('notifications:analytics.insights.bestCategory', { 
                category: t(`notifications:categories.${analytics.bestPerformingCategory.category}`),
                rate: analytics.bestPerformingCategory.openRate.toFixed(1)
              })}
            </Paragraph>
          </View>
        )}

        {analytics.topTopic && (
          <View style={styles.insightItem}>
            <Paragraph style={styles.insightText}>
              {t('notifications:analytics.insights.topTopic', { 
                topic: t(`notifications:topics.${analytics.topTopic.topic}`, { defaultValue: analytics.topTopic.topic }),
                rate: analytics.topTopic.openRate.toFixed(1)
              })}
            </Paragraph>
          </View>
        )}
      </View>
    );
  };

  const renderActions = () => {
    if (compact) return null;

    return (
      <View style={styles.actions}>
        <Button 
          mode="outlined" 
          onPress={handleDetailsToggle}
          style={styles.actionButton}
          accessibilityLabel={showDetails ? t('notifications:analytics.hideDetails') : t('notifications:analytics.showDetails')}
          testID="toggle-details-button"
        >
          {showDetails ? t('notifications:analytics.hideDetails') : t('notifications:analytics.showDetails')}
        </Button>
        
        {onViewDetails && (
          <Button 
            mode="contained" 
            onPress={handleViewDetailsPress}
            style={styles.actionButton}
            accessibilityLabel={t('notifications:analytics.viewFullReport')}
            testID="view-details-button"
          >
            {t('notifications:analytics.viewFullReport')}
          </Button>
        )}
      </View>
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  if (!hasData) {
    return (
      <Card style={styles.container}>
        <Card.Content>
          <View style={styles.emptyState}>
            <Title style={styles.emptyTitle}>
              {t('notifications:analytics.noData')}
            </Title>
            <Paragraph style={styles.emptyDescription}>
              {t('notifications:analytics.noDataDescription')}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.container} testID="notification-analytics-widget">
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>
            {t('notifications:analytics.title')}
          </Title>
          <Badge style={[
            styles.performanceBadge,
            { backgroundColor: isPerformanceGood ? theme.colors.success : theme.colors.warning }
          ]}>
            {getPerformanceLabel(analytics.openRate)}
          </Badge>
        </View>

        {renderPeriodSelector()}
        {renderKeyMetrics()}
        
        {showDetails && (
          <>
            {renderCategoryPerformance()}
            {renderTopicPerformance()}
            {renderInsights()}
          </>
        )}
        
        {renderActions()}
      </Card.Content>
    </Card>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const useStyles = (theme: any) => StyleSheet.create({
  container: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  performanceBadge: {
    paddingHorizontal: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  periodChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  periodChipText: {
    fontSize: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  metricContent: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  categoryPerformance: {
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  categoryRate: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryProgress: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  categoryStats: {
    marginTop: 4,
  },
  categoryStatText: {
    fontSize: 11,
    color: theme.colors.onSurface,
    opacity: 0.7,
  },
  topicPerformance: {
    marginBottom: 16,
  },
  topicMetrics: {
    alignItems: 'flex-end',
  },
  topicChip: {
    borderWidth: 1,
  },
  topicChipText: {
    fontSize: 10,
  },
  insights: {
    marginBottom: 16,
  },
  insightItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  insightHeader: {
    marginBottom: 8,
  },
  insightBadge: {
    alignSelf: 'flex-start',
  },
  insightText: {
    fontSize: 13,
    color: theme.colors.onSurface,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
  },
}); 