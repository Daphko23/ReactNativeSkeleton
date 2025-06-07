/**
 * Demo Data for ReactNative Skeleton App
 * Provides realistic sample data for demonstrations and development
 */

import { UserProfile } from '@features/profile/domain/entities/user-profile.entity';
import type { PushNotificationMessage } from '@features/notifications/domain/entities/notification.entity';

// =============================================
// DEMO USER PROFILES
// =============================================

export const demoProfiles: UserProfile[] = [
  {
    id: 'demo-user-1',
    firstName: 'Max',
    lastName: 'Mustermann',
    displayName: 'Max M.',
    email: 'max.mustermann@example.com',
    phone: '+49 30 12345678',
    dateOfBirth: new Date('1985-06-15'),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Leidenschaftlicher Software-Entwickler mit Fokus auf React Native und Clean Architecture. Liebe es, benutzerfreundliche Apps zu erstellen.',
    location: 'Berlin, Deutschland',
    website: 'https://maxmustermann.dev',
    timeZone: 'Europe/Berlin',
    language: 'de',
    currency: 'EUR',
    theme: 'system',
    socialLinks: {
      linkedIn: 'https://linkedin.com/in/maxmustermann',
      twitter: 'https://twitter.com/maxmustermann',
      github: 'https://github.com/maxmustermann',
      instagram: 'https://instagram.com/maxmustermann',
    },
    professional: {
      company: 'TechCorp GmbH',
      jobTitle: 'Senior React Native Developer',
      industry: 'Information Technology',
      skills: ['React Native', 'TypeScript', 'Clean Architecture', 'Supabase', 'CI/CD'],
      workLocation: 'hybrid',
      experience: 'senior',
      availableForWork: false,
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      security: true,
      mentions: true,
      comments: true,
    },
    privacySettings: {
      profileVisibility: 'public',
      emailVisibility: 'private',
      phoneVisibility: 'private',
      locationVisibility: 'public',
      socialLinksVisibility: 'public',
      professionalInfoVisibility: 'public',
      showOnlineStatus: true,
      allowDirectMessages: true,
      allowFriendRequests: true,
      emailNotifications: true,
      pushNotifications: true,
      marketingCommunications: false,
    },
    customFields: {
      favoriteLanguage: 'TypeScript',
      experienceLevel: 'senior',
      interests: ['Clean Code', 'Architecture', 'Performance'],
      source: 'demo',
      lastLoginDevice: 'iPhone 14 Pro',
      referralCode: 'MAX2024',
    },
    profileVersion: 1,
    isComplete: true,
    isVerified: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
    lastActiveAt: new Date(),
  },
  {
    id: 'demo-user-2',
    firstName: 'Anna',
    lastName: 'Schmidt',
    displayName: 'Anna S.',
    email: 'anna.schmidt@example.com',
    phone: '+49 89 98765432',
    dateOfBirth: new Date('1992-03-22'),
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    bio: 'UX/UI Designerin mit Leidenschaft für benutzerorientierte Lösungen. Spezialisiert auf Mobile Design und Design Systems.',
    location: 'München, Deutschland',
    website: 'https://annadesigns.portfolio',
    timeZone: 'Europe/Berlin',
    language: 'de',
    currency: 'EUR',
    theme: 'light',
    socialLinks: {
      linkedIn: 'https://linkedin.com/in/annaSchmidt',
      custom: {
        behance: 'https://behance.net/annaSchmidt',
        dribbble: 'https://dribbble.com/annaSchmidt',
      }
    },
    professional: {
      company: 'Design Studio München',
      jobTitle: 'Senior UX/UI Designer',
      industry: 'Design & Media',
      skills: ['UX Design', 'UI Design', 'Figma', 'Design Systems', 'User Research'],
      workLocation: 'onsite',
      experience: 'senior',
      availableForWork: false,
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      security: true,
      mentions: false,
      comments: false,
    },
    privacySettings: {
      profileVisibility: 'public',
      emailVisibility: 'friends',
      phoneVisibility: 'private',
      locationVisibility: 'public',
      socialLinksVisibility: 'public',
      professionalInfoVisibility: 'public',
      showOnlineStatus: false,
      allowDirectMessages: false,
      allowFriendRequests: true,
      emailNotifications: true,
      pushNotifications: true,
      marketingCommunications: false,
    },
    customFields: {
      designTools: ['Figma', 'Adobe Creative Suite', 'Sketch'],
      portfolio: 'https://annadesigns.portfolio',
      source: 'demo',
      lastLoginDevice: 'MacBook Pro',
    },
    profileVersion: 1,
    isComplete: false,
    isVerified: true,
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date(),
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
];

// =============================================
// DEMO NOTIFICATIONS
// =============================================

export const demoNotifications: PushNotificationMessage[] = [
  {
    id: 'notif-1',
    title: '🔐 Sicherheitswarnung',
    body: 'Neuer Login von unbekanntem Gerät (iPhone, Berlin)',
    priority: 'high',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    isRead: false,
    category: 'security',
    data: {
      screen: 'SecuritySettings',
      action: 'review_login',
      deviceInfo: 'iPhone 14 Pro, Berlin',
    },
  },
  {
    id: 'notif-2',
    title: '✨ Neue Features verfügbar',
    body: 'Entdecke die neuen Profile-Funktionen und verbessertes Caching!',
    priority: 'normal',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    category: 'updates',
    data: {
      screen: 'ProfileEdit',
      features: ['enhanced-caching', 'validation-improvements'],
    },
  },
  {
    id: 'notif-3',
    title: '👤 Profil zu 95% vollständig',
    body: 'Füge noch deine Interessen hinzu, um dein Profil zu vervollständigen',
    priority: 'normal',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true,
    category: 'profile',
    data: {
      screen: 'ProfileEdit',
      section: 'interests',
      completionRate: 95,
    },
  },
  {
    id: 'notif-4',
    title: '🔧 Wartungsarbeiten geplant',
    body: 'System-Update am Sonntag 02:00-04:00 Uhr. Kurze Unterbrechung möglich.',
    priority: 'normal',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    category: 'maintenance',
    data: {
      maintenanceWindow: {
        start: '2024-01-21T02:00:00Z',
        end: '2024-01-21T04:00:00Z',
      },
    },
  },
  {
    id: 'notif-5',
    title: '🎉 Willkommen bei ReactNative Skeleton!',
    body: 'Entdecke alle Features unserer Enterprise-App mit Clean Architecture',
    priority: 'normal',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    category: 'welcome',
    data: {
      screen: 'Onboarding',
      isWelcome: true,
    },
  },
];

// =============================================
// DEMO APP STATS
// =============================================

export const demoAppStats = {
  totalUsers: 12847,
  activeUsers: 8923,
  profileCompletionAvg: 76,
  notificationsDelivered: 45632,
  featuresUsed: [
    { name: 'Profile Management', usage: 89 },
    { name: 'Notifications', usage: 76 },
    { name: 'Security Settings', usage: 45 },
    { name: 'Data Export', usage: 23 },
  ],
  performanceMetrics: {
    appLoadTime: 850, // ms
    profileLoadTime: 320, // ms
    cacheHitRate: 0.78,
    errorRate: 0.002,
  },
};

// =============================================
// DEMO HELPER FUNCTIONS
// =============================================

export const getDemoProfile = (_userId?: string): UserProfile | null => {
  if (_userId) {
    return demoProfiles.find(profile => profile.id === _userId) || null;
  }
  return demoProfiles[0]; // Return first demo profile as default
};

export const getDemoNotifications = (_userId?: string): PushNotificationMessage[] => {
  // In real app, filter by userId
  return demoNotifications;
};

export const getRandomDemoProfile = (): UserProfile => {
  const randomIndex = Math.floor(Math.random() * demoProfiles.length);
  return demoProfiles[randomIndex];
};

export const generateNotificationId = (): string => {
  return `demo-notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const addDemoNotification = (notification: Omit<PushNotificationMessage, 'id' | 'timestamp'>): void => {
  const newNotification: PushNotificationMessage = {
    ...notification,
    id: generateNotificationId(),
    timestamp: new Date(),
  };
  demoNotifications.unshift(newNotification);
};

// =============================================
// DEMO FEATURES SHOWCASE
// =============================================

export const demoFeatures = [
  {
    title: 'Clean Architecture',
    description: 'Domain, Application, Data, Presentation Layers mit Dependency Injection',
    icon: '🏗️',
    implemented: true,
  },
  {
    title: 'Enterprise Security',
    description: 'XSS-Schutz, Validation, Error Handling, Authentication',
    icon: '🔐',
    implemented: true,
  },
  {
    title: 'Performance Optimierung',
    description: 'Intelligentes Caching, Loading States, Memory Management',
    icon: '⚡',
    implemented: true,
  },
  {
    title: 'Supabase Integration',
    description: 'Real-time Database, Auth, Storage, Push Notifications',
    icon: '🚀',
    implemented: true,
  },
  {
    title: 'Testing Framework',
    description: 'Jest + React Native Testing Library Setup',
    icon: '🧪',
    implemented: true,
  },
  {
    title: 'TypeScript Excellence',
    description: 'Type-safe codebase mit strengen Linting Rules',
    icon: '📘',
    implemented: true,
  },
];

export const generateMockAnalytics = (_userId?: string) => ({
  // Implementation of generateMockAnalytics function
}); 