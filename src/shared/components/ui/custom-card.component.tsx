/**
 * CustomCard Component - Shadow-Free Card Alternative
 * Enterprise-grade card without shadow performance issues
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export interface CustomCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  contentStyle?: ViewStyle | ViewStyle[];
  theme: any;
  testID?: string;
  accessibilityRole?: any;
  accessibilityLabel?: string;
}

export const CustomCard: React.FC<CustomCardProps> = React.memo(({
  children,
  style,
  contentStyle,
  theme,
  testID,
  accessibilityRole,
  accessibilityLabel,
}) => {
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View 
      style={[styles.card, style]}
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
});

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface || '#FFFFFF',
    borderRadius: theme.borderRadius?.lg || 12,
    borderWidth: 1,
    borderColor: theme.colors.outline || '#E5E5E5',
    marginVertical: theme.spacing?.[1] || 4,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 0,
  },
  content: {
    padding: theme.spacing?.[4] || 16,
  },
});

CustomCard.displayName = 'CustomCard'; 