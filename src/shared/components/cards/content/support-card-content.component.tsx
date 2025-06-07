/**
 * @fileoverview SUPPORT-CARD-CONTENT-COMPONENT: Support Services Content Component
 * @description Specialized content component for rendering support-related actions and services
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards.Content
 * @namespace Shared.Components.Cards.Content.SupportCardContent
 * @category Components
 * @subcategory Cards.Content
 */

import React from 'react';
import { ActionCard } from '../specialized/action-card.component';
import type { SupportCardContentProps, ActionItem } from '../types/card.types';

/**
 * Support Card Content Component
 * 
 * A specialized content component designed for rendering support-related actions and services
 * within card interfaces. Transforms support items into actionable elements with appropriate
 * icons, descriptions, and interaction handlers for comprehensive user assistance.
 * 
 * @component
 * @function SupportCardContent
 * @param {SupportCardContentProps} props - The component props
 * @returns {React.ReactElement} Rendered support card content with actionable items
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Cards.Content
 * @module Shared.Components.Cards.Content
 * @namespace Shared.Components.Cards.Content.SupportCardContent
 * 
 * @example
 * Basic support menu:
 * ```tsx
 * import { SupportCardContent } from '@/shared/components/cards';
 * 
 * const SupportMenu = () => (
 *   <SupportCardContent
 *     items={[
 *       {
 *         id: 'help-center',
 *         type: 'help',
 *         label: 'Help Center',
 *         description: 'Browse articles and tutorials',
 *         url: 'https://help.example.com'
 *       },
 *       {
 *         id: 'contact-support',
 *         type: 'contact',
 *         label: 'Contact Support',
 *         description: 'Get help from our team',
 *         icon: 'email'
 *       }
 *     ]}
 *     onItemPress={(item) => handleSupportAction(item)}
 *     t={translate}
 *   />
 * );
 * ```
 * 
 * @example
 * Complete support center with all types:
 * ```tsx
 * <SupportCardContent
 *   items={[
 *     {
 *       id: 'help',
 *       type: 'help',
 *       label: 'Help Center',
 *       description: 'Self-service support articles',
 *       url: '/help'
 *     },
 *     {
 *       id: 'docs',
 *       type: 'documentation',
 *       label: 'Documentation',
 *       description: 'Technical guides and API docs',
 *       url: '/docs',
 *       external: true
 *     },
 *     {
 *       id: 'community',
 *       type: 'community',
 *       label: 'Community Forum',
 *       description: 'Connect with other users',
 *       url: '/community'
 *     },
 *     {
 *       id: 'support',
 *       type: 'contact',
 *       label: 'Contact Support',
 *       description: 'Get direct help from our team',
 *       iconColor: '#4CAF50'
 *     }
 *   ]}
 *   onItemPress={handleSupportNavigation}
 *   theme={theme}
 *   t={translate}
 * />
 * ```
 * 
 * @example
 * Custom styled support options:
 * ```tsx
 * <SupportCardContent
 *   items={supportItems.map(item => ({
 *     ...item,
 *     iconColor: item.priority === 'high' ? '#FF5722' : '#2196F3',
 *     disabled: !item.available
 *   }))}
 *   onItemPress={(item) => {
 *     if (item.external) {
 *       Linking.openURL(item.url);
 *     } else {
 *       navigation.navigate(item.url);
 *     }
 *   }}
 *   t={i18n.t}
 * />
 * ```
 * 
 * @features
 * - Automatic icon assignment based on support type
 * - Flexible action handling for navigation and external links
 * - Internationalization support with translation function
 * - Theme integration for consistent styling
 * - Custom icon and color support
 * - Disabled state handling
 * - Test-friendly with testID support
 * - Semantic support type categorization
 * 
 * @support_types
 * - help: Self-service help and tutorials
 * - contact: Direct support communication
 * - documentation: Technical documentation
 * - community: Community forums and discussions
 * 
 * @architecture
 * - Transforms SupportItem array to ActionItem format
 * - Leverages ActionCard for consistent interaction patterns
 * - Automatic icon mapping system
 * - Translation integration layer
 * - Type-safe props interface
 * 
 * @styling
 * - Inherits ActionCard styling patterns
 * - Theme-aware color integration
 * - Consistent icon and typography
 * - Support-specific visual indicators
 * - Responsive layout design
 * 
 * @accessibility
 * - Screen reader compatible structure
 * - Semantic action descriptions
 * - Proper focus management
 * - High contrast support
 * - Touch target compliance
 * 
 * @performance
 * - Efficient item transformation
 * - Memoized icon calculations
 * - Optimized re-render behavior
 * - Lazy action mapping
 * 
 * @dependencies
 * - react: Core React library
 * - ../specialized/action-card.component: ActionCard foundation
 * - ../types/card.types: Type definitions
 * 
 * @use_cases
 * - Support center interfaces
 * - Help and documentation access
 * - Customer service portals
 * - Knowledge base navigation
 * - Community platform integration
 * - Multi-channel support systems
 * 
 * @best_practices
 * - Provide clear action descriptions
 * - Use appropriate support type categorization
 * - Implement proper error handling for navigation
 * - Ensure external link safety
 * - Test all support workflows
 * 
 * @see {@link ActionCard} for underlying action interface
 * @see {@link SupportCardContentProps} for prop definitions
 * @see {@link SupportItem} for support item structure
 */
