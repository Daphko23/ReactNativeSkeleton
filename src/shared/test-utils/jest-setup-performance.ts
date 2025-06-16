/**
 * @fileoverview PERFORMANCE TESTING SETUP - Enterprise Industry Standard 2025
 * 
 * @description Advanced performance testing utilities for React Native:
 * - Memory Leak Detection
 * - React Profiler Integration
 * - Performance Benchmarking
 * - Render Performance Monitoring
 * - Hook Performance Analysis
 * - Memory Usage Tracking
 * - Load Testing Utilities
 * 
 * @version 2025.1.0
 * @since Enterprise Industry Standard 2025
 */

import { act } from '@testing-library/react-native';

// ============================================================================
// PERFORMANCE MONITORING GLOBALS
// ============================================================================

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  componentCount: number;
  hookExecutionTime: number;
  reRenderCount: number;
}

interface PerformanceThresholds {
  maxRenderTime: number;
  maxMemoryIncrease: number;
  maxReRenders: number;
  maxHookExecutionTime: number;
}

// Default performance thresholds for enterprise applications
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  maxRenderTime: 100, // 100ms
  maxMemoryIncrease: 10 * 1024 * 1024, // 10MB
  maxReRenders: 5,
  maxHookExecutionTime: 50, // 50ms
};

// ============================================================================
// MEMORY LEAK DETECTION
// ============================================================================

class MemoryLeakDetector {
  private initialMemory: NodeJS.MemoryUsage = process.memoryUsage();
  private samples: NodeJS.MemoryUsage[] = [];
  private isTracking = false;

  startTracking(): void {
    this.isTracking = true;
    this.initialMemory = process.memoryUsage();
    this.samples = [this.initialMemory];
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }

  recordSample(): void {
    if (!this.isTracking) return;
    
    if (global.gc) {
      global.gc();
    }
    
    this.samples.push(process.memoryUsage());
  }

  stopTracking(): PerformanceMetrics['memoryUsage'] {
    this.isTracking = false;
    
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage();
    this.samples.push(finalMemory);
    
    return finalMemory;
  }

  getMemoryIncrease(): number {
    if (this.samples.length < 2) return 0;
    
    const initial = this.samples[0];
    const final = this.samples[this.samples.length - 1];
    
    return final.heapUsed - initial.heapUsed;
  }

  hasMemoryLeak(threshold: number = DEFAULT_THRESHOLDS.maxMemoryIncrease): boolean {
    return this.getMemoryIncrease() > threshold;
  }

  generateReport(): string {
    const increase = this.getMemoryIncrease();
    const samples = this.samples.length;
    
    return `Memory Report:
    - Samples taken: ${samples}
    - Memory increase: ${(increase / 1024 / 1024).toFixed(2)}MB
    - Threshold: ${(DEFAULT_THRESHOLDS.maxMemoryIncrease / 1024 / 1024).toFixed(2)}MB
    - Leak detected: ${this.hasMemoryLeak() ? 'YES' : 'NO'}`;
  }
}

// ============================================================================
// REACT PROFILER INTEGRATION
// ============================================================================

class ReactProfiler {
  private renderMetrics: Array<{
    id: string;
    phase: 'mount' | 'update';
    actualDuration: number;
    baseDuration: number;
    startTime: number;
    commitTime: number;
  }> = [];

  onRender = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
  ): void => {
    this.renderMetrics.push({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    });
  };

  getAverageRenderTime(): number {
    if (this.renderMetrics.length === 0) return 0;
    
    const total = this.renderMetrics.reduce((sum, metric) => sum + metric.actualDuration, 0);
    return total / this.renderMetrics.length;
  }

  getSlowRenders(threshold: number = DEFAULT_THRESHOLDS.maxRenderTime): typeof this.renderMetrics {
    return this.renderMetrics.filter(metric => metric.actualDuration > threshold);
  }

  getRenderCount(): number {
    return this.renderMetrics.length;
  }

  reset(): void {
    this.renderMetrics = [];
  }

  generateReport(): string {
    const avgTime = this.getAverageRenderTime();
    const slowRenders = this.getSlowRenders();
    const totalRenders = this.getRenderCount();
    
    return `Render Performance Report:
    - Total renders: ${totalRenders}
    - Average render time: ${avgTime.toFixed(2)}ms
    - Slow renders (>${DEFAULT_THRESHOLDS.maxRenderTime}ms): ${slowRenders.length}
    - Performance threshold met: ${slowRenders.length === 0 ? 'YES' : 'NO'}`;
  }
}

