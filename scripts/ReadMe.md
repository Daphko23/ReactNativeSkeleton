# 📜 Scripts Dokumentation

Dieses Verzeichnis enthält alle Entwicklungstools und Automatisierungsscripts für das React Native Skeleton Template.

## 🚀 Schnellstart

```bash
# Feature CLI starten (empfohlen)
npm run feature:cli

# Development Menu öffnen
npm run dev:menu

# Projekt validieren
npm run dev:validate
```

## 📋 Verfügbare Scripts

### 🏗️ Feature-Management

#### `create_feature.sh`

Erstellt ein neues Feature mit Clean Architecture Struktur.

```bash
# Direkt ausführen
bash scripts/create_feature.sh

# Über npm
npm run feature:create
```

**Generiert:**

- Domain Layer (Entities, Repositories, Types)
- Application Layer (Use Cases, Services)
- Data Layer (Repository Implementation, DTOs, Mappers)
- Presentation Layer (Screens, Components, Store, Hooks)
- Tests-Struktur
- feature.json Metadaten

#### `create-crud-feature.js`

Erstellt ein vollständiges CRUD-Feature mit API-Integration.

```bash
# Direkt ausführen
node scripts/create-crud-feature.js

# Über npm
npm run feature:crud
```

**Features:**

- Vollständige CRUD-Operationen (Create, Read, Update, Delete)
- Supabase-Integration
- Zustand State Management
- React Native Paper UI
- TypeScript-Support
- Automatische Code-Formatierung

**Beispiel-Eingaben:**

```
Feature-Name: todo
Beschreibung: Todo-Verwaltung mit CRUD-Operationen
Entity-Felder: title:string,completed:boolean,priority:number
Authentifizierung: y
API-Endpoint: /api/todos
```

#### `list_features.sh`

Listet alle vorhandenen Features mit Details auf.

```bash
# Direkt ausführen
bash scripts/list_features.sh

# Über npm
npm run feature:list
```

**Zeigt an:**

- Feature-Namen und Beschreibungen
- Anzahl Screens und UseCases
- Store-Integration
- Erstellungsdatum
- Statistiken

#### `update_feature.sh`

Erweitert ein vorhandenes Feature um neue Komponenten.

```bash
# Direkt ausführen
bash scripts/update_feature.sh

# Über npm
npm run feature:update
```

**Kann hinzufügen:**

- Neue Screens
- Zusätzliche UseCases
- Components
- Services

#### `delete_feature.sh`

Löscht ein Feature komplett (mit Sicherheitsabfrage).

```bash
# Direkt ausführen
bash scripts/delete_feature.sh

# Über npm
npm run feature:delete
```

**Sicherheitsfeatures:**

- Übersicht vor Löschung
- "yes"-Bestätigung erforderlich
- Cleanup-Hinweise

### 🛠️ Development Tools

#### `feature-cli.js`

Interaktive Cross-Platform CLI für Feature-Management.

```bash
# Direkt ausführen
node scripts/feature-cli.js

# Über npm
npm run feature:cli
```

**Menü-Optionen:**

1. 📦 Neues Feature erstellen
2. 🏗️ CRUD-Feature erstellen
3. 📋 Features auflisten
4. ✨ Feature erweitern
5. 🗑️ Feature löschen
6. 📚 Dokumentation generieren
7. 🔧 Projekt validieren
8. ❌ Beenden

**Cross-Platform:**

- macOS/Linux: Bash-Scripts
- Windows: Node.js-Implementierung
- Automatische Plattform-Erkennung

#### `dev-menu.js`

Umfassendes Development Menu für alle Entwicklungsaufgaben.

```bash
# Direkt ausführen
node scripts/dev-menu.js

# Über npm
npm run dev:menu
```

**Kategorien:**

**📱 App-Verwaltung:**

- iOS App starten
- Android App starten
- Cache leeren
- Metro Server neustarten

**🔧 Code-Qualität:**