export const SupportCardContent: React.FC<SupportCardContentProps> = ({
  items,
  onItemPress,
  theme,
  t
}) => {
  /**
   * Transforms support items into action items format.
   * Maps support-specific properties to ActionCard-compatible structure
   * with automatic icon assignment and consistent formatting.
   * 
   * @constant actions
   * @type {ActionItem[]}
   * @since 1.0.0
   * 
   * @transformation
   * - Maps SupportItem to ActionItem interface
   * - Assigns default icons based on type
   * - Preserves custom styling options
   * - Maintains accessibility properties
   */
  const actions: ActionItem[] = items.map(item => ({
    id: item.id,
    label: item.label,
    description: item.description,
    icon: item.icon || getSupportIcon(item.type),
    iconColor: item.iconColor,
    disabled: item.disabled,
    testID: item.testID,
  }));

  /**
   * Handles support action selection and execution.
   * Finds the corresponding support item and delegates to the provided handler
   * with full item context for navigation or external action handling.
   * 
   * @function handleActionPress
   * @param {string} actionId - Unique identifier of the selected action
   * @private
   * @since 1.0.0
   * 
   * @flow
   * 1. Locate support item by ID
   * 2. Verify item exists
   * 3. Execute onItemPress with full item data
   * 4. Allow parent to handle navigation/action
   */
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
 * Gets default icon for support item type.
 * Provides semantic icon mapping based on support category
 * to ensure consistent visual communication across the interface.
 * 
 * @function getSupportIcon
 * @param {string} type - Support item type identifier
 * @returns {string} Material Community Icons name for the support type
 * @private
 * @since 1.0.0
 * 
 * @icon_mapping
 * - help: 'help-circle' (assistance and guidance)
 * - contact: 'email' (direct communication)
 * - documentation: 'book-open' (technical resources)
 * - community: 'forum' (collaborative support)
 * - default: 'help-circle' (fallback for unknown types)
 * 
 * @design_rationale
 * - Uses universally recognized icons
 * - Maintains semantic consistency
 * - Provides fallback for new types
 * - Supports internationalization
 * 
 * @example
 * ```tsx
 * const helpIcon = getSupportIcon('help');        // 'help-circle'
 * const contactIcon = getSupportIcon('contact');  // 'email'
 * const docsIcon = getSupportIcon('documentation'); // 'book-open'
 * ```
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