#!/usr/bin/env node

/**
 * @fileoverview App Variant Build Script
 * 
 * @description Comprehensive build script for creating different app variants
 * with automatic feature flag configuration, optimization, and validation.
 * 
 * @usage
 * ```bash
 * # Build basic variant
 * npm run build:basic
 * 
 * # Build enterprise variant with custom config
 * npm run build:enterprise
 * 
 * # Build all variants
 * npm run build:all-variants
 * 
 * # Build with custom overrides
 * npm run build:custom -- --variant=enterprise --override="ENABLE_ANALYTICS=false"
 * ```
 * 
 * @author Enterprise Development Team
 * @since 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ESM dirname helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

// =============================================================================
// BUILD CONFIGURATION
// =============================================================================

const BUILD_TARGETS = {
  android: {
    command: 'npx react-native run-android',
    buildCommand: 'cd android && ./gradlew assembleRelease',
    outputPath: 'android/app/build/outputs/apk/release/',
    filePattern: '*.apk'
  },
  ios: {
    command: 'npx react-native run-ios',
    buildCommand: 'npx react-native build-ios --mode Release',
    outputPath: 'ios/build/Build/Products/Release-iphoneos/',
    filePattern: '*.app'
  }
};

const APP_VARIANTS = ['development', 'basic', 'enterprise'];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value || true;
    }
  }
  
  return options;
}

function logStep(step, message) {
  console.log(`\n📍 Step ${step}: ${message}`);
  console.log('═'.repeat(50));
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

function logWarning(message) {
  console.warn(`⚠️ ${message}`);
}

function executeCommand(command, options = {}) {
  try {
    console.log(`🔧 Executing: ${command}`);
    const result = execSync(command, { 
      cwd: rootDir,
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    return { success: true, output: result?.toString() };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      output: error.stdout?.toString(),
      stderr: error.stderr?.toString()
    };
  }
}

function configureFeatureFlags(variant, overrides = {}) {
  console.log(`\n🚀 Configuring feature flags for ${variant} variant...`);
  
  const overrideString = Object.entries(overrides)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');
  
  let command = `node scripts/build/configure-feature-flags.mjs --variant=${variant}`;
  if (overrideString) {
    command += ` --override="${overrideString}"`;
  }
  
  const result = executeCommand(command);
  
  if (result.success) {
    logSuccess(`Feature flags configured for ${variant}`);
    return true;
  } else {
    logError(`Failed to configure feature flags: ${result.error}`);
    return false;
  }
}

function validateEnvironment() {
  console.log(`\n🔍 Validating build environment...`);
  
  // Check Node.js version
  const nodeVersion = process.version;
  console.log(`   Node.js version: ${nodeVersion}`);
  
  // Check if React Native CLI is available
  const rnResult = executeCommand('npx react-native --version', { silent: true });
  if (rnResult.success) {
    console.log(`   React Native CLI: Available`);
  } else {
    logWarning('React Native CLI not found');
  }
  
  // Check if we have the required build tools
  const platforms = [];
  
  // Check Android build tools
  if (fs.existsSync(path.join(rootDir, 'android'))) {
    platforms.push('Android');
  }
  
  // Check iOS build tools (only on macOS)
  if (process.platform === 'darwin' && fs.existsSync(path.join(rootDir, 'ios'))) {
    platforms.push('iOS');
  }
  
  console.log(`   Available platforms: ${platforms.join(', ')}`);
  
  return platforms.length > 0;
}

function runTypeScriptCheck() {
  console.log(`\n🔍 Running TypeScript compilation check...`);
  
  const result = executeCommand('npx tsc --noEmit');
  
  if (result.success) {
    logSuccess('TypeScript compilation check passed');
    return true;
  } else {
    logError('TypeScript compilation errors found');
    return false;
  }
}

function runLinting() {
  console.log(`\n🔍 Running linting checks...`);
  
  const result = executeCommand('npx eslint src/ --ext .ts,.tsx --max-warnings 0', { silent: true });
  
  if (result.success) {
    logSuccess('Linting checks passed');
    return true;
  } else {
    logWarning('Linting warnings/errors found');
    console.log(result.stderr || result.output);
    return false; // Don't fail build on linting issues
  }
}

function runTests() {
  console.log(`\n🧪 Running test suite...`);
  
  const result = executeCommand('npm test -- --passWithNoTests --verbose=false', { silent: true });
  
  if (result.success) {
    logSuccess('Test suite passed');
    return true;
  } else {
    logError('Test failures detected');
    console.log(result.stderr || result.output);
    return false;
  }
}

function buildVariant(variant, platform, overrides = {}) {
  console.log(`\n🏗️ Building ${variant} variant for ${platform}...`);
  
  // Step 1: Configure feature flags
  if (!configureFeatureFlags(variant, overrides)) {
    return false;
  }
  
  // Step 2: Clean previous builds
  console.log(`\n🧹 Cleaning previous builds...`);
  if (platform === 'android') {
    executeCommand('cd android && ./gradlew clean', { silent: true });
  } else if (platform === 'ios') {
    executeCommand('rm -rf ios/build', { silent: true });
  }
  
  // Step 3: Install dependencies
  console.log(`\n📦 Installing dependencies...`);
  const installResult = executeCommand('npm ci', { silent: true });
  if (!installResult.success) {
    logError('Failed to install dependencies');
    return false;
  }
  
  // Step 4: Build the app
  const buildConfig = BUILD_TARGETS[platform];
  if (!buildConfig) {
    logError(`Unknown platform: ${platform}`);
    return false;
  }
  
  console.log(`\n🔨 Building ${platform} app...`);
  const buildResult = executeCommand(buildConfig.buildCommand);
  
  if (buildResult.success) {
    logSuccess(`${variant} variant built successfully for ${platform}`);
    
    // Step 5: Generate build info
    generateBuildInfo(variant, platform);
    
    return true;
  } else {
    logError(`Build failed for ${variant} on ${platform}`);
    return false;
  }
}

function generateBuildInfo(variant, platform) {
  const buildInfo = {
    variant,
    platform,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    reactNativeVersion: process.env.RN_VERSION || 'unknown',
    buildNumber: process.env.BUILD_NUMBER || Date.now().toString(),
    gitCommit: process.env.GIT_COMMIT || 'unknown',
    gitBranch: process.env.GIT_BRANCH || 'unknown',
    buildEnvironment: process.env.CI ? 'ci' : 'local',
    featureFlags: {}
  };
  
  // Read current .env file to capture feature flags
  try {
    const envPath = path.join(rootDir, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        if (line.includes('=') && !line.startsWith('#')) {
          const [key, value] = line.split('=');
          if (key.startsWith('ENABLE_') || key.startsWith('SHOW_')) {
            buildInfo.featureFlags[key.trim()] = value.trim();
          }
        }
      }
    }
  } catch (error) {
    console.warn('Could not read feature flags from .env file');
  }
  
  const buildInfoPath = path.join(rootDir, `build-info-${variant}-${platform}.json`);
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  
  console.log(`\n📄 Build info generated: build-info-${variant}-${platform}.json`);
}

function buildAllVariants(platform) {
  console.log(`\n🏭 Building all variants for ${platform}...`);
  
  const results = {};
  
  for (const variant of APP_VARIANTS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📱 Building ${variant.toUpperCase()} variant`);
    console.log(`${'='.repeat(60)}`);
    
    results[variant] = buildVariant(variant, platform);
  }
  
  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 BUILD SUMMARY`);
  console.log(`${'='.repeat(60)}`);
  
  Object.entries(results).forEach(([variant, success]) => {
    const status = success ? '✅ SUCCESS' : '❌ FAILED';
    console.log(`   ${variant.padEnd(12)} - ${status}`);
  });
  
  const successCount = Object.values(results).filter(Boolean).length;
  console.log(`\n🎯 ${successCount}/${APP_VARIANTS.length} variants built successfully`);
  
  return successCount === APP_VARIANTS.length;
}

// =============================================================================
// MAIN SCRIPT
// =============================================================================

function main() {
  const options = parseArgs();
  
  console.log('🚀 React Native App Variant Builder');
  console.log('====================================\n');
  
  // Show help
  if (options.help) {
    console.log('Usage:');
    console.log('  node build-variants.mjs --variant=<variant> --platform=<platform>');
    console.log('  node build-variants.mjs --all-variants --platform=<platform>');
    console.log('  node build-variants.mjs --pre-build-check');
    console.log('\nOptions:');
    console.log('  --variant       App variant (development, basic, enterprise)');
    console.log('  --platform      Target platform (android, ios)');
    console.log('  --all-variants  Build all variants');
    console.log('  --override      Feature flag overrides (FLAG=value,FLAG2=value2)');
    console.log('  --skip-tests    Skip test execution');
    console.log('  --skip-lint     Skip linting checks');
    console.log('  --pre-build-check  Run pre-build validation only');
    console.log('\nExamples:');
    console.log('  node build-variants.mjs --variant=basic --platform=android');
    console.log('  node build-variants.mjs --all-variants --platform=ios');
    console.log('  node build-variants.mjs --variant=enterprise --platform=android --override="ENABLE_ANALYTICS=false"');
    return;
  }
  
  // Validate environment first
  if (!validateEnvironment()) {
    logError('Environment validation failed');
    process.exit(1);
  }
  
  // Pre-build checks only
  if (options['pre-build-check']) {
    logStep(1, 'Running pre-build validation');
    
    let allPassed = true;
    
    if (!runTypeScriptCheck()) allPassed = false;
    if (!options['skip-lint'] && !runLinting()) allPassed = false;
    if (!options['skip-tests'] && !runTests()) allPassed = false;
    
    if (allPassed) {
      logSuccess('All pre-build checks passed');
      process.exit(0);
    } else {
      logError('Some pre-build checks failed');
      process.exit(1);
    }
  }
  
  // Determine platform
  const platform = options.platform || 'android';
  if (!BUILD_TARGETS[platform]) {
    logError(`Unknown platform: ${platform}`);
    logError(`Available platforms: ${Object.keys(BUILD_TARGETS).join(', ')}`);
    process.exit(1);
  }
  
  // Parse overrides
  const overrides = {};
  if (options.override) {
    const pairs = options.override.split(',');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key && value) {
        overrides[key.trim()] = value.trim();
      }
    }
  }
  
  // Pre-build validation
  if (!options['skip-tests'] || !options['skip-lint']) {
    logStep(1, 'Running pre-build checks');
    
    let shouldContinue = true;
    
    if (!runTypeScriptCheck()) {
      logError('TypeScript compilation failed. Fix errors before building.');
      process.exit(1);
    }
    
    if (!options['skip-lint']) {
      runLinting(); // Don't fail on linting issues
    }
    
    if (!options['skip-tests'] && !runTests()) {
      logWarning('Tests failed. Continuing with build...');
    }
  }
  
  // Build variants
  let success = false;
  
  if (options['all-variants']) {
    logStep(2, `Building all variants for ${platform}`);
    success = buildAllVariants(platform);
  } else {
    const variant = options.variant || 'development';
    
    if (!APP_VARIANTS.includes(variant)) {
      logError(`Unknown variant: ${variant}`);
      logError(`Available variants: ${APP_VARIANTS.join(', ')}`);
      process.exit(1);
    }
    
    logStep(2, `Building ${variant} variant for ${platform}`);
    success = buildVariant(variant, platform, overrides);
  }
  
  // Final result
  if (success) {
    console.log(`\n🎉 Build completed successfully!`);
    process.exit(0);
  } else {
    console.log(`\n💥 Build failed!`);
    process.exit(1);
  }
}

// Run the script
main(); 