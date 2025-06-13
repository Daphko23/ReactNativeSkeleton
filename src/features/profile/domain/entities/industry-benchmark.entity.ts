/**
 * IndustryBenchmark Entity - Enterprise Market Intelligence & Competitive Analysis
 * 🚀 ENTERPRISE: Salary Benchmarks, Market Trends, Competitive Positioning
 * ✅ DOMAIN LAYER: Business Rules für Industry Market Analysis
 */

/**
 * @enum IndustryType - Industry classifications
 */
export enum IndustryType {
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
  ENERGY = 'energy',
  REAL_ESTATE = 'real_estate',
  TRANSPORTATION = 'transportation',
  TELECOMMUNICATIONS = 'telecommunications',
  AUTOMOTIVE = 'automotive'
}

/**
 * @enum CompanySize - Company size classifications
 */
export enum CompanySize {
  STARTUP = 'startup',        // 1-50 employees
  SMALL = 'small',           // 51-200 employees
  MEDIUM = 'medium',         // 201-1000 employees
  LARGE = 'large',           // 1001-10000 employees
  ENTERPRISE = 'enterprise'   // 10000+ employees
}

/**
 * @enum GeographicRegion - Geographic market regions
 */
export enum GeographicRegion {
  NORTH_AMERICA = 'north_america',
  EUROPE = 'europe',
  ASIA_PACIFIC = 'asia_pacific',
  LATIN_AMERICA = 'latin_america',
  MIDDLE_EAST_AFRICA = 'middle_east_africa',
  GLOBAL = 'global'
}

/**
 * @enum ExperienceLevel - Experience level classifications
 */
export enum ExperienceLevel {
  ENTRY = 'entry',           // 0-2 years
  JUNIOR = 'junior',         // 2-5 years
  MID = 'mid',              // 5-8 years
  SENIOR = 'senior',         // 8-12 years
  LEAD = 'lead',            // 12-15 years
  EXECUTIVE = 'executive'    // 15+ years
}

/**
 * @interface SalaryBenchmark - Compensation benchmarking data
 */
export interface SalaryBenchmark {
  readonly role: string;
  readonly industry: IndustryType;
  readonly experienceLevel: ExperienceLevel;
  readonly companySize: CompanySize;
  readonly region: GeographicRegion;
  readonly currency: string;
  readonly baseSalary: {
    min: number;
    median: number;
    max: number;
    percentile25: number;
    percentile75: number;
    percentile90: number;
  };
  readonly totalCompensation: {
    min: number;
    median: number;
    max: number;
    percentile25: number;
    percentile75: number;
    percentile90: number;
  };
  readonly bonus: {
    average: number;
    percentage: number; // of base salary
  };
  readonly equity: {
    average: number;
    percentage: number; // of total comp
  };
  readonly benefits: {
    healthInsurance: boolean;
    retirementPlan: boolean;
    paidTimeOff: number; // days
    flexibleSchedule: boolean;
    remoteWork: boolean;
    learningBudget: number;
  };
  readonly dataSource: string;
  readonly sampleSize: number;
  readonly lastUpdated: Date;
  readonly confidence: number; // 0-100
}

/**
 * @interface MarketTrend - Industry trend analysis
 */
export interface MarketTrend {
  readonly id: string;
  readonly industry: IndustryType;
  readonly trend: string;
  readonly description: string;
  readonly impact: 'low' | 'medium' | 'high' | 'disruptive';
  readonly timeframe: string;
  readonly confidence: number; // 0-100
  readonly affectedRoles: string[];
  readonly opportunities: string[];
  readonly risks: string[];
  readonly requiredSkills: string[];
  readonly sources: string[];
  readonly lastUpdated: Date;
}

/**
 * @interface CompetitivePositioning - Individual market position
 */
