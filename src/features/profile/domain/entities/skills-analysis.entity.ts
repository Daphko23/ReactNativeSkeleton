/**
 * SkillsAnalysis Entity - Enterprise Skills Gap Analysis & Market Intelligence
 * 🚀 ENTERPRISE: Skills Market Value, Gap Analysis, Learning Recommendations
 * ✅ DOMAIN LAYER: Business Rules für Advanced Skills Management
 */

/**
 * @enum SkillCategory - Professional skill classifications
 */
export enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT_SKILLS = 'soft_skills',
  LANGUAGE = 'language',
  CERTIFICATION = 'certification',
  INDUSTRY_SPECIFIC = 'industry_specific',
  MANAGEMENT = 'management',
  CREATIVE = 'creative',
  ANALYTICAL = 'analytical'
}

/**
 * @enum SkillProficiency - Skill competency levels
 */
export enum SkillProficiency {
  BEGINNER = 'beginner',       // 0-25%
  INTERMEDIATE = 'intermediate', // 25-50%
  ADVANCED = 'advanced',       // 50-75%
  EXPERT = 'expert',          // 75-90%
  MASTER = 'master'           // 90-100%
}

/**
 * @enum MarketDemand - Market demand classification
 */
export enum MarketDemand {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  CRITICAL = 'critical'
}

/**
 * @enum SkillTrend - Market trend direction
 */
export enum SkillTrend {
  DECLINING = 'declining',
  STABLE = 'stable',
  GROWING = 'growing',
  EMERGING = 'emerging',
  DISRUPTIVE = 'disruptive'
}

/**
 * @interface SkillMarketData - Market intelligence for skills
 */
export interface SkillMarketData {
  readonly demand: MarketDemand;
  readonly trend: SkillTrend;
  readonly averageSalaryImpact: number; // percentage increase
  readonly jobOpenings: number;
  readonly competitionLevel: number; // 0-100
  readonly geographicHotspots: string[];
  readonly relatedSkills: string[];
  readonly certificationAvailable: boolean;
  readonly lastUpdated: Date;
}

/**
 * @interface SkillAssessment - Individual skill assessment
 */
export interface SkillAssessment {
  readonly skillName: string;
  readonly category: SkillCategory;
  readonly proficiency: SkillProficiency;
  readonly proficiencyScore: number; // 0-100
  readonly yearsOfExperience: number;
  readonly lastUsed: Date;
  readonly verified: boolean;
  readonly endorsements: number;
  readonly marketData: SkillMarketData;
  readonly learningPath?: string[];
  readonly nextLevel?: SkillProficiency;
  readonly timeToNextLevel?: number; // estimated months
}

/**
 * @interface SkillGap - Identified skill deficiency
 */
