import {
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from 'react-native-paper';
import {colors} from './colors';

const fontConfig = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 24,
  } as const,
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 24,
  } as const,
  light: {
    fontFamily: 'System',
    fontWeight: '300',
    fontSize: 16,
    letterSpacing: 0.25,
    lineHeight: 22,
  } as const,
  thin: {
    fontFamily: 'System',
    fontWeight: '100',
    fontSize: 16,
    letterSpacing: 0.2,
    lineHeight: 20,
  } as const,
};

export const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onPrimary: '#FFFFFF',
    onSurface: colors.text,
    outline: colors.border,
  },
  fonts: configureFonts({config: fontConfig}),
};
