/**
 * @fileoverview ENTERPRISE BABEL CONFIGURATION 2025
 * 
 * @description React Native Babel configuration with Enterprise-Standard module transforms
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

module.exports = {
  presets: [
    '@react-native/babel-preset',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
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
        '@react-native/babel-preset',
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
            modules: 'commonjs',
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: [
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