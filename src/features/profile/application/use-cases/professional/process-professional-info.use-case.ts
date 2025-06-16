/**
 * @fileoverview Process Professional Info Use Case - Enterprise Business Logic
 * 
 * ✅ ENTERPRISE USE CASE:
 * - Professional Data Processing & Validation
 * - Experience Level Business Rules
 * - Work Location Processing Logic
 * - Availability Status Management
 * - Skills Validation & Categorization
 * - GDPR Compliance for Professional Data
 * 
 * @module ProcessProfessionalInfoUseCase
 * @since 1.0.0
 * @architecture Clean Architecture - Application Layer
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('ProcessProfessionalInfoUseCase');

// =============================================================================
// DOMAIN TYPES & INTERFACES
// =============================================================================

export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
export type WorkLocation = 'remote' | 'onsite' | 'hybrid';
export type SkillCategory = 'technical' | 'soft' | 'language' | 'certification' | 'other';

export interface ProfessionalInfo {
  jobTitle?: string;
  company?: string;
  industry?: string;
  experience?: ExperienceLevel;
  workLocation?: WorkLocation;
  availableForWork?: boolean;
  skills?: string[];
  custom?: Record<string, any>;
  lastUpdated?: Date;
  isPublic?: boolean;
}

export interface ProcessedProfessionalInfo extends ProfessionalInfo {
  hasJobInfo: boolean;
  hasSkills: boolean;
  hasCustomFields: boolean;
  isEmpty: boolean;
  skillsCount: number;
  experienceYears?: number;
  skillCategories: Record<SkillCategory, string[]>;
  validationScore: number;
  gdprCompliant: boolean;
}

export interface ProfessionalInfoValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  completenessScore: number;
}

export interface ExperienceLevelInfo {
  level: ExperienceLevel;
  color: string;
  description: string;
  typicalYears: string;
  responsibilityLevel: 'individual' | 'team' | 'department' | 'organization';
}

export interface WorkLocationInfo {
  location: WorkLocation;
  icon: string;
  description: string;
  benefits: string[];
  challenges: string[];
}

// =============================================================================
// USE CASE INPUT/OUTPUT INTERFACES
// =============================================================================

export interface ProcessProfessionalInfoInput {
  userId: string;
  professionalInfo: ProfessionalInfo;
  validateData?: boolean;
  includeMetadata?: boolean;
}

export interface ProcessProfessionalInfoOutput {
  processedInfo: ProcessedProfessionalInfo;
  validation?: ProfessionalInfoValidation;
  experienceLevelInfo?: ExperienceLevelInfo;
  workLocationInfo?: WorkLocationInfo;
  recommendations: string[];
}

// =============================================================================
// ENTERPRISE BUSINESS RULES & CONSTANTS
// =============================================================================

const EXPERIENCE_LEVEL_CONFIG: Record<ExperienceLevel, ExperienceLevelInfo> = {
  entry: {
    level: 'entry',
    color: '#81C784',
    description: 'Einstiegslevel - Erste Berufserfahrung sammeln',
    typicalYears: '0-1 Jahre',
    responsibilityLevel: 'individual'
  },
  junior: {
    level: 'junior',
    color: '#64B5F6',
    description: 'Junior Level - Grundfertigkeiten entwickeln',
    typicalYears: '1-3 Jahre',
    responsibilityLevel: 'individual'
  },
  mid: {
    level: 'mid',
    color: '#FFB74D',
    description: 'Mid Level - Eigenständig arbeiten',
    typicalYears: '3-6 Jahre',
    responsibilityLevel: 'individual'
  },
  senior: {
    level: 'senior',
    color: '#F06292',
    description: 'Senior Level - Mentoring und Führung',
    typicalYears: '6-10 Jahre',
    responsibilityLevel: 'team'
  },
  lead: {
    level: 'lead',
    color: '#9575CD',
    description: 'Lead Level - Team- und Projektleitung',
    typicalYears: '8-15 Jahre',
    responsibilityLevel: 'department'
  },
  executive: {
    level: 'executive',
    color: '#A1887F',
    description: 'Executive Level - Strategische Führung',
    typicalYears: '15+ Jahre',
    responsibilityLevel: 'organization'
  }
};

const WORK_LOCATION_CONFIG: Record<WorkLocation, WorkLocationInfo> = {
  remote: {
    location: 'remote',
    icon: 'home',
    description: 'Vollständig remote arbeiten',
    benefits: ['Flexibilität', 'Keine Pendelzeit', 'Work-Life-Balance'],
    challenges: ['Kommunikation', 'Team-Collaboration', 'Selbstdisziplin']
  },
  onsite: {
    location: 'onsite',
    icon: 'office-building',
    description: 'Vor Ort im Büro arbeiten',
    benefits: ['Direkter Kontakt', 'Team-Zusammenhalt', 'Klare Grenzen'],
    challenges: ['Pendelzeit', 'Weniger Flexibilität', 'Bürokosten']
  },
  hybrid: {
    location: 'hybrid',
    icon: 'swap-horizontal',
    description: 'Mischung aus Remote und Büro',
    benefits: ['Beste aus beiden Welten', 'Flexibilität', 'Team-Kontakt'],
    challenges: ['Organisation', 'Koordination', 'Equipment-Management']
  }
};

const SKILL_CATEGORIES_PATTERNS: Record<SkillCategory, RegExp[]> = {
  technical: [
    /javascript|typescript|react|vue|angular|node|python|java|kotlin|swift/i,
    /programming|development|coding|software|web|mobile|backend|frontend/i,
    /database|sql|mongodb|firebase|api|rest|graphql/i
  ],
  soft: [
    /communication|leadership|teamwork|management|collaboration/i,
    /problem.solving|critical.thinking|creativity|innovation/i,
    /project.management|scrum|agile|kanban/i
  ],
  language: [
    /english|german|french|spanish|italian|chinese|japanese/i,
    /sprache|language|fluent|native|bilingual/i
  ],
  certification: [
    /certified|zertifikat|aws|google|microsoft|adobe|oracle/i,
    /scrum.master|pmp|prince2|itil|iso/i
  ],
  other: [/.*/] // Catch-all for anything not categorized
};

