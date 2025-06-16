/**
 * @fileoverview Skills Management Hook - CHAMPION
 * 
 * 🏆 CHAMPION STANDARDS 2025:
 * ✅ Single Responsibility: Skills management only
 * ✅ TanStack Query + Use Cases: Complete integration
 * ✅ Optimistic Updates: Mobile-first UX
 * ✅ Mobile Performance: Battery-friendly operations
 * ✅ Enterprise Logging: Essential audit trails
 * ✅ Clean Interface: Simplified Champion API
 */

import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@features/auth/presentation/hooks';
import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// 🎯 ENTERPRISE: Use Cases Integration
import { useProfileContainer } from '../../application/di/profile.container';
import { 
  ManageSkillsUseCase,
  SkillCategory as SkillCategoryFromUseCase,
  Skill as SkillFromUseCase
} from '../../application/use-cases/skills/manage-skills.use-case';

const logger = LoggerFactory.createServiceLogger('SkillsManagement');

// 🏆 CHAMPION QUERY KEYS
export const skillsQueryKeys = {
  all: ['skills'] as const,
  user: (userId: string) => [...skillsQueryKeys.all, 'user', userId] as const,
} as const;

// 🏆 CHAMPION CONFIG: Mobile Performance
const SKILLS_CONFIG = {
  staleTime: 1000 * 60 * 10,     // 🏆 Mobile: 10 minutes for battery efficiency
  gcTime: 1000 * 60 * 30,        // 🏆 Mobile: 30 minutes garbage collection
  retry: 2,                      // 🏆 Mobile: Reduced retries
  refetchOnWindowFocus: false,   // 🏆 Mobile: Battery-friendly
  refetchOnReconnect: true,
} as const;

// Use Types from Use Case
export type Skill = SkillFromUseCase;
export type SkillCategory = SkillCategoryFromUseCase;

// 🏆 CHAMPION INTERFACE: Simplified & Mobile-Optimized
export interface UseSkillsManagementReturn {
  // 🏆 Core Skills Data
  skillCategories: SkillCategory[];
  totalSkills: number;
  topSkills: Skill[];
  
  // 🏆 Champion Loading States
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // 🏆 Champion Actions (Essential Only)
  addSkill: (name: string, level: Skill['level'], category: string) => Promise<void>;
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>;
  removeSkill: (id: string) => Promise<void>;
  refreshSkills: () => Promise<void>;
  
  // 🏆 Mobile Performance Helpers
  getSkillsByCategory: (category: string) => Skill[];
  hasSkill: (skillName: string) => boolean;
  getSkillLevel: (skillName: string) => Skill['level'] | null;
  
  // 🏆 Legacy Compatibility (Simplified)
  t: (key: string, options?: any) => string;
}

/**
 * 🏆 CHAMPION SKILLS MANAGEMENT HOOK
 * 
 * ✅ CHAMPION PATTERNS:
 * - Single Responsibility: Skills management only
 * - Mobile Performance: Battery-friendly operations
 * - Enterprise Logging: Essential skills audit trails
 * - Clean Interface: Simplified skills API
 * - Optimistic Updates: Immediate UI response
 */