- ESLint ausführen (mit Auto-Fix)
- Code formatieren (Prettier)
- TypeScript prüfen
- Tests ausführen (verschiedene Modi)

**📦 Feature-Management:**

- Feature CLI öffnen
- Features auflisten
- Dokumentation generieren

**🔧 Projekt-Tools:**

- Projekt validieren
- Bundle-Größe analysieren
- Komplette Bereinigung

#### `validate-project.js`

Umfassender Projekt-Validator für Template-Qualität.

```bash
# Direkt ausführen
node scripts/validate-project.js

# Über npm
npm run dev:validate
```

**Validierungs-Bereiche (100 Punkte):**

1. **Projektstruktur (20 Punkte)**

   - src/, src/core/, src/features/, src/shared/
   - scripts/, docs/, **tests**/
   - ios/, android/

2. **Konfigurationsdateien (15 Punkte)**

   - package.json, tsconfig.json, .eslintrc.js
   - babel.config.js, metro.config.js, jest.config.js
   - .prettierrc, .gitignore, README.md

3. **Package.json (10 Punkte)**

   - Erforderliche Scripts
   - Moderne Dependencies
   - Korrekte Metadaten

4. **TypeScript (5 Punkte)**

   - Strict Mode
   - BaseUrl Konfiguration
   - Path Mapping

5. **ESLint (5 Punkte)**

   - React Native Config
   - Prettier Integration

6. **Feature-Struktur (10 Punkte)**

   - Clean Architecture Compliance
   - feature.json Metadaten

7. **Scripts (10 Punkte)**

   - Vollständigkeit
   - Ausführbarkeit

8. **Dokumentation (5 Punkte)**

   - README.md, docs/FEATURES.md
   - docs/ARCHITECTURE.md, scripts/README.md

9. **Git Hooks (5 Punkte)**

   - Husky Setup
   - lint-staged Konfiguration

10. **Template-Qualität (10 Punkte)**
    - Keine hardcodierten Namen
    - Template-kompatible Scripts
    - Clean Architecture
    - Moderne Patterns

**Bewertungsskala:**

- 🏆 95-100%: EXZELLENT
- 🥇 85-94%: SEHR GUT
- 🥈 75-84%: GUT
- 🥉 65-74%: BEFRIEDIGEND
- ⚠️ 50-64%: AUSREICHEND
- ❌ <50%: MANGELHAFT

### 📚 Dokumentation

#### `generate-docs.ts`

Generiert automatisch Feature-Dokumentation.

```bash
# Direkt ausführen
npx ts-node scripts/generate-docs.ts

# Über npm
npm run docs:generate
npm run docs:features
```

**Generiert:**

- `docs/GENERATED_FEATURES.md`
- Feature-Übersicht mit Metadaten
- Clean Architecture Diagramme
- Verwendungsbeispiele
- Zeitstempel und Statistiken

## 🎯 Best Practices

### 1. Feature-Entwicklung

**Empfohlener Workflow:**

```bash
# 1. Feature CLI starten
npm run feature:cli

# 2. CRUD-Feature erstellen (Option 2)
# Eingaben machen

# 3. Projekt validieren
npm run dev:validate

# 4. Tests schreiben
npm run test

# 5. Dokumentation generieren
npm run docs:generate
```

### 2. Code-Qualität

**Vor jedem Commit:**

```bash
# Development Menu öffnen
npm run dev:menu

# Code-Qualität prüfen (Optionen 5-8)
# - ESLint ausführen
# - Code formatieren
# - TypeScript prüfen
# - Tests ausführen
```

### 3. Debugging

**Bei Problemen:**

```bash
# 1. Cache leeren
npm run dev:menu # Option 3

# 2. Komplette Bereinigung
npm run dev:menu # Option 14

# 3. Projekt validieren
npm run dev:validate
```

## 🔧 Konfiguration

### Script-Berechtigungen

Alle Scripts sind automatisch ausführbar. Falls Probleme auftreten:

