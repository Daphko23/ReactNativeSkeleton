/**
 * useSkillsManagement Hook - Skills Management
 * Manages skills state and operations
 */

import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../core/theme/theme.system';

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  verified?: boolean;
  endorsements?: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

export interface UseSkillsManagementReturn {
  skillCategories: SkillCategory[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  addSkill: (name: string, level: Skill['level'], category: string) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  saveSkills: () => Promise<void>;
  hasChanges: boolean;
  
  // Theme and translations
  theme: any;
  t: (key: string, options?: any) => string;
}

export const useSkillsManagement = (): UseSkillsManagementReturn => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [originalCategories, setOriginalCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load skills
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Mock skills data
        const mockCategories: SkillCategory[] = [
          {
            id: '1',
            name: t('skills.categories.technical', { defaultValue: 'Technische Fertigkeiten' }),
            icon: 'code-tags',
            skills: [
              {
                id: 'skill_1',
                name: 'React Native',
                level: 'advanced',
                category: 'Frontend',
                verified: true,
                endorsements: 15,
              },
              {
                id: 'skill_2',
                name: 'TypeScript',
                level: 'expert',
                category: 'Programming',
                verified: true,
                endorsements: 23,
              },
            ],
          },
          {
            id: '2',
            name: t('skills.categories.soft', { defaultValue: 'Soft Skills' }),
            icon: 'account-group',
            skills: [
              {
                id: 'skill_3',
                name: 'Teamwork',
                level: 'expert',
                category: 'Communication',
                verified: false,
                endorsements: 8,
              },
            ],
          },
        ];
        
        setSkillCategories(mockCategories);
        setOriginalCategories(JSON.parse(JSON.stringify(mockCategories)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills');
      } finally {
        setIsLoading(false);
      }
    };

    loadSkills();
  }, [t]);

  const hasChanges = JSON.stringify(skillCategories) !== JSON.stringify(originalCategories);

  const addSkill = useCallback((name: string, level: Skill['level'], categoryName: string) => {
    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      name,
      level,
      category: categoryName,
      verified: false,
      endorsements: 0,
    };

    setSkillCategories(prev => prev.map(category => {
      if (category.name === categoryName) {
        return {
          ...category,
          skills: [...category.skills, newSkill],
        };
      }
      return category;
    }));
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setSkillCategories(prev => prev.map(category => ({
      ...category,
      skills: category.skills.map(skill => 
        skill.id === id ? { ...skill, ...updates } : skill
      ),
    })));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setSkillCategories(prev => prev.map(category => ({
      ...category,
      skills: category.skills.filter(skill => skill.id !== id),
    })));
  }, []);

  const saveSkills = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOriginalCategories(JSON.parse(JSON.stringify(skillCategories)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save skills');
    } finally {
      setIsSaving(false);
    }
  }, [skillCategories]);

  return {
    skillCategories,
    isLoading,
    isSaving,
    error,
    addSkill,
    updateSkill,
    removeSkill,
    saveSkills,
    hasChanges,
    theme,
    t,
  };
}; 