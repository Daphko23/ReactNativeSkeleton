/**
 * CareerProgression Entity - Enterprise Career Tracking & Goal Management
 * 🚀 ENTERPRISE: Career Milestones, Growth Analysis, Achievement Tracking
 * ✅ DOMAIN LAYER: Business Rules für Career Advancement Intelligence
 */

/**
 * @enum CareerMilestoneType - Types of career achievements
 */
export enum CareerMilestoneType {
  PROMOTION = 'promotion',
  ROLE_CHANGE = 'role_change',
  SKILL_MASTERY = 'skill_mastery',
  CERTIFICATION = 'certification',
  PROJECT_SUCCESS = 'project_success',
  LEADERSHIP_ROLE = 'leadership_role',
  INDUSTRY_SWITCH = 'industry_switch',
  SALARY_INCREASE = 'salary_increase',
  TEAM_EXPANSION = 'team_expansion',
  AWARD_RECOGNITION = 'award_recognition'
}

/**
 * @enum GoalCategory - Career goal classifications
 */
export enum GoalCategory {
  SKILL_DEVELOPMENT = 'skill_development',
  CAREER_ADVANCEMENT = 'career_advancement',
  COMPENSATION = 'compensation',
  LEADERSHIP = 'leadership',
  WORK_LIFE_BALANCE = 'work_life_balance',
  INDUSTRY_EXPERTISE = 'industry_expertise',
  NETWORKING = 'networking',
  ENTREPRENEURSHIP = 'entrepreneurship'
}

/**
 * @enum GoalPriority - Goal importance levels
 */
export enum GoalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * @enum GoalStatus - Goal completion status
 */
export enum GoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

/**
 * @interface CareerMilestone - Individual career achievement
 */
export interface CareerMilestone {
  readonly id: string;
  readonly type: CareerMilestoneType;
  readonly title: string;
  readonly description: string;
  readonly achievedDate: Date;
  readonly company?: string;
  readonly role?: string;
  readonly impact: string;
  readonly skillsGained: string[];
  readonly quantifiableResults?: {
    metric: string;
    value: number;
    unit: string;
  }[];
  readonly verification?: {
    verified: boolean;
    verifiedBy?: string;
    verificationDate?: Date;
  };
  readonly visibility: 'public' | 'connections' | 'private';
  readonly tags: string[];
}

/**
 * @interface CareerGoal - Professional objective
 */
export interface CareerGoal {
  readonly id: string;
  readonly category: GoalCategory;
  readonly priority: GoalPriority;
  readonly status: GoalStatus;
  readonly title: string;
  readonly description: string;
  readonly targetDate: Date;
  readonly createdDate: Date;
  readonly lastUpdated: Date;
  readonly milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
    completedDate?: Date;
    progress: number; // 0-100
  }>;
  readonly successMetrics: Array<{
    metric: string;
    target: number;
    current: number;
    unit: string;
  }>;
  readonly requiredSkills: string[];
  readonly estimatedTimeframe: number; // months
  readonly progressNotes: Array<{
    date: Date;
    note: string;
    progress: number;
  }>;
  readonly linkedOpportunities: string[];
}

/**
 * @interface CareerTrajectory - Career path analysis
 */
export interface CareerTrajectory {
  readonly currentLevel: string;
  readonly nextLevel: string;
  readonly expectedPromotionTimeframe: number; // months
  readonly promotionProbability: number; // 0-100
  readonly careerVelocity: number; // career moves per year
  readonly salaryGrowthRate: number; // percentage per year
  readonly skillDevelopmentRate: number; // skills gained per year
  readonly leadershipProgression: number; // 0-100 leadership score
  readonly industryRelevance: number; // 0-100 industry alignment
  readonly marketValue: number; // 0-100 market desirability
  readonly careerRisk: number; // 0-100 career risk score
  readonly recommendations: string[];
}

/**
 * @interface Achievement - Professional accomplishment
 */
export interface Achievement {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly date: Date;
  readonly impact: 'low' | 'medium' | 'high' | 'exceptional';
  readonly quantifiableResults: {
    revenue?: number;
    savings?: number;
    efficiency?: number;
    teamSize?: number;
    projectDuration?: number;
    customerSatisfaction?: number;
  };
  readonly skillsUtilized: string[];
  readonly recognition?: {
    type: string;
    by: string;
    date: Date;
  };
  readonly mediaEvidence?: string[];
  readonly verificationStatus: 'unverified' | 'self_verified' | 'peer_verified' | 'company_verified';
}

