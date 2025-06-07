/**
 * @fileoverview CARD-TYPES: Comprehensive Type Definitions for Card Components
 * @description Enterprise-grade type definitions for reusable card component system
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards.Types
 * @namespace Shared.Components.Cards.Types
 * @category Components
 * @subcategory Cards
 */

import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { MD3Theme } from 'react-native-paper';

/**
 * Base interface for all card components.
 * Provides common properties that all card types should support.
 * 
 * @interface BaseCardProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Types
 * @subcategory Base
 * 
 * @example
 * ```tsx
 * const myCard: BaseCardProps = {
 *   title: "My Card",
 *   subtitle: "Card description",
 *   elevated: true
 * };
 * ```
 */
export interface BaseCardProps {
  /**
   * Main title displayed in the card header.
   * 
   * @type {string}
   * @optional
   * @example "User Settings"
   */
  title?: string;

  /**
   * Secondary text displayed below the title.
   * 
   * @type {string}
   * @optional
   * @example "Manage your account preferences"
   */
  subtitle?: string;

  /**
   * Child elements to render within the card.
   * 
   * @type {React.ReactNode}
   * @optional
   * @example
   * ```tsx
   * <BaseCard>
   *   <Text>Card content</Text>
   * </BaseCard>
   * ```
   */
  children?: React.ReactNode;

  /**
   * Theme object for consistent styling.
   * 
   * @type {MD3Theme}
   * @optional
   * @default Current theme from provider
   */
  theme?: MD3Theme;

  /**
   * Custom styling for the card container.
   * 
   * @type {ViewStyle}
   * @optional
   * @example { marginVertical: 10, backgroundColor: '#f0f0f0' }
   */
  style?: ViewStyle;

  /**
   * Custom styling for the card content area.
   * 
   * @type {ViewStyle}
   * @optional
   * @example { padding: 16, backgroundColor: 'white' }
   */
  contentStyle?: ViewStyle;

  /**
   * Test identifier for automated testing.
   * 
   * @type {string}
   * @optional
   * @example "user-settings-card"
   */
  testID?: string;

  /**
   * Whether the card should have elevated appearance with shadow.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  elevated?: boolean;

  /**
   * Whether to use compact layout with reduced spacing.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  compact?: boolean;
}

/**
 * Props interface for card content wrapper components.
 * Used for components that only wrap content without additional features.
 * 
 * @interface CardContentProps
 * @since 1.0.0
 * @category Types
 * @subcategory Content
 * 
 * @example
 * ```tsx
 * <CardContent style={{ padding: 20 }}>
 *   <Text>Content here</Text>
 * </CardContent>
 * ```
 */
export interface CardContentProps {
  /**
   * Content to display within the card content area.
   * 
   * @type {React.ReactNode}
   * @required
   */
  children: React.ReactNode;

  /**
   * Custom styling for the content container.
   * 
   * @type {ViewStyle}
   * @optional
   */
  style?: ViewStyle;
}

/**
 * Props interface for info cards displaying key-value information.
 * Extends BaseCardProps with information-specific properties.
 * 
 * @interface InfoCardProps
 * @extends BaseCardProps
 * @since 1.0.0
 * @category Types
 * @subcategory Specialized
 * 
 * @example
 * ```tsx
 * <InfoCard
 *   title="Storage Usage"
 *   icon="storage"
 *   value="75%"
 *   description="8.5 GB of 12 GB used"
 *   trend="up"
 *   trendValue="+5%"
 * />
 * ```
 */
export interface InfoCardProps extends BaseCardProps {
  /**
   * Icon name to display alongside the information.
   * 
   * @type {string}
   * @optional
   * @example "storage" | "user" | "settings"
   */
  icon?: string;

  /**
   * Color for the icon display.
   * 
   * @type {string}
   * @optional
   * @example "#4CAF50" | "primary" | "error"
   */
  iconColor?: string;

  /**
   * Primary value to display prominently.
   * 
   * @type {string | number}
   * @optional
   * @example "75%" | 1234 | "Active"
   */
  value?: string | number;

  /**
   * Additional descriptive text about the value.
   * 
   * @type {string}
   * @optional
   * @example "8.5 GB of 12 GB used"
   */
  description?: string;

  /**
   * Trend direction for the value.
   * 
   * @type {'up' | 'down' | 'neutral'}
   * @optional
   * @example "up"
   */
  trend?: 'up' | 'down' | 'neutral';

