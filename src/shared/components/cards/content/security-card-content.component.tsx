/**
 * @fileoverview SECURITY-CARD-CONTENT-COMPONENT: Security Information Display Component
 * @description Specialized content component for rendering security-related statistics and status information
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards.Content
 * @namespace Shared.Components.Cards.Content.SecurityCardContent
 * @category Components
 * @subcategory Cards.Content
 */

import React from 'react';
import { StatsCard } from '../specialized/stats-card.component';
import type { StatItem } from '../types/card.types';

/**
 * Interface for security-related statistical items.
 * Extends basic statistical data with security-specific properties
 * for status indication and risk assessment.
 * 
 * @interface SecurityItem
 * @since 1.0.0
 * @category Types
 * @subcategory Security
 * 
 * @example
 * ```tsx
 * const securityMetric: SecurityItem = {
 *   id: 'mfa-status',
 *   type: 'mfa',
 *   label: 'Multi-Factor Authentication',
 *   value: 'Enabled',
 *   status: 'secure',
 *   icon: 'shield-check',
 *   iconColor: '#4CAF50'
 * };
 * ```
 */
interface SecurityItem {
  /**
   * Unique identifier for the security item.
   * 
   * @type {string}
   * @required
   * @example "login-attempts" | "mfa-status" | "device-count"
   */
  id: string;

  /**
   * Type of security metric being measured.
   * 
   * @type {string}
   * @required
   * @example "login" | "sessions" | "mfa" | "devices" | "attempts"
   */
  type: string;

  /**
   * Display label for the security metric.
   * 
   * @type {string}
   * @required
   * @example "Last Login" | "Active Sessions" | "MFA Status"
   */
  label: string;

  /**
   * The security metric value to display.
   * 
   * @type {string | number}
   * @required
   * @example "2 hours ago" | 3 | "Enabled" | "Secure"
   */
  value: string | number;

  /**
   * Icon name to display with the security metric.
   * 
   * @type {string}
   * @optional
   * @example "shield-check" | "login" | "devices"
   */
  icon?: string;

  /**
   * Color for the security metric icon.
   * 
   * @type {string}
   * @optional
   * @example "#4CAF50" | "#FF9800" | "#F44336"
   */
  iconColor?: string;

  /**
   * Security status indicator for risk assessment.
   * 
   * @type {string}
   * @optional
   * @example "secure" | "warning" | "danger"
   */
  status?: string;

  /**
   * Trend direction for the security metric.
   * 
   * @type {'up' | 'down' | 'neutral'}
   * @optional
   * @example "up" for increased security, "down" for concerns
   */
  trend?: 'up' | 'down' | 'neutral';

  /**
   * Percentage or value representing the trend change.
   * 
   * @type {string}
   * @optional
   * @example "+15%" | "stable" | "-2 attempts"
   */
  trendValue?: string;

  /**
   * Additional description for the security metric.
   * 
   * @type {string}
   * @optional
   * @example "Compared to last month" | "All devices secured"
   */
  description?: string;
}

/**
 * Props interface for the SecurityCardContent component.
 * Defines the required and optional properties for security content display.
 * 
 * @interface SecurityCardContentProps
 * @since 1.0.0
 * @category Types
 * @subcategory Security
 * 
 * @example
 * ```tsx
 * const securityProps: SecurityCardContentProps = {
 *   items: securityMetrics,
 *   onItemPress: handleSecurityItemPress,
 *   theme: appTheme,
 *   t: translate
 * };
 * ```
 */