/**
 * @interface CareerInsight - Career intelligence and recommendations
 */
export interface CareerInsight {
  readonly type: 'opportunity' | 'risk' | 'trend' | 'recommendation' | 'milestone';
  readonly title: string;
  readonly description: string;
  readonly importance: 'low' | 'medium' | 'high' | 'critical';
  readonly actionable: boolean;
  readonly suggestedActions: string[];
  readonly timeline: string;
  readonly confidence: number; // 0-100
  readonly source: string;
  readonly generatedDate: Date;
  readonly relatedGoals: string[];
  readonly impact: {
    salary?: number;
    advancement?: number;
    satisfaction?: number;
    marketValue?: number;
  };
}

/**
 * @interface CareerMetrics - Quantified career performance
 */
export interface CareerMetrics {
  readonly totalExperienceYears: number;
  readonly totalCompanies: number;
  readonly averageTenure: number; // months
  readonly promotionFrequency: number; // promotions per year
  readonly skillAcquisitionRate: number; // skills per year
  readonly goalCompletionRate: number; // percentage
  readonly careerGrowthScore: number; // 0-100
  readonly leadershipScore: number; // 0-100
  readonly innovationScore: number; // 0-100
  readonly collaborationScore: number; // 0-100
  readonly adaptabilityScore: number; // 0-100
  readonly marketDemandScore: number; // 0-100
  readonly overallCareerHealth: number; // 0-100
  readonly lastCalculated: Date;
}

/**
 * @class CareerProgression - Enterprise Career Tracking & Intelligence
 */
export class CareerProgression {
  private readonly _userId: string;
  private _milestones: Map<string, CareerMilestone> = new Map();
  private _goals: Map<string, CareerGoal> = new Map();
  private _achievements: Map<string, Achievement> = new Map();
  private _trajectory: CareerTrajectory;
  private _insights: CareerInsight[] = [];
  private _metrics: CareerMetrics;
  private _careerStartDate: Date;
  private _lastAnalysisDate: Date;
  private readonly _createdAt: Date;

  constructor(userId: string, careerStartDate?: Date) {
    this._userId = userId;
    this._careerStartDate = careerStartDate || new Date();
    this._createdAt = new Date();
    this._lastAnalysisDate = new Date();

    // Initialize default trajectory
    this._trajectory = {
      currentLevel: 'Mid-level',
      nextLevel: 'Senior',
      expectedPromotionTimeframe: 18,
      promotionProbability: 65,
      careerVelocity: 0.5,
      salaryGrowthRate: 8,
      skillDevelopmentRate: 3,
      leadershipProgression: 60,
      industryRelevance: 75,
      marketValue: 70,
      careerRisk: 25,
      recommendations: []
    };

    // Initialize default metrics
    this._metrics = {
      totalExperienceYears: this.calculateExperienceYears(),
      totalCompanies: 0,
      averageTenure: 0,
      promotionFrequency: 0,
      skillAcquisitionRate: 0,
      goalCompletionRate: 0,
      careerGrowthScore: 60,
      leadershipScore: 50,
      innovationScore: 50,
      collaborationScore: 50,
      adaptabilityScore: 50,
      marketDemandScore: 70,
      overallCareerHealth: 60,
      lastCalculated: new Date()
    };
  }

  // Getters
  get userId(): string { return this._userId; }
  get milestones(): CareerMilestone[] { return Array.from(this._milestones.values()); }
  get goals(): CareerGoal[] { return Array.from(this._goals.values()); }
  get achievements(): Achievement[] { return Array.from(this._achievements.values()); }
  get trajectory(): CareerTrajectory { return { ...this._trajectory }; }
  get insights(): CareerInsight[] { return [...this._insights]; }
  get metrics(): CareerMetrics { return { ...this._metrics }; }
  get careerStartDate(): Date { return this._careerStartDate; }
  get lastAnalysisDate(): Date { return this._lastAnalysisDate; }

  // Milestone Management

