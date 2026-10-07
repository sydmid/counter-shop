import crypto from 'crypto';

type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  action: string;
  outcome: string;
  requestId?: string;
  [key: string]: any;
}

export const logger = {
  log: (payload: LogPayload) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId: payload.requestId || crypto.randomUUID(),
      ...payload
    };
    console.log(JSON.stringify(logEntry));
  },
  info: (action: string, outcome: string, data: Record<string, any> = {}) => {
    logger.log({ level: 'info', action, outcome, ...data });
  },
  error: (action: string, outcome: string, data: Record<string, any> = {}) => {
    logger.log({ level: 'error', action, outcome, ...data });
  },
  warn: (action: string, outcome: string, data: Record<string, any> = {}) => {
    logger.log({ level: 'warn', action, outcome, ...data });
  }
};
