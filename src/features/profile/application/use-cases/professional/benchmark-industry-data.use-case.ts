/**
 * BenchmarkIndustryDataUseCase - Enterprise Market Intelligence & Competitive Analysis
 * 🚀 ENTERPRISE: Salary Benchmarks, Market Trends, Competitive Positioning
 * ✅ APPLICATION LAYER: Business Logic für Industry Market Analysis
 */

import { Result } from '../../../../../core/types/result.type';
import { 
  IndustryBenchmark,
  SalaryBenchmark,
  MarketTrend,
  CompetitivePositioning,
  IndustryInsight,
  MarketOpportunity,
  RoleAnalysis,
  IndustryType,
  CompanySize,
  GeographicRegion,
  ExperienceLevel
} from '../../../domain/entities/industry-benchmark.entity';

/**
 * @interface BenchmarkInput - Input for industry benchmarking
 */
export interface BenchmarkInput {
  readonly userId: string;
  readonly industry: IndustryType;
  readonly role: string;
  readonly experienceLevel: ExperienceLevel;
  readonly region: GeographicRegion;
  readonly currentSalary?: number;
  readonly currentTotalComp?: number;
  readonly skills: string[];
  readonly achievements: number;
  readonly yearsExperience: number;
  readonly companySize?: CompanySize;
  readonly careerGoals?: string[];
  readonly targetCompanies?: string[];
}

/**
 * @interface BenchmarkOutput - Industry benchmarking results
 */
export interface BenchmarkOutput {
  readonly industryBenchmark: IndustryBenchmark;
  readonly salaryAnalysis: {
    currentPosition: {
      salaryPercentile: number;
      totalCompPercentile: number;
      marketGap: number;
      recommendations: string[];
    };
    marketData: SalaryBenchmark | null;
    competitorComparison: {
      versusIndustry: number;
      versusRole: number;
      versusExperience: number;
    };
    optimizationPotential: {
      shortTerm: { increase: number; strategies: string[] };
      mediumTerm: { increase: number; strategies: string[] };
      longTerm: { increase: number; strategies: string[] };
    };
  };
  readonly positioning: CompetitivePositioning;
  readonly marketTrends: MarketTrend[];
  readonly opportunities: MarketOpportunity[];
  readonly insights: IndustryInsight[];
  readonly roleAnalysis: RoleAnalysis;
  readonly actionPlan: {
    immediateActions: string[];
    skillDevelopment: string[];
    networkingTargets: string[];
    marketingStrategy: string[];
  };
  readonly riskAssessment: {
    careerRisks: string[];
    marketRisks: string[];
    mitigationStrategies: string[];
    contingencyPlans: string[];
  };
}

/**
 * @class BenchmarkIndustryDataUseCase - Enterprise Market Intelligence Business Logic
 */
export class BenchmarkIndustryDataUseCase {

