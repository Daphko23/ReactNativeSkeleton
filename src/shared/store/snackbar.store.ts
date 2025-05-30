import {create} from 'zustand';

interface SnackbarState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  show: (message: string, type?: SnackbarState['type']) => void;
  hide: () => void;
}

/**
 * Global Snackbar Store – steuert Anzeige von Snackbars systemweit.
 */
export const useSnackbarStore = create<SnackbarState>(set => ({
  visible: false,
  message: '',
  type: 'info',

  show: (message, type = 'info') => set({message, type, visible: true}),

  hide: () => set({visible: false, message: '', type: 'info'}),
}));
