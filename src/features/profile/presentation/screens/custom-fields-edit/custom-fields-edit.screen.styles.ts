/**
 * CustomFieldsEditScreen Styles - Enterprise Theme System
 * Centralized styling with consistent spacing and design tokens
 * Following enterprise design patterns and accessibility guidelines
 */

import { StyleSheet } from 'react-native';

export const createCustomFieldsEditScreenStyles = (theme: any) => {
  // Fallback spacing system (React Native Paper doesn't have theme.spacing)
  const spacing = {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
  };

  // Fallback typography (React Native Paper doesn't have theme.typography)
  const typography = {
    fontSizes: {
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
    },
    fontWeights: {
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    lineHeights: {
      normal: 1.4,
      relaxed: 1.6,
    }
  };

  // Fallback border radius
  const borderRadius = {
    md: 8,
    lg: 12,
  };

  // Safe color access with fallbacks
  const colors = {
    background: theme.colors?.background || '#FFFFFF',
    surface: theme.colors?.surface || '#F5F5F5',
    text: theme.colors?.onBackground || theme.colors?.text || '#000000',
    textSecondary: theme.colors?.onSurfaceVariant || '#666666',
    textTertiary: theme.colors?.outline || '#999999',
    primary: theme.colors?.primary || '#6200EE',
    error: theme.colors?.error || '#B00020',
    border: theme.colors?.outline || '#E0E0E0',
    backgroundSecondary: theme.colors?.surfaceVariant || '#F0F0F0',
    shadow: theme.colors?.shadow || '#000000',
    disabled: theme.colors?.onSurface || '#CCCCCC',
    success: theme.colors?.tertiary || theme.colors?.primary || '#4CAF50',
  };

  return StyleSheet.create({
    // Main Container
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    
    // Loading State
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    
    loadingText: {
      marginTop: spacing[4],
      color: colors.text,
      fontSize: typography.fontSizes.md,
    },

    // Header Section
    header: {
      padding: spacing[4],
      paddingBottom: spacing[3],
    },

    headerTitle: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.text,
      marginBottom: spacing[2],
    },

    headerSubtitle: {
      fontSize: typography.fontSizes.md,
      color: colors.textSecondary,
      lineHeight: typography.lineHeights.relaxed,
    },

    // ScrollView Content
    scrollView: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
      paddingBottom: spacing[8], // Normal bottom padding without FAB
    },

    // Section Cards
    section: {
      marginBottom: spacing[4],
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    sectionContent: {
      padding: spacing[4],
    },

    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      marginBottom: spacing[3],
      color: colors.text,
    },

    // Templates Section
    templatesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[3],
    },

    templatesContainer: {
      flexDirection: 'row',
      gap: spacing[2],
      paddingRight: spacing[4],
    },

    templateChip: {
      marginBottom: spacing[1],
    },

    templateChipDisabled: {
      opacity: 0.5,
    },

    allTemplatesContainer: {
      gap: spacing[2],
    },

    templateItemDisabled: {
      opacity: 0.5,
    },

    templateListItem: {
      paddingHorizontal: 0,
      paddingVertical: spacing[2],
    },

    // Fields Section
    fieldsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[3],
    },

    fieldsCounter: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      fontWeight: typography.fontWeights.medium,
    },

    // Empty State
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing[8],
      paddingHorizontal: spacing[4],
    },

    emptyIcon: {
      marginBottom: spacing[4],
    },

    emptyText: {
      color: colors.textSecondary,
      textAlign: 'center',
      fontSize: typography.fontSizes.md,
      lineHeight: typography.lineHeights.relaxed,
      marginBottom: spacing[2],
    },

    emptySubtext: {
      color: colors.textTertiary,
      textAlign: 'center',
      fontSize: typography.fontSizes.sm,
      lineHeight: typography.lineHeights.normal,
    },

    // Field Items
    fieldItem: {
      marginBottom: spacing[5],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.md,
      padding: spacing[3],
      borderWidth: 1,
      borderColor: colors.border,
    },

    fieldHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing[2],
    },

    fieldInfo: {
      flex: 1,
      marginRight: spacing[2],
    },

    fieldLabel: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: colors.text,
      marginBottom: spacing[1],
    },

    fieldType: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      textTransform: 'capitalize',
    },

    fieldDeleteButton: {
      padding: spacing[1],
    },

    // Input Styling
    fieldInput: {
      backgroundColor: colors.surface,
      fontSize: typography.fontSizes.md,
    },

    fieldInputError: {
      borderColor: colors.error,
      borderWidth: 1,
    },

    fieldErrorText: {
      fontSize: typography.fontSizes.sm,
      color: colors.error,
      marginTop: spacing[1],
    },

    // Tips Section
    tipsSection: {
      backgroundColor: colors.backgroundSecondary,
    },

    tipItem: {
      flexDirection: 'row',
      marginBottom: spacing[3],
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[2],
      minHeight: 40,
    },

    tipBullet: {
      fontSize: 16,
      color: colors.primary,
      marginRight: spacing[3],
      width: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    },

    tipText: {
      fontSize: typography.fontSizes.sm,
      color: colors.text,
      lineHeight: 20,
      flex: 1,
    },

    // Floating Action Button
    fab: {
      position: 'absolute',
      margin: spacing[4],
      right: 0,
      bottom: 0,
      backgroundColor: colors.primary,
    },

    fabDisabled: {
      backgroundColor: colors.disabled,
    },

    // Menu and Dialog
    newFieldMenu: {
      marginTop: spacing[6],
    },

    menuItem: {
      minHeight: 48,
    },

    menuItemIcon: {
      marginRight: spacing[2],
    },

    // Validation
    validationContainer: {
      marginTop: spacing[1],
    },

    validationSuccess: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    validationSuccessText: {
      fontSize: typography.fontSizes.sm,
      color: colors.success,
      marginLeft: spacing[1],
    },

    // Progress and Stats
    progressContainer: {
      marginTop: spacing[2],
      padding: spacing[3],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.md,
    },

    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[2],
    },

    progressLabel: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
    },

    progressValue: {
      fontSize: typography.fontSizes.sm,
      color: colors.text,
      fontWeight: typography.fontWeights.medium,
    },

    progressBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },

    // Accessibility
    screenReader: {
      position: 'absolute',
      left: -10000,
      top: -10000,
      width: 1,
      height: 1,
    },

    // Animation Support
    fadeIn: {
      opacity: 1,
    },

    fadeOut: {
      opacity: 0.5,
    },

    // Responsive adjustments
    compactMode: {
      paddingHorizontal: spacing[2],
    },

    // Spacing
    bottomSpacer: {
      height: spacing[8],
    },
  });
};


 