  /**
   * Executes comprehensive industry benchmarking analysis
   */
  async execute(input: BenchmarkInput): Promise<Result<BenchmarkOutput>> {
    try {
      // Validate input
      const validationResult = this.validateInput(input);
      if (!validationResult.success) {
        return Result.error(validationResult.error || 'Validation failed');
      }

      // Create industry benchmark instance
      const industryBenchmark = new IndustryBenchmark({
        userId: input.userId,
        industry: input.industry,
        role: input.role,
        experienceLevel: input.experienceLevel,
        region: input.region
      });

      // Update positioning with user profile
      industryBenchmark.updatePositioning({
        salary: input.currentSalary || 0,
        skills: input.skills,
        achievements: input.achievements,
        yearsExperience: input.yearsExperience
      });

      // Perform salary analysis
      const salaryAnalysis = await this.performSalaryAnalysis(
        industryBenchmark,
        input.currentSalary || 0,
        input.currentTotalComp || 0,
        input
      );

      // Get competitive positioning
      const positioning = industryBenchmark.positioning;

      // Get relevant market trends
      const marketTrends = industryBenchmark.getRelevantTrends();

      // Find market opportunities
      const opportunities = industryBenchmark.findOpportunities({
        minROI: 50,
        maxTimeframe: 12,
        remoteOnly: false
      });

      // Generate market insights
      const insights = industryBenchmark.generateMarketInsights();

      // Analyze specific role
      const roleAnalysis = industryBenchmark.analyzeRole(input.role);

      // Create action plan
      const actionPlan = await this.createActionPlan(
        industryBenchmark,
        positioning,
        insights,
        input.careerGoals || []
      );

      // Assess risks
      const riskAssessment = await this.assessRisks(
        industryBenchmark,
        positioning,
        marketTrends,
        input
      );

      const output: BenchmarkOutput = {
        industryBenchmark,
        salaryAnalysis,
        positioning,
        marketTrends,
        opportunities,
        insights,
        roleAnalysis,
        actionPlan,
        riskAssessment
      };

      return Result.success(output);

    } catch (error) {
      return Result.error(`Industry benchmarking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Performs market trend analysis for specific industry
   */
  async analyzeTrends(input: {
    industry: IndustryType;
    timeframe: number; // months
    focusAreas?: string[];
  }  ): Promise<Result<{
    trends: MarketTrend[];
    trendSummary: {
      growingAreas: string[];
      decliningAreas: string[];
      emergingOpportunities: string[];
      disruptiveForces: string[];
    };
    impactAnalysis: {
      positiveImpacts: Array<{ area: string; impact: string; probability: number }>;
      negativeImpacts: Array<{ area: string; impact: string; probability: number }>;
    };
    recommendations: string[];
  }>> {
    try {
      // Mock trend analysis - would integrate with market intelligence APIs
      const trends: MarketTrend[] = [
        {
          id: 'ai_adoption_2024',
          industry: input.industry,
          trend: 'AI Integration Acceleration',
          description: 'Rapid adoption of AI tools across all business functions',
          impact: 'disruptive',
          timeframe: '2024-2026',
          confidence: 90,
          affectedRoles: ['Software Engineer', 'Data Analyst', 'Product Manager'],
          opportunities: ['AI specialization', 'Process automation', 'AI strategy consulting'],
          risks: ['Job displacement', 'Skill obsolescence', 'Increased competition'],
          requiredSkills: ['Machine Learning', 'AI Ethics', 'Prompt Engineering'],
          sources: ['Industry Reports', 'Expert Analysis'],
          lastUpdated: new Date()
        }
      ];

      // Analyze trend patterns
      const trendSummary = {
        growingAreas: ['Artificial Intelligence', 'Cloud Computing', 'Cybersecurity'],
        decliningAreas: ['Legacy Systems', 'Manual Processes', 'Traditional Advertising'],
        emergingOpportunities: ['AI Ethics', 'Quantum Computing', 'Sustainable Technology'],
        disruptiveForces: ['Automation', 'Remote Work', 'Platform Economy']
      };

      // Assess impacts
      const impactAnalysis = {
        positiveImpacts: [
          { area: 'AI Specialization', impact: 'Increased demand and salaries', probability: 85 },
          { area: 'Remote Work', impact: 'Global job opportunities', probability: 80 },
          { area: 'Digital Transformation', impact: 'New role categories', probability: 75 }
        ],
        negativeImpacts: [
          { area: 'Automation', impact: 'Job displacement in routine tasks', probability: 70 },
          { area: 'Skill Gap', impact: 'Reduced competitiveness', probability: 60 },
          { area: 'Market Saturation', impact: 'Increased competition', probability: 55 }
        ]
      };

      // Generate recommendations
      const recommendations = [
        'Invest in AI and automation skills to stay competitive',
        'Develop expertise in emerging technologies',
        'Build strong remote work capabilities',
        'Focus on human-centric skills that complement technology',
        'Stay informed about industry disruptions and adapt quickly'
      ];

      return Result.success({
        trends,
        trendSummary,
        impactAnalysis,
        recommendations
      });

    } catch (error) {
      return Result.error(`Trend analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compares compensation across multiple scenarios
   */
  async compareCompensation(input: {
    currentProfile: BenchmarkInput;
    scenarios: Array<{
      name: string;
      role?: string;
      industry?: IndustryType;
      experienceLevel?: ExperienceLevel;
      region?: GeographicRegion;
      companySize?: CompanySize;
    }>;
  }  ): Promise<Result<{
    comparisons: Array<{
      scenario: string;
      salaryRange: { min: number; median: number; max: number };
      totalCompRange: { min: number; median: number; max: number };
      percentileImprovement: number;
      advantages: string[];
      disadvantages: string[];
      feasibility: number; // 0-100
    }>;
    recommendations: {
      bestScenario: string;
      easiestTransition: string;
      highestROI: string;
      reasoning: string[];
    };
  }>> {
    try {
      const comparisons = [];

      for (const scenario of input.scenarios) {
        // Create benchmark for scenario
        const scenarioBenchmark = new IndustryBenchmark({
          userId: input.currentProfile.userId,
          industry: scenario.industry || input.currentProfile.industry,
          role: scenario.role || input.currentProfile.role,
          experienceLevel: scenario.experienceLevel || input.currentProfile.experienceLevel,
          region: scenario.region || input.currentProfile.region
        });

        const benchmark = scenarioBenchmark.getSalaryBenchmark(
          scenario.role,
          scenario.experienceLevel
        );

        if (benchmark) {
          const currentSalary = input.currentProfile.currentSalary || 0;
          const percentileImprovement = benchmark.baseSalary.median > currentSalary 
            ? ((benchmark.baseSalary.median - currentSalary) / currentSalary) * 100 
            : 0;

          const advantages = this.identifyScenarioAdvantages(scenario, input.currentProfile);
          const disadvantages = this.identifyScenarioDisadvantages(scenario, input.currentProfile);
          const feasibility = this.calculateTransitionFeasibility(scenario, input.currentProfile);

          comparisons.push({
            scenario: scenario.name,
            salaryRange: {
              min: benchmark.baseSalary.min,
              median: benchmark.baseSalary.median,
              max: benchmark.baseSalary.max
            },
            totalCompRange: {
              min: benchmark.totalCompensation.min,
              median: benchmark.totalCompensation.median,
              max: benchmark.totalCompensation.max
            },
            percentileImprovement,
            advantages,
            disadvantages,
            feasibility
          });
        }
      }

      // Generate recommendations
      const bestROI = comparisons.reduce((best, current) => 
        current.percentileImprovement > best.percentileImprovement ? current : best
      );

      const easiestTransition = comparisons.reduce((easiest, current) => 
        current.feasibility > easiest.feasibility ? current : easiest
      );

      const bestOverall = comparisons.reduce((best, current) => {
        const score = (current.percentileImprovement * 0.6) + (current.feasibility * 0.4);
        const bestScore = (best.percentileImprovement * 0.6) + (best.feasibility * 0.4);
        return score > bestScore ? current : best;
      });

      const recommendations = {
        bestScenario: bestOverall.scenario,
        easiestTransition: easiestTransition.scenario,
        highestROI: bestROI.scenario,
        reasoning: [
          `${bestOverall.scenario} offers the best balance of compensation and feasibility`,
          `${easiestTransition.scenario} requires minimal transition effort`,
          `${bestROI.scenario} provides the highest compensation increase`
        ]
      };

      return Result.success({ comparisons, recommendations });

    } catch (error) {
      return Result.error(`Compensation comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods
  private validateInput(input: BenchmarkInput): { success: boolean; error?: string } {
    if (!input.userId) {
      return { success: false, error: 'User ID is required' };
    }

    if (!input.industry || !input.role || !input.experienceLevel || !input.region) {
      return { success: false, error: 'Industry, role, experience level, and region are required' };
    }

    if (input.skills.length === 0) {
      return { success: false, error: 'Skills list cannot be empty' };
    }

    if (input.yearsExperience < 0) {
      return { success: false, error: 'Years of experience must be non-negative' };
    }

    return { success: true };
  }

  private async performSalaryAnalysis(
    industryBenchmark: IndustryBenchmark,
    currentSalary: number,
    currentTotalComp: number,
    input: BenchmarkInput
  ): Promise<BenchmarkOutput['salaryAnalysis']> {
    // Get compensation analysis
    const compensationAnalysis = industryBenchmark.analyzeCompensation(
      currentSalary,
      currentTotalComp
    );

    // Calculate competitor comparison
    const competitorComparison = {
      versusIndustry: compensationAnalysis.salaryPercentile,
      versusRole: compensationAnalysis.salaryPercentile + Math.random() * 10 - 5, // Mock variation
      versusExperience: compensationAnalysis.salaryPercentile + Math.random() * 15 - 7.5 // Mock variation
    };

    // Calculate optimization potential
    const optimizationPotential = {
      shortTerm: {
        increase: 5,
        strategies: ['Negotiate current role salary', 'Seek performance bonus', 'Request promotion review']
      },
      mediumTerm: {
        increase: 15,
        strategies: ['Role advancement', 'Skill certification', 'Industry change']
      },
      longTerm: {
        increase: 30,
        strategies: ['Leadership roles', 'Expertise specialization', 'Geographic relocation']
      }
    };

    return {
      currentPosition: {
        salaryPercentile: compensationAnalysis.salaryPercentile,
        totalCompPercentile: compensationAnalysis.totalCompPercentile,
        marketGap: compensationAnalysis.marketGap,
        recommendations: compensationAnalysis.recommendations
      },
      marketData: compensationAnalysis.benchmarkData,
      competitorComparison,
      optimizationPotential
    };
  }

  private async createActionPlan(
    industryBenchmark: IndustryBenchmark,
    positioning: CompetitivePositioning,
    insights: IndustryInsight[],
    careerGoals: string[]
  ): Promise<BenchmarkOutput['actionPlan']> {
    const immediateActions = [];
    const skillDevelopment = [];
    const networkingTargets = [];
    const marketingStrategy = [];

    // Based on positioning
    if (positioning.salary < 50) {
      immediateActions.push('Research salary negotiation strategies');
      immediateActions.push('Document current achievements and value');
    }

    if (positioning.skills < 70) {
      skillDevelopment.push('Identify top 3 in-demand skills for your role');
      skillDevelopment.push('Create 6-month skill development plan');
    }

    // Based on insights
    for (const insight of insights) {
      if (insight.actionable && (insight as any).importance === 'high') {
        immediateActions.push(...insight.recommendations.slice(0, 1));
      }
    }

    // Networking based on industry
    networkingTargets.push('Senior professionals in target companies');
    networkingTargets.push('Industry thought leaders and influencers');
    networkingTargets.push('Peers in complementary roles');

    // Marketing strategy
    marketingStrategy.push('Optimize LinkedIn profile for target role');
    marketingStrategy.push('Create content showcasing expertise');
    marketingStrategy.push('Participate in industry events and conferences');

    return {
      immediateActions: immediateActions.slice(0, 5),
      skillDevelopment: skillDevelopment.slice(0, 5),
      networkingTargets: networkingTargets.slice(0, 5),
      marketingStrategy: marketingStrategy.slice(0, 5)
    };
  }

  private async assessRisks(
    industryBenchmark: IndustryBenchmark,
    positioning: CompetitivePositioning,
    marketTrends: MarketTrend[],
    input: BenchmarkInput
  ): Promise<BenchmarkOutput['riskAssessment']> {
    const careerRisks = [];
    const marketRisks = [];
    const mitigationStrategies = [];
    const contingencyPlans = [];

    // Career risks based on positioning
    if (positioning.overall < 40) {
      careerRisks.push('Below-market competitive position');
      mitigationStrategies.push('Immediate skill development initiative');
    }

    if (positioning.skills < 60) {
      careerRisks.push('Skills gap compared to market demands');
      mitigationStrategies.push('Targeted skill acquisition program');
    }

    // Market risks based on trends
    for (const trend of marketTrends) {
      if (trend.impact === 'disruptive' && trend.risks.length > 0) {
        marketRisks.push(`${trend.trend}: ${trend.risks[0]}`);
        mitigationStrategies.push(`Prepare for ${trend.trend} by developing ${trend.requiredSkills[0]}`);
      }
    }

    // Industry-specific risks
    if (input.industry === IndustryType.RETAIL) {
      marketRisks.push('E-commerce disruption of traditional retail');
    } else if (input.industry === IndustryType.MANUFACTURING) {
      marketRisks.push('Automation impact on traditional manufacturing roles');
    }

    // Contingency plans
    contingencyPlans.push('Develop transferable skills for industry transitions');
    contingencyPlans.push('Build diverse professional network across industries');
    contingencyPlans.push('Maintain emergency fund for career transitions');
    contingencyPlans.push('Consider remote work capabilities for geographic flexibility');

    return {
      careerRisks: careerRisks.slice(0, 5),
      marketRisks: marketRisks.slice(0, 5),
      mitigationStrategies: mitigationStrategies.slice(0, 5),
      contingencyPlans: contingencyPlans.slice(0, 5)
    };
  }

  private identifyScenarioAdvantages(scenario: any, current: BenchmarkInput): string[] {
    const advantages = [];

    if (scenario.industry && scenario.industry !== current.industry) {
      advantages.push('Industry diversification');
      advantages.push('New market opportunities');
    }

    if (scenario.role && scenario.role !== current.role) {
      advantages.push('Role advancement');
      advantages.push('Expanded responsibilities');
    }

    if (scenario.region && scenario.region !== current.region) {
      advantages.push('Geographic arbitrage');
      advantages.push('Access to new markets');
    }

    if (scenario.experienceLevel && this.isHigherLevel(scenario.experienceLevel, current.experienceLevel)) {
      advantages.push('Career progression');
      advantages.push('Higher compensation potential');
    }

    return advantages.length > 0 ? advantages : ['Diversification benefits'];
  }

  private identifyScenarioDisadvantages(scenario: any, current: BenchmarkInput): string[] {
    const disadvantages = [];

    if (scenario.industry && scenario.industry !== current.industry) {
      disadvantages.push('Industry learning curve');
      disadvantages.push('Network rebuilding required');
    }

    if (scenario.role && scenario.role !== current.role) {
      disadvantages.push('Role transition challenges');
      disadvantages.push('Skill gap requirements');
    }

    if (scenario.region && scenario.region !== current.region) {
      disadvantages.push('Relocation costs and complexity');
      disadvantages.push('Cultural adaptation needed');
    }

    return disadvantages.length > 0 ? disadvantages : ['Minimal transition risks'];
  }

  private calculateTransitionFeasibility(scenario: any, current: BenchmarkInput): number {
    let feasibility = 80; // Base feasibility

    // Reduce for industry change
    if (scenario.industry && scenario.industry !== current.industry) {
      feasibility -= 20;
    }

    // Reduce for significant role change
    if (scenario.role && scenario.role !== current.role) {
      feasibility -= 15;
    }

    // Reduce for region change
    if (scenario.region && scenario.region !== current.region) {
      feasibility -= 25;
    }

    // Reduce for experience level jump
    if (scenario.experienceLevel && this.isSignificantLevelJump(scenario.experienceLevel, current.experienceLevel)) {
      feasibility -= 20;
    }

    return Math.max(10, Math.min(100, feasibility));
  }

  private isHigherLevel(target: ExperienceLevel, current: ExperienceLevel): boolean {
    const levels = [
      ExperienceLevel.ENTRY,
      ExperienceLevel.JUNIOR,
      ExperienceLevel.MID,
      ExperienceLevel.SENIOR,
      ExperienceLevel.LEAD,
      ExperienceLevel.EXECUTIVE
    ];

    return levels.indexOf(target) > levels.indexOf(current);
  }

  private isSignificantLevelJump(target: ExperienceLevel, current: ExperienceLevel): boolean {
    const levels = [
      ExperienceLevel.ENTRY,
      ExperienceLevel.JUNIOR,
      ExperienceLevel.MID,
      ExperienceLevel.SENIOR,
      ExperienceLevel.LEAD,
      ExperienceLevel.EXECUTIVE
    ];

    return levels.indexOf(target) - levels.indexOf(current) > 1;
  }
}

// Factory function
export const createBenchmarkIndustryDataUseCase = (): BenchmarkIndustryDataUseCase => {
  return new BenchmarkIndustryDataUseCase();
};