  /**
   * Percentage or value representing the trend change.
   * 
   * @type {string}
   * @optional
   * @example "+5%" | "-2.3%" | "stable"
   */
  trendValue?: string;
}

/**
 * Props interface for action cards containing interactive elements.
 * Extends BaseCardProps with action-specific properties.
 * 
 * @interface ActionCardProps
 * @extends BaseCardProps
 * @since 1.0.0
 * @category Types
 * @subcategory Interactive
 * 
 * @example
 * ```tsx
 * <ActionCard
 *   title="Account Actions"
 *   actions={[
 *     { id: 'edit', label: 'Edit Profile', icon: 'edit' },
 *     { id: 'delete', label: 'Delete Account', icon: 'delete' }
 *   ]}
 *   onActionPress={(actionId) => handleAction(actionId)}
 * />
 * ```
 */
export interface ActionCardProps extends BaseCardProps {
  /**
   * Array of actions available in the card.
   * 
   * @type {ActionItem[]}
   * @required
   * @example
   * ```tsx
   * [
   *   { id: 'edit', label: 'Edit', icon: 'edit' },
   *   { id: 'delete', label: 'Delete', icon: 'delete' }
   * ]
   * ```
   */
  actions: ActionItem[];

  /**
   * Callback function executed when an action is pressed.
   * 
   * @type {(actionId: string) => void}
   * @optional
   * @param {string} actionId - The ID of the pressed action
   * @example (actionId) => console.log(`Action ${actionId} pressed`)
   */
  onActionPress?: (actionId: string) => void;

  /**
   * Accessibility role for the card.
   * 
   * @type {string}
   * @optional
   * @default "group"
   * @example "menu" | "toolbar" | "group"
   */
  accessibilityRole?: string;

  /**
   * Accessibility label for screen readers.
   * 
   * @type {string}
   * @optional
   * @example "Account actions menu"
   */
  accessibilityLabel?: string;
}

/**
 * Props interface for statistics cards displaying multiple data points.
 * Extends BaseCardProps with statistics-specific properties.
 * 
 * @interface StatsCardProps
 * @extends BaseCardProps
 * @since 1.0.0
 * @category Types
 * @subcategory Data
 * 
 * @example
 * ```tsx
 * <StatsCard
 *   title="Usage Statistics"
 *   stats={[
 *     { id: 'users', label: 'Active Users', value: 1234 },
 *     { id: 'sessions', label: 'Sessions', value: 5678 }
 *   ]}
 *   layout="grid"
 * />
 * ```
 */
export interface StatsCardProps extends BaseCardProps {
  /**
   * Array of statistical items to display.
   * 
   * @type {StatItem[]}
   * @required
   * @example
   * ```tsx
   * [
   *   { id: 'users', label: 'Users', value: 1234, trend: 'up' },
   *   { id: 'revenue', label: 'Revenue', value: '$5,678' }
   * ]
   * ```
   */
  stats: StatItem[];

  /**
   * Layout style for displaying the statistics.
   * 
   * @type {'horizontal' | 'vertical' | 'grid'}
   * @optional
   * @default 'vertical'
   * @example "grid"
   */
  layout?: 'horizontal' | 'vertical' | 'grid';
}

/**
 * Props interface for danger cards requiring special attention.
 * Extends BaseCardProps with danger-specific properties.
 * 
 * @interface DangerCardProps
 * @extends BaseCardProps
 * @since 1.0.0
 * @category Types
 * @subcategory Critical
 * 
 * @example
 * ```tsx
 * <DangerCard
 *   title="Delete Account"
 *   dangerLevel="critical"
 *   confirmationRequired={true}
 *   warningText="This action cannot be undone"
 *   confirmText="DELETE"
 *   onConfirm={handleDeleteAccount}
 * />
 * ```
 */
export interface DangerCardProps extends BaseCardProps {
  /**
   * Level of danger/severity for the action.
   * 
   * @type {'low' | 'medium' | 'high' | 'critical'}
   * @optional
   * @default 'medium'
   * @example "critical"
   */
  dangerLevel?: 'low' | 'medium' | 'high' | 'critical';

  /**
   * Whether confirmation is required before executing the action.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  confirmationRequired?: boolean;

  /**
   * Callback function executed when confirmation is given.
   * 
   * @type {() => void}
   * @optional
   * @example () => deleteAccount()
   */
  onConfirm?: () => void;

  /**
   * Text to display on the confirmation button.
   * 
   * @type {string}
   * @optional
   * @default "Confirm"
   * @example "DELETE ACCOUNT"
   */
  confirmText?: string;