// ============================================================================
// HOOK PERFORMANCE MONITORING
// ============================================================================

class HookPerformanceMonitor {
  private hookMetrics = new Map<string, {
    executionTimes: number[];
    callCount: number;
    averageTime: number;
  }>();

  measureHook<T>(hookName: string, hookFn: () => T): T {
    const startTime = performance.now();
    
    try {
      const result = hookFn();
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      this.recordHookExecution(hookName, executionTime);
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      this.recordHookExecution(hookName, executionTime);
      throw error;
    }
  }

  private recordHookExecution(hookName: string, executionTime: number): void {
    const existing = this.hookMetrics.get(hookName) || {
      executionTimes: [],
      callCount: 0,
      averageTime: 0,
    };

    existing.executionTimes.push(executionTime);
    existing.callCount++;
    existing.averageTime = existing.executionTimes.reduce((sum, time) => sum + time, 0) / existing.callCount;

    this.hookMetrics.set(hookName, existing);
  }

  getHookMetrics(hookName: string) {
    return this.hookMetrics.get(hookName);
  }

  getSlowHooks(threshold: number = DEFAULT_THRESHOLDS.maxHookExecutionTime): Array<[string, any]> {
    return Array.from(this.hookMetrics.entries())
      .filter(([, metrics]) => metrics.averageTime > threshold);
  }

  reset(): void {
    this.hookMetrics.clear();
  }

  generateReport(): string {
    const slowHooks = this.getSlowHooks();
    const totalHooks = this.hookMetrics.size;
    
    return `Hook Performance Report:
    - Total hooks monitored: ${totalHooks}
    - Slow hooks (>${DEFAULT_THRESHOLDS.maxHookExecutionTime}ms): ${slowHooks.length}
    - Hook performance threshold met: ${slowHooks.length === 0 ? 'YES' : 'NO'}`;
  }
}

// ============================================================================
// PERFORMANCE TEST UTILITIES
// ============================================================================

class PerformanceTestSuite {
  private memoryDetector = new MemoryLeakDetector();
  private profiler = new ReactProfiler();
  private hookMonitor = new HookPerformanceMonitor();
  private testName = '';

  startPerformanceTest(testName: string): void {
    this.testName = testName;
    this.memoryDetector.startTracking();
    this.profiler.reset();
    this.hookMonitor.reset();
  }

  recordCheckpoint(): void {
    this.memoryDetector.recordSample();
  }

