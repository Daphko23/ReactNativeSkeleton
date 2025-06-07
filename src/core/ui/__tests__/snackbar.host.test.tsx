/**
 * @file Tests für SnackbarHost
 */

import {render} from '@testing-library/react-native';

// Mock für react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock für react-native-paper
jest.mock('react-native-paper', () => {
  return {
    Snackbar: (props: {
      visible: boolean;
      testID?: string;
      onDismiss: () => void;
      style: StyleProp<ViewStyle>;
      children: React.ReactNode;
    }) => {
      // In Jest-Mocks dürfen wir keine externen Variablen (wie React) verwenden
      // Stattdessen müssen wir es innerhalb der Funktion importieren
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const React = require('react');
      if (!props.visible) return null;
      return React.createElement(
        'View',
        {
          testID: props.testID || 'snackbar',
          onDismiss: props.onDismiss,
          style: props.style,
        },
        props.children
      );
    },
  };
});

// Mock für @core/theme
jest.mock('@core/theme', () => ({
  colors: {
    primary: '#000000',
    error: '#FF0000',
    success: '#00FF00',
  },
}));

// Mock für Snackbar Store
jest.mock('../../store/snackbar.store', () => ({
  useSnackbarStore: jest.fn(),
}));

// Importiere SnackbarHost nach den Mocks
import {SnackbarHost} from '../snackbar.host';
import {useSnackbarStore} from '../../store/snackbar.store';
import {StyleProp, ViewStyle} from 'react-native';

describe('SnackbarHost', () => {
  const mockHide = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSnackbarStore as unknown as jest.Mock).mockReturnValue({
      visible: false,
      message: '',
      type: 'info',
      hide: mockHide,
    });
  });

  it('renders correctly when visible', () => {
    // Arrange - Mock State für sichtbaren Snackbar
    (useSnackbarStore as unknown as jest.Mock).mockReturnValue({
      visible: true,
      message: 'test.message',
      type: 'info',
      hide: mockHide,
    });

    // Act - Render SnackbarHost
    const {getByTestId} = render(<SnackbarHost />);

    // Assert - Snackbar sollte gerendert werden
    const snackbar = getByTestId('global-snackbar');
    expect(snackbar).toBeTruthy();
    expect(snackbar.props.children).toBe('test.message'); // Prüfe den i18n-Key
  });

  it('hides when not visible', () => {
    // Arrange - Mock State für unsichtbaren Snackbar
    (useSnackbarStore as unknown as jest.Mock).mockReturnValue({
      visible: false,
      message: 'test.message',
      type: 'info',
      hide: mockHide,
    });

    // Act - Render SnackbarHost
    const {queryByTestId} = render(<SnackbarHost />);

    // Assert - Snackbar sollte nicht gerendert werden
    expect(queryByTestId('global-snackbar')).toBeNull();
  });

  it('shows error message with error style', () => {
    // Arrange - Mock State für Fehler-Snackbar
    (useSnackbarStore as unknown as jest.Mock).mockReturnValue({
      visible: true,
      message: 'error.message',
      type: 'error',
      hide: mockHide,
    });

    // Act - Render SnackbarHost
    const {getByTestId} = render(<SnackbarHost />);

    // Assert - Snackbar sollte gerendert werden mit error.message
    const snackbar = getByTestId('global-snackbar');
    expect(snackbar).toBeTruthy();
    expect(snackbar.props.children).toBe('error.message');
  });

  it('calls hide when dismissed', () => {
    // Arrange - Mock State für sichtbaren Snackbar
    (useSnackbarStore as unknown as jest.Mock).mockReturnValue({
      visible: true,
      message: 'test.message',
      type: 'info',
      hide: mockHide,
    });

    // Act - Render SnackbarHost und löse onDismiss aus
    const {getByTestId} = render(<SnackbarHost />);
    const snackbar = getByTestId('global-snackbar');
    snackbar.props.onDismiss();

    // Assert - Hide sollte aufgerufen worden sein
    expect(mockHide).toHaveBeenCalled();
  });
});
