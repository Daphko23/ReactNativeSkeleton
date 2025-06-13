/**
 * Social Links Section Component Styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from '../../../../../../core/theme/theme.types';

export const createSocialLinksSectionStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing[6],
    },
    
    fieldContainer: {
      marginBottom: theme.spacing[4],
    },
    
    label: {
      fontSize: theme.typography.fontSizes.base,
      fontWeight: theme.typography.fontWeights.medium as any,
      color: theme.colors.text,
      marginBottom: theme.spacing[2],
    },
    
    input: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing[4],
      fontSize: theme.typography.fontSizes.base,
      color: theme.colors.text,
    },
    
    errorText: {
      fontSize: theme.typography.fontSizes.sm,
      color: theme.colors.error,
      marginTop: theme.spacing[2],
    },
  }); 