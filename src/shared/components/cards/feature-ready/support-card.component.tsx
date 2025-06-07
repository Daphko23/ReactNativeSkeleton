/**
 * SupportCard Component - Enterprise Shared Component
 * Fully reusable support card for any feature across the app
 */

import React from 'react';
import { SupportCardContent } from '../content/support-card-content.component';
import type { SupportItem } from '../types/card.types';

export interface SharedSupportCardProps {
  items?: SupportItem[];
  onItemPress?: (item: SupportItem) => void;
  theme?: any;
  t: (key: string, options?: any) => string;
  testID?: string;
  showDefaultItems?: boolean;
}

/**
 * @component SupportCard
 * @description Fully reusable support card that can be used across different features
 * Provides default support items but allows customization
 * 
 * @param {SharedSupportCardProps} props - Component props
 * @returns {React.ReactElement} Support card component
 * 
 * @example
 * ```tsx
 * <SupportCard
 *   t={t}
 *   onItemPress={(item) => handleSupportAction(item)}
 *   showDefaultItems={true}
 * />
 * ```
 */
export const SupportCard: React.FC<SharedSupportCardProps> = ({ 
  items,
  onItemPress,
  theme, 
  t,
  testID: _testID,
  showDefaultItems = true
}) => {
  const defaultItems: SupportItem[] = [
    {
      id: 'help',
      type: 'help',
      label: t('profile.accountScreen.support.help'),
      description: t('profile.accountScreen.support.helpDesc'),
      icon: 'help-circle',
    },
    {
      id: 'contact',
      type: 'contact',
      label: t('profile.accountScreen.support.contact'),
      description: t('profile.accountScreen.support.contactDesc'),
      icon: 'email',
    },
    {
      id: 'documentation',
      type: 'documentation',
      label: t('profile.accountScreen.support.documentation'),
      description: t('profile.accountScreen.support.documentationDesc'),
      icon: 'book-open',
    },
    {
      id: 'community',
      type: 'community',
      label: t('profile.accountScreen.support.community'),
      description: t('profile.accountScreen.support.communityDesc'),
      icon: 'forum',
    }
  ];

  const supportItems = items || (showDefaultItems ? defaultItems : []);

  const handleSupportItemPress = (item: SupportItem) => {
    if (onItemPress) {
      onItemPress(item);
    } else {
      // Default actions
      switch (item.type) {
        case 'help':
          console.log('Navigate to help center');
          break;
        case 'contact':
          console.log('Navigate to contact support');
          break;
        case 'documentation':
          console.log('Navigate to documentation');
          break;
        case 'community':
          console.log('Navigate to community');
          break;
        default:
          console.log('Unknown support action:', item.id);
      }
    }
  };

  return (
    <SupportCardContent
      items={supportItems}
      onItemPress={handleSupportItemPress}
      theme={theme}
      t={t}
    />
  );
};

export default SupportCard; 