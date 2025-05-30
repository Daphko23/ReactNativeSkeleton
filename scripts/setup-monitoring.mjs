#!/usr/bin/env node

/**
 * 🔍 Monitoring Setup Script
 *
 * Automatisiert die Konfiguration von:
 * - Sentry Error Tracking
 * - Firebase Crashlytics
 * - Performance Monitoring
 * - Health Checks
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = query => new Promise(resolve => rl.question(query, resolve));

async function setupMonitoring() {
  console.log('🔍 Setting up Monitoring Services...\n');

  try {
    // Collect configuration
    const config = await collectConfiguration();

    // Setup Sentry
    if (config.sentry.enabled) {
      await setupSentry(config.sentry);
    }

    // Setup Firebase
    if (config.firebase.enabled) {
      await setupFirebase(config.firebase);
    }

    // Setup Performance Monitoring
    if (config.performance.enabled) {
      await setupPerformanceMonitoring(config.performance);
    }

    // Update environment files
    await updateEnvironmentFiles(config);

    // Generate monitoring documentation
    await generateMonitoringDocs(config);

    console.log('\n✅ Monitoring setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with the generated values');
    console.log('2. Run npm install to install new dependencies');
    console.log('3. Initialize monitoring in your app entry point');
    console.log('4. Test error reporting and performance tracking');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function collectConfiguration() {
  console.log('📋 Configuration Setup\n');

  const config = {
    sentry: {
      enabled: false,
      dsn: '',
      org: '',
      project: '',
      authToken: '',
    },
    firebase: {
      enabled: false,
      projectId: '',
      apiKey: '',
      appId: '',
    },
    performance: {
      enabled: false,
      provider: 'sentry', // sentry, firebase, newrelic
      sampleRate: 0.1,
    },
  };

  // Sentry Configuration
  const useSentry = await question('🔍 Enable Sentry error tracking? (y/n): ');
  if (useSentry.toLowerCase() === 'y') {
    config.sentry.enabled = true;
    config.sentry.dsn = await question('Enter Sentry DSN: ');
    config.sentry.org = await question('Enter Sentry Organization: ');
    config.sentry.project = await question('Enter Sentry Project: ');
    config.sentry.authToken = await question(
      'Enter Sentry Auth Token (optional): '
    );
  }

  // Firebase Configuration
  const useFirebase = await question(
    '\n🔥 Enable Firebase Crashlytics? (y/n): '
  );
  if (useFirebase.toLowerCase() === 'y') {
    config.firebase.enabled = true;
    config.firebase.projectId = await question('Enter Firebase Project ID: ');
    config.firebase.apiKey = await question('Enter Firebase API Key: ');
    config.firebase.appId = await question('Enter Firebase App ID: ');
  }

  // Performance Monitoring
  const usePerformance = await question(
    '\n📊 Enable Performance Monitoring? (y/n): '
  );
  if (usePerformance.toLowerCase() === 'y') {
    config.performance.enabled = true;
    const provider = await question(
      'Choose provider (sentry/firebase/newrelic): '
    );
    config.performance.provider = provider || 'sentry';
    const sampleRate = await question(
      'Enter sample rate (0.0-1.0, default 0.1): '
    );
    config.performance.sampleRate = parseFloat(sampleRate) || 0.1;
  }

  return config;
}

async function setupSentry(sentryConfig) {
  console.log('\n🔍 Setting up Sentry...');

  // Create Sentry configuration file
  const sentryConfigContent = `
module.exports = {
  org: "${sentryConfig.org}",
  project: "${sentryConfig.project}",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  url: "https://sentry.io/",
  include: [
    "./src",
    "./index.js"
  ],
  ignore: [
    "node_modules",
    "babel.config.js",
    "metro.config.js"
  ],
  release: {
    name: process.env.SENTRY_RELEASE,
    dist: process.env.SENTRY_DIST,
    setCommits: {
      auto: true
    }
  },
  deploy: {
    env: process.env.SENTRY_ENVIRONMENT || "development"
  }
};
`;

  fs.writeFileSync('sentry.properties', sentryConfigContent);

  // Create Sentry initialization file
  const sentryInitContent = `
import { sentryService } from './src/core/monitoring/sentry';

// Initialize Sentry
sentryService.initialize().catch(console.error);
`;

  fs.writeFileSync('sentry.init.js', sentryInitContent);

  console.log('✅ Sentry configuration created');
}

async function setupFirebase(firebaseConfig) {
  console.log('\n🔥 Setting up Firebase...');

  // Create Firebase configuration
  const firebaseConfigContent = `
export const firebaseConfig = {
  apiKey: "${firebaseConfig.apiKey}",
  authDomain: "${firebaseConfig.projectId}.firebaseapp.com",
  projectId: "${firebaseConfig.projectId}",
  storageBucket: "${firebaseConfig.projectId}.appspot.com",
  messagingSenderId: "123456789",
  appId: "${firebaseConfig.appId}"
};
`;

  const configDir = path.join('src', 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, {recursive: true});
  }

  fs.writeFileSync(path.join(configDir, 'firebase.ts'), firebaseConfigContent);

  console.log('✅ Firebase configuration created');
}

async function setupPerformanceMonitoring(performanceConfig) {
  console.log('\n📊 Setting up Performance Monitoring...');

  const performanceContent = `
/**
 * 📊 Performance Monitoring Configuration
 */

export const performanceConfig = {
  provider: "${performanceConfig.provider}",
  sampleRate: ${performanceConfig.sampleRate},
  enableAutoInstrumentation: true,
  enableNetworkInstrumentation: true,
  enableNavigationInstrumentation: true,
  enableUserInteractionInstrumentation: true
};

