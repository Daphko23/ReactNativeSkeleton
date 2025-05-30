const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Enterprise Metro Configuration
 * Optimiert für Bundle Size, Performance und Development Experience
 */

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Bundle Size Optimizations
 */
const optimizations = {
  resolver: {
    // Asset Optimierungen
    assetExts: [
      ...defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
      'webp' // Moderne, komprimierte Formate (SVG via Transformer)
    ],
    // Source Map Extensions  
    sourceExts: [
      ...defaultConfig.resolver.sourceExts,
      'jsx', 'js', 'ts', 'tsx', 'json', 'svg'
    ],
    // Module Resolution für Tree Shaking
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@assets': path.resolve(__dirname, 'src/assets')
    },
    // Node.js Polyfills für React Native
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
      // Mock Module für Node.js spezifische Module (falls node_modules_mock existiert)
      ...(require('fs').existsSync(path.resolve(__dirname, 'node_modules_mock')) && {
        http: path.resolve(__dirname, 'node_modules_mock/http.js'),
        https: path.resolve(__dirname, 'node_modules_mock/https.js'),
        net: path.resolve(__dirname, 'node_modules_mock/net.js'),
        tls: path.resolve(__dirname, 'node_modules_mock/tls.js'),
        fs: path.resolve(__dirname, 'node_modules_mock/fs.js'),
        path: path.resolve(__dirname, 'node_modules_mock/path.js'),
        os: path.resolve(__dirname, 'node_modules_mock/os.js'),
      })
    }
  },
  
  transformer: {
    // SVG Transformation für kleinere Bundle Size
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // Bundle Size Optimization
      },
    }),
    // Asset Size Limits
    publicPath: '/assets/',
    assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
  },

  serializer: {
    // Bundle Splitting für große Apps
    createModuleIdFactory: function() {
      const fileToIdMap = new Map();
      let nextId = 0;
      return (path) => {
        if (!fileToIdMap.has(path)) {
          fileToIdMap.set(path, nextId++);
        }
        return fileToIdMap.get(path);
      };
    },
    // Production optimizations
    ...(process.env.NODE_ENV === 'production' && {
      processModuleFilter: (modules) => {
        // Entferne Development-only Module
        return modules.filter(module => 
          !module.path.includes('__DEV__') &&
          !module.path.includes('__tests__') &&
          !module.path.includes('.test.') &&
          !module.path.includes('.spec.')
        );
      }
    })
  },

  // Cache Optimierungen
  cacheStores: [
    {
      name: 'filesystem',
      path: path.join(__dirname, '.metro-cache')
    }
  ]
};

/**
 * Development vs Production Configurations
 */
const config = process.env.NODE_ENV === 'production' 
  ? {
      // Production: Maximale Optimierung
      ...optimizations,
      minifierConfig: {
        // Terser optimizations für kleinere Bundles
        mangle: {
          keep_fnames: true,
        },
        compress: {
          drop_console: true, // Console.log entfernen
          drop_debugger: true,
          dead_code: true,
          unused: true
        },
        output: {
          comments: false,
        }
      }
    }
  : {
      // Development: Fast Reload
      ...optimizations,
      server: {
        port: 8081,
        // Development Server Optimierungen
        enhanceMiddleware: (middleware) => {
          return (req, res, next) => {
            // Bundle Size Monitoring
            if (req.url.includes('.bundle')) {
              const startTime = Date.now();
              const originalSend = res.send;
              res.send = function(data) {
                const bundleSize = Buffer.byteLength(data, 'utf8');
                const loadTime = Date.now() - startTime;
                console.log(`📦 Bundle Size: ${(bundleSize / 1024 / 1024).toFixed(2)}MB | Load Time: ${loadTime}ms`);
                originalSend.call(this, data);
              };
            }
            next();
          };
        }
      }
    };

module.exports = mergeConfig(defaultConfig, config); 