  /**
   * Warning text to display to the user.
   * 
   * @type {string}
   * @optional
   * @example "This action cannot be undone and will permanently delete your account"
   */
  warningText?: string;

  /**
   * Translation function for internationalization.
   * 
   * @type {(key: string, options?: any) => string}
   * @optional
   * @example (key) => i18n.t(key)
   */
  t?: (key: string, options?: any) => string;
}

/**
 * Interface for individual action items within action cards.
 * Defines the structure of clickable actions.
 * 
 * @interface ActionItem
 * @since 1.0.0
 * @category Types
 * @subcategory Items
 * 
 * @example
 * ```tsx
 * const editAction: ActionItem = {
 *   id: 'edit-profile',
 *   label: 'Edit Profile',
 *   description: 'Modify your profile information',
 *   icon: 'edit',
 *   primary: true
 * };
 * ```
 */
export interface ActionItem {
  /**
   * Unique identifier for the action.
   * 
   * @type {string}
   * @required
   * @example "edit-profile" | "delete-account" | "change-password"
   */
  id: string;

  /**
   * Display text for the action.
   * 
   * @type {string}
   * @required
   * @example "Edit Profile" | "Delete Account"
   */
  label: string;

  /**
   * Additional descriptive text for the action.
   * 
   * @type {string}
   * @optional
   * @example "Modify your profile information and settings"
   */
  description?: string;

  /**
   * Icon name to display with the action.
   * 
   * @type {string}
   * @optional
   * @example "edit" | "delete" | "settings"
   */
  icon?: string;

  /**
   * Color for the action icon.
   * 
   * @type {string}
   * @optional
   * @example "#4CAF50" | "primary" | "error"
   */
  iconColor?: string;

  /**
   * Whether the action is currently disabled.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  disabled?: boolean;

  /**
   * Test identifier for the action.
   * 
   * @type {string}
   * @optional
   * @example "edit-profile-action"
   */
  testID?: string;

  /**
   * Accessibility label for screen readers.
   * 
   * @type {string}
   * @optional
   * @example "Edit your profile information"
   */
  accessibilityLabel?: string;

  /**
   * Accessibility hint providing usage guidance.
   * 
   * @type {string}
   * @optional
   * @example "Double tap to edit your profile"
   */
  accessibilityHint?: string;

  /**
   * Whether this is a primary action (emphasized styling).
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  primary?: boolean;
}

/**
 * Interface for statistical data items in stats cards.
 * Defines the structure of statistical information display.
 * 
 * @interface StatItem
 * @since 1.0.0
 * @category Types
 * @subcategory Items
 * 
 * @example
 * ```tsx
 * const userStat: StatItem = {
 *   id: 'active-users',
 *   label: 'Active Users',
 *   value: 1234,
 *   icon: 'users',
 *   trend: 'up',
 *   trendValue: '+12%'
 * };
 * ```
 */
export interface StatItem {
  /**
   * Unique identifier for the statistic.
   * 
   * @type {string}
   * @required
   * @example "active-users" | "total-revenue" | "conversion-rate"
   */
  id: string;

  /**
   * Display label for the statistic.
   * 
   * @type {string}
   * @required
   * @example "Active Users" | "Total Revenue" | "Conversion Rate"
   */
  label: string;

  /**
   * The statistical value to display.
   * 
   * @type {string | number}
   * @required
   * @example 1234 | "75%" | "$12,345"
   */
  value: string | number;

  /**
   * Icon name to display with the statistic.
   * 
   * @type {string}
   * @optional
   * @example "users" | "dollar-sign" | "trending-up"
   */
  icon?: string;

  /**
   * Color for the statistic icon.
   * 
   * @type {string}
   * @optional
   * @example "#4CAF50" | "primary" | "success"
   */
  iconColor?: string;

  /**
   * Trend direction for the statistic.
   * 
   * @type {'up' | 'down' | 'neutral'}
   * @optional
   * @example "up"
   */
  trend?: 'up' | 'down' | 'neutral';

  /**
   * Percentage or value representing the trend change.
   * 
   * @type {string}
   * @optional
   * @example "+12%" | "-5.2%" | "stable"
   */
  trendValue?: string;

