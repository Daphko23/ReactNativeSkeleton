/**
 * @fileoverview ErrorDisplay Component - Enterprise Error Display UI
 * 
 * @description Professional error display component providing comprehensive
 * error presentation with retry functionality, accessibility support, and
 * enterprise-grade error handling UI patterns.
 * 
 * @module ErrorDisplayComponent
 * @since 1.0.0
 * @author Enterprise Development Team
 * @layer Presentation
 * @accessibility Full WCAG 2.1 AA compliance with screen reader support
 * @performance Optimized with memoization and efficient error handling
 * @responsive Adaptive layout for mobile and tablet devices
 * @testing Comprehensive test coverage with accessibility testing
 */

import React from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';

import { PROFILE_CONSTANTS } from '../../constants/profile.constants';
import { CustomCard } from '@shared/components/cards/specialized/custom-card.component';
import { createErrorDisplayStyles } from './error-display.component.styles';

export interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  theme: any;
  t: (key: string, options?: any) => string;
  testIds: typeof PROFILE_CONSTANTS.TEST_IDS;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({
  error,
  onRetry,
  theme,
  t,
  testIds,
}) => {
  const styles = React.useMemo(() => createErrorDisplayStyles(theme), [theme]);

  return (
    <CustomCard 
      style={styles.errorCard}
      theme={theme}
      testID={testIds.ERROR_CARD}
      accessibilityRole="alert"
      accessibilityLabel={t('profile.mainScreen.errorDisplayAccessibilityLabel')}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>
        {t('profile.mainScreen.error')}
      </Text>
      
      <Text 
        style={[styles.errorText, { color: theme.colors.error }]}
        accessibilityLabel={t('profile.mainScreen.errorMessageAccessibilityLabel', { error })}
      >
        {error}
      </Text>
      
      {onRetry && (
        <Button
          mode="outlined"
          onPress={onRetry}
          style={styles.retryButton}
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.onErrorContainer}
          testID={`${testIds.ERROR_CARD}-retry-button`}
          accessibilityLabel={t('profile.mainScreen.retryAccessibilityLabel')}
          accessibilityHint={t('profile.mainScreen.retryAccessibilityHint')}
        >
          {t('profile.mainScreen.retry')}
        </Button>
      )}
    </CustomCard>
  );
});



ErrorDisplay.displayName = 'ErrorDisplay'; 