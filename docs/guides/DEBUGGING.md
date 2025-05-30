# 🐛 Debugging Guide - Modern React Native Tools

## 📋 Übersicht

Diese Dokumentation beschreibt die modernen Debugging-Tools die anstelle von Flipper (deprecated) verwendet werden.

---

## 🔧 Verfügbare Debugging-Tools

### 1. React Native DevTools (Eingebaut)

**Automatisch verfügbar** in Development Builds:

```bash
# Starte den Metro Server
npm start

# DevTools automatisch verfügbar unter:
# http://localhost:8081/debugger-ui
```

**Features:**
- Component Inspector
- Network Monitoring  
- Performance Profiling
- State Management
- Element Inspector

### 2. Reactotron (Installiert)

**Setup in der App:**

```typescript
// src/config/reactotron.ts
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
```

**Features:**
- Redux/Zustand State Monitoring
- API Request/Response Tracking
- AsyncStorage Inspection
- Real-time Logs
- Custom Commands

### 3. React Native Debugger

**Installation:**
```bash
# Global Installation
npm install --global react-native-debugger

# Oder via Homebrew (macOS)
brew install react-native-debugger
```

### 4. Chrome DevTools

**Via Metro:**
```bash
npm start
# In Metro, drücke 'j' um DevTools zu öffnen
```

### 5. VS Code Debugging

**Setup in `.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React Native",
      "request": "launch",
      "type": "reactnative",
      "cwd": "${workspaceFolder}",
      "platform": "ios"
    }
  ]
}
```

---

## 🎯 Production Debugging

### Sentry Error Tracking

**Bereits konfiguriert:**
- Real-time Error Monitoring
- Performance Tracking
- Release Health
- User Context

### Firebase Crashlytics

**Automatische Crash Reports:**
- Native iOS/Android Crashes
- JavaScript Errors
- Performance Monitoring
- User Sessions

---

## 🚀 Migration von Flipper

### Was wurde entfernt:
- ❌ `react-native-flipper`
- ❌ `flipper-plugin-react-native-performance`
- ❌ Flipper Desktop Dependency

### Was wurde hinzugefügt:
- ✅ React Native DevTools (eingebaut)
- ✅ Reactotron für erweiterte Features
- ✅ Sentry für Production Monitoring
- ✅ Firebase Crashlytics

### Debugging Commands:

```bash
# Metro Server mit DevTools
npm start

# iOS Simulator mit Debugging
npm run ios

# Android Emulator mit Debugging  
npm run android

# Type Checking
npm run type-check

# Testing mit Debugging
npm run test:watch
```

---

## 📱 Platform-spezifische Tools

### iOS Debugging
- **Xcode Instruments**: Memory, CPU, Network Profiling
- **Simulator Developer Menu**: Shake gesture oder Cmd+D
- **Safari Web Inspector**: Für WebView Debugging

### Android Debugging
- **Android Studio Profiler**: Performance Analysis
- **Developer Menu**: Shake gesture oder adb shell input keyevent 82
- **Chrome DevTools**: chrome://inspect für WebView

---

## 🔍 Network Debugging

### API Monitoring
```typescript
// Automatisch verfügbar in DevTools
// Oder mit Reactotron:
import Reactotron from 'reactotron-react-native';

// API Requests werden automatisch getracked
```

### Flipper Network Plugin Ersatz:
- React Native DevTools Network Tab
- Reactotron Network Monitoring
- Sentry Performance Monitoring

---

**Erstellt**: 2024-01-15  
**Letzte Aktualisierung**: 2024-01-15  
**Version**: 1.0.0  
**React Native**: 0.79.1 mit React 19.0.0 