// Performance tracking utilities
export class PerformanceTracker {
  static startTransaction(name: string, op: string) {
    // Implementation based on provider
    console.log(\`Starting transaction: \${name} (\${op})\`);
  }
  
  static finishTransaction() {
    // Implementation based on provider
    console.log('Finishing transaction');
  }
  
  static addBreadcrumb(message: string, data?: any) {
    // Implementation based on provider
    console.log(\`Breadcrumb: \${message}\`, data);
  }
}
`;

  const configDir = path.join('src', 'core', 'performance');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, {recursive: true});
  }

  fs.writeFileSync(path.join(configDir, 'index.ts'), performanceContent);

  console.log('✅ Performance monitoring configuration created');
}

async function updateEnvironmentFiles(config) {
  console.log('\n📝 Updating environment files...');

  const envUpdates = [];

  if (config.sentry.enabled) {
    envUpdates.push(`# Sentry Configuration`);
    envUpdates.push(`SENTRY_DSN=${config.sentry.dsn}`);
    envUpdates.push(`SENTRY_ORG=${config.sentry.org}`);
    envUpdates.push(`SENTRY_PROJECT=${config.sentry.project}`);
    if (config.sentry.authToken) {
      envUpdates.push(`SENTRY_AUTH_TOKEN=${config.sentry.authToken}`);
    }
    envUpdates.push('');
  }

  if (config.firebase.enabled) {
    envUpdates.push(`# Firebase Configuration`);
    envUpdates.push(`FIREBASE_PROJECT_ID=${config.firebase.projectId}`);
    envUpdates.push(`FIREBASE_API_KEY=${config.firebase.apiKey}`);
    envUpdates.push(`FIREBASE_APP_ID=${config.firebase.appId}`);
    envUpdates.push('');
  }

  if (config.performance.enabled) {
    envUpdates.push(`# Performance Monitoring`);
    envUpdates.push(`PERFORMANCE_MONITORING_ENABLED=true`);
    envUpdates.push(`PERFORMANCE_PROVIDER=${config.performance.provider}`);
    envUpdates.push(`PERFORMANCE_SAMPLE_RATE=${config.performance.sampleRate}`);
    envUpdates.push('');
  }

  // Append to .env.example
  if (envUpdates.length > 0) {
    const envContent = envUpdates.join('\n');
    fs.appendFileSync('.env.example', '\n' + envContent);
  }

  console.log('✅ Environment files updated');
}

async function generateMonitoringDocs(config) {
  console.log('\n📚 Generating documentation...');

  const docsContent = `# 🔍 Monitoring Setup

This document describes the monitoring configuration for this React Native application.

## 📊 Configured Services

${
  config.sentry.enabled
    ? `
### Sentry Error Tracking
- **Organization**: ${config.sentry.org}
- **Project**: ${config.sentry.project}
- **DSN**: ${config.sentry.dsn}

#### Usage:
\`\`\`typescript
import { sentryService } from './src/core/monitoring/sentry';

// Capture error
sentryService.captureException(new Error('Something went wrong'));

// Add breadcrumb
sentryService.addBreadcrumb({
  message: 'User clicked button',
  category: 'ui',
  level: 'info'
});
\`\`\`
`
    : ''
}

${
  config.firebase.enabled
    ? `
### Firebase Crashlytics
- **Project ID**: ${config.firebase.projectId}
- **App ID**: ${config.firebase.appId}

#### Usage:
\`\`\`typescript
import crashlytics from '@react-native-firebase/crashlytics';

// Log error
crashlytics().recordError(new Error('Something went wrong'));

// Set user attributes
crashlytics().setUserId('user123');
crashlytics().setAttributes({
  role: 'admin',
  followers: '13'
});
\`\`\`
`
    : ''
}

${
  config.performance.enabled
    ? `
### Performance Monitoring
- **Provider**: ${config.performance.provider}
- **Sample Rate**: ${config.performance.sampleRate}

#### Usage:
\`\`\`typescript
import { PerformanceTracker } from './src/core/performance';

// Start transaction
const transaction = PerformanceTracker.startTransaction('api_call', 'http');

// Finish transaction
PerformanceTracker.finishTransaction();
\`\`\`
`
    : ''
}

## 🚀 Getting Started

1. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment**:
   - Copy \`.env.example\` to \`.env\`
   - Fill in your service credentials

3. **Initialize Services**:
   - Import and initialize monitoring services in your app entry point
   - Test error reporting and performance tracking

4. **Verify Setup**:
   - Check service dashboards for incoming data
   - Test error reporting with intentional errors
   - Monitor performance metrics

## 📋 Best Practices

- **Error Handling**: Always provide context when capturing errors
- **Performance**: Use appropriate sample rates for production
- **Privacy**: Ensure sensitive data is filtered before sending
- **Testing**: Test monitoring in development before production deployment

## 🔧 Troubleshooting

- **No Data**: Check API keys and network connectivity
- **High Volume**: Adjust sample rates and filtering rules
- **Performance**: Monitor impact on app performance
- **Privacy**: Review data collection policies

## 📞 Support

For issues with monitoring setup:
1. Check service documentation
2. Review configuration files
3. Contact development team
4. Check service status pages
`;

  const docsDir = path.join('docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, {recursive: true});
  }

  fs.writeFileSync(path.join(docsDir, 'monitoring.md'), docsContent);

  console.log('✅ Documentation generated');
}

// Run setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupMonitoring().catch(console.error);
}

module.exports = {setupMonitoring};
