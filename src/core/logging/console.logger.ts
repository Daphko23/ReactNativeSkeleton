import {
  ILoggerService, 
  LogLevel, 
  LogCategory, 
  LogContext, 
  SecurityLogData,
  PerformanceLogData,
  AuditLogData,
  LogTimer
} from './logger.service.interface';

//
const consoleMethods: Record<LogLevel, (...args: unknown[]) => void> = {
  [LogLevel.DEBUG]: console.debug,
  [LogLevel.INFO]: console.info,
  [LogLevel.WARN]: console.warn,
  [LogLevel.ERROR]: console.error,
  [LogLevel.FATAL]: console.error, // Use console.error for fatal
};

export class ConsoleLogger implements ILoggerService {
  debug(message: string, category?: LogCategory, context?: LogContext): void {
    consoleMethods[LogLevel.DEBUG](`[DEBUG]${category ? `[${category}]` : ''} ${message}`, context);
  }

  info(message: string, category?: LogCategory, context?: LogContext): void {
    consoleMethods[LogLevel.INFO](`[INFO]${category ? `[${category}]` : ''} ${message}`, context);
  }

  warn(message: string, category?: LogCategory, context?: LogContext): void {
    consoleMethods[LogLevel.WARN](`[WARN]${category ? `[${category}]` : ''} ${message}`, context);
  }

  error(message: string, category?: LogCategory, context?: LogContext, error?: Error): void {
    consoleMethods[LogLevel.ERROR](`[ERROR]${category ? `[${category}]` : ''} ${message}`, context, error);
  }

  fatal(message: string, category?: LogCategory, context?: LogContext, error?: Error): void {
    consoleMethods[LogLevel.FATAL](`[FATAL]${category ? `[${category}]` : ''} ${message}`, context, error);
  }

  logSecurity(message: string, securityData: SecurityLogData, context?: LogContext, error?: Error): void {
    console.log(`[SECURITY] ${message}`, { securityData, context, error });
  }

  logPerformance(message: string, performanceData: PerformanceLogData, context?: LogContext): void {
    console.log(`[PERFORMANCE] ${message}`, { performanceData, context });
  }

  logAudit(message: string, auditData: AuditLogData, context?: LogContext): void {
    console.log(`[AUDIT] ${message}`, { auditData, context });
  }

  startTimer(operationName: string, context?: LogContext): LogTimer {
    const startTime = Date.now();
    return {
      stop: (additionalData?: Partial<PerformanceLogData>) => {
        const duration = Date.now() - startTime;
        this.logPerformance(`Operation completed: ${operationName}`, {
          operation: operationName,
          duration,
          ...additionalData
        }, context);
      }
    };
  }

  createChildLogger(_context: LogContext): ILoggerService {
    return new ConsoleLogger(); // Simple implementation
  }

  async flush(): Promise<void> {
    // Console doesn't need flushing
  }
}
