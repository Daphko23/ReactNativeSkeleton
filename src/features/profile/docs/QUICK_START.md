# Avatar Upload - Quick Start Guide

## 🚀 Schnellstart in 5 Minuten

### 1. Environment Setup
```bash
# .env Datei erstellen (aus env.example)
cp env.example .env

# Supabase Credentials hinzufügen
EXPO_PUBLIC_SUPABASE_URL=https://ubolrasyvzrurjsafzay.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
```

### 2. Demo sofort testen
```typescript
import React from 'react';
import { AvatarDemoApp } from '@/features/profile';

export default function App() {
  return <AvatarDemoApp />;
}
```

### 3. In bestehende App integrieren
```typescript
import { AvatarUploader } from '@/features/profile';

function UserProfile() {
  return (
    <AvatarUploader
      userId="user-123"
      userName="Max Mustermann"
      size={120}
      editable={true}
      showUploadProgress={true}
    />
  );
}
```

### 4. Hook für erweiterte Kontrolle
```typescript
import { useAvatar } from '@/features/profile';

function ProfileScreen() {
  const {
    avatarUrl,
    isUploading,
    uploadProgress,
    selectFromGallery,
    selectFromCamera,
  } = useAvatar({
    userId: 'user-123',
    onUploadSuccess: (result) => {
      console.log('Avatar uploaded:', result.avatar_url);
    },
  });

  return (
    <View>
      {/* Custom UI using hook data */}
    </View>
  );
}
```

## ⚡ Features

### ✅ Sofort verfügbar
- **Galerie & Kamera** - Native Image Picker Integration
- **Automatisches Cropping** - Runde Avatare mit Crop-Editor
- **Progress Tracking** - Upload-Fortschritt in Echtzeit
- **Fallback-Avatare** - Initialen-Generator als Fallback
- **Validation** - Dateigrößen- und Formatvalidierung
- **Caching** - Automatisches Bild-Caching

### 🔒 Enterprise Security
- **JWT Authentication** - Supabase Auth Integration
- **Row Level Security** - Database-Policy-Protection
- **RBAC Integration** - Rollenbasierte Zugriffskontrolle
- **Audit Logging** - Vollständige Nachverfolgung
- **File Validation** - Server-seitige Sicherheitsprüfung

### 🏗️ Clean Architecture
- **Service Layer** - Enterprise Service Pattern
- **React Hooks** - Moderne State Management
- **TypeScript** - Vollständige Typsicherheit
- **Testing** - Umfassende Unit & Integration Tests
- **Documentation** - Vollständige API-Dokumentation

## 📱 Unterstützte Plattformen

- **iOS** - Native Camera & Gallery
- **Android** - Native Camera & Gallery  
- **Web** - File Upload Dialog

## 🎯 Sofort loslegen

1. **Demo anschauen**: `<AvatarDemoApp />`
2. **Component verwenden**: `<AvatarUploader />`
3. **Hook nutzen**: `useAvatar()`
4. **Service direkt**: `AvatarService`

## 📚 Weitere Dokumentation

- [Complete Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [Full API Documentation](./AVATAR_UPLOAD.md)
- [Architecture Overview](../../../docs/ARCHITECTURE.md) 