/**
 * useCustomFieldsEdit Hook - Enterprise Business Logic
 * Centralized state management and business logic for custom fields editing
 * Following enterprise patterns with proper error handling and performance optimization
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useTheme } from '../../../../core/theme/theme.system';
import {
  CustomField,
  CustomFieldType,
  CustomFieldTemplate,
  UseCustomFieldsEditReturn,
  DEFAULT_FIELD_TYPES,
  DEFAULT_FIELD_TEMPLATES,
  CUSTOM_FIELDS_TEST_IDS,
  CUSTOM_FIELDS_CONSTANTS,
} from '../types';
import { useProfile } from './use-profile.hook';

// Constants
const _FIELD_TYPES = [
  'text',
  'email', 
  'url',
  'phone',
  'date',
  'select',
  'multiselect',
  'textarea'
] as const;

// Mock Custom Fields Service - replace with actual service
  const _mockCustomFieldsService = {
  getCustomFields: async (): Promise<CustomField[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: '1',
        key: 'languages',
        label: 'Sprachen',
        value: 'Deutsch, Englisch, Spanisch',
        type: 'text',
        required: false,
        placeholder: 'Ihre Sprachen auflisten',
        order: 1,
        metadata: {
          createdAt: new Date(),
          source: 'template',
        }
      },
      {
        id: '2',
        key: 'hobbies',
        label: 'Hobbys',
        value: 'Fotografie, Wandern, Lesen',
        type: 'text',
        required: false,
        placeholder: 'Was machen Sie gerne?',
        order: 2,
        metadata: {
          createdAt: new Date(),
          source: 'template',
        }
      },
      {
        id: '3',
        key: 'personalWebsite',
        label: 'Persönliche Website',
        value: 'https://max-mustermann.dev',
        type: 'url',
        required: false,
        placeholder: 'https://ihre-website.com',
        order: 3,
        metadata: {
          createdAt: new Date(),
          source: 'template',
        }
      },
    ];
  },

  updateCustomFields: async (fields: CustomField[]): Promise<{ success: boolean; fields?: CustomField[] }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate potential error
    if (Math.random() < 0.1) {
      throw new Error('Network error');
    }
    
    return { 
      success: true, 
      fields: fields.map(field => ({
        ...field,
        metadata: {
          createdAt: field.metadata?.createdAt || new Date(),
          source: field.metadata?.source || 'user',
          updatedAt: new Date(),
        }
      }))
    };
  },

  validateField: async (field: CustomField): Promise<{ isValid: boolean; errors: string[] }> => {
    const errors: string[] = [];
    
    // Label validation
    if (!field.label || field.label.trim().length < CUSTOM_FIELDS_CONSTANTS.MIN_LABEL_LENGTH) {
      errors.push('Label zu kurz');
    }
    
    if (field.label && field.label.length > CUSTOM_FIELDS_CONSTANTS.MAX_LABEL_LENGTH) {
      errors.push('Label zu lang');
    }
    
    // Value validation
    if (field.value && field.value.length > CUSTOM_FIELDS_CONSTANTS.MAX_FIELD_LENGTH) {
      errors.push('Wert zu lang');
    }
    
    // Type-specific validation
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        errors.push('Ungültige E-Mail-Adresse');
      }
    }
    
    if (field.type === 'url' && field.value) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(field.value)) {
        errors.push('Ungültige URL');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

interface UseCustomFieldsEditProps {
  navigation: any;
}

export const useCustomFieldsEdit = ({ navigation: _navigation }: UseCustomFieldsEditProps): UseCustomFieldsEditReturn & {
  // Extended return type for screen-specific functionality
  theme: any;
  t: (key: string, options?: any) => string;
  testIds: typeof CUSTOM_FIELDS_TEST_IDS;
  
  // Screen state
  fieldValidationErrors: Record<string, string[]>;
  newFieldMenuVisible: boolean;
  setNewFieldMenuVisible: (visible: boolean) => void;
  
  // Screen handlers
  handleAddCustomField: (label: string, type: CustomFieldType) => void;
  handleAddFromTemplate: (template: CustomFieldTemplate) => void;
  handleRemoveField: (id: string) => void;
  handleFieldUpdate: (id: string, value: string) => void;
  handleSave: () => Promise<void>;
  handleReset: () => void;
  
  // Input props generator
  getInputProps: (field: CustomField) => any;
} => {
  // External dependencies
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  // Profile integration
  const { profile, updateProfile, isLoading: profileIsLoading, isUpdating } = useProfile();

  // State
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [localFields, setLocalFields] = useState<CustomField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newFieldMenuVisible, setNewFieldMenuVisible] = useState(false);
  const [fieldValidationErrors, setFieldValidationErrors] = useState<Record<string, string[]>>({});

  // Load custom fields from profile
  useEffect(() => {
    if (profile?.customFields) {
      // Convert profile custom fields to CustomField format
      const fields: CustomField[] = Object.entries(profile.customFields).map(([key, value], index) => ({
        id: key,
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
        value: String(value || ''),
        type: 'text' as CustomFieldType,
        required: false,
        order: index + 1,
        metadata: {
          createdAt: new Date(),
          source: 'user' as const,
        }
      }));
      
      setCustomFields(fields);
      setLocalFields([...fields]);
    } else {
      // Initialize with empty fields if no custom fields exist
      setCustomFields([]);
      setLocalFields([]);
    }
  }, [profile?.customFields]);

  // Derived state
  const hasChanges = useMemo(() => {
    if (customFields.length !== localFields.length) return true;
    
    return localFields.some((localField, index) => {
      const originalField = customFields[index];
      if (!originalField) return true;
      
      return (
        localField.label !== originalField.label ||
        localField.value !== originalField.value ||
        localField.type !== originalField.type ||
        localField.placeholder !== originalField.placeholder ||
        localField.order !== originalField.order
      );
    });
  }, [customFields, localFields]);

  const _fieldTypes = useMemo(() => DEFAULT_FIELD_TYPES, []);
  const _fieldTemplates = useMemo(() => DEFAULT_FIELD_TEMPLATES, []);

  // Validation
  const validateField = (field: CustomField) => {
    // Synchrone Validierung
    const errors: string[] = [];
    
    if (!field.label || field.label.trim().length < CUSTOM_FIELDS_CONSTANTS.MIN_LABEL_LENGTH) {
      errors.push('Label zu kurz');
    }
    
    if (field.label && field.label.length > CUSTOM_FIELDS_CONSTANTS.MAX_LABEL_LENGTH) {
      errors.push('Label zu lang');
    }
    
    if (field.value && field.value.length > CUSTOM_FIELDS_CONSTANTS.MAX_FIELD_LENGTH) {
      errors.push('Wert zu lang');
    }
    
    return errors;
  };

  const validateAllFields = useCallback(async (): Promise<boolean> => {
    const errors: Record<string, string[]> = {};
    let hasErrors = false;

    for (const field of localFields) {
      const fieldErrors = validateField(field);
      if (fieldErrors.length > 0) {
        errors[field.id] = fieldErrors;
        hasErrors = true;
      }
    }

    setFieldValidationErrors(errors);
    return !hasErrors;
  }, [localFields, validateField]);

  // Field manipulation
  const handleAddCustomField = useCallback((label: string, type: CustomFieldType) => {
    const newId = Date.now().toString();
    const newField: CustomField = {
      id: newId,
      key: label.toLowerCase().replace(/\s+/g, '_'),
      label,
      value: '',
      type,
      required: false,
      placeholder: `${label} eingeben`,
      order: localFields.length + 1,
      metadata: {
        createdAt: new Date(),
        source: 'user',
      }
    };

    setLocalFields(prev => [...prev, newField]);
  }, [localFields.length]);

  const handleAddFromTemplate = useCallback((template: CustomFieldTemplate) => {
    const newId = Date.now().toString();
    const newField: CustomField = {
      id: newId,
      key: template.key,
      label: template.label,
      value: '',
      type: template.type,
      required: false,
      placeholder: template.placeholder,
      order: localFields.length + 1,
      metadata: {
        createdAt: new Date(),
        source: 'template',
      }
    };

    setLocalFields(prev => [...prev, newField]);
  }, [localFields.length]);

  const handleRemoveField = useCallback((id: string) => {
    Alert.alert(
      t('customFields.delete.title', { defaultValue: 'Feld löschen' }),
      t('customFields.delete.message', { defaultValue: 'Sind Sie sicher, dass Sie dieses Feld löschen möchten?' }),
      [
        { text: t('common.cancel', { defaultValue: 'Abbrechen' }), style: 'cancel' },
        {
          text: t('common.delete', { defaultValue: 'Löschen' }),
          style: 'destructive',
          onPress: () => {
            setLocalFields(prev => prev.filter(field => field.id !== id));
            setFieldValidationErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[id];
              return newErrors;
            });
          }
        }
      ]
    );
  }, [t]);

  const handleFieldUpdate = useCallback((id: string, value: string) => {
    setLocalFields(prev => prev.map(field => 
      field.id === id ? { ...field, value } : field
    ));
    
    // Clear validation errors for this field when user starts typing
    setFieldValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  }, []);

  // Save functionality
  const handleSave = useCallback(async () => {
    try {
      setError(null);

      // Validate all fields
      const isValid = await validateAllFields();
      if (!isValid) {
        Alert.alert(
          t('customFields.validation.title', { defaultValue: 'Validierungsfehler' }),
          t('customFields.validation.message', { defaultValue: 'Bitte korrigieren Sie die Fehler vor dem Speichern' })
        );
        return;
      }

      // Convert CustomField[] back to profile customFields format
      const customFieldsForProfile: Record<string, any> = {};
      localFields.forEach(field => {
        customFieldsForProfile[field.key] = field.value;
      });

      // Update profile with custom fields
      const success = await updateProfile({ customFields: customFieldsForProfile });
      
      if (success) {
        setCustomFields([...localFields]);
        
        Alert.alert(
          t('customFields.save.success.title', { defaultValue: 'Erfolgreich gespeichert' }),
          t('customFields.save.success.message', { defaultValue: 'Ihre benutzerdefinierten Felder wurden erfolgreich gespeichert' })
        );
      } else {
        Alert.alert(
          t('customFields.save.error.title', { defaultValue: 'Speichern fehlgeschlagen' }),
          t('customFields.save.error.message', { 
            defaultValue: 'Ihre Änderungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.'
          })
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      Alert.alert(
        t('customFields.save.error.title', { defaultValue: 'Speichern fehlgeschlagen' }),
        t('customFields.save.error.message', { 
          defaultValue: 'Ihre Änderungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.',
          error: errorMessage 
        })
      );
    }
  }, [localFields, validateAllFields, t, updateProfile]);

  const handleReset = useCallback(() => {
    Alert.alert(
      t('customFields.reset.title', { defaultValue: 'Änderungen verwerfen' }),
      t('customFields.reset.message', { defaultValue: 'Alle ungespeicherten Änderungen gehen verloren. Fortfahren?' }),
      [
        { text: t('common.cancel', { defaultValue: 'Abbrechen' }), style: 'cancel' },
        {
          text: t('common.discard', { defaultValue: 'Verwerfen' }),
          style: 'destructive',
          onPress: () => {
            setLocalFields([...customFields]);
            setFieldValidationErrors({});
          }
        }
      ]
    );
  }, [customFields, t]);

  // Input props generator
  const getInputProps = useCallback((field: CustomField) => ({
    label: field.label,
    value: field.value,
    onChangeText: (value: string) => handleFieldUpdate(field.id, value),
    placeholder: field.placeholder,
    multiline: field.type === 'textarea',
    numberOfLines: field.type === 'textarea' ? 3 : 1,
    keyboardType: field.type === 'email' ? 'email-address' : 
                  field.type === 'url' ? 'url' : 
                  field.type === 'number' ? 'numeric' : 'default',
    autoCapitalize: field.type === 'email' || field.type === 'url' ? 'none' : 'sentences',
    autoCorrect: field.type === 'email' || field.type === 'url' ? false : true,
    disabled: isUpdating,
    error: fieldValidationErrors[field.id]?.length > 0,
  }), [handleFieldUpdate, isUpdating, fieldValidationErrors]);

  return {
    // Required by UseCustomFieldsEditReturn interface
    customFields: localFields,
    localFields,
    isLoading: profileIsLoading,
    isSaving: isUpdating,
    hasChanges,
    error,
    
    // Field operations (interface requirements)
    addField: handleAddCustomField,
    updateField: (id: string, updates: Partial<CustomField>) => {
      setLocalFields(prev => prev.map(field => 
        field.id === id ? { ...field, ...updates } : field
      ));
    },
    removeField: handleRemoveField,
    reorderFields: (fields: CustomField[]) => setLocalFields(fields),
    
    // Form operations (interface requirements)
    save: handleSave,
    reset: handleReset,
    
    // Validation (interface requirements)
    validateField: (field: CustomField) => {
      const errors = validateField(field);
      return { isValid: errors.length === 0, errors };
    },
    validateAllFields,
    
    // Templates (interface requirements)
    fieldTemplates: DEFAULT_FIELD_TEMPLATES,
    fieldTypes: DEFAULT_FIELD_TYPES.map(ft => ft.type),
    
    // Screen helpers (interface requirements)
    showTemplates,
    setShowTemplates,
    
    // Extended properties for screen
    newFieldMenuVisible,
    setNewFieldMenuVisible,
    fieldValidationErrors,
    handleAddCustomField,
    handleAddFromTemplate,
    handleRemoveField,
    handleFieldUpdate,
    handleSave,
    handleReset,
    getInputProps,
    
    // Screen dependencies
    theme,
    t,
    testIds: CUSTOM_FIELDS_TEST_IDS,
  };
}; 