export const useSkillsManagement = (): UseSkillsManagementReturn => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || '';

  // 🎯 ENTERPRISE: Use Cases Integration
  const container = useProfileContainer();
  const manageSkillsUseCase = useMemo(() => new ManageSkillsUseCase(), []);
  
  // 🏆 CHAMPION QUERY: Skills Data
  const skillsQuery = useQuery({
    queryKey: skillsQueryKeys.user(userId),
    queryFn: async (): Promise<SkillCategory[]> => {
      if (!userId) {
        throw new Error('User ID required for skills query');
      }

      logger.info('Fetching user skills', LogCategory.BUSINESS, { userId });

      try {
        // ✅ ENTERPRISE: Use Case Integration
        const result = await manageSkillsUseCase.getUserSkills({ 
          userId,
          includeInactive: false 
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        logger.info('Skills fetched successfully', LogCategory.BUSINESS, { 
          userId,
          metadata: {
            categoriesCount: result.data.length,
            totalSkills: result.data.reduce((sum, cat) => sum + cat.skills.length, 0)
          }
        });
        
        return result.data;
      } catch (error) {
        logger.error('Failed to fetch skills', LogCategory.BUSINESS, { userId }, error as Error);
        throw error;
      }
    },
    enabled: !!userId,
    ...SKILLS_CONFIG,
  });

  // 🏆 CHAMPION MUTATION: Add Skill
  const addSkillMutation = useMutation({
    mutationFn: async ({ name, level, category }: { 
      name: string; 
      level: Skill['level']; 
      category: string; 
    }): Promise<Skill> => {
      logger.info('Adding new skill', LogCategory.BUSINESS, { 
        userId,
        metadata: { name, level, category }
      });

      try {
        // ✅ ENTERPRISE: Use Case Integration
        const result = await manageSkillsUseCase.createSkill({
          userId,
          name,
          level,
          category,
          source: 'manual'
        });

        if (!result.success) {
          throw new Error(result.error);
        }
        
        logger.info('Skill added successfully', LogCategory.BUSINESS, { 
          userId,
          metadata: { skillId: result.data.id }
        });
        return result.data;
      } catch (error) {
        logger.error('Failed to add skill', LogCategory.BUSINESS, { userId, metadata: { name } }, error as Error);
        throw error;
      }
    },
    
    // 🏆 OPTIMISTIC UPDATE: Mobile UX
    onMutate: async ({ name, level, category }) => {
      await queryClient.cancelQueries({ queryKey: skillsQueryKeys.user(userId) });
      
      const previousSkills = queryClient.getQueryData(skillsQueryKeys.user(userId));
      
      // Optimistically add skill
      queryClient.setQueryData(skillsQueryKeys.user(userId), (old: SkillCategory[] | undefined) => {
        if (!old) return old;
        
        const newSkill: Skill = {
          id: `temp_${Date.now()}`,
          name,
          level,
          category,
          verified: false,
          endorsements: 0,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return old.map(cat => 
          cat.name === category 
            ? { ...cat, skills: [...cat.skills, newSkill] }
            : cat
        );
      });
      
      return { previousSkills };
    },
    
    onSuccess: (newSkill) => {
      queryClient.setQueryData(skillsQueryKeys.user(userId), (old: SkillCategory[] | undefined) => {
        if (!old) return old;
        
        // Replace temp skill with real skill
        return old.map(cat => 
          cat.name === newSkill.category
            ? { 
                ...cat, 
                skills: cat.skills.map(skill => 
                  skill.name === newSkill.name && skill.id.startsWith('temp_')
                    ? newSkill
                    : skill
                )
              }
            : cat
        );
      });
      
      queryClient.invalidateQueries({ queryKey: skillsQueryKeys.user(userId) });
    },
    
    onError: (error, variables, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(skillsQueryKeys.user(userId), context.previousSkills);
      }
      logger.error('Add skill mutation failed', LogCategory.BUSINESS, { userId }, error as Error);
    },
  });

  // 🏆 CHAMPION MUTATION: Update Skill
  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<Skill>; 
    }): Promise<Skill> => {
      logger.info('Updating skill', LogCategory.BUSINESS, { userId, metadata: { skillId: id } });

      try {
        // ✅ ENTERPRISE: Use Case Integration
        const result = await manageSkillsUseCase.updateSkill({
          skillId: id,
          userId,
          updates
        });

        if (!result.success) {
          throw new Error(result.error);
        }
        
        logger.info('Skill updated successfully', LogCategory.BUSINESS, { userId, metadata: { skillId: id } });
        return result.data;
      } catch (error) {
        logger.error('Failed to update skill', LogCategory.BUSINESS, { userId, metadata: { skillId: id } }, error as Error);
        throw error;
      }
    },
    
    // 🏆 OPTIMISTIC UPDATE
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: skillsQueryKeys.user(userId) });
      
      const previousSkills = queryClient.getQueryData(skillsQueryKeys.user(userId));
      
      // Optimistically update skill
      queryClient.setQueryData(skillsQueryKeys.user(userId), (old: SkillCategory[] | undefined) => {
        if (!old) return old;
        
        return old.map(cat => ({
          ...cat,
          skills: cat.skills.map(skill => 
            skill.id === id 
              ? { ...skill, ...updates, updatedAt: new Date() }
              : skill
          )
        }));
      });
      
      return { previousSkills };
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsQueryKeys.user(userId) });
    },
    
    onError: (error, { id }, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(skillsQueryKeys.user(userId), context.previousSkills);
      }
      logger.error('Update skill mutation failed', LogCategory.BUSINESS, { userId, metadata: { skillId: id } }, error as Error);
    },
  });

  // 🏆 CHAMPION MUTATION: Remove Skill
  const removeSkillMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      logger.info('Removing skill', LogCategory.BUSINESS, { userId, metadata: { skillId: id } });

      try {
        // ✅ ENTERPRISE: Use Case Integration
        const result = await manageSkillsUseCase.deleteSkill({
          skillId: id,
          userId,
          reason: 'User requested deletion'
        });

        if (!result.success) {
          throw new Error(result.error);
        }
        
        logger.info('Skill removed successfully', LogCategory.BUSINESS, { userId, metadata: { skillId: id } });
      } catch (error) {
        logger.error('Failed to remove skill', LogCategory.BUSINESS, { userId, metadata: { skillId: id } }, error as Error);
        throw error;
      }
    },
    
    // 🏆 OPTIMISTIC UPDATE
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: skillsQueryKeys.user(userId) });
      
      const previousSkills = queryClient.getQueryData(skillsQueryKeys.user(userId));
      
      // Optimistically remove skill
      queryClient.setQueryData(skillsQueryKeys.user(userId), (old: SkillCategory[] | undefined) => {
        if (!old) return old;
        
        return old.map(cat => ({
          ...cat,
          skills: cat.skills.filter(skill => skill.id !== id)
        }));
      });
      
      return { previousSkills };
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsQueryKeys.user(userId) });
    },
    
    onError: (error, id, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(skillsQueryKeys.user(userId), context.previousSkills);
      }
      logger.error('Remove skill mutation failed', LogCategory.BUSINESS, { userId, metadata: { skillId: id } }, error as Error);
    },
  });

  // 🏆 CHAMPION COMPUTED VALUES (Memoized for Performance)
  const skillCategories = skillsQuery.data || [];
  
  const totalSkills = useMemo(() => {
    return skillCategories.reduce((total, category) => total + category.skills.length, 0);
  }, [skillCategories]);

  const topSkills = useMemo(() => {
    const allSkills = skillCategories.flatMap(cat => cat.skills);
    return allSkills
      .filter(skill => skill.level === 'expert' || skill.level === 'advanced')
      .sort((a, b) => (b.endorsements || 0) - (a.endorsements || 0))
      .slice(0, 5);
  }, [skillCategories]);

  const isLoading = skillsQuery.isLoading;
  const isSaving = addSkillMutation.isPending || updateSkillMutation.isPending || removeSkillMutation.isPending;
  const error = skillsQuery.error?.message || addSkillMutation.error?.message || updateSkillMutation.error?.message || removeSkillMutation.error?.message || null;

  // 🏆 CHAMPION ACTIONS
  const addSkill = useCallback(async (name: string, level: Skill['level'], category: string) => {
    await addSkillMutation.mutateAsync({ name, level, category });
  }, [addSkillMutation]);

  const updateSkill = useCallback(async (id: string, updates: Partial<Skill>) => {
    await updateSkillMutation.mutateAsync({ id, updates });
  }, [updateSkillMutation]);

  const removeSkill = useCallback(async (id: string) => {
    await removeSkillMutation.mutateAsync(id);
  }, [removeSkillMutation]);

  const refreshSkills = useCallback(async () => {
    logger.info('Refreshing skills', LogCategory.BUSINESS, { userId });
    await skillsQuery.refetch();
  }, [skillsQuery, userId]);

  // 🏆 MOBILE PERFORMANCE HELPERS
  const getSkillsByCategory = useCallback((category: string): Skill[] => {
    const cat = skillCategories.find(c => c.name === category);
    return cat?.skills || [];
  }, [skillCategories]);

  const hasSkill = useCallback((skillName: string): boolean => {
    return skillCategories.some(cat => 
      cat.skills.some(skill => 
        skill.name.toLowerCase() === skillName.toLowerCase()
      )
    );
  }, [skillCategories]);

  const getSkillLevel = useCallback((skillName: string): Skill['level'] | null => {
    for (const category of skillCategories) {
      const skill = category.skills.find(s => 
        s.name.toLowerCase() === skillName.toLowerCase()
      );
      if (skill) return skill.level;
    }
    return null;
  }, [skillCategories]);

  return {
    // 🏆 Core Skills Data
    skillCategories,
    totalSkills,
    topSkills,
    
    // 🏆 Champion Loading States
    isLoading,
    isSaving,
    error,
    
    // 🏆 Champion Actions
    addSkill,
    updateSkill,
    removeSkill,
    refreshSkills,
    
    // 🏆 Mobile Performance Helpers
    getSkillsByCategory,
    hasSkill,
    getSkillLevel,
    
    // 🏆 Legacy Compatibility
    t,
  };
};