// =============================================================================
// MAIN USE CASE IMPLEMENTATION
// =============================================================================

export class ProcessProfessionalInfoUseCase {
  /**
   * 🎯 PROCESS PROFESSIONAL INFO - Main entry point
   */
  async processProfessionalInfo(input: ProcessProfessionalInfoInput): Promise<ProcessProfessionalInfoOutput> {
    try {
      logger.info('Processing professional info', LogCategory.BUSINESS, { userId: input.userId });

      // 🔍 BUSINESS LOGIC: Process basic data
      const processedInfo = this.processBasicInfo(input.professionalInfo);

      // 🔍 VALIDATION: Validate if requested
      let validation: ProfessionalInfoValidation | undefined;
      if (input.validateData) {
        validation = this.validateProfessionalInfo(input.professionalInfo);
      }

      // 🔍 METADATA: Get metadata if requested
      let experienceLevelInfo: ExperienceLevelInfo | undefined;
      let workLocationInfo: WorkLocationInfo | undefined;
      
      if (input.includeMetadata) {
        if (input.professionalInfo.experience) {
          experienceLevelInfo = EXPERIENCE_LEVEL_CONFIG[input.professionalInfo.experience];
        }
        if (input.professionalInfo.workLocation) {
          workLocationInfo = WORK_LOCATION_CONFIG[input.professionalInfo.workLocation];
        }
      }

      // 🎯 RECOMMENDATIONS: Generate improvement recommendations
      const recommendations = this.generateRecommendations(processedInfo, validation);

      logger.info('Professional info processed successfully', LogCategory.BUSINESS, { userId: input.userId });

      return {
        processedInfo,
        validation,
        experienceLevelInfo,
        workLocationInfo,
        recommendations
      };
    } catch (error) {
      logger.error('Failed to process professional info', LogCategory.BUSINESS, { userId: input.userId }, error as Error);
      throw new Error('Failed to process professional information');
    }
  }

  // =============================================================================
  // PRIVATE BUSINESS LOGIC METHODS
  // =============================================================================

  /**
   * 🔍 PROCESS BASIC INFO - Core data processing
   */
  private processBasicInfo(info: ProfessionalInfo): ProcessedProfessionalInfo {
    const hasJobInfo = !!(info.jobTitle || info.company || info.industry);
    const hasSkills = !!(info.skills && info.skills.length > 0);
    const hasCustomFields = !!(info.custom && Object.keys(info.custom).length > 0);
    const isEmpty = !hasJobInfo && !hasSkills && !hasCustomFields;
    const skillsCount = info.skills?.length || 0;

    // 🎯 SKILL CATEGORIZATION
    const skillCategories: Record<SkillCategory, string[]> = {
      technical: [],
      soft: [],
      language: [],
      certification: [],
      other: []
    };

    if (info.skills) {
      info.skills.forEach(skill => {
        const category = this.categorizeSkill(skill);
        skillCategories[category].push(skill);
      });
    }

    // 🎯 VALIDATION SCORE CALCULATION
    const validationScore = this.calculateValidationScore(info);

    // 🎯 GDPR COMPLIANCE CHECK
    const gdprCompliant = this.checkGDPRCompliance(info);

    return {
      ...info,
      hasJobInfo,
      hasSkills,
      hasCustomFields,
      isEmpty,
      skillsCount,
      skillCategories,
      validationScore,
      gdprCompliant,
      lastUpdated: new Date()
    };
  }

