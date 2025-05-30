import {useColorScheme} from 'react-native';
import {lightColors, darkColors, Colors} from './colors';
import {typography, Typography} from './typography';
import {spacing, Spacing} from './spacing';

export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  isDark: boolean;
}

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    isDark,
  };
};
