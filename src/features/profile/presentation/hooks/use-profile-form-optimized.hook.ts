/**
 * useProfileFormOptimized - Immer-Optimized Profile Form Hook
 * Demonstriert optimierte Immer-Verwendung für komplexe Form States
 */

import { useImmer } from 'use-immer';
import { useCallback, useEffect } from 'react';
import { UserProfile } from '../../domain/entities/user-profile.entity';
import { useProfile } from './use-profile.hook';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  phone: string;
  professional: {
    company: string;
    jobTitle: string;
    industry: string;
    skills: string[];
    workLocation: 'remote' | 'onsite' | 'hybrid';
  };
  socialLinks: {
    linkedIn: string;
    twitter: string;
    github: string;
    instagram: string;
  };
  customFields: Record<string, any>;
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends' | 'custom';
    emailVisibility: 'public' | 'private' | 'friends';
    phoneVisibility: 'public' | 'private' | 'friends';
  };
}

const initialFormData: ProfileFormData = {
  firstName: '',
  lastName: '',
  displayName: '',
  bio: '',
  location: '',
  website: '',
  phone: '',
  professional: {
    company: '',
    jobTitle: '',
    industry: '',
    skills: [],
    workLocation: 'remote',
  },
  socialLinks: {
    linkedIn: '',
    twitter: '',
    github: '',
    instagram: '',
  },
  customFields: {},
  privacy: {
    profileVisibility: 'private',
    emailVisibility: 'private',
    phoneVisibility: 'private',
  },
};

export function useProfileFormOptimized() {
  const { profile } = useProfile();
  
  // ✅ Immer Hook für komplexe verschachtelte State-Updates
  const [formData, updateFormData] = useImmer<ProfileFormData>(initialFormData);
  const [originalData, setOriginalData] = useImmer<ProfileFormData>(initialFormData);

  // ✅ Optimierte Field Updates mit Immer
  const updateField = useCallback((field: keyof ProfileFormData, value: any) => {
    updateFormData(draft => {
      draft[field] = value as any;
    });
  }, [updateFormData]);

  // ✅ Verschachtelte Updates mit Immer - Super elegant!
  const updateNestedField = useCallback((path: string[], value: any) => {
    updateFormData(draft => {
      let current: any = draft;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
    });
  }, [updateFormData]);

  // ✅ Array Operations mit Immer
  const addSkill = useCallback((skill: string) => {
    updateFormData(draft => {
      if (!draft.professional.skills.includes(skill)) {
        draft.professional.skills.push(skill);
      }
    });
  }, [updateFormData]);

  const removeSkill = useCallback((index: number) => {
    updateFormData(draft => {
      draft.professional.skills.splice(index, 1);
    });
  }, [updateFormData]);

  // ✅ Spezielle Updates für Social Links
  const updateSocialLink = useCallback((platform: keyof ProfileFormData['socialLinks'], url: string) => {
    updateFormData(draft => {
      draft.socialLinks[platform] = url;
    });
  }, [updateFormData]);

  // ✅ Dynamic Custom Fields mit Immer
  const updateCustomField = useCallback((key: string, value: any) => {
    updateFormData(draft => {
      draft.customFields[key] = value;
    });
  }, [updateFormData]);

  const removeCustomField = useCallback((key: string) => {
    updateFormData(draft => {
      delete draft.customFields[key];
    });
  }, [updateFormData]);

  // ✅ Bulk Operations - Sehr mächtig mit Immer
  const bulkUpdate = useCallback((updates: Partial<ProfileFormData>) => {
    updateFormData(draft => {
      Object.keys(updates).forEach(key => {
        const typedKey = key as keyof ProfileFormData;
        if (typeof updates[typedKey] === 'object' && updates[typedKey] !== null) {
          // Deep merge für verschachtelte Objekte
          Object.assign(draft[typedKey] as any, updates[typedKey]);
        } else {
          (draft as any)[typedKey] = updates[typedKey];
        }
      });
    });
  }, [updateFormData]);

  // Form Management
  const resetForm = useCallback(() => {
    updateFormData(() => ({ ...originalData }));
  }, [updateFormData, originalData]);

  const loadFromProfile = useCallback((profile: UserProfile) => {
    const profileFormData: ProfileFormData = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      displayName: profile.displayName || '',
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      phone: profile.phone || '',
      professional: {
        company: profile.professional?.company || '',
        jobTitle: profile.professional?.jobTitle || '',
        industry: profile.professional?.industry || '',
        skills: profile.professional?.skills || [],
        workLocation: profile.professional?.workLocation || 'remote',
      },
      socialLinks: {
        linkedIn: profile.socialLinks?.linkedIn || '',
        twitter: profile.socialLinks?.twitter || '',
        github: profile.socialLinks?.instagram || '',
        instagram: profile.socialLinks?.instagram || '',
      },
      customFields: profile.customFields || {},
      privacy: {
        profileVisibility: profile.privacySettings?.profileVisibility || 'private',
        emailVisibility: profile.privacySettings?.emailVisibility || 'private',
        phoneVisibility: profile.privacySettings?.phoneVisibility || 'private',
      },
    };

    setOriginalData(profileFormData);
    updateFormData(() => profileFormData);
  }, [updateFormData, setOriginalData]);

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      loadFromProfile(profile);
    }
  }, [profile, loadFromProfile]);

  // Computed Values
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  return {
    formData,
    hasChanges,
    updateField,
    updateNestedField,
    addSkill,
    removeSkill,
    updateSocialLink,
    updateCustomField,
    removeCustomField,
    bulkUpdate,
    resetForm,
    loadFromProfile,
  };
}