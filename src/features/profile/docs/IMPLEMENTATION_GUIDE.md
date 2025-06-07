# Avatar Upload Implementation Guide

## 🎯 Implementierungsstatus

### ✅ Abgeschlossen
- **Backend Infrastructure** - Supabase Database, Storage, Edge Functions
- **AvatarService** - Enterprise Service Layer mit Supabase Integration
- **useAvatar Hook** - React Hook mit Image Picker Integration
- **AvatarUploader Component** - Touch-optimierte UI-Komponente
- **ProfileAvatarDemoScreen** - Demo-Implementation
- **Documentation** - Umfassende Dokumentation
- **Environment Configuration** - Avatar-spezifische Environment-Variablen

### 🔄 Nächste Schritte

## 1. Environment Setup

**Erstelle eine `.env` Datei im Projektroot:**

```bash
# Kopiere von env.example
cp env.example .env
```

**Setze die Supabase-Werte:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://ubolrasyvzrurjsafzay.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```

## 2. Berechtigungen für iOS/Android konfigurieren

### iOS - Info.plist
```xml
<key>NSCameraUsageDescription</key>
<string>Diese App benötigt Kamerazugriff für Profilbilder</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Diese App benötigt Zugriff auf die Fotobibliothek für Profilbilder</string>
```

### Android - AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 3. Demo-Screen testen

**In einer bestehenden Navigation hinzufügen:**

```typescript
import { ProfileAvatarDemoScreen } from '@/features/profile';

// In your navigator:
<Stack.Screen 
  name="AvatarDemo" 
  component={ProfileAvatarDemoScreen}
  options={{ title: 'Avatar Upload Demo' }}
/>
```

**Oder als standalone testen:**

```typescript
import React from 'react';
import { ProfileAvatarDemoScreen } from '@/features/profile';

export default function App() {
  return <ProfileAvatarDemoScreen />;
}
```

## 4. Echte User-Integration

**Mit Auth Context integrieren:**

```typescript
import { useAuth } from '@/features/auth';
import { AvatarUploader } from '@/features/profile';

function ProfileScreen() {
  const { user } = useAuth();
  
  return (
    <AvatarUploader
      userId={user?.id}
      userName={user?.displayName}
      size={120}
      editable={true}
    />
  );
}
```

## 5. Testing

**Unit Tests ausführen:**
```bash
npm run test -- src/features/profile
```

**Avatar-Service spezifisch:**
```bash
npm run test -- src/features/profile/data/services/AvatarService.test.ts
```

## 6. Produktions-Deployment

### Supabase Edge Function deployen
```bash
# Im supabase Verzeichnis
supabase functions deploy avatar-upload --project-ref ubolrasyvzrurjsafzay
```

### Storage Policies prüfen
```sql
-- In Supabase SQL Editor
SELECT * FROM storage.policies WHERE bucket_id = 'avatars';
```

### Default Avatar hochladen
```bash
# Default Avatar in Storage hochladen
supabase storage upload avatars/default-avatar.png ./assets/default-avatar.png
```

## 7. Monitoring & Analytics

**Fehler-Tracking hinzufügen:**
```typescript
import { crashlytics } from '@react-native-firebase/crashlytics';

// In AvatarService
catch (error) {
  crashlytics().recordError(error);
  return { success: false, error: error.message };
}
```

**Usage Analytics:**
```typescript
import analytics from '@react-native-firebase/analytics';

// In useAvatar hook
onUploadSuccess: (result) => {
  analytics().logEvent('avatar_upload_success', {
    user_id: userId,
    file_size: result.file_size,
  });
}
```

## 8. Performance Optimierung

**Image Compression konfigurieren:**
```typescript
// In useAvatar.ts - ImagePicker Optionen
const options = {
  compressImageQuality: 0.7,
  compressImageMaxWidth: 800,
  compressImageMaxHeight: 800,
  mediaType: 'photo',
};
```

**Caching implementieren:**
```typescript
// In AvatarService
private static cache = new Map<string, string>();

static async getAvatarUrl(userId: string): Promise<string> {
  if (this.cache.has(userId)) {
    return this.cache.get(userId)!;
  }
  // ... fetch logic
}
```

## 9. Troubleshooting

### Häufige Probleme

**1. "Authentication required" Fehler:**
```typescript
// Prüfe Supabase Session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

**2. Image Picker funktioniert nicht:**
```bash
# iOS Pods neu installieren
cd ios && pod install && cd ..

# Android - Metro Cache leeren
npx react-native start --reset-cache
```

**3. Edge Function nicht erreichbar:**
```bash
# Prüfe Function URL
curl -X POST https://ubolrasyvzrurjsafzay.supabase.co/functions/v1/avatar-upload \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json"
```

## 10. Erweiterte Features

### Thumbnail-Generierung
```typescript
// In Edge Function erweitern
const thumbnail = await sharp(buffer)
  .resize(150, 150)
  .jpeg({ quality: 80 })
  .toBuffer();
```

### Multiple Avatar-Formate
```typescript
// WebP Support hinzufügen
const webpBuffer = await sharp(buffer)
  .webp({ quality: 80 })
  .toBuffer();
```

### Real-time Avatar Updates
```typescript
// Supabase Real-time für Avatar-Updates
useEffect(() => {
  const subscription = supabase
    .channel('avatar-updates')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'user_profiles',
      filter: `id=eq.${userId}`,
    }, (payload) => {
      setAvatarUrl(payload.new.avatar_url);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, [userId]);
```

## 📞 Support

Bei Problemen oder Fragen:
1. Prüfe die [AVATAR_UPLOAD.md](./AVATAR_UPLOAD.md) Dokumentation
2. Überprüfe die Supabase Dashboard Logs
3. Teste mit der Demo-Screen
4. Erstelle ein Issue im Repository

## 🚀 Quick Start

```bash
# 1. Environment Setup
cp env.example .env
# .env editieren mit echten Werten

# 2. Dependencies prüfen
npm install

# 3. Demo testen
# ProfileAvatarDemoScreen in Navigation einbinden

# 4. Produktiv verwenden
# AvatarUploader Component mit echten User-Daten verwenden
``` 