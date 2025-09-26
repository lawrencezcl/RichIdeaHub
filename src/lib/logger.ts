// 结构化日志系统
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  action: string;
  details: Record<string, any>;
  correlationId?: string;
  duration?: number;
}

class Logger {
  private static getServiceName(): string {
    return 'rich-idea-hub';
  }

  private static formatLogEntry(
    level: LogEntry['level'],
    action: string,
    details: Record<string, any> = {},
    correlationId?: string,
    duration?: number
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.getServiceName(),
      action,
      details: {
        ...details,
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
      },
      correlationId,
      duration
    };
  }

  private static outputLog(entry: LogEntry): void {
    const logMessage = JSON.stringify(entry);

    switch (entry.level) {
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(logMessage);
        }
        break;
      default:
        console.log(logMessage);
    }
  }

  static info(action: string, details: Record<string, any> = {}, correlationId?: string): void {
    const entry = this.formatLogEntry('info', action, details, correlationId);
    this.outputLog(entry);
  }

  static warn(action: string, details: Record<string, any> = {}, correlationId?: string): void {
    const entry = this.formatLogEntry('warn', action, details, correlationId);
    this.outputLog(entry);
  }

  static error(action: string, error: Error | string, details: Record<string, any> = {}, correlationId?: string): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorDetails = error instanceof Error ? {
      ...details,
      error: {
        message: errorMessage,
        stack: error.stack,
        name: error.name
      }
    } : {
      ...details,
      error: errorMessage
    };

    const entry = this.formatLogEntry('error', action, errorDetails, correlationId);
    this.outputLog(entry);
  }

  static debug(action: string, details: Record<string, any> = {}, correlationId?: string): void {
    const entry = this.formatLogEntry('debug', action, details, correlationId);
    this.outputLog(entry);
  }

  // 计时器功能
  static timer(action: string, details: Record<string, any> = {}, correlationId?: string) {
    const startTime = Date.now();
    const timerId = `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      stop: (additionalDetails: Record<string, any> = {}) => {
        const duration = Date.now() - startTime;
        this.info(action, {
          ...details,
          ...additionalDetails,
          timerId
        }, correlationId);
        return duration;
      },
      getDuration: () => Date.now() - startTime
    };
  }

  // 性能监控
  static async monitor<T>(
    action: string,
    fn: () => Promise<T>,
    details: Record<string, any> = {},
    correlationId?: string
  ): Promise<T> {
    const timer = this.timer(action, details, correlationId);
    try {
      const result = await fn();
      const duration = timer.stop({ status: 'success' });
      this.debug(`${action}_performance`, { duration, status: 'success' }, correlationId);
      return result;
    } catch (error) {
      const duration = timer.stop({ status: 'error' });
      this.error(`${action}_performance`, error as Error, { duration, status: 'error' }, correlationId);
      throw error;
    }
  }

  // 数据抓取专用日志
  static logFetch(
    source: string,
    action: 'start' | 'success' | 'error',
    details: Record<string, any> = {}
  ): void {
    const correlationId = `fetch_${source}_${Date.now()}`;

    switch (action) {
      case 'start':
        this.info('data_fetch_start', { source, ...details }, correlationId);
        break;
      case 'success':
        this.info('data_fetch_success', { source, ...details }, correlationId);
        break;
      case 'error':
        this.error('data_fetch_error', new Error(details.error || 'Unknown fetch error'), { source, ...details }, correlationId);
        break;
    }
  }

  // AI处理专用日志
  static logAIProcessing(
    action: 'start' | 'success' | 'error',
    details: Record<string, any> = {}
  ): void {
    const correlationId = `ai_${Date.now()}`;

    switch (action) {
      case 'start':
        this.info('ai_processing_start', { ...details }, correlationId);
        break;
      case 'success':
        this.info('ai_processing_success', { ...details }, correlationId);
        break;
      case 'error':
        this.error('ai_processing_error', new Error(details.error || 'AI processing failed'), { ...details }, correlationId);
        break;
    }
  }

  // 数据库操作专用日志
  static logDatabase(
    operation: string,
    action: 'start' | 'success' | 'error',
    details: Record<string, any> = {}
  ): void {
    const correlationId = `db_${operation}_${Date.now()}`;

    switch (action) {
      case 'start':
        this.debug('database_operation_start', { operation, ...details }, correlationId);
        break;
      case 'success':
        this.debug('database_operation_success', { operation, ...details }, correlationId);
        break;
      case 'error':
        this.error('database_operation_error', new Error(details.error || 'Database operation failed'), { operation, ...details }, correlationId);
        break;
    }
  }
}

export default Logger;