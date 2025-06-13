/**
 * AnalyzeProfessionalSkillsUseCase - Enterprise Skills Analysis & Market Intelligence
 * 🚀 ENTERPRISE: Advanced Skills Gap Analysis, Market Value, Learning Recommendations
 * ✅ APPLICATION LAYER: Business Logic für Professional Skills Management
 */

import { Result } from '../../../../../core/types/result.type';
import { 
  SkillsAnalysis, 
  SkillAssessment, 
  SkillGap, 
  SkillRecommendation, 
  SkillPortfolio,
  LearningPlan,
  SkillCategory,
  SkillProficiency,
  MarketDemand,
  SkillTrend 
} from '../../../domain/entities/skills-analysis.entity';

/**
 * @interface AnalyzeSkillsInput - Input for skills analysis
 */
export interface AnalyzeSkillsInput {
  readonly userId: string;
  readonly currentSkills: Array<{
    name: string;
    category: SkillCategory;
    proficiency: SkillProficiency;
    yearsExperience: number;
    lastUsed: Date;
    verified: boolean;
  }>;
  readonly targetRole?: string;
  readonly targetIndustry?: string;
  readonly careerGoals: string[];
  readonly timeframe?: number; // months for skill development
  readonly learningBudget?: number;
  readonly preferredLearningMethods?: string[];
}

/**
 * @interface AnalyzeSkillsOutput - Skills analysis results
 */
export interface AnalyzeSkillsOutput {
  readonly skillsAnalysis: SkillsAnalysis;
  readonly portfolio: SkillPortfolio;
  readonly skillGaps: SkillGap[];
  readonly recommendations: SkillRecommendation[];
  readonly learningPlan?: LearningPlan;
  readonly marketInsights: {
    topDemandSkills: Array<{
      skill: string;
      demand: MarketDemand;
      trend: SkillTrend;
      salaryImpact: number;
      timeToAcquire: number;
    }>;
    emergingTechnologies: string[];
    skillsAtRisk: string[];
    competitiveAdvantages: string[];
  };
  readonly performanceMetrics: {
    portfolioStrength: number;
    marketAlignment: number;
    futureProofing: number;
    learningVelocity: number;
    skillDiversityScore: number;
  };
  readonly actionPlan: {
    immediateActions: string[];
    shortTermGoals: string[];
    longTermObjectives: string[];
    milestones: Array<{
      description: string;
      targetDate: Date;
      successMetrics: string[];
    }>;
  };
}

/**
 * @class AnalyzeProfessionalSkillsUseCase - Enterprise Skills Analysis Business Logic
 */
export class AnalyzeProfessionalSkillsUseCase {
  
