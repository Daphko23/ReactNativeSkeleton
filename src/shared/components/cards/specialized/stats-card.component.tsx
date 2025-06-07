/**
 * StatsCard Component - Enterprise Specialized Component
 * Card component specifically designed for displaying statistical information
 */

import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BaseCard } from '../base/base-card.component';
import type { StatsCardProps } from '../types/card.types';
import { createCardStyles } from '../utils/card-styles.util';

/**
 * @component StatsCard
 * @description Specialized card for displaying statistical data with icons and trends
 * 
 * @param {StatsCardProps} props - Component props
 * @returns {React.ReactElement} Stats card component
 * 
 * @example
 * ```tsx
 * <StatsCard
 *   title="Usage Statistics"
 *   layout="vertical"
 *   stats={[
 *     { id: 'storage', label: 'Storage Used', value: '2.4 GB', icon: 'database' },
 *     { id: 'backup', label: 'Last Backup', value: '2 days ago', icon: 'backup-restore' }
 *   ]}
 * />
 * ```
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  stats,
  layout = 'vertical',
  ...baseProps
}) => {
  const theme = useTheme();
  const styles = createCardStyles(theme);

  const renderStatItem = (stat: any, index: number) => {
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
          {/* Icon */}
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

          {/* Content */}
          <View style={{ 
            flex: layout === 'vertical' ? 1 : undefined,
            alignItems: layout === 'horizontal' ? 'center' : 'flex-start',
          }}>
            <Text style={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant,
              marginBottom: 2,
              textAlign: layout === 'horizontal' ? 'center' : 'left',
            }}>
              {stat.label}
            </Text>
            
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

        {/* Divider */}
        {index < stats.length - 1 && layout === 'vertical' && (
          <View style={styles.divider} />
        )}
      </React.Fragment>
    );
  };

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