  /**
   * 🔍 VALIDATE PROFESSIONAL INFO - Enterprise validation
   */
  private validateProfessionalInfo(info: ProfessionalInfo): ProfessionalInfoValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Job Title Validation
    if (info.jobTitle) {
      if (info.jobTitle.length < 2) {
        errors.push('Job title is too short (minimum 2 characters)');
      }
      if (info.jobTitle.length > 100) {
        errors.push('Job title is too long (maximum 100 characters)');
      }
    } else {
      suggestions.push('Add a job title to improve profile completeness');
    }

    // Company Validation
    if (info.company && info.company.length > 100) {
      errors.push('Company name is too long (maximum 100 characters)');
    }

    // Industry Validation
    if (info.industry && info.industry.length > 50) {
      errors.push('Industry name is too long (maximum 50 characters)');
    }

    // Skills Validation
    if (info.skills) {
      if (info.skills.length > 50) {
        warnings.push('Too many skills listed (consider focusing on key skills)');
      }
      info.skills.forEach(skill => {
        if (skill.length > 50) {
          errors.push(`Skill "${skill}" is too long (maximum 50 characters)`);
        }
      });
    } else {
      suggestions.push('Add relevant skills to showcase your expertise');
    }

    // Completeness Score
    let completenessScore = 0;
    if (info.jobTitle) completenessScore += 20;
    if (info.company) completenessScore += 15;
    if (info.industry) completenessScore += 15;
    if (info.experience) completenessScore += 15;
    if (info.workLocation) completenessScore += 10;
    if (info.skills && info.skills.length > 0) completenessScore += 25;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      completenessScore
    };
  }

  /**
   * 🔍 CATEGORIZE SKILL - Smart skill categorization
   */
  private categorizeSkill(skill: string): SkillCategory {
    for (const [category, patterns] of Object.entries(SKILL_CATEGORIES_PATTERNS)) {
      if (category === 'other') continue; // Skip 'other' until the end
      
      for (const pattern of patterns) {
        if (pattern.test(skill)) {
          return category as SkillCategory;
        }
      }
    }
    return 'other';
  }

  /**
   * 🔍 CALCULATE VALIDATION SCORE - Data quality scoring
   */
  private calculateValidationScore(info: ProfessionalInfo): number {
    let score = 0;
    
    // Basic completeness (40 points)
    if (info.jobTitle) score += 10;
    if (info.company) score += 10;
    if (info.industry) score += 10;
    if (info.experience) score += 10;
    
    // Advanced data (30 points)
    if (info.workLocation) score += 10;
    if (info.availableForWork !== undefined) score += 10;
    if (info.skills && info.skills.length > 0) score += 10;
    
    // Data quality (30 points)
    if (info.skills && info.skills.length >= 3) score += 10;
    if (info.skills && info.skills.length <= 20) score += 10;
    if (info.custom && Object.keys(info.custom).length > 0) score += 10;
    
    return Math.min(score, 100);
  }

  /**
   * 🔍 CHECK GDPR COMPLIANCE - Basic compliance check
   */
  private checkGDPRCompliance(_info: ProfessionalInfo): boolean {
    // For now, return true - in real implementation, check against GDPR rules
    // Check for sensitive data, consent requirements, etc.
    return true;
  }

  /**
   * 🔍 GENERATE RECOMMENDATIONS - Improvement suggestions
   */
  private generateRecommendations(
    processedInfo: ProcessedProfessionalInfo, 
    validation?: ProfessionalInfoValidation
  ): string[] {
    const recommendations: string[] = [];
    
    if (processedInfo.validationScore < 50) {
      recommendations.push('Vervollständigen Sie Ihr Profil für bessere Sichtbarkeit');
    }
    
    if (!processedInfo.jobTitle) {
      recommendations.push('Fügen Sie eine Berufsbezeichnung hinzu');
    }
    
    if (processedInfo.skillsCount < 3) {
      recommendations.push('Fügen Sie relevante Fähigkeiten hinzu (mindestens 3 empfohlen)');
    }
    
    if (processedInfo.skillsCount > 20) {
      recommendations.push('Fokussieren Sie sich auf Ihre wichtigsten Fähigkeiten');
    }
    
    if (!processedInfo.experience) {
      recommendations.push('Geben Sie Ihr Erfahrungslevel an');
    }
    
    if (validation && validation.completenessScore < 70) {
      recommendations.push('Profil-Vollständigkeit unter 70% - weitere Informationen hinzufügen');
    }
    
    return recommendations;
  }
} 