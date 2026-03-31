import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class GitHubSyncError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'GitHubSyncError';
  }
}

/**
 * Structured error response interface
 */
interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  timestamp: string;
}

/**
 * Sensitive data patterns to redact from logs and responses
 */
const SENSITIVE_PATTERNS = [
  /jwt_secret/gi,
  /token/gi,
  /password/gi,
  /otp/gi,
  /secret/gi,
  /authorization/gi,
  /bearer/gi,
];

/**
 * Redact sensitive data from strings
 */
function redactSensitiveData(data: any): any {
  if (typeof data === 'string') {
    let redacted = data;
    SENSITIVE_PATTERNS.forEach(pattern => {
      redacted = redacted.replace(pattern, '[REDACTED]');
    });
    return redacted;
  }

  if (typeof data === 'object' && data !== null) {
    const redacted: any = Array.isArray(data) ? [] : {};
    for (const key in data) {
      // Redact entire value if key contains sensitive terms
      if (SENSITIVE_PATTERNS.some(pattern => pattern.test(key))) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactSensitiveData(data[key]);
      }
    }
    return redacted;
  }

  return data;
}

/**
 * Log error with structured format
 */
export function logError(
  context: string,
  error: Error | unknown,
  additionalInfo?: Record<string, any>
) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Redact sensitive data from additional info
  const safeAdditionalInfo = additionalInfo ? redactSensitiveData(additionalInfo) : undefined;

  console.error('[Error]', {
    timestamp,
    context,
    message: errorMessage,
    stack: errorStack,
    ...safeAdditionalInfo,
  });
}

/**
 * Log authentication events (without sensitive data)
 */
export function logAuthEvent(
  event: 'otp_request' | 'otp_verify' | 'login_success' | 'login_failure' | 'logout',
  email: string,
  success: boolean,
  reason?: string
) {
  const timestamp = new Date().toISOString();

  console.log('[Auth Event]', {
    timestamp,
    event,
    email,
    success,
    reason: reason || undefined,
  });
}

/**
 * Handle API errors and return appropriate response
 */
export function handleAPIError(error: unknown): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString();

  // Validation errors (400)
  if (error instanceof ValidationError) {
    logError('Validation Error', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.details,
        timestamp,
      },
      { status: 400 }
    );
  }

  // Zod validation errors (400)
  if (error instanceof ZodError) {
    logError('Zod Validation Error', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
        timestamp,
      },
      { status: 400 }
    );
  }

  // Authentication errors (401)
  if (error instanceof AuthenticationError) {
    logError('Authentication Error', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp,
      },
      { status: 401 }
    );
  }

  // GitHub sync errors (500)
  if (error instanceof GitHubSyncError) {
    logError('GitHub Sync Error', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync content to GitHub',
        details: error.details,
        timestamp,
      },
      { status: 500 }
    );
  }

  // Generic errors (500)
  logError('Unhandled Error', error);
  return NextResponse.json(
    {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      timestamp,
    },
    { status: 500 }
  );
}

/**
 * Get appropriate HTTP status code for error type
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof ValidationError || error instanceof ZodError) {
    return 400;
  }
  if (error instanceof AuthenticationError) {
    return 401;
  }
  if (error instanceof GitHubSyncError) {
    return 500;
  }
  return 500;
}

/**
 * Create structured error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  details?: any
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: details ? redactSensitiveData(details) : undefined,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}
