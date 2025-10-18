/**
 * Error handling utilities with standardized error codes
 */

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'INPUT_LIMIT_EXCEEDED'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'GEMINI_ERROR';

export interface APIError {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  details?: unknown
): Response {
  const body: APIError = {
    error: {
      code,
      message,
      ...(details !== undefined && { details })
    }
  };

  return Response.json(body, { status });
}

/**
 * Handle unauthorized (missing API key)
 */
export function unauthorizedResponse(message: string = 'Missing or invalid API key'): Response {
  return createErrorResponse('UNAUTHORIZED', message, 401);
}

/**
 * Handle input validation errors
 */
export function validationErrorResponse(message: string, details?: unknown): Response {
  return createErrorResponse('VALIDATION_ERROR', message, 400, details);
}

/**
 * Handle input limit exceeded
 */
export function inputLimitExceededResponse(message: string): Response {
  return createErrorResponse('INPUT_LIMIT_EXCEEDED', message, 400);
}

/**
 * Handle rate limiting
 */
export function rateLimitedResponse(message: string = 'Rate limit exceeded. Please try again later.'): Response {
  return createErrorResponse('RATE_LIMITED', message, 429);
}

/**
 * Handle not found
 */
export function notFoundResponse(message: string = 'Resource not found'): Response {
  return createErrorResponse('NOT_FOUND', message, 404);
}

/**
 * Handle internal errors
 */
export function internalErrorResponse(message: string = 'An internal error occurred'): Response {
  return createErrorResponse('INTERNAL_ERROR', message, 500);
}

/**
 * Handle Gemini API errors
 */
export function geminiErrorResponse(message: string, details?: unknown): Response {
  return createErrorResponse('GEMINI_ERROR', message, 500, details);
}

/**
 * Small error helper for logging (no console.log in production)
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${context}]`, error);
  }
}
