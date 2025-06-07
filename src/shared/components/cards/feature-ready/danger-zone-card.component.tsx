/**
 * DangerZoneCard Component - Enterprise Shared Component
 * Fully reusable danger zone card for any feature across the app
 */

import React from 'react';
import { DangerCard } from '../specialized/danger-card.component';

export type DangerAction = 'delete' | 'reset' | 'clear' | 'revoke' | 'disable' | 'custom';

export interface SharedDangerZoneCardProps {
  title?: string;
  action: DangerAction;
  customActionText?: string;
  customWarningText?: string;
  onConfirm: () => void;
  theme?: any;
  t: (key: string, options?: any) => string;
  testID?: string;
  dangerLevel?: 'low' | 'medium' | 'high' | 'critical';
  requiresDoubleConfirmation?: boolean;
}

/**
 * @component DangerZoneCard
 * @description Fully reusable danger zone card that can be used across different features
 * Provides predefined danger actions with proper warnings and confirmations
 * 
 * @param {SharedDangerZoneCardProps} props - Component props
 * @returns {React.ReactElement} Danger zone card component
 * 
 * @example
 * ```tsx
 * <DangerZoneCard
 *   action="delete"
 *   onConfirm={() => handleDeleteAccount()}
 *   t={t}
 *   dangerLevel="critical"
 *   requiresDoubleConfirmation={true}
 * />
 * ```
 */
export const DangerZoneCard: React.FC<SharedDangerZoneCardProps> = ({ 
  title,
  action,
  customActionText,
  customWarningText,
  onConfirm,
  theme, 
  t,
  testID,
  dangerLevel,
  requiresDoubleConfirmation = false
}) => {
  const getDangerConfig = () => {
    switch (action) {
      case 'delete':
        return {
          title: title || t('profile.accountScreen.danger.deleteTitle'),
          actionText: t('profile.accountScreen.danger.deleteAction'),
          warningText: t('profile.accountScreen.danger.deleteWarning'),
          level: 'critical' as const,
          requireConfirmation: true
        };
      case 'reset':
        return {
          title: title || t('profile.accountScreen.danger.resetTitle'),
          actionText: t('profile.accountScreen.danger.resetAction'),
          warningText: t('profile.accountScreen.danger.resetWarning'),
          level: 'high' as const,
          requireConfirmation: true
        };
      case 'clear':
        return {
          title: title || t('profile.accountScreen.danger.clearTitle'),
          actionText: t('profile.accountScreen.danger.clearAction'),
          warningText: t('profile.accountScreen.danger.clearWarning'),
          level: 'medium' as const,
          requireConfirmation: true
        };
      case 'revoke':
        return {
          title: title || t('profile.accountScreen.danger.revokeTitle'),
          actionText: t('profile.accountScreen.danger.revokeAction'),
          warningText: t('profile.accountScreen.danger.revokeWarning'),
          level: 'high' as const,
          requireConfirmation: true
        };
      case 'disable':
        return {
          title: title || t('profile.accountScreen.danger.disableTitle'),
          actionText: t('profile.accountScreen.danger.disableAction'),
          warningText: t('profile.accountScreen.danger.disableWarning'),
          level: 'medium' as const,
          requireConfirmation: false
        };
      case 'custom':
        return {
          title: title || t('profile.accountScreen.danger.customTitle'),
          actionText: customActionText || t('profile.accountScreen.danger.customAction'),
          warningText: customWarningText || t('profile.accountScreen.danger.customWarning'),
          level: dangerLevel || 'medium' as const,
          requireConfirmation: requiresDoubleConfirmation
        };
      default:
        return {
          title: title || t('profile.accountScreen.danger.title'),
          actionText: t('profile.accountScreen.danger.customAction'),
          warningText: t('profile.accountScreen.danger.customWarning'),
          level: 'medium' as const,
          requireConfirmation: true
        };
    }
  };

  const config = getDangerConfig();

  return (
    <DangerCard
      title={config.title}
      dangerLevel={dangerLevel || config.level}
      confirmationRequired={config.requireConfirmation}
      confirmText={config.actionText}
      warningText={config.warningText}
      onConfirm={onConfirm}
      theme={theme}
      t={t}
      testID={testID}
    />
  );
};

export default DangerZoneCard; 