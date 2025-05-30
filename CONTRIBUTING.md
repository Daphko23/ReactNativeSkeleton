# 🤝 Contributing to React Native Skeleton Template

Vielen Dank für dein Interesse, zu diesem React Native Template beizutragen! Jeder Beitrag hilft der Community.

## 🎯 Arten von Beiträgen

### 🐛 Bug Reports

- Template funktioniert nicht wie erwartet
- Konfigurationsfehler
- Veraltete Dependencies
- Dokumentationsfehler

### ✨ Feature Requests

- Neue Template-Features
- Zusätzliche Konfigurationen
- Verbesserte Developer Experience
- Neue Architektur-Patterns

### 📚 Dokumentation

- README Verbesserungen
- Setup-Anleitung erweitern
- Code-Beispiele hinzufügen
- Übersetzungen

### 🔧 Code Contributions

- Bug Fixes
- Performance Verbesserungen
- Neue Features
- Refactoring

## 🚀 Getting Started

### 1. Repository forken

```bash
# Fork das Repository auf GitHub
# Dann klone deinen Fork:
git clone https://github.com/dein-username/react-native-skeleton-template.git
cd react-native-skeleton-template
```

### 2. Development Setup

```bash
# Dependencies installieren
npm install

# iOS Setup (auf macOS)
cd ios && pod install && cd ..

# Template testen
npm run ios
npm run android
```

### 3. Branch erstellen

```bash
# Feature Branch erstellen
git checkout -b feature/mein-neues-feature

# Oder Bug Fix Branch
git checkout -b fix/bug-beschreibung
```

## 📋 Development Guidelines

### Code Style

- **ESLint + Prettier** - Automatische Formatierung
- **TypeScript** - Vollständige Typisierung
- **Clean Architecture** - Konsistente Struktur beibehalten

### Commit Messages

Verwende [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: add new authentication provider"

# Bug Fixes
git commit -m "fix: resolve iOS build issue with React Native 0.79"

# Documentation
git commit -m "docs: update setup instructions for Android"

# Refactoring
git commit -m "refactor: improve theme system structure"

# Tests
git commit -m "test: add unit tests for auth store"
```

### Testing

```bash
# Tests vor Pull Request ausführen
npm test
npm run lint
npm run type-check

# Template in beiden Plattformen testen
npm run ios
npm run android
```

## 🔍 Template-spezifische Guidelines

### 1. Template-Kompatibilität

- **Generisch bleiben** - Keine projektspezifischen Konfigurationen
- **Dokumentiert** - Jede Änderung muss dokumentiert werden
- **Getestet** - Funktioniert auf iOS und Android
- **Aktuell** - Neueste stabile Versionen verwenden

### 2. Ordnerstruktur beibehalten

```
src/
├── core/           # Kern-Funktionalitäten
├── features/       # Feature-Module (Clean Architecture)
├── shared/         # Geteilte Komponenten
└── types/          # Type-Definitionen
```

### 3. Dependencies

- **Begründung** - Warum ist die neue Dependency notwendig?
- **Größe** - Bundle-Size Impact berücksichtigen
- **Wartung** - Aktiv gewartete Packages bevorzugen
- **Lizenz** - MIT-kompatible Lizenzen

### 4. Konfigurationsdateien

- **Kommentiert** - Erklärungen für komplexe Konfigurationen
- **Modular** - Einfach anpassbar für verschiedene Projekte
- **Dokumentiert** - Änderungen in SETUP.md erwähnen

## 📝 Pull Request Process

### 1. Vorbereitung

```bash
# Aktuellste Version holen
git checkout main
git pull upstream main

# Feature Branch aktualisieren
git checkout feature/mein-feature
git rebase main
```

### 2. Pull Request erstellen

- **Beschreibung** - Was wurde geändert und warum?
- **Screenshots** - Bei UI-Änderungen
- **Testing** - Wie wurde getestet?
- **Breaking Changes** - Sind Breaking Changes enthalten?

### 3. PR Template verwenden

```markdown
## 📋 Beschreibung

Kurze Beschreibung der Änderungen...

## 🔄 Art der Änderung

- [ ] Bug Fix
- [ ] Neues Feature
- [ ] Breaking Change
- [ ] Dokumentation

## 🧪 Testing

- [ ] iOS getestet
- [ ] Android getestet
- [ ] Unit Tests hinzugefügt/aktualisiert
- [ ] Linting bestanden

## 📱 Screenshots (falls UI-Änderungen)

...

## 📚 Dokumentation

- [ ] README aktualisiert
- [ ] SETUP.md aktualisiert
- [ ] Code kommentiert
```

## 🐛 Bug Reports

### Template für Bug Reports

```markdown
## 🐛 Bug Beschreibung

Klare Beschreibung des Problems...

## 🔄 Reproduktion

Schritte zur Reproduktion:

1. Template verwenden
2. Befehl ausführen: `npm run ios`
3. Fehler tritt auf...

## 💻 Umgebung

- OS: [z.B. macOS 14.0]
- Node.js: [z.B. 18.17.0]
- React Native: [z.B. 0.79.1]
- Xcode: [z.B. 15.0] (für iOS)
- Android Studio: [z.B. 2023.1] (für Android)

## 📋 Erwartetes Verhalten

Was sollte passieren...

## 📋 Aktuelles Verhalten

Was passiert stattdessen...

## 📱 Screenshots/Logs

...
```

## ✨ Feature Requests

### Template für Feature Requests

```markdown
## 🚀 Feature Beschreibung

Beschreibung des gewünschten Features...

## 🎯 Problem/Motivation

Welches Problem löst dieses Feature?

## 💡 Vorgeschlagene Lösung

Wie könnte das Feature implementiert werden?

## 🔄 Alternativen

Andere Lösungsansätze...

## 📋 Zusätzlicher Kontext

Screenshots, Links, etc...
```

## 🏷️ Issue Labels

- `bug` - Etwas funktioniert nicht
- `enhancement` - Neues Feature oder Verbesserung
- `documentation` - Dokumentation verbessern
- `good first issue` - Gut für Erstbeiträge
- `help wanted` - Community-Hilfe erwünscht
- `template` - Template-spezifische Issues
- `ios` - iOS-spezifische Probleme
- `android` - Android-spezifische Probleme
- `dependencies` - Dependency-Updates

## 🎉 Anerkennung

Alle Beiträge werden in der [Contributors](../../graphs/contributors) Liste angezeigt.

Besondere Beiträge werden in der README erwähnt:

- Neue Features
- Wichtige Bug Fixes
- Dokumentationsverbesserungen
- Community-Unterstützung

## 📞 Kontakt

- **Issues** - [GitHub Issues](../../issues)
- **Discussions** - [GitHub Discussions](../../discussions)
- **Security** - Siehe [SECURITY.md](SECURITY.md)

## 📄 Code of Conduct

Dieses Projekt folgt dem [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).
Durch die Teilnahme stimmst du zu, diesen Code einzuhalten.

---

**Vielen Dank für deinen Beitrag zur React Native Community!** 🙏

Jeder Beitrag, egal wie klein, macht das Template besser für alle. 🚀
