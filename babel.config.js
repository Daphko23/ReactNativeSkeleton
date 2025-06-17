/**
 * @fileoverview ENTERPRISE BABEL CONFIGURATION 2025
 * 
 * @description React Native Babel configuration with Enterprise-Standard module transforms
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

module.exports = {
  presets: [
    // React Native 0.79 Fix: Nur das Standard Preset verwenden
    // Zusätzliche Presets verursachen ES6 export Konflikte
    '@react-native/babel-preset',
  ],
  plugins: [
    // Standard React Native Plugins
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@core': './src/core',  
          '@shared': './src/shared',
          '@features': './src/features',
          '@components': './src/shared/components',
          '@services': './src/shared/services',
          '@utils': './src/shared/utils',
          '@types': './src/shared/types',
          '@assets': './src/assets',
        },
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
  ],
  env: {
    test: {
      presets: [
        // React Native 0.79 Fix: Verwende auch in Tests nur das Standard Preset
        '@react-native/babel-preset',
      ],
      plugins: [
        // React Native 0.79 Fix: Entferne transform-modules-commonjs
        // Verursacht Konflikte mit nativen ES6 exports
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              '@': './src',
              '@core': './src/core',
              '@shared': './src/shared', 
              '@features': './src/features',
              '@components': './src/shared/components',
              '@services': './src/shared/services',
              '@utils': './src/shared/utils',
              '@types': './src/shared/types',
              '@assets': './src/assets',
            },
          },
        ],
      ],
    },
  },
};