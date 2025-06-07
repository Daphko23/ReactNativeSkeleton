#!/usr/bin/env node

/**
 * Enterprise Dependency Management Script
 * Überprüft und verwaltet Dependency Versionen nach Enterprise-Standards
 */

import fs from 'fs';
import { execSync } from 'child_process';

// Kritische Dependencies die exakte Versionen benötigen
const CRITICAL_DEPENDENCIES = [
  'react',
  'react-native',
  '@sentry/react-native',
  '@supabase/supabase-js',
  'react-native-keychain',
  'react-native-biometrics',
  'react-native-app-auth',
  '@react-navigation/native',
  '@react-navigation/native-stack',
  '@react-navigation/bottom-tabs',
  '@react-navigation/stack',
  'typescript',
  'eslint',
  '@types/react',
  '@types/react-test-renderer'
];

// Stabile Dependencies die Tilde-Versioning verwenden können
const STABLE_DEPENDENCIES = [
  'axios',
  'lodash',
  'date-fns',
  'uuid',
  'prettier',
  'husky',
  'jest'
];

function checkVersioningCompliance() {
  console.log('🔍 Checking Dependency Versioning Compliance...\n');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const issues = [];
  
  // Check dependencies
  checkDependencySection(packageJson.dependencies, 'dependencies', issues);
  checkDependencySection(packageJson.devDependencies, 'devDependencies', issues);
  
  // Report issues
  if (issues.length > 0) {
    console.log('❌ Versioning Issues Found:\n');
    issues.forEach(issue => console.log(`  ${issue}`));
    console.log('\n📖 Run "npm run deps:fix" to auto-fix issues');
    process.exit(1);
  } else {
    console.log('✅ All dependencies follow Enterprise versioning standards!');
  }
}

function checkDependencySection(deps, section, issues) {
  if (!deps) return;
  
  Object.entries(deps).forEach(([name, version]) => {
    if (CRITICAL_DEPENDENCIES.includes(name)) {
      // Critical deps should have exact versions
      if (version.startsWith('^') || version.startsWith('~')) {
        issues.push(`${section}.${name}: "${version}" should be exact version (remove ^ or ~)`);
      }
    } else if (STABLE_DEPENDENCIES.includes(name)) {
      // Stable deps should use tilde versioning
      if (version.startsWith('^')) {
        issues.push(`${section}.${name}: "${version}" should use tilde (~) versioning for stability`);
      }
    }
  });
}

function fixVersioning() {
  console.log('🔧 Fixing Dependency Versioning...\n');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  let modified = false;
  
  // Fix dependencies
  modified = fixDependencySection(packageJson.dependencies, 'dependencies') || modified;
  modified = fixDependencySection(packageJson.devDependencies, 'devDependencies') || modified;
  
  if (modified) {
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ package.json updated with Enterprise versioning standards');
    console.log('📦 Run "npm install" to update lock file');
  } else {
    console.log('✅ No changes needed - already compliant!');
  }
}

function fixDependencySection(deps, section) {
  if (!deps) return false;
  
  let modified = false;
  
  Object.entries(deps).forEach(([name, version]) => {
    if (CRITICAL_DEPENDENCIES.includes(name)) {
      // Remove ^ or ~ for critical dependencies
      if (version.startsWith('^') || version.startsWith('~')) {
        deps[name] = version.substring(1);
        console.log(`  Fixed ${section}.${name}: ${version} → ${deps[name]}`);
        modified = true;
      }
    } else if (STABLE_DEPENDENCIES.includes(name)) {
      // Change ^ to ~ for stable dependencies
      if (version.startsWith('^')) {
        deps[name] = '~' + version.substring(1);
        console.log(`  Fixed ${section}.${name}: ${version} → ${deps[name]}`);
        modified = true;
      }
    }
  });
  
  return modified;
}

function generateDependencyReport() {
  console.log('📊 Generating Dependency Security Report...\n');
  
  try {
    // Run npm audit
    const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditResult);
    
    console.log(`🔍 Vulnerabilities Found: ${audit.metadata.vulnerabilities.total}`);
    console.log(`  - Critical: ${audit.metadata.vulnerabilities.critical}`);
    console.log(`  - High: ${audit.metadata.vulnerabilities.high}`);
    console.log(`  - Moderate: ${audit.metadata.vulnerabilities.moderate}`);
    console.log(`  - Low: ${audit.metadata.vulnerabilities.low}`);
    
    // Run outdated check
    try {
      const outdatedResult = execSync('npm outdated --json', { encoding: 'utf8' });
      const outdated = JSON.parse(outdatedResult);
      
      console.log(`\n📅 Outdated Dependencies: ${Object.keys(outdated).length}`);
      Object.entries(outdated).forEach(([name, info]) => {
        const isCritical = CRITICAL_DEPENDENCIES.includes(name);
        const flag = isCritical ? '🚨' : '⚠️';
        console.log(`  ${flag} ${name}: ${info.current} → ${info.latest}`);
      });
    } catch (e) {
      console.log('\n✅ All dependencies are up to date!');
    }
    
  } catch (error) {
    console.error('Error generating report:', error.message);
  }
}

// CLI Interface
const command = process.argv[2];

switch (command) {
  case 'check':
    checkVersioningCompliance();
    break;
  case 'fix':
    fixVersioning();
    break;
  case 'report':
    generateDependencyReport();
    break;
  default:
    console.log(`
🏢 Enterprise Dependency Management

Usage:
  npm run deps:check   - Check versioning compliance
  npm run deps:fix     - Auto-fix versioning issues  
  npm run deps:report  - Generate security report

Enterprise Standards:
  📌 Critical dependencies: Exact versions (no ^ or ~)
  🛡️  Stable dependencies: Tilde versioning (~)
  🔄 UI/Dev dependencies: Caret versioning (^)
    `);
} 