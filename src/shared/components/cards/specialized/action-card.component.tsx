/**
 * ActionCard Component - Enterprise Specialized Component
 * Card component specifically designed for displaying actionable items
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BaseCard } from '../base/base-card.component';
import type { ActionCardProps } from '../types/card.types';
import { createCardStyles } from '../utils/card-styles.util';

/**
 * @component ActionCard
 * @description Specialized card for displaying actionable items with icons and navigation
 * 
 * @param {ActionCardProps} props - Component props
 * @returns {React.ReactElement} Action card component
 * 
 * @example
 * ```tsx
 * <ActionCard
 *   title="Account Actions"
 *   actions={[
 *     { id: 'edit', label: 'Edit Profile', icon: 'account-edit' },
 *     { id: 'settings', label: 'Settings', icon: 'cog' }
 *   ]}
 *   onActionPress={(actionId) => console.log(actionId)}
 * />
 * ```
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  actions,
  onActionPress,
  ...baseProps
}) => {
  const theme = useTheme();
  const styles = createCardStyles(theme);

  const handleActionPress = (actionId: string) => {
    onActionPress?.(actionId);
  };

  return (
    <BaseCard {...baseProps}>
      {actions.map((action, index) => (
        <React.Fragment key={action.id}>
          <Pressable
            style={[
              {
                paddingVertical: 12,
                paddingHorizontal: 4,
                opacity: action.disabled ? 0.5 : 1,
              }
            ]}
            onPress={() => handleActionPress(action.id)}
            disabled={action.disabled}
            testID={action.testID}
            accessibilityLabel={action.label}
            accessibilityHint={action.description}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              {/* Icon */}
              {action.icon && (
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.colors.surfaceVariant,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Icon
                    name={action.icon}
                    size={24}
                    color={action.iconColor || theme.colors.primary}
                  />
                </View>
              )}

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: theme.colors.onSurface,
                  marginBottom: action.description ? 2 : 0,
                }}>
                  {action.label}
                </Text>
                {action.description && (
                  <Text style={{
                    fontSize: 14,
                    color: theme.colors.onSurfaceVariant,
                  }}>
                    {action.description}
                  </Text>
                )}
              </View>

              {/* Chevron */}
              <Icon
                name="chevron-right"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </View>
          </Pressable>

          {/* Divider */}
          {index < actions.length - 1 && (
            <View style={styles.divider} />
          )}
        </React.Fragment>
      ))}
    </BaseCard>
  );
};

export default ActionCard; 