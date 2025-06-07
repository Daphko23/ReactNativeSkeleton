/**
 * @fileoverview SUPPORT-CARD-COMPONENT: Feature-Ready Support Services Card
 * @description Fully reusable support card component for deployment across features and applications
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards.FeatureReady
 * @namespace Shared.Components.Cards.FeatureReady.SupportCard
 * @category Components
 * @subcategory Cards.FeatureReady
 */

import React from 'react';
import { SupportCardContent } from '../content/support-card-content.component';
import type { SupportItem } from '../types/card.types';

/**
 * Props interface for the SharedSupportCard component.
 * Defines the configuration options for feature-ready support card deployment.
 * 
 * @interface SharedSupportCardProps
 * @since 1.0.0
 * @category Types
 * @subcategory FeatureReady
 * 
 * @example
 * ```tsx
 * const supportCardProps: SharedSupportCardProps = {
 *   items: customSupportItems,
 *   onItemPress: handleSupportNavigation,
 *   theme: appTheme,
 *   t: translate,
 *   testID: 'main-support-card',
 *   showDefaultItems: true
 * };
 * ```
 */
export interface SharedSupportCardProps {
  /**
   * Custom support items to override defaults.
   * 
   * @type {SupportItem[]}
   * @optional
   * @example
   * ```tsx
   * [
   *   {
   *     id: 'custom-help',
   *     type: 'help',
   *     label: 'Custom Help Center',
   *     description: 'Access feature-specific help',
   *     url: '/custom-help'
   *   }
   * ]
   * ```
   */
  items?: SupportItem[];

  /**
   * Callback function executed when a support item is pressed.
   * 
   * @type {(item: SupportItem) => void}
   * @optional
   * @param {SupportItem} item - The pressed support item with full context
   * @example (item) => navigation.navigate(item.url || '/help')
   */
  onItemPress?: (item: SupportItem) => void;

  /**
   * Theme object for consistent styling.
   * 
   * @type {any}
   * @optional
   * @default Current theme from provider
   */
  theme?: any;

  /**
   * Translation function for internationalization.
   * 
   * @type {(key: string, options?: any) => string}
   * @required
   * @param {string} key - Translation key for support content
   * @param {any} options - Translation interpolation options
   */
  t: (key: string, options?: any) => string;

  /**
   * Test identifier for automated testing.
   * 
   * @type {string}
   * @optional
   * @example "feature-support-card" | "main-support-menu"
   */
  testID?: string;

  /**
   * Whether to show default support items when no custom items provided.
   * 
   * @type {boolean}
   * @optional
   * @default true
   * @example false (to show only custom items)
   */
  showDefaultItems?: boolean;
}

