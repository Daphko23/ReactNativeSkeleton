#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

async async function validateProject() {
  console.log('🔍 React Native Template Validator');
  console.log('==================================');
  console.log('');

  let score = 0;
  let maxScore = 0;
  const issues = [];
  const warnings = [];

  // 1. Grundlegende Projektstruktur (20 Punkte)
  console.log('📁 Überprüfe Projektstruktur...');
  const requiredDirs = [
    'src',
    'src/core',
    'src/features',
    'src/shared',
    'src/shared/components',
    'src/shared/theme',
    'src/shared/utils',
    'scripts',
    'docs',
    '__tests__',
    'ios',
    'android',
  ];

  requiredDirs.forEach(dir => {
    maxScore += 1;
    if (fs.existsSync(dir)) {
      score += 1;
      console.log(`  ✅ ${dir}`);
    } else {
      console.log(`  ❌ ${dir} - FEHLT`);
      issues.push(`Verzeichnis ${dir} fehlt`);
    }
  });

  // 2. Konfigurationsdateien (15 Punkte)
  console.log('\n⚙️  Überprüfe Konfigurationsdateien...');
  const configFiles = [
    'package.json',
    'tsconfig.json',
    '.eslintrc.js',
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
    '.prettierrc',
    '.gitignore',
    'README.md',
  ];

  configFiles.forEach(file => {
    maxScore += 1;
    if (fs.existsSync(file)) {
      score += 1;
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - FEHLT`);
      issues.push(`Konfigurationsdatei ${file} fehlt`);
    }
  });

  // 3. Package.json Validierung (10 Punkte)
  console.log('\n📦 Überprüfe package.json...');
  if (fs.existsSync('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

      // Scripts
      const requiredScripts = [
        'android',
        'ios',
        'start',
        'test',
        'lint',
        'format',
        'feature:create',
        'feature:list',
        'docs:generate',
      ];

      requiredScripts.forEach(script => {
        maxScore += 1;
        if (packageJson.scripts && packageJson.scripts[script]) {
          score += 1;
          console.log(`  ✅ Script: ${script}`);
        } else {
          console.log(`  ❌ Script: ${script} - FEHLT`);
          issues.push(`npm Script ${script} fehlt`);
        }
      });

      // Dependencies
      const requiredDeps = [
        'react',
        'react-native',
        '@react-navigation/native',
        'zustand',
        'react-native-paper',
      ];

      requiredDeps.forEach(dep => {
        maxScore += 1;
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          score += 1;
          console.log(`  ✅ Dependency: ${dep}`);
        } else {
          console.log(`  ❌ Dependency: ${dep} - FEHLT`);
          issues.push(`Dependency ${dep} fehlt`);
        }
      });
    } catch {
      console.log('❌ package.json nicht gefunden oder ungültig');
      return false;
    }
  }

  // 4. TypeScript Konfiguration (5 Punkte)
  console.log('\n🎯 Überprüfe TypeScript...');
  if (fs.existsSync('tsconfig.json')) {
    try {
      const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));

      maxScore += 1;
      if (tsConfig.compilerOptions && tsConfig.compilerOptions.strict) {
        score += 1;
        console.log('  ✅ Strict Mode aktiviert');
      } else {
        console.log('  ⚠️  Strict Mode nicht aktiviert');
        warnings.push('TypeScript Strict Mode sollte aktiviert sein');
      }

      maxScore += 1;
      if (tsConfig.compilerOptions && tsConfig.compilerOptions.baseUrl) {
        score += 1;
        console.log('  ✅ BaseUrl konfiguriert');
      } else {
        console.log('  ❌ BaseUrl nicht konfiguriert');
        issues.push('TypeScript baseUrl fehlt');
      }

      maxScore += 1;
      if (tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
        score += 1;
        console.log('  ✅ Path Mapping konfiguriert');
      } else {
        console.log('  ❌ Path Mapping nicht konfiguriert');
        issues.push('TypeScript path mapping fehlt');
      }
    } catch {
      console.log('  ❌ tsconfig.json ist nicht gültig');
      issues.push('tsconfig.json ist nicht gültig');
    }
  }

  // 5. ESLint Konfiguration (5 Punkte)
  console.log('\n🔍 Überprüfe ESLint...');
  if (fs.existsSync('.eslintrc.js') || fs.existsSync('eslint.config.mjs')) {
    console.log('  ✅ ESLint-Konfiguration gefunden');
    score += 5;
  } else {
    issues.push('❌ Keine ESLint-Konfiguration gefunden');
  }
  maxScore += 5;

  // 6. Feature-Struktur (10 Punkte)
  console.log('\n🏗️  Überprüfe Feature-Struktur...');
  if (fs.existsSync('src/features')) {
    const features = fs.readdirSync('src/features').filter(item => {
      const itemPath = path.join('src/features', item);
      return fs.statSync(itemPath).isDirectory();
    });

    if (features.length > 0) {
      console.log(`  📦 ${features.length} Feature(s) gefunden`);

      features.forEach(feature => {
        const featurePath = path.join('src/features', feature);
        const requiredFeatureDirs = [
          'domain',
          'application',
          'data',
          'presentation',
        ];

        let featureScore = 0;
        requiredFeatureDirs.forEach(dir => {
          maxScore += 0.5;
          if (fs.existsSync(path.join(featurePath, dir))) {
            score += 0.5;
            featureScore += 1;
          }
        });

        if (featureScore === 4) {
          console.log(`    ✅ ${feature} - Clean Architecture`);
        } else {
          console.log(`    ⚠️  ${feature} - Unvollständige Struktur`);
          warnings.push(
            `Feature ${feature} hat unvollständige Clean Architecture`
          );
        }

        // Feature.json Check
        maxScore += 1;
        if (fs.existsSync(path.join(featurePath, 'feature.json'))) {
          score += 1;
          console.log(`    ✅ ${feature} - feature.json vorhanden`);
        } else {
          console.log(`    ❌ ${feature} - feature.json fehlt`);
          issues.push(`Feature ${feature} hat keine feature.json`);
        }
      });
    } else {
      console.log('  📭 Keine Features gefunden');
      maxScore += 5; // Placeholder für Feature-Checks
      warnings.push('Keine Features gefunden - erstelle Beispiel-Features');
    }
  }

  // 7. Scripts Validierung (10 Punkte)
  console.log('\n📜 Überprüfe Scripts...');
  const requiredScripts = [
    'create_feature.sh',
    'list_features.sh',
    'delete_feature.sh',
    'update_feature.sh',
    'generate-docs.ts',
    'create-crud-feature.js',
    'feature-cli.js',
    'dev-menu.js',
    'validate-project.js',
  ];

  requiredScripts.forEach(script => {
    maxScore += 1;
    const scriptPath = path.join('scripts', script);
    if (fs.existsSync(scriptPath)) {
      score += 1;
      console.log(`  ✅ ${script}`);

      // Prüfe Ausführbarkeit
      try {
        const stats = fs.statSync(scriptPath);
        if (stats.mode & parseInt('111', 8)) {
          console.log(`    ✅ Ausführbar`);
        } else {
          console.log(`    ⚠️  Nicht ausführbar`);
          warnings.push(`Script ${script} ist nicht ausführbar`);
        }
      } catch {
        // Ignore permission check errors
      }
    } else {
      console.log(`  ❌ ${script} - FEHLT`);
      issues.push(`Script ${script} fehlt`);
    }
  });

  // 8. Dokumentation (5 Punkte)
  console.log('\n📚 Überprüfe Dokumentation...');
  const docFiles = [
    'README.md',
    'docs/FEATURES.md',
    'docs/ARCHITECTURE.md',
    'scripts/README.md',
  ];

  docFiles.forEach(doc => {
    maxScore += 1;
    if (fs.existsSync(doc)) {
      score += 1;
      console.log(`  ✅ ${doc}`);
    } else {
      console.log(`  ❌ ${doc} - FEHLT`);
      issues.push(`Dokumentation ${doc} fehlt`);
    }
  });

  // 9. Git Hooks (5 Punkte)
  console.log('\n🪝 Überprüfe Git Hooks...');
  const hookFiles = ['.husky/pre-commit', '.husky/commit-msg'];

  hookFiles.forEach(hook => {
    maxScore += 1;
    if (fs.existsSync(hook)) {
      score += 1;
      console.log(`  ✅ ${hook}`);
    } else {
      console.log(`  ❌ ${hook} - FEHLT`);
      issues.push(`Git Hook ${hook} fehlt`);
    }
  });

  // Lint-staged Check
  if (fs.existsSync('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      maxScore += 1;
      if (packageJson['lint-staged']) {
        score += 1;
        console.log('  ✅ lint-staged konfiguriert');
      } else {
        console.log('  ❌ lint-staged nicht konfiguriert');
        issues.push('lint-staged Konfiguration fehlt');
      }
    } catch {
      // Already handled above
    }
  }

  // 10. Template-spezifische Checks (10 Punkte)
  console.log('\n🎯 Überprüfe Template-Qualität...');

  // Keine hardcodierten Projektnamen
  maxScore += 2;
  const filesToCheck = [
    'package.json',
    'app.json',
    'ios/ReactNativeSkeleton/Info.plist',
  ];
  let hasHardcodedNames = false;

  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      if (
        content.includes('FussballFeld') ||
        content.includes('fussballfeld')
      ) {
        hasHardcodedNames = true;
        console.log(`  ❌ Hardcodierte Namen in ${file}`);
        issues.push(`Hardcodierte Projektnamen in ${file} gefunden`);
      }
    }
  });

  if (!hasHardcodedNames) {
    score += 2;
    console.log('  ✅ Keine hardcodierten Projektnamen');
  }

  // Template-freundliche Scripts
  maxScore += 2;
  if (fs.existsSync('scripts/create_feature.sh')) {
    const scriptContent = fs.readFileSync('scripts/create_feature.sh', 'utf-8');
    if (
      scriptContent.includes('src/features') &&
      !scriptContent.includes('FussballFeld')
    ) {
      score += 2;
      console.log('  ✅ Template-kompatible Scripts');
    } else {
      console.log('  ❌ Scripts enthalten projektspezifische Referenzen');
      issues.push('Scripts sind nicht template-kompatibel');
    }
  }

  // Clean Architecture Compliance
  maxScore += 3;
  if (
    fs.existsSync('src/core') &&
    fs.existsSync('src/features') &&
    fs.existsSync('src/shared')
  ) {
    score += 3;
    console.log('  ✅ Clean Architecture Struktur');
  } else {
    console.log('  ❌ Clean Architecture Struktur unvollständig');
    issues.push('Clean Architecture Struktur ist unvollständig');
  }

  // Modern React Native Patterns
  maxScore += 3;
  if (fs.existsSync('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      const hasModernDeps =
        packageJson.dependencies &&
        packageJson.dependencies.zustand &&
        packageJson.dependencies['react-native-paper'] &&
        packageJson.dependencies['@react-navigation/native'];

      if (hasModernDeps) {
        score += 3;
        console.log('  ✅ Moderne React Native Patterns');
      } else {
        console.log('  ❌ Veraltete oder fehlende Dependencies');
        issues.push('Moderne React Native Dependencies fehlen');
      }
    } catch {
      // Already handled
    }
  }

  // Ergebnisse
  console.log('\n' + '='.repeat(50));
  console.log('📊 VALIDIERUNGS-ERGEBNISSE');
  console.log('='.repeat(50));

  const percentage = Math.round((score / maxScore) * 100);
  console.log(`🎯 Score: ${score}/${maxScore} (${percentage}%)`);

  let rating = '';
  let emoji = '';

  if (percentage >= 95) {
    rating = 'EXZELLENT';
    emoji = '🏆';
  } else if (percentage >= 85) {
    rating = 'SEHR GUT';
    emoji = '🥇';
  } else if (percentage >= 75) {
    rating = 'GUT';
    emoji = '🥈';
  } else if (percentage >= 65) {
    rating = 'BEFRIEDIGEND';
    emoji = '🥉';
  } else if (percentage >= 50) {
    rating = 'AUSREICHEND';
    emoji = '⚠️';
  } else {
    rating = 'MANGELHAFT';
    emoji = '❌';
  }

  console.log(`${emoji} Bewertung: ${rating}`);
  console.log('');

  if (issues.length > 0) {
    console.log('❌ KRITISCHE PROBLEME:');
    issues.forEach(issue => console.log(`   • ${issue}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNUNGEN:');
    warnings.forEach(warning => console.log(`   • ${warning}`));
    console.log('');
  }

  if (percentage >= 95) {
    console.log(
      '🎉 Herzlichen Glückwunsch! Dein Template ist produktionsreif!'
    );
  } else if (percentage >= 85) {
    console.log('👍 Sehr gutes Template! Nur wenige Verbesserungen nötig.');
  } else if (percentage >= 75) {
    console.log('👌 Gutes Template! Einige Optimierungen empfohlen.');
  } else {
    console.log(
      '🔧 Template benötigt noch Arbeit. Behebe die kritischen Probleme.'
    );
  }

  console.log('');
  console.log('📚 Für Details siehe: docs/ARCHITECTURE.md');
  console.log('🛠️  Für Hilfe nutze: npm run dev:menu');

  return {
    score,
    maxScore,
    percentage,
    rating,
    issues,
    warnings,
  };
}

// Führe Validierung aus
if (import.meta.url === `file://${process.argv[1]}`) {
  validateProject();
}

module.exports = {validateProject};
