# 🔧 Optionale Features

Features, die du bei Bedarf zu deinem Template-Projekt hinzufügen kannst.

## 📚 Storybook für React Native

**Zweck:** Isolierte Komponenten-Entwicklung und -Dokumentation

### Installation

```bash
# Storybook Dependencies installieren
npm install --save-dev @storybook/react-native @storybook/addon-actions @storybook/addon-controls @storybook/addon-viewport

# Storybook initialisieren
npx storybook@latest init --type react_native
```

### Konfiguration

```javascript
// .storybook/main.js
module.exports = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/features/**/__stories__/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/react-native',
    options: {
      loadCss: true,
    },
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
};
```

### Beispiel Story

```typescript
// src/shared/components/Button/Button.stories.tsx
import type {Meta, StoryObj} from '@storybook/react-native';
import {Button} from './Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: {type: 'select'},
      options: ['primary', 'secondary', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    title: 'Secondary Button',
    variant: 'secondary',
  },
};
```

### Scripts hinzufügen

```json
// package.json
{
  "scripts": {
    "storybook": "storybook dev",
    "storybook:build": "storybook build"
  }
}
```

---

## 🧪 Detox E2E Testing

**Zweck:** End-to-End Tests für iOS und Android

### Installation

```bash
npm install --save-dev detox jest-circus
```

### Konfiguration

```json
// .detoxrc.js
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupFilesAfterEnv: ['<rootDir>/e2e/init.js']
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/YourApp.app',
      build: 'xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_30_x86'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    }
  }
};
```

---

## 📊 Analytics Integration

### Firebase Analytics

```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

### Mixpanel

```bash
npm install mixpanel-react-native
```

### Amplitude

```bash
npm install @amplitude/analytics-react-native
```

---

## 🔔 Push Notifications

### Firebase Cloud Messaging

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### OneSignal

```bash
npm install react-native-onesignal
```

---

## 🗺️ Maps Integration

### React Native Maps

```bash
npm install react-native-maps
```

### Google Places

```bash
npm install react-native-google-places-autocomplete
```

---

## 💳 In-App Purchases

### React Native IAP

```bash
npm install react-native-iap
```

---

## 🔐 Biometric Authentication

### React Native Biometrics

```bash
npm install react-native-biometrics
```

---

## 📱 Device Features

### Camera

```bash
npm install react-native-image-picker
```

### Contacts

```bash
npm install react-native-contacts
```

### Geolocation

```bash
npm install @react-native-community/geolocation
```

---

## 🎨 UI Libraries (Alternativen)

### NativeBase

```bash
npm install native-base react-native-svg react-native-safe-area-context
```

### Tamagui

```bash
npm install @tamagui/core @tamagui/config @tamagui/animations-react-native
```

### UI Kitten

```bash
npm install @ui-kitten/components react-native-eva-icons react-native-svg
```

---

## 📚 Weitere Ressourcen

- [Storybook React Native Docs](https://storybook.js.org/docs/react-native/get-started/introduction)
- [Detox Documentation](https://wix.github.io/Detox/)
- [React Native Directory](https://reactnative.directory/)
- [Awesome React Native](https://github.com/jondot/awesome-react-native)

---

**Wähle nur die Features aus, die du wirklich brauchst!** 🎯
