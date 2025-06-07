/**
 * Error Monitoring Service
 * Centralized error tracking, performance monitoring, and analytics
 */

import * as Sentry from '@sentry/react-native';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

export interface ErrorContext {
  userId?: string;
  feature?: string;
  action?: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceMetrics {
  screenName: string;
  loadTime: number;
  memoryUsage?: number;
  networkRequests?: number;
}

class ErrorMonitoringService {
  private isInitialized = false;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  // =============================================
  // INITIALIZATION
  // =============================================

  async initialize(dsn?: string): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Skip initialization in development to avoid polyfill issues
      if (__DEV__) {
        console.log('Error monitoring skipped in development mode');
        this.isInitialized = true;
        return;
      }

      // Get device and app information
      const [deviceInfo, appInfo] = await Promise.all([
        this.getDeviceInfo(),
        this.getAppInfo(),
      ]);

      Sentry.init({
        dsn: dsn || process.env.SENTRY_DSN || 'YOUR_SENTRY_DSN',
        debug: __DEV__,
        environment: __DEV__ ? 'development' : 'production',
        
        // Performance Monitoring
        enableTracing: true,
        tracesSampleRate: __DEV__ ? 1.0 : 0.1,
        
        // Session Tracking
        enableAutoSessionTracking: true,
        sessionTrackingIntervalMillis: 30000,
        
        // Release and Distribution
        release: appInfo.version,
        dist: appInfo.buildNumber,
        
        // Error filtering
        beforeSend: (event, hint) => {
          // Filter out known non-critical errors
          const error = hint.originalException;
          if (error && typeof error === 'object' && 'message' in error && 
              typeof error.message === 'string' && error.message.includes('Network request failed')) {
            return __DEV__ ? event : null;
          }
          
          // Add additional context
          if (event.contexts) {
            event.contexts.session = { sessionId: this.sessionId };
          }
          
          return event;
        },
        
        // Breadcrumb filtering
        beforeBreadcrumb: (breadcrumb) => {
          // Filter sensitive data from breadcrumbs
          if (breadcrumb.category === 'http' && breadcrumb.data?.url) {
            breadcrumb.data.url = this.sanitizeUrl(breadcrumb.data.url);
          }
          
          return breadcrumb;
        },
      });

      // Set initial context
      Sentry.setContext('device', deviceInfo);
      Sentry.setContext('app', appInfo);
      Sentry.setTag('platform', Platform.OS);
      Sentry.setTag('sessionId', this.sessionId);

      this.isInitialized = true;
      console.log('Error monitoring initialized successfully');
      
