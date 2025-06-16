/**
 * ProfessionalProfile Entity - Enterprise Professional Data Management
 * 🚀 ENTERPRISE: Complete Professional Profile, Status Tracking, Experience Analysis
 * ✅ DOMAIN LAYER: Business Rules für Professional Information Management
 */

/**
 * @enum ProfessionalStatus - Current professional activity status
 */
export enum ProfessionalStatus {
  ACTIVELY_SEEKING = 'actively_seeking',
  OPEN_TO_OFFERS = 'open_to_offers',
  CURRENTLY_EMPLOYED = 'currently_employed',
  FREELANCING = 'freelancing',
  BETWEEN_JOBS = 'between_jobs',
  CAREER_BREAK = 'career_break',
  RETIRED = 'retired',
  STUDENT = 'student'
}

/**
 * @enum ExperienceLevel - Professional experience classification
 */
export enum ExperienceLevel {
  ENTRY = 'entry',         // 0-1 years
  JUNIOR = 'junior',       // 1-3 years
  INTERMEDIATE = 'intermediate', // 3-5 years
  SENIOR = 'senior',       // 5-8 years
  LEAD = 'lead',          // 8-12 years
  PRINCIPAL = 'principal', // 12-15 years
  EXECUTIVE = 'executive'  // 15+ years
}

/**
 * @enum WorkLocation - Work location preferences
 */
export enum WorkLocation {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid',
  FLEXIBLE = 'flexible'
}

/**
 * @enum IndustryCategory - Industry classification
 */
export enum IndustryCategory {
  TECHNOLOGY = 'technology',
  FINANCE = 'finance',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  RETAIL = 'retail',
  MANUFACTURING = 'manufacturing',
  CONSULTING = 'consulting',
  MEDIA = 'media',
  GOVERNMENT = 'government',
  NONPROFIT = 'nonprofit',
  STARTUP = 'startup',
  OTHER = 'other'
}

/**
 * @interface ProfessionalContact - Professional contact information
 */
export interface ProfessionalContact {
  readonly email?: string;
  readonly phone?: string;
  readonly linkedin?: string;
  readonly portfolio?: string;
  readonly github?: string;
  readonly website?: string;
  readonly preferredContactMethod: 'email' | 'phone' | 'linkedin';
  readonly contactAvailability: {
    timeZone: string;
    availableHours: string;
    responseTimeExpected: string;
  };
}

/**
 * @interface WorkPreferences - Professional work preferences
 */
export interface WorkPreferences {
  readonly workLocation: WorkLocation[];
  readonly workSchedule: 'full_time' | 'part_time' | 'contract' | 'flexible';
  readonly remoteWorkPercentage: number; // 0-100
  readonly travelWillingness: number; // 0-100
  readonly startAvailability: Date;
  readonly salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  readonly benefits: string[];
  readonly workCulture: string[];
}

/**
 * @interface EmploymentHistory - Professional employment record
 */
export interface EmploymentHistory {
  readonly id: string;
  readonly company: string;
  readonly position: string;
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly isCurrent: boolean;
  readonly description: string;
  readonly achievements: string[];
  readonly skills: string[];
  readonly industry: IndustryCategory;
  readonly companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  readonly verificationStatus: 'verified' | 'pending' | 'unverified';
}

/**
 * @interface ProfessionalSummary - Generated professional highlights
 */
export interface ProfessionalSummary {
  readonly elevator_pitch: string;
  readonly key_strengths: string[];
  readonly unique_value_proposition: string;
  readonly career_highlights: string[];
  readonly professional_keywords: string[];
  readonly generated_at: Date;
  readonly confidence_score: number; // 0-100
}

/**
 * @interface ProfessionalMetrics - Professional performance indicators
 */
