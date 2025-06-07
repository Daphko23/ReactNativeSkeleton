/**
 * InfoCard Component - Enterprise Specialized Component
 * Card component specifically designed for displaying information with optional trends
 */

import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BaseCard } from '../base/base-card.component';
import type { InfoCardProps } from '../types/card.types';

/**
 * @component InfoCard
 * @description Specialized card for displaying information with icons, values and trends
 * 
 * @param {InfoCardProps} props - Component props
 * @returns {React.ReactElement} Info card component
 * 
 * @example
 * ```tsx
 * <InfoCard
 *   title="Profile Completeness"
 *   icon="account-check"
 *   value="85%"
 *   description="Great progress! Complete your profile for better visibility."
 *   trend="up"
 *   trendValue="+5%"
 * />
 * ```
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