      // Track initialization
      this.trackEvent('monitoring.initialized', {
        platform: Platform.OS,
        version: appInfo.version,
      });
      
    } catch (error) {
      console.error('Failed to initialize error monitoring:', error);
      // Mark as initialized even if failed to prevent repeated attempts
      this.isInitialized = true;
    }
  }

  // =============================================
  // ERROR TRACKING
  // =============================================

  captureError(error: Error, context?: ErrorContext): void {
    if (!this.isInitialized) {
      console.error('Error monitoring not initialized:', error);
      return;
    }

    Sentry.withScope((scope) => {
      // Set user context
      if (this.userId) {
        scope.setUser({ id: this.userId });
      }
      
      // Set tags
      if (context?.feature) {
        scope.setTag('feature', context.feature);
      }
      if (context?.action) {
        scope.setTag('action', context.action);
      }
      if (context?.severity) {
        scope.setLevel(this.mapSeverityToLevel(context.severity));
      }
      
      // Set context
      if (context?.metadata) {
        scope.setContext('errorContext', context.metadata);
      }
      
      // Add fingerprint for grouping
      if (context?.feature && context?.action) {
        scope.setFingerprint([context.feature, context.action, error.name]);
      }
      
      Sentry.captureException(error);
    });
  }

  captureMessage(message: string, level: 'debug' | 'info' | 'warning' | 'error' = 'info', context?: ErrorContext): void {
    if (!this.isInitialized) {
      console.log(`[${level}] ${message}`);
      return;
    }

    Sentry.withScope((scope) => {
      scope.setLevel(level);
      
      if (context?.feature) {
        scope.setTag('feature', context.feature);
      }
      if (context?.action) {
        scope.setTag('action', context.action);
      }
      if (context?.metadata) {
        scope.setContext('messageContext', context.metadata);
      }
      
      Sentry.captureMessage(message);
    });
  }

  // =============================================
  // PERFORMANCE MONITORING
  // =============================================

  trackScreenLoad(screenName: string, loadTime: number, metadata?: Record<string, any>): void {
    // Track as custom metric with breadcrumb
    this.trackPerformanceMetric({
      screenName,
      loadTime,
      ...metadata,
    });
    
    // Also add as breadcrumb for debugging
    this.addBreadcrumb(
      `Screen loaded: ${screenName} (${loadTime}ms)`,
      'performance',
      { screenName, loadTime, ...metadata }
    );
  }

  trackPerformanceMetric(metrics: PerformanceMetrics): void {
    if (!this.isInitialized) {
      return;
    }

    Sentry.addBreadcrumb({
      category: 'performance',
      message: `Screen ${metrics.screenName} loaded in ${metrics.loadTime}ms`,
      level: 'info',
      data: metrics,
    });
  }

  // =============================================
  // USER CONTEXT
  // =============================================

  setUser(userId: string, userData?: Record<string, any>): void {
    this.userId = userId;
    
    if (this.isInitialized) {
      Sentry.setUser({
        id: userId,
        ...userData,
      });
    }
  }

  clearUser(): void {
    this.userId = null;
    
    if (this.isInitialized) {
      Sentry.setUser(null);
    }
  }

  // =============================================
  // BREADCRUMBS & EVENTS
  // =============================================

  addBreadcrumb(message: string, category: string = 'custom', data?: Record<string, any>): void {
    if (!this.isInitialized) {
      return;
    }

    Sentry.addBreadcrumb({
      message,
      category,
      level: 'info',
      data: {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        ...data,
      },
    });
  }

  trackEvent(eventName: string, properties?: Record<string, any>): void {
    this.addBreadcrumb(
      `Event: ${eventName}`,
      'user_action',
      { eventName, ...properties }
    );
  }

  // =============================================
  // PRIVATE METHODS
  // =============================================

  private async getDeviceInfo(): Promise<Record<string, any>> {
    try {
      const [
        deviceId,
        deviceName,
        systemVersion,
        brand,
        model,
        isEmulator,
        totalMemory,
        usedMemory,
      ] = await Promise.all([
        DeviceInfo.getDeviceId(),
        DeviceInfo.getDeviceName(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getBrand(),
        DeviceInfo.getModel(),
        DeviceInfo.isEmulator(),
        DeviceInfo.getTotalMemory(),
        DeviceInfo.getUsedMemory(),
      ]);

      return {
        deviceId,
        deviceName,
        systemVersion,
        brand,
        model,
        isEmulator,
        totalMemory,
        usedMemory,
        platform: Platform.OS,
        platformVersion: Platform.Version,
      };
    } catch (error) {
      console.warn('Failed to get device info:', error);
      return {
        platform: Platform.OS,
        platformVersion: Platform.Version,
      };
    }
  }

  private async getAppInfo(): Promise<Record<string, any>> {
    try {
      const [
        version,
        buildNumber,
        bundleId,
        appName,
        firstInstallTime,
        lastUpdateTime,
      ] = await Promise.all([
        DeviceInfo.getVersion(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getBundleId(),
        DeviceInfo.getApplicationName(),
        DeviceInfo.getFirstInstallTime(),
        DeviceInfo.getLastUpdateTime(),
      ]);

      return {
        version,
        buildNumber,
        bundleId,
        appName,
        firstInstallTime,
        lastUpdateTime,
      };
    } catch (error) {
      console.warn('Failed to get app info:', error);
      return {
        version: 'unknown',
        buildNumber: 'unknown',
      };
    }
  }

  private mapSeverityToLevel(severity: string): Sentry.SeverityLevel {
    switch (severity) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'fatal';
      default:
        return 'error';
    }
  }

  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove sensitive query parameters
      urlObj.searchParams.delete('token');
      urlObj.searchParams.delete('key');
      urlObj.searchParams.delete('password');
      return urlObj.toString();
    } catch {
      return '[invalid_url]';
    }
  }

  private generateSessionId(): string {
    // Einfache Session ID ohne crypto-polyfills
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000000).toString(36);
    return `session_${timestamp}_${randomPart}`;
  }
}

// Export singleton instance
export const errorMonitoring = new ErrorMonitoringService(); 