  /**
   * Additional description for the statistic.
   * 
   * @type {string}
   * @optional
   * @example "Compared to last month" | "Year over year growth"
   */
  description?: string;
}

/**
 * Extended interface for support-related action items.
 * Extends ActionItem with support-specific properties.
 * 
 * @interface SupportItem
 * @extends ActionItem
 * @since 1.0.0
 * @category Types
 * @subcategory Support
 * 
 * @example
 * ```tsx
 * const helpItem: SupportItem = {
 *   id: 'user-guide',
 *   label: 'User Guide',
 *   type: 'documentation',
 *   url: 'https://docs.example.com',
 *   external: true
 * };
 * ```
 */
export interface SupportItem extends ActionItem {
  /**
   * Type of support item for categorization.
   * 
   * @type {'help' | 'contact' | 'documentation' | 'community'}
   * @required
   * @example "documentation"
   */
  type: 'help' | 'contact' | 'documentation' | 'community';

  /**
   * URL to navigate to when the item is pressed.
   * 
   * @type {string}
   * @optional
   * @example "https://docs.example.com/user-guide"
   */
  url?: string;

  /**
   * Whether the link opens in external browser.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  external?: boolean;
}

/**
 * Props interface for support card content components.
 * 
 * @interface SupportCardContentProps
 * @since 1.0.0
 * @category Types
 * @subcategory Content
 * 
 * @example
 * ```tsx
 * <SupportCardContent
 *   items={supportItems}
 *   onItemPress={handleSupportPress}
 *   t={translate}
 * />
 * ```
 */
export interface SupportCardContentProps {
  /**
   * Array of support items to display.
   * 
   * @type {SupportItem[]}
   * @required
   */
  items: SupportItem[];

  /**
   * Callback function when a support item is pressed.
   * 
   * @type {(item: SupportItem) => void}
   * @required
   * @param {SupportItem} item - The pressed support item
   */
  onItemPress: (item: SupportItem) => void;

  /**
   * Theme object for styling.
   * 
   * @type {MD3Theme}
   * @optional
   */
  theme?: MD3Theme;

  /**
   * Translation function for internationalization.
   * 
   * @type {(key: string, options?: any) => string}
   * @required
   * @param {string} key - Translation key
   * @param {any} options - Translation options
   */
  t: (key: string, options?: any) => string;
}

/**
 * Extended interface for security-related statistical items.
 * Extends StatItem with security-specific properties.
 * 
 * @interface SecurityItem
 * @extends StatItem
 * @since 1.0.0
 * @category Types
 * @subcategory Security
 * 
 * @example
 * ```tsx
 * const loginAttempts: SecurityItem = {
 *   id: 'failed-logins',
 *   label: 'Failed Logins',
 *   value: 3,
 *   type: 'attempts',
 *   status: 'warning',
 *   lastUpdated: new Date()
 * };
 * ```
 */
export interface SecurityItem extends StatItem {
  /**
   * Type of security metric being displayed.
   * 
   * @type {'login' | 'sessions' | 'mfa' | 'devices' | 'attempts'}
   * @required
   * @example "login"
   */
  type: 'login' | 'sessions' | 'mfa' | 'devices' | 'attempts';

  /**
   * Security status indicator.
   * 
   * @type {'secure' | 'warning' | 'danger'}
   * @optional
   * @example "secure"
   */
  status?: 'secure' | 'warning' | 'danger';

  /**
   * Timestamp of when this metric was last updated.
   * 
   * @type {Date}
   * @optional
   * @example new Date('2024-01-15T10:30:00Z')
   */
  lastUpdated?: Date;
}

/**
 * Props interface for security card content components.
 * 
 * @interface SecurityCardContentProps
 * @since 1.0.0
 * @category Types
 * @subcategory Content
 * 
 * @example
 * ```tsx
 * <SecurityCardContent
 *   items={securityMetrics}
 *   onItemPress={handleSecurityItemPress}
 *   t={translate}
 * />
 * ```
 */
export interface SecurityCardContentProps {
  /**
   * Array of security items to display.
   * 
   * @type {SecurityItem[]}
   * @required
   */
  items: SecurityItem[];

  /**
   * Callback function when a security item is pressed.
   * 
   * @type {(item: SecurityItem) => void}
   * @optional
   * @param {SecurityItem} item - The pressed security item
   */
  onItemPress?: (item: SecurityItem) => void;

  /**
   * Theme object for styling.
   * 
   * @type {MD3Theme}
   * @optional
   */
  theme?: MD3Theme;

