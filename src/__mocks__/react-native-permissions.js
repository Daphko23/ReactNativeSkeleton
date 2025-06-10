/**
 * @fileoverview REACT-NATIVE-PERMISSIONS-MOCK: Permission Management Mock
 * @description Jest mock for react-native-permissions providing permission checking and requesting simulation for testing
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Mocks
 * @namespace Mocks.ReactNativePermissions
 * @category Testing
 * @subcategory Mocks
 */

/**
 * Permission Results Constants
 * 
 * Defines the possible results for permission requests and checks.
 * These constants match the actual react-native-permissions library.
 * 
 * @constant {object} RESULTS
 * @since 1.0.0
 * @version 1.0.0
 * @category Constants
 * @subcategory Permissions
 */
export const RESULTS = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  LIMITED: 'limited',
  GRANTED: 'granted',
  BLOCKED: 'blocked',
};

/**
 * Android Permissions Constants
 * 
 * Defines Android-specific permission identifiers.
 * These constants match the actual Android permission system.
 * 
 * @constant {object} PERMISSIONS
 * @since 1.0.0
 * @version 1.0.0
 * @category Constants
 * @subcategory AndroidPermissions
 */
export const PERMISSIONS = {
  ANDROID: {
    CAMERA: 'android.permission.CAMERA',
    READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
    READ_MEDIA_IMAGES: 'android.permission.READ_MEDIA_IMAGES',
  },
  IOS: {
    CAMERA: 'ios.permission.CAMERA',
    PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
  },
};

/**
 * Mock Permission Check
 * 
 * Simulates checking the current status of a permission.
 * Returns GRANTED by default for testing scenarios.
 * 
 * @function check
 * @param {string} permission - The permission to check
 * @returns {Promise<string>} Promise resolving to permission status
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory PermissionChecking
 * 
 * @example
 * Testing permission check:
 * ```js
 * import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
 * 
 * describe('Permission Checking', () => {
 *   it('should check camera permission', async () => {
 *     const status = await check(PERMISSIONS.ANDROID.CAMERA);
 *     expect(status).toBe(RESULTS.GRANTED);
 *   });
 * });
 * ```
 */
export const check = jest.fn(() => Promise.resolve(RESULTS.GRANTED));

/**
 * Mock Permission Request
 * 
 * Simulates requesting a permission from the user.
 * Returns GRANTED by default for testing scenarios.
 * 
 * @function request
 * @param {string} permission - The permission to request
 * @returns {Promise<string>} Promise resolving to permission result
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory PermissionRequesting
 * 
 * @example
 * Testing permission request:
 * ```js
 * import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
 * 
 * describe('Permission Requesting', () => {
 *   it('should request camera permission', async () => {
 *     const result = await request(PERMISSIONS.ANDROID.CAMERA);
 *     expect(result).toBe(RESULTS.GRANTED);
 *   });
 * });
 * ```
 */
export const request = jest.fn(() => Promise.resolve(RESULTS.GRANTED));

/**
 * Mock Multiple Permission Check
 * 
 * Simulates checking multiple permissions at once.
 * Returns an object with all permissions set to GRANTED.
 * 
 * @function checkMultiple
 * @param {string[]} permissions - Array of permissions to check
 * @returns {Promise<object>} Promise resolving to permission status object
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory PermissionChecking
 * 
 * @example
 * Testing multiple permission check:
 * ```js
 * import { checkMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
 * 
 * describe('Multiple Permission Checking', () => {
 *   it('should check multiple permissions', async () => {
 *     const statuses = await checkMultiple([
 *       PERMISSIONS.ANDROID.CAMERA,
 *       PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
 *     ]);
 *     
 *     expect(statuses[PERMISSIONS.ANDROID.CAMERA]).toBe(RESULTS.GRANTED);
 *     expect(statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]).toBe(RESULTS.GRANTED);
 *   });
 * });
 * ```
 */
export const checkMultiple = jest.fn((permissions) => {
  const result = {};
  permissions.forEach(permission => {
    result[permission] = RESULTS.GRANTED;
  });
  return Promise.resolve(result);
});

/**
 * Mock Multiple Permission Request
 * 
 * Simulates requesting multiple permissions at once.
 * Returns an object with all permissions set to GRANTED.
 * 
 * @function requestMultiple
 * @param {string[]} permissions - Array of permissions to request
 * @returns {Promise<object>} Promise resolving to permission result object
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory PermissionRequesting
 * 
 * @example
 * Testing multiple permission request:
 * ```js
 * import { requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
 * 
 * describe('Multiple Permission Requesting', () => {
 *   it('should request multiple permissions', async () => {
 *     const results = await requestMultiple([
 *       PERMISSIONS.ANDROID.CAMERA,
 *       PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
 *     ]);
 *     
 *     expect(results[PERMISSIONS.ANDROID.CAMERA]).toBe(RESULTS.GRANTED);
 *     expect(results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]).toBe(RESULTS.GRANTED);
 *   });
 * });
 * ```
 */
export const requestMultiple = jest.fn((permissions) => {
  const result = {};
  permissions.forEach(permission => {
    result[permission] = RESULTS.GRANTED;
  });
  return Promise.resolve(result);
});

/**
 * Mock Permission Settings Opening
 * 
 * Simulates opening the device settings for permission management.
 * Returns a resolved promise for testing scenarios.
 * 
 * @function openSettings
 * @returns {Promise<void>} Promise resolving when settings are opened
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @category Functions
 * @subcategory PermissionSettings
 * 
 * @example
 * Testing settings opening:
 * ```js
 * import { openSettings } from 'react-native-permissions';
 * 
 * describe('Permission Settings', () => {
 *   it('should open permission settings', async () => {
 *     await expect(openSettings()).resolves.toBeUndefined();
 *   });
 * });
 * ```
 */
export const openSettings = jest.fn(() => Promise.resolve());

/**
 * Default Export
 * 
 * Provides all permission functions as a default export for compatibility.
 * 
 * @constant {object} default
 * @since 1.0.0
 * @version 1.0.0
 * @category Exports
 * @subcategory DefaultExport
 */
export default {
  RESULTS,
  PERMISSIONS,
  check,
  request,
  checkMultiple,
  requestMultiple,
  openSettings,
};