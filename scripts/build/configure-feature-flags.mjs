#!/usr/bin/env node

/**
 * @fileoverview Feature Flag Configuration Build Script
 * 
 * @description Automatically configures feature flags for different app variants
 * during build time. Generates .env files and validates configurations.
 * 
 * @usage
 * ```bash
 * # Configure for basic app variant
 * node scripts/build/configure-feature-flags.mjs --variant=basic
 * 
 * # Configure for enterprise with custom overrides
 * node scripts/build/configure-feature-flags.mjs --variant=enterprise --override="ENABLE_ANALYTICS=false"
 * 
 * # Validate current configuration
 * node scripts/build/configure-feature-flags.mjs --validate
 * ```
 * 
 * @author Enterprise Development Team
 * @since 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM dirname helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

// =============================================================================
// APP VARIANT CONFIGURATIONS
// =============================================================================

const APP_VARIANTS = {
  development: {
    name: 'Development',
    description: 'Full feature set for development and testing',
    env: {
      APP_ENV: 'development',
      APP_VARIANT: 'development',
      DEBUG_MODE: 'true',
      
      // Screen-Level Feature Flags
      ENABLE_ACCOUNT_SETTINGS: 'true',
      ENABLE_CUSTOM_FIELDS_EDIT: 'true',
      ENABLE_PRIVACY_SETTINGS: 'true',
      ENABLE_SKILLS_MANAGEMENT: 'true',
      ENABLE_SOCIAL_LINKS_EDIT: 'true',
      
      // Background Functionality
      ENABLE_ANALYTICS: 'true',
      ENABLE_PERFORMANCE_MONITORING: 'true',
      ENABLE_AUDIT_LOGGING: 'true',
      ENABLE_BACKGROUND_SYNC: 'true',
      ENABLE_REAL_TIME_UPDATES: 'true',
      ENABLE_OFFLINE_MODE: 'true',
      ENABLE_CLOUD_BACKUP: 'true',
      ENABLE_OPTIMISTIC_UPDATES: 'true',
      ENABLE_PROFILE_VERSIONING: 'true',
      ENABLE_CACHE_PRELOADING: 'true',
      ENABLE_ENCRYPTION: 'true',
      ENABLE_BIOMETRIC_AUTH: 'true',
      ENABLE_SESSION_MANAGEMENT: 'true',
      ENABLE_GDPR_COMPLIANCE: 'true',
      ENABLE_AUTO_COMPLETION: 'true',
      ENABLE_DUPLICATE_DETECTION: 'true',
      ENABLE_DATA_VALIDATION: 'true',
      ENABLE_SMART_SUGGESTIONS: 'true',
      
      // UI Component Toggles
      SHOW_COMPLETION_BANNER: 'true',
      SHOW_ENHANCEMENT_SUGGESTIONS: 'true',
      SHOW_QUICK_ACTIONS: 'true',
      SHOW_SECURITY_STATUS: 'true',
      SHOW_PERMISSIONS_PANEL: 'true',
      SHOW_CUSTOM_FIELDS: 'true',
      SHOW_SOCIAL_LINKS: 'true',
      SHOW_PROFESSIONAL_INFO: 'true',
      SHOW_SKILLS_MANAGEMENT: 'true',
      SHOW_AVATAR_UPLOAD: 'true',
      SHOW_PROFILE_ANALYTICS: 'true',
      SHOW_EXPORT_OPTIONS: 'true',
      SHOW_SHARING_OPTIONS: 'true',
      SHOW_TEMPLATE_SELECTOR: 'true',
      SHOW_PRIVACY_CONTROLS: 'true',
      SHOW_VALIDATION_PREVIEW: 'true',
      SHOW_BULK_OPERATIONS: 'true',
      SHOW_VERSION_HISTORY: 'true',
      SHOW_TAB_NAVIGATION: 'true',
      SHOW_FLOATING_ACTIONS: 'true',
      SHOW_BREADCRUMBS: 'true',
      SHOW_SECTION_COLLAPSE: 'true',
    }
  },
  
  basic: {
    name: 'Basic',
    description: 'Minimal feature set for basic users',
    env: {
      APP_ENV: 'production',
      APP_VARIANT: 'basic',
      DEBUG_MODE: 'false',
      
      // Screen-Level Feature Flags
      ENABLE_ACCOUNT_SETTINGS: 'true',
      ENABLE_CUSTOM_FIELDS_EDIT: 'false',
      ENABLE_PRIVACY_SETTINGS: 'true',
      ENABLE_SKILLS_MANAGEMENT: 'false',
      ENABLE_SOCIAL_LINKS_EDIT: 'false',
      
      // Background Functionality
      ENABLE_ANALYTICS: 'false',
      ENABLE_PERFORMANCE_MONITORING: 'false',
      ENABLE_AUDIT_LOGGING: 'false',
      ENABLE_BACKGROUND_SYNC: 'true',
      ENABLE_REAL_TIME_UPDATES: 'false',
      ENABLE_OFFLINE_MODE: 'false',
      ENABLE_CLOUD_BACKUP: 'false',
      ENABLE_OPTIMISTIC_UPDATES: 'false',
      ENABLE_PROFILE_VERSIONING: 'false',
      ENABLE_CACHE_PRELOADING: 'false',
      ENABLE_ENCRYPTION: 'false',
      ENABLE_BIOMETRIC_AUTH: 'false',
      ENABLE_SESSION_MANAGEMENT: 'true',
      ENABLE_GDPR_COMPLIANCE: 'true',
      ENABLE_AUTO_COMPLETION: 'false',
      ENABLE_DUPLICATE_DETECTION: 'false',
      ENABLE_DATA_VALIDATION: 'true',
      ENABLE_SMART_SUGGESTIONS: 'false',
      
      // UI Component Toggles
      SHOW_COMPLETION_BANNER: 'true',
      SHOW_ENHANCEMENT_SUGGESTIONS: 'false',
      SHOW_QUICK_ACTIONS: 'true',
      SHOW_SECURITY_STATUS: 'false',
      SHOW_PERMISSIONS_PANEL: 'false',
      SHOW_CUSTOM_FIELDS: 'false',
      SHOW_SOCIAL_LINKS: 'false',
      SHOW_PROFESSIONAL_INFO: 'false',
      SHOW_SKILLS_MANAGEMENT: 'false',
      SHOW_AVATAR_UPLOAD: 'true',
      SHOW_PROFILE_ANALYTICS: 'false',
      SHOW_EXPORT_OPTIONS: 'false',
      SHOW_SHARING_OPTIONS: 'false',
      SHOW_TEMPLATE_SELECTOR: 'false',
      SHOW_PRIVACY_CONTROLS: 'true',
      SHOW_VALIDATION_PREVIEW: 'false',
      SHOW_BULK_OPERATIONS: 'false',
      SHOW_VERSION_HISTORY: 'false',
      SHOW_TAB_NAVIGATION: 'false',
      SHOW_FLOATING_ACTIONS: 'false',
      SHOW_BREADCRUMBS: 'false',
      SHOW_SECTION_COLLAPSE: 'false',
    }
  },
  
  enterprise: {
    name: 'Enterprise',
    description: 'Full professional feature set',
    env: {
      APP_ENV: 'production',
      APP_VARIANT: 'enterprise',
      DEBUG_MODE: 'false',
      
      // Screen-Level Feature Flags
      ENABLE_ACCOUNT_SETTINGS: 'true',
      ENABLE_CUSTOM_FIELDS_EDIT: 'true',
      ENABLE_PRIVACY_SETTINGS: 'true',
      ENABLE_SKILLS_MANAGEMENT: 'true',
      ENABLE_SOCIAL_LINKS_EDIT: 'true',
      
      // Background Functionality
      ENABLE_ANALYTICS: 'true',
      ENABLE_PERFORMANCE_MONITORING: 'true',
      ENABLE_AUDIT_LOGGING: 'true',
      ENABLE_BACKGROUND_SYNC: 'true',
      ENABLE_REAL_TIME_UPDATES: 'true',
      ENABLE_OFFLINE_MODE: 'true',
      ENABLE_CLOUD_BACKUP: 'true',
      ENABLE_OPTIMISTIC_UPDATES: 'true',
      ENABLE_PROFILE_VERSIONING: 'true',
      ENABLE_CACHE_PRELOADING: 'true',
      ENABLE_ENCRYPTION: 'true',
      ENABLE_BIOMETRIC_AUTH: 'true',
      ENABLE_SESSION_MANAGEMENT: 'true',
      ENABLE_GDPR_COMPLIANCE: 'true',
      ENABLE_AUTO_COMPLETION: 'true',
      ENABLE_DUPLICATE_DETECTION: 'true',
      ENABLE_DATA_VALIDATION: 'true',
      ENABLE_SMART_SUGGESTIONS: 'true',
      
      // UI Component Toggles
      SHOW_COMPLETION_BANNER: 'true',
      SHOW_ENHANCEMENT_SUGGESTIONS: 'true',
      SHOW_QUICK_ACTIONS: 'true',
      SHOW_SECURITY_STATUS: 'true',
      SHOW_PERMISSIONS_PANEL: 'true',
      SHOW_CUSTOM_FIELDS: 'true',
      SHOW_SOCIAL_LINKS: 'true',
      SHOW_PROFESSIONAL_INFO: 'true',
      SHOW_SKILLS_MANAGEMENT: 'true',
      SHOW_AVATAR_UPLOAD: 'true',
      SHOW_PROFILE_ANALYTICS: 'true',
      SHOW_EXPORT_OPTIONS: 'true',
      SHOW_SHARING_OPTIONS: 'true',
      SHOW_TEMPLATE_SELECTOR: 'true',
      SHOW_PRIVACY_CONTROLS: 'true',
      SHOW_VALIDATION_PREVIEW: 'true',
      SHOW_BULK_OPERATIONS: 'true',
      SHOW_VERSION_HISTORY: 'true',
      SHOW_TAB_NAVIGATION: 'true',
      SHOW_FLOATING_ACTIONS: 'true',
      SHOW_BREADCRUMBS: 'true',
      SHOW_SECTION_COLLAPSE: 'true',
    }
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Parse command line arguments
 */
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

