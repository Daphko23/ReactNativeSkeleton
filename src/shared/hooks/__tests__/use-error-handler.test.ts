/**
 * useErrorHandler Hook Tests
 * Simple test to validate testing setup
 */

import { renderHook, act } from '@testing-library/react-native';
import { useErrorHandler } from '../use-error-handler';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

// Mock React Native Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useErrorHandler Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isShowingError).toBe(false);
  });

  it('should show error when showError is called', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showError('Test error message');
    });

    expect(result.current.error).toEqual(
      expect.objectContaining({
        message: 'Test error message',
      })
    );
    expect(result.current.isShowingError).toBe(true);
  });

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showError('Test error');
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isShowingError).toBe(false);
  });

  it('should show network error with predefined message', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showNetworkError();
    });

    expect(result.current.error).toEqual(
      expect.objectContaining({
        message: expect.stringContaining('Netzwerkfehler'),
        context: 'network',
      })
    );
  });

  it('should show validation error', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showValidationError('Invalid input');
    });

    expect(result.current.error).toEqual(
      expect.objectContaining({
        message: 'Invalid input',
        context: 'validation',
      })
    );
  });
}); 