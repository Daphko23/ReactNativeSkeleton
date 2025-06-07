# Avatar Upload Feature - Enterprise Documentation

## 🎯 Overview

Die Avatar Upload Funktionalität ist eine vollständige Enterprise-Lösung für Benutzer-Avatar-Management mit Clean Architecture, umfassender Sicherheit und nahtloser Supabase Storage Integration.

## 🏗️ Architecture

### Backend Infrastructure (Supabase)

**Storage Buckets:**
- `avatars` - Hauptspeicher für Original-Avatare (5MB Limit)
- `avatars-thumbnails` - Thumbnail-Speicher (1MB Limit)

**Database Functions:**
- `get_avatar_url(user_uuid)` - Avatar URL mit Fallback abrufen
- `update_avatar_url(user_uuid, new_avatar_url)` - Avatar URL in Profil aktualisieren
- `delete_avatar(user_uuid)` - Avatar löschen und bereinigen
- `validate_avatar_file(file_name, file_size, mime_type)` - Datei-Validierung
- `generate_avatar_path(user_uuid, file_extension)` - Eindeutigen Dateipfad generieren

**Edge Function:**
- `avatar-upload` - Vollständiger Upload-Handler mit Validierung und Verarbeitung

**Security Features:**
- Row Level Security (RLS) auf Storage
- Permissions-basierte Zugriffskontrolle
- Automatische Audit-Logs
- RBAC-Integration

### Frontend Architecture (React Native)

```
src/features/profile/
├── data/
│   └── services/
│       └── AvatarService.ts          # Service-Layer für Avatar-Operations
├── presentation/
│   ├── hooks/
│   │   └── useAvatar.ts              # React Hook für Avatar-Management
│   └── components/
│       └── AvatarUploader.tsx        # UI-Komponente für Upload
```

## 🚀 Quick Start

### 1. Basic Avatar Display

```tsx
import { AvatarUploader } from '@/features/profile';

function ProfileScreen() {
  const { user } = useAuth();
  
  return (
    <AvatarUploader
      userId={user.id}
      userName={user.displayName}
      size={120}
      editable={true}
    />
  );
}
```

### 2. Custom Avatar Upload Handler

```tsx
import { useAvatar } from '@/features/profile';

function CustomAvatarScreen() {
  const { 
    avatarUrl, 
    isUploading, 
    uploadProgress,
    uploadAvatar,
    error 
  } = useAvatar({
    userId: user.id,
    onUploadSuccess: (result) => {
      console.log('Upload successful:', result.avatar_url);
    },
    onUploadError: (error) => {
      console.error('Upload failed:', error);
    }
  });

  const handleFileUpload = async (file) => {
    const result = await uploadAvatar({
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        uri: file.uri,
      }
    });
    
    if (result.success) {
      // Handle success
    }
  };

  return (
    <View>
      {avatarUrl && (
        <Image source={{ uri: avatarUrl }} style={{ width: 100, height: 100 }} />
      )}
      {isUploading && (
        <Text>Uploading: {uploadProgress}%</Text>
      )}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}
```

## 🔧 Configuration

### Avatar Service Configuration

```typescript
import { AvatarService } from '@/features/profile';

// Konfiguration über Environment Variables
const config = {
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  SUPABASE_URL: 'https://ubolrasyvzrurjsafzay.supabase.co',
  AVATAR_FUNCTION_URL: 'https://ubolrasyvzrurjsafzay.supabase.co/functions/v1/avatar-upload'
};
```

### Profile Feature Configuration

```typescript
import { ProfileFeatureConfig } from '@/features/profile';

const avatarConfig: ProfileFeatureConfig = {
  ui: {
    avatarSize: 120,
    showUploadProgress: true,
  },
  avatar: {
    maxFileSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    enableThumbnails: true,
    compressionQuality: 0.8,
    enableInitialsFallback: true,
  },
  integrations: {
    storage: {
      enabled: true,
      provider: 'supabase',
      bucket: 'avatars',
    },
  },
};
```

## 🔒 Security & Permissions

### Required Permissions

- `AVATAR_UPLOAD` - Avatar hochladen
- `AVATAR_DELETE` - Eigenen Avatar löschen
- `PROFILE_UPDATE_ALL` - Fremde Avatare verwalten (Admin)

### RLS Policies

```sql
-- Users can upload their own avatars
CREATE POLICY "avatar_upload_own" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Public read access for all avatars
CREATE POLICY "avatar_read_public" ON storage.objects
    FOR SELECT TO anon, authenticated USING (bucket_id = 'avatars');
```

## 📱 Platform Integration

### React Native Dependencies

```bash
# Für Bildauswahl und Kamera
npm install react-native-image-picker

# Für Dateisystem-Operationen
npm install react-native-blob-util

# Für Permissions
npm install react-native-permissions
```

