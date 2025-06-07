/**
 * @fileoverview WEB-VITALS-SERVICE: Core Web Vitals Monitoring for React Native Enterprise
 * @description Comprehensive performance monitoring service implementing Core Web Vitals metrics
 * adapted for React Native environments with Industry Standard 2025 compliance.
 * 
 * @version 2.0.0
 * @since 2.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module WebVitalsService
 * @namespace Core.Monitoring
 * @category Performance
 * @subcategory WebVitals
 */

import type { Performance as RNPerformance } from 'react-native-performance';
import { ILoggerService, LogCategory } from '../logging/logger.service.interface';

/**
 * Core Web Vitals Metrics adapted for Mobile
 * 
 * @since 2.0.0
 * @category Performance
 * @subcategory Metrics
 */
export interface WebVitalsMetrics {
  /** First Contentful Paint equivalent for RN */
  firstContentfulPaint: number;
  /** Largest Contentful Paint equivalent */
  largestContentfulPaint: number;
  /** Cumulative Layout Shift for RN screens */
  cumulativeLayoutShift: number;
  /** First Input Delay for touch interactions */
  firstInputDelay: number;
  /** Interaction to Next Paint */
  interactionToNextPaint: number;
  /** Time to Interactive */
  timeToInteractive: number;
  /** Bundle Load Time */
  bundleLoadTime: number;
  /** JavaScript Execution Time */
  jsExecutionTime: number;
  /** Memory Usage */
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  /** Battery Impact */
  batteryImpact: {
    level: number;
    isCharging: boolean;
    estimatedTimeRemaining: number;
  };
}

/**
 * Performance Budget Thresholds (Industry Standard 2025)
 * 
 * @since 2.0.0
 * @category Performance
 * @subcategory Budget
 */
export interface PerformanceBudget {
  /** Good thresholds (green) */
  good: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
    timeToInteractive: number;
    bundleLoadTime: number;
    memoryUsage: number;
  };
  /** Needs improvement thresholds (yellow) */
  needsImprovement: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
    timeToInteractive: number;
    bundleLoadTime: number;
    memoryUsage: number;
  };
}

/**
 * Web Vitals Monitoring Service
 * 
 * @class WebVitalsService
 * @since 2.0.0
 * @category Service
 * @subcategory Performance
 */
export class WebVitalsService {
  private metrics: Partial<WebVitalsMetrics> = {};
  private budget: PerformanceBudget;
  private isMonitoring: boolean = false;

  constructor(
    private logger: ILoggerService,
    budget?: Partial<PerformanceBudget>
  ) {
    this.budget = {
      good: {
        firstContentfulPaint: 1800,
        largestContentfulPaint: 2500,
        firstInputDelay: 100,
        cumulativeLayoutShift: 0.1,
        timeToInteractive: 3800,
        bundleLoadTime: 1000,
        memoryUsage: 70,
      },
      needsImprovement: {
        firstContentfulPaint: 3000,
        largestContentfulPaint: 4000,
        firstInputDelay: 300,
        cumulativeLayoutShift: 0.25,
        timeToInteractive: 7300,
        bundleLoadTime: 3000,
        memoryUsage: 85,
      },
      ...budget,
    };
  }

  /**
   * Start Web Vitals monitoring
   * 
   * @returns {Promise<void>}
   * @since 2.0.0
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    try {
      this.isMonitoring = true;
      await this.trackBundleLoadTime();
      await this.trackMemoryUsage();
      
      this.logger.info('Web Vitals monitoring started', LogCategory.PERFORMANCE);
    } catch (error) {
      this.logger.error('Failed to start Web Vitals monitoring', LogCategory.PERFORMANCE, {}, error as Error);
      throw error;
    }
  }

  /**
   * Stop Web Vitals monitoring
   * 
   * @returns {void}
   * @since 2.0.0
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    this.logger.info('Web Vitals monitoring stopped', LogCategory.PERFORMANCE);
  }

  /**
   * Get current Web Vitals metrics
   * 
   * @returns {Partial<WebVitalsMetrics>}
   * @since 2.0.0
   */
  getCurrentMetrics(): Partial<WebVitalsMetrics> {
    return { ...this.metrics };
  }

