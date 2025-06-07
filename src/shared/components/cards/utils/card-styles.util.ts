/**
 * Card Styles Utility - Enterprise Styling System
 * Centralized styling for consistent card appearance across the app
 */

import { StyleSheet } from 'react-native';
import { MD3Theme } from 'react-native-paper';
import type { CardStyles, CardThemeOverrides, CardVariant, CardSize } from '../types/card.types';

/**
 * Creates consistent card styles based on theme and customizations
 * @param theme - Material Design 3 theme
 * @param overrides - Optional theme overrides
 * @returns Complete card styles object
 */
export const createCardStyles = (
  theme: MD3Theme,
  overrides?: CardThemeOverrides
): CardStyles => {
  const spacing = {
    cardPadding: overrides?.spacing?.cardPadding ?? 16,
    contentPadding: overrides?.spacing?.contentPadding ?? 12,
    itemSpacing: overrides?.spacing?.itemSpacing ?? 8,
  };

  const colors = {
    cardBackground: overrides?.colors?.cardBackground ?? theme.colors.surface,
    cardBorder: overrides?.colors?.cardBorder ?? theme.colors.outline,
    cardShadow: overrides?.colors?.cardShadow ?? theme.colors.shadow,
    dangerBackground: overrides?.colors?.dangerBackground ?? theme.colors.errorContainer,
    dangerBorder: overrides?.colors?.dangerBorder ?? theme.colors.error,
    warningBackground: overrides?.colors?.warningBackground ?? theme.colors.tertiaryContainer,
    warningBorder: overrides?.colors?.warningBorder ?? theme.colors.tertiary,
  };

  const typography = {
    titleSize: overrides?.typography?.titleSize ?? 18,
    subtitleSize: overrides?.typography?.subtitleSize ?? 14,
    bodySize: overrides?.typography?.bodySize ?? 16,
  };

  return StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: theme.roundness ?? 12,
      marginVertical: spacing.itemSpacing / 2,
      overflow: 'hidden',
    },
    content: {
      padding: spacing.contentPadding,
    },
    header: {
      paddingBottom: spacing.itemSpacing,
    },
    title: {
      fontSize: typography.titleSize,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: spacing.itemSpacing / 2,
    },
    subtitle: {
      fontSize: typography.subtitleSize,
      color: theme.colors.onSurfaceVariant,
      lineHeight: typography.subtitleSize * 1.4,
    },
    body: {
      marginVertical: spacing.itemSpacing,
    },
    footer: {
      paddingTop: spacing.itemSpacing,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.outlineVariant,
      marginVertical: spacing.itemSpacing,
    },
    elevated: {
      elevation: 4,
      shadowColor: colors.cardShadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    compact: {
      padding: spacing.contentPadding / 2,
    },
  });
};

/**
 * Creates variant-specific styles for cards
 * @param theme - Material Design 3 theme
 * @param variant - Card variant type
 * @returns Variant-specific styles
 */
export const createCardVariantStyles = (
  theme: MD3Theme,
  variant: CardVariant = 'default'
) => {
  const baseStyles = createCardStyles(theme);

  switch (variant) {
    case 'elevated':
      return {
        ...baseStyles,
        container: {
          ...baseStyles.container,
          ...baseStyles.elevated,
        },
      };

    case 'outlined':
      return {
        ...baseStyles,
        container: {
          ...baseStyles.container,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        },
      };

    case 'filled':
      return {
        ...baseStyles,
        container: {
          ...baseStyles.container,
          backgroundColor: theme.colors.surfaceVariant,
        },
      };

    default:
      return baseStyles;
  }
};

/**
 * Creates size-specific styles for cards
 * @param theme - Material Design 3 theme
 * @param size - Card size
 * @returns Size-specific styles
 */
export const createCardSizeStyles = (
  theme: MD3Theme,
  size: CardSize = 'medium'
) => {
  const baseStyles = createCardStyles(theme);
  const multipliers = {
    small: 0.75,
    medium: 1,
    large: 1.25,
  };

  const multiplier = multipliers[size];

  return {
    ...baseStyles,
    content: {
      ...baseStyles.content,
      padding: (baseStyles.content.padding as number) * multiplier,
    },
    title: {
      ...baseStyles.title,
      fontSize: (baseStyles.title.fontSize as number) * multiplier,
    },
    subtitle: {
      ...baseStyles.subtitle,
      fontSize: (baseStyles.subtitle.fontSize as number) * multiplier,
    },
  };
};

/**
 * Creates danger-specific styles for warning and destructive actions
 * @param theme - Material Design 3 theme
 * @param level - Danger level
 * @returns Danger-specific styles
 */
export const createDangerCardStyles = (
  theme: MD3Theme,
  level: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) => {
  const baseStyles = createCardStyles(theme);

  const dangerColors = {
    low: {
      background: theme.colors.tertiaryContainer,
      border: theme.colors.tertiary,
      text: theme.colors.onTertiaryContainer,
    },
    medium: {
      background: theme.colors.secondaryContainer,
      border: theme.colors.secondary,
      text: theme.colors.onSecondaryContainer,
    },
    high: {
      background: theme.colors.errorContainer,
      border: theme.colors.error,
      text: theme.colors.onErrorContainer,
    },
    critical: {
      background: theme.colors.error,
      border: theme.colors.error,
      text: theme.colors.onError,
    },
  };

  const colors = dangerColors[level];

  return {
    ...baseStyles,
    container: {
      ...baseStyles.container,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      ...baseStyles.title,
      color: colors.text,
    },
    subtitle: {
      ...baseStyles.subtitle,
      color: colors.text,
    },
  };
}; 