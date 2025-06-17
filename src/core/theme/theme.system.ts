/**
 * Advanced Theme System
 * Dynamic theming with dark mode, design tokens, and semantic colors
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dimensions, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Logger for theme system
const logger = LoggerFactory.createServiceLogger('ThemeSystem');

// =============================================
// DESIGN TOKENS
// =============================================

// Base color palette
const colors = {
  // Primary palette
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral palette
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Special colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

// Typography scale
const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  fontWeights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  } as const,
  
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Spacing scale
const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
};

// Border radius
const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Shadows
const shadows = {
  sm: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 5,
  },
};

// =============================================
// THEME INTERFACE
// =============================================

export interface Theme {
  name: string;
  colors: {
    // Semantic colors
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    
    // Background colors
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    surface: string;
    surfaceSecondary: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    
    // State colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Border colors
    border: string;
    borderLight: string;
    borderDark: string;
    
    // Interactive colors
    interactive: string;
    interactivePressed: string;
    interactiveDisabled: string;
    
    // Overlay colors
    overlay: string;
    overlayLight: string;
    overlayDark: string;
  };
  
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  
  // Component-specific styles
  components: {
    button: {
      height: {
        sm: number;
        md: number;
        lg: number;
      };
      padding: {
        sm: { horizontal: number; vertical: number };
        md: { horizontal: number; vertical: number };
        lg: { horizontal: number; vertical: number };
      };
    };
    
    input: {
      height: number;
      padding: { horizontal: number; vertical: number };
      borderWidth: number;
    };
    
    card: {
      padding: number;
      borderRadius: number;
      borderWidth: number;
    };
  };
}

// =============================================
// THEME DEFINITIONS
// =============================================

// Light theme
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    // Primary colors - EXPLICIT HEX VALUES for consistency
    primary: '#3b82f6',        // colors.primary[500] - FIXED
    primaryDark: '#1d4ed8',    // colors.primary[700] - FIXED  
    primaryLight: '#93c5fd',   // colors.primary[300] - FIXED
    secondary: '#64748b',      // colors.neutral[500] - FIXED
    accent: '#f59e0b',         // colors.warning[500] - FIXED
    
    // Background colors - EXPLICIT VALUES
    background: '#ffffff',              // PURE WHITE - FIXED
    backgroundSecondary: '#fafafa',     // colors.neutral[50] - FIXED
    backgroundTertiary: '#f5f5f5',      // colors.neutral[100] - FIXED
    surface: '#ffffff',                 // PURE WHITE - FIXED
    surfaceSecondary: '#fafafa',        // colors.neutral[50] - FIXED
    
    // Text colors - CONSISTENT ACROSS DEVICES
    text: '#171717',           // colors.neutral[900] - FIXED
    textSecondary: '#525252',  // colors.neutral[600] - FIXED
    textTertiary: '#a3a3a3',   // colors.neutral[400] - FIXED
    textInverse: '#ffffff',    // WHITE - FIXED
    
    // State colors - EXPLICIT HEX
    success: '#22c55e',        // colors.success[500] - FIXED
    warning: '#f59e0b',        // colors.warning[500] - FIXED
    error: '#ef4444',          // colors.error[500] - FIXED
    info: '#3b82f6',           // colors.primary[500] - FIXED
    
    // Border colors - CONSISTENT
    border: '#e5e5e5',         // colors.neutral[200] - FIXED
    borderLight: '#f5f5f5',    // colors.neutral[100] - FIXED
    borderDark: '#d4d4d4',     // colors.neutral[300] - FIXED
    
    // Interactive colors - FIXED CONSISTENCY
    interactive: '#3b82f6',           // colors.primary[500] - FIXED
    interactivePressed: '#1d4ed8',    // colors.primary[700] - FIXED
    interactiveDisabled: '#d1d5db',   // colors.neutral[300] - FIXED
    
    // Overlay colors - CONSISTENT ALPHA
    overlay: 'rgba(0, 0, 0, 0.5)',      // 50% black - FIXED
    overlayLight: 'rgba(0, 0, 0, 0.25)', // 25% black - FIXED
    overlayDark: 'rgba(0, 0, 0, 0.75)',  // 75% black - FIXED
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  components: {
    button: {
      height: {
        sm: 32,
        md: 40,
        lg: 48,
      },
      padding: {
        sm: { horizontal: 12, vertical: 6 },
        md: { horizontal: 16, vertical: 10 },
        lg: { horizontal: 20, vertical: 12 },
      },
    },
    input: {
      height: 48,
      padding: { horizontal: 16, vertical: 12 },
      borderWidth: 1,
    },
    card: {
      padding: 16,
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },
  },
};

// Dark theme
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    // Primary colors - EXPLICIT FOR DARK MODE
    primary: '#60a5fa',        // colors.primary[400] - LIGHTER FOR DARK
    primaryDark: '#3b82f6',    // colors.primary[500] - FIXED
    primaryLight: '#93c5fd',   // colors.primary[300] - FIXED
    secondary: '#9ca3af',      // colors.neutral[400] - FIXED
    accent: '#fbbf24',         // colors.warning[400] - FIXED
    
    // Background colors - DARK THEME FIXED
    background: '#0f0f0f',              // VERY DARK - FIXED
    backgroundSecondary: '#171717',     // colors.neutral[900] - FIXED
    backgroundTertiary: '#262626',      // colors.neutral[800] - FIXED
    surface: '#171717',                 // colors.neutral[900] - FIXED
    surfaceSecondary: '#262626',        // colors.neutral[800] - FIXED
    
    // Text colors - DARK MODE OPTIMIZED
    text: '#fafafa',           // colors.neutral[50] - LIGHT TEXT
    textSecondary: '#d4d4d4',  // colors.neutral[300] - FIXED
    textTertiary: '#a3a3a3',   // colors.neutral[400] - FIXED
    textInverse: '#171717',    // DARK TEXT - FIXED
    
    // State colors - DARK MODE VARIANTS
    success: '#4ade80',        // colors.success[400] - LIGHTER
    warning: '#fbbf24',        // colors.warning[400] - LIGHTER
    error: '#f87171',          // colors.error[400] - LIGHTER
    info: '#60a5fa',           // colors.primary[400] - LIGHTER
    
    // Border colors - DARK THEME
    border: '#404040',         // colors.neutral[700] - FIXED
    borderLight: '#525252',    // colors.neutral[600] - FIXED
    borderDark: '#262626',     // colors.neutral[800] - FIXED
    
    // Interactive colors - DARK MODE
    interactive: '#60a5fa',           // colors.primary[400] - LIGHTER
    interactivePressed: '#3b82f6',    // colors.primary[500] - FIXED
    interactiveDisabled: '#525252',   // colors.neutral[600] - FIXED
    
    // Overlay colors - DARK MODE OVERLAYS
    overlay: 'rgba(0, 0, 0, 0.75)',     // DARKER OVERLAY - FIXED
    overlayLight: 'rgba(0, 0, 0, 0.5)',  // MEDIUM OVERLAY - FIXED
    overlayDark: 'rgba(0, 0, 0, 0.9)',   // VERY DARK OVERLAY - FIXED
  },
  typography,
  spacing,
  borderRadius,
  shadows: {
    // DARK MODE SHADOWS - LIGHTER FOR CONTRAST
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,    // INCREASED for dark mode
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,     // INCREASED for dark mode
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,     // INCREASED for dark mode
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,     // INCREASED for dark mode
      shadowRadius: 15,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.25,    // INCREASED for dark mode
      shadowRadius: 25,
      elevation: 5,
    },
  },
  components: {
    button: {
      height: { sm: 32, md: 40, lg: 48 },
      padding: {
        sm: { horizontal: 12, vertical: 6 },
        md: { horizontal: 16, vertical: 10 },
        lg: { horizontal: 20, vertical: 12 },
      },
    },
    input: {
      height: 48,
      padding: { horizontal: 16, vertical: 12 },
      borderWidth: 1,
    },
    card: {
      padding: 16,
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },
  },
};

// =============================================
// THEME CONTEXT
// =============================================

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (themeName: 'light' | 'dark' | 'auto') => void;
  currentThemeName: 'light' | 'dark' | 'auto';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [currentThemeName, setCurrentThemeName] = useState<'light' | 'dark' | 'auto'>('auto');
  const [isDark, setIsDark] = useState(false);

  // Determine theme based on settings
  useEffect(() => {
    const determineTheme = () => {
      if (currentThemeName === 'auto') {
        setIsDark(systemColorScheme === 'dark');
      } else {
        setIsDark(currentThemeName === 'dark');
      }
    };

    determineTheme();
  }, [currentThemeName, systemColorScheme]);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
          setCurrentThemeName(savedTheme as 'light' | 'dark' | 'auto');
        }
      } catch (error) {
        logger.warn('Failed to load theme preference', LogCategory.BUSINESS, {
          service: 'ThemeSystem',
          metadata: { error: (error as Error)?.message || String(error) }
        });
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (themeName: 'light' | 'dark' | 'auto') => {
    setCurrentThemeName(themeName);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (error) {
      logger.warn('Failed to save theme preference', LogCategory.BUSINESS, {
        service: 'ThemeSystem',
        metadata: { themeName, error: (error as Error)?.message || String(error) }
      });
    }
  };

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    currentThemeName,
  };

  return React.createElement(
    ThemeContext.Provider,
    { value },
    children
  );
};

// =============================================
// HOOKS
// =============================================

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Responsive design helpers
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const useResponsive = () => {
  const isSmall = screenWidth < 380;
  const isMedium = screenWidth >= 380 && screenWidth < 768;
  const isLarge = screenWidth >= 768;
  
  const responsive = function<T>(small: T, medium?: T, large?: T): T {
    if (isLarge && large !== undefined) return large;
    if (isMedium && medium !== undefined) return medium;
    return small;
  };

  return {
    isSmall,
    isMedium,
    isLarge,
    screenWidth,
    screenHeight,
    responsive,
  };
};

// Style helpers
export const createThemedStyles = function<T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
) {
  return (theme: Theme): T => styleFactory(theme);
};

// Export design tokens for direct use
export { colors, typography, spacing, borderRadius, shadows }; 