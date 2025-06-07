/**
 * LoadingOverlay - Reusable Loading State Component
 * Provides consistent loading states with optional backdrop
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, Portal } from 'react-native-paper';
import { useTheme } from '../../../core/theme/theme.system';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  style?: any;
  testID?: string;
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[8],
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: theme.spacing[4],
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text,
    textAlign: 'center',
  },
  overlayText: {
    color: '#FFFFFF',
  },
});

export const LoadingOverlay = memo<LoadingOverlayProps>(({
  visible,
  message,
  overlay = false,
  size = 'large',
  style,
  testID
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!visible) {
    return null;
  }

  const content = (
    <View style={[
      overlay ? styles.overlay : styles.container,
      style
    ]}>
      <ActivityIndicator 
        size={size} 
        color={overlay ? '#FFFFFF' : theme.colors.primary}
        testID={testID}
      />
      {message && (
        <Text style={[
          styles.loadingText,
          overlay && styles.overlayText
        ]}>
          {message}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <Portal>
        {content}
      </Portal>
    );
  }

  return content;
});

LoadingOverlay.displayName = 'LoadingOverlay'; 