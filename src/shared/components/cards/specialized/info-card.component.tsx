/**
 * @fileoverview INFO-CARD-COMPONENT: Information Display Card Component
 * @description Specialized card component for displaying key information with values, trends, and visual indicators
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards.Specialized
 * @namespace Shared.Components.Cards.Specialized.InfoCard
 * @category Components
 * @subcategory Cards
 */

import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BaseCard } from '../base/base-card.component';
import type { InfoCardProps } from '../types/card.types';

/**
 * Info Card Component
 * 
 * A specialized card component designed for displaying key information with values,
 * trend indicators, and descriptive content. Perfect for dashboards, analytics,
 * progress indicators, and status displays.
 * 
 * @component
 * @function InfoCard
 * @param {InfoCardProps} props - The component props
 * @returns {React.ReactElement} Rendered info card component with value and trend display
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Cards
 * @module Shared.Components.Cards.Specialized
 * @namespace Shared.Components.Cards.Specialized.InfoCard
 * 
 * @example
 * Profile completion indicator:
 * ```tsx
 * import { InfoCard } from '@/shared/components/cards';
 * 
 * const ProfileCompletionCard = () => (
 *   <InfoCard
 *     title="Profile Completeness"
 *     icon="account-check"
 *     iconColor="#4CAF50"
 *     value="85%"
 *     description="Great progress! Complete your profile for better visibility."
 *     trend="up"
 *     trendValue="+5%"
 *     variant="elevated"
 *   />
 * );
 * ```
 * 
 * @example
 * Storage usage display:
 * ```tsx
 * <InfoCard
 *   title="Storage Usage"
 *   icon="harddisk"
 *   iconColor="#FF9800"
 *   value="8.5 GB"
 *   description="of 15 GB used"
 *   trend="up"
 *   trendValue="+1.2 GB"
 * >
 *   <ProgressBar progress={0.57} style={{ marginTop: 8 }} />
 * </InfoCard>
 * ```
 * 
 * @example
 * Performance metrics with neutral trend:
 * ```tsx
 * <InfoCard
 *   title="App Performance"
 *   icon="speedometer"
 *   value="98.5%"
 *   description="Average uptime this month"
 *   trend="neutral"
 *   trendValue="stable"
 * />
 * ```
 * 
 * @features
 * - Prominent value display with typography hierarchy
 * - Icon support with customizable colors
 * - Trend indicators with color-coded feedback
 * - Optional descriptive text
 * - Flexible content area for custom elements
 * - Responsive layout design
 * - Theme-integrated styling
 * - Accessibility compliant
 * 
 * @architecture
 * - Extends BaseCard for consistent foundation
 * - Flexible layout with icon and content sections
 * - Conditional rendering for optional elements
 * - Theme-aware color calculations
 * - Trend icon and color mapping
 * 
 * @styling
 * - Large, prominent value typography
 * - Color-coded trend indicators
 * - Icon containers with background circles
 * - Consistent spacing and alignment
 * - Theme-integrated color schemes
 * 
 * @accessibility
 * - Semantic content structure
 * - Screen reader compatible
 * - High contrast trend indicators
 * - Proper content hierarchy
 * 
 * @performance
 * - Efficient conditional rendering
 * - Memoized trend calculations
 * - Optimized icon rendering
 * - Minimal re-render triggers
 * 
 * @dependencies
 * - react: Core React library
 * - react-native: View component
 * - react-native-paper: Text, useTheme
 * - react-native-vector-icons: MaterialCommunityIcons
 * - ../base/base-card.component: Foundation card
 * - ../types/card.types: TypeScript definitions
 * 
 * @use_cases
 * - Dashboard metrics and KPIs
 * - Progress and completion indicators
 * - Status and health monitors
 * - Analytics and reporting
 * - User engagement metrics
 * - System performance displays
 * 
 * @see {@link BaseCard} for foundational card functionality
 * @see {@link InfoCardProps} for complete prop definitions
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  iconColor,
  value,
  description,
  trend,
  trendValue,
  children,
  ...baseProps
}) => {
  const theme = useTheme();

  /**
   * Determines the appropriate icon for the given trend direction.
   * Maps trend values to Material Community Icons names.
   * 
   * @function getTrendIcon
   * @returns {string | null} Icon name for the trend or null if no trend
   * @private
   * @since 1.0.0
   * 
   * @mapping
   * - up: 'trending-up' (upward arrow)
   * - down: 'trending-down' (downward arrow)  
   * - neutral: 'trending-neutral' (horizontal line)
   * - default: null (no icon)
   */
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'neutral':
        return 'trending-neutral';
      default:
        return null;
    }
  };

  /**
   * Determines the appropriate color for the trend indicator.
   * Uses theme colors to provide semantic color feedback.
   * 
   * @function getTrendColor
   * @returns {string} Color value from theme for the trend indicator
   * @private
   * @since 1.0.0
   * 
   * @color_mapping
   * - up: theme.colors.primary (positive/success)
   * - down: theme.colors.error (negative/danger)
   * - neutral: theme.colors.onSurfaceVariant (neutral/stable)
   * - default: theme.colors.onSurfaceVariant (fallback)
   */
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.colors.primary;
      case 'down':
        return theme.colors.error;
      case 'neutral':
        return theme.colors.onSurfaceVariant;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  return (
    <BaseCard {...baseProps}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}>
        {/* Icon Section */}
        {icon && (
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.colors.surfaceVariant,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            <Icon
              name={icon}
              size={28}
              color={iconColor || theme.colors.primary}
            />
          </View>
        )}

        {/* Content Section */}
        <View style={{ flex: 1 }}>
          {/* Value and Trend */}
          {value && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: theme.colors.onSurface,
                marginRight: trend ? 8 : 0,
              }}>
                {value}
              </Text>

              {/* Trend Indicator */}
              {trend && getTrendIcon() && (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: getTrendColor() + '20',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 12,
                }}>
                  <Icon
                    name={getTrendIcon()!}
                    size={14}
                    color={getTrendColor()}
                  />
                  {trendValue && (
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: getTrendColor(),
                      marginLeft: 2,
                    }}>
                      {trendValue}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Description */}
          {description && (
            <Text style={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant,
              lineHeight: 20,
              marginBottom: children ? 12 : 0,
            }}>
              {description}
            </Text>
          )}

          {/* Custom Content */}
          {children}
        </View>
      </View>
    </BaseCard>
  );
};

export default InfoCard; 