/**
 * Mock for react-native-device-info
 * Provides mock implementations for all DeviceInfo methods used in the app
 */

const DeviceInfo = {
  // Device Hardware Info
  getDeviceId: jest.fn().mockResolvedValue('test-device-id-123'),
  getDeviceName: jest.fn().mockResolvedValue('Test Device'),
  getSystemVersion: jest.fn().mockResolvedValue('17.0'),
  getBrand: jest.fn().mockResolvedValue('Apple'),
  getModel: jest.fn().mockResolvedValue('iPhone'),
  getSystemName: jest.fn().mockResolvedValue('iOS'),
  getUniqueId: jest.fn().mockResolvedValue('test-unique-id-456'),
  getDeviceType: jest.fn().mockResolvedValue('Handset'),

  // Device State
  isEmulator: jest.fn().mockResolvedValue(false),
  isTablet: jest.fn().mockResolvedValue(false),
  hasNotch: jest.fn().mockResolvedValue(true),
  hasDynamicIsland: jest.fn().mockResolvedValue(false),

  // Memory Info
  getTotalMemory: jest.fn().mockResolvedValue(8000000000), // 8GB
  getUsedMemory: jest.fn().mockResolvedValue(4000000000), // 4GB

  // Battery Info (can fail)
  getBatteryLevel: jest.fn().mockResolvedValue(0.85),
  isBatteryCharging: jest.fn().mockResolvedValue(false),

  // Network Info (can fail)
  getCarrier: jest.fn().mockResolvedValue('Test Carrier'),

  // App Info
  getVersion: jest.fn().mockResolvedValue('1.0.0'),
  getBuildNumber: jest.fn().mockResolvedValue('123'),
  getBundleId: jest.fn().mockResolvedValue('com.test.app'),
  getApplicationName: jest.fn().mockResolvedValue('Test App'),
  getFirstInstallTime: jest.fn().mockResolvedValue(1640995200000), // 2022-01-01
  getLastUpdateTime: jest.fn().mockResolvedValue(1672531200000), // 2023-01-01
};

export default DeviceInfo;
