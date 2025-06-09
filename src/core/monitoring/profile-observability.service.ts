/**
 * Profile Observability Service - Enterprise Monitoring
 * Provides comprehensive observability for Profile feature operations
 * Including metrics, traces, structured logging, and performance monitoring
 */

import {
  ILoggerService,
  LogCategory,
  LogContext,
  PerformanceLogData,
} from '../logging/logger.service.interface';
import { ConsoleLogger } from '../logging/console.logger';

// Observability Types
export interface MetricData {
  name: string;
  value: number;
  unit: 'count' | 'duration' | 'bytes' | 'percentage';
  tags: Record<string, string>;
  timestamp: Date;
}

export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  tags: Record<string, any>;
  status: 'success' | 'error' | 'timeout';
  error?: Error;
}

export interface StructuredLogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  correlationId: string;
  userId?: string;
  operation: string;
  duration?: number;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface ProfileMetrics {
  // Performance Metrics
  profileLoadTime: number;
  profileUpdateTime: number;
  avatarUploadTime: number;
  
  // Business Metrics
  profileCompletionRate: number;
  avatarUploadSuccess: number;
  privacySettingsUpdates: number;
  
  // Error Metrics
  profileLoadErrors: number;
  profileUpdateErrors: number;
  validationErrors: number;
}

export class ProfileObservabilityService {
  private logger: ILoggerService;
  private metrics: Map<string, MetricData[]> = new Map();
  private traces: Map<string, TraceSpan[]> = new Map();
  private activeSpans: Map<string, TraceSpan> = new Map();

  constructor(logger?: ILoggerService) {
    this.logger = logger || new ConsoleLogger();
  }

  // =============================================
  // PERFORMANCE MONITORING
  // =============================================

  /**
   * Start performance monitoring for profile operations
   */
  startProfileOperation(
    operation: 'load' | 'update' | 'delete' | 'avatar_upload' | 'privacy_update',
    userId: string,
    metadata: Record<string, any> = {}
  ): string {
    const correlationId = this.generateCorrelationId();
    const traceId = this.generateTraceId();
    
    const span: TraceSpan = {
      traceId,
      spanId: this.generateSpanId(),
      operationName: `profile.${operation}`,
      startTime: new Date(),
      tags: {
        userId,
        operation,
        feature: 'profile',
        ...metadata
      },
      status: 'success'
    };

    this.activeSpans.set(correlationId, span);
    
    // Use the proper logger interface
    const context: LogContext = {
      correlationId,
      userId,
      traceId,
      spanId: span.spanId,
      metadata: {
        operation,
        ...metadata
      }
    };
    
    this.logger.info(`Profile operation started: ${operation}`, LogCategory.PERFORMANCE, context);

    return correlationId;
  }

  /**
   * End performance monitoring and record metrics
   */
  endProfileOperation(
    correlationId: string,
    status: 'success' | 'error' | 'timeout' = 'success',
    error?: Error,
    result?: any
  ): void {
    const span = this.activeSpans.get(correlationId);
    if (!span) {
      this.logger.warn('No active span found for correlation ID', LogCategory.PERFORMANCE, {
        correlationId,
        metadata: { operation: 'span_lookup_failed' }
      });
      return;
    }

    span.endTime = new Date();
    span.duration = span.endTime.getTime() - span.startTime.getTime();
    span.status = status;
    span.error = error;

    // Store trace
    const traces = this.traces.get(span.traceId) || [];
    traces.push(span);
    this.traces.set(span.traceId, traces);

    // Record metrics
    this.recordMetric({
      name: `profile.${span.tags.operation}.duration`,
      value: span.duration,
      unit: 'duration',
      tags: {
        operation: span.tags.operation,
        status,
        userId: span.tags.userId
      },
      timestamp: span.endTime
    });

    this.recordMetric({
      name: `profile.${span.tags.operation}.count`,
      value: 1,
      unit: 'count',
      tags: {
        operation: span.tags.operation,
        status,
        userId: span.tags.userId
      },
      timestamp: span.endTime
    });

    // Log performance data using the proper interface
    const performanceData: PerformanceLogData = {
      operation: span.tags.operation,
      duration: span.duration,
      memoryUsage: (process as any).memoryUsage?.().heapUsed / 1024 / 1024 || 0
    };

    const context: LogContext = {
      correlationId,
      userId: span.tags.userId,
      traceId: span.traceId,
      spanId: span.spanId,
      metadata: {
        status,
        result: result ? 'success' : undefined,
        error: error?.message
      }
    };

    this.logger.logPerformance(`Profile operation completed: ${span.tags.operation}`, performanceData, context);
    
    if (error) {
      this.logger.error(`Profile operation failed: ${span.tags.operation}`, LogCategory.BUSINESS, context, error);
    }

    // Clean up
    this.activeSpans.delete(correlationId);
  }

