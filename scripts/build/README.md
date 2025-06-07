# 🏗️ Build & Analysis Scripts

Diese Scripts unterstützen beim Build-Prozess, Bundle-Analyse und Projekt-Validierung.

## 🚀 Verfügbare Scripts

### `bundle-analyzer.js`
**Zweck:** Enterprise Bundle Size Analyzer für React Native

```bash
# Ausführung
node scripts/build/bundle-analyzer.js
# oder
npm run build:analyze
```

**Features:**
- Bundle-Größe für iOS/Android analysieren
- Dependency-Größen auswerten
- Asset-Analyse
- HTML-Report generieren
- Optimierungsvorschläge

**Output:**
- Bundle-Analyse Report
- Größenstatistiken
- Performance-Empfehlungen

### `bundle-analyzer.mjs`
**Zweck:** ES6 Module Version des Bundle Analyzers

```bash
# Ausführung
node scripts/build/bundle-analyzer.mjs
```

### `validate-project.mjs`
**Zweck:** Umfassende Projekt-Validierung

```bash
# Ausführung
node scripts/build/validate-project.mjs
# oder
npm run dev:validate
```

**Validiert:**
- TypeScript Konfiguration
- ESLint Rules
- Package Dependencies
- File Structure
- Environment Variables
- Build Konfiguration

**Output:**
- Validierungsreport
- Fehler und Warnungen
- Verbesserungsvorschläge
- Compliance-Status

## 📊 Bundle-Analyse Tipps

### Große Dependencies identifizieren
```bash
# Bundle analysieren und Report generieren
node scripts/build/bundle-analyzer.js
```

### Performance optimieren
1. **Tree Shaking** aktivieren
2. **Code Splitting** implementieren
3. **Unused Dependencies** entfernen
4. **Asset Compression** verwenden

### Monitoring
- Bundle-Größe regelmäßig überwachen
- CI/CD Integration für automatische Analyse
- Performance Budgets definieren

## 🎯 Best Practices

1. **Regelmäßige Analyse** vor Releases
2. **Performance Budgets** einhalten
3. **Dependencies ausmisten** regelmäßig
4. **Tree Shaking** optimal nutzen
5. **Asset Optimierung** implementieren 