  /**
   * Translation function for internationalization.
   * 
   * @type {(key: string, options?: any) => string}
   * @required
   * @param {string} key - Translation key
   * @param {any} options - Translation options
   */
  t: (key: string, options?: any) => string;
}

/**
 * Extended interface for data statistics items.
 * Extends StatItem with data-specific properties.
 * 
 * @interface DataStatsItem
 * @extends StatItem
 * @since 1.0.0
 * @category Types
 * @subcategory Data
 * 
 * @example
 * ```tsx
 * const storageUsage: DataStatsItem = {
 *   id: 'storage-used',
 *   label: 'Storage Used',
 *   value: 8.5,
 *   type: 'storage',
 *   unit: 'GB',
 *   limit: 15,
 *   percentage: 57
 * };
 * ```
 */
export interface DataStatsItem extends StatItem {
  /**
   * Type of data metric being measured.
   * 
   * @type {'usage' | 'backup' | 'devices' | 'storage' | 'bandwidth'}
   * @required
   * @example "storage"
   */
  type: 'usage' | 'backup' | 'devices' | 'storage' | 'bandwidth';

  /**
   * Unit of measurement for the value.
   * 
   * @type {string}
   * @optional
   * @example "GB" | "MB/s" | "hours" | "%"
   */
  unit?: string;

  /**
   * Maximum limit for this metric.
   * 
   * @type {number}
   * @optional
   * @example 15 (for 15GB storage limit)
   */
  limit?: number;

  /**
   * Percentage of limit used (0-100).
   * 
   * @type {number}
   * @optional
   * @example 57 (for 57% of limit used)
   */
  percentage?: number;
}

/**
 * Props interface for data statistics card content components.
 * 
 * @interface DataStatsContentProps
 * @since 1.0.0
 * @category Types
 * @subcategory Content
 * 
 * @example
 * ```tsx
 * <DataStatsContent
 *   items={dataMetrics}
 *   onExportData={handleExport}
 *   isExporting={isLoading}
 *   t={translate}
 * />
 * ```
 */
export interface DataStatsContentProps {
  /**
   * Array of data statistics to display.
   * 
   * @type {DataStatsItem[]}
   * @required
   */
  items: DataStatsItem[];

  /**
   * Callback function for data export functionality.
   * 
   * @type {() => void}
   * @optional
   * @example () => exportUserData()
   */
  onExportData?: () => void;

  /**
   * Whether data export is currently in progress.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  isExporting?: boolean;

  /**
   * Theme object for styling.
   * 
   * @type {MD3Theme}
   * @optional
   */
  theme?: MD3Theme;

  /**
   * Translation function for internationalization.
   * 
   * @type {(key: string, options?: any) => string}
   * @required
   * @param {string} key - Translation key
   * @param {any} options - Translation options
   */
  t: (key: string, options?: any) => string;
}

/**
 * Style definitions for card components.
 * Provides consistent styling structure across all card types.
 * 
 * @interface CardStyles
 * @since 1.0.0
 * @category Types
 * @subcategory Styling
 * 
 * @example
 * ```tsx
 * const styles: CardStyles = {
 *   container: { borderRadius: 8, padding: 16 },
 *   content: { flex: 1 },
 *   // ... other styles
 * };
 * ```
 */
export interface CardStyles {
  /**
   * Main container styling for the card.
   * 
   * @type {ViewStyle}
   * @example { borderRadius: 8, backgroundColor: 'white', elevation: 2 }
   */
  container: ViewStyle;

  /**
   * Content area styling within the card.
   * 
   * @type {ViewStyle}
   * @example { padding: 16, flex: 1 }
   */
  content: ViewStyle;

  /**
   * Header section styling.
   * 
   * @type {ViewStyle}
   * @example { marginBottom: 12, borderBottomWidth: 1 }
   */
  header: ViewStyle;

  /**
   * Title text styling.
   * 
   * @type {TextStyle}
   * @example { fontSize: 18, fontWeight: 'bold' }
   */
  title: TextStyle;

  /**
   * Subtitle text styling.
   * 
   * @type {TextStyle}
   * @example { fontSize: 14, opacity: 0.7 }
   */
  subtitle: TextStyle;

  /**
   * Body content styling.
   * 
   * @type {ViewStyle}
   * @example { marginVertical: 8 }
   */
  body: ViewStyle;

  /**
   * Footer section styling.
   * 
   * @type {ViewStyle}
   * @example { marginTop: 16, borderTopWidth: 1 }
   */
  footer: ViewStyle;

  /**
   * Divider line styling.
   * 
   * @type {ViewStyle}
   * @example { height: 1, backgroundColor: '#e0e0e0' }
   */
  divider: ViewStyle;

  /**
   * Elevated card variant styling.
   * 
   * @type {ViewStyle}
   * @example { elevation: 4, shadowRadius: 8 }
   */
  elevated: ViewStyle;

