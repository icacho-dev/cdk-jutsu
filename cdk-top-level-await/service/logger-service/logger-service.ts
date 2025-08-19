import winston from 'winston';

export interface ILoggerService {
  log(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
}

export class LoggerService implements ILoggerService {
  private winston: winston.Logger;

  constructor(enabled: boolean = true) {
    // Check if we're in test environment
    const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
    
    this.winston = winston.createLogger({
      level: enabled && !isTestEnvironment ? 'info' : 'silent',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
  }

  log(message: string, ...args: any[]): void {
    this.winston.info(message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.winston.error(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.winston.warn(message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.winston.info(message, ...args);
  }

  setEnabled(enabled: boolean): void {
    this.winston.level = enabled ? 'info' : 'silent';
  }
}

// Create a singleton logger instance
// Check if we're in test environment
const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
export const logger = new LoggerService(!isTestEnvironment);
