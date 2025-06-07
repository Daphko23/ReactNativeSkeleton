/**
 * useProfileForm Hook - Presentation Layer
 * Specialized hook for profile form management with validation
 */

import { useCallback, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useProfile } from './use-profile.hook';
import { UserProfile } from '../../domain/entities/user-profile.entity';

// Form data interface
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  // Professional fields
  company?: string;
  jobTitle?: string;
  industry?: string;
  skills?: string[];
  workLocation?: 'remote' | 'onsite' | 'hybrid';
  // Social links
  linkedIn?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  // Custom fields
  customFields?: Record<string, any>;
}

export interface UseProfileFormReturn {
  // Form state and methods from react-hook-form
  form: UseFormReturn<ProfileFormData>;
  
  // Custom methods
  isLoading: boolean;
  isUpdating: boolean;
  isRefreshing: boolean;
  isDirty: boolean;
  hasChanges: boolean;
  
  // Actions
  handleSave: () => Promise<boolean>;
  handleReset: () => void;
  handleCancel: () => void;
  
  // Field helpers
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
  updateCustomField: (key: string, value: any) => void;
  
  // Validation
  validateField: (fieldName: keyof ProfileFormData) => Promise<boolean>;
  getFieldError: (fieldName: keyof ProfileFormData) => string | undefined;
}

export function useProfileForm(): UseProfileFormReturn {
  const { 
    profile, 
    updateProfile, 
    isLoading,
    isUpdating,
    isRefreshing
  } = useProfile();

  // Initialize form with basic validation
  const form = useForm<ProfileFormData>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      displayName: '',
      bio: '',
      location: '',
      website: '',
      phone: '',
      company: '',
      jobTitle: '',
      industry: '',
      skills: [],
      workLocation: 'remote',
      linkedIn: '',
      twitter: '',
      github: '',
      instagram: '',
      customFields: {},
    },
  });

  const { 
    reset, 
    watch, 
    setValue, 
    getValues, 
    formState: { isDirty, errors }
  } = form;

  // Watch all form values to detect changes
  watch();
  const hasChanges = isDirty;

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      const formData: ProfileFormData = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        phone: profile.phone || '',
        company: profile.professional?.company || '',
        jobTitle: profile.professional?.jobTitle || '',
        industry: profile.professional?.industry || '',
        skills: profile.professional?.skills || [],
        workLocation: profile.professional?.workLocation || 'remote',
        linkedIn: profile.socialLinks?.linkedIn || '',
        twitter: profile.socialLinks?.twitter || '',
        github: profile.socialLinks?.github || '',
        instagram: profile.socialLinks?.instagram || '',
        customFields: profile.customFields || {},
      };
      
      reset(formData);
    }
  }, [profile, reset]);

  // Save form data
  const handleSave = useCallback(async (): Promise<boolean> => {
    const isFormValid = await form.trigger();
    if (!isFormValid) {
      return false;
    }

    const data = getValues();
    
    const profileUpdate: Partial<UserProfile> = {
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      bio: data.bio,
      location: data.location,
      website: data.website,
      phone: data.phone,
      professional: {
        ...profile?.professional,
        company: data.company,
        jobTitle: data.jobTitle,
        industry: data.industry,
        skills: data.skills,
        workLocation: data.workLocation,
      },
      socialLinks: {
        ...profile?.socialLinks,
        linkedIn: data.linkedIn,
        twitter: data.twitter,
        github: data.github,
        instagram: data.instagram,
      },
      customFields: data.customFields,
    };

    const success = await updateProfile(profileUpdate);

    if (success) {
      // Reset form dirty state after successful save
      reset(data);
    }

    return success;
  }, [form, getValues, updateProfile, profile, reset]);

  // Reset form to original state
  const handleReset = useCallback(() => {
    if (profile) {
      const formData: ProfileFormData = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        phone: profile.phone || '',
        company: profile.professional?.company || '',
        jobTitle: profile.professional?.jobTitle || '',
        industry: profile.professional?.industry || '',
        skills: profile.professional?.skills || [],
        workLocation: profile.professional?.workLocation || 'remote',
        linkedIn: profile.socialLinks?.linkedIn || '',
        twitter: profile.socialLinks?.twitter || '',
        github: profile.socialLinks?.github || '',
        instagram: profile.socialLinks?.instagram || '',
        customFields: profile.customFields || {},
      };
      
      reset(formData);
    }
  }, [profile, reset]);

  // Cancel editing
  const handleCancel = useCallback(() => {
    handleReset();
  }, [handleReset]);

  // Skills management
  const addSkill = useCallback((skill: string) => {
    const currentSkills = getValues('skills') || [];
    if (!currentSkills.includes(skill) && skill.trim()) {
      setValue('skills', [...currentSkills, skill.trim()], { shouldDirty: true });
    }
  }, [getValues, setValue]);

  const removeSkill = useCallback((index: number) => {
    const currentSkills = getValues('skills') || [];
    const newSkills = currentSkills.filter((_, i) => i !== index);
    setValue('skills', newSkills, { shouldDirty: true });
  }, [getValues, setValue]);

  // Custom fields management
  const updateCustomField = useCallback((key: string, value: any) => {
    const currentCustomFields = getValues('customFields') || {};
    setValue('customFields', {
      ...currentCustomFields,
      [key]: value,
    }, { shouldDirty: true });
  }, [getValues, setValue]);

  // Field validation
  const validateField = useCallback(async (fieldName: keyof ProfileFormData): Promise<boolean> => {
    try {
      await form.trigger(fieldName);
      return !errors[fieldName];
    } catch {
      return false;
    }
  }, [form, errors]);

  // Get field error with proper type handling
  const getFieldError = useCallback((fieldName: keyof ProfileFormData): string | undefined => {
    const error = errors[fieldName];
    if (error && typeof error === 'object' && 'message' in error) {
      return error.message as string;
    }
    return undefined;
  }, [errors]);

  return {
    form,
    isLoading,
    isUpdating,
    isRefreshing,
    isDirty,
    hasChanges,
    handleSave,
    handleReset,
    handleCancel,
    addSkill,
    removeSkill,
    updateCustomField,
    validateField,
    getFieldError,
  };
} 