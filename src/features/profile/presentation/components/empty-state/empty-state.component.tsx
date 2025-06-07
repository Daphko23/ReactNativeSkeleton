/**
 * @fileoverview EmptyState Component - Enterprise Empty State UI
 * 
 * @description Professional empty state component providing comprehensive
 * empty state presentation with call-to-action functionality, accessibility
 * support, and enterprise-grade empty state UI patterns.
 * 
 * @module EmptyStateComponent
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 * @accessibility Full WCAG 2.1 AA compliance with screen reader support
 * @performance Optimized with memoization and efficient state handling
 * @responsive Adaptive layout for mobile and tablet devices
 * @testing Comprehensive test coverage with accessibility testing
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

import { PROFILE_CONSTANTS } from '../../constants/profile.constants';
import { createEmptyStateStyles } from './empty-state.component.styles';

export interface EmptyStateProps {
  onCreateProfile: () => void;
  theme: any;
  t: (key: string, options?: any) => string;
  testIds: typeof PROFILE_CONSTANTS.TEST_IDS;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  onCreateProfile,
  theme,
  t,
  testIds,
}) => {
  const styles = React.useMemo(() => createEmptyStateStyles(theme), [theme]);

  return (
    <View 
      style={styles.container}
      testID={testIds.EMPTY_STATE}
      accessibilityRole="none"
      accessibilityLabel={t('profile.mainScreen.emptyStateAccessibilityLabel')}
    >
      <Text 
        style={styles.emptyText}
        accessibilityRole="text"
        accessibilityLabel={t('profile.mainScreen.noProfileFoundAccessibilityLabel')}
      >
        {t('profile.mainScreen.noProfileFound')}
      </Text>
      
      <Button 
        mode="contained" 
        onPress={onCreateProfile}
        style={styles.createButton}
        testID={testIds.CREATE_PROFILE_BUTTON}
        accessibilityLabel={t('profile.mainScreen.createProfileAccessibilityLabel')}
        accessibilityHint={t('profile.mainScreen.createProfileAccessibilityHint')}
      >
        {t('profile.mainScreen.createProfile')}
      </Button>
    </View>
  );
});



EmptyState.displayName = 'EmptyState'; 