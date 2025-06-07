/**
 * SecurityCardContent Component - Enterprise Content Component
 * Reusable content component for security-related information
 */

import React from 'react';
import { StatsCard } from '../specialized/stats-card.component';
import type { StatItem } from '../types/card.types';

interface SecurityItem {
  id: string;
  type: string;
  label: string;
  value: string | number;
  icon?: string;
  iconColor?: string;
  status?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  description?: string;
}

interface SecurityCardContentProps {
  items: SecurityItem[];
  onItemPress?: (item: SecurityItem) => void;
  theme?: any;
  t: (key: string, options?: any) => string;
}

/**
 * @component SecurityCardContent
 * @description Content component for security-related statistics and information
 * 
 * @param {SecurityCardContentProps} props - Component props
 * @returns {React.ReactElement} Security content component
 * 
 * @example
 * ```tsx
 * <SecurityCardContent
 *   items={[
 *     { id: 'login', type: 'login', label: 'Last Login', value: '2 hours ago', icon: 'login' },
 *     { id: 'mfa', type: 'mfa', label: 'MFA Status', value: 'Enabled', status: 'secure' }
 *   ]}
 *   t={(key) => key}
 * />
 * ```
 */
export function SecurityCardContent({
  items,
  onItemPress: _onItemPress,
  theme,
  t,
  ...props
}: SecurityCardContentProps) {
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
 * Gets default icon for security item type
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
 * Gets color based on security status
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