  /**
   * Executes comprehensive professional skills analysis
   */
  async execute(input: AnalyzeSkillsInput): Promise<Result<AnalyzeSkillsOutput, Error>> {
    try {
      // Validate input
      const validationResult = this.validateInput(input);
      if (!validationResult.success) {
        return Result.failure(new Error(validationResult.error));
      }

      // Create skills analysis instance
      const skillsAnalysis = new SkillsAnalysis(input.userId);

      // Add current skills to analysis
      await this.processCurrentSkills(skillsAnalysis, input.currentSkills);

      // Perform gap analysis
      const skillGaps = await this.performGapAnalysis(
        skillsAnalysis, 
        input.targetRole, 
        input.targetIndustry,
        input.careerGoals
      );

      // Generate recommendations
      const recommendations = await this.generateSmartRecommendations(
        skillsAnalysis,
        skillGaps,
        input.careerGoals,
        input.timeframe,
        input.learningBudget
      );

      // Create learning plan if requested
      let learningPlan: LearningPlan | undefined;
      if (input.timeframe && recommendations.length > 0) {
        learningPlan = await this.createPersonalizedLearningPlan(
          skillsAnalysis,
          recommendations.slice(0, 5), // Top 5 recommendations
          input.timeframe,
          input.learningBudget,
          input.preferredLearningMethods
        );
      }

      // Generate market insights
      const marketInsights = await this.generateMarketInsights(
        skillsAnalysis,
        input.targetRole,
        input.targetIndustry
      );

      // Calculate performance metrics
      const performanceMetrics = await this.calculatePerformanceMetrics(
        skillsAnalysis,
        skillGaps,
        marketInsights
      );

      // Create action plan
      const actionPlan = await this.createActionPlan(
        recommendations,
        learningPlan,
        input.timeframe || 12
      );

      // Get portfolio analysis
      const portfolio = skillsAnalysis.portfolio;

      const output: AnalyzeSkillsOutput = {
        skillsAnalysis,
        portfolio,
        skillGaps,
        recommendations,
        learningPlan,
        marketInsights,
        performanceMetrics,
        actionPlan
      };

      return Result.success(output);

    } catch (error) {
      return Result.failure(new Error(`Skills analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  /**
   * Quick skills assessment for immediate feedback
   */
  async quickAssessment(input: {
    userId: string;
    skills: string[];
    targetRole?: string;
  }): Promise<Result<{
    overallScore: number;
    topStrengths: string[];
    criticalGaps: string[];
    quickWins: string[];
    marketValue: 'low' | 'medium' | 'high' | 'exceptional';
  }, Error>> {
    try {
      const skillsAnalysis = new SkillsAnalysis(input.userId);
      
      // Quick skill assessment
      const assessments: SkillAssessment[] = input.skills.map(skill => ({
        skillName: skill,
        category: this.categorizeSkill(skill),
        proficiency: SkillProficiency.INTERMEDIATE, // Default assumption
        proficiencyScore: 60, // Default assumption
        yearsOfExperience: 2, // Default assumption
        lastUsed: new Date(),
        verified: false,
        endorsements: 0,
        marketData: {
          demand: MarketDemand.MEDIUM,
          trend: SkillTrend.STABLE,
          averageSalaryImpact: 10,
          jobOpenings: 1000,
          competitionLevel: 60,
          geographicHotspots: ['San Francisco', 'New York'],
          relatedSkills: [],
          certificationAvailable: false,
          lastUpdated: new Date()
        }
      }));

      // Add assessments to analysis
      assessments.forEach(assessment => {
        skillsAnalysis.addSkillAssessment(assessment);
      });

      // Calculate quick metrics
      const overallScore = skillsAnalysis.calculatePortfolioStrength();
      const portfolio = skillsAnalysis.portfolio;
      
      // Identify strengths and gaps
      const topStrengths = portfolio.competitiveAdvantage.slice(0, 3);
      const criticalGaps = this.identifyQuickGaps(input.skills, input.targetRole);
      const quickWins = this.identifyQuickWins(input.skills);
      
      // Determine market value
      let marketValue: 'low' | 'medium' | 'high' | 'exceptional';
      if (overallScore >= 85) marketValue = 'exceptional';
      else if (overallScore >= 70) marketValue = 'high';
      else if (overallScore >= 50) marketValue = 'medium';
      else marketValue = 'low';

      return Result.success({
        overallScore,
        topStrengths,
        criticalGaps,
        quickWins,
        marketValue
      });

    } catch (error) {
      return Result.failure(new Error(`Quick assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  /**
   * Compares skills against industry benchmarks
   */
  async benchmarkSkills(input: {
    userId: string;
    skills: SkillAssessment[];
    industry: string;
    role: string;
    experienceLevel: string;
  }): Promise<Result<{
    benchmarkScore: number;
    skillRankings: Array<{
      skill: string;
      userLevel: number;
      industryAverage: number;
      topPercentile: number;
      gap: number;
      recommendation: string;
    }>;
    competitivePosition: 'below_average' | 'average' | 'above_average' | 'top_performer';
    improvementPriorities: string[];
  }, Error>> {
    try {
      // Mock industry benchmarking - would integrate with real data APIs
      const skillRankings = input.skills.map(skill => {
        const industryAverage = Math.random() * 40 + 40; // 40-80
        const topPercentile = Math.random() * 20 + 80; // 80-100
        const userLevel = skill.proficiencyScore;
        const gap = industryAverage - userLevel;
        
        let recommendation = '';
        if (gap > 20) recommendation = 'Critical improvement needed';
        else if (gap > 10) recommendation = 'Focus on skill development';
        else if (gap < -10) recommendation = 'Skill advantage - leverage this';
        else recommendation = 'Maintain current level';

        return {
          skill: skill.skillName,
          userLevel,
          industryAverage,
          topPercentile,
          gap,
          recommendation
        };
      });

      // Calculate overall benchmark score
      const totalGap = skillRankings.reduce((sum, ranking) => sum + Math.abs(ranking.gap), 0);
      const benchmarkScore = Math.max(0, 100 - (totalGap / skillRankings.length));

      // Determine competitive position
      let competitivePosition: 'below_average' | 'average' | 'above_average' | 'top_performer';
      if (benchmarkScore >= 85) competitivePosition = 'top_performer';
      else if (benchmarkScore >= 65) competitivePosition = 'above_average';
      else if (benchmarkScore >= 45) competitivePosition = 'average';
      else competitivePosition = 'below_average';

      // Identify improvement priorities
      const improvementPriorities = skillRankings
        .filter(ranking => ranking.gap > 10)
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 3)
        .map(ranking => ranking.skill);

      return Result.success({
        benchmarkScore,
        skillRankings,
        competitivePosition,
        improvementPriorities
      });

    } catch (error) {
      return Result.failure(new Error(`Skills benchmarking failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  // Private helper methods
  private validateInput(input: AnalyzeSkillsInput): { success: boolean; error?: string } {
    if (!input.userId) {
      return { success: false, error: 'User ID is required' };
    }
    
    if (!input.currentSkills || input.currentSkills.length === 0) {
      return { success: false, error: 'Current skills list is required' };
    }

    if (!input.careerGoals || input.careerGoals.length === 0) {
      return { success: false, error: 'Career goals are required for analysis' };
    }

    return { success: true };
  }

  private async processCurrentSkills(
    skillsAnalysis: SkillsAnalysis, 
    currentSkills: AnalyzeSkillsInput['currentSkills']
  ): Promise<void> {
    for (const skill of currentSkills) {
      skillsAnalysis.addSkillAssessment({
        skillName: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        proficiencyScore: this.calculateProficiencyScore(skill.proficiency),
        yearsOfExperience: skill.yearsExperience,
        lastUsed: skill.lastUsed,
        verified: skill.verified,
        endorsements: skill.verified ? Math.floor(Math.random() * 10) + 1 : 0
      });
    }
  }

  private async performGapAnalysis(
    skillsAnalysis: SkillsAnalysis,
    targetRole?: string,
    targetIndustry?: string,
    careerGoals?: string[]
  ): Promise<SkillGap[]> {
    // Perform gap analysis with market data
    const gaps = skillsAnalysis.performGapAnalysis(targetRole, targetIndustry);
    
    // Enhance gaps with career goal context
    if (careerGoals && careerGoals.length > 0) {
      return this.enhanceGapsWithCareerGoals(gaps, careerGoals);
    }
    
    return gaps;
  }

  private async generateSmartRecommendations(
    skillsAnalysis: SkillsAnalysis,
    skillGaps: SkillGap[],
    careerGoals: string[],
    timeframe?: number,
    budget?: number
  ): Promise<SkillRecommendation[]> {
    const baseRecommendations = skillsAnalysis.generateRecommendations();
    
    // Filter and prioritize based on constraints
    let filteredRecommendations = baseRecommendations;
    
    if (timeframe && timeframe < 12) {
      // Prioritize quick wins for short timeframes
      filteredRecommendations = baseRecommendations.filter(rec => 
        rec.effort === 'minimal' || rec.effort === 'moderate'
      );
    }
    
    if (budget && budget < 5000) {
      // Prioritize cost-effective recommendations
      filteredRecommendations = filteredRecommendations.filter(rec => 
        rec.roi > 20 || rec.effort === 'minimal'
      );
    }
    
    // Enhance with career goal alignment
    return this.enhanceRecommendationsWithGoals(filteredRecommendations, careerGoals);
  }

  private async createPersonalizedLearningPlan(
    skillsAnalysis: SkillsAnalysis,
    recommendations: SkillRecommendation[],
    timeframe: number,
    budget?: number,
    preferredMethods?: string[]
  ): Promise<LearningPlan> {
    const targetSkills = recommendations.map(rec => rec.skillName);
    const planTitle = `${timeframe}-Month Professional Skills Development Plan`;
    
    const learningPlan = skillsAnalysis.createLearningPlan(
      planTitle,
      targetSkills,
      timeframe
    );

    // Customize learning plan based on preferences
    if (preferredMethods && preferredMethods.length > 0) {
      // Adjust learning resources based on preferred methods
      // This would integrate with actual learning platform APIs
    }

    return learningPlan;
  }

  private async generateMarketInsights(
    skillsAnalysis: SkillsAnalysis,
    targetRole?: string,
    targetIndustry?: string
  ): Promise<AnalyzeSkillsOutput['marketInsights']> {
    // Mock market insights - would integrate with job market APIs
    const topDemandSkills = [
      { skill: 'Artificial Intelligence', demand: MarketDemand.CRITICAL, trend: SkillTrend.DISRUPTIVE, salaryImpact: 40, timeToAcquire: 12 },
      { skill: 'Cloud Architecture', demand: MarketDemand.VERY_HIGH, trend: SkillTrend.GROWING, salaryImpact: 25, timeToAcquire: 8 },
      { skill: 'Data Science', demand: MarketDemand.HIGH, trend: SkillTrend.GROWING, salaryImpact: 30, timeToAcquire: 10 },
      { skill: 'Cybersecurity', demand: MarketDemand.CRITICAL, trend: SkillTrend.GROWING, salaryImpact: 35, timeToAcquire: 9 },
      { skill: 'DevOps', demand: MarketDemand.HIGH, trend: SkillTrend.STABLE, salaryImpact: 20, timeToAcquire: 6 }
    ];

    const emergingTechnologies = [
      'Quantum Computing',
      'Edge Computing',
      'Extended Reality (XR)',
      'Blockchain Development',
      'Autonomous Systems'
    ];

    const skillsAtRisk = [
      'Legacy System Maintenance',
      'Manual Testing',
      'Basic Data Entry',
      'Traditional Project Management'
    ];

    const portfolio = skillsAnalysis.portfolio;
    const competitiveAdvantages = portfolio.competitiveAdvantage || [];

    return {
      topDemandSkills,
      emergingTechnologies,
      skillsAtRisk,
      competitiveAdvantages
    };
  }

  private async calculatePerformanceMetrics(
    skillsAnalysis: SkillsAnalysis,
    skillGaps: SkillGap[],
    marketInsights: AnalyzeSkillsOutput['marketInsights']
  ): Promise<AnalyzeSkillsOutput['performanceMetrics']> {
    const portfolio = skillsAnalysis.portfolio;
    
    // Calculate learning velocity based on skill acquisition rate
    const totalSkills = portfolio.totalSkills;
    const learningVelocity = totalSkills > 0 ? Math.min(100, totalSkills * 2) : 0;
    
    return {
      portfolioStrength: portfolio.portfolioStrength,
      marketAlignment: portfolio.marketAlignment,
      futureProofing: portfolio.futureProofing,
      learningVelocity,
      skillDiversityScore: portfolio.diversityScore
    };
  }

  private async createActionPlan(
    recommendations: SkillRecommendation[],
    learningPlan?: LearningPlan,
    timeframe: number = 12
  ): Promise<AnalyzeSkillsOutput['actionPlan']> {
    const immediateActions = recommendations
      .filter(rec => rec.effort === 'minimal')
      .slice(0, 3)
      .map(rec => `Start ${rec.skillName} development: ${rec.learningPath[0]}`);

    const shortTermGoals = recommendations
      .filter(rec => rec.effort === 'moderate')
      .slice(0, 3)
      .map(rec => `Achieve proficiency in ${rec.skillName}`);

    const longTermObjectives = recommendations
      .filter(rec => rec.impact === 'transformative' || rec.impact === 'high')
      .slice(0, 2)
      .map(rec => `Master ${rec.skillName} for career advancement`);

    const milestones = [];
    const quarterlyMilestones = Math.ceil(timeframe / 3);
    
    for (let i = 1; i <= quarterlyMilestones; i++) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + (i * 3));
      
      milestones.push({
        description: `Quarter ${i}: Complete ${i} major skill development milestones`,
        targetDate,
        successMetrics: [
          'Complete assigned learning modules',
          'Apply skills in real projects',
          'Receive skill validation/certification'
        ]
      });
    }

    return {
      immediateActions,
      shortTermGoals,
      longTermObjectives,
      milestones
    };
  }

  private calculateProficiencyScore(proficiency: SkillProficiency): number {
    const scoreMap = {
      [SkillProficiency.BEGINNER]: 20,
      [SkillProficiency.INTERMEDIATE]: 50,
      [SkillProficiency.ADVANCED]: 75,
      [SkillProficiency.EXPERT]: 90,
      [SkillProficiency.MASTER]: 95
    };
    
    return scoreMap[proficiency];
  }

  private categorizeSkill(skillName: string): SkillCategory {
    const techSkills = ['javascript', 'react', 'python', 'java', 'aws', 'docker'];
    const softSkills = ['leadership', 'communication', 'teamwork', 'management'];
    const languages = ['english', 'spanish', 'french', 'german', 'chinese'];
    
    const lowerSkill = skillName.toLowerCase();
    
    if (techSkills.some(tech => lowerSkill.includes(tech))) {
      return SkillCategory.TECHNICAL;
    } else if (softSkills.some(soft => lowerSkill.includes(soft))) {
      return SkillCategory.SOFT_SKILLS;
    } else if (languages.some(lang => lowerSkill.includes(lang))) {
      return SkillCategory.LANGUAGE;
    } else {
      return SkillCategory.TECHNICAL; // Default
    }
  }

  private enhanceGapsWithCareerGoals(gaps: SkillGap[], careerGoals: string[]): SkillGap[] {
    // Enhance gap priority based on career goal alignment
    return gaps.map(gap => {
      const isAlignedWithGoals = careerGoals.some(goal => 
        goal.toLowerCase().includes(gap.skillName.toLowerCase()) ||
        gap.relatedRoles.some(role => goal.toLowerCase().includes(role.toLowerCase()))
      );
      
      if (isAlignedWithGoals && gap.priority !== 'critical') {
        return { ...gap, priority: 'high' as const };
      }
      
      return gap;
    });
  }

  private enhanceRecommendationsWithGoals(
    recommendations: SkillRecommendation[], 
    careerGoals: string[]
  ): SkillRecommendation[] {
    return recommendations.map(rec => {
      const isAlignedWithGoals = careerGoals.some(goal => 
        goal.toLowerCase().includes(rec.skillName.toLowerCase())
      );
      
      if (isAlignedWithGoals) {
        return {
          ...rec,
          confidence: Math.min(100, rec.confidence + 15),
          reason: `${rec.reason} (Aligned with career goals)`
        };
      }
      
      return rec;
    });
  }

  private identifyQuickGaps(skills: string[], targetRole?: string): string[] {
    // Mock gap identification based on target role
    const commonGaps = ['Leadership', 'Communication', 'Strategic Thinking'];
    const techGaps = ['AI/ML', 'Cloud Computing', 'DevOps'];
    
    if (targetRole?.toLowerCase().includes('manager') || targetRole?.toLowerCase().includes('lead')) {
      return commonGaps;
    }
    
    return techGaps;
  }

  private identifyQuickWins(skills: string[]): string[] {
    // Identify skills that can be improved quickly
    const quickWinSkills = ['Communication', 'Time Management', 'Presentation Skills'];
    
    return quickWinSkills.filter(skill => 
      !skills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
    ).slice(0, 3);
  }
}

// Factory function
export const createAnalyzeProfessionalSkillsUseCase = (): AnalyzeProfessionalSkillsUseCase => {
  return new AnalyzeProfessionalSkillsUseCase();
};