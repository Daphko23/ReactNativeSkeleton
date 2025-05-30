import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {colors, spacing} from '@core/theme';

interface FormSectionProps {
  /** Titel der Sektion */
  title: string;
  /** Kinder-Komponenten */
  children: React.ReactNode;
  /** Test-ID für Testing */
  testID?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
});
