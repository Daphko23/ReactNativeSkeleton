/**
 * Theme Migration Service
 * Provides backward compatibility for old theme usage
 */

import { useContext } from 'react';
import { ThemeContext } from './theme.system';
import { MD3Theme } from 'react-native-paper';

/**
 * Legacy theme hook that maps old theme usage to new theme system
 * This provides backward compatibility for components still using the old API
 */
export const useLegacyTheme = (): MD3Theme => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    // Fallback theme for components outside ThemeProvider
    return {
      colors: {
        primary: '#007AFF',
        background: '#ffffff',
        surface: '#ffffff',
        error: '#dc2626',
        onPrimary: '#ffffff',
        onSurface: '#000000',
        outline: '#e5e5e5',
      },
    } as MD3Theme;
  }

  const { theme } = context;

  // Map new theme to old Paper theme format for backward compatibility
  return {
    colors: {
      primary: theme.colors.primary,
      primaryContainer: theme.colors.backgroundSecondary,
      secondary: theme.colors.secondary,
      secondaryContainer: theme.colors.backgroundTertiary,
      background: theme.colors.background,
      surface: theme.colors.surface,
      surfaceVariant: theme.colors.backgroundSecondary,
      error: theme.colors.error,
      errorContainer: theme.colors.error + '20',
      onPrimary: theme.colors.textInverse,
      onPrimaryContainer: theme.colors.text,
      onSecondary: theme.colors.textInverse,
      onSecondaryContainer: theme.colors.text,
      onBackground: theme.colors.text,
      onSurface: theme.colors.text,
      onSurfaceVariant: theme.colors.textSecondary,
      onError: theme.colors.textInverse,
      onErrorContainer: theme.colors.text,
      outline: theme.colors.border,
      outlineVariant: theme.colors.borderLight,
      shadow: theme.colors.overlay,
      scrim: theme.colors.overlay,
      inverseSurface: theme.colors.text,
      inverseOnSurface: theme.colors.background,
      inversePrimary: theme.colors.primaryLight,
      elevation: {
        level0: theme.colors.surface,
        level1: theme.colors.surface,
        level2: theme.colors.surface,
        level3: theme.colors.surface,
        level4: theme.colors.surface,
        level5: theme.colors.surface,
      },
      surfaceDisabled: theme.colors.interactiveDisabled,
      onSurfaceDisabled: theme.colors.textTertiary,
      backdrop: theme.colors.overlay,
    },
    fonts: {
      default: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      displayLarge: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes['6xl'],
        fontWeight: theme.typography.fontWeights.bold,
        lineHeight: theme.typography.lineHeights.tight * theme.typography.fontSizes['6xl'],
        letterSpacing: theme.typography.letterSpacing.tight,
      },
      displayMedium: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes['5xl'],
        fontWeight: theme.typography.fontWeights.bold,
        lineHeight: theme.typography.lineHeights.tight * theme.typography.fontSizes['5xl'],
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      displaySmall: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes['4xl'],
        fontWeight: theme.typography.fontWeights.semibold,
        lineHeight: theme.typography.lineHeights.snug * theme.typography.fontSizes['4xl'],
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      headlineLarge: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes['3xl'],
        fontWeight: theme.typography.fontWeights.semibold,
        lineHeight: theme.typography.lineHeights.snug * theme.typography.fontSizes['3xl'],
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      headlineMedium: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes['2xl'],
        fontWeight: theme.typography.fontWeights.medium,
        lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes['2xl'],
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      headlineSmall: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.medium,
        lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.xl,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      titleLarge: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.lg,
        fontWeight: theme.typography.fontWeights.semibold,
        lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.lg,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      titleMedium: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.base,
        fontWeight: theme.typography.fontWeights.medium,
        lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.base,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      titleSmall: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.sm,
        fontWeight: theme.typography.fontWeights.medium,
        lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.sm,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      labelLarge: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.base,
        fontWeight: theme.typography.fontWeights.medium,
        lineHeight: theme.typography.lineHeights.snug * theme.typography.fontSizes.base,
        letterSpacing: theme.typography.letterSpacing.wide,
      },
      labelMedium: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.sm,
        fontWeight: theme.typography.fontWeights.medium,
        lineHeight: theme.typography.lineHeights.snug * theme.typography.fontSizes.sm,
        letterSpacing: theme.typography.letterSpacing.wide,
      },
      labelSmall: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.xs,
        fontWeight: theme.typography.fontWeights.medium,
        lineHeight: theme.typography.lineHeights.snug * theme.typography.fontSizes.xs,
        letterSpacing: theme.typography.letterSpacing.wider,
      },
      bodyLarge: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.base,
        fontWeight: theme.typography.fontWeights.normal,
        lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.base,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      bodyMedium: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.sm,
        fontWeight: theme.typography.fontWeights.normal,
        lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.sm,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      bodySmall: {
        fontFamily: 'System',
        fontSize: theme.typography.fontSizes.xs,
        fontWeight: theme.typography.fontWeights.normal,
        lineHeight: theme.typography.lineHeights.normal * theme.typography.fontSizes.xs,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
    },
    animation: {
      scale: 1.0,
    },
    roundness: theme.borderRadius.md,
    isV3: true,
  } as MD3Theme;
}; 