  async measureAsyncOperation<T>(operation: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    this.recordCheckpoint();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      
      this.recordCheckpoint();
      
      console.log(`Async operation completed in ${(endTime - startTime).toFixed(2)}ms`);
      return result;
    } catch (error) {
      this.recordCheckpoint();
      throw error;
    }
  }

  measureRenderPerformance<T>(renderFn: () => T): T {
    const startTime = performance.now();
    
    const result = renderFn();
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > DEFAULT_THRESHOLDS.maxRenderTime) {
      console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms (threshold: ${DEFAULT_THRESHOLDS.maxRenderTime}ms)`);
    }
    
    return result;
  }

  finishPerformanceTest(): PerformanceMetrics {
    const finalMemory = this.memoryDetector.stopTracking();
    
    const metrics: PerformanceMetrics = {
      renderTime: this.profiler.getAverageRenderTime(),
      memoryUsage: finalMemory,
      componentCount: this.profiler.getRenderCount(),
      hookExecutionTime: 0, // Will be calculated from hook monitor
      reRenderCount: this.profiler.getRenderCount(),
    };

    return metrics;
  }

  validatePerformance(customThresholds?: Partial<PerformanceThresholds>): {
    passed: boolean;
    report: string;
    violations: string[];
  } {
    const thresholds = { ...DEFAULT_THRESHOLDS, ...customThresholds };
    const violations: string[] = [];

    // Check memory leaks
    if (this.memoryDetector.hasMemoryLeak(thresholds.maxMemoryIncrease)) {
      violations.push(`Memory leak detected: ${(this.memoryDetector.getMemoryIncrease() / 1024 / 1024).toFixed(2)}MB increase`);
    }

    // Check render performance
    const slowRenders = this.profiler.getSlowRenders(thresholds.maxRenderTime);
    if (slowRenders.length > 0) {
      violations.push(`${slowRenders.length} slow renders detected (>${thresholds.maxRenderTime}ms)`);
    }

    // Check hook performance
    const slowHooks = this.hookMonitor.getSlowHooks(thresholds.maxHookExecutionTime);
    if (slowHooks.length > 0) {
      violations.push(`${slowHooks.length} slow hooks detected (>${thresholds.maxHookExecutionTime}ms)`);
    }

    const report = `
Performance Test Report - ${this.testName}
============================================
${this.memoryDetector.generateReport()}

${this.profiler.generateReport()}

${this.hookMonitor.generateReport()}

Violations: ${violations.length}
${violations.map(v => `- ${v}`).join('\n')}
    `.trim();

    return {
      passed: violations.length === 0,
      report,
      violations,
    };
  }
}

// ============================================================================
// GLOBAL PERFORMANCE UTILITIES
// ============================================================================

// Global performance test suite instance
let globalPerformanceSuite: PerformanceTestSuite;

// Performance test utilities
global.performance = global.performance || {};

/**
 * Start a performance test for the current test case
 */
global.startPerformanceTest = (testName: string): void => {
  globalPerformanceSuite = new PerformanceTestSuite();
  globalPerformanceSuite.startPerformanceTest(testName);
};

/**
 * Record a performance checkpoint
 */
global.recordPerformanceCheckpoint = (): void => {
  if (globalPerformanceSuite) {
    globalPerformanceSuite.recordCheckpoint();
  }
};

/**
 * Measure async operation performance
 */
global.measureAsyncPerformance = async <T>(operation: () => Promise<T>): Promise<T> => {
  if (globalPerformanceSuite) {
    return globalPerformanceSuite.measureAsyncOperation(operation);
  }
  return operation();
};

/**
 * Measure render performance
 */
global.measureRenderPerformance = <T>(renderFn: () => T): T => {
  if (globalPerformanceSuite) {
    return globalPerformanceSuite.measureRenderPerformance(renderFn);
  }
  return renderFn();
};

/**
 * Finish performance test and validate results
 */
global.finishPerformanceTest = (customThresholds?: Partial<PerformanceThresholds>) => {
  if (!globalPerformanceSuite) {
    throw new Error('Performance test not started. Call startPerformanceTest() first.');
  }

  const result = globalPerformanceSuite.validatePerformance(customThresholds);
  
  if (!result.passed) {
    console.warn('Performance test failed:', result.report);
  }

  return result;
};

/**
 * Enhanced act utility with performance monitoring
 */
global.actWithPerformance = async (fn: () => void | Promise<void>): Promise<void> => {
  const startTime = performance.now();
  
  await act(async () => {
    if (globalPerformanceSuite) {
      globalPerformanceSuite.recordCheckpoint();
    }
    
    await fn();
    
    if (globalPerformanceSuite) {
      globalPerformanceSuite.recordCheckpoint();
    }
  });
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (duration > DEFAULT_THRESHOLDS.maxRenderTime) {
    console.warn(`Slow act() detected: ${duration.toFixed(2)}ms`);
  }
};

// ============================================================================
// ENHANCED TYPE DECLARATIONS
// ============================================================================

declare global {
  function startPerformanceTest(testName: string): void;
  function recordPerformanceCheckpoint(): void;
  function measureAsyncPerformance<T>(operation: () => Promise<T>): Promise<T>;
  function measureRenderPerformance<T>(renderFn: () => T): T;
  function finishPerformanceTest(customThresholds?: Partial<PerformanceThresholds>): {
    passed: boolean;
    report: string;
    violations: string[];
  };
  function actWithPerformance(fn: () => void | Promise<void>): Promise<void>;
}

// ============================================================================
// PERFORMANCE TEST CLEANUP
// ============================================================================

// Cleanup after each test
afterEach(() => {
  if (globalPerformanceSuite) {
    const result = globalPerformanceSuite.validatePerformance();
    
    if (!result.passed && process.env.JEST_PERFORMANCE_STRICT === 'true') {
      throw new Error(`Performance test failed: ${result.violations.join(', ')}`);
    }
  }
  
  globalPerformanceSuite = undefined as any;
});

export {
  MemoryLeakDetector,
  ReactProfiler,
  HookPerformanceMonitor,
  PerformanceTestSuite,
  DEFAULT_THRESHOLDS,
  type PerformanceMetrics,
  type PerformanceThresholds,
}; 