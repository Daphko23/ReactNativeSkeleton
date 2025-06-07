/**
 * Theme Adapter - Bridge zwischen unserem Theme System und MD3Theme
 * Konvertiert unser Theme-Format zu React Native Paper MD3Theme
 */

import { MD3Theme } from 'react-native-paper';
import type { Theme } from './theme.system';

/**
 * Konvertiert unser Theme zu MD3Theme Format
 */
export function adaptThemeToMD3(theme: Theme): MD3Theme {
  return {
    dark: theme.name === 'dark',
    roundness: theme.borderRadius?.md || 8,
    version: 3,
    isV3: true,
    colors: {
      primary: theme.colors.primary,
      onPrimary: theme.colors.background,
      primaryContainer: theme.colors.primary + '20', // 20% opacity
      onPrimaryContainer: theme.colors.text,
      secondary: theme.colors.secondary || theme.colors.primary,
      onSecondary: theme.colors.background,
      secondaryContainer: theme.colors.secondary ? theme.colors.secondary + '20' : theme.colors.primary + '20',
      onSecondaryContainer: theme.colors.text,
      tertiary: theme.colors.accent || theme.colors.primary,
      onTertiary: theme.colors.background,
      tertiaryContainer: theme.colors.accent ? theme.colors.accent + '20' : theme.colors.primary + '20',
      onTertiaryContainer: theme.colors.text,
      error: theme.colors.error || '#F44336',
      onError: theme.colors.background,
      errorContainer: theme.colors.error ? theme.colors.error + '20' : '#F4433620',
      onErrorContainer: theme.colors.text,
      background: theme.colors.background,
      onBackground: theme.colors.text,
      surface: theme.colors.surface || theme.colors.background,
      onSurface: theme.colors.text,
      surfaceVariant: theme.colors.surfaceSecondary || theme.colors.surface || theme.colors.background,
      onSurfaceVariant: theme.colors.textSecondary || theme.colors.text,
      outline: theme.colors.border || '#E0E0E0',
      outlineVariant: theme.colors.borderLight || theme.colors.border || '#F5F5F5',
      shadow: '#000000',
      scrim: theme.colors.overlay || '#00000080',
      inverseSurface: theme.colors.text,
      inverseOnSurface: theme.colors.background,
      inversePrimary: theme.colors.primary,
      elevation: {
        level0: 'transparent',
        level1: theme.colors.surface || theme.colors.background,
        level2: theme.colors.surface || theme.colors.background,
        level3: theme.colors.surface || theme.colors.background,
        level4: theme.colors.surface || theme.colors.background,
        level5: theme.colors.surface || theme.colors.background,
      },
      surfaceDisabled: '#00000012',
      onSurfaceDisabled: '#00000038',
      backdrop: theme.colors.overlay || '#00000040',
    },
    fonts: {
      default: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        letterSpacing: 0,
      },
      displayLarge: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        fontSize: 57,
        lineHeight: 64,
        letterSpacing: 0,
      },
      displayMedium: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        fontSize: 45,
        lineHeight: 52,
        letterSpacing: 0,
      },
      displaySmall: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        fontSize: 36,
        lineHeight: 44,
        letterSpacing: 0,
      },
      headlineLarge: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: 0,
      },
      headlineMedium: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: 0,
      },
      headlineSmall: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 0,
      },
      titleLarge: {
        fontFamily: 'System',
        fontWeight: '500' as const,
        fontSize: 22,
        lineHeight: 28,
        letterSpacing: 0,
      },
      titleMedium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.15,
      },
      titleSmall: {
        fontFamily: 'System',
        fontWeight: '500' as const,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
      },
      labelLarge: {
        fontFamily: 'System',
        fontWeight: '500' as const,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
      },
      labelMedium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
      },
      labelSmall: {
        fontFamily: 'System',
        fontWeight: '500' as const,
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.5,
      },
      bodyLarge: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.15,
      },
      bodyMedium: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
      },
      bodySmall: {
        fontFamily: 'System',
        fontWeight: 'normal' as const,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
      },
    },
    animation: {
      scale: 1.0,
    },
  };
}

/**
 * Hook um adaptiertes MD3Theme zu erhalten
 */
export function useAdaptedTheme(theme: Theme): MD3Theme {
  return adaptThemeToMD3(theme);
} 