export interface SkillGap {
  readonly skillName: string;
  readonly category: SkillCategory;
  readonly importance: number; // 0-100
  readonly marketDemand: MarketDemand;
  readonly salaryImpact: number;
  readonly timeToAcquire: number; // estimated months
  readonly learningResources: string[];
  readonly certificationPath?: string;
  readonly relatedRoles: string[];
  readonly priority: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * @interface SkillRecommendation - Personalized skill development suggestion
 */
export interface SkillRecommendation {
  readonly id: string;
  readonly type: 'strengthen' | 'acquire' | 'maintain' | 'pivot';
  readonly skillName: string;
  readonly reason: string;
  readonly impact: 'low' | 'medium' | 'high' | 'transformative';
  readonly effort: 'minimal' | 'moderate' | 'significant' | 'intensive';
  readonly timeline: string;
  readonly learningPath: string[];
  readonly successMetrics: string[];
  readonly roi: number; // estimated return on investment
  readonly confidence: number; // 0-100
}

/**
 * @interface SkillPortfolio - Complete skills portfolio analysis
 */
export interface SkillPortfolio {
  readonly totalSkills: number;
  readonly skillsByCategory: Record<SkillCategory, number>;
  readonly averageProficiency: number;
  readonly portfolioStrength: number; // 0-100
  readonly marketAlignment: number; // 0-100
  readonly diversityScore: number; // 0-100
  readonly futureProofing: number; // 0-100
  readonly competitiveAdvantage: string[];
  readonly improvementAreas: string[];
}

/**
 * @interface LearningPlan - Personalized skill development plan
 */
export interface LearningPlan {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly targetSkills: string[];
  readonly duration: number; // months
  readonly phases: Array<{
    name: string;
    duration: number;
    skills: string[];
    milestones: string[];
    resources: string[];
  }>;
  readonly totalInvestment: number; // estimated cost
  readonly expectedOutcome: string;
  readonly successProbability: number; // 0-100
  readonly createdAt: Date;
}

/**
 * @class SkillsAnalysis - Enterprise Skills Analysis & Intelligence
 */
export class SkillsAnalysis {
  private readonly _userId: string;
  private _skillAssessments: Map<string, SkillAssessment> = new Map();
  private _skillGaps: SkillGap[] = [];
  private _recommendations: SkillRecommendation[] = [];
  private _portfolio: SkillPortfolio;
  private _learningPlans: LearningPlan[] = [];
  private _analysisDate: Date;
  private _lastMarketUpdate: Date;
  private readonly _createdAt: Date;

  constructor(userId: string) {
    this._userId = userId;
    this._createdAt = new Date();
    this._analysisDate = new Date();
    this._lastMarketUpdate = new Date();
    
    // Initialize empty portfolio
    this._portfolio = {
      totalSkills: 0,
      skillsByCategory: {} as Record<SkillCategory, number>,
      averageProficiency: 0,
      portfolioStrength: 0,
      marketAlignment: 0,
      diversityScore: 0,
      futureProofing: 0,
      competitiveAdvantage: [],
      improvementAreas: []
    };
  }

  // Getters
  get userId(): string { return this._userId; }
  get skillAssessments(): SkillAssessment[] { return Array.from(this._skillAssessments.values()); }
  get skillGaps(): SkillGap[] { return [...this._skillGaps]; }
  get recommendations(): SkillRecommendation[] { return [...this._recommendations]; }
  get portfolio(): SkillPortfolio { return { ...this._portfolio }; }
  get learningPlans(): LearningPlan[] { return [...this._learningPlans]; }
  get analysisDate(): Date { return this._analysisDate; }
  get lastMarketUpdate(): Date { return this._lastMarketUpdate; }

  // Skills Management Methods

  /**
   * Adds or updates a skill assessment
   */
  addSkillAssessment(skill: Omit<SkillAssessment, 'marketData'>): void {
    const marketData = this.getMarketDataForSkill(skill.skillName);
    
    const assessment: SkillAssessment = {
      ...skill,
      marketData
    };
    
    this._skillAssessments.set(skill.skillName.toLowerCase(), assessment);
    this.recalculatePortfolio();
    this.updateRecommendations();
  }

  /**
   * Removes a skill assessment
   */
  removeSkillAssessment(skillName: string): boolean {
    const removed = this._skillAssessments.delete(skillName.toLowerCase());
    if (removed) {
      this.recalculatePortfolio();
      this.updateRecommendations();
    }
    return removed;
  }

  /**
   * Updates skill proficiency
   */
  updateSkillProficiency(skillName: string, proficiency: SkillProficiency, score: number): boolean {
    const skill = this._skillAssessments.get(skillName.toLowerCase());
    if (skill) {
      const updatedSkill: SkillAssessment = {
        ...skill,
        proficiency,
        proficiencyScore: score,
        lastUsed: new Date()
      };
      
      this._skillAssessments.set(skillName.toLowerCase(), updatedSkill);
      this.recalculatePortfolio();
      this.updateRecommendations();
      return true;
    }
    return false;
  }

