/**
 * FormSection - Reusable Form Section Component
 * Provides consistent styling and layout for form sections
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useTheme } from '../../../core/theme/theme.system';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
  titleStyle?: any;
  showCard?: boolean;
}

const createStyles = (theme: any) => StyleSheet.create({
  section: {
    marginBottom: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  content: {
    // Card content is handled by Paper's Card.Content
  },
  viewContent: {
    padding: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    marginBottom: theme.spacing[4],
    color: theme.colors.text,
  },
});

export const FormSection = memo<FormSectionProps>(({
  title,
  children,
  style,
  contentStyle,
  titleStyle,
  showCard = true
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (showCard) {
    return (
      <Card style={[styles.section, style]}>
        <Card.Content style={[styles.content, contentStyle]}>
          <Title style={[styles.sectionTitle, titleStyle]}>{title}</Title>
          {children}
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={[styles.section, style]}>
      <View style={[styles.viewContent, contentStyle]}>
        <Title style={[styles.sectionTitle, titleStyle]}>{title}</Title>
        {children}
      </View>
    </View>
  );
});

FormSection.displayName = 'FormSection'; 