/**
 * @fileoverview Use Skills Management Hook - VEREINFACHT
 * Skills Management für Mobile App (ohne Enterprise Over-Engineering)
 */

import { useState, useCallback } from 'react';

// Vereinfachte Skill Types
interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface UseSkillsManagementReturn {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
  addSkill: (name: string, level: Skill['level']) => Promise<void>;
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>;
  removeSkill: (id: string) => Promise<void>;
  refreshSkills: () => Promise<void>;
}

/**
 * Vereinfachter Skills Management Hook für Mobile App
 */
export const useSkillsManagement = (
  _userId?: string
): UseSkillsManagementReturn => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSkill = useCallback(async (name: string, level: Skill['level']) => {
    setIsLoading(true);
    try {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name,
        level,
      };
      setSkills(prev => [...prev, newSkill]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add skill');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSkill = useCallback(
    async (id: string, updates: Partial<Skill>) => {
      setIsLoading(true);
      try {
        setSkills(prev =>
          prev.map(skill =>
            skill.id === id ? { ...skill, ...updates } : skill
          )
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update skill');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeSkill = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      setSkills(prev => prev.filter(skill => skill.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove skill');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSkills = useCallback(async () => {
    setIsLoading(true);
    try {
      // Refresh logic here - for now just clear loading
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh skills');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    skills,
    isLoading,
    error,
    addSkill,
    updateSkill,
    removeSkill,
    refreshSkills,
  };
};
