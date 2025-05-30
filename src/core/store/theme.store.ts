import {create} from 'zustand';

interface ThemeState {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  darkMode: false,
  toggleTheme: () => {
    set({darkMode: !get().darkMode});
  },
}));
