/**
 * DangerCard Component - Enterprise Specialized Component
 * Card component specifically designed for dangerous actions and warnings
 * Based on the perfect implementation from privacy-settings.screen
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeleteConfirmationDialog } from '../../dialogs';

import type { DangerCardProps } from '../types/card.types';

/**
 * @component DangerCard
 * @description Specialized card for dangerous actions with confirmation patterns
 * Following the perfect design from privacy-settings.screen
 * 
 * @param {DangerCardProps} props - Component props
 * @returns {React.ReactElement} Danger card component
 * 
 * @example
 * ```tsx
 * <DangerCard
 *   title="Gefahrenbereich"
 *   dangerLevel="high"
 *   confirmationRequired={true}
 *   confirmText="Konto löschen"
 *   warningText="Diese Aktion kann nicht rückgängig gemacht werden"
 *   onConfirm={() => console.log('Account deleted')}
 * />
 * ```
 */
export const DangerCard: React.FC<DangerCardProps> = ({
  title = 'Gefahrenbereich',
  dangerLevel: _dangerLevel = 'medium',
  confirmationRequired = false,
  onConfirm,
  confirmText = 'Bestätigen',
  warningText,
  children,
  t,
  theme,
  ...baseProps
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Create styles based on the perfect privacy-settings.screen implementation
  const styles = createDangerCardStyles(theme);

  const handleInitialAction = () => {
    if (confirmationRequired) {
      setShowConfirmation(true);
    } else {
      onConfirm?.();
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {/* Danger Zone Card - Matching privacy-settings.screen perfect styling */}
      <Card style={[styles.dangerZoneCard]} {...baseProps}>
        <Card.Content style={styles.dangerZoneContent}>
          <View style={styles.dangerZoneHeader}>
            <Icon 
              name="alert-octagon" 
              size={24} 
              color={theme?.colors?.error || '#f44336'} 
              style={styles.dangerZoneIcon}
            />
            <Text style={[styles.dangerZoneTitle]}>
              {title}
            </Text>
          </View>
          
          <Text style={[styles.dangerZoneDescription]}>
            {warningText || (t ? t('settings.danger.deleteAccountDesc', { defaultValue: 'Konto und alle Daten permanent löschen. Diese Aktion kann nicht rückgängig gemacht werden.' }) : 'Konto und alle Daten permanent löschen. Diese Aktion kann nicht rückgängig gemacht werden.')}
          </Text>
          
          {/* Custom Content */}
          {children && (
            <View style={styles.dangerZoneCustomContent}>
              {children}
            </View>
          )}
          
          <Button
            mode="contained"
            onPress={handleInitialAction}
            buttonColor={theme?.colors?.error || '#f44336'}
            textColor={theme?.colors?.onError || '#ffffff'}
            icon="delete"
            style={styles.dangerZoneButton}
            contentStyle={{ height: 48 }}
          >
            {confirmText}
          </Button>
        </Card.Content>
      </Card>

      {/* Confirmation Dialog - Using shared DeleteConfirmationDialog */}
      <DeleteConfirmationDialog
        visible={showConfirmation}
        onDismiss={handleCancel}
        onConfirm={handleConfirm}
        title={title}
        content={warningText}
        theme={theme}
        t={t || ((key: string) => key)}
        testID={`${baseProps.testID || 'danger-card'}-confirmation`}
      />
    </>
  );
};

// Styles matching the perfect privacy-settings.screen implementation
const createDangerCardStyles = (theme: any) => StyleSheet.create({
  // Danger Zone Card - Exact copy from privacy-settings.screen.styles.ts
  dangerZoneCard: {
    borderColor: theme?.colors?.error || '#f44336',
    borderWidth: 2,
    backgroundColor: theme?.colors?.errorContainer || theme?.colors?.surface || '#ffffff',
    marginTop: theme?.spacing?.[3] || 12, // Small top margin for better spacing
    marginBottom: theme?.spacing?.[4] || 16,
    borderRadius: theme?.borderRadius?.lg || 12,
    elevation: 2,
    shadowColor: theme?.colors?.shadow || '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  dangerZoneContent: {
    padding: theme?.spacing?.[5] || 20, // More padding than regular sections
  },

  dangerZoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme?.spacing?.[3] || 12,
  },

  dangerZoneIcon: {
    marginRight: theme?.spacing?.[3] || 12,
    marginTop: 2, // Small offset to align with text baseline
  },

  dangerZoneTitle: {
    fontSize: theme?.typography?.fontSizes?.lg || 18,
    fontWeight: theme?.typography?.fontWeights?.bold || 'bold',
    color: theme?.colors?.error || '#f44336',
    flex: 1,
    lineHeight: 24, // Match icon height for better alignment
  },

  dangerZoneDescription: {
    fontSize: theme?.typography?.fontSizes?.md || 14,
    color: theme?.colors?.onErrorContainer || theme?.colors?.onSurface || '#333333',
    marginBottom: theme?.spacing?.[6] || 24,
    lineHeight: 22,
    paddingRight: theme?.spacing?.[2] || 8,
  },

  dangerZoneCustomContent: {
    marginBottom: theme?.spacing?.[4] || 16,
  },

  dangerZoneButton: {
    marginTop: theme?.spacing?.[2] || 8,
    borderRadius: theme?.borderRadius?.md || 8,
  },
});

export default DangerCard; 