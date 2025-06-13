/**
 * @fileoverview useNotificationAnalytics Hook - HOOK-CENTRIC Business Logic
 * 
 * @description Custom hook for notification analytics business logic.
 * ALL BUSINESS LOGIC - extracted from NotificationAnalyticsWidget component.
 * Follows HOOK-CENTRIC architecture with complete separation of concerns.
 * 
 * @module useNotificationAnalyticsHook
 * @since 2.0.0 (HOOK-CENTRIC Refactor)
 * @author ReactNativeSkeleton Enterprise Team
 * @layer Presentation (Business Logic Hook)
 * @architecture HOOK-CENTRIC - Hooks contain all business logic
 */

import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../core/theme/theme.system';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface NotificationMetrics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  averageResponseTime: number;
  engagementRate: number;
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

interface UseNotificationAnalyticsProps {
  compact?: boolean;
  onViewDetails?: () => void;
}

// =============================================================================
// MOCK DATA (TODO: Replace with real data service)
// =============================================================================

const mockMetrics: Record<AnalyticsPeriod['value'], NotificationMetrics> = {
  '24h': {
    totalSent: 156,
    totalDelivered: 154,
    totalOpened: 98,
    totalClicked: 23,
    averageResponseTime: 12,
    engagementRate: 62.8,
    categoryBreakdown: {
      marketing: { sent: 45, opened: 32, clicked: 8 },
      transactional: { sent: 67, opened: 54, clicked: 12 },
      social: { sent: 44, opened: 12, clicked: 3 }
    },
    timeSeriesData: [
      { date: '2024-01-15T08:00:00Z', sent: 12, opened: 8, clicked: 2 },
      { date: '2024-01-15T12:00:00Z', sent: 23, opened: 15, clicked: 4 },
      { date: '2024-01-15T16:00:00Z', sent: 34, opened: 22, clicked: 6 },
      { date: '2024-01-15T20:00:00Z', sent: 87, opened: 53, clicked: 11 }
    ],
    topicPerformance: [
      { topic: 'product_updates', subscribers: 1250, delivered: 45, openRate: 71.1, clickRate: 17.8 },
      { topic: 'security_alerts', subscribers: 2100, delivered: 67, openRate: 80.6, clickRate: 17.9 },
      { topic: 'social_activity', subscribers: 850, delivered: 44, openRate: 27.3, clickRate: 25.0 }
    ]
  },
  '7d': {
    totalSent: 1024,
    totalDelivered: 1019,
    totalOpened: 687,
    totalClicked: 142,
    averageResponseTime: 18,
    engagementRate: 67.4,
    categoryBreakdown: {
      marketing: { sent: 312, opened: 198, clicked: 45 },
      transactional: { sent: 456, opened: 334, clicked: 78 },
      social: { sent: 256, opened: 155, clicked: 19 }
    },
    timeSeriesData: [],
    topicPerformance: [
      { topic: 'product_updates', subscribers: 1250, delivered: 312, openRate: 63.5, clickRate: 14.4 },
      { topic: 'security_alerts', subscribers: 2100, delivered: 456, openRate: 73.2, clickRate: 17.1 },
      { topic: 'social_activity', subscribers: 850, delivered: 256, openRate: 60.5, clickRate: 7.4 }
    ]
  },
  '30d': {
    totalSent: 4512,
    totalDelivered: 4487,
    totalOpened: 2891,
    totalClicked: 623,
    averageResponseTime: 22,
    engagementRate: 64.4,
    categoryBreakdown: {
      marketing: { sent: 1234, opened: 823, clicked: 187 },
      transactional: { sent: 2145, opened: 1567, clicked: 356 },
      social: { sent: 1133, opened: 501, clicked: 80 }
    },
    timeSeriesData: [],
    topicPerformance: [
      { topic: 'product_updates', subscribers: 1250, delivered: 1234, openRate: 66.7, clickRate: 15.2 },
      { topic: 'security_alerts', subscribers: 2100, delivered: 2145, openRate: 73.0, clickRate: 16.6 },
      { topic: 'social_activity', subscribers: 850, delivered: 1133, openRate: 44.2, clickRate: 7.1 }
    ]
  },
  '90d': {
    totalSent: 13256,
    totalDelivered: 13147,
    totalOpened: 8234,
    totalClicked: 1876,
    averageResponseTime: 28,
    engagementRate: 62.6,
    categoryBreakdown: {
      marketing: { sent: 3987, opened: 2456, clicked: 567 },
      transactional: { sent: 6234, opened: 4321, clicked: 987 },
      social: { sent: 3035, opened: 1457, clicked: 322 }
    },
    timeSeriesData: [],
    topicPerformance: [
      { topic: 'product_updates', subscribers: 1250, delivered: 3987, openRate: 61.6, clickRate: 14.1 },
      { topic: 'security_alerts', subscribers: 2100, delivered: 6234, openRate: 69.3, clickRate: 15.8 },
      { topic: 'social_activity', subscribers: 850, delivered: 3035, openRate: 48.0, clickRate: 10.6 }
    ]
  }
};

