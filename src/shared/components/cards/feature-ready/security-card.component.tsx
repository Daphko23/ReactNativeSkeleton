/**
 * SecurityCard Component - Enterprise Shared Component  
 * Fully reusable security card for any feature across the app
 */

import React from 'react';
import { SecurityCardContent } from '../content/security-card-content.component';

export interface SecurityStats {
  lastLogin?: Date;
  activeSessions?: number;
  mfaEnabled?: boolean;
  loginAttempts?: number;
  activeDevices?: number;
}

export interface SecurityItem {
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
  lastUpdated?: Date;
}

export interface SharedSecurityCardProps {
  security?: SecurityStats;
  items?: SecurityItem[];
  onItemPress?: (item: SecurityItem) => void;
  theme?: any;
  t: (key: string, options?: any) => string;
  testID?: string;
  showDefaults?: boolean;
}

/**
 * @component SecurityCard
 * @description Fully reusable security card that can be used across different features
 * Automatically formats security data or accepts custom items
 * 
 * @param {SharedSecurityCardProps} props - Component props
 * @returns {React.ReactElement} Security card component
 * 
 * @example
 * ```tsx
 * <SecurityCard
 *   security={{
 *     lastLogin: new Date(),
 *     activeSessions: 2,
 *     mfaEnabled: true
 *   }}
 *   t={t}
 *   onItemPress={(item) => handleSecurityAction(item)}
 * />
 * ```
 */
export const SecurityCard: React.FC<SharedSecurityCardProps> = ({ 
  security,
  items,
  onItemPress,
  theme, 
  t,
  showDefaults = true
}) => {
  // Format last login date
  const formattedLastLogin = security?.lastLogin 
    ? security.lastLogin.toLocaleString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : t('profile.accountScreen.security.neverLoggedIn');

  const defaultItems: SecurityItem[] = [
    {
      id: 'lastLogin',
      type: 'login',
      label: t('profile.accountScreen.security.lastLogin'),
      value: formattedLastLogin,
      icon: 'login',
      status: 'secure',
      lastUpdated: security?.lastLogin
    },
    {
      id: 'activeSessions',
      type: 'sessions',
      label: t('profile.accountScreen.security.activeSessions'),
      value: security?.activeSessions || 0,
      icon: 'devices',
      status: (security?.activeSessions || 0) > 3 ? 'warning' : 'secure'
    },
    {
      id: 'mfa',
      type: 'mfa',
      label: t('profile.accountScreen.security.mfa'),
      value: security?.mfaEnabled ? t('profile.accountScreen.security.enabled') : t('profile.accountScreen.security.disabled'),
      icon: security?.mfaEnabled ? 'shield-check' : 'shield-off',
      status: security?.mfaEnabled ? 'secure' : 'danger'
    }
  ];

  // Add optional items if data available
  if (security?.loginAttempts !== undefined) {
    defaultItems.push({
      id: 'loginAttempts',
      type: 'attempts',
      label: t('profile.accountScreen.security.loginAttempts'),
      value: security.loginAttempts,
      icon: 'shield-alert',
      status: security.loginAttempts > 5 ? 'danger' : 'secure'
    });
  }

  if (security?.activeDevices !== undefined) {
    defaultItems.push({
      id: 'activeDevices',
      type: 'devices',
      label: t('profile.accountScreen.security.activeDevices'),
      value: security.activeDevices,
      icon: 'cellphone-link',
      status: security.activeDevices > 5 ? 'warning' : 'secure'
    });
  }

  const securityItems = items || (showDefaults ? defaultItems : []);

  const handleSecurityItemPress = (item: SecurityItem) => {
    if (onItemPress) {
      onItemPress(item);
    } else {
      // Default actions
      switch (item.type) {
        case 'login':
          console.log('Show login history');
          break;
        case 'sessions':
          console.log('Manage active sessions');
          break;
        case 'mfa':
          console.log('Configure MFA');
          break;
        case 'attempts':
          console.log('View security log');
          break;
        case 'devices':
          console.log('Manage devices');
          break;
        default:
          console.log('Unknown security action:', item.id);
      }
    }
  };

  return (
    <SecurityCardContent
      items={securityItems}
      onItemPress={handleSecurityItemPress}
      theme={theme}
      t={t}
    />
  );
};

export default SecurityCard; 