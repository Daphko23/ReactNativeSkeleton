# 📦 Feature Management Scripts

Diese Scripts automatisieren die Erstellung, Verwaltung und Wartung von Features in der React Native App.

## 🚀 Verfügbare Scripts

### `create.sh`
**Zweck:** Erstellt ein neues Feature mit Clean Architecture Struktur

```bash
# Ausführung
bash scripts/features/create.sh
# oder
npm run feature:create
```

**Generiert:**
- Domain Layer (Entities, Repositories, Types)
- Application Layer (Use Cases, Services)  
- Data Layer (Repository Implementation, DTOs, Mappers)
- Presentation Layer (Screens, Components, Store, Hooks)
- Tests-Struktur
- feature.json Metadaten

### `create-crud.mjs`
**Zweck:** Erstellt ein vollständiges CRUD-Feature mit API-Integration

```bash
# Ausführung
node scripts/features/create-crud.mjs
# oder
npm run feature:crud
```

**Features:**
- Vollständige CRUD-Operationen
- Supabase-Integration
- Zustand State Management
- React Native Paper UI
- TypeScript-Support

### `update.sh`
**Zweck:** Erweitert ein vorhandenes Feature um neue Komponenten

```bash
# Ausführung
bash scripts/features/update.sh
# oder
npm run feature:update
```

### `delete.sh`
**Zweck:** Löscht ein Feature komplett (mit Sicherheitsabfrage)

```bash
# Ausführung
bash scripts/features/delete.sh
# oder
npm run feature:delete
```

### `list.sh`
**Zweck:** Listet alle vorhandenen Features mit Details auf

```bash
# Ausführung
bash scripts/features/list.sh
# oder
npm run feature:list
```

### `cli.mjs`
**Zweck:** Interaktive Cross-Platform CLI für Feature-Management

```bash
# Ausführung
node scripts/features/cli.mjs
# oder
npm run feature:cli
```

**Menü-Optionen:**
1. 📦 Neues Feature erstellen
2. 🏗️ CRUD-Feature erstellen
3. 📋 Features auflisten
4. ✨ Feature erweitern
5. 🗑️ Feature löschen

## 📋 Best Practices

1. **Verwende die CLI** (`cli.mjs`) für interaktive Bedienung
2. **Folge Clean Architecture** bei Feature-Erstellung
3. **Teste neue Features** nach der Erstellung
4. **Dokumentiere Features** in feature.json
5. **Verwende TypeScript** konsequent 