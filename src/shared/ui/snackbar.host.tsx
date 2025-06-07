import React from 'react';
import {Snackbar} from 'react-native-paper';
import {useSnackbarStore} from '../store/snackbar.store';
import {useTranslation} from 'react-i18next';
import {colors} from '@core/theme';
/**
 * Renders a globally attached Snackbar that listens to the snackbar store state.
 */
export const SnackbarHost = () => {
  const {visible, message, type, hide} = useSnackbarStore();
  const {t} = useTranslation();

  return (
    <Snackbar
      testID="global-snackbar"
      visible={visible}
      onDismiss={hide}
      duration={3000}
      style={{
        backgroundColor:
          type === 'error'
            ? colors.error
            : type === 'success'
              ? colors.success
              : colors.error,
      }}>
      {t(message) || message}
    </Snackbar>
  );
};
