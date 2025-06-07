# 📜 Scripts Dokumentation

Dieses Verzeichnis enthält alle Entwicklungstools und Automatisierungsscripts für das React Native Skeleton Template, organisiert in logischen Kategorien.

## 🗂️ Ordnerstruktur

```
scripts/
├── 📦 features/          # Feature-Management Scripts
├── 🏗️ build/            # Build & Analyse Scripts  
├── 📚 docs/              # Dokumentations Scripts
├── ⚙️ setup/             # Setup & Konfiguration
├── 🛠️ dev/               # Development Tools
└── 📄 README.md          # Diese Dokumentation
```

## 🚀 Schnellstart

```bash
# Feature CLI starten (empfohlen)
npm run feature:cli

# Development Menu öffnen
npm run dev:menu

# Projekt validieren
npm run dev:validate
```

## 📋 Script-Kategorien

### 📦 [Feature Management](./features/)
**Zweck:** Automatisierte Feature-Erstellung und -Verwaltung

**Scripts:**
- `create.sh` - Neues Feature mit Clean Architecture
- `create-crud.mjs` - CRUD-Feature mit API-Integration
- `update.sh` - Feature erweitern
- `delete.sh` - Feature löschen
- `list.sh` - Features auflisten
- `cli.mjs` - Interaktive Feature-CLI

**Schnellzugriff:**
```bash
npm run feature:cli    # Interaktive CLI
npm run feature:create # Neues Feature
npm run feature:crud   # CRUD Feature
```

### 🏗️ [Build & Analysis](./build/)
**Zweck:** Bundle-Analyse und Projekt-Validierung

**Scripts:**
- `bundle-analyzer.js` - Bundle-Größe analysieren
- `bundle-analyzer.mjs` - ES6 Bundle Analyzer
- `validate-project.mjs` - Projekt validieren

**Schnellzugriff:**
```bash
npm run build:analyze  # Bundle analysieren
npm run dev:validate   # Projekt validieren
```

### 📚 [Documentation](./docs/)
**Zweck:** Automatische Dokumentationsgenerierung

**Scripts:**
- `generate-docs.ts` - Feature-Dokumentation generieren
- `adr-manager.js` - Architecture Decision Records

**Schnellzugriff:**
```bash
npm run docs:generate  # Dokumentation generieren
npm run docs:features  # Feature-Docs
```

### ⚙️ [Setup & Configuration](./setup/)
**Zweck:** Projekt-Setup und Konfiguration

**Scripts:**
- `setup-monitoring.mjs` - Monitoring konfigurieren
- `dependency-management.mjs` - Dependencies verwalten

**Schnellzugriff:**
```bash
node scripts/setup/setup-monitoring.mjs
node scripts/setup/dependency-management.mjs
```

### 🛠️ [Development Tools](./dev/)
**Zweck:** Entwicklungsunterstützung

**Scripts:**
- `dev-menu.mjs` - Umfassendes Development Menu

**Schnellzugriff:**
```bash
npm run dev:menu       # Development Menu
```

## 🎯 Empfohlene Workflows

### 🆕 Neues Feature erstellen
```bash
# 1. Feature CLI starten
npm run feature:cli

# 2. Option wählen (Create Feature oder CRUD Feature)
# 3. Eingaben machen
# 4. Feature wird automatisch generiert
```

### 🔍 Code-Qualität prüfen
```bash
# 1. Development Menu öffnen
npm run dev:menu

# 2. Code-Qualität Optionen nutzen:
#    - ESLint ausführen
#    - Code formatieren  
#    - TypeScript prüfen
#    - Tests ausführen
```

### 📊 Projekt analysieren
```bash
# Bundle-Größe analysieren
npm run build:analyze

# Projekt validieren
npm run dev:validate

# Dokumentation generieren
npm run docs:generate
```

## 🔧 Konfiguration

### Script-Berechtigungen
```bash
# Alle Scripts ausführbar machen (macOS/Linux)
chmod +x scripts/**/*.sh

# Windows: Git Bash oder WSL verwenden
```

### Umgebungsvariablen
```bash
# Debug-Modus aktivieren
export DEBUG_SCRIPTS=true

# Windows-Kompatibilität
export FORCE_NODE_SCRIPTS=true

# Automatische Formatierung
export AUTO_FORMAT=true
```

## 📊 Statistiken

**Gesamt:** 15 Scripts in 5 Kategorien
- **6 Feature-Management Scripts**
- **3 Build & Analyse Scripts**
- **2 Dokumentations Scripts**
- **2 Setup Scripts**
- **1 Development Tool**

**Unterstützte Plattformen:** macOS, Linux, Windows
**Sprachen:** Bash, Node.js, TypeScript

## 🚀 Migration von alter Struktur

Falls Sie Scripts aus der alten flachen Struktur verwenden:

**Alte Pfade → Neue Pfade:**
```bash
scripts/create_feature.sh        → scripts/features/create.sh
scripts/feature-cli.mjs          → scripts/features/cli.mjs
scripts/bundle-analyzer.js       → scripts/build/bundle-analyzer.js
scripts/generate-docs.ts         → scripts/docs/generate-docs.ts
scripts/setup-monitoring.mjs     → scripts/setup/setup-monitoring.mjs
scripts/dev-menu.mjs             → scripts/dev/dev-menu.mjs
```

**NPM Scripts bleiben unverändert:**
```bash
npm run feature:cli              # Funktioniert weiterhin
npm run dev:menu                 # Funktioniert weiterhin
npm run build:analyze            # Funktioniert weiterhin
```

## 🔍 Troubleshooting

### Häufige Probleme

**Script nicht gefunden:**
```bash
# Prüfen Sie den neuen Pfad
ls scripts/features/           # Feature Scripts
ls scripts/build/              # Build Scripts
```

**Berechtigungsfehler:**
```bash
# macOS/Linux
chmod +x scripts/features/*.sh

# Windows
# Git Bash oder WSL verwenden
```

**Node.js Fehler:**
```bash
# Node.js Version prüfen (>= 18)
node --version

# Dependencies installieren
npm install
```

## 📖 Weitere Dokumentation

- [Feature Management](./features/README.md) - Detaillierte Feature-Script Dokumentation
- [Build & Analysis](./build/README.md) - Bundle-Analyse und Validierung
- Einzelne Script-Dokumentation in den jeweiligen Ordnern

---

**Happy Scripting! 🚀**

*Organisiert für bessere Übersichtlichkeit und Wartbarkeit.* 