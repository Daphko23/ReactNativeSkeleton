#!/usr/bin/env node

import fs from 'fs';
import _path from 'path';
import readline from 'readline';
import { exec as _exec, _execSync } from 'child_process';

const exec = _exec;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({stdout, stderr});
      }
    });
  });
}

function clearScreen() {
  console.clear();
}

function showHeader() {
  console.log('🛠️  React Native Development Menu');
  console.log('==================================');
  console.log('');
}

async function showMainMenu() {
  clearScreen();
  showHeader();

  console.log('🚀 Entwicklungsmenü:');
  console.log('');
  console.log('📱 App-Verwaltung:');
  console.log('  1. 🍎 iOS App starten');
  console.log('  2. 🤖 Android App starten');
  console.log('  3. 🧹 Cache leeren');
  console.log('  4. 🔄 Metro Server neustarten');
  console.log('');
  console.log('🔧 Code-Qualität:');
  console.log('  5. 🔍 ESLint ausführen');
  console.log('  6. ✨ Code formatieren');
  console.log('  7. 🎯 TypeScript prüfen');
  console.log('  8. 🧪 Tests ausführen');
  console.log('');
  console.log('📦 Feature-Management:');
  console.log('  9. 🏗️  Feature CLI öffnen');
  console.log(' 10. 📋 Features auflisten');
  console.log(' 11. 📚 Dokumentation generieren');
  console.log('');
  console.log('🔧 Projekt-Tools:');
  console.log(' 12. 🔍 Projekt validieren');
  console.log(' 13. 📊 Bundle-Größe analysieren');
  console.log(' 14. 🧹 Komplette Bereinigung');
  console.log(' 15. ❌ Beenden');
  console.log('');

  const choice = await question('👉 Wähle eine Option (1-15): ');
  return choice;
}

