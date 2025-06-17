/**
 * @fileoverview ENTERPRISE TEST UTILITIES 2025
 * @description Comprehensive testing utilities for Enterprise-grade React Native applications
 * @version 2.0.0 - Enterprise 2025 Standards
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.TestUtils
 * @namespace Shared.TestUtils.Enterprise
 * @category Testing
 * @subcategory Enterprise
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

// Logger for enterprise test utilities
const logger = LoggerFactory.createServiceLogger('EnterpriseTestUtils');

/**
 * Performance Metrics Interface
 */
export interface PerformanceMetrics {
  reset: () => void;
  getAverageRenderTime: () => number;
  cleanup: () => void;
}

/**
 * Security Context Interface
 */
export interface SecurityContext {
  clearAuditLog: () => void;
  getAuditLog: () => any[];
  getGDPRAuditLog: () => any[];
  getSecurityControls: () => Record<string, string>;
  cleanup: () => void;
}

/**
 * Measure render performance for Enterprise testing
 */
export const measureRenderPerformance = (): PerformanceMetrics => {
  const renderTimes: number[] = [];
  
  return {
    reset: () => {
      renderTimes.length = 0;
    },
    getAverageRenderTime: () => {
      if (renderTimes.length === 0) return 0;
      return renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
    },
    cleanup: () => {
      renderTimes.length = 0;
    },
  };
};

/**
 * Track memory usage for Enterprise testing
 */
export const trackMemoryUsage = (): NodeJS.MemoryUsage => {
  return process.memoryUsage();
};

/**
 * Validate accessibility setup for Enterprise testing
 */
export const validateAccessibility = async (): Promise<void> => {
  // Mock accessibility validation
  return Promise.resolve();
};

/**
 * Sanitize test input for security testing
 */
export const sanitizeTestInput = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '[SCRIPT_REMOVED]')
    .replace(/javascript:/gi, '[JAVASCRIPT_REMOVED]')
    .replace(/\$\{[^}]*\}/g, '[TEMPLATE_REMOVED]')
    .replace(/\.\.\//g, '[PATH_TRAVERSAL_REMOVED]')
    .replace(/DROP\s+TABLE/gi, '[SQL_INJECTION_REMOVED]');
};

/**
 * Create security test context for Enterprise testing
 */
export const createSecurityTestContext = (): SecurityContext => {
  const auditLog: any[] = [];
  const gdprAuditLog: any[] = [];
  
  return {
    clearAuditLog: () => {
      auditLog.length = 0;
      gdprAuditLog.length = 0;
    },
    getAuditLog: () => [...auditLog],
    getGDPRAuditLog: () => [...gdprAuditLog],
    getSecurityControls: () => ({
      'A.12.6.1': 'incident_management',
      'A.16.1.2': 'security_incident_reporting',
      'A.18.1.4': 'privacy_impact_assessment',
    }),
    cleanup: () => {
      auditLog.length = 0;
      gdprAuditLog.length = 0;
    },
  };
};

/**
 * Audit error exposure for security compliance
 */
export const auditErrorExposure = (error: any, context: string): void => {
  // Mock error exposure auditing
  logger.info('Error exposure audit', LogCategory.BUSINESS, {
    service: 'EnterpriseTestUtils',
    metadata: { 
      context, 
      errorMessage: error?.message || 'Unknown error',
      auditType: 'error_exposure'
    }
  });
}; 