  /**
   * Adds a new career milestone
   */
  addMilestone(milestone: Omit<CareerMilestone, 'id'>): string {
    const id = `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newMilestone: CareerMilestone = {
      ...milestone,
      id
    };
    
    this._milestones.set(id, newMilestone);
    this.recalculateMetrics();
    this.updateTrajectory();
    this.generateInsights();
    
    return id;
  }

  /**
   * Updates an existing milestone
   */
  updateMilestone(milestoneId: string, updates: Partial<Omit<CareerMilestone, 'id'>>): boolean {
    const milestone = this._milestones.get(milestoneId);
    if (milestone) {
      const updatedMilestone: CareerMilestone = {
        ...milestone,
        ...updates
      };
      
      this._milestones.set(milestoneId, updatedMilestone);
      this.recalculateMetrics();
      this.updateTrajectory();
      this.generateInsights();
      
      return true;
    }
    return false;
  }

  /**
   * Removes a milestone
   */
  removeMilestone(milestoneId: string): boolean {
    const removed = this._milestones.delete(milestoneId);
    if (removed) {
      this.recalculateMetrics();
      this.updateTrajectory();
      this.generateInsights();
    }
    return removed;
  }

  // Goal Management

  /**
   * Creates a new career goal
   */
  createGoal(goal: Omit<CareerGoal, 'id' | 'createdDate' | 'lastUpdated' | 'progressNotes'>): string {
    const id = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newGoal: CareerGoal = {
      ...goal,
      id,
      createdDate: new Date(),
      lastUpdated: new Date(),
      progressNotes: []
    };
    
    this._goals.set(id, newGoal);
    this.updateTrajectory();
    this.generateInsights();
    
    return id;
  }

  /**
   * Updates goal progress
   */
  updateGoalProgress(goalId: string, progress: number, note?: string): boolean {
    const goal = this._goals.get(goalId);
    if (goal) {
      const progressNote = {
        date: new Date(),
        note: note || `Progress updated to ${progress}%`,
        progress
      };

      // Update milestones based on progress
      const updatedMilestones = goal.milestones.map(milestone => {
        if (!milestone.completed && progress >= ((milestone.progress || 0) + 25)) {
          return {
            ...milestone,
            completed: true,
            completedDate: new Date()
          };
        }
        return milestone;
      });

      // Determine status based on progress and timeline
      let status = goal.status;
      if (progress === 100) {
        status = GoalStatus.COMPLETED;
      } else if (progress > 0) {
        const timeElapsed = Date.now() - goal.createdDate.getTime();
        const totalTime = goal.targetDate.getTime() - goal.createdDate.getTime();
        const expectedProgress = (timeElapsed / totalTime) * 100;
        
        if (progress >= expectedProgress * 0.9) {
          status = GoalStatus.ON_TRACK;
        } else if (progress >= expectedProgress * 0.7) {
          status = GoalStatus.IN_PROGRESS;
        } else {
          status = GoalStatus.AT_RISK;
        }
      }

      const updatedGoal: CareerGoal = {
        ...goal,
        status,
        lastUpdated: new Date(),
        milestones: updatedMilestones,
        progressNotes: [...goal.progressNotes, progressNote]
      };
      
      this._goals.set(goalId, updatedGoal);
      this.recalculateMetrics();
      this.updateTrajectory();
      this.generateInsights();
      
      return true;
    }
    return false;
  }

  /**
   * Completes a career goal
   */
  completeGoal(goalId: string, completionNote?: string): boolean {
    const goal = this._goals.get(goalId);
    if (goal) {
      const completedGoal: CareerGoal = {
        ...goal,
        status: GoalStatus.COMPLETED,
        lastUpdated: new Date(),
        progressNotes: [
          ...goal.progressNotes,
          {
            date: new Date(),
            note: completionNote || 'Goal completed successfully',
            progress: 100
          }
        ],
        milestones: goal.milestones.map(milestone => ({
          ...milestone,
          completed: true,
          completedDate: milestone.completedDate || new Date()
        }))
      };
      
      this._goals.set(goalId, completedGoal);
      
      // Create achievement milestone
      this.addMilestone({
        type: CareerMilestoneType.PROJECT_SUCCESS,
        title: `Completed: ${goal.title}`,
        description: goal.description,
        achievedDate: new Date(),
        impact: 'Achieved career goal within planned timeframe',
        skillsGained: goal.requiredSkills,
        visibility: 'public',
        tags: ['goal-achievement', goal.category]
      });
      
      this.recalculateMetrics();
      this.updateTrajectory();
      this.generateInsights();
      
      return true;
    }
    return false;
  }

  // Achievement Management

  /**
   * Adds a new achievement
   */
  addAchievement(achievement: Omit<Achievement, 'id'>): string {
    const id = `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newAchievement: Achievement = {
      ...achievement,
      id
    };
    
    this._achievements.set(id, newAchievement);
    this.recalculateMetrics();
    this.updateTrajectory();
    this.generateInsights();
    
    return id;
  }

