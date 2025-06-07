/**
 * @fileoverview ACTION-CARD-COMPONENT: Specialized Interactive Card Component
 * @description Interactive card component designed for displaying actionable items with icons and navigation
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards.Specialized
 * @namespace Shared.Components.Cards.Specialized.ActionCard
 * @category Components
 * @subcategory Cards
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BaseCard } from '../base/base-card.component';
import type { ActionCardProps } from '../types/card.types';
import { createCardStyles } from '../utils/card-styles.util';

/**
 * Action Card Component
 * 
 * A specialized card component designed for displaying lists of actionable items.
 * Each action displays an icon, label, optional description, and navigation indicator.
 * Perfect for settings menus, navigation lists, and feature discovery interfaces.
 * 
 * @component
 * @function ActionCard
 * @param {ActionCardProps} props - The component props
 * @returns {React.ReactElement} Rendered action card component with interactive items
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Cards
 * @module Shared.Components.Cards.Specialized
 * @namespace Shared.Components.Cards.Specialized.ActionCard
 * 
 * @example
 * Basic account actions menu:
 * ```tsx
 * import { ActionCard } from '@/shared/components/cards';
 * 
 * const AccountActionsCard = () => (
 *   <ActionCard
 *     title="Account Actions"
 *     actions={[
 *       {
 *         id: 'edit-profile',
 *         label: 'Edit Profile',
 *         description: 'Update your personal information',
 *         icon: 'account-edit',
 *         iconColor: '#4CAF50'
 *       },
 *       {
 *         id: 'settings',
 *         label: 'Account Settings',
 *         description: 'Manage privacy and security',
 *         icon: 'cog',
 *         primary: true
 *       }
 *     ]}
 *     onActionPress={(actionId) => navigation.navigate(actionId)}
 *   />
 * );
 * ```
 * 
 * @features
 * - Interactive action items with press handling
 * - Icon support with customizable colors
 * - Optional descriptions for better UX
 * - Disabled state support
 * - Accessibility compliant
 * - Touch feedback and animations
 * - Test-friendly with testID support
 * 
 * @see {@link BaseCard} for foundational card functionality
 * @see {@link ActionCardProps} for complete prop definitions
 * @see {@link ActionItem} for action item structure
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