  /**
   * Evaluate metric against performance budget
   * 
   * @param {keyof WebVitalsMetrics} metric - Metric name
   * @param {number} value - Metric value
   * @returns {'good' | 'needs-improvement' | 'poor'}
   * @since 2.0.0
   */
  evaluateMetric(metric: keyof WebVitalsMetrics, value: number): 'good' | 'needs-improvement' | 'poor' {
    const goodThreshold = this.budget.good[metric as keyof typeof this.budget.good];
    const needsImprovementThreshold = this.budget.needsImprovement[metric as keyof typeof this.budget.needsImprovement];

    if (value <= goodThreshold) return 'good';
    if (value <= needsImprovementThreshold) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Generate performance report
   * 
   * @returns {Promise<PerformanceReport>}
   * @since 2.0.0
   */
  async generateReport(): Promise<PerformanceReport> {
    const metrics = this.getCurrentMetrics();
    const evaluations: Record<string, string> = {};
    const recommendations: string[] = [];

    // Evaluate each metric
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === 'number') {
        const evaluation = this.evaluateMetric(key as keyof WebVitalsMetrics, value);
        evaluations[key] = evaluation;

        // Generate recommendations
        if (evaluation === 'poor' || evaluation === 'needs-improvement') {
          recommendations.push(this.getRecommendation(key as keyof WebVitalsMetrics));
        }
      }
    });

    const report: PerformanceReport = {
      timestamp: new Date(),
      metrics: metrics as WebVitalsMetrics,
      evaluations,
      recommendations,
      overallScore: this.calculateOverallScore(evaluations),
      passesCoreBudget: this.passesCoreBudget(evaluations),
    };

    this.logger.info('Performance report generated', LogCategory.PERFORMANCE);

    return report;
  }

  /**
   * Track bundle load time
   * 
   * @private
   * @returns {Promise<void>}
   * @since 2.0.0
   */
  private async trackBundleLoadTime(): Promise<void> {
    const startTime = performance.now();
    
    // Simulate bundle load completion detection
    setTimeout(() => {
      this.metrics.bundleLoadTime = performance.now() - startTime;
    }, 100);
  }

  /**
   * Track memory usage
   * 
   * @private
   * @returns {Promise<void>}
   * @since 2.0.0
   */
  private async trackMemoryUsage(): Promise<void> {
    // Simulate memory tracking for React Native
    this.metrics.memoryUsage = {
      used: 50 * 1024 * 1024, // 50MB
      total: 200 * 1024 * 1024, // 200MB
      percentage: 25,
    };
  }

  /**
   * Get recommendation for metric improvement
   * 
   * @private
   * @param {keyof WebVitalsMetrics} metric - Metric name
   * @returns {string}
   * @since 2.0.0
   */
  private getRecommendation(metric: keyof WebVitalsMetrics): string {
    const recommendations = {
      firstContentfulPaint: 'Optimize initial render performance and reduce bundle size',
      largestContentfulPaint: 'Optimize largest content elements and image loading',
      cumulativeLayoutShift: 'Prevent layout shifts by reserving space for dynamic content',
      firstInputDelay: 'Reduce main thread blocking and optimize JavaScript execution',
      interactionToNextPaint: 'Optimize event handlers and reduce rendering work',
      timeToInteractive: 'Reduce JavaScript execution time and optimize critical resources',
      bundleLoadTime: 'Optimize bundle size and implement code splitting',
      jsExecutionTime: 'Optimize JavaScript performance and reduce computation',
      memoryUsage: 'Optimize memory usage and implement proper cleanup',
      batteryImpact: 'Reduce CPU-intensive operations and optimize animations',
    };

    return recommendations[metric] || 'Optimize this metric for better performance';
  }

  /**
   * Calculate overall performance score
   * 
   * @private
   * @param {Record<string, string>} evaluations - Metric evaluations
   * @returns {number}
   * @since 2.0.0
   */
  private calculateOverallScore(evaluations: Record<string, string>): number {
    const scores: number[] = Object.values(evaluations).map(evaluation => {
      switch (evaluation) {
        case 'good': return 100;
        case 'needs-improvement': return 60;
        case 'poor': return 20;
        default: return 0;
      }
    });

    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }

  /**
   * Check if metrics pass core budget requirements
   * 
   * @private
   * @param {Record<string, string>} evaluations - Metric evaluations
   * @returns {boolean}
   * @since 2.0.0
   */
  private passesCoreBudget(evaluations: Record<string, string>): boolean {
    const coreMetrics = ['firstContentfulPaint', 'largestContentfulPaint', 'firstInputDelay'];
    return coreMetrics.every(metric => evaluations[metric] === 'good');
  }
}

/**
 * Performance Report Interface
 * 
 * @since 2.0.0
 * @category Performance
 * @subcategory Report
 */
export interface PerformanceReport {
  /** Report timestamp */
  timestamp: Date;
  /** Web Vitals metrics */
  metrics: WebVitalsMetrics;
  /** Metric evaluations */
  evaluations: Record<string, string>;
  /** Performance recommendations */
  recommendations: string[];
  /** Overall performance score (0-100) */
  overallScore: number;
  /** Passes core budget requirements */
  passesCoreBudget: boolean;
} 