  // Analysis Methods

  /**
   * Analyzes career progression patterns
   */
  analyzeProgressionPatterns(): {
    patterns: string[];
    strengths: string[];
    improvementAreas: string[];
    riskFactors: string[];
  } {
    const milestones = this.milestones.sort((a, b) => a.achievedDate.getTime() - b.achievedDate.getTime());
    
    const patterns: string[] = [];
    const strengths: string[] = [];
    const improvementAreas: string[] = [];
    const riskFactors: string[] = [];

    // Analyze milestone frequency
    if (milestones.length > 0) {
      const careerSpan = Date.now() - this._careerStartDate.getTime();
      const yearsActive = careerSpan / (1000 * 60 * 60 * 24 * 365);
      const milestoneFrequency = milestones.length / yearsActive;
      
      if (milestoneFrequency > 2) {
        patterns.push('High achievement frequency - fast career progression');
        strengths.push('Consistent milestone achievement');
      } else if (milestoneFrequency < 0.5) {
        patterns.push('Low achievement frequency - may need more aggressive goal setting');
        improvementAreas.push('Increase career milestone frequency');
      }
    }

    // Analyze goal completion rate
    const completedGoals = this.goals.filter(g => g.status === GoalStatus.COMPLETED).length;
    const totalGoals = this.goals.length;
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    
    if (completionRate > 80) {
      strengths.push('Excellent goal execution');
    } else if (completionRate < 50) {
      improvementAreas.push('Improve goal completion rate');
      riskFactors.push('Low goal achievement may impact career advancement');
    }

    // Analyze skill development
    const skillGains = milestones.reduce((total, m) => total + m.skillsGained.length, 0);
    if (skillGains > 20) {
      strengths.push('Strong skill development trajectory');
    } else {
      improvementAreas.push('Accelerate skill acquisition');
    }

    return { patterns, strengths, improvementAreas, riskFactors };
  }

