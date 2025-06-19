# 📱 MOBILE-FIRST PROFILE REFACTORING GUIDE

## 🎯 SCHRITT 1: USE CASE KONSOLIDIERUNG (70+ → 8)

### ❌ AKTUELL: Over-Engineering
```
application/use-cases/
├── account-settings/ (5 Use Cases)
├── avatar/ (8 Use Cases)  
├── completeness/ (6 Use Cases)
├── completion/ (4 Use Cases)
├── custom-fields/ (8 Use Cases)
├── professional/ (12 Use Cases)
├── profile/ (6 Use Cases)
├── profile-screen/ (8 Use Cases)
├── query/ (3 Use Cases)
├── refresh/ (4 Use Cases)
├── security/ (5 Use Cases)
├── skills/ (3 Use Cases)
├── social-links/ (2 Use Cases)
├── ui-management/ (4 Use Cases)
└── validation/ (2 Use Cases)
```

### ✅ MOBILE-FIRST: Fokussierte Use Cases
```
application/use-cases/
├── profile-crud.use-case.ts          // Get, Update, Delete Profile
├── avatar-management.use-case.ts     // Upload, Delete Avatar
├── privacy-settings.use-case.ts      // Privacy & Security
├── profile-validation.use-case.ts    // Form Validation
├── profile-export.use-case.ts        // GDPR Export
├── custom-fields.use-case.ts         // Custom Fields CRUD
├── social-links.use-case.ts          // Social Links Management
└── account-settings.use-case.ts      // Account Settings
```

### 🔧 IMPLEMENTATION:

#### ProfileCrudUseCase (Konsolidiert 15+ Use Cases)
```typescript
export class ProfileCrudUseCase {
  async getProfile(userId: string): Promise<Result<Profile>> {
    // Einfache Profile-Abfrage ohne komplexe Analytics
  }
  
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Result<Profile>> {
    // Direkte Update-Operation ohne komplexe Validierung-Pipelines
  }
  
  async deleteProfile(userId: string, keepAuth: boolean): Promise<Result<void>> {
    // GDPR-konformer Delete mit Audit Log
  }
}
```

## 🎯 SCHRITT 2: REPOSITORY VEREINFACHUNG (15+ → 3)

### ❌ AKTUELL: Repository-Explosion
```
repositories/
├── account-settings-repository.impl.ts
├── account-settings.repository.impl.ts  
├── avatar-repository.impl.ts
├── custom-fields-repository.impl.ts
├── professional-repository.impl.ts
├── profile-completeness-repository.impl.ts
├── profile-completion-repository.impl.ts
├── profile-refresh-repository.impl.ts
├── profile.repository.impl.ts
├── security/security-repository.impl.ts
└── ui-preferences-repository.impl.ts
```

### ✅ MOBILE-FIRST: 3 Core Repositories
```
repositories/
├── profile.repository.ts        // Alle Profile-Daten (User Info, Custom Fields)
├── avatar.repository.ts         // Avatar Upload/Delete/URL
└── settings.repository.ts       // Account Settings + Privacy
```

### 🔧 IMPLEMENTATION:

#### Unified ProfileRepository
```typescript
export class ProfileRepository implements IProfileRepository {
  constructor(
    private datasource: IProfileDataSource,
    private logger: ILogger
  ) {}

  async getProfile(userId: string): Promise<Profile> {
    return this.datasource.getProfile(userId);
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const result = await this.datasource.updateProfile(userId, updates);
    this.logger.info('Profile updated', { userId, fields: Object.keys(updates) });
    return result;
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.datasource.deleteProfile(userId);
    this.logger.info('Profile deleted (GDPR)', { userId });
  }

  // Custom Fields Integration
  async updateCustomFields(userId: string, fields: Record<string, any>): Promise<void> {
    return this.datasource.updateCustomFields(userId, fields);
  }
  
  // Social Links Integration  
  async updateSocialLinks(userId: string, links: SocialLinks): Promise<void> {
    return this.datasource.updateSocialLinks(userId, links);
  }
}
```

## 🎯 SCHRITT 3: HOOK KONSOLIDIERUNG

### ❌ AKTUELL: Hook-Redundanz
```
hooks/
├── use-account-settings.hook.ts
├── use-avatar.hook.ts
├── use-custom-fields-query.hook.ts  
├── use-professional-actions.hook.ts
├── use-professional-benchmark-data.hook.ts
├── use-professional-career-data.hook.ts
├── use-professional-info.hook.ts
├── use-professional-network-data.hook.ts
├── use-profile-completeness.hook.ts
├── use-profile-completion.hook.ts
├── use-profile-deletion.hook.ts
├── use-profile-form.hook.ts
├── use-profile-query.hook.ts
├── use-profile-refresh.hook.ts
├── use-profile-screen.hook.ts
├── use-profile-security.hook.ts
├── use-profile-ui-state.hook.ts
├── use-profile.hook.ts
├── use-skills-management.hook.ts
└── use-social-links-edit.hook.ts
```

### ✅ MOBILE-FIRST: 6 Core Hooks
```
hooks/
├── use-profile.hook.ts              // Main Profile Data + CRUD
├── use-avatar.hook.ts               // Avatar Upload/Management  
├── use-profile-form.hook.ts         // Form State + Validation
├── use-settings.hook.ts             // Account + Privacy Settings
├── use-custom-fields.hook.ts        // Custom Fields Management
└── use-feature-flags.hook.ts        // Feature Toggle Control
```

