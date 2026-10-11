type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

class Logger {
  private level: LogLevel = 'info';
  private isDevelopment = process.env.NODE_ENV === 'development';

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private formatEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };
  }

  private output(entry: LogEntry) {
    if (this.isDevelopment) {
      const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
      const metaStr = entry.meta ? ` ${JSON.stringify(entry.meta)}` : '';
      console.log(`${prefix} ${entry.message}${metaStr}`);
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (this.shouldLog('debug')) {
      this.output(this.formatEntry('debug', message, meta));
    }
  }

  info(message: string, meta?: Record<string, unknown>) {
    if (this.shouldLog('info')) {
      this.output(this.formatEntry('info', message, meta));
    }
  }

  warn(message: string, meta?: Record<string, unknown>) {
    if (this.shouldLog('warn')) {
      this.output(this.formatEntry('warn', message, meta));
    }
  }

  error(message: string, meta?: Record<string, unknown>) {
    if (this.shouldLog('error')) {
      this.output(this.formatEntry('error', message, meta));
    }
  }
}

export const logger = new Logger();

if (process.env.NODE_ENV === 'development') {
  logger.setLevel('debug');
}