/**
 * Parse override string
 */
function parseOverrides(overrideString) {
  if (!overrideString) return {};
  
  const overrides = {};
  const pairs = overrideString.split(',');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      overrides[key.trim()] = value.trim();
    }
  }
  
  return overrides;
}

/**
 * Generate .env file content
 */
function generateEnvContent(variant, overrides = {}) {
  const config = APP_VARIANTS[variant];
  if (!config) {
    throw new Error(`Unknown app variant: ${variant}`);
  }
  
  const mergedEnv = { ...config.env, ...overrides };
  
  let content = `# =============================================================================\n`;
  content += `# ${config.name.toUpperCase()} ENVIRONMENT CONFIGURATION\n`;
  content += `# =============================================================================\n`;
  content += `# ${config.description}\n`;
  content += `# Generated automatically by build script\n`;
  content += `# Generated at: ${new Date().toISOString()}\n\n`;
  
  // App Configuration
  content += `# App Configuration\n`;
  content += `APP_ENV=${mergedEnv.APP_ENV}\n`;
  content += `APP_VARIANT=${mergedEnv.APP_VARIANT}\n`;
  content += `DEBUG_MODE=${mergedEnv.DEBUG_MODE}\n\n`;
  
  // Screen-Level Feature Flags
  content += `# =============================================================================\n`;
  content += `# PROFILE FEATURE FLAGS - SCREEN LEVEL (Build-Time Configuration)\n`;
  content += `# =============================================================================\n\n`;
  content += `# Core Profile Screens\n`;
  content += `ENABLE_ACCOUNT_SETTINGS=${mergedEnv.ENABLE_ACCOUNT_SETTINGS}\n`;
  content += `ENABLE_CUSTOM_FIELDS_EDIT=${mergedEnv.ENABLE_CUSTOM_FIELDS_EDIT}\n`;
  content += `ENABLE_PRIVACY_SETTINGS=${mergedEnv.ENABLE_PRIVACY_SETTINGS}\n`;
  content += `ENABLE_SKILLS_MANAGEMENT=${mergedEnv.ENABLE_SKILLS_MANAGEMENT}\n`;
  content += `ENABLE_SOCIAL_LINKS_EDIT=${mergedEnv.ENABLE_SOCIAL_LINKS_EDIT}\n\n`;
  
  // Background Functionality
  content += `# =============================================================================\n`;
  content += `# BACKGROUND FUNCTIONALITY FEATURE FLAGS\n`;
  content += `# =============================================================================\n\n`;
  content += `# Analytics & Monitoring\n`;
  content += `ENABLE_ANALYTICS=${mergedEnv.ENABLE_ANALYTICS}\n`;
  content += `ENABLE_PERFORMANCE_MONITORING=${mergedEnv.ENABLE_PERFORMANCE_MONITORING}\n`;
  content += `ENABLE_AUDIT_LOGGING=${mergedEnv.ENABLE_AUDIT_LOGGING}\n\n`;
  
  content += `# Data & Sync\n`;
  content += `ENABLE_BACKGROUND_SYNC=${mergedEnv.ENABLE_BACKGROUND_SYNC}\n`;
  content += `ENABLE_REAL_TIME_UPDATES=${mergedEnv.ENABLE_REAL_TIME_UPDATES}\n`;
  content += `ENABLE_OFFLINE_MODE=${mergedEnv.ENABLE_OFFLINE_MODE}\n`;
  content += `ENABLE_CLOUD_BACKUP=${mergedEnv.ENABLE_CLOUD_BACKUP}\n`;
  content += `ENABLE_OPTIMISTIC_UPDATES=${mergedEnv.ENABLE_OPTIMISTIC_UPDATES}\n\n`;
  
  content += `# Advanced Features\n`;
  content += `ENABLE_PROFILE_VERSIONING=${mergedEnv.ENABLE_PROFILE_VERSIONING}\n`;
  content += `ENABLE_CACHE_PRELOADING=${mergedEnv.ENABLE_CACHE_PRELOADING}\n`;
  content += `ENABLE_ENCRYPTION=${mergedEnv.ENABLE_ENCRYPTION}\n`;
  content += `ENABLE_BIOMETRIC_AUTH=${mergedEnv.ENABLE_BIOMETRIC_AUTH}\n`;
  content += `ENABLE_SESSION_MANAGEMENT=${mergedEnv.ENABLE_SESSION_MANAGEMENT}\n`;
  content += `ENABLE_GDPR_COMPLIANCE=${mergedEnv.ENABLE_GDPR_COMPLIANCE}\n\n`;
  
  content += `# Smart Features\n`;
  content += `ENABLE_AUTO_COMPLETION=${mergedEnv.ENABLE_AUTO_COMPLETION}\n`;
  content += `ENABLE_DUPLICATE_DETECTION=${mergedEnv.ENABLE_DUPLICATE_DETECTION}\n`;
  content += `ENABLE_DATA_VALIDATION=${mergedEnv.ENABLE_DATA_VALIDATION}\n`;
  content += `ENABLE_SMART_SUGGESTIONS=${mergedEnv.ENABLE_SMART_SUGGESTIONS}\n\n`;
  
  // UI Component Toggles
  content += `# =============================================================================\n`;
  content += `# UI COMPONENT TOGGLES (Visible Profile Screen Components)\n`;
  content += `# =============================================================================\n\n`;
  content += `# Banner & Suggestions\n`;
  content += `SHOW_COMPLETION_BANNER=${mergedEnv.SHOW_COMPLETION_BANNER}\n`;
  content += `SHOW_ENHANCEMENT_SUGGESTIONS=${mergedEnv.SHOW_ENHANCEMENT_SUGGESTIONS}\n`;
  content += `SHOW_QUICK_ACTIONS=${mergedEnv.SHOW_QUICK_ACTIONS}\n\n`;
  
  content += `# Status & Panels\n`;
  content += `SHOW_SECURITY_STATUS=${mergedEnv.SHOW_SECURITY_STATUS}\n`;
  content += `SHOW_PERMISSIONS_PANEL=${mergedEnv.SHOW_PERMISSIONS_PANEL}\n`;
  content += `SHOW_CUSTOM_FIELDS=${mergedEnv.SHOW_CUSTOM_FIELDS}\n\n`;
  
  content += `# Profile Sections\n`;
  content += `SHOW_SOCIAL_LINKS=${mergedEnv.SHOW_SOCIAL_LINKS}\n`;
  content += `SHOW_PROFESSIONAL_INFO=${mergedEnv.SHOW_PROFESSIONAL_INFO}\n`;
  content += `SHOW_SKILLS_MANAGEMENT=${mergedEnv.SHOW_SKILLS_MANAGEMENT}\n`;
  content += `SHOW_AVATAR_UPLOAD=${mergedEnv.SHOW_AVATAR_UPLOAD}\n\n`;
  
  content += `# Analytics & Export\n`;
  content += `SHOW_PROFILE_ANALYTICS=${mergedEnv.SHOW_PROFILE_ANALYTICS}\n`;
  content += `SHOW_EXPORT_OPTIONS=${mergedEnv.SHOW_EXPORT_OPTIONS}\n`;
  content += `SHOW_SHARING_OPTIONS=${mergedEnv.SHOW_SHARING_OPTIONS}\n\n`;
  
  content += `# Advanced UI\n`;
  content += `SHOW_TEMPLATE_SELECTOR=${mergedEnv.SHOW_TEMPLATE_SELECTOR}\n`;
  content += `SHOW_PRIVACY_CONTROLS=${mergedEnv.SHOW_PRIVACY_CONTROLS}\n`;
  content += `SHOW_VALIDATION_PREVIEW=${mergedEnv.SHOW_VALIDATION_PREVIEW}\n`;
  content += `SHOW_BULK_OPERATIONS=${mergedEnv.SHOW_BULK_OPERATIONS}\n`;
  content += `SHOW_VERSION_HISTORY=${mergedEnv.SHOW_VERSION_HISTORY}\n\n`;
  
  content += `# Navigation UI\n`;
  content += `SHOW_TAB_NAVIGATION=${mergedEnv.SHOW_TAB_NAVIGATION}\n`;
  content += `SHOW_FLOATING_ACTIONS=${mergedEnv.SHOW_FLOATING_ACTIONS}\n`;
  content += `SHOW_BREADCRUMBS=${mergedEnv.SHOW_BREADCRUMBS}\n`;
  content += `SHOW_SECTION_COLLAPSE=${mergedEnv.SHOW_SECTION_COLLAPSE}\n\n`;
  
  return content;
}