### iOS Setup (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take profile pictures</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to choose profile pictures</string>
```

### Android Setup (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## 🎨 UI Components

### AvatarUploader Props

```typescript
interface AvatarUploaderProps {
  userId?: string;              // Target user ID
  size?: number;               // Avatar size in pixels (default: 100)
  userName?: string;           // For initials fallback
  editable?: boolean;          // Enable upload functionality
  showUploadProgress?: boolean; // Show progress indicator
  onUploadSuccess?: () => void; // Success callback
  onUploadError?: (error: string) => void; // Error callback
  style?: any;                 // Custom styles
}
```

### Styling Customization

```typescript
const customStyles = StyleSheet.create({
  avatar: {
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  editIndicator: {
    backgroundColor: '#ff6b6b',
  },
  actionSheet: {
    backgroundColor: '#f8f9fa',
  },
});

<AvatarUploader
  style={customStyles.avatar}
  // ... other props
/>
```

## 🔄 Data Flow

### Upload Process

```
1. User selects image (Gallery/Camera)
   ↓
2. File validation (size, type, extension)
   ↓
3. Convert to base64 for transport
   ↓
4. Upload via Edge Function with auth
   ↓
5. Store in Supabase Storage
   ↓
6. Update user_profiles.avatar_url
   ↓
7. Create audit log entry
   ↓
8. Return success with public URL
```

### Error Handling

```typescript
// Service-Level Errors
try {
  const result = await AvatarService.uploadAvatar(options);
  if (!result.success) {
    console.error('Upload failed:', result.error);
    console.error('Validation errors:', result.errors);
  }
} catch (error) {
  console.error('Network error:', error.message);
}

// Hook-Level Errors
const { error } = useAvatar({
  onUploadError: (errorMessage) => {
    Alert.alert('Upload Failed', errorMessage);
  }
});
```

## 🧪 Testing

### Unit Tests

```typescript
// AvatarService Tests
describe('AvatarService', () => {
  it('should validate file size correctly', () => {
    const file = { name: 'test.jpg', size: 6 * 1024 * 1024, type: 'image/jpeg' };
    const result = AvatarService.validateAvatarFile(file);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('File size exceeds 5MB limit');
  });

  it('should validate file type correctly', () => {
    const file = { name: 'test.pdf', size: 1024, type: 'application/pdf' };
    const result = AvatarService.validateAvatarFile(file);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid file type');
  });
});
```

### Integration Tests

```typescript
// Avatar Upload Integration
describe('Avatar Upload Flow', () => {
  it('should upload avatar successfully', async () => {
    const mockFile = {
      name: 'avatar.jpg',
      size: 1024 * 1024, // 1MB
      type: 'image/jpeg',
      uri: 'file://path/to/avatar.jpg'
    };

    const result = await AvatarService.uploadAvatar({
      file: mockFile,
      userId: 'test-user-id'
    });

    expect(result.success).toBe(true);
    expect(result.avatar_url).toBeDefined();
  });
});
```

## 🚀 Production Deployment

### Environment Variables

```env
# Supabase Configuration
SUPABASE_URL=https://ubolrasyvzrurjsafzay.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Storage Configuration
AVATAR_BUCKET=avatars
THUMBNAIL_BUCKET=avatars-thumbnails
MAX_AVATAR_SIZE=5242880

# Edge Function URL
AVATAR_UPLOAD_FUNCTION=https://ubolrasyvzrurjsafzay.supabase.co/functions/v1/avatar-upload
```

### Performance Optimization

```typescript
// Image Compression vor Upload
const compressImage = async (uri: string): Promise<string> => {
  // Implementierung der Bildkomprimierung
  // z.B. mit react-native-image-resizer
};

// Lazy Loading für Avatar-Listen
const AvatarList = () => {
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <AvatarUploader
          userId={item.id}
          size={50}
          editable={false}
        />
      )}
      getItemLayout={(data, index) => ({
        length: 60,
        offset: 60 * index,
        index,
      })}
    />
  );
};
```

## 🔧 Troubleshooting

### Common Issues

**1. Upload fails with "Authentication required"**
```typescript
// Check if user is logged in
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  // Redirect to login
}
```

**2. File too large error**
```typescript
// Validate before upload
const validation = AvatarService.validateAvatarFile(file);
if (!validation.valid) {
  Alert.alert('Invalid File', validation.errors.join('\n'));
  return;
}
```

**3. Storage permissions error**
```typescript
// Check RLS policies in Supabase dashboard
// Ensure user has correct permissions
const hasPermission = await supabase.rpc('user_has_permission', {
  user_uuid: userId,
  permission_name: 'AVATAR_UPLOAD'
});
```

## 🔮 Future Enhancements

### Geplante Features

- **Image Processing**: Automatische Thumbnail-Generierung
- **Multiple Formats**: WebP-Konvertierung für bessere Performance
- **CDN Integration**: CloudFront/CloudFlare für globale Verfügbarkeit
- **AI Features**: Automatisches Cropping, Hintergrund-Entfernung
- **Social Integration**: Avatar-Import von Social Media
- **Accessibility**: Screen Reader Support, High Contrast Mode

### Migration Path

```typescript
// Version 1.2.0 - Thumbnail Support
interface AvatarUploadResult {
  success: boolean;
  avatar_url?: string;
  thumbnail_url?: string;    // New
  optimized_url?: string;    // New
  metadata?: {               // New
    width: number;
    height: number;
    format: string;
    size: number;
  };
}
```

## 📊 Analytics & Monitoring

```typescript
// Usage Analytics
const trackAvatarUpload = (userId: string, success: boolean, fileSize: number) => {
  analytics.track('avatar_upload', {
    user_id: userId,
    success,
    file_size: fileSize,
    timestamp: Date.now(),
  });
};

// Performance Monitoring
const uploadTimer = performance.now();
// ... upload process
const uploadDuration = performance.now() - uploadTimer;
console.log(`Avatar upload took ${uploadDuration}ms`);
```

---

**📧 Support**: Bei Fragen oder Problemen erstellen Sie ein Issue im Repository oder kontaktieren Sie das Development Team. 