export interface CompetitivePositioning {
  readonly overall: number; // 0-100 percentile
  readonly salary: number; // 0-100 percentile
  readonly skills: number; // 0-100 percentile
  readonly experience: number; // 0-100 percentile
  readonly achievements: number; // 0-100 percentile
  readonly marketDemand: number; // 0-100
  readonly careerVelocity: number; // 0-100
  readonly competitiveAdvantages: string[];
  readonly improvementAreas: string[];
  readonly marketValue: 'below_market' | 'at_market' | 'above_market' | 'top_performer';
  readonly lastCalculated: Date;
}

/**
 * @interface IndustryInsight - Market intelligence insights
 */
export interface IndustryInsight {
  readonly type: 'opportunity' | 'threat' | 'trend' | 'salary' | 'skills' | 'demand';
  readonly title: string;
  readonly description: string;
  readonly industry: IndustryType;
  readonly relevance: number; // 0-100
  readonly urgency: 'low' | 'medium' | 'high' | 'critical';
  readonly actionable: boolean;
  readonly recommendations: string[];
  readonly impactAreas: string[];
  readonly timeframe: string;
  readonly confidence: number; // 0-100
  readonly sources: string[];
  readonly generatedDate: Date;
  readonly expiryDate?: Date;
}

/**
 * @interface MarketOpportunity - Career and business opportunities
 */
export interface MarketOpportunity {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly industry: IndustryType;
  readonly type: 'job_opening' | 'skill_demand' | 'market_expansion' | 'technology_adoption' | 'investment_opportunity';
  readonly requirements: string[];
  readonly expectedROI: number; // 0-100
  readonly timeToRealize: number; // months
  readonly difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  readonly salaryImpact?: number; // percentage increase
  readonly careerImpact?: number; // 0-100
  readonly location?: string;
  readonly companySize?: CompanySize;
  readonly remoteAvailable: boolean;
  readonly matchScore: number; // 0-100 how well it matches user profile
  readonly deadline?: Date;
  readonly source: string;
  readonly lastUpdated: Date;
}

/**
 * @interface RoleAnalysis - Specific role market analysis
 */
export interface RoleAnalysis {
  readonly role: string;
  readonly industry: IndustryType;
  readonly demandTrend: 'declining' | 'stable' | 'growing' | 'high_demand' | 'critical_shortage';
  readonly growthRate: number; // percentage per year
  readonly jobOpenings: number;
  readonly competitionLevel: number; // 0-100
  readonly requiredSkills: Array<{
    skill: string;
    importance: number; // 0-100
    demand: number; // 0-100
    averageProficiency: number; // 0-100
  }>;
  readonly careerPaths: Array<{
    nextRole: string;
    timeframe: number; // months
    probability: number; // 0-100
    requirements: string[];
  }>;
  readonly geographicHotspots: Array<{
    location: string;
    demand: number; // 0-100
    averageSalary: number;
    costOfLiving: number; // 0-100
  }>;
  readonly industryStability: number; // 0-100
  readonly automationRisk: number; // 0-100
  readonly lastAnalyzed: Date;
}

/**
 * @class IndustryBenchmark - Enterprise Market Intelligence & Analysis
 */
export class IndustryBenchmark {
  private readonly _userId: string;
  private readonly _userIndustry: IndustryType;
  private readonly _userRole: string;
  private readonly _userExperience: ExperienceLevel;
  private readonly _userRegion: GeographicRegion;
  private _salaryBenchmarks: Map<string, SalaryBenchmark> = new Map();
  private _marketTrends: MarketTrend[] = [];
  private _positioning: CompetitivePositioning;
  private _insights: IndustryInsight[] = [];
  private _opportunities: MarketOpportunity[] = [];
  private _roleAnalysis: Map<string, RoleAnalysis> = new Map();
  private _lastUpdateDate: Date;
  private readonly _createdAt: Date;