  /**
   * Performs comprehensive skills gap analysis
   */
  performGapAnalysis(targetRole?: string, targetIndustry?: string): SkillGap[] {
    this._skillGaps = [];
    
    // Get market skills requirements for target role/industry
    const requiredSkills = this.getRequiredSkillsForTarget(targetRole, targetIndustry);
    
    for (const requiredSkill of requiredSkills) {
      const currentSkill = this._skillAssessments.get(requiredSkill.name.toLowerCase());
      
      if (!currentSkill || currentSkill.proficiencyScore < requiredSkill.minimumProficiency) {
        const gap: SkillGap = {
          skillName: requiredSkill.name,
          category: requiredSkill.category,
          importance: requiredSkill.importance,
          marketDemand: requiredSkill.marketDemand,
          salaryImpact: requiredSkill.salaryImpact,
          timeToAcquire: this.calculateTimeToAcquire(requiredSkill.name, currentSkill?.proficiencyScore || 0),
          learningResources: this.getLearningResources(requiredSkill.name),
          certificationPath: this.getCertificationPath(requiredSkill.name),
          relatedRoles: requiredSkill.relatedRoles,
          priority: this.calculateGapPriority(requiredSkill)
        };
        
        this._skillGaps.push(gap);
      }
    }
    
    // Sort by priority and impact
    this._skillGaps.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority] || b.salaryImpact - a.salaryImpact;
    });
    
    return this._skillGaps;
  }

  /**
   * Generates personalized skill recommendations
   */
  generateRecommendations(): SkillRecommendation[] {
    this._recommendations = [];
    
    // Strengthen existing high-value skills
    for (const skill of this._skillAssessments.values()) {
      if (skill.marketData.demand === MarketDemand.HIGH || skill.marketData.demand === MarketDemand.CRITICAL) {
        if (skill.proficiencyScore < 80) {
          this._recommendations.push(this.createStrengthRecommendation(skill));
        }
      }
    }
    
    // Acquire missing critical skills
    for (const gap of this._skillGaps.slice(0, 5)) {
      if (gap.priority === 'critical' || gap.priority === 'high') {
        this._recommendations.push(this.createAcquisitionRecommendation(gap));
      }
    }
    
    // Maintain expert-level skills
    for (const skill of this._skillAssessments.values()) {
      if (skill.proficiency === SkillProficiency.EXPERT || skill.proficiency === SkillProficiency.MASTER) {
        if (this.daysSinceLastUsed(skill.lastUsed) > 90) {
          this._recommendations.push(this.createMaintenanceRecommendation(skill));
        }
      }
    }
    
    // Pivot recommendations for declining skills
    for (const skill of this._skillAssessments.values()) {
      if (skill.marketData.trend === SkillTrend.DECLINING) {
        this._recommendations.push(this.createPivotRecommendation(skill));
      }
    }
    
    // Sort by impact and feasibility
    this._recommendations.sort((a, b) => {
      const impactWeight = { transformative: 4, high: 3, medium: 2, low: 1 };
      const effortWeight = { minimal: 4, moderate: 3, significant: 2, intensive: 1 };
      
      const aScore = impactWeight[a.impact] * effortWeight[a.effort];
      const bScore = impactWeight[b.impact] * effortWeight[b.effort];
      
      return bScore - aScore;
    });
    
    return this._recommendations.slice(0, 10); // Top 10 recommendations
  }

  /**
   * Creates a personalized learning plan
   */
  createLearningPlan(
    title: string,
    targetSkills: string[],
    timeframe: number // months
  ): LearningPlan {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Analyze skill dependencies and optimal learning sequence
    const orderedSkills = this.optimizeLearningSequence(targetSkills);
    
    // Create learning phases
    const phases = this.createLearningPhases(orderedSkills, timeframe);
    
    // Calculate investment and outcomes
    const totalInvestment = this.calculateLearningInvestment(targetSkills);
    const successProbability = this.calculateSuccessProbability(targetSkills, timeframe);
    
    const learningPlan: LearningPlan = {
      id: planId,
      title,
      description: `Comprehensive plan to master ${targetSkills.length} skills in ${timeframe} months`,
      targetSkills,
      duration: timeframe,
      phases,
      totalInvestment,
      expectedOutcome: this.generateExpectedOutcome(targetSkills),
      successProbability,
      createdAt: new Date()
    };
    
    this._learningPlans.push(learningPlan);
    return learningPlan;
  }

  /**
   * Gets skill trends and market intelligence
   */
  getSkillMarketIntelligence(skillName: string): SkillMarketData | null {
    const skill = this._skillAssessments.get(skillName.toLowerCase());
    return skill ? skill.marketData : null;
  }

  /**
   * Calculates portfolio strength score
   */
  calculatePortfolioStrength(): number {
    if (this._skillAssessments.size === 0) return 0;
    
    let totalScore = 0;
    let marketWeightedScore = 0;
    
    for (const skill of this._skillAssessments.values()) {
      const skillScore = skill.proficiencyScore;
      const marketMultiplier = this.getMarketMultiplier(skill.marketData.demand);
      
      totalScore += skillScore;
      marketWeightedScore += skillScore * marketMultiplier;
    }
    
    const averageScore = totalScore / this._skillAssessments.size;
    const marketAlignment = marketWeightedScore / (this._skillAssessments.size * 100);
    
    return Math.round((averageScore * 0.6 + marketAlignment * 0.4));
  }

  // Private helper methods
  private getMarketDataForSkill(skillName: string): SkillMarketData {
    // Mock market data - would integrate with real market intelligence APIs
    const mockData: Record<string, Partial<SkillMarketData>> = {
      'javascript': { demand: MarketDemand.HIGH, trend: SkillTrend.STABLE, averageSalaryImpact: 15 },
      'react': { demand: MarketDemand.VERY_HIGH, trend: SkillTrend.GROWING, averageSalaryImpact: 20 },
      'python': { demand: MarketDemand.VERY_HIGH, trend: SkillTrend.GROWING, averageSalaryImpact: 25 },
      'ai': { demand: MarketDemand.CRITICAL, trend: SkillTrend.DISRUPTIVE, averageSalaryImpact: 40 },
      'leadership': { demand: MarketDemand.HIGH, trend: SkillTrend.STABLE, averageSalaryImpact: 30 }
    };
    
    const skillData = mockData[skillName.toLowerCase()] || {};
    
    return {
      demand: skillData.demand || MarketDemand.MEDIUM,
      trend: skillData.trend || SkillTrend.STABLE,
      averageSalaryImpact: skillData.averageSalaryImpact || 10,
      jobOpenings: Math.floor(Math.random() * 10000) + 1000,
      competitionLevel: Math.floor(Math.random() * 50) + 50,
      geographicHotspots: ['San Francisco', 'New York', 'London'],
      relatedSkills: this.getRelatedSkills(skillName),
      certificationAvailable: Math.random() > 0.5,
      lastUpdated: new Date()
    };
  }

  private getRelatedSkills(skillName: string): string[] {
    const relatedSkillsMap: Record<string, string[]> = {
      'javascript': ['React', 'Node.js', 'TypeScript'],
      'react': ['JavaScript', 'Redux', 'Next.js'],
      'python': ['Django', 'Flask', 'Machine Learning'],
      'leadership': ['Management', 'Communication', 'Strategic Planning']
    };
    
    return relatedSkillsMap[skillName.toLowerCase()] || [];
  }

  private getRequiredSkillsForTarget(targetRole?: string, targetIndustry?: string): Array<{
    name: string;
    category: SkillCategory;
    importance: number;
    minimumProficiency: number;
    marketDemand: MarketDemand;
    salaryImpact: number;
    relatedRoles: string[];
  }> {
    // Mock required skills - would integrate with job market APIs
    return [
      {
        name: 'JavaScript',
        category: SkillCategory.TECHNICAL,
        importance: 90,
        minimumProficiency: 70,
        marketDemand: MarketDemand.HIGH,
        salaryImpact: 15,
        relatedRoles: ['Frontend Developer', 'Full Stack Developer']
      },
      {
        name: 'React',
        category: SkillCategory.TECHNICAL,
        importance: 85,
        minimumProficiency: 60,
        marketDemand: MarketDemand.VERY_HIGH,
        salaryImpact: 20,
        relatedRoles: ['React Developer', 'Frontend Developer']
      }
    ];
  }

  private calculateTimeToAcquire(skillName: string, currentProficiency: number): number {
    const baseTime = 6; // 6 months base
    const proficiencyFactor = Math.max(0.1, (100 - currentProficiency) / 100);
    const complexityFactor = this.getSkillComplexity(skillName);
    
    return Math.round(baseTime * proficiencyFactor * complexityFactor);
  }

  private getSkillComplexity(skillName: string): number {
    const complexityMap: Record<string, number> = {
      'javascript': 1.2,
      'react': 1.0,
      'ai': 2.0,
      'leadership': 1.5,
      'communication': 0.8
    };
    
    return complexityMap[skillName.toLowerCase()] || 1.0;
  }

  private getLearningResources(skillName: string): string[] {
    return [
      'Online Courses',
      'Documentation',
      'Practice Projects',
      'Mentorship',
      'Workshops'
    ];
  }

  private getCertificationPath(skillName: string): string | undefined {
    const certificationMap: Record<string, string> = {
      'aws': 'AWS Certified Solutions Architect',
      'google cloud': 'Google Cloud Professional',
      'project management': 'PMP Certification'
    };
    
    return certificationMap[skillName.toLowerCase()];
  }

  private calculateGapPriority(requiredSkill: any): 'low' | 'medium' | 'high' | 'critical' {
    if (requiredSkill.importance > 80 && requiredSkill.marketDemand === MarketDemand.CRITICAL) {
      return 'critical';
    } else if (requiredSkill.importance > 70) {
      return 'high';
    } else if (requiredSkill.importance > 50) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private createStrengthRecommendation(skill: SkillAssessment): SkillRecommendation {
    return {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'strengthen',
      skillName: skill.skillName,
      reason: `High market demand skill with room for improvement`,
      impact: 'high',
      effort: 'moderate',
      timeline: '3-6 months',
      learningPath: [`Advanced ${skill.skillName} course`, 'Practice projects', 'Certification'],
      successMetrics: ['Increase proficiency to 80%+', 'Complete certification'],
      roi: skill.marketData.averageSalaryImpact,
      confidence: 85
    };
  }

  private createAcquisitionRecommendation(gap: SkillGap): SkillRecommendation {
    return {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'acquire',
      skillName: gap.skillName,
      reason: `Critical skill gap for career advancement`,
      impact: gap.priority === 'critical' ? 'transformative' : 'high',
      effort: gap.timeToAcquire > 6 ? 'significant' : 'moderate',
      timeline: `${gap.timeToAcquire} months`,
      learningPath: gap.learningResources,
      successMetrics: ['Achieve minimum proficiency', 'Apply skill in real project'],
      roi: gap.salaryImpact,
      confidence: 75
    };
  }

  private createMaintenanceRecommendation(skill: SkillAssessment): SkillRecommendation {
    return {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'maintain',
      skillName: skill.skillName,
      reason: `Expert-level skill requires regular practice`,
      impact: 'medium',
      effort: 'minimal',
      timeline: 'Ongoing',
      learningPath: ['Regular practice', 'Stay updated with trends', 'Mentor others'],
      successMetrics: ['Use skill monthly', 'Stay current with updates'],
      roi: skill.marketData.averageSalaryImpact * 0.5,
      confidence: 90
    };
  }

  private createPivotRecommendation(skill: SkillAssessment): SkillRecommendation {
    const relatedSkills = skill.marketData.relatedSkills;
    
    return {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'pivot',
      skillName: skill.skillName,
      reason: `Skill is declining in market value`,
      impact: 'medium',
      effort: 'moderate',
      timeline: '6-12 months',
      learningPath: [`Transition to ${relatedSkills[0] || 'related technology'}`, 'Build portfolio'],
      successMetrics: ['Develop proficiency in replacement skill'],
      roi: 20,
      confidence: 60
    };
  }

  private recalculatePortfolio(): void {
    const skills = Array.from(this._skillAssessments.values());
    
    // Calculate skills by category
    const skillsByCategory: Record<SkillCategory, number> = {} as Record<SkillCategory, number>;
    for (const category of Object.values(SkillCategory)) {
      skillsByCategory[category] = skills.filter(s => s.category === category).length;
    }
    
    // Calculate averages and scores
    const totalSkills = skills.length;
    const averageProficiency = totalSkills > 0 
      ? skills.reduce((sum, s) => sum + s.proficiencyScore, 0) / totalSkills 
      : 0;
    
    this._portfolio = {
      totalSkills,
      skillsByCategory,
      averageProficiency: Math.round(averageProficiency),
      portfolioStrength: this.calculatePortfolioStrength(),
      marketAlignment: this.calculateMarketAlignment(),
      diversityScore: this.calculateDiversityScore(),
      futureProofing: this.calculateFutureProofing(),
      competitiveAdvantage: this.identifyCompetitiveAdvantage(),
      improvementAreas: this.identifyImprovementAreas()
    };
  }

  private calculateMarketAlignment(): number {
    if (this._skillAssessments.size === 0) return 0;
    
    let alignmentScore = 0;
    for (const skill of this._skillAssessments.values()) {
      const demandScore = this.getMarketMultiplier(skill.marketData.demand) * 20;
      alignmentScore += demandScore;
    }
    
    return Math.round(alignmentScore / this._skillAssessments.size);
  }

  private calculateDiversityScore(): number {
    const categories = new Set(Array.from(this._skillAssessments.values()).map(s => s.category));
    const maxCategories = Object.keys(SkillCategory).length;
    return Math.round((categories.size / maxCategories) * 100);
  }

  private calculateFutureProofing(): number {
    if (this._skillAssessments.size === 0) return 0;
    
    let futureProofScore = 0;
    for (const skill of this._skillAssessments.values()) {
      const trendScore = skill.marketData.trend === SkillTrend.EMERGING ? 100 :
                        skill.marketData.trend === SkillTrend.GROWING ? 80 :
                        skill.marketData.trend === SkillTrend.STABLE ? 60 :
                        skill.marketData.trend === SkillTrend.DECLINING ? 20 : 40;
      futureProofScore += trendScore;
    }
    
    return Math.round(futureProofScore / this._skillAssessments.size);
  }

  private identifyCompetitiveAdvantage(): string[] {
    const advantages: string[] = [];
    
    for (const skill of this._skillAssessments.values()) {
      if (skill.proficiency === SkillProficiency.EXPERT || skill.proficiency === SkillProficiency.MASTER) {
        if (skill.marketData.demand === MarketDemand.HIGH || skill.marketData.demand === MarketDemand.CRITICAL) {
          advantages.push(`Expert-level ${skill.skillName}`);
        }
      }
    }
    
    return advantages.slice(0, 5);
  }

  private identifyImprovementAreas(): string[] {
    const areas: string[] = [];
    
    // Low diversity
    if (this._portfolio.diversityScore < 40) {
      areas.push('Skill portfolio lacks diversity');
    }
    
    // Low market alignment
    if (this._portfolio.marketAlignment < 60) {
      areas.push('Skills not aligned with market demand');
    }
    
    // Low future proofing
    if (this._portfolio.futureProofing < 50) {
      areas.push('Portfolio vulnerable to technology changes');
    }
    
    return areas;
  }

  private getMarketMultiplier(demand: MarketDemand): number {
    const multipliers = {
      [MarketDemand.VERY_LOW]: 0.5,
      [MarketDemand.LOW]: 0.7,
      [MarketDemand.MEDIUM]: 1.0,
      [MarketDemand.HIGH]: 1.3,
      [MarketDemand.VERY_HIGH]: 1.5,
      [MarketDemand.CRITICAL]: 2.0
    };
    
    return multipliers[demand];
  }

  private optimizeLearningSequence(skills: string[]): string[] {
    // Simple optimization - would use more sophisticated dependency analysis
    return [...skills].sort((a, b) => {
      const aComplexity = this.getSkillComplexity(a);
      const bComplexity = this.getSkillComplexity(b);
      return aComplexity - bComplexity;
    });
  }

  private createLearningPhases(skills: string[], timeframe: number): LearningPlan['phases'] {
    const phases: LearningPlan['phases'] = [];
    const skillsPerPhase = Math.ceil(skills.length / Math.max(1, timeframe / 3));
    
    for (let i = 0; i < skills.length; i += skillsPerPhase) {
      const phaseSkills = skills.slice(i, i + skillsPerPhase);
      phases.push({
        name: `Phase ${phases.length + 1}`,
        duration: Math.ceil(timeframe / Math.ceil(skills.length / skillsPerPhase)),
        skills: phaseSkills,
        milestones: phaseSkills.map(skill => `Complete ${skill} fundamentals`),
        resources: ['Online courses', 'Practice projects', 'Documentation']
      });
    }
    
    return phases;
  }

  private calculateLearningInvestment(skills: string[]): number {
    // Mock calculation - would integrate with actual course pricing
    return skills.length * 200; // $200 per skill average
  }

  private calculateSuccessProbability(skills: string[], timeframe: number): number {
    const averageComplexity = skills.reduce((sum, skill) => sum + this.getSkillComplexity(skill), 0) / skills.length;
    const timePerSkill = timeframe / skills.length;
    
    if (timePerSkill >= 3 && averageComplexity <= 1.5) return 85;
    if (timePerSkill >= 2 && averageComplexity <= 1.2) return 70;
    if (timePerSkill >= 1 && averageComplexity <= 1.0) return 55;
    return 40;
  }

  private generateExpectedOutcome(skills: string[]): string {
    return `Master ${skills.length} skills and increase market value by 20-40%`;
  }

  private daysSinceLastUsed(lastUsed: Date): number {
    return Math.floor((Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24));
  }

  private updateRecommendations(): void {
    this._recommendations = this.generateRecommendations();
    this._analysisDate = new Date();
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      userId: this._userId,
      skillAssessments: Array.from(this._skillAssessments.entries()),
      skillGaps: this._skillGaps,
      recommendations: this._recommendations,
      portfolio: this._portfolio,
      learningPlans: this._learningPlans,
      analysisDate: this._analysisDate.toISOString(),
      lastMarketUpdate: this._lastMarketUpdate.toISOString(),
      createdAt: this._createdAt.toISOString()
    };
  }

  static fromJSON(data: any): SkillsAnalysis {
    const analysis = new SkillsAnalysis(data.userId);
    
    if (data.skillAssessments) {
      for (const [key, value] of data.skillAssessments) {
        analysis._skillAssessments.set(key, value);
      }
    }
    if (data.skillGaps) analysis._skillGaps = data.skillGaps;
    if (data.recommendations) analysis._recommendations = data.recommendations;
    if (data.portfolio) analysis._portfolio = data.portfolio;
    if (data.learningPlans) analysis._learningPlans = data.learningPlans;
    if (data.analysisDate) analysis._analysisDate = new Date(data.analysisDate);
    if (data.lastMarketUpdate) analysis._lastMarketUpdate = new Date(data.lastMarketUpdate);
    
    return analysis;
  }
}

export const createSkillsAnalysis = (userId: string): SkillsAnalysis => {
  return new SkillsAnalysis(userId);
};