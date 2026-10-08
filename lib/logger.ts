import crypto from 'crypto';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogPayload {
  level: LogLevel;
  action?: string;
  outcome?: string;
  message?: string;
  requestId?: string;
  [key: string]: any;
}

export const logger = {
  log: (payload: LogPayload) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId: payload.requestId || crypto.randomUUID(),
      ...payload,
    };
    if (payload.level === 'error') {
      console.error(JSON.stringify(logEntry));
    } else if (payload.level === 'warn') {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  },
  info: (actionOrMessage: string, outcomeOrMeta?: string | Record<string, any>, data: Record<string, any> = {}) => {
    if (typeof outcomeOrMeta === 'string') {
      logger.log({ level: 'info', action: actionOrMessage, outcome: outcomeOrMeta, ...data });
    } else {
      logger.log({ level: 'info', message: actionOrMessage, ...(outcomeOrMeta || {}) });
    }
  },
  error: (actionOrMessage: string, outcomeOrMeta?: string | Record<string, any>, data: Record<string, any> = {}) => {
    if (typeof outcomeOrMeta === 'string') {
      logger.log({ level: 'error', action: actionOrMessage, outcome: outcomeOrMeta, ...data });
    } else {
      logger.log({ level: 'error', message: actionOrMessage, ...(outcomeOrMeta || {}) });
    }
  },
  warn: (actionOrMessage: string, outcomeOrMeta?: string | Record<string, any>, data: Record<string, any> = {}) => {
    if (typeof outcomeOrMeta === 'string') {
      logger.log({ level: 'warn', action: actionOrMessage, outcome: outcomeOrMeta, ...data });
    } else {
      logger.log({ level: 'warn', message: actionOrMessage, ...(outcomeOrMeta || {}) });
    }
  },
};