/**
 * Validate configuration
 */
function validateConfiguration(variant) {
  const config = APP_VARIANTS[variant];
  if (!config) {
    return { valid: false, errors: [`Unknown app variant: ${variant}`] };
  }
  
  const errors = [];
  
  // Validate screen configuration logic
  if (config.env.ENABLE_CUSTOM_FIELDS_EDIT === 'true' && config.env.SHOW_CUSTOM_FIELDS === 'false') {
    errors.push('Warning: Custom Fields Edit screen is enabled but UI component is hidden');
  }
  
  if (config.env.ENABLE_SKILLS_MANAGEMENT === 'true' && config.env.SHOW_SKILLS_MANAGEMENT === 'false') {
    errors.push('Warning: Skills Management screen is enabled but UI component is hidden');
  }
  
  if (config.env.ENABLE_SOCIAL_LINKS_EDIT === 'true' && config.env.SHOW_SOCIAL_LINKS === 'false') {
    errors.push('Warning: Social Links Edit screen is enabled but UI component is hidden');
  }
  
  return { valid: errors.length === 0, errors, warnings: errors };
}

/**
 * Write configuration files
 */
function writeConfiguration(variant, overrides = {}) {
  try {
    const envContent = generateEnvContent(variant, overrides);
    const envPath = path.join(rootDir, '.env');
    const envExamplePath = path.join(rootDir, `.env.${variant}.example`);
    
    // Write .env file
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Generated .env file for ${variant} variant`);
    
    // Write example file
    fs.writeFileSync(envExamplePath, envContent);
    console.log(`✅ Generated .env.${variant}.example file`);
    
    // Write configuration summary
    const summaryPath = path.join(rootDir, `feature-flags-${variant}.json`);
    const config = APP_VARIANTS[variant];
    const summary = {
      variant,
      name: config.name,
      description: config.description,
      generatedAt: new Date().toISOString(),
      screenFlags: {
        enabled: Object.entries(config.env)
          .filter(([key, value]) => key.startsWith('ENABLE_') && value === 'true')
          .map(([key]) => key),
        disabled: Object.entries(config.env)
          .filter(([key, value]) => key.startsWith('ENABLE_') && value === 'false')
          .map(([key]) => key)
      },
      uiComponents: {
        shown: Object.entries(config.env)
          .filter(([key, value]) => key.startsWith('SHOW_') && value === 'true')
          .map(([key]) => key),
        hidden: Object.entries(config.env)
          .filter(([key, value]) => key.startsWith('SHOW_') && value === 'false')
          .map(([key]) => key)
      },
      overrides
    };
    
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`✅ Generated configuration summary: feature-flags-${variant}.json`);
    
    return { success: true, envPath, summaryPath };
  } catch (error) {
    console.error(`❌ Error writing configuration:`, error.message);
    return { success: false, error: error.message };
  }
}

// =============================================================================
// MAIN SCRIPT
// =============================================================================

function main() {
  const options = parseArgs();
  
  console.log('🚀 Feature Flag Configuration Script');
  console.log('=====================================\n');
  
  // Show help
  if (options.help) {
    console.log('Usage:');
    console.log('  node configure-feature-flags.mjs --variant=<variant> [--override="FLAG=value"]');
    console.log('  node configure-feature-flags.mjs --validate --variant=<variant>');
    console.log('  node configure-feature-flags.mjs --list');
    console.log('\nAvailable variants:');
    Object.entries(APP_VARIANTS).forEach(([key, config]) => {
      console.log(`  ${key.padEnd(12)} - ${config.description}`);
    });
    console.log('\nExamples:');
    console.log('  node configure-feature-flags.mjs --variant=basic');
    console.log('  node configure-feature-flags.mjs --variant=enterprise --override="ENABLE_ANALYTICS=false"');
    return;
  }
  
  // List variants
  if (options.list) {
    console.log('Available app variants:\n');
    Object.entries(APP_VARIANTS).forEach(([key, config]) => {
      console.log(`📱 ${config.name} (${key})`);
      console.log(`   ${config.description}`);
      
      const enabledScreens = Object.entries(config.env)
        .filter(([k, v]) => k.startsWith('ENABLE_') && v === 'true')
        .length;
      const enabledUI = Object.entries(config.env)
        .filter(([k, v]) => k.startsWith('SHOW_') && v === 'true')
        .length;
        
      console.log(`   Screens: ${enabledScreens} enabled`);
      console.log(`   UI Components: ${enabledUI} enabled`);
      console.log('');
    });
    return;
  }
  
  // Validate configuration
  if (options.validate) {
    const variant = options.variant || 'development';
    console.log(`🔍 Validating ${variant} configuration...\n`);
    
    const validation = validateConfiguration(variant);
    if (validation.valid) {
      console.log(`✅ Configuration for ${variant} is valid`);
    } else {
      console.log(`❌ Configuration validation failed:`);
      validation.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    if (validation.warnings?.length > 0) {
      console.log(`\n⚠️ Warnings:`);
      validation.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    return;
  }
  
  // Configure variant
  const variant = options.variant;
  if (!variant) {
    console.error('❌ Error: --variant parameter is required');
    console.log('Use --help for usage information');
    process.exit(1);
  }
  
  if (!APP_VARIANTS[variant]) {
    console.error(`❌ Error: Unknown variant "${variant}"`);
    console.log('Available variants:', Object.keys(APP_VARIANTS).join(', '));
    process.exit(1);
  }
  
  // Parse overrides
  const overrides = parseOverrides(options.override);
  
  console.log(`📱 Configuring app for variant: ${APP_VARIANTS[variant].name}`);
  console.log(`📝 Description: ${APP_VARIANTS[variant].description}`);
  
  if (Object.keys(overrides).length > 0) {
    console.log(`🔧 Applying overrides:`);
    Object.entries(overrides).forEach(([key, value]) => {
      console.log(`   ${key}=${value}`);
    });
  }
  
  console.log('');
  
  // Validate before writing
  const validation = validateConfiguration(variant);
  if (validation.warnings?.length > 0) {
    console.log(`⚠️ Configuration warnings:`);
    validation.warnings.forEach(warning => console.log(`   - ${warning}`));
    console.log('');
  }
  
  // Write configuration
  const result = writeConfiguration(variant, overrides);
  
  if (result.success) {
    console.log(`\n🎉 Successfully configured app for ${variant} variant!`);
    console.log(`\n📁 Generated files:`);
    console.log(`   .env`);
    console.log(`   .env.${variant}.example`);
    console.log(`   feature-flags-${variant}.json`);
    console.log(`\n🚀 Ready to build with ${variant} configuration!`);
  } else {
    console.error(`\n❌ Failed to configure app: ${result.error}`);
    process.exit(1);
  }
}

// Run the script
main(); 