export interface ProfessionalMetrics {
  readonly profile_completeness: number; // 0-100
  readonly market_visibility: number; // 0-100
  readonly professional_activity: number; // 0-100
  readonly network_strength: number; // 0-100
  readonly skill_relevance: number; // 0-100
  readonly career_progression_velocity: number; // 0-100
  readonly last_calculated: Date;
}

/**
 * @interface ProfessionalGoals - Career goals and aspirations
 */
export interface ProfessionalGoals {
  readonly short_term: string[]; // 6-12 months
  readonly medium_term: string[]; // 1-3 years
  readonly long_term: string[]; // 3-5+ years
  readonly priority_areas: string[];
  readonly learning_objectives: string[];
  readonly career_change_interest: boolean;
  readonly target_roles: string[];
  readonly target_companies: string[];
  readonly target_industries: IndustryCategory[];
}

/**
 * @class ProfessionalProfile - Enterprise Professional Data Management
 */
export class ProfessionalProfile {
  private readonly _userId: string;
  private _professionalStatus: ProfessionalStatus;
  private _experienceLevel: ExperienceLevel;
  private _currentPosition?: string;
  private _currentCompany?: string;
  private _industry: IndustryCategory;
  private _yearsOfExperience: number;
  private _contact: ProfessionalContact;
  private _workPreferences: WorkPreferences;
  private _employmentHistory: EmploymentHistory[];
  private _summary: ProfessionalSummary;
  private _metrics: ProfessionalMetrics;
  private _goals: ProfessionalGoals;
  private _isPublic: boolean;
  private _isVerified: boolean;
  private readonly _createdAt: Date;
  private _lastUpdated: Date;

  constructor(config: {
    userId: string;
    professionalStatus?: ProfessionalStatus;
    experienceLevel?: ExperienceLevel;
    currentPosition?: string;
    currentCompany?: string;
    industry?: IndustryCategory;
    yearsOfExperience?: number;
  }) {
    this._userId = config.userId;
    this._professionalStatus = config.professionalStatus || ProfessionalStatus.CURRENTLY_EMPLOYED;
    this._experienceLevel = config.experienceLevel || ExperienceLevel.INTERMEDIATE;
    this._currentPosition = config.currentPosition;
    this._currentCompany = config.currentCompany;
    this._industry = config.industry || IndustryCategory.TECHNOLOGY;
    this._yearsOfExperience = config.yearsOfExperience || 0;
    this._createdAt = new Date();
    this._lastUpdated = new Date();
    this._isPublic = true;
    this._isVerified = false;
    this._employmentHistory = [];

    // Initialize default contact
    this._contact = {
      preferredContactMethod: 'email',
      contactAvailability: {
        timeZone: 'UTC',
        availableHours: '9:00-17:00',
        responseTimeExpected: '24 hours'
      }
    };

    // Initialize default work preferences
    this._workPreferences = {
      workLocation: [WorkLocation.HYBRID],
      workSchedule: 'full_time',
      remoteWorkPercentage: 50,
      travelWillingness: 25,
      startAvailability: new Date(),
      benefits: [],
      workCulture: []
    };

    // Initialize default summary
    this._summary = {
      elevator_pitch: '',
      key_strengths: [],
      unique_value_proposition: '',
      career_highlights: [],
      professional_keywords: [],
      generated_at: new Date(),
      confidence_score: 0
    };

    // Initialize default metrics
    this._metrics = {
      profile_completeness: this.calculateProfileCompleteness(),
      market_visibility: 50,
      professional_activity: 50,
      network_strength: 50,
      skill_relevance: 50,
      career_progression_velocity: 50,
      last_calculated: new Date()
    };

    // Initialize default goals
    this._goals = {
      short_term: [],
      medium_term: [],
      long_term: [],
      priority_areas: [],
      learning_objectives: [],
      career_change_interest: false,
      target_roles: [],
      target_companies: [],
      target_industries: []
    };
  }