  constructor(config: {
    userId: string;
    industry: IndustryType;
    role: string;
    experienceLevel: ExperienceLevel;
    region: GeographicRegion;
  }) {
    this._userId = config.userId;
    this._userIndustry = config.industry;
    this._userRole = config.role;
    this._userExperience = config.experienceLevel;
    this._userRegion = config.region;
    this._createdAt = new Date();
    this._lastUpdateDate = new Date();

    // Initialize default positioning
    this._positioning = {
      overall: 60,
      salary: 50,
      skills: 70,
      experience: 60,
      achievements: 50,
      marketDemand: 75,
      careerVelocity: 55,
      competitiveAdvantages: [],
      improvementAreas: [],
      marketValue: 'at_market',
      lastCalculated: new Date()
    };

    this.initializeMarketData();
  }

  // Getters
  get userId(): string { return this._userId; }
  get userIndustry(): IndustryType { return this._userIndustry; }
  get userRole(): string { return this._userRole; }
  get userExperience(): ExperienceLevel { return this._userExperience; }
  get userRegion(): GeographicRegion { return this._userRegion; }
  get salaryBenchmarks(): SalaryBenchmark[] { return Array.from(this._salaryBenchmarks.values()); }
  get marketTrends(): MarketTrend[] { return [...this._marketTrends]; }
  get positioning(): CompetitivePositioning { return { ...this._positioning }; }
  get insights(): IndustryInsight[] { return [...this._insights]; }
  get opportunities(): MarketOpportunity[] { return [...this._opportunities]; }
  get roleAnalyses(): RoleAnalysis[] { return Array.from(this._roleAnalysis.values()); }
  get lastUpdateDate(): Date { return this._lastUpdateDate; }

  // Market Analysis Methods

  /**
   * Gets salary benchmarks for specific role and experience level
   */
  getSalaryBenchmark(role?: string, experienceLevel?: ExperienceLevel): SalaryBenchmark | null {
    const targetRole = role || this._userRole;
    const targetLevel = experienceLevel || this._userExperience;
    const key = `${targetRole}_${targetLevel}_${this._userIndustry}_${this._userRegion}`;
    
    return this._salaryBenchmarks.get(key) || null;
  }

  /**
   * Compares user's compensation against market benchmarks
   */
  analyzeCompensation(currentSalary: number, currentTotalComp: number): {
    salaryPercentile: number;
    totalCompPercentile: number;
    marketGap: number;
    recommendations: string[];
    benchmarkData: SalaryBenchmark | null;
  } {
    const benchmark = this.getSalaryBenchmark();
    
    if (!benchmark) {
      return {
        salaryPercentile: 50,
        totalCompPercentile: 50,
        marketGap: 0,
        recommendations: ['Insufficient benchmark data available'],
        benchmarkData: null
      };
    }

    // Calculate percentiles
    const salaryPercentile = this.calculatePercentile(currentSalary, benchmark.baseSalary);
    const totalCompPercentile = this.calculatePercentile(currentTotalComp, benchmark.totalCompensation);
    
    // Calculate market gap
    const marketGap = ((benchmark.baseSalary.median - currentSalary) / benchmark.baseSalary.median) * 100;
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (salaryPercentile < 25) {
      recommendations.push('Your salary is significantly below market - consider negotiation or job change');
    } else if (salaryPercentile < 50) {
      recommendations.push('Your salary is below market median - research advancement opportunities');
    } else if (salaryPercentile > 75) {
      recommendations.push('Your salary is above market - focus on other compensation areas');
    }

    if (totalCompPercentile < salaryPercentile) {
      recommendations.push('Consider negotiating for better bonus/equity packages');
    }

    return {
      salaryPercentile,
      totalCompPercentile,
      marketGap,
      recommendations,
      benchmarkData: benchmark
    };
  }