  // =============================================
  // METRICS RECORDING
  // =============================================

  recordMetric(metric: MetricData): void {
    const metricKey = metric.name;
    const existingMetrics = this.metrics.get(metricKey) || [];
    existingMetrics.push(metric);
    
    // Keep only last 1000 metrics per type
    if (existingMetrics.length > 1000) {
      existingMetrics.splice(0, existingMetrics.length - 1000);
    }
    
    this.metrics.set(metricKey, existingMetrics);

    // Also log important metrics
    if (metric.name.includes('error') || metric.name.includes('duration')) {
      const context: LogContext = {
        metadata: {
          metric: metric.name,
          value: metric.value,
          unit: metric.unit,
          tags: metric.tags
        }
      };
      this.logger.info('Metric recorded', LogCategory.PERFORMANCE, context);
    }
  }

  recordProfileMetrics(userId: string, metrics: Partial<ProfileMetrics>): void {
    const timestamp = new Date();
    
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        this.recordMetric({
          name: `profile.metrics.${key}`,
          value: value as number,
          unit: key.includes('Time') ? 'duration' : 
                key.includes('Rate') ? 'percentage' : 'count',
          tags: { userId, source: 'profile_metrics' },
          timestamp
        });
      }
    });
  }

  // =============================================
  // STRUCTURED LOGGING
  // =============================================

  logStructured(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    correlationId: string,
    metadata: Record<string, any>,
    userId?: string,
    operation?: string
  ): void {
    const logEntry: StructuredLogEntry = {
      level,
      message,
      correlationId,
      userId,
      operation: operation || 'unknown',
      timestamp: new Date(),
      metadata: {
        feature: 'profile',
        ...metadata
      }
    };

    // Use appropriate logger method with proper interface
    const context = {
      correlationId,
      userId,
      metadata: {
        operation,
        ...metadata,
        timestamp: logEntry.timestamp.toISOString()
      }
    };

    switch (level) {
      case 'debug':
        this.logger.debug(message, undefined, context);
        break;
      case 'info':
        this.logger.info(message, undefined, context);
        break;
      case 'warn':
        this.logger.warn(message, undefined, context);
        break;
      case 'error':
        this.logger.error(message, undefined, context);
        break;
    }
  }

  // =============================================
  // ANALYTICS & INSIGHTS
  // =============================================

  getProfileAnalytics(userId?: string): {
    totalOperations: number;
    averageLoadTime: number;
    averageUpdateTime: number;
    errorRate: number;
    topErrors: Array<{ error: string; count: number }>;
  } {
    const allMetrics = Array.from(this.metrics.values()).flat();
    const userMetrics = userId 
      ? allMetrics.filter(m => m.tags.userId === userId)
      : allMetrics;

    const loadTimes = userMetrics
      .filter(m => m.name.includes('load.duration'))
      .map(m => m.value);

    const updateTimes = userMetrics
      .filter(m => m.name.includes('update.duration'))
      .map(m => m.value);

    const totalOps = userMetrics
      .filter(m => m.name.includes('.count'))
      .reduce((sum, m) => sum + m.value, 0);

    const errorCount = userMetrics
      .filter(m => m.tags.status === 'error')
      .length;

    return {
      totalOperations: totalOps,
      averageLoadTime: loadTimes.length > 0 
        ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length 
        : 0,
      averageUpdateTime: updateTimes.length > 0
        ? updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length
        : 0,
      errorRate: totalOps > 0 ? (errorCount / totalOps) * 100 : 0,
      topErrors: this.getTopErrors(userMetrics)
    };
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  private generateCorrelationId(): string {
    return `prof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  private generateSpanId(): string {
    return `span_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private getTopErrors(_metrics: MetricData[]): Array<{ error: string; count: number }> {
    const errorMap = new Map<string, number>();
    
    // This would need to be enhanced with actual error tracking
    return Array.from(errorMap.entries())
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // =============================================
  // EXPORT & REPORTING
  // =============================================

  exportMetrics(timeframe?: { start: Date; end: Date }): MetricData[] {
    let allMetrics = Array.from(this.metrics.values()).flat();
    
    if (timeframe) {
      allMetrics = allMetrics.filter(m => 
        m.timestamp >= timeframe.start && m.timestamp <= timeframe.end
      );
    }
    
    return allMetrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  exportTraces(traceId?: string): TraceSpan[] {
    if (traceId) {
      return this.traces.get(traceId) || [];
    }
    
    return Array.from(this.traces.values()).flat()
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.traces.clear();
    this.activeSpans.clear();
    this.logger.info('Profile observability metrics cleared');
  }
}

// Singleton instance
export const profileObservability = new ProfileObservabilityService(); 