import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';

// Definiere deine Markenfarben
const BRAND_COLORS = {
  primary: '#7B4DFF', // Primärfarbe für FurryLove
  secondary: '#FF7043', // Sekundärfarbe
  tertiary: '#5ECFB1', // Tertiärfarbe
  error: '#FF5252',
  background: {
    light: '#F5F5F5',
    dark: '#121212',
  },
  surface: {
    light: '#FFFFFF',
    dark: '#1E1E1E',
  },
};

export const createPaperTheme = (isDarkMode: boolean) => {
  // Basis-Theme basierend auf Dark Mode Zustand
  const baseTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: BRAND_COLORS.primary,
      secondary: BRAND_COLORS.secondary,
      tertiary: BRAND_COLORS.tertiary,
      error: BRAND_COLORS.error,
      background: isDarkMode
        ? BRAND_COLORS.background.dark
        : BRAND_COLORS.background.light,
      surface: isDarkMode
        ? BRAND_COLORS.surface.dark
        : BRAND_COLORS.surface.light,
    },
    // Du kannst auch andere Theme-Eigenschaften wie Schriftarten anpassen
    fonts: {
      ...baseTheme.fonts,
      // Beispiel für angepasste Schriftgrößen
      titleLarge: {
        ...baseTheme.fonts.titleLarge,
        fontSize: 22,
      },
    },
  };
};