const analyticsPeriods: AnalyticsPeriod[] = [
  { label: '24h', value: '24h' },
  { label: '7 Tage', value: '7d' },
  { label: '30 Tage', value: '30d' },
  { label: '90 Tage', value: '90d' }
];

// =============================================================================
// HOOK-CENTRIC BUSINESS LOGIC HOOK
// =============================================================================

/**
 * useNotificationAnalytics - Business Logic Hook
 * 
 * @description HOOK-CENTRIC notification analytics hook:
 * - ALL business logic for notification analytics calculations
 * - Period selection and metrics computation
 * - Performance analysis and color coding
 * - Complete separation from UI rendering logic
 */
export const useNotificationAnalytics = ({
  compact = false,
  onViewDetails,
}: UseNotificationAnalyticsProps = {}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // =============================================================================
  // UI STATE MANAGEMENT
  // =============================================================================

  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod['value']>('24h');
  const [showDetails, setShowDetails] = useState(!compact);

  // =============================================================================
  // BUSINESS LOGIC - Data Processing
  // =============================================================================

  const metrics = useMemo(() => {
    return mockMetrics[selectedPeriod] || mockMetrics['24h'];
  }, [selectedPeriod]);

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

  // =============================================================================
  // BUSINESS LOGIC - Performance Analysis
  // =============================================================================

  const getPerformanceColor = useCallback((rate: number): string => {
    if (rate >= 70) return theme.colors.success;
    if (rate >= 50) return theme.colors.warning;
    return theme.colors.error;
  }, [theme.colors]);

  const getPerformanceLabel = useCallback((rate: number): string => {
    if (rate >= 70) return t('notifications:analytics.excellent');
    if (rate >= 50) return t('notifications:analytics.good');
    return t('notifications:analytics.needsImprovement');
  }, [t]);

  // =============================================================================
  // COMPUTED STATES
  // =============================================================================

  const hasData = useMemo(() => {
    return metrics.totalSent > 0;
  }, [metrics.totalSent]);

  const isPerformanceGood = useMemo(() => {
    return analytics.openRate >= 50;
  }, [analytics.openRate]);

  const categoryPerformanceData = useMemo(() => {
    return Object.entries(metrics.categoryBreakdown).map(([category, data]) => {
      const openRate = (data.opened / data.sent) * 100;
      return {
        category,
        data,
        openRate,
        performanceColor: getPerformanceColor(openRate),
        performanceLabel: getPerformanceLabel(openRate),
      };
    });
  }, [metrics.categoryBreakdown, getPerformanceColor, getPerformanceLabel]);

  const topicPerformanceData = useMemo(() => {
    const itemsToShow = compact ? 2 : 4;
    return metrics.topicPerformance.slice(0, itemsToShow).map((topic) => ({
      ...topic,
      performanceColor: getPerformanceColor(topic.openRate),
      performanceLabel: getPerformanceLabel(topic.openRate),
    }));
  }, [metrics.topicPerformance, compact, getPerformanceColor, getPerformanceLabel]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handlePeriodChange = useCallback((period: AnalyticsPeriod['value']) => {
    setSelectedPeriod(period);
  }, []);

  const handleToggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);

  const handleViewDetails = useCallback(() => {
    onViewDetails?.();
  }, [onViewDetails]);

  // =============================================================================
  // RETURN HOOK API
  // =============================================================================

  return {
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
    
    // UI Dependencies
    theme,
    t,
  };
}; 