  /**
   * Compact card variant styling.
   * 
   * @type {ViewStyle}
   * @example { padding: 8, marginVertical: 4 }
   */
  compact: ViewStyle;
}

/**
 * Theme override options for customizing card appearance.
 * Allows fine-tuning of card styling beyond default theme.
 * 
 * @interface CardThemeOverrides
 * @since 1.0.0
 * @category Types
 * @subcategory Theming
 * 
 * @example
 * ```tsx
 * const overrides: CardThemeOverrides = {
 *   colors: {
 *     cardBackground: '#f5f5f5',
 *     dangerBackground: '#ffebee'
 *   },
 *   spacing: {
 *     cardPadding: 20
 *   }
 * };
 * ```
 */
export interface CardThemeOverrides {
  /**
   * Color overrides for card components.
   * 
   * @type {object}
   * @optional
   */
  colors?: {
    /**
     * Background color for standard cards.
     * 
     * @type {string}
     * @optional
     * @example '#ffffff' | '#f5f5f5'
     */
    cardBackground?: string;

    /**
     * Border color for outlined cards.
     * 
     * @type {string}
     * @optional
     * @example '#e0e0e0' | '#cccccc'
     */
    cardBorder?: string;

    /**
     * Shadow color for elevated cards.
     * 
     * @type {string}
     * @optional
     * @example '#000000' | 'rgba(0,0,0,0.1)'
     */
    cardShadow?: string;

    /**
     * Background color for danger/critical cards.
     * 
     * @type {string}
     * @optional
     * @example '#ffebee' | '#fce4ec'
     */
    dangerBackground?: string;

    /**
     * Border color for danger/critical cards.
     * 
     * @type {string}
     * @optional
     * @example '#f44336' | '#e91e63'
     */
    dangerBorder?: string;

    /**
     * Background color for warning cards.
     * 
     * @type {string}
     * @optional
     * @example '#fff3e0' | '#fefefe'
     */
    warningBackground?: string;

    /**
     * Border color for warning cards.
     * 
     * @type {string}
     * @optional
     * @example '#ff9800' | '#ffc107'
     */
    warningBorder?: string;
  };

  /**
   * Spacing overrides for card layout.
   * 
   * @type {object}
   * @optional
   */
  spacing?: {
    /**
     * Main padding for card containers.
     * 
     * @type {number}
     * @optional
     * @example 16 | 20 | 24
     */
    cardPadding?: number;

    /**
     * Padding for card content areas.
     * 
     * @type {number}
     * @optional
     * @example 12 | 16 | 20
     */
    contentPadding?: number;

    /**
     * Spacing between card items.
     * 
     * @type {number}
     * @optional
     * @example 8 | 12 | 16
     */
    itemSpacing?: number;
  };

  /**
   * Typography overrides for card text.
   * 
   * @type {object}
   * @optional
   */
  typography?: {
    /**
     * Font size for card titles.
     * 
     * @type {number}
     * @optional
     * @example 18 | 20 | 22
     */
    titleSize?: number;

    /**
     * Font size for card subtitles.
     * 
     * @type {number}
     * @optional
     * @example 14 | 16 | 18
     */
    subtitleSize?: number;

    /**
     * Font size for card body text.
     * 
     * @type {number}
     * @optional
     * @example 14 | 15 | 16
     */
    bodySize?: number;
  };
}

/**
 * Available card visual variants.
 * Defines the different styling approaches for cards.
 * 
 * @type CardVariant
 * @since 1.0.0
 * @category Types
 * @subcategory Variants
 * 
 * @example
 * ```tsx
 * const variant: CardVariant = 'elevated';
 * <Card variant={variant} />
 * ```
 */
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

/**
 * Available card size options.
 * Defines the different sizing options for cards.
 * 
 * @type CardSize
 * @since 1.0.0
 * @category Types
 * @subcategory Sizing
 * 
 * @example
 * ```tsx
 * const size: CardSize = 'large';
 * <Card size={size} />
 * ```
 */
export type CardSize = 'small' | 'medium' | 'large';

/**
 * Available card layout options.
 * Defines the different layout arrangements for card content.
 * 
 * @type CardLayout
 * @since 1.0.0
 * @category Types
 * @subcategory Layout
 * 
 * @example
 * ```tsx
 * const layout: CardLayout = 'grid';
 * <StatsCard layout={layout} />
 * ```
 */
export type CardLayout = 'vertical' | 'horizontal' | 'grid'; 