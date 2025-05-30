import fs from 'fs';
import path from 'path';

// Pfad zu deinem Features Ordner
const featuresPath = path.join(process.cwd(), 'src', 'features');

if (!fs.existsSync(featuresPath)) {
  console.error('❌ Fehler: src/features Verzeichnis nicht gefunden!');
  console.error('   Bitte führe das Script aus dem Projekt-Root aus.');
  process.exit(1);
}

let docsContent = '# 📚 Features Dokumentation\n\n';
docsContent +=
  'Automatisch generierte Übersicht aller Features in diesem Projekt.\n\n';

const features = fs.readdirSync(featuresPath).filter(item => {
  const itemPath = path.join(featuresPath, item);
  return fs.statSync(itemPath).isDirectory();
});

if (features.length === 0) {
  docsContent += '📭 Keine Features gefunden.\n\n';
  docsContent +=
    '💡 Erstelle ein neues Feature mit: `./scripts/create_feature.sh`\n';
} else {
  features.forEach(feature => {
    const featureJsonPath = path.join(featuresPath, feature, 'feature.json');

    if (fs.existsSync(featureJsonPath)) {
      try {
        const featureData = JSON.parse(
          fs.readFileSync(featureJsonPath, 'utf-8')
        );

        docsContent += `## 📦 ${featureData.name}\n\n`;
        docsContent += `**Beschreibung:** ${featureData.description || 'Keine Beschreibung verfügbar'}\n\n`;
        docsContent += `**Screens:** ${featureData.screens?.length > 0 ? featureData.screens.join(', ') : 'Keine'}\n\n`;
        docsContent += `**UseCases:** ${featureData.useCases?.length > 0 ? featureData.useCases.join(', ') : 'Keine'}\n\n`;
        docsContent += `**Store vorhanden:** ${featureData.store ? 'Ja' : 'Nein'}\n\n`;

        if (featureData.createdAt) {
          docsContent += `**Erstellt:** ${new Date(featureData.createdAt).toLocaleDateString('de-DE')}\n\n`;
        }

        docsContent += `---\n\n`;
      } catch (error) {
        console.warn(
          `⚠️  Warnung: Konnte feature.json für '${feature}' nicht lesen:`,
          error.message
        );
        docsContent += `## 📦 ${feature}\n\n`;
        docsContent += `**Status:** Konfigurationsfehler in feature.json\n\n`;
        docsContent += `---\n\n`;
      }
    } else {
      docsContent += `## 📦 ${feature}\n\n`;
      docsContent += `**Status:** Keine feature.json gefunden\n\n`;
      docsContent += `---\n\n`;
    }
  });

  docsContent += `\n📊 **Gesamt:** ${features.length} Feature(s) gefunden\n\n`;
}

docsContent += `---\n\n`;
docsContent += `*Generiert am: ${new Date().toLocaleString('de-DE')}*\n`;
docsContent += `*Mit: \`npm run generate:docs\` oder \`npx ts-node scripts/generate-docs.ts\`*\n`;

// FEATURES.md schreiben
const outputPath = path.join(process.cwd(), 'docs', 'GENERATED_FEATURES.md');
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {recursive: true});
}

fs.writeFileSync(outputPath, docsContent);

console.log('✅ docs/GENERATED_FEATURES.md erfolgreich erstellt!');
console.log(`📊 ${features.length} Feature(s) dokumentiert`);
console.log(`📁 Ausgabe: ${outputPath}`);