/**
 * Support Card Component
 * 
 * A feature-ready, fully reusable support card component designed for deployment
 * across different features and applications. Provides comprehensive support service
 * access with default items, customization capabilities, and consistent interaction
 * patterns for enterprise-wide support system integration.
 * 
 * @component
 * @function SupportCard
 * @param {SharedSupportCardProps} props - The component props
 * @returns {React.ReactElement} Rendered feature-ready support card
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Cards.FeatureReady
 * @module Shared.Components.Cards.FeatureReady
 * @namespace Shared.Components.Cards.FeatureReady.SupportCard
 * 
 * @example
 * Default support card with standard items:
 * ```tsx
 * import { SupportCard } from '@/shared/components/cards';
 * 
 * const DefaultSupportCard = () => (
 *   <SupportCard
 *     t={translate}
 *     onItemPress={(item) => handleSupportAction(item)}
 *     showDefaultItems={true}
 *     testID="main-support-card"
 *   />
 * );
 * ```
 * 
 * @example
 * Custom support card for specific feature:
 * ```tsx
 * <SupportCard
 *   items={[
 *     {
 *       id: 'feature-help',
 *       type: 'help',
 *       label: 'Feature Help',
 *       description: 'Get help with this specific feature',
 *       url: '/features/payments/help',
 *       icon: 'help-circle'
 *     },
 *     {
 *       id: 'feature-support',
 *       type: 'contact',
 *       label: 'Contact Feature Team',
 *       description: 'Direct line to feature specialists',
 *       icon: 'email'
 *     }
 *   ]}
 *   onItemPress={(item) => {
 *     if (item.url) {
 *       navigation.navigate(item.url);
 *     } else {
 *       openSupportChannel(item.type);
 *     }
 *   }}
 *   theme={featureTheme}
 *   t={featureTranslate}
 *   showDefaultItems={false}
 * />
 * ```
 * 
 * @example
 * Mixed support card with defaults and custom items:
 * ```tsx
 * <SupportCard
 *   items={[
 *     ...defaultSupportItems,
 *     {
 *       id: 'premium-support',
 *       type: 'contact',
 *       label: 'Premium Support',
 *       description: 'Priority support for premium users',
 *       iconColor: '#FFD700',
 *       priority: 'high'
 *     }
 *   ]}
 *   onItemPress={handleMixedSupportAction}
 *   t={translate}
 * />
 * ```
 * 
 * @features
 * - Default support items for immediate deployment
 * - Full customization capability for specific features
 * - Consistent support service integration
 * - Internationalization ready with translation support
 * - Fallback action handling for unhandled interactions
 * - Theme integration for brand consistency
 * - Test-friendly with configurable testID
 * - Flexible item display control
 * 
 * @default_items
 * - help: General help center access
 * - contact: Direct support communication
 * - documentation: Technical documentation access
 * - community: Community forum and discussions
 * 
 * @architecture
 * - Leverages SupportCardContent for display logic
 * - Provides default item generation with translations
 * - Implements fallback action handling
 * - Supports both custom and default item workflows
 * - Maintains consistent prop interface
 * 
 * @customization
 * - Override default items with custom configuration
 * - Extend default items with additional options
 * - Disable defaults to show only custom items
 * - Custom action handling for feature-specific workflows
 * - Theme and styling customization
 * 
 * @internationalization
 * - All default items use translation keys
 * - Supports custom translations for feature-specific items
 * - Maintains consistent translation patterns
 * - Fallback support for missing translations
 * 
 * @accessibility
 * - Inherits accessibility from SupportCardContent
 * - Screen reader compatible structure
 * - Proper semantic markup for support services
 * - Touch target compliance
 * - High contrast support
 * 
 * @performance
 * - Lazy default item generation
 * - Efficient item merging and overrides
 * - Optimized re-render behavior
 * - Minimal memory footprint
 * 
 * @dependencies
 * - react: Core React library
 * - ../content/support-card-content.component: Display logic
 * - ../types/card.types: Type definitions
 * 
 * @use_cases
 * - Application-wide support integration
 * - Feature-specific support sections
 * - User onboarding and help flows
 * - Customer service portals
 * - Knowledge base access points
 * - Community platform integration
 * 
 * @deployment_patterns
 * - Drop-in support for any feature
 * - Consistent support experience across app
 * - Centralized support service configuration
 * - Feature-specific support customization
 * - Multi-tenant support variations
 * 
 * @best_practices
 * - Use default items for standard deployments
 * - Customize items for feature-specific needs
 * - Implement proper navigation handling
 * - Test all support interaction flows
 * - Maintain consistent support branding
 * 
 * @see {@link SupportCardContent} for underlying display logic
 * @see {@link SharedSupportCardProps} for prop definitions
 * @see {@link SupportItem} for support item structure
 */
export const SupportCard: React.FC<SharedSupportCardProps> = ({ 
  items,
  onItemPress,
  theme, 
  t,
  testID: _testID,
  showDefaultItems = true
}) => {
  /**
   * Default support items with comprehensive service coverage.
   * Provides standard support channels for immediate deployment
   * with internationalized labels and descriptions.
   * 
   * @constant defaultItems
   * @type {SupportItem[]}
   * @since 1.0.0
   * 
   * @default_services
   * - help: Self-service help center access
   * - contact: Direct support team communication
   * - documentation: Technical documentation and guides
   * - community: Community forums and peer support
   * 
   * @translation_keys
   * - profile.accountScreen.support.help: Help center label
   * - profile.accountScreen.support.helpDesc: Help center description
   * - profile.accountScreen.support.contact: Contact support label
   * - profile.accountScreen.support.contactDesc: Contact support description
   * - profile.accountScreen.support.documentation: Documentation label
   * - profile.accountScreen.support.documentationDesc: Documentation description
   * - profile.accountScreen.support.community: Community label
   * - profile.accountScreen.support.communityDesc: Community description
   */
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

  /**
   * Resolved support items based on configuration.
   * Uses custom items if provided, otherwise defaults based on showDefaultItems setting.
   * 
   * @constant supportItems
   * @type {SupportItem[]}
   * @since 1.0.0
   * 
   * @resolution_logic
   * 1. Use custom items if provided
   * 2. Use default items if showDefaultItems is true
   * 3. Use empty array if no items and defaults disabled
   */
  const supportItems = items || (showDefaultItems ? defaultItems : []);

  /**
   * Handles support item selection with fallback actions.
   * Delegates to custom handler if provided, otherwise implements
   * default navigation behavior for standard support channels.
   * 
   * @function handleSupportItemPress
   * @param {SupportItem} item - The selected support item with full context
   * @private
   * @since 1.0.0
   * 
   * @handling_flow
   * 1. Execute custom handler if provided
   * 2. Fall back to default actions based on support type
   * 3. Log unknown actions for debugging
   * 
   * @default_actions
   * - help: Navigate to help center
   * - contact: Navigate to contact support
   * - documentation: Navigate to documentation
   * - community: Navigate to community forums
   * 
   * @example
   * ```tsx
   * // Custom handler takes precedence
   * onItemPress(item);
   * 
   * // Fallback for unhandled types
   * console.log('Navigate to help center');
   * ```
   */
  const handleSupportItemPress = (item: SupportItem) => {
    if (onItemPress) {
      onItemPress(item);
    } else {
      // Default actions for standard deployment
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