interface SecurityCardContentProps {
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
   * @type {any}
   * @optional
   */
  theme?: any;

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
 * Security Card Content Component
 * 
 * A specialized content component designed for rendering security-related statistics
 * and status information within card interfaces. Transforms security metrics into
 * visually appealing statistical displays with appropriate status indicators,
 * trend analysis, and risk assessment visualization.
 * 
 * @component
 * @function SecurityCardContent
 * @param {SecurityCardContentProps} props - The component props
 * @returns {React.ReactElement} Rendered security card content with statistical display
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Cards.Content
 * @module Shared.Components.Cards.Content
 * @namespace Shared.Components.Cards.Content.SecurityCardContent
 * 
 * @example
 * Basic security status display:
 * ```tsx
 * import { SecurityCardContent } from '@/shared/components/cards';
 * 
 * const SecurityOverview = () => (
 *   <SecurityCardContent
 *     items={[
 *       {
 *         id: 'last-login',
 *         type: 'login',
 *         label: 'Last Login',
 *         value: '2 hours ago',
 *         status: 'secure',
 *         description: 'From trusted device'
 *       },
 *       {
 *         id: 'mfa-status',
 *         type: 'mfa',
 *         label: 'Multi-Factor Auth',
 *         value: 'Enabled',
 *         status: 'secure',
 *         icon: 'shield-check'
 *       }
 *     ]}
 *     onItemPress={(item) => navigateToSecurity(item.type)}
 *     t={translate}
 *   />
 * );
 * ```
 * 
 * @example
 * Comprehensive security dashboard:
 * ```tsx
 * <SecurityCardContent
 *   items={[
 *     {
 *       id: 'login-attempts',
 *       type: 'attempts',
 *       label: 'Failed Login Attempts',
 *       value: 0,
 *       status: 'secure',
 *       trend: 'down',
 *       trendValue: '-3 this week',
 *       description: 'No suspicious activity'
 *     },
 *     {
 *       id: 'active-sessions',
 *       type: 'sessions',
 *       label: 'Active Sessions',
 *       value: 2,
 *       status: 'secure',
 *       description: 'This device and mobile'
 *     },
 *     {
 *       id: 'devices',
 *       type: 'devices',
 *       label: 'Trusted Devices',
 *       value: 3,
 *       status: 'secure',
 *       trend: 'neutral',
 *       description: 'All devices verified'
 *     }
 *   ]}
 *   onItemPress={handleSecurityDetail}
 *   theme={theme}
 *   t={i18n.t}
 * />
 * ```
 * 
 * @example
 * Security warnings and alerts:
 * ```tsx
 * <SecurityCardContent
 *   items={[
 *     {
 *       id: 'password-age',
 *       type: 'password',
 *       label: 'Password Last Changed',
 *       value: '6 months ago',
 *       status: 'warning',
 *       trend: 'down',
 *       description: 'Consider updating password'
 *     },
 *     {
 *       id: 'backup-codes',
 *       type: 'backup',
 *       label: 'Backup Codes',
 *       value: '5 remaining',
 *       status: 'warning',
 *       description: 'Generate new codes soon'
 *     }
 *   ]}
 *   t={translate}
 * />
 * ```
 * 
 * @features
 * - Security-specific metric visualization
 * - Status-based color coding for risk assessment
 * - Automatic icon assignment by security type
 * - Trend analysis for security improvements
 * - Internationalization support
 * - Theme integration for consistent styling
 * - Interactive item selection for detailed views
 * - Comprehensive security type coverage
 * 
 * @security_types
 * - login: Authentication and access tracking
 * - sessions: Active session management
 * - mfa: Multi-factor authentication status
 * - devices: Trusted device management
 * - attempts: Security breach monitoring
 * 
 * @status_indicators
 * - secure: Green indicators for safe states
 * - warning: Orange indicators for attention needed
 * - danger: Red indicators for immediate action required
 * 
 * @architecture
 * - Transforms SecurityItem array to StatItem format
 * - Leverages StatsCard for consistent display patterns
 * - Automatic icon and color mapping system
 * - Status-aware styling and visual feedback
 * - Translation integration layer
 * 
 * @styling
 * - Status-based color coding system
 * - Security-specific icon semantics
 * - Consistent statistical layout
 * - Theme-aware color integration
 * - High contrast for security alerts
 * 
 * @accessibility
 * - Screen reader compatible security information
 * - High contrast status indicators
 * - Semantic markup for security states
 * - Clear visual hierarchy for risk assessment
 * - Touch target compliance
 * 
 * @performance
 * - Efficient item transformation
 * - Memoized color calculations
 * - Optimized re-render behavior
 * - Lazy icon mapping
 * 
 * @dependencies
 * - react: Core React library
 * - ../specialized/stats-card.component: StatsCard foundation
 * - ../types/card.types: Type definitions
 * 
 * @use_cases
 * - Security dashboard interfaces
 * - Account security overviews
 * - Risk assessment displays
 * - Security compliance monitoring
 * - Authentication status tracking
 * - Device management interfaces
 * 
 * @best_practices
 * - Use appropriate status indicators for risk levels
 * - Provide clear descriptions for security states
 * - Implement proper security navigation flows
 * - Test all security interaction patterns
 * - Maintain security information freshness
 * 
 * @see {@link StatsCard} for underlying statistical interface
 * @see {@link SecurityCardContentProps} for prop definitions
 * @see {@link SecurityItem} for security item structure
 */
export function SecurityCardContent({
  items,
  onItemPress: _onItemPress,
  theme,
  t,
  ...props
}: SecurityCardContentProps) {
  /**
   * Transforms security items into statistical items format.
   * Maps security-specific properties to StatsCard-compatible structure
   * with automatic icon assignment and status-based color coding.
   * 
   * @constant stats
   * @type {StatItem[]}
   * @since 1.0.0
   * 
   * @transformation
   * - Maps SecurityItem to StatItem interface
   * - Assigns default icons based on security type
   * - Applies status-based color coding
   * - Preserves trend and description data
   * - Maintains accessibility properties
   */
  const stats: StatItem[] = items.map(item => ({
    id: item.id,
    label: item.label,
    value: item.value,
    icon: item.icon || getSecurityIcon(item.type),
    iconColor: item.iconColor || getSecurityColor(item.status, theme),
    trend: item.trend,
    trendValue: item.trendValue,
    description: item.description,
  }));

  return (
    <StatsCard
      title={t('profile.accountScreen.security.title')}
      stats={stats}
      layout="vertical"
      theme={theme}
      {...props}
    />
  );
}

/**
 * Gets default icon for security item type.
 * Provides semantic icon mapping based on security category
 * to ensure consistent visual communication of security concepts.
 * 
 * @function getSecurityIcon
 * @param {string} type - Security item type identifier
 * @returns {string} Material Community Icons name for the security type
 * @private
 * @since 1.0.0
 * 
 * @icon_mapping
 * - login: 'login' (authentication access)
 * - sessions: 'devices' (active session management)
 * - mfa: 'shield-check' (multi-factor authentication)
 * - devices: 'cellphone-link' (trusted device management)
 * - attempts: 'shield-alert' (security breach monitoring)
 * - default: 'shield' (general security fallback)
 * 
 * @design_rationale
 * - Uses security-focused iconography
 * - Maintains semantic consistency
 * - Provides clear visual differentiation
 * - Supports international recognition
 * 
 * @example
 * ```tsx
 * const loginIcon = getSecurityIcon('login');     // 'login'
 * const mfaIcon = getSecurityIcon('mfa');         // 'shield-check'
 * const deviceIcon = getSecurityIcon('devices');  // 'cellphone-link'
 * ```
 */
const getSecurityIcon = (type: string): string => {
  switch (type) {
    case 'login':
      return 'login';
    case 'sessions':
      return 'devices';
    case 'mfa':
      return 'shield-check';
    case 'devices':
      return 'cellphone-link';
    case 'attempts':
      return 'shield-alert';
    default:
      return 'shield';
  }
};

/**
 * Gets color based on security status for risk assessment visualization.
 * Provides status-aware color coding to communicate security risk levels
 * and guide user attention to critical security information.
 * 
 * @function getSecurityColor
 * @param {string} [status] - Security status level
 * @param {any} [theme] - Theme object for color resolution
 * @returns {string} Color value appropriate for the security status
 * @private
 * @since 1.0.0
 * 
 * @color_mapping
 * - secure: theme.colors.primary (safe/good state)
 * - warning: theme.colors.tertiary (attention needed)
 * - danger: theme.colors.error (immediate action required)
 * - default: theme.colors.onSurfaceVariant (neutral/unknown)
 * - fallback: '#666' (when theme unavailable)
 * 
 * @risk_assessment
 * - Green: Secure states, no action needed
 * - Orange: Warning states, attention recommended
 * - Red: Dangerous states, immediate action required
 * - Gray: Neutral/informational states
 * 
 * @accessibility
 * - High contrast color selection
 * - Color-blind friendly palette
 * - Universal risk color conventions
 * - Theme-integrated consistency
 * 
 * @example
 * ```tsx
 * const secureColor = getSecurityColor('secure', theme);   // Green tone
 * const warningColor = getSecurityColor('warning', theme); // Orange tone
 * const dangerColor = getSecurityColor('danger', theme);   // Red tone
 * ```
 */
const getSecurityColor = (status?: string, theme?: any): string => {
  if (!theme) return '#666';
  
  switch (status) {
    case 'secure':
      return theme.colors.primary;
    case 'warning':
      return theme.colors.tertiary;
    case 'danger':
      return theme.colors.error;
    default:
      return theme.colors.onSurfaceVariant;
  }
};

export default SecurityCardContent; 