  // Getters
  get userId(): string { return this._userId; }
  get professionalStatus(): ProfessionalStatus { return this._professionalStatus; }
  get experienceLevel(): ExperienceLevel { return this._experienceLevel; }
  get currentPosition(): string | undefined { return this._currentPosition; }
  get currentCompany(): string | undefined { return this._currentCompany; }
  get industry(): IndustryCategory { return this._industry; }
  get yearsOfExperience(): number { return this._yearsOfExperience; }
  get contact(): ProfessionalContact { return { ...this._contact }; }
  get workPreferences(): WorkPreferences { return { ...this._workPreferences }; }
  get employmentHistory(): EmploymentHistory[] { return [...this._employmentHistory]; }
  get summary(): ProfessionalSummary { return { ...this._summary }; }
  get metrics(): ProfessionalMetrics { return { ...this._metrics }; }
  get goals(): ProfessionalGoals { return { ...this._goals }; }
  get isPublic(): boolean { return this._isPublic; }
  get isVerified(): boolean { return this._isVerified; }
  get createdAt(): Date { return this._createdAt; }
  get lastUpdated(): Date { return this._lastUpdated; }

  // Business Logic Methods

  /**
   * Updates professional status and handles related changes
   */
  updateProfessionalStatus(status: ProfessionalStatus): void {
    this._professionalStatus = status;
    this._lastUpdated = new Date();
    
    // Update availability based on status
    if (status === ProfessionalStatus.ACTIVELY_SEEKING) {
      // Create new work preferences with updated startAvailability
      this._workPreferences = {
        ...this._workPreferences,
        startAvailability: new Date()
      };
    } else if (status === ProfessionalStatus.CURRENTLY_EMPLOYED) {
      // Extend availability by 2 weeks notice period
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
              // Create new work preferences with updated startAvailability
        this._workPreferences = {
          ...this._workPreferences,
          startAvailability: futureDate
        };
    }
    
    this.recalculateMetrics();
  }

  /**
   * Updates experience level and adjusts related data
   */
  updateExperienceLevel(level: ExperienceLevel, yearsOfExperience?: number): void {
    this._experienceLevel = level;
    
    if (yearsOfExperience !== undefined) {
      this._yearsOfExperience = yearsOfExperience;
    }
    
    this._lastUpdated = new Date();
    this.recalculateMetrics();
  }

  /**
   * Updates current employment information
   */
  updateCurrentEmployment(position: string, company: string, industry?: IndustryCategory): void {
    this._currentPosition = position;
    this._currentCompany = company;
    
    if (industry) {
      this._industry = industry;
    }
    
    this._lastUpdated = new Date();
    this.generateProfessionalSummary();
    this.recalculateMetrics();
  }