### 🔧 IMPLEMENTATION:

#### Unified useProfile Hook
```typescript
export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // TanStack Query für Server State
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => profileRepository.getProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 Minuten
  });

  // Mutation für Updates
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) => 
      profileRepository.updateProfile(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  // Einfache API
  return {
    profile,
    isLoading,
    error,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    
    // Convenience Methods für UI
    updateBasicInfo: (info: BasicInfo) => updateMutation.mutateAsync(info),
    updateSocialLinks: (links: SocialLinks) => updateMutation.mutateAsync({ socialLinks: links }),
    updateCustomFields: (fields: CustomFields) => updateMutation.mutateAsync({ customFields: fields }),
  };
};
```

## 🎯 SCHRITT 4: ENTITY VEREINFACHUNG

### ❌ AKTUELL: Over-Complex Entities
```typescript
// 15+ verschiedene Entities mit hunderten Properties
export class ProfessionalProfile {
  skillsAnalysis: SkillsAnalysis;
  careerProgression: CareerProgression;
  industryBenchmark: IndustryBenchmark;
  professionalNetwork: ProfessionalNetwork;
  // ... 50+ weitere Properties
}

export class SkillsAnalysis {
  portfolio: SkillPortfolio;
  marketInsights: MarketInsights;
  learningPlan: LearningPlan;
  performanceMetrics: PerformanceMetrics;
  // ... 30+ weitere Properties  
}
```

### ✅ MOBILE-FIRST: Simple Domain Models
```typescript
// 3 Fokussierte Entities
export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  socialLinks?: SocialLinks;
  customFields?: Record<string, any>;
  privacy: PrivacySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  emailVisible: boolean;
  phoneVisible: boolean;
  locationVisible: boolean;
}
```

## 🎯 SCHRITT 5: COMPONENT VEREINFACHUNG

### ❌ AKTUELL: Over-Engineered Components
```typescript
// Komplexe Enterprise Components mit Business Logic
export const ProfessionalInfoCard = () => {
  const { 
    professionalData,
    skillsAnalysis, 
    marketInsights,
    performanceMetrics,
    careerProgression 
  } = useProfessionalData();
  
  // 200+ Zeilen komplexe Rendering Logic
  return (
    <ComplexProfessionalAnalysisView>
      <SkillsAnalysisSection />
      <MarketInsightsSection />  
      <CareerProgressionSection />
      <BenchmarkingSection />
      <LearningPlanSection />
    </ComplexProfessionalAnalysisView>
  );
};
```

### ✅ MOBILE-FIRST: Simple UI Components
```typescript
// Einfache, fokussierte UI Components
export const ProfileCard = () => {
  const { profile } = useProfile();
  
  if (!profile) return <ProfileSkeleton />;
  
  return (
    <Card>
      <Avatar source={{ uri: profile.avatar }} />
      <Text variant="title">{profile.firstName} {profile.lastName}</Text>
      <Text variant="body">{profile.bio}</Text>
      
      {profile.location && (
        <Text variant="caption">📍 {profile.location}</Text>
      )}
      
      <ProfileActions profile={profile} />
    </Card>
  );
};

export const ProfileActions = ({ profile }: { profile: Profile }) => {
  const navigation = useNavigation();
  
  return (
    <ButtonGroup>
      <Button onPress={() => navigation.navigate('ProfileEdit')}>
        Edit Profile
      </Button>
      <Button onPress={() => navigation.navigate('PrivacySettings')}>
        Privacy
      </Button>
    </ButtonGroup>
  );
};
```

## 🎯 SCHRITT 6: FEATURE FLAG INTEGRATION

### Mobile-First Feature Flag Patterns
```typescript
export const ProfileScreen = () => {
  const { isScreenEnabled } = useFeatureFlag();
  
  return (
    <ScrollView>
      <ProfileCard />
      
      {isScreenEnabled('CustomFieldsEdit') && <CustomFieldsSection />}
      {isScreenEnabled('SocialLinksEdit') && <SocialLinksSection />}
      {isScreenEnabled('PrivacySettings') && <PrivacyQuickActions />}
      
      <ProfileActions />
    </ScrollView>
  );
};
```

## 📊 ERGEBNISSE NACH REFACTORING

### Code-Reduktion:
- **Use Cases**: 70+ → 8 (89% Reduktion)
- **Repositories**: 15+ → 3 (80% Reduktion)  
- **Hooks**: 20+ → 6 (70% Reduktion)
- **Entities**: 15+ → 3 (80% Reduktion)
- **Gesamtcode**: ~15.000 → ~3.000 Zeilen (80% Reduktion)

### Wartbarkeit:
- ✅ Einfachere Debugging
- ✅ Schnellere Feature-Entwicklung
- ✅ Weniger Testing-Overhead
- ✅ Mobile-optimierte Performance
- ✅ Bessere Developer Experience

### Beibehaltene Enterprise Features:
- ✅ Clean Architecture (vereinfacht)
- ✅ Feature Flags (fokussiert)
- ✅ GDPR Compliance
- ✅ Repository Pattern (konsolidiert)
- ✅ Hook-Centric Design
- ✅ TanStack Query Integration