import NetInfo from '@react-native-community/netinfo';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {useNetworkStatus} from '../use-network-status';

type NetworkCallback = (state: {isConnected: boolean}) => void;

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

describe('useNetworkStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with connected status', async () => {
    // Mock initial fetch to return connected
    (NetInfo.fetch as jest.Mock).mockResolvedValueOnce({
      isConnected: true,
    });

    const listener = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockReturnValueOnce(listener);

    const {result} = renderHook(() => useNetworkStatus());

    // Initial state should be connected (default)
    expect(result.current.isConnected).toBe(true);

    // Wait for effect to complete
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // State should still be connected after fetch
    expect(NetInfo.fetch).toHaveBeenCalledTimes(1);
    expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);
  });

  it('should update status when network changes', async () => {
    // Mock initial fetch
    (NetInfo.fetch as jest.Mock).mockResolvedValueOnce({
      isConnected: true,
    });

    // Set up listener mock to capture the callback
    let networkCallback: NetworkCallback;
    (NetInfo.addEventListener as jest.Mock).mockImplementationOnce(cb => {
      networkCallback = cb;
      return jest.fn(); // Unsubscribe function
    });

    const {result} = renderHook(() => useNetworkStatus());

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // Simulate network change
    act(() => {
      networkCallback({isConnected: false});
    });

    // Status should be updated
    expect(result.current.isConnected).toBe(false);

    // Simulate network returning
    act(() => {
      networkCallback({isConnected: true});
    });

    expect(result.current.isConnected).toBe(true);
  });

  it('should clean up listener on unmount', async () => {
    // Setup unsubscribe mock
    const unsubscribeMock = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockReturnValueOnce(
      unsubscribeMock
    );
    (NetInfo.fetch as jest.Mock).mockResolvedValueOnce({
      isConnected: true,
    });

    const {unmount} = renderHook(() => useNetworkStatus());

    unmount();

    // Unsubscribe should have been called
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});
