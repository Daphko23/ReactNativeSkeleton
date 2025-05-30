import {getDefaultConfig, mergeConfig} from '@react-native/metro-config';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    babelTransformerPath: 'react-native-svg-transformer',
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
    extraNodeModules: {
      stream: 'stream-browserify',
      events: 'events',
      util: 'util',
      crypto: 'crypto-browserify',
      url: 'url',
      buffer: 'buffer',
      process: 'process',
      zlib: 'browserify-zlib',
      assert: 'assert',
      // Mock Module für Node.js spezifische Module
      http: path.resolve(__dirname, 'node_modules_mock/http.js'),
      https: path.resolve(__dirname, 'node_modules_mock/https.js'),
      net: path.resolve(__dirname, 'node_modules_mock/net.js'),
      tls: path.resolve(__dirname, 'node_modules_mock/tls.js'),
      fs: path.resolve(__dirname, 'node_modules_mock/fs.js'),
      path: path.resolve(__dirname, 'node_modules_mock/path.js'),
      os: path.resolve(__dirname, 'node_modules_mock/os.js'),
    },
  },
};

export default mergeConfig(defaultConfig, config);