```bash
# Alle Scripts ausführbar machen
chmod +x scripts/*.sh scripts/*.js

# Einzelne Scripts
chmod +x scripts/create_feature.sh
chmod +x scripts/feature-cli.js
```

### Umgebungsvariablen

Scripts respektieren folgende Umgebungsvariablen:

```bash
# Für Windows-Kompatibilität
export FORCE_NODE_SCRIPTS=true

# Für Debug-Ausgaben
export DEBUG_SCRIPTS=true

# Für automatische Formatierung
export AUTO_FORMAT=true
```

### Anpassungen

Scripts können über `package.json` angepasst werden:

```json
{
  "scripts": {
    "feature:create": "bash scripts/create_feature.sh",
    "feature:crud": "node scripts/create-crud-feature.js",
    "feature:cli": "node scripts/feature-cli.js",
    "dev:menu": "node scripts/dev-menu.js",
    "dev:validate": "node scripts/validate-project.js"
  }
}
```

## 🚀 Erweiterte Nutzung

### Batch-Operationen

```bash
# Mehrere Features erstellen
for feature in user product order; do
  echo "Creating $feature feature..."
  # Automatisierte Eingaben hier
done

# Alle Features validieren
npm run feature:list | grep "Feature:" | while read line; do
  echo "Validating $line..."
done
```

### CI/CD Integration

```yaml
# .github/workflows/ci.yml
- name: Validate Project
  run: npm run dev:validate

- name: Generate Documentation
  run: npm run docs:generate

- name: Check Features
  run: npm run feature:list
```

### IDE Integration

**VS Code Tasks (`.vscode/tasks.json`):**

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Feature CLI",
      "type": "shell",
      "command": "npm run feature:cli",
      "group": "build"
    },
    {
      "label": "Dev Menu",
      "type": "shell",
      "command": "npm run dev:menu",
      "group": "build"
    }
  ]
}
```

## 🔍 Troubleshooting

### Häufige Probleme

**1. Script nicht ausführbar**

```bash
chmod +x scripts/script-name.sh
```

**2. Node.js Script Fehler**

```bash
# Node.js Version prüfen
node --version  # Sollte >= 18 sein

# Dependencies installieren
npm install
```

**3. Bash Script Fehler (Windows)**

```bash
# Git Bash verwenden oder WSL
# Oder Node.js Variante nutzen
npm run feature:cli  # Statt bash scripts
```

**4. Pfad-Probleme**

```bash
# Aus Projekt-Root ausführen
cd /path/to/project
npm run feature:cli
```

**5. Berechtigungsfehler**

```bash
# macOS/Linux
sudo chmod +x scripts/*.sh

# Windows (als Administrator)
icacls scripts /grant Everyone:F /T
```

### Debug-Modus

```bash
# Debug-Ausgaben aktivieren
export DEBUG_SCRIPTS=true
npm run feature:cli

# Verbose npm
npm run feature:cli --verbose

# Script direkt mit Debug
bash -x scripts/create_feature.sh
```

## 📊 Statistiken

Das Template enthält **9 Scripts** mit folgenden Funktionen:

- **4 Feature-Management Scripts** (create, list, update, delete)
- **3 Development Tools** (CLI, Menu, Validator)
- **1 CRUD-Generator** (vollständige API-Integration)
- **1 Dokumentations-Generator** (automatische Docs)

**Gesamt-Codezeilen:** ~2.500 Zeilen
**Unterstützte Plattformen:** macOS, Linux, Windows
**Sprachen:** Bash, Node.js, TypeScript

## 🎯 Roadmap

### Geplante Erweiterungen

1. **GraphQL-Generator** - CRUD mit GraphQL
2. **Test-Generator** - Automatische Test-Erstellung
3. **Migration-Tools** - Datenbank-Migrationen
4. **Performance-Analyzer** - Bundle-Optimierung
5. **Deployment-Scripts** - CI/CD Automatisierung

### Beiträge

Verbesserungsvorschläge und Pull Requests sind willkommen!

---

**Happy Scripting! 🚀**
