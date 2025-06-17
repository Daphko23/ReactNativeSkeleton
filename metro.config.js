const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration für Supabase React Native App
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// SVG Support
config.resolver.assetExts.push('svg');

// Polyfills für Supabase und Node.js Module
config.resolver.alias = {
  ...config.resolver.alias,
  stream: 'stream-browserify',
  events: 'events',
  util: 'util',
  crypto: 'crypto-browserify', 
  url: 'url',
  buffer: 'buffer',
  process: 'process/browser',
  zlib: 'browserify-zlib',
  assert: 'assert',
  http: 'stream-http',
  https: 'https-browserify',
  os: 'os-browserify/browser',
  path: 'path-browserify',
  vm: 'vm-browserify',
  querystring: 'querystring-es3',
};

// Extra Node Modules Resolution für Supabase
config.resolver.extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  events: require.resolve('events'),
  util: require.resolve('util'), 
  crypto: require.resolve('crypto-browserify'),
  url: require.resolve('url'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process/browser'),
  zlib: require.resolve('browserify-zlib'),
  assert: require.resolve('assert'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  os: require.resolve('os-browserify/browser'),
  path: require.resolve('path-browserify'),
  // Leere Module für Node.js-spezifische APIs
  fs: require.resolve('empty-module'),
  net: require.resolve('empty-module'),
  tls: require.resolve('empty-module'),
  child_process: require.resolve('empty-module'),
  dns: require.resolve('empty-module'),
  cluster: require.resolve('empty-module'),
  readline: require.resolve('empty-module'),
  repl: require.resolve('empty-module'),
  vm: require.resolve('vm-browserify'),
  querystring: require.resolve('querystring-es3'),
};

// Resolver Platform Priorität
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Source Extensions 
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'jsx', 'js', 'ts', 'tsx', 'json', 'svg'
];

// Standard Metro Config - keine besonderen Overrides nötig

// Resolver - ensure all node_modules get transpiled
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'native', 'web'],
  sourceExts: [
    ...config.resolver.sourceExts,
    'jsx', 'js', 'ts', 'tsx', 'json', 'svg'
  ],
  // Stelle sicher dass React Native Libraries korrekt aufgelöst werden
  assetExts: [...config.resolver.assetExts, 'svg'],
};

// Server Konfiguration 
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Custom middleware für bundle transformation
      return middleware(req, res, next);
    };
  },
};

module.exports = config; 