/**
 * @fileoverview REACT-NATIVE-BLOB-UTIL-MOCK: File System and Network Mock
 * @description Jest mock for react-native-blob-util providing file system operations and network requests for testing
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Mocks
 * @namespace Mocks.ReactNativeBlobUtil
 * @category Testing
 * @subcategory Mocks
 */

/**
 * React Native Blob Util Mock
 * 
 * Comprehensive mock implementation for react-native-blob-util library
 * providing file system operations, network requests, and directory management
 * for testing environment. Ensures tests run without native dependencies.
 * 
 * @constant {object} RNFetchBlob
 * @since 1.0.0
 * @version 1.0.0
 * @category Mocks
 * @subcategory FileSystem
 * 
 * @example
 * Testing file operations:
 * ```js
 * import RNFetchBlob from 'react-native-blob-util';
 * 
 * describe('File Operations', () => {
 *   it('should read file', async () => {
 *     const content = await RNFetchBlob.fs.readFile('test.txt');
 *     expect(content).toBe('base64-data');
 *   });
 * 
 *   it('should write file', async () => {
 *     await RNFetchBlob.fs.writeFile('test.txt', 'content');
 *     expect(RNFetchBlob.fs.writeFile).toHaveBeenCalled();
 *   });
 * });
 * ```
 * 
 * @example
 * Testing network requests:
 * ```js
 * describe('Network Operations', () => {
 *   it('should fetch data', async () => {
 *     const response = await RNFetchBlob.fetch('GET', 'https://api.example.com');
 *     const data = await response.json();
 *     expect(data).toEqual({});
 *   });
 * });
 * ```
 * 
 * @features
 * - File system operation mocking
 * - Network request simulation
 * - Directory path mocking
 * - Promise-based API simulation
 * - Jest function mocking
 * - Error-free test execution
 * - Consistent mock responses
 * - Development environment compatibility
 * 
 * @architecture
 * - Jest mock functions for all operations
 * - Promise-based return values
 * - Realistic mock data structure
 * - Modular mock organization
 * - Type-safe mock responses
 * 
 * @testing_benefits
 * - No native module dependencies
 * - Fast test execution
 * - Predictable mock responses
 * - Easy test assertion setup
 * - Consistent cross-platform behavior
 */
const RNFetchBlob = {
  /**
   * File System Operations Mock
   * 
   * Mocks all file system related operations including reading, writing,
   * file statistics, existence checks, and directory management.
   * 
   * @namespace fs
   * @since 1.0.0
   * @category FileSystem
   */
  fs: {
    /**
     * Mock file reading operation.
     * Returns base64 encoded data simulation.
     * 
     * @function readFile
     * @returns {Promise<string>} Promise resolving to base64 data
     * @example
     * ```js
     * const content = await RNFetchBlob.fs.readFile('document.pdf');
     * expect(content).toBe('base64-data');
     * ```
     */
    readFile: jest.fn(() => Promise.resolve('base64-data')),

    /**
     * Mock file writing operation.
     * Simulates successful file write.
     * 
     * @function writeFile
     * @returns {Promise<void>} Promise resolving on successful write
     * @example
     * ```js
     * await RNFetchBlob.fs.writeFile('test.txt', 'content', 'utf8');
     * expect(RNFetchBlob.fs.writeFile).toHaveBeenCalledWith('test.txt', 'content', 'utf8');
     * ```
     */
    writeFile: jest.fn(() => Promise.resolve()),

    /**
     * Mock file statistics operation.
     * Returns mock file size information.
     * 
     * @function stat
     * @returns {Promise<{size: number}>} Promise resolving to file stats
     * @example
     * ```js
     * const stats = await RNFetchBlob.fs.stat('image.jpg');
     * expect(stats.size).toBe(100000);
     * ```
     */
    stat: jest.fn(() => Promise.resolve({ size: 100000 })),

    /**
     * Mock file existence check.
     * Always returns true for test predictability.
     * 
     * @function exists
     * @returns {Promise<boolean>} Promise resolving to existence status
     * @example
     * ```js
     * const exists = await RNFetchBlob.fs.exists('config.json');
     * expect(exists).toBe(true);
     * ```
     */
    exists: jest.fn(() => Promise.resolve(true)),

    /**
     * Mock file deletion operation.
     * Simulates successful file removal.
     * 
     * @function unlink
     * @returns {Promise<void>} Promise resolving on successful deletion
     * @example
     * ```js
     * await RNFetchBlob.fs.unlink('temp.txt');
     * expect(RNFetchBlob.fs.unlink).toHaveBeenCalledWith('temp.txt');
     * ```
     */
    unlink: jest.fn(() => Promise.resolve()),

    /**
     * Mock directory paths.
     * Provides standard directory path simulations.
     * 
     * @namespace dirs
     * @property {string} DocumentDir - Document directory path
     * @property {string} CacheDir - Cache directory path
     * @property {string} DownloadDir - Download directory path
     */
    dirs: {
      DocumentDir: '/mocked/document/dir',
      CacheDir: '/mocked/cache/dir',
      DownloadDir: '/mocked/download/dir',
    },
  },

  /**
   * Mock network configuration.
   * Provides configurable fetch operations.
   * 
   * @function config
   * @returns {object} Configuration object with fetch method
   * @example
   * ```js
   * const response = await RNFetchBlob.config({ timeout: 5000 }).fetch('GET', 'https://api.test.com');
   * ```
   */
  config: jest.fn(() => ({
    fetch: jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      blob: () => Promise.resolve(new Blob()),
    })),
  })),

  /**
   * Mock network fetch operation.
   * Simulates HTTP requests with standard response methods.
   * 
   * @function fetch
   * @returns {Promise<object>} Promise resolving to response object
   * @example
   * ```js
   * const response = await RNFetchBlob.fetch('POST', 'https://api.test.com', {}, data);
   * const json = await response.json();
   * ```
   */
  fetch: jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
  })),
};

export default RNFetchBlob; 