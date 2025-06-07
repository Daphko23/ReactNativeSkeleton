/**
 * SupportCardContent Component - Enterprise Content Component
 * Reusable content component for support-related actions
 */

import React from 'react';
import { ActionCard } from '../specialized/action-card.component';
import type { SupportCardContentProps, ActionItem } from '../types/card.types';

/**
 * @component SupportCardContent
 * @description Content component for support-related actions like help and contact
 * 
 * @param {SupportCardContentProps} props - Component props
 * @returns {React.ReactElement} Support content component
 * 
 * @example
 * ```tsx
 * <SupportCardContent
 *   items={[
 *     { id: 'help', type: 'help', label: 'Help Center', icon: 'help-circle' },
 *     { id: 'contact', type: 'contact', label: 'Contact Support', icon: 'email' }
 *   ]}
 *   onItemPress={(item) => console.log(item)}
 *   t={(key) => key}
 * />
 * ```
 */
export const SupportCardContent: React.FC<SupportCardContentProps> = ({
  items,
  onItemPress,
  theme,
  t
}) => {
  const actions: ActionItem[] = items.map(item => ({
    id: item.id,
    label: item.label,
    description: item.description,
    icon: item.icon || getSupportIcon(item.type),
    iconColor: item.iconColor,
    disabled: item.disabled,
    testID: item.testID,
  }));

  const handleActionPress = (actionId: string) => {
    const item = items.find(item => item.id === actionId);
    if (item) {
      onItemPress(item);
    }
  };

  return (
    <ActionCard
      title={t('profile.accountScreen.support.title')}
      actions={actions}
      onActionPress={handleActionPress}
      theme={theme}
    />
  );
};

/**
 * Gets default icon for support item type
 */
const getSupportIcon = (type: string): string => {
  switch (type) {
    case 'help':
      return 'help-circle';
    case 'contact':
      return 'email';
    case 'documentation':
      return 'book-open';
    case 'community':
      return 'forum';
    default:
      return 'help-circle';
  }
};

export default SupportCardContent; 