  /**
   * Analyzes market trends relevant to user
   */
  getRelevantTrends(): MarketTrend[] {
    return this._marketTrends.filter(trend => 
      trend.industry === this._userIndustry ||
      trend.affectedRoles.includes(this._userRole)
    ).sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Finds market opportunities matching user profile
   */
  findOpportunities(filters?: {
    type?: MarketOpportunity['type'];
    minROI?: number;
    maxTimeframe?: number;
    remoteOnly?: boolean;
  }): MarketOpportunity[] {
    let opportunities = this._opportunities.filter(opp => 
      opp.industry === this._userIndustry
    );

    if (filters) {
      if (filters.type) {
        opportunities = opportunities.filter(opp => opp.type === filters.type);
      }
      if (filters.minROI) {
        opportunities = opportunities.filter(opp => opp.expectedROI >= filters.minROI);
      }
      if (filters.maxTimeframe) {
        opportunities = opportunities.filter(opp => opp.timeToRealize <= filters.maxTimeframe);
      }
      if (filters.remoteOnly) {
        opportunities = opportunities.filter(opp => opp.remoteAvailable);
      }
    }

    return opportunities.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
  }

  /**
   * Updates competitive positioning based on user profile
   */
  updatePositioning(userProfile: {
    salary: number;
    skills: string[];
    achievements: number;
    yearsExperience: number;
  }): void {
    const benchmark = this.getSalaryBenchmark();
    
    // Calculate salary positioning
    const salaryPercentile = benchmark 
      ? this.calculatePercentile(userProfile.salary, benchmark.baseSalary)
      : 50;

    // Calculate skills positioning (mock calculation)
    const skillsScore = Math.min(100, userProfile.skills.length * 5 + 40);

    // Calculate experience positioning
    const experienceScore = this.calculateExperienceScore(userProfile.yearsExperience);

    // Calculate achievements positioning
    const achievementsScore = Math.min(100, userProfile.achievements * 10 + 30);

    // Calculate overall positioning
    const overall = Math.round(
      (salaryPercentile * 0.3 + 
       skillsScore * 0.3 + 
       experienceScore * 0.2 + 
       achievementsScore * 0.2)
    );

    // Determine market value
    let marketValue: CompetitivePositioning['marketValue'];
    if (overall >= 80) marketValue = 'top_performer';
    else if (overall >= 60) marketValue = 'above_market';
    else if (overall >= 40) marketValue = 'at_market';
    else marketValue = 'below_market';

    // Identify competitive advantages and improvement areas
    const competitiveAdvantages: string[] = [];
    const improvementAreas: string[] = [];

    if (salaryPercentile > 75) competitiveAdvantages.push('Above-market compensation');
    else if (salaryPercentile < 25) improvementAreas.push('Salary negotiation needed');

    if (skillsScore > 80) competitiveAdvantages.push('Strong skill portfolio');
    else if (skillsScore < 60) improvementAreas.push('Skill development required');

    if (achievementsScore > 70) competitiveAdvantages.push('Strong track record');
    else improvementAreas.push('Build achievement portfolio');

    this._positioning = {
      overall,
      salary: salaryPercentile,
      skills: skillsScore,
      experience: experienceScore,
      achievements: achievementsScore,
      marketDemand: this.calculateMarketDemand(),
      careerVelocity: this.calculateCareerVelocity(userProfile.yearsExperience),
      competitiveAdvantages,
      improvementAreas,
      marketValue,
      lastCalculated: new Date()
    };

    this.generateInsights();
  }

  /**
   * Analyzes specific role in the market
   */
  analyzeRole(role: string): RoleAnalysis {
    const existingAnalysis = this._roleAnalysis.get(role);
    if (existingAnalysis && this.isAnalysisRecent(existingAnalysis.lastAnalyzed)) {
      return existingAnalysis;
    }

    // Generate new role analysis (mock data)
    const analysis: RoleAnalysis = {
      role,
      industry: this._userIndustry,
      demandTrend: this.calculateDemandTrend(role),
      growthRate: Math.random() * 20 - 5, // -5% to 15%
      jobOpenings: Math.floor(Math.random() * 10000) + 1000,
      competitionLevel: Math.floor(Math.random() * 50) + 50,
      requiredSkills: this.getRequiredSkillsForRole(role),
      careerPaths: this.getCareerPathsForRole(role),
      geographicHotspots: this.getGeographicHotspotsForRole(role),
      industryStability: Math.floor(Math.random() * 30) + 70,
      automationRisk: Math.floor(Math.random() * 40) + 10,
      lastAnalyzed: new Date()
    };

    this._roleAnalysis.set(role, analysis);
    return analysis;
  }

  /**
   * Generates personalized market insights
   */
  generateMarketInsights(): IndustryInsight[] {
    const insights: IndustryInsight[] = [];

    // Salary insight
    const benchmark = this.getSalaryBenchmark();
    if (benchmark && this._positioning.salary < 50) {
      insights.push({
        type: 'salary',
        title: 'Below Market Compensation',
        description: `Your current compensation is below the ${this._positioning.salary}th percentile for your role`,
        industry: this._userIndustry,
        relevance: 90,
        urgency: 'high',
        actionable: true,
        recommendations: [
          'Research salary ranges for your role',
          'Prepare for salary negotiation',
          'Consider job market opportunities'
        ],
        impactAreas: ['Compensation', 'Career Growth'],
        timeframe: '3-6 months',
        confidence: 85,
        sources: ['Market Salary Data'],
        generatedDate: new Date()
      });
    }

    // Skills demand insight
    if (this._positioning.skills < 70) {
      insights.push({
        type: 'skills',
        title: 'Skills Gap Identified',
        description: 'Your skill portfolio may not align with current market demands',
        industry: this._userIndustry,
        relevance: 85,
        urgency: 'medium',
        actionable: true,
        recommendations: [
          'Assess in-demand skills for your industry',
          'Invest in skill development programs',
          'Obtain relevant certifications'
        ],
        impactAreas: ['Market Value', 'Career Advancement'],
        timeframe: '6-12 months',
        confidence: 75,
        sources: ['Skills Demand Analysis'],
        generatedDate: new Date()
      });
    }

    // Market trend insights
    const relevantTrends = this.getRelevantTrends().slice(0, 2);
    for (const trend of relevantTrends) {
      if (trend.impact === 'high' || trend.impact === 'disruptive') {
        insights.push({
          type: 'trend',
          title: `Industry Trend: ${trend.trend}`,
          description: trend.description,
          industry: trend.industry,
          relevance: 80,
          urgency: trend.impact === 'disruptive' ? 'critical' : 'high',
          actionable: true,
          recommendations: trend.opportunities,
          impactAreas: ['Industry Knowledge', 'Strategic Planning'],
          timeframe: trend.timeframe,
          confidence: trend.confidence,
          sources: trend.sources,
          generatedDate: new Date()
        });
      }
    }

    return insights.slice(0, 5); // Top 5 insights
  }

  // Private helper methods
  private initializeMarketData(): void {
    // Initialize with mock salary benchmarks
    this.addSalaryBenchmark({
      role: this._userRole,
      industry: this._userIndustry,
      experienceLevel: this._userExperience,
      companySize: CompanySize.MEDIUM,
      region: this._userRegion,
      currency: 'USD',
      baseSalary: {
        min: 80000,
        median: 120000,
        max: 180000,
        percentile25: 100000,
        percentile75: 150000,
        percentile90: 170000
      },
      totalCompensation: {
        min: 90000,
        median: 140000,
        max: 220000,
        percentile25: 115000,
        percentile75: 180000,
        percentile90: 200000
      },
      bonus: { average: 15000, percentage: 12 },
      equity: { average: 20000, percentage: 15 },
      benefits: {
        healthInsurance: true,
        retirementPlan: true,
        paidTimeOff: 25,
        flexibleSchedule: true,
        remoteWork: true,
        learningBudget: 3000
      },
      dataSource: 'Market Research 2024',
      sampleSize: 1250,
      lastUpdated: new Date(),
      confidence: 85
    });

    // Initialize market trends
    this._marketTrends = this.getDefaultMarketTrends();
    
    // Initialize opportunities
    this._opportunities = this.getDefaultOpportunities();
    
    // Generate initial insights
    this._insights = this.generateMarketInsights();
  }

  private addSalaryBenchmark(benchmark: SalaryBenchmark): void {
    const key = `${benchmark.role}_${benchmark.experienceLevel}_${benchmark.industry}_${benchmark.region}`;
    this._salaryBenchmarks.set(key, benchmark);
  }

  private calculatePercentile(value: number, distribution: { min: number; max: number; median: number; percentile25: number; percentile75: number; }): number {
    if (value <= distribution.min) return 0;
    if (value >= distribution.max) return 100;
    if (value <= distribution.percentile25) return (value - distribution.min) / (distribution.percentile25 - distribution.min) * 25;
    if (value <= distribution.median) return 25 + (value - distribution.percentile25) / (distribution.median - distribution.percentile25) * 25;
    if (value <= distribution.percentile75) return 50 + (value - distribution.median) / (distribution.percentile75 - distribution.median) * 25;
    return 75 + (value - distribution.percentile75) / (distribution.max - distribution.percentile75) * 25;
  }

  private calculateExperienceScore(years: number): number {
    const experienceMapping = {
      [ExperienceLevel.ENTRY]: 2,
      [ExperienceLevel.JUNIOR]: 5,
      [ExperienceLevel.MID]: 8,
      [ExperienceLevel.SENIOR]: 12,
      [ExperienceLevel.LEAD]: 15,
      [ExperienceLevel.EXECUTIVE]: 20
    };

    const expectedYears = experienceMapping[this._userExperience];
    return Math.min(100, (years / expectedYears) * 100);
  }

  private calculateMarketDemand(): number {
    // Mock calculation based on industry and role
    const demandMap = {
      [IndustryType.TECHNOLOGY]: 85,
      [IndustryType.HEALTHCARE]: 80,
      [IndustryType.FINANCE]: 75,
      [IndustryType.EDUCATION]: 60,
      [IndustryType.RETAIL]: 50
    };

    return demandMap[this._userIndustry] || 65;
  }

  private calculateCareerVelocity(years: number): number {
    const expectedProgressions = Math.floor(years / 3); // One progression every 3 years
    return Math.min(100, expectedProgressions * 25 + 25);
  }

  private calculateDemandTrend(role: string): RoleAnalysis['demandTrend'] {
    // Mock calculation
    const trends = ['declining', 'stable', 'growing', 'high_demand', 'critical_shortage'] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  }

  private getRequiredSkillsForRole(role: string): RoleAnalysis['requiredSkills'] {
    // Mock required skills
    return [
      { skill: 'JavaScript', importance: 90, demand: 85, averageProficiency: 70 },
      { skill: 'React', importance: 85, demand: 80, averageProficiency: 65 },
      { skill: 'Node.js', importance: 75, demand: 75, averageProficiency: 60 },
      { skill: 'Problem Solving', importance: 95, demand: 90, averageProficiency: 75 },
      { skill: 'Communication', importance: 80, demand: 85, averageProficiency: 70 }
    ];
  }

  private getCareerPathsForRole(role: string): RoleAnalysis['careerPaths'] {
    return [
      { nextRole: 'Senior Developer', timeframe: 24, probability: 70, requirements: ['Leadership skills', 'Advanced technical skills'] },
      { nextRole: 'Tech Lead', timeframe: 36, probability: 50, requirements: ['Team leadership', 'Architecture skills'] },
      { nextRole: 'Engineering Manager', timeframe: 48, probability: 30, requirements: ['Management training', 'People skills'] }
    ];
  }

  private getGeographicHotspotsForRole(role: string): RoleAnalysis['geographicHotspots'] {
    return [
      { location: 'San Francisco', demand: 95, averageSalary: 150000, costOfLiving: 95 },
      { location: 'New York', demand: 90, averageSalary: 140000, costOfLiving: 90 },
      { location: 'Seattle', demand: 85, averageSalary: 130000, costOfLiving: 80 },
      { location: 'Austin', demand: 80, averageSalary: 110000, costOfLiving: 70 }
    ];
  }

  private getDefaultMarketTrends(): MarketTrend[] {
    return [
      {
        id: 'ai_automation_2024',
        industry: IndustryType.TECHNOLOGY,
        trend: 'AI Automation Acceleration',
        description: 'Rapid adoption of AI tools is transforming software development workflows',
        impact: 'disruptive',
        timeframe: '2024-2026',
        confidence: 90,
        affectedRoles: ['Software Developer', 'Data Analyst', 'QA Engineer'],
        opportunities: ['Learn AI/ML tools', 'Specialize in AI integration', 'Develop AI strategy skills'],
        risks: ['Routine coding tasks automation', 'Skill obsolescence'],
        requiredSkills: ['Machine Learning', 'AI Prompt Engineering', 'Python'],
        sources: ['Industry Reports', 'Job Market Analysis'],
        lastUpdated: new Date()
      }
    ];
  }

  private getDefaultOpportunities(): MarketOpportunity[] {
    return [
      {
        id: 'remote_dev_2024',
        title: 'Remote Developer Opportunities',
        description: 'Increased demand for remote software developers across multiple industries',
        industry: this._userIndustry,
        type: 'job_opening',
        requirements: ['3+ years experience', 'Strong communication skills', 'Remote work experience'],
        expectedROI: 75,
        timeToRealize: 3,
        difficulty: 'medium',
        salaryImpact: 15,
        careerImpact: 70,
        remoteAvailable: true,
        matchScore: 85,
        source: 'Job Market Analysis',
        lastUpdated: new Date()
      }
    ];
  }

  private isAnalysisRecent(date: Date): boolean {
    const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < 30; // Analysis valid for 30 days
  }

  private generateInsights(): void {
    this._insights = this.generateMarketInsights();
    this._lastUpdateDate = new Date();
  }

  // Serialization
  toJSON(): Record<string, any> {
    return {
      userId: this._userId,
      userIndustry: this._userIndustry,
      userRole: this._userRole,
      userExperience: this._userExperience,
      userRegion: this._userRegion,
      salaryBenchmarks: Array.from(this._salaryBenchmarks.entries()),
      marketTrends: this._marketTrends,
      positioning: this._positioning,
      insights: this._insights,
      opportunities: this._opportunities,
      roleAnalysis: Array.from(this._roleAnalysis.entries()),
      lastUpdateDate: this._lastUpdateDate.toISOString(),
      createdAt: this._createdAt.toISOString()
    };
  }

  static fromJSON(data: any): IndustryBenchmark {
    const benchmark = new IndustryBenchmark({
      userId: data.userId,
      industry: data.userIndustry,
      role: data.userRole,
      experienceLevel: data.userExperience,
      region: data.userRegion
    });

    if (data.salaryBenchmarks) {
      for (const [key, value] of data.salaryBenchmarks) {
        benchmark._salaryBenchmarks.set(key, value);
      }
    }
    if (data.marketTrends) benchmark._marketTrends = data.marketTrends;
    if (data.positioning) benchmark._positioning = data.positioning;
    if (data.insights) benchmark._insights = data.insights;
    if (data.opportunities) benchmark._opportunities = data.opportunities;
    if (data.roleAnalysis) {
      for (const [key, value] of data.roleAnalysis) {
        benchmark._roleAnalysis.set(key, value);
      }
    }
    if (data.lastUpdateDate) benchmark._lastUpdateDate = new Date(data.lastUpdateDate);

    return benchmark;
  }
}

export const createIndustryBenchmark = (config: {
  userId: string;
  industry: IndustryType;
  role: string;
  experienceLevel: ExperienceLevel;
  region: GeographicRegion;
}): IndustryBenchmark => {
  return new IndustryBenchmark(config);
};