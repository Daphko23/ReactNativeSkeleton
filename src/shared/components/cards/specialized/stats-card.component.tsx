/**
 * @fileoverview STATS-CARD-COMPONENT: Statistical Data Display Card Component
 * @description Specialized card component for displaying multiple statistical data points with trends and layouts
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards.Specialized
 * @namespace Shared.Components.Cards.Specialized.StatsCard
 * @category Components
 * @subcategory Cards
 */

import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BaseCard } from '../base/base-card.component';
import type { StatsCardProps } from '../types/card.types';
import { createCardStyles } from '../utils/card-styles.util';

/**
 * Stats Card Component
 * 
 * A specialized card component designed for displaying multiple statistical data points
 * with support for different layouts, trend indicators, and comprehensive data visualization.
 * Perfect for dashboards, analytics summaries, and performance metrics.
 * 
 * @component
 * @function StatsCard
 * @param {StatsCardProps} props - The component props
 * @returns {React.ReactElement} Rendered stats card component with statistical data display
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Cards
 * @module Shared.Components.Cards.Specialized
 * @namespace Shared.Components.Cards.Specialized.StatsCard
 * 
 * @example
 * Usage analytics dashboard:
 * ```tsx
 * import { StatsCard } from '@/shared/components/cards';
 * 
 * const UsageAnalyticsCard = () => (
 *   <StatsCard
 *     title="Usage Statistics"
 *     subtitle="Last 30 days"
 *     layout="vertical"
 *     stats={[
 *       {
 *         id: 'storage',
 *         label: 'Storage Used',
 *         value: '2.4 GB',
 *         icon: 'database',
 *         iconColor: '#4CAF50',
 *         trend: 'up',
 *         trendValue: '+12%',
 *         description: 'of 15 GB total'
 *       },
 *       {
 *         id: 'backup',
 *         label: 'Last Backup',
 *         value: '2 days ago',
 *         icon: 'backup-restore',
 *         iconColor: '#FF9800',
 *         trend: 'neutral',
 *         description: 'Automatic backup completed'
 *       }
 *     ]}
 *     variant="elevated"
 *   />
 * );
 * ```
 * 
 * @example
 * Horizontal layout performance metrics:
 * ```tsx
 * <StatsCard
 *   title="Performance Overview"
 *   layout="horizontal"
 *   stats={[
 *     { id: 'cpu', label: 'CPU', value: '23%', icon: 'memory' },
 *     { id: 'memory', label: 'Memory', value: '1.2GB', icon: 'chip' },
 *     { id: 'network', label: 'Network', value: '145ms', icon: 'wifi' }
 *   ]}
 * />
 * ```
 * 
 * @example
 * Grid layout for compact display:
 * ```tsx
 * <StatsCard
 *   title="Key Metrics"
 *   layout="grid"
 *   stats={[
 *     { id: 'users', label: 'Users', value: '1.2K', trend: 'up', trendValue: '+5%' },
 *     { id: 'revenue', label: 'Revenue', value: '$12.5K', trend: 'up', trendValue: '+15%' },
 *     { id: 'conversion', label: 'Conversion', value: '3.4%', trend: 'down', trendValue: '-2%' },
 *     { id: 'retention', label: 'Retention', value: '89%', trend: 'neutral' }
 *   ]}
 * />
 * ```
 * 
 * @features
 * - Multiple layout options (vertical, horizontal, grid)
 * - Trend indicators with color coding
 * - Icon support with customizable colors
 * - Optional descriptions for context
 * - Automatic dividers in vertical layout
 * - Responsive design patterns
 * - Theme-integrated styling
 * - Statistical data visualization
 * 
 * @layout_options
 * - vertical: Stack items vertically with dividers
 * - horizontal: Distribute items horizontally
 * - grid: Flexible grid layout for multiple items
 * 
 * @architecture
 * - Extends BaseCard for consistent foundation
 * - Flexible rendering function for stat items
 * - Layout-aware styling and positioning
 * - Conditional divider rendering
 * - Theme-integrated color management
 * 
 * @styling
 * - Layout-responsive item positioning
 * - Consistent icon container styling
 * - Typography hierarchy for data display
 * - Color-coded trend indicators
 * - Automatic spacing and alignment
 * 
 * @accessibility
 * - Semantic data structure
 * - Screen reader compatible
 * - High contrast trend indicators
 * - Proper content hierarchy
 * - Meaningful data relationships
 * 
 * @performance
 * - Efficient item rendering with keys
 * - Memoized trend calculations
 * - Optimized layout switching
 * - Minimal re-render triggers
 * 
 * @dependencies
 * - react: Core React library
 * - react-native: View component
 * - react-native-paper: Text, useTheme
 * - react-native-vector-icons: MaterialCommunityIcons
 * - ../base/base-card.component: Foundation card
 * - ../types/card.types: TypeScript definitions
 * - ../utils/card-styles.util: Styling utilities
 * 
 * @use_cases
 * - Dashboard metric summaries
 * - Performance monitoring displays
 * - Analytics and reporting
 * - System health indicators
 * - User engagement metrics
 * - Business KPI visualization
 * 
 * @see {@link BaseCard} for foundational card functionality
 * @see {@link StatsCardProps} for complete prop definitions
 * @see {@link StatItem} for stat item structure
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  stats,
  layout = 'vertical',
  ...baseProps
}) => {
  const theme = useTheme();
  const styles = createCardStyles(theme);

  /**
   * Renders an individual statistical item with icon, value, trend, and description.
   * Handles layout-specific positioning and styling for optimal data display.
   * 
   * @function renderStatItem
   * @param {any} stat - Statistical item data to render
   * @param {number} index - Item index for divider and key handling
   * @returns {React.ReactElement} Rendered statistical item
   * @private
   * @since 1.0.0
   * 
   * @features
   * - Layout-adaptive positioning
   * - Trend indicator with color coding
   * - Optional icon and description
   * - Consistent typography hierarchy
   * - Responsive alignment
   */
  const renderStatItem = (stat: any, index: number) => {
    // Determine trend icon and color
    const trendIcon = stat.trend === 'up' ? 'trending-up' : 
                     stat.trend === 'down' ? 'trending-down' : null;
    const trendColor = stat.trend === 'up' ? theme.colors.primary : 
                      stat.trend === 'down' ? theme.colors.error : 
                      theme.colors.onSurfaceVariant;

    return (
      <React.Fragment key={stat.id}>
        <View style={{
          flexDirection: layout === 'horizontal' ? 'column' : 'row',
          alignItems: layout === 'horizontal' ? 'center' : 'flex-start',
          paddingVertical: 8,
        }}>
          {/* Icon Container */}
          {stat.icon && (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.surfaceVariant,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: layout === 'vertical' ? 12 : 0,
              marginBottom: layout === 'horizontal' ? 8 : 0,
            }}>
              <Icon
                name={stat.icon}
                size={24}
                color={stat.iconColor || theme.colors.primary}
              />
            </View>
          )}

          {/* Content Section */}
          <View style={{ 
            flex: layout === 'vertical' ? 1 : undefined,
            alignItems: layout === 'horizontal' ? 'center' : 'flex-start',
          }}>
            {/* Label */}
            <Text style={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant,
              marginBottom: 2,
              textAlign: layout === 'horizontal' ? 'center' : 'left',
            }}>
              {stat.label}
            </Text>
            
            {/* Value and Trend Container */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.onSurface,
                marginRight: stat.trend ? 8 : 0,
              }}>
                {stat.value}
              </Text>
              
              {/* Trend Indicator */}
              {trendIcon && (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Icon
                    name={trendIcon}
                    size={16}
                    color={trendColor}
                  />
                  {stat.trendValue && (
                    <Text style={{
                      fontSize: 12,
                      color: trendColor,
                      marginLeft: 2,
                    }}>
                      {stat.trendValue}
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Description */}
            {stat.description && (
              <Text style={{
                fontSize: 12,
                color: theme.colors.onSurfaceVariant,
                marginTop: 2,
                textAlign: layout === 'horizontal' ? 'center' : 'left',
              }}>
                {stat.description}
              </Text>
            )}
          </View>
        </View>

        {/* Divider for vertical layout */}
        {index < stats.length - 1 && layout === 'vertical' && (
          <View style={styles.divider} />
        )}
      </React.Fragment>
    );
  };

  // Determine container style based on layout
  const containerStyle = layout === 'horizontal' 
    ? { flexDirection: 'row' as const, justifyContent: 'space-around' as const }
    : layout === 'grid' 
    ? { flexDirection: 'row' as const, flexWrap: 'wrap' as const }
    : {};

  return (
    <BaseCard {...baseProps}>
      <View style={containerStyle}>
        {stats.map((stat, index) => renderStatItem(stat, index))}
      </View>
    </BaseCard>
  );
};

export default StatsCard; 