#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {exec} from 'child_process';

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
  console.log('🚀 React Native Feature CLI');
  console.log('============================');
  console.log('');
}

async function showMainMenu() {
  clearScreen();
  showHeader();

  console.log('📋 Hauptmenü:');
  console.log('');
  console.log('1. 📦 Neues Feature erstellen');
  console.log('2. 🏗️  CRUD-Feature erstellen');
  console.log('3. 📋 Features auflisten');
  console.log('4. ✨ Feature erweitern');
  console.log('5. 🗑️  Feature löschen');
  console.log('6. 📚 Dokumentation generieren');
  console.log('7. 🔧 Projekt validieren');
  console.log('8. ❌ Beenden');
  console.log('');

  const choice = await question('👉 Wähle eine Option (1-8): ');
  return choice;
}

async function createBasicFeature() {
  clearScreen();
  showHeader();
  console.log('📦 Neues Feature erstellen');
  console.log('==========================');

  try {
    if (process.platform === 'win32') {
      await execPromise('node scripts/create_feature_node.js');
    } else {
      await execPromise('bash scripts/create_feature.sh');
    }
  } catch {
    console.error('Fehler beim Erstellen der Komponente');
    return false;
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function createCrudFeature() {
  clearScreen();
  showHeader();
  console.log('🏗️ CRUD-Feature erstellen');
  console.log('=========================');

  try {
    await execPromise('node scripts/create-crud-feature.js');
  } catch {
    console.error('Fehler beim Erstellen der Komponente');
    return false;
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function listFeatures() {
  clearScreen();
  showHeader();
  console.log('📋 Features auflisten');
  console.log('====================');

  try {
    if (process.platform === 'win32') {
      // Windows-kompatible Implementierung
      await listFeaturesNode();
    } else {
      const {stdout} = await execPromise('bash scripts/list_features.sh');
      console.log(stdout);
    }
  } catch {
    console.error('Fehler beim Auflisten der Features');
    return false;
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function listFeaturesNode() {
  const featuresPath = path.join(process.cwd(), 'src', 'features');

  if (!fs.existsSync(featuresPath)) {
    console.log('❌ Fehler: src/features Verzeichnis nicht gefunden!');
    return;
  }

  const features = fs.readdirSync(featuresPath).filter(item => {
    const itemPath = path.join(featuresPath, item);
    return fs.statSync(itemPath).isDirectory();
  });

  if (features.length === 0) {
    console.log('📭 Keine Features gefunden.');
    console.log('💡 Erstelle ein neues Feature mit Option 1 oder 2');
    return;
  }

  console.log(`📊 ${features.length} Feature(s) gefunden:`);
  console.log('=====================================');

  features.forEach(feature => {
    const featureJsonPath = path.join(featuresPath, feature, 'feature.json');

    if (fs.existsSync(featureJsonPath)) {
      try {
        const featureData = JSON.parse(
          fs.readFileSync(featureJsonPath, 'utf-8')
        );

        console.log(`📦 Feature: ${featureData.name}`);
        console.log(
          `📝 Beschreibung: ${featureData.description || 'Keine Beschreibung'}`
        );
        console.log(
          `🎨 Screens: ${featureData.screens?.length > 0 ? featureData.screens.join(', ') : 'keine'}`
        );
        console.log(
          `⚡ UseCases: ${featureData.useCases?.length > 0 ? featureData.useCases.join(', ') : 'keine'}`
        );
        console.log(`🧠 Store: ${featureData.store ? 'Ja' : 'Nein'}`);
        if (featureData.createdAt) {
          console.log(
            `📅 Erstellt: ${new Date(featureData.createdAt).toLocaleDateString('de-DE')}`
          );
        }
        console.log('---------------------------------------');
      } catch {
        console.log(`📦 Feature: ${feature}`);
        console.log(`❌ Fehler beim Lesen der feature.json`);
        console.log('---------------------------------------');
      }
    } else {
      console.log(`📦 Feature: ${feature}`);
      console.log(`⚠️  Keine feature.json gefunden`);
      console.log('---------------------------------------');
    }
  });
}

async function updateFeature() {
  clearScreen();
  showHeader();
  console.log('✨ Feature erweitern');
  console.log('===================');

  try {
    if (process.platform === 'win32') {
      await updateFeatureNode();
    } else {
      await execPromise('bash scripts/update_feature.sh');
    }
  } catch {
    console.error('Fehler beim Erweitern der Komponente');
    return false;
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function updateFeatureNode() {
  // Vereinfachte Node.js Implementierung für Windows
  console.log(
    '⚠️  Windows-Nutzer: Bitte verwende die Bash-Scripts in WSL oder Git Bash'
  );
  console.log('Oder nutze die npm Scripts:');
  console.log('  npm run feature:update');
}

async function deleteFeature() {
  clearScreen();
  showHeader();
  console.log('🗑️ Feature löschen');
  console.log('==================');

  try {
    if (process.platform === 'win32') {
      await deleteFeatureNode();
    } else {
      await execPromise('bash scripts/delete_feature.sh');
    }
  } catch {
    console.error('Fehler beim Löschen der Komponente');
    return false;
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function deleteFeatureNode() {
  const featuresPath = path.join(process.cwd(), 'src', 'features');

  if (!fs.existsSync(featuresPath)) {
    console.log('❌ Fehler: src/features Verzeichnis nicht gefunden!');
    return;
  }

  const features = fs.readdirSync(featuresPath).filter(item => {
    const itemPath = path.join(featuresPath, item);
    return fs.statSync(itemPath).isDirectory();
  });

  if (features.length === 0) {
    console.log('📭 Keine Features zum Löschen gefunden.');
    return;
  }

  console.log('📁 Verfügbare Features:');
  features.forEach((feature, index) => {
    console.log(`   ${index + 1}. 📦 ${feature}`);
  });

  const choice = await question(
    '\n🧱 Welches Feature soll gelöscht werden? (Nummer): '
  );
  const featureIndex = parseInt(choice) - 1;

  if (featureIndex < 0 || featureIndex >= features.length) {
    console.log('❌ Ungültige Auswahl!');
    return;
  }

  const featureName = features[featureIndex];
  const featurePath = path.join(featuresPath, featureName);

  console.log(
    `⚠️  WARNUNG: Das Feature '${featureName}' wird komplett gelöscht!`
  );
  const confirm = await question('🤔 Bist du sicher? (yes/no): ');

  if (confirm !== 'yes') {
    console.log('❌ Abgebrochen. Feature wurde nicht gelöscht.');
    return;
  }

  try {
    fs.rmSync(featurePath, {recursive: true, force: true});
    console.log(`✅ Feature '${featureName}' erfolgreich gelöscht!`);
  } catch {
    console.error('Fehler beim Löschen');
  }
}

async function generateDocs() {
  clearScreen();
  showHeader();
  console.log('📚 Dokumentation generieren');
  console.log('===========================');

  try {
    const {stdout} = await execPromise('npx ts-node scripts/generate-docs.ts');
    console.log(stdout);
  } catch {
    console.error('Fehler beim Generieren der Dokumentation');
    return false;
  }

  await question('\n📱 Drücke Enter um fortzufahren...');
}

async function validateProject() {
  clearScreen();
  showHeader();
  console.log('🔧 Projekt validieren');
  console.log('=====================');

  console.log('🔍 Überprüfe Projektstruktur...');

  const checks = [
    {name: 'src/features Verzeichnis', path: 'src/features'},
    {name: 'src/core Verzeichnis', path: 'src/core'},
    {name: 'src/shared Verzeichnis', path: 'src/shared'},
    {name: 'package.json', path: 'package.json'},
    {name: 'tsconfig.json', path: 'tsconfig.json'},
    {name: '.eslintrc.js', path: '.eslintrc.js'},
    {name: 'babel.config.js', path: 'babel.config.js'},
  ];

  let allGood = true;

  checks.forEach(check => {
    if (fs.existsSync(check.path)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - FEHLT`);
      allGood = false;
    }
  });

  console.log('');

  if (allGood) {
    console.log('🎉 Projekt-Validierung erfolgreich!');

    // Zusätzliche Checks
    try {
      console.log('🔍 Überprüfe TypeScript...');
      await execPromise('npx tsc --noEmit');
      console.log('✅ TypeScript-Validierung erfolgreich');
    } catch {
      console.log('❌ TypeScript-Fehler gefunden');
    }

    try {
      console.log('🔍 Überprüfe ESLint...');
      await execPromise('npx eslint src --max-warnings 0');
      console.log('✅ ESLint-Validierung erfolgreich');
    } catch {
      console.log('❌ ESLint-Fehler gefunden');
    }
  } else {
    console.log('❌ Projekt-Validierung fehlgeschlagen!');
    console.log('💡 Überprüfe die fehlenden Dateien und Verzeichnisse.');
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
          await createBasicFeature();
          break;
        case '2':
          await createCrudFeature();
          break;
        case '3':
          await listFeatures();
          break;
        case '4':
          await updateFeature();
          break;
        case '5':
          await deleteFeature();
          break;
        case '6':
          await generateDocs();
          break;
        case '7':
          await validateProject();
          break;
        case '8':
          console.log('👋 Auf Wiedersehen!');
          rl.close();
          process.exit(0);
        default:
          console.log('❌ Ungültige Auswahl. Bitte wähle 1-8.');
          await question('📱 Drücke Enter um fortzufahren...');
      }
    } catch {
      console.error('Unerwarteter Fehler');
      await question('📱 Drücke Enter um fortzufahren...');
    }
  }
}

main().catch(console.error);