  /**
   * Adds new employment to history
   */
  addEmploymentHistory(employment: Omit<EmploymentHistory, 'id'>): string {
    const id = `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newEmployment: EmploymentHistory = {
      ...employment,
      id
    };
    
    this._employmentHistory.push(newEmployment);
    this._lastUpdated = new Date();
    
    // Update experience level based on total experience
    this.updateExperienceLevelFromHistory();
    this.generateProfessionalSummary();
    this.recalculateMetrics();
    
    return id;
  }

  /**
   * Updates employment record
   */
  updateEmploymentHistory(employmentId: string, updates: Partial<Omit<EmploymentHistory, 'id'>>): boolean {
    const index = this._employmentHistory.findIndex(emp => emp.id === employmentId);
    
    if (index !== -1) {
      this._employmentHistory[index] = {
        ...this._employmentHistory[index],
        ...updates
      };
      
      this._lastUpdated = new Date();
      this.updateExperienceLevelFromHistory();
      this.generateProfessionalSummary();
      this.recalculateMetrics();
      
      return true;
    }
    
    return false;
  }

  /**
   * Removes employment from history
   */
  removeEmploymentHistory(employmentId: string): boolean {
    const index = this._employmentHistory.findIndex(emp => emp.id === employmentId);
    
    if (index !== -1) {
      this._employmentHistory.splice(index, 1);
      this._lastUpdated = new Date();
      this.updateExperienceLevelFromHistory();
      this.recalculateMetrics();
      return true;
    }
    
    return false;
  }

  /**
   * Updates contact information
   */
  updateContact(contact: Partial<ProfessionalContact>): void {
    this._contact = { ...this._contact, ...contact };
    this._lastUpdated = new Date();
    this.recalculateMetrics();
  }

  /**
   * Updates work preferences
   */
  updateWorkPreferences(preferences: Partial<WorkPreferences>): void {
    this._workPreferences = { ...this._workPreferences, ...preferences };
    this._lastUpdated = new Date();
    this.recalculateMetrics();
  }

  /**
   * Updates professional goals
   */
  updateGoals(goals: Partial<ProfessionalGoals>): void {
    this._goals = { ...this._goals, ...goals };
    this._lastUpdated = new Date();
    this.recalculateMetrics();
  }

  /**
   * Generates professional summary using AI-like logic
   */
  generateProfessionalSummary(): void {
    const keyStrengths: string[] = [];
    const careerHighlights: string[] = [];
    const keywords: string[] = [];
    
    // Extract strengths from employment history
    this._employmentHistory.forEach(emp => {
      if (emp.achievements.length > 0) {
        careerHighlights.push(`${emp.achievements[0]} at ${emp.company}`);
      }
      keywords.push(...emp.skills);
    });
    
    // Add experience level as strength
    keyStrengths.push(`${this.getExperienceLevelDescription()} professional`);
    
    // Add industry expertise
    keyStrengths.push(`${this._industry} industry expertise`);
    
    // Generate elevator pitch
    const elevatorPitch = this.generateElevatorPitch();
    
    // Generate unique value proposition
    const uvp = this.generateUniqueValueProposition();
    
    this._summary = {
      elevator_pitch: elevatorPitch,
      key_strengths: keyStrengths,
      unique_value_proposition: uvp,
      career_highlights: careerHighlights.slice(0, 5),
      professional_keywords: [...new Set(keywords)].slice(0, 20),
      generated_at: new Date(),
      confidence_score: this.calculateSummaryConfidence()
    };
  }

  /**
   * Recalculates all professional metrics
   */
  recalculateMetrics(): void {
    this._metrics = {
      profile_completeness: this.calculateProfileCompleteness(),
      market_visibility: this.calculateMarketVisibility(),
      professional_activity: this.calculateProfessionalActivity(),
      network_strength: this.calculateNetworkStrength(),
      skill_relevance: this.calculateSkillRelevance(),
      career_progression_velocity: this.calculateCareerVelocity(),
      last_calculated: new Date()
    };
  }

  /**
   * Checks if profile meets professional standards
   */
  meetsQualityStandards(): boolean {
    return this._metrics.profile_completeness >= 80 &&
           this._summary.confidence_score >= 70 &&
           this._employmentHistory.length > 0;
  }

  /**
   * Gets recommendations for profile improvement
   */
  getImprovementRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this._metrics.profile_completeness < 80) {
      recommendations.push('Complete your professional profile to increase visibility');
    }
    
    if (!this._contact.linkedin) {
      recommendations.push('Add LinkedIn profile to improve networking opportunities');
    }
    
    if (!this._contact.portfolio && this._industry === IndustryCategory.TECHNOLOGY) {
      recommendations.push('Add portfolio website to showcase your work');
    }
    
    if (this._employmentHistory.length === 0) {
      recommendations.push('Add employment history to build credibility');
    }
    
    if (this._goals.short_term.length === 0) {
      recommendations.push('Set short-term career goals to focus your development');
    }
    
    return recommendations;
  }

  // Private helper methods
  private calculateProfileCompleteness(): number {
    let completeness = 0;
    const totalFields = 15;
    
    if (this._currentPosition) completeness += 1;
    if (this._currentCompany) completeness += 1;
    if (this._contact.email) completeness += 1;
    if (this._contact.linkedin) completeness += 1;
    if (this._contact.portfolio) completeness += 1;
    if (this._workPreferences.salaryExpectation) completeness += 1;
    if (this._employmentHistory.length > 0) completeness += 2;
    if (this._goals.short_term.length > 0) completeness += 1;
    if (this._goals.medium_term.length > 0) completeness += 1;
    if (this._goals.learning_objectives.length > 0) completeness += 1;
    if (this._summary.elevator_pitch) completeness += 2;
    if (this._yearsOfExperience > 0) completeness += 1;
    if (this._workPreferences.benefits.length > 0) completeness += 1;
    
    return Math.round((completeness / totalFields) * 100);
  }

  private calculateMarketVisibility(): number {
    let visibility = 50; // Base score
    
    if (this._isPublic) visibility += 20;
    if (this._isVerified) visibility += 15;
    if (this._contact.linkedin) visibility += 10;
    if (this._contact.portfolio) visibility += 10;
    if (this._summary.confidence_score > 70) visibility += 15;
    
    return Math.min(100, visibility);
  }

  private calculateProfessionalActivity(): number {
    const daysSinceUpdate = (Date.now() - this._lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 100 - (daysSinceUpdate * 2));
    
    let activityScore = recencyScore * 0.7;
    
    if (this._professionalStatus === ProfessionalStatus.ACTIVELY_SEEKING) {
      activityScore += 30;
    } else if (this._professionalStatus === ProfessionalStatus.OPEN_TO_OFFERS) {
      activityScore += 20;
    }
    
    return Math.min(100, Math.round(activityScore));
  }

  private calculateNetworkStrength(): number {
    // Mock calculation - would integrate with actual network data
    let networkScore = 50;
    
    if (this._contact.linkedin) networkScore += 25;
    if (this._employmentHistory.length > 2) networkScore += 15;
    if (this._isVerified) networkScore += 10;
    
    return Math.min(100, networkScore);
  }

  private calculateSkillRelevance(): number {
    // Mock calculation - would integrate with market demand data
    let relevanceScore = 50;
    
    const totalSkills = this._employmentHistory.reduce((total, emp) => total + emp.skills.length, 0);
    if (totalSkills > 10) relevanceScore += 20;
    if (totalSkills > 20) relevanceScore += 15;
    
    return Math.min(100, relevanceScore);
  }

  private calculateCareerVelocity(): number {
    if (this._employmentHistory.length < 2) return 50;
    
    const sortedJobs = this._employmentHistory.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const careerSpan = sortedJobs[sortedJobs.length - 1].startDate.getTime() - sortedJobs[0].startDate.getTime();
    const yearsSpan = careerSpan / (1000 * 60 * 60 * 24 * 365);
    
    if (yearsSpan === 0) return 50;
    
    const jobsPerYear = this._employmentHistory.length / yearsSpan;
    const velocityScore = Math.min(100, jobsPerYear * 30 + 40);
    
    return Math.round(velocityScore);
  }

  private updateExperienceLevelFromHistory(): void {
    const totalExperience = this.calculateTotalExperience();
    this._yearsOfExperience = totalExperience;
    
    if (totalExperience < 1) {
      this._experienceLevel = ExperienceLevel.ENTRY;
    } else if (totalExperience < 3) {
      this._experienceLevel = ExperienceLevel.JUNIOR;
    } else if (totalExperience < 5) {
      this._experienceLevel = ExperienceLevel.INTERMEDIATE;
    } else if (totalExperience < 8) {
      this._experienceLevel = ExperienceLevel.SENIOR;
    } else if (totalExperience < 12) {
      this._experienceLevel = ExperienceLevel.LEAD;
    } else if (totalExperience < 15) {
      this._experienceLevel = ExperienceLevel.PRINCIPAL;
    } else {
      this._experienceLevel = ExperienceLevel.EXECUTIVE;
    }
  }

  private calculateTotalExperience(): number {
    let totalMonths = 0;
    
    for (const employment of this._employmentHistory) {
      const endDate = employment.endDate || new Date();
      const months = (endDate.getTime() - employment.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      totalMonths += months;
    }
    
    return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
  }

  private getExperienceLevelDescription(): string {
    const descriptions = {
      [ExperienceLevel.ENTRY]: 'Entry-level',
      [ExperienceLevel.JUNIOR]: 'Junior',
      [ExperienceLevel.INTERMEDIATE]: 'Mid-level',
      [ExperienceLevel.SENIOR]: 'Senior',
      [ExperienceLevel.LEAD]: 'Lead',
      [ExperienceLevel.PRINCIPAL]: 'Principal',
      [ExperienceLevel.EXECUTIVE]: 'Executive'
    };
    
    return descriptions[this._experienceLevel];
  }

  private generateElevatorPitch(): string {
    const experience = this.getExperienceLevelDescription();
    const position = this._currentPosition || 'professional';
    const industry = this._industry;
    const years = this._yearsOfExperience;
    
    return `${experience} ${position} with ${years} years of experience in ${industry}`;
  }

  private generateUniqueValueProposition(): string {
    const strengths = this._summary.key_strengths.slice(0, 3).join(', ');
    return `Combining ${strengths} to deliver exceptional results`;
  }

  private calculateSummaryConfidence(): number {
    let confidence = 40; // Base confidence
    
    if (this._currentPosition) confidence += 15;
    if (this._employmentHistory.length > 0) confidence += 15;
    if (this._employmentHistory.length > 2) confidence += 10;
    if (this._yearsOfExperience > 0) confidence += 10;
    if (this._summary.key_strengths.length > 2) confidence += 10;
    
    return Math.min(100, confidence);
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      userId: this._userId,
      professionalStatus: this._professionalStatus,
      experienceLevel: this._experienceLevel,
      currentPosition: this._currentPosition,
      currentCompany: this._currentCompany,
      industry: this._industry,
      yearsOfExperience: this._yearsOfExperience,
      contact: this._contact,
      workPreferences: this._workPreferences,
      employmentHistory: this._employmentHistory,
      summary: this._summary,
      metrics: this._metrics,
      goals: this._goals,
      isPublic: this._isPublic,
      isVerified: this._isVerified,
      createdAt: this._createdAt.toISOString(),
      lastUpdated: this._lastUpdated.toISOString()
    };
  }

  static fromJSON(data: any): ProfessionalProfile {
    const profile = new ProfessionalProfile({
      userId: data.userId,
      professionalStatus: data.professionalStatus,
      experienceLevel: data.experienceLevel,
      currentPosition: data.currentPosition,
      currentCompany: data.currentCompany,
      industry: data.industry,
      yearsOfExperience: data.yearsOfExperience
    });
    
    if (data.contact) profile._contact = data.contact;
    if (data.workPreferences) profile._workPreferences = data.workPreferences;
    if (data.employmentHistory) profile._employmentHistory = data.employmentHistory;
    if (data.summary) profile._summary = data.summary;
    if (data.metrics) profile._metrics = data.metrics;
    if (data.goals) profile._goals = data.goals;
    if (data.isPublic !== undefined) profile._isPublic = data.isPublic;
    if (data.isVerified !== undefined) profile._isVerified = data.isVerified;
    if (data.lastUpdated) profile._lastUpdated = new Date(data.lastUpdated);
    
    return profile;
  }
}

export const createProfessionalProfile = (config: {
  userId: string;
  professionalStatus?: ProfessionalStatus;
  experienceLevel?: ExperienceLevel;
  currentPosition?: string;
  currentCompany?: string;
  industry?: IndustryCategory;
  yearsOfExperience?: number;
}): ProfessionalProfile => {
  return new ProfessionalProfile(config);
}; 