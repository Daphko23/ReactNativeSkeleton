#!/usr/bin/env node

/**
 * Enterprise Bundle Size Analyzer
 * Analysiert und optimiert React Native Bundle Größen
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Farben für Console Output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

class BundleAnalyzer {
  constructor() {
    this.bundleDir = path.join(projectRoot, 'bundle-analysis');
    this.ensureBundleDir();
  }

  ensureBundleDir() {
    if (!fs.existsSync(this.bundleDir)) {
      fs.mkdirSync(this.bundleDir, { recursive: true });
    }
  }

  log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  // Bundle für beide Plattformen generieren
  async generateBundles() {
    this.log('\n🔥 Generiere Production Bundles...', 'cyan');
    
    const platforms = ['android', 'ios'];
    const results = {};

    for (const platform of platforms) {
      try {
        this.log(`\n📱 Erstelle ${platform.toUpperCase()} Bundle...`, 'blue');
        
        const bundlePath = path.join(this.bundleDir, `${platform}.bundle`);
        const sourcemapPath = path.join(this.bundleDir, `${platform}.bundle.map`);
        
        const command = [
          'npx', 'react-native', 'bundle',
          '--platform', platform,
          '--dev', 'false',
          '--entry-file', 'index.js',
          '--bundle-output', bundlePath,
          '--sourcemap-output', sourcemapPath,
          '--minify', 'true',
          '--reset-cache'
        ].join(' ');

        execSync(command, { 
          cwd: projectRoot,
          stdio: 'inherit' 
        });

        // Bundle Size analysieren
        const stats = fs.statSync(bundlePath);
        const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
        
        results[platform] = {
          path: bundlePath,
          size: stats.size,
          sizeMB: sizeInMB
        };

        this.log(`✅ ${platform.toUpperCase()} Bundle: ${sizeInMB}MB`, 'green');
        
      } catch (error) {
        this.log(`❌ Fehler bei ${platform} Bundle: ${error.message}`, 'red');
        results[platform] = { error: error.message };
      }
    }

    return results;
  }

  // JavaScript Dependencies analysieren
  analyzeNodeModules() {
    this.log('\n📦 Analysiere node_modules Größe...', 'cyan');
    
    const nodeModulesPath = path.join(projectRoot, 'node_modules');
    const packageJsonPath = path.join(projectRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      this.log('❌ package.json nicht gefunden', 'red');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const sizes = [];
    
    for (const [name, version] of Object.entries(dependencies)) {
      const depPath = path.join(nodeModulesPath, name);
      
      if (fs.existsSync(depPath)) {
        const size = this.getFolderSize(depPath);
        sizes.push({
          name,
          version,
          size,
          sizeMB: (size / 1024 / 1024).toFixed(2)
        });
      }
    }

    // Nach Größe sortieren
    sizes.sort((a, b) => b.size - a.size);
    
    this.log('\n🏆 Top 10 größte Dependencies:', 'yellow');
    sizes.slice(0, 10).forEach((dep, index) => {
      this.log(`${index + 1}. ${dep.name}: ${dep.sizeMB}MB`, 'white');
    });

    return sizes;
  }

  // Asset Größen analysieren
  analyzeAssets() {
    this.log('\n🖼️ Analysiere Assets...', 'cyan');
    
    const assetsPath = path.join(projectRoot, 'src', 'assets');
    
    if (!fs.existsSync(assetsPath)) {
      this.log('ℹ️ Kein Assets-Ordner gefunden', 'yellow');
      return [];
    }

    const assets = [];
    this.scanAssetsRecursively(assetsPath, assets);
    
    // Nach Größe sortieren
    assets.sort((a, b) => b.size - a.size);
    
    this.log('\n📊 Asset Statistiken:', 'yellow');
    this.log(`Total Assets: ${assets.length}`, 'white');
    
    const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
    this.log(`Gesamt Größe: ${(totalSize / 1024 / 1024).toFixed(2)}MB`, 'white');
    
    // Asset Typen gruppieren
    const byType = {};
    assets.forEach(asset => {
      const ext = path.extname(asset.name).toLowerCase();
      if (!byType[ext]) byType[ext] = { count: 0, size: 0 };
      byType[ext].count++;
      byType[ext].size += asset.size;
    });

    this.log('\n📁 Nach Dateityp:', 'yellow');
    Object.entries(byType).forEach(([ext, data]) => {
      this.log(`${ext || 'no-ext'}: ${data.count} Dateien, ${(data.size / 1024 / 1024).toFixed(2)}MB`, 'white');
    });

    return assets;
  }

  scanAssetsRecursively(dir, assets) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.scanAssetsRecursively(filePath, assets);
      } else {
        assets.push({
          name: file,
          path: filePath,
          size: stat.size,
          sizeMB: (stat.size / 1024 / 1024).toFixed(2)
        });
      }
    });
  }

  getFolderSize(folderPath) {
    let totalSize = 0;
    
    try {
      const files = fs.readdirSync(folderPath);
      
      files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          totalSize += this.getFolderSize(filePath);
        } else {
          totalSize += stat.size;
        }
      });
    } catch (error) {
      // Ignore errors for inaccessible files
    }
    
    return totalSize;
  }

  // Optimierungsvorschläge generieren
  generateOptimizations(bundleResults, dependencies, assets) {
    this.log('\n💡 Optimierungsvorschläge:', 'magenta');
    
    const suggestions = [];

    // Bundle Size Checks
    Object.entries(bundleResults).forEach(([platform, result]) => {
      if (result.sizeMB && parseFloat(result.sizeMB) > 5) {
        suggestions.push({
          type: 'bundle',
          severity: 'high',
          message: `${platform.toUpperCase()} Bundle ist ${result.sizeMB}MB (>5MB). Verwende Code Splitting.`
        });
      }
    });

    // Dependency Size Checks
    if (dependencies && dependencies.length > 0) {
      const largeDeps = dependencies.filter(dep => parseFloat(dep.sizeMB) > 10);
      largeDeps.forEach(dep => {
        suggestions.push({
          type: 'dependency',
          severity: 'medium',
          message: `Dependency "${dep.name}" ist ${dep.sizeMB}MB. Prüfe auf Alternativen.`
        });
      });
    }

    // Asset Size Checks
    if (assets && assets.length > 0) {
      const largeAssets = assets.filter(asset => parseFloat(asset.sizeMB) > 1);
      largeAssets.forEach(asset => {
        suggestions.push({
          type: 'asset',
          severity: 'medium',
          message: `Asset "${asset.name}" ist ${asset.sizeMB}MB. Komprimiere oder konvertiere zu WebP.`
        });
      });
    }

    // Suggestions ausgeben
    suggestions.forEach(suggestion => {
      const color = suggestion.severity === 'high' ? 'red' : 
                   suggestion.severity === 'medium' ? 'yellow' : 'cyan';
      this.log(`${suggestion.severity === 'high' ? '🔴' : suggestion.severity === 'medium' ? '🟡' : '🔵'} ${suggestion.message}`, color);
    });

    if (suggestions.length === 0) {
      this.log('✅ Keine kritischen Bundle Size Probleme gefunden!', 'green');
    }

    return suggestions;
  }

  // Report generieren
  generateReport(bundleResults, dependencies, assets, suggestions) {
    const report = {
      timestamp: new Date().toISOString(),
      bundles: bundleResults,
      dependencies: dependencies?.slice(0, 20), // Top 20
      assets: assets?.slice(0, 20), // Top 20
      suggestions,
      summary: {
        totalDependencies: dependencies?.length || 0,
        totalAssets: assets?.length || 0,
        totalSuggestions: suggestions?.length || 0
      }
    };

    const reportPath = path.join(this.bundleDir, 'bundle-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`\n📄 Report gespeichert: ${reportPath}`, 'green');
    return report;
  }

  // HTML Report generieren
  generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle Size Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        .section { margin: 20px 0; }
        .bundle-item, .dep-item, .asset-item { 
            padding: 10px; margin: 5px 0; border-left: 4px solid #007acc; background: #f5f5f5; 
        }
        .suggestion { padding: 10px; margin: 5px 0; border-radius: 4px; }
        .high { border-left: 4px solid #dc3545; background: #f8d7da; }
        .medium { border-left: 4px solid #ffc107; background: #fff3cd; }
        .low { border-left: 4px solid #28a745; background: #d4edda; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📱 React Native Bundle Size Report</h1>
        <p>Generiert am: ${new Date(report.timestamp).toLocaleString('de-DE')}</p>
    </div>
    
    <div class="section">
        <h2>📦 Bundle Größen</h2>
        ${Object.entries(report.bundles).map(([platform, bundle]) => `
            <div class="bundle-item">
                <strong>${platform.toUpperCase()}</strong>: 
                ${bundle.sizeMB ? `${bundle.sizeMB}MB` : `Fehler: ${bundle.error}`}
            </div>
        `).join('')}
    </div>
    
    <div class="section">
        <h2>📊 Top Dependencies</h2>
        <table>
            <tr><th>Name</th><th>Version</th><th>Größe</th></tr>
            ${(report.dependencies || []).map(dep => `
                <tr><td>${dep.name}</td><td>${dep.version}</td><td>${dep.sizeMB}MB</td></tr>
            `).join('')}
        </table>
    </div>
    
    <div class="section">
        <h2>🖼️ Größte Assets</h2>
        <table>
            <tr><th>Name</th><th>Größe</th></tr>
            ${(report.assets || []).map(asset => `
                <tr><td>${asset.name}</td><td>${asset.sizeMB}MB</td></tr>
            `).join('')}
        </table>
    </div>
    
    <div class="section">
        <h2>💡 Optimierungsvorschläge</h2>
        ${(report.suggestions || []).map(suggestion => `
            <div class="suggestion ${suggestion.severity}">
                ${suggestion.message}
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    const htmlPath = path.join(this.bundleDir, 'bundle-report.html');
    fs.writeFileSync(htmlPath, html);
    
    this.log(`🌐 HTML Report: ${htmlPath}`, 'green');
  }

  // Hauptanalyse ausführen
  async run() {
    this.log('🚀 Starte Bundle Size Analyse...', 'cyan');
    
    try {
      // 1. Bundles generieren
      const bundleResults = await this.generateBundles();
      
      // 2. Dependencies analysieren
      const dependencies = this.analyzeNodeModules();
      
      // 3. Assets analysieren
      const assets = this.analyzeAssets();
      
      // 4. Optimierungen vorschlagen
      const suggestions = this.generateOptimizations(bundleResults, dependencies, assets);
      
      // 5. Report generieren
      const report = this.generateReport(bundleResults, dependencies, assets, suggestions);
      this.generateHTMLReport(report);
      
      this.log('\n✅ Bundle Analyse abgeschlossen!', 'green');
      this.log(`📂 Ergebnisse in: ${this.bundleDir}`, 'cyan');
      
    } catch (error) {
      this.log(`❌ Fehler bei der Analyse: ${error.message}`, 'red');
      throw error;
    }
  }
}

// CLI Interface
const command = process.argv[2];

switch (command) {
  case 'analyze':
  case 'run':
    const analyzer = new BundleAnalyzer();
    analyzer.run().catch(console.error);
    break;
    
  default:
    console.log(`
🎯 React Native Bundle Analyzer

Verwendung:
  npm run bundle:analyze        Vollständige Bundle Analyse
  node scripts/bundle-analyzer.mjs analyze
    `);
    break;
} 