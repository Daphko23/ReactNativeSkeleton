# 🔔 Firebase FCM Push Notifications Setup

## Übersicht

Dieses Projekt verwendet **Firebase Cloud Messaging (FCM)** für Push Notifications anstelle von OneSignal. FCM ist Googles kostenlose Push-Notification-Lösung.

## 🎯 Warum Firebase FCM statt OneSignal?

✅ **Kostenfrei** - Keine Limits bei Firebase  
✅ **Native Integration** - Besser in Google-Ökosystem integriert  
✅ **Vollständige Kontrolle** - Eigene Backend-Integration  
✅ **Erweiterte Features** - Topic subscriptions, A/B Testing  
✅ **Analytics** - Integriert mit Firebase Analytics  

## 📋 Setup-Schritte

### 1. Firebase Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Erstelle ein neues Projekt
3. Aktiviere **Cloud Messaging**

### 2. iOS Setup

1. **APNs Certificate hochladen:**
   - Erstelle ein APNs Key in Apple Developer Portal
   - Lade den Key in Firebase Console hoch

2. **GoogleService-Info.plist hinzufügen:**
   ```bash
   # Lade die Datei herunter und füge sie hinzu:
   ios/GoogleService-Info.plist
   ```

3. **Capabilities aktivieren:**
   - Push Notifications
   - Background Modes > Remote notifications

### 3. Android Setup

1. **google-services.json hinzufügen:**
   ```bash
   # Lade die Datei herunter und füge sie hinzu:
   android/app/google-services.json
   ```

2. **Already configured** ✅ - Das Projekt ist bereits konfiguriert!

## 🚀 Verwendung

### Basic Setup in App

```typescript
import { useNotifications } from './features/notifications/presentation/hooks/useNotifications';

function App() {
  const { initializeNotifications, hasPermission, fcmToken } = useNotifications();

  useEffect(() => {
    initializeNotifications();
  }, []);

  // fcmToken ist jetzt verfügbar für Backend-Registration
}
```

### FCM Token abrufen

```typescript
const { fcmToken } = useNotifications();

// Token an Backend senden
if (fcmToken) {
  await sendTokenToBackend(fcmToken);
}
```

### Topic Subscriptions

```typescript
const { subscribeToTopic, unsubscribeFromTopic } = useNotifications();

// Benutzer-spezifische Topics
await subscribeToTopic(`user-${userId}`);
await subscribeToTopic('general-updates');

// Von Topics abmelden
await unsubscribeFromTopic('general-updates');
```

## 📡 Backend Integration

### Node.js/Express Beispiel

```typescript
import admin from 'firebase-admin';

// FCM Message senden
const message = {
  notification: {
    title: 'Neue Nachricht',
    body: 'Du hast eine neue Nachricht erhalten'
  },
  data: {
    screen: 'Messages',
    messageId: '123'
  },
  token: fcmToken // oder topic: 'general-updates'
};

await admin.messaging().send(message);
```

### Topic Message senden

```typescript
const message = {
  notification: {
    title: 'System Update',
    body: 'Neue Features verfügbar!'
  },
  topic: 'general-updates'
};

await admin.messaging().send(message);
```

## 🔧 Architektur

```
src/features/notifications/
├── data/
│   ├── interfaces/
│   │   └── notification.service.ts      # Interface
│   └── services/
│       └── firebase-push.service.impl.ts # FCM Implementation
├── domain/
│   ├── entities/
│   │   └── notification.entity.ts       # Notification Models
│   └── usecases/
│       └── notification.usecase.ts      # Business Logic
├── presentation/
│   └── hooks/
│       └── useNotifications.ts          # React Hook
└── di/
    └── notification.container.ts        # Dependency Injection
```

## 🧪 Testing

### FCM Token testen

```bash
# Console ausgabe prüfen
# FCM Token sollte angezeigt werden
npx react-native run-ios
# oder
npx react-native run-android
```

### Test Notification senden

1. Gehe zu Firebase Console > Cloud Messaging
2. Klicke "Send your first message"
3. Verwende den FCM Token aus der App

## 🔒 Security

### Token Security
- FCM Tokens sind **sicher** - sie können public verwendet werden
- Tokens können ablaufen und werden automatisch erneuert
- Keine API Keys in der App notwendig

### Server-Side Validation
```typescript
// Validiere Tokens serverseitig
const messaging = admin.messaging();
try {
  await messaging.send({ token: fcmToken, data: {} });
  // Token ist valid
} catch (error) {
  // Token ungültig oder abgelaufen
}
```

## 📊 Analytics & Monitoring

### Firebase Analytics Integration
```typescript
// Notification events tracken
import analytics from '@react-native-firebase/analytics';

// Notification erhalten
await analytics().logEvent('notification_received', {
  type: 'push',
  category: 'marketing'
});

// Notification geklickt
await analytics().logEvent('notification_opened', {
  screen: 'home'
});
```

## 🚨 Troubleshooting

### iOS Issues
- **APNs Zertifikat abgelaufen:** Erneuere das Zertifikat in Firebase
- **No permission:** Prüfe `Info.plist` Konfiguration

### Android Issues
- **google-services.json fehlt:** Stelle sicher dass die Datei existiert
- **Build Fehler:** Prüfe `google-services` Plugin in `build.gradle`

### General Issues
- **Keine Token:** Prüfe Internetverbindung und Firebase Konfiguration
- **Messages kommen nicht an:** Validiere Token und Backend-Setup

## 📚 Weiterführende Links

- [Firebase FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase](https://rnfirebase.io/)
- [FCM API Reference](https://firebase.google.com/docs/reference/fcm/rest) 