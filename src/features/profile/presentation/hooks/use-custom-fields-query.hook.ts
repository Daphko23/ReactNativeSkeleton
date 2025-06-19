/**
 * @fileoverview Custom Fields Query Hook - Mobile First (Simplified)
 * Temporary simplified version until Interface-Mismatches are resolved
 */

import {
  useState as _useState,
  useCallback as _useCallback,
  useMemo as _useMemo,
} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../auth/presentation/hooks/use-auth.hook';
import { useProfile } from './use-profile.hook';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Simple Mobile App Types (temporary)
interface CustomField {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
  label: string;
  required: boolean;
  privacy: 'public' | 'private' | 'friends';
  order: number;
}

interface CustomFieldTemplate {
  id: string;
  name: string;
  fields: CustomField[];
}

const logger = LoggerFactory.createServiceLogger('CustomFieldsQuery');

// Simple Query Keys
export const customFieldsQueryKeys = {
  all: ['customFields'] as const,
  user: (userId: string) =>
    [...customFieldsQueryKeys.all, 'user', userId] as const,
  templates: () => [...customFieldsQueryKeys.all, 'templates'] as const,
} as const;

// Simple Custom Fields Query
export const useCustomFieldsQuery = (userId?: string) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const effectiveUserId = userId || user?.id;

  return useQuery({
    queryKey: customFieldsQueryKeys.user(effectiveUserId || ''),
    queryFn: async (): Promise<CustomField[]> => {
      if (!effectiveUserId) {
        throw new Error('User ID required for custom fields query');
      }

      logger.info('Fetching custom fields', LogCategory.BUSINESS, {
        metadata: { userId: effectiveUserId },
      });

      // Simple implementation using profile data
      const customFields = profile?.customFields || {};
      const fields: CustomField[] = Object.entries(customFields).map(
        ([key, value], index) => ({
          id: `field-${index}`,
          key,
          value: String(value || ''),
          label: key.charAt(0).toUpperCase() + key.slice(1),
          type: 'text' as const,
          required: false,
          privacy: 'public' as const,
          order: index,
        })
      );

      return fields;
    },
    enabled: !!effectiveUserId && !!profile,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Simple Templates Query
export const useCustomFieldTemplatesQuery = () => {
  return useQuery({
    queryKey: customFieldsQueryKeys.templates(),
    queryFn: async (): Promise<CustomFieldTemplate[]> => {
      logger.info('Fetching custom field templates', LogCategory.BUSINESS);

      // Simple static templates
      return [
        {
          id: 'template-1',
          name: 'Basic Info',
          fields: [
            {
              id: 'field-hobby',
              key: 'hobbies',
              value: '',
              label: 'Hobbies',
              type: 'text',
              required: false,
              privacy: 'public',
              order: 0,
            },
          ],
        },
      ];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Simple Update Mutation
export const useUpdateCustomFieldsMutation = () => {
  const queryClient = useQueryClient();
  const { updateProfile } = useProfile();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (fields: CustomField[]) => {
      if (!user?.id) {
        throw new Error('User ID required for custom fields update');
      }

      logger.info('Updating custom fields', LogCategory.BUSINESS, {
        metadata: { userId: user.id },
      });

      const customFields: Record<string, any> = {};
      fields.forEach(field => {
        if (field.value.trim()) {
          customFields[field.key] = field.value;
        }
      });

      await updateProfile({ customFields });
      return fields;
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: customFieldsQueryKeys.user(user.id),
        });
      }
    },
    onError: error => {
      logger.error(
        'Custom fields update failed',
        LogCategory.BUSINESS,
        {
          metadata: { userId: user?.id },
        },
        error as Error
      );
    },
  });
};

// Simple Manager Hook
export const useCustomFieldsManager = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id || '';

  const fieldsQuery = useCustomFieldsQuery(effectiveUserId);
  const templatesQuery = useCustomFieldTemplatesQuery();
  const updateMutation = useUpdateCustomFieldsMutation();

  const customFields: CustomField[] = fieldsQuery.data || [];
  const templates: CustomFieldTemplate[] = templatesQuery.data || [];

  const updateCustomFields = async (fields: CustomField[]) => {
    return updateMutation.mutateAsync(fields);
  };

  const updateField = async (key: string, value: string) => {
    const updatedFields = customFields.map(field =>
      field.key === key ? { ...field, value } : field
    );
    return updateCustomFields(updatedFields);
  };

  return {
    customFields,
    templates,
    isLoading: fieldsQuery.isLoading || templatesQuery.isLoading,
    isUpdating: updateMutation.isPending,
    error:
      fieldsQuery.error?.message ||
      templatesQuery.error?.message ||
      updateMutation.error?.message ||
      null,
    hasChanges: updateMutation.isSuccess || updateMutation.isPending,
    updateCustomFields,
    updateField,
    fieldErrors: {} as Record<string, string[]>,
  };
};

// Simple Cache Hook
export const useCustomFieldsCache = () => {
  const queryClient = useQueryClient();

  return {
    clearCache: (userId: string) => {
      queryClient.removeQueries({
        queryKey: customFieldsQueryKeys.user(userId),
      });
    },
    refreshCache: async (userId: string) => {
      await queryClient.invalidateQueries({
        queryKey: customFieldsQueryKeys.user(userId),
      });
    },
  };
};