  /**
   * Generates career recommendations
   */
  generateCareerRecommendations(): string[] {
    const recommendations: string[] = [];
    const analysis = this.analyzeProgressionPatterns();
    
    // Based on goal completion rate
    const completedGoals = this.goals.filter(g => g.status === GoalStatus.COMPLETED).length;
    const totalGoals = this.goals.length;
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    
    if (completionRate < 50) {
      recommendations.push('Review and adjust career goals for better achievability');
      recommendations.push('Break down large goals into smaller, manageable milestones');
    }

    // Based on trajectory
    if (this._trajectory.promotionProbability < 60) {
      recommendations.push('Focus on skill development for next-level requirements');
      recommendations.push('Seek feedback from leadership about advancement opportunities');
    }

    // Based on market alignment
    if (this._trajectory.marketValue < 70) {
      recommendations.push('Develop in-demand skills for your industry');
      recommendations.push('Consider certifications to boost market credibility');
    }

    // Based on career risk
    if (this._trajectory.careerRisk > 60) {
      recommendations.push('Diversify skill portfolio to reduce career risk');
      recommendations.push('Build stronger professional network for opportunities');
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  /**
   * Calculates career velocity
   */
  calculateCareerVelocity(): number {
    const careerSpan = Date.now() - this._careerStartDate.getTime();
    const yearsActive = careerSpan / (1000 * 60 * 60 * 24 * 365);
    
    if (yearsActive < 1) return 0;
    
    const promotions = this.milestones.filter(m => m.type === CareerMilestoneType.PROMOTION).length;
    const roleChanges = this.milestones.filter(m => m.type === CareerMilestoneType.ROLE_CHANGE).length;
    
    return (promotions + roleChanges) / yearsActive;
  }

  /**
   * Predicts next career milestone
   */
  predictNextMilestone(): {
    type: CareerMilestoneType;
    probability: number;
    timeframe: string;
    preparation: string[];
  } {
    const recentMilestones = this.milestones
      .filter(m => Date.now() - m.achievedDate.getTime() < 365 * 24 * 60 * 60 * 1000) // Last year
      .sort((a, b) => b.achievedDate.getTime() - a.achievedDate.getTime());

    // Simple prediction logic - would use ML in production
    const lastPromotion = this.milestones
      .filter(m => m.type === CareerMilestoneType.PROMOTION)
      .sort((a, b) => b.achievedDate.getTime() - a.achievedDate.getTime())[0];

    const monthsSinceLastPromotion = lastPromotion 
      ? (Date.now() - lastPromotion.achievedDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      : 24;

    if (monthsSinceLastPromotion > 18) {
      return {
        type: CareerMilestoneType.PROMOTION,
        probability: Math.min(90, this._trajectory.promotionProbability + 20),
        timeframe: '6-12 months',
        preparation: [
          'Complete leadership development program',
          'Demonstrate expanded responsibilities',
          'Seek feedback from current manager'
        ]
      };
    } else {
      return {
        type: CareerMilestoneType.SKILL_MASTERY,
        probability: 75,
        timeframe: '3-6 months',
        preparation: [
          'Complete advanced skill certification',
          'Apply new skills in current projects',
          'Share knowledge with team'
        ]
      };
    }
  }

  // Private helper methods
  private calculateExperienceYears(): number {
    const careerSpan = Date.now() - this._careerStartDate.getTime();
    return Math.round((careerSpan / (1000 * 60 * 60 * 24 * 365)) * 10) / 10;
  }

  private recalculateMetrics(): void {
    const completedGoals = this.goals.filter(g => g.status === GoalStatus.COMPLETED);
    const totalGoals = this.goals.length;
    
    this._metrics = {
      totalExperienceYears: this.calculateExperienceYears(),
      totalCompanies: this.countUniqueCompanies(),
      averageTenure: this.calculateAverageTenure(),
      promotionFrequency: this.calculatePromotionFrequency(),
      skillAcquisitionRate: this.calculateSkillAcquisitionRate(),
      goalCompletionRate: totalGoals > 0 ? (completedGoals.length / totalGoals) * 100 : 0,
      careerGrowthScore: this.calculateCareerGrowthScore(),
      leadershipScore: this.calculateLeadershipScore(),
      innovationScore: this.calculateInnovationScore(),
      collaborationScore: this.calculateCollaborationScore(),
      adaptabilityScore: this.calculateAdaptabilityScore(),
      marketDemandScore: this._trajectory.marketValue,
      overallCareerHealth: this.calculateOverallCareerHealth(),
      lastCalculated: new Date()
    };
  }

  private countUniqueCompanies(): number {
    const companies = new Set(this.milestones.map(m => m.company).filter(Boolean));
    return companies.size;
  }

  private calculateAverageTenure(): number {
    // Mock calculation - would analyze employment history
    return 24; // 24 months average
  }

  private calculatePromotionFrequency(): number {
    const promotions = this.milestones.filter(m => m.type === CareerMilestoneType.PROMOTION).length;
    const yearsActive = this.calculateExperienceYears();
    return yearsActive > 0 ? promotions / yearsActive : 0;
  }

  private calculateSkillAcquisitionRate(): number {
    const skillGains = this.milestones.reduce((total, m) => total + m.skillsGained.length, 0);
    const yearsActive = this.calculateExperienceYears();
    return yearsActive > 0 ? skillGains / yearsActive : 0;
  }

  private calculateCareerGrowthScore(): number {
    let score = 50; // Base score
    
    // Add points for promotions
    const promotions = this.milestones.filter(m => m.type === CareerMilestoneType.PROMOTION).length;
    score += Math.min(30, promotions * 10);
    
    // Add points for skill development
    const skillMilestones = this.milestones.filter(m => m.type === CareerMilestoneType.SKILL_MASTERY).length;
    score += Math.min(20, skillMilestones * 5);
    
    return Math.min(100, score);
  }

  private calculateLeadershipScore(): number {
    let score = 30; // Base score
    
    const leadershipMilestones = this.milestones.filter(m => m.type === CareerMilestoneType.LEADERSHIP_ROLE).length;
    score += Math.min(40, leadershipMilestones * 20);
    
    const teamExpansion = this.milestones.filter(m => m.type === CareerMilestoneType.TEAM_EXPANSION).length;
    score += Math.min(30, teamExpansion * 15);
    
    return Math.min(100, score);
  }

  private calculateInnovationScore(): number {
    let score = 40; // Base score
    
    const projectSuccesses = this.milestones.filter(m => m.type === CareerMilestoneType.PROJECT_SUCCESS).length;
    score += Math.min(40, projectSuccesses * 8);
    
    const awards = this.milestones.filter(m => m.type === CareerMilestoneType.AWARD_RECOGNITION).length;
    score += Math.min(20, awards * 20);
    
    return Math.min(100, score);
  }

  private calculateCollaborationScore(): number {
    // Mock calculation based on team-related achievements
    return Math.min(100, 50 + this.achievements.length * 5);
  }

  private calculateAdaptabilityScore(): number {
    let score = 40; // Base score
    
    const industryChanges = this.milestones.filter(m => m.type === CareerMilestoneType.INDUSTRY_SWITCH).length;
    score += Math.min(30, industryChanges * 30);
    
    const roleChanges = this.milestones.filter(m => m.type === CareerMilestoneType.ROLE_CHANGE).length;
    score += Math.min(30, roleChanges * 10);
    
    return Math.min(100, score);
  }

  private calculateOverallCareerHealth(): number {
    const weights = {
      growth: 0.25,
      leadership: 0.20,
      innovation: 0.15,
      collaboration: 0.15,
      adaptability: 0.15,
      marketDemand: 0.10
    };
    
    return Math.round(
      this._metrics.careerGrowthScore * weights.growth +
      this._metrics.leadershipScore * weights.leadership +
      this._metrics.innovationScore * weights.innovation +
      this._metrics.collaborationScore * weights.collaboration +
      this._metrics.adaptabilityScore * weights.adaptability +
      this._metrics.marketDemandScore * weights.marketDemand
    );
  }

  private updateTrajectory(): void {
    // Update trajectory based on current data
    const promotionProbability = Math.min(100, this._metrics.careerGrowthScore + this._metrics.leadershipScore) / 2;
    const careerVelocity = this.calculateCareerVelocity();
    const recommendations = this.generateCareerRecommendations();
    
    this._trajectory = {
      ...this._trajectory,
      promotionProbability,
      careerVelocity,
      recommendations
    };
  }

  private generateInsights(): void {
    this._insights = [];
    this._lastAnalysisDate = new Date();
    
    // Generate insights based on current career data
    const analysis = this.analyzeProgressionPatterns();
    
    // Add opportunity insights
    if (this._trajectory.promotionProbability > 70) {
      this._insights.push({
        type: 'opportunity',
        title: 'High Promotion Probability',
        description: 'Your career metrics indicate strong potential for advancement',
        importance: 'high',
        actionable: true,
        suggestedActions: ['Schedule career discussion with manager', 'Prepare promotion portfolio'],
        timeline: '3-6 months',
        confidence: this._trajectory.promotionProbability,
        source: 'Career Analysis Engine',
        generatedDate: new Date(),
        relatedGoals: this.goals.filter(g => g.category === GoalCategory.CAREER_ADVANCEMENT).map(g => g.id),
        impact: { advancement: 80, salary: 15 }
      });
    }

    // Add risk insights
    if (analysis.riskFactors.length > 0) {
      this._insights.push({
        type: 'risk',
        title: 'Career Risk Identified',
        description: analysis.riskFactors[0],
        importance: 'medium',
        actionable: true,
        suggestedActions: analysis.improvementAreas,
        timeline: '6-12 months',
        confidence: 70,
        source: 'Risk Assessment',
        generatedDate: new Date(),
        relatedGoals: [],
        impact: { advancement: -20, marketValue: -10 }
      });
    }
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      userId: this._userId,
      milestones: Array.from(this._milestones.entries()),
      goals: Array.from(this._goals.entries()),
      achievements: Array.from(this._achievements.entries()),
      trajectory: this._trajectory,
      insights: this._insights,
      metrics: this._metrics,
      careerStartDate: this._careerStartDate.toISOString(),
      lastAnalysisDate: this._lastAnalysisDate.toISOString(),
      createdAt: this._createdAt.toISOString()
    };
  }

  static fromJSON(data: any): CareerProgression {
    const progression = new CareerProgression(data.userId, data.careerStartDate ? new Date(data.careerStartDate) : undefined);
    
    if (data.milestones) {
      for (const [key, value] of data.milestones) {
        progression._milestones.set(key, value);
      }
    }
    if (data.goals) {
      for (const [key, value] of data.goals) {
        progression._goals.set(key, value);
      }
    }
    if (data.achievements) {
      for (const [key, value] of data.achievements) {
        progression._achievements.set(key, value);
      }
    }
    if (data.trajectory) progression._trajectory = data.trajectory;
    if (data.insights) progression._insights = data.insights;
    if (data.metrics) progression._metrics = data.metrics;
    if (data.lastAnalysisDate) progression._lastAnalysisDate = new Date(data.lastAnalysisDate);
    
    return progression;
  }
}

export const createCareerProgression = (userId: string, careerStartDate?: Date): CareerProgression => {
  return new CareerProgression(userId, careerStartDate);
};