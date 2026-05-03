type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (this.isDev) {
      switch (level) {
        case 'info': console.log(formattedMessage, data || ''); break;
        case 'warn': console.warn(formattedMessage, data || ''); break;
        case 'error': console.error(formattedMessage, data || ''); break;
        case 'debug': console.debug(formattedMessage, data || ''); break;
      }
    } else {
      // In production, you could send logs to a service like Google Cloud Logging or Sentry
      if (level === 'error') {
        console.error(formattedMessage, data || '');
      }
    }
  }

  info(message: string, data?: unknown) { this.log('info', message, data); }
  warn(message: string, data?: unknown) { this.log('warn', message, data); }
  error(message: string, data?: unknown) { this.log('error', message, data); }
  debug(message: string, data?: unknown) { this.log('debug', message, data); }
}

export const logger = new Logger();