async function startIOS() {
  clearScreen();
  showHeader();
  console.log('🍎 iOS App starten');
  console.log('==================');

  try {
    console.log('🚀 Starte iOS Simulator...');
    await execPromise('npx react-native run-ios');
  } catch (error) {
    console.error('❌ Fehler beim Starten der iOS App:', error.message);
    console.log('💡 Tipps:');
    console.log('   - Stelle sicher, dass Xcode installiert ist');
    console.log('   - Überprüfe ob iOS Simulator verfügbar ist');
    console.log('   - Führe "cd ios && pod install" aus');
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function startAndroid() {
  clearScreen();
  showHeader();
  console.log('🤖 Android App starten');
  console.log('======================');

  try {
    console.log('🚀 Starte Android Emulator...');
    await execPromise('npx react-native run-android');
  } catch (error) {
    console.error('❌ Fehler beim Starten der Android App:', error.message);
    console.log('💡 Tipps:');
    console.log('   - Stelle sicher, dass Android Studio installiert ist');
    console.log('   - Überprüfe ob ein Emulator läuft');
    console.log('   - Führe "cd android && ./gradlew clean" aus');
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function clearCache() {
  clearScreen();
  showHeader();
  console.log('🧹 Cache leeren');
  console.log('===============');

  try {
    console.log('🧹 Lösche Metro Cache...');
    await execPromise('npx react-native start --reset-cache');
    console.log('✅ Metro Cache geleert');

    console.log('🧹 Lösche npm Cache...');
    await execPromise('npm cache clean --force');
    console.log('✅ npm Cache geleert');

    console.log('🧹 Lösche Watchman Cache...');
    await execPromise('watchman watch-del-all');
    console.log('✅ Watchman Cache geleert');
  } catch (error) {
    console.error('❌ Fehler beim Cache leeren:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function restartMetro() {
  clearScreen();
  showHeader();
  console.log('🔄 Metro Server neustarten');
  console.log('==========================');

  try {
    console.log('🔄 Starte Metro Server neu...');
    await execPromise('npx react-native start --reset-cache');
  } catch (error) {
    console.error('❌ Fehler beim Metro Server Neustart:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function runESLint() {
  clearScreen();
  showHeader();
  console.log('🔍 ESLint ausführen');
  console.log('===================');

  try {
    console.log('🔍 Führe ESLint aus...');
    const {stdout} = await execPromise('npx eslint src --ext .ts,.tsx');
    console.log(stdout || '✅ Keine ESLint-Fehler gefunden!');

    const fix = await question(
      '\n🔧 ESLint-Fehler automatisch beheben? (y/n): '
    );
    if (fix === 'y' || fix === 'Y') {
      console.log('🔧 Behebe ESLint-Fehler...');
      await execPromise('npx eslint src --ext .ts,.tsx --fix');
      console.log('✅ ESLint-Fehler behoben!');
    }
  } catch (error) {
    console.error('❌ ESLint-Fehler gefunden:', error.message);

    const fix = await question(
      '\n🔧 ESLint-Fehler automatisch beheben? (y/n): '
    );
    if (fix === 'y' || fix === 'Y') {
      try {
        console.log('🔧 Behebe ESLint-Fehler...');
        await execPromise('npx eslint src --ext .ts,.tsx --fix');
        console.log('✅ ESLint-Fehler behoben!');
      } catch (fixError) {
        console.error('❌ Fehler beim Beheben:', fixError.message);
      }
    }
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function formatCode() {
  clearScreen();
  showHeader();
  console.log('✨ Code formatieren');
  console.log('==================');

  try {
    console.log('✨ Formatiere Code mit Prettier...');
    await execPromise('npx prettier --write src');
    console.log('✅ Code erfolgreich formatiert!');
  } catch (error) {
    console.error('❌ Fehler beim Formatieren:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function checkTypeScript() {
  clearScreen();
  showHeader();
  console.log('🎯 TypeScript prüfen');
  console.log('====================');

  try {
    console.log('🎯 Führe TypeScript-Prüfung aus...');
    const { _stdout } = await execPromise('npx tsc --noEmit');
    console.log('✅ Keine TypeScript-Fehler gefunden!');
  } catch (error) {
    console.error('❌ TypeScript-Fehler gefunden:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function runTests() {
  clearScreen();
  showHeader();
  console.log('🧪 Tests ausführen');
  console.log('==================');

  console.log('🧪 Welche Tests sollen ausgeführt werden?');
  console.log('1. 🚀 Alle Tests');
  console.log('2. 👀 Tests im Watch-Modus');
  console.log('3. 📊 Tests mit Coverage');
  console.log('4. 🎯 Spezifische Tests');

  const choice = await question('\n👉 Wähle eine Option (1-4): ');

  try {
    switch (choice) {
      case '1':
        console.log('🚀 Führe alle Tests aus...');
        await execPromise('npm test');
        break;
      case '2':
        console.log('👀 Starte Tests im Watch-Modus...');
        await execPromise('npm run test:watch');
        break;
      case '3':
        console.log('📊 Führe Tests mit Coverage aus...');
        await execPromise('npm run test:coverage');
        break;
      case '4':
        const pattern = await question('🎯 Test-Pattern eingeben: ');
        console.log(`🎯 Führe Tests für "${pattern}" aus...`);
        await execPromise(`npm test -- --testNamePattern="${pattern}"`);
        break;
      default:
        console.log('❌ Ungültige Auswahl');
    }
  } catch (error) {
    console.error('❌ Fehler beim Ausführen der Tests:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function openFeatureCLI() {
  clearScreen();
  showHeader();
  console.log('🏗️ Feature CLI öffnen');
  console.log('=====================');

  try {
    await execPromise('node scripts/feature-cli.js');
  } catch (error) {
    console.error('❌ Fehler beim Öffnen der Feature CLI:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function listFeatures() {
  clearScreen();
  showHeader();
  console.log('📋 Features auflisten');
  console.log('====================');

  try {
    const {stdout} = await execPromise('npm run feature:list');
    console.log(stdout);
  } catch (error) {
    console.error('❌ Fehler beim Auflisten der Features:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function generateDocs() {
  clearScreen();
  showHeader();
  console.log('📚 Dokumentation generieren');
  console.log('===========================');

  try {
    const {stdout} = await execPromise('npm run docs:generate');
    console.log(stdout);
  } catch (error) {
    console.error(
      '❌ Fehler beim Generieren der Dokumentation:',
      error.message
    );
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function validateProject() {
  clearScreen();
  showHeader();
  console.log('🔍 Projekt validieren');
  console.log('=====================');

  try {
    const {stdout} = await execPromise('npm run dev:validate');
    console.log(stdout);
  } catch (error) {
    console.error('❌ Fehler bei der Projekt-Validierung:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function analyzeBundleSize() {
  clearScreen();
  showHeader();
  console.log('📊 Bundle-Größe analysieren');
  console.log('===========================');

  try {
    console.log('📊 Analysiere Bundle-Größe...');
    console.log('💡 Hinweis: Dies kann einige Minuten dauern...');

    // Metro Bundle Analyzer
    await execPromise(
      'npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android-release.bundle --assets-dest android-release/'
    );

    const stats = fs.statSync('android-release.bundle');
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    console.log(`📦 Bundle-Größe: ${fileSizeInMegabytes.toFixed(2)} MB`);

    // Cleanup
    fs.unlinkSync('android-release.bundle');
    if (fs.existsSync('android-release')) {
      fs.rmSync('android-release', {recursive: true});
    }
  } catch (error) {
    console.error('❌ Fehler bei der Bundle-Analyse:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function fullCleanup() {
  clearScreen();
  showHeader();
  console.log('🧹 Komplette Bereinigung');
  console.log('========================');

  console.log(
    '⚠️  WARNUNG: Dies wird alle temporären Dateien und Caches löschen!'
  );
  const confirm = await question('🤔 Fortfahren? (yes/no): ');

  if (confirm !== 'yes') {
    console.log('❌ Abgebrochen.');
    await question('\n📱 Drücke Enter um fortzufahren...');
    return;
  }

  try {
    console.log('🧹 Lösche node_modules...');
    if (fs.existsSync('node_modules')) {
      fs.rmSync('node_modules', {recursive: true});
    }

    console.log('🧹 Lösche iOS Pods...');
    if (fs.existsSync('ios/Pods')) {
      fs.rmSync('ios/Pods', {recursive: true});
    }
    if (fs.existsSync('ios/Podfile.lock')) {
      fs.unlinkSync('ios/Podfile.lock');
    }

    console.log('🧹 Lösche Android Build...');
    if (fs.existsSync('android/app/build')) {
      fs.rmSync('android/app/build', {recursive: true});
    }

    console.log('🧹 Lösche Metro Cache...');
    await execPromise('npx react-native start --reset-cache').catch(() => {});

    console.log('🧹 Lösche npm Cache...');
    await execPromise('npm cache clean --force').catch(() => {});

    console.log('🧹 Lösche Watchman Cache...');
    await execPromise('watchman watch-del-all').catch(() => {});

    console.log('📦 Installiere Dependencies...');
    await execPromise('npm install');

    console.log('🍎 Installiere iOS Pods...');
    await execPromise('cd ios && pod install');

    console.log('✅ Komplette Bereinigung abgeschlossen!');
  } catch (error) {
    console.error('❌ Fehler bei der Bereinigung:', error.message);
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function main() {
  // Prüfe ob wir im richtigen Verzeichnis sind
  if (!fs.existsSync('package.json')) {
    console.error('❌ Fehler: package.json nicht gefunden!');
    console.error('   Bitte führe das Script aus dem Projekt-Root aus.');
    process.exit(1);
  }

  while (true) {
    try {
      const choice = await showMainMenu();

      switch (choice) {
        case '1':
          await startIOS();
          break;
        case '2':
          await startAndroid();
          break;
        case '3':
          await clearCache();
          break;
        case '4':
          await restartMetro();
          break;
        case '5':
          await runESLint();
          break;
        case '6':
          await formatCode();
          break;
        case '7':
          await checkTypeScript();
          break;
        case '8':
          await runTests();
          break;
        case '9':
          await openFeatureCLI();
          break;
        case '10':
          await listFeatures();
          break;
        case '11':
          await generateDocs();
          break;
        case '12':
          await validateProject();
          break;
        case '13':
          await analyzeBundleSize();
          break;
        case '14':
          await fullCleanup();
          break;
        case '15':
          console.log('👋 Auf Wiedersehen!');
          rl.close();
          process.exit(0);
        default:
          console.log('❌ Ungültige Auswahl. Bitte wähle 1-15.');
          await question('📱 Drücke Enter um fortzufahren...');
      }
    } catch (error) {
      console.error('❌ Unerwarteter Fehler:', error.message);
      await question('📱 Drücke Enter um fortzufahren...');
    }
  }
}

main().catch(console.error);
