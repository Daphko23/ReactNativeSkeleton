# React Native Skeleton - Detaillierte Setup-Anleitung

Diese Anleitung führt dich Schritt für Schritt durch die Einrichtung eines neuen React Native Projekts basierend auf diesem Skeleton.

## 📋 Voraussetzungen

### Allgemein

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm oder yarn** - Kommt mit Node.js
- **Git** - Für Versionskontrolle
- **React Native CLI** - `npm install -g @react-native-community/cli`

### iOS Development

- **macOS** - Erforderlich für iOS Development
- **Xcode 14+** - [Mac App Store](https://apps.apple.com/de/app/xcode/id497799835)
- **CocoaPods** - `sudo gem install cocoapods`
- **iOS Simulator** - Kommt mit Xcode

### Android Development

- **Android Studio** - [Download](https://developer.android.com/studio)
- **Android SDK** - Über Android Studio installieren
- **Android Emulator** - Über Android Studio konfigurieren
- **Java Development Kit (JDK) 17** - Über Android Studio oder separat

## 🚀 Projekt Setup

### 1. Skeleton kopieren

```bash
# Kopiere das Skeleton zu deinem gewünschten Projektort
cp -r Skeleton/ MeinNeuesProjekt/
cd MeinNeuesProjekt/

# Git Repository initialisieren (optional)
git init
git add .
git commit -m "Initial commit with React Native Skeleton"
```

### 2. Projekt-Namen anpassen

#### package.json

```json
{
  "name": "mein-neues-projekt",
  "displayName": "Mein Neues Projekt"
}
```

#### app.json

```json
{
  "name": "MeinNeuesProjekt",
  "displayName": "Mein Neues Projekt"
}
```

### 3. Native Konfiguration anpassen

#### Android

1. **App-Name ändern:**

   ```xml
   <!-- android/app/src/main/res/values/strings.xml -->
   <resources>
       <string name="app_name">Mein Neues Projekt</string>
   </resources>
   ```

2. **Package-Name ändern:**

   ```gradle
   // android/app/build.gradle
   android {
       namespace "com.meinneuesproject"
       defaultConfig {
           applicationId "com.meinneuesproject"
           // ...
       }
   }
   ```

3. **Java-Package-Struktur umbenennen:**

   ```bash
   cd android/app/src/main/java/com/
   mv reactnativeskeleton meinneuesproject
   ```

4. **Java-Dateien anpassen:**

   ```kotlin
   // MainActivity.kt und MainApplication.kt
   package com.meinneuesproject

   // In MainActivity.kt:
   override fun getMainComponentName(): String = "MeinNeuesProjekt"
   ```

#### iOS

1. **App-Name ändern:**

   ```xml
   <!-- ios/ReactNativeSkeleton/Info.plist -->
   <key>CFBundleDisplayName</key>
   <string>Mein Neues Projekt</string>
   ```

2. **Xcode-Projekt umbenennen:**

   - Öffne `ios/ReactNativeSkeleton.xcworkspace` in Xcode
   - Wähle das Projekt in der Sidebar
   - Ändere "Product Name" und "Bundle Identifier"
   - Benenne das Scheme um (Product → Scheme → Manage Schemes)

3. **Ordner umbenennen (optional):**
   ```bash
   cd ios/
   mv ReactNativeSkeleton MeinNeuesProjekt
   mv ReactNativeSkeleton.xcodeproj MeinNeuesProjekt.xcodeproj
   mv ReactNativeSkeleton.xcworkspace MeinNeuesProjekt.xcworkspace
   ```

### 4. Dependencies installieren

```bash
# Node.js Dependencies
npm install

# iOS Dependencies (nur auf macOS)
cd ios && pod install && cd ..
```

### 5. Umgebungsvariablen konfigurieren

```bash
# .env-Datei erstellen
cp .env.example .env
```

Bearbeite die `.env`-Datei:

```env
# Supabase Configuration
SUPABASE_URL=deine_supabase_url
SUPABASE_ANON_KEY=dein_supabase_anon_key

# App Configuration
APP_ENV=development
API_BASE_URL=https://api.example.com
```

### 6. Erste Testläufe

```bash
# Metro Bundler starten
npm start

# iOS (in separatem Terminal)
npm run ios

# Android (in separatem Terminal)
npm run android
```

## 🔧 Erweiterte Konfiguration

### Deep Links konfigurieren

#### Android

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="meinapp" />
</intent-filter>
```

#### iOS

```xml
<!-- ios/MeinNeuesProjekt/Info.plist -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>meinapp</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>meinapp</string>
        </array>
    </dict>
</array>
```

### App Icons hinzufügen

#### Android

1. Erstelle Icons in verschiedenen Größen
2. Platziere sie in `android/app/src/main/res/mipmap-*/`
3. Benenne sie `ic_launcher.png` und `ic_launcher_round.png`

#### iOS

1. Erstelle ein App Icon Set in Xcode
2. Assets → App Icons → AppIcon
3. Ziehe deine Icons in die entsprechenden Slots

### Splash Screen konfigurieren

#### Android

```xml
<!-- android/app/src/main/res/drawable/launch_screen.xml -->
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splashscreen_bg"/>
    <item>
        <bitmap android:src="@drawable/splash_logo"
                android:gravity="center"/>
    </item>
</layer-list>
```

#### iOS

- Bearbeite `ios/MeinNeuesProjekt/LaunchScreen.storyboard` in Xcode

## 🧪 Testing Setup

```bash
# Tests ausführen
npm test

# Tests mit Coverage
npm run test:coverage

# Tests im Watch-Modus
npm run test:watch

# E2E Tests (falls konfiguriert)
npm run e2e:ios
npm run e2e:android
```

## 🚀 Build und Deployment

### Development Builds

```bash
# iOS Debug Build
npm run build:ios:debug

# Android Debug Build
npm run build:android:debug
```

### Production Builds

#### iOS

```bash
# Archive für App Store
xcodebuild -workspace ios/MeinNeuesProjekt.xcworkspace \
           -scheme MeinNeuesProjekt \
           -configuration Release \
           -archivePath build/MeinNeuesProjekt.xcarchive \
           archive
```

#### Android

```bash
# Release APK
cd android && ./gradlew assembleRelease

# Release AAB (für Play Store)
cd android && ./gradlew bundleRelease
```

## 🔍 Troubleshooting

### Häufige Probleme

#### Metro Bundler Probleme

```bash
# Cache löschen
npm start -- --reset-cache
npx react-native start --reset-cache
```

#### iOS Build Probleme

```bash
# Pods neu installieren
cd ios && rm -rf Pods Podfile.lock && pod install

# Derived Data löschen
rm -rf ~/Library/Developer/Xcode/DerivedData
```

#### Android Build Probleme

```bash
# Gradle Cache löschen
cd android && ./gradlew clean

# Node modules neu installieren
rm -rf node_modules && npm install
```

### Debugging

#### React Native Debugger

```bash
# Installation
npm install -g react-native-debugger

# Starten
react-native-debugger
```

#### Flipper (Meta's Debugging Platform)

- Installiere Flipper Desktop
- Konfiguriere Plugins für dein Projekt
- Nutze für Network, Layout und Performance Debugging

## 📱 Device Testing

### iOS

```bash
# Verfügbare Simulatoren anzeigen
xcrun simctl list devices

# Spezifischen Simulator starten
npm run ios -- --simulator="iPhone 15 Pro"

# Auf physischem Device
npm run ios -- --device
```

### Android

```bash
# Verfügbare Emulatoren anzeigen
emulator -list-avds

# Emulator starten
emulator -avd Pixel_7_API_34

# Auf physischem Device (USB Debugging aktiviert)
npm run android
```

## 🔐 Code Signing

### iOS

1. Apple Developer Account erforderlich
2. Certificates und Provisioning Profiles in Xcode konfigurieren
3. Team ID in Xcode Project Settings setzen

### Android

1. Keystore für Release Builds erstellen:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore \
           -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Keystore-Konfiguration in `android/gradle.properties`

## 📚 Nächste Schritte

1. **Features entwickeln** - Nutze die Clean Architecture Struktur
2. **Tests schreiben** - Erweitere die Test-Suite
3. **CI/CD Setup** - GitHub Actions, Bitrise oder ähnliches
4. **Monitoring** - Crashlytics, Sentry oder ähnliches
5. **Analytics** - Firebase Analytics oder ähnliches
6. **Performance** - React Native Performance Monitor

## 🆘 Support

Bei Problemen:

1. **React Native Dokumentation** - [reactnative.dev](https://reactnative.dev/)
2. **Community** - [React Native Community Discord](https://discord.gg/react-native)
3. **Stack Overflow** - Tag: `react-native`
4. **GitHub Issues** - Für projektspezifische Probleme

---

**Viel Erfolg mit deinem neuen React Native Projekt! 🎉**
