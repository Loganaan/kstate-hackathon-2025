/**
 * API Routes: GET/PUT/DELETE /api/questions/[id]
 * Item endpoints for retrieving, updating, and deleting individual questions
 */

import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { UpdateQuestionRequestSchema, ChoiceSchema } from '@/lib/technical/schemas';
import { getQuestion, updateQuestion, deleteQuestion } from '@/lib/technical/store';
import { checkRateLimit } from '@/lib/technical/rate-limit';
import { getClientIP } from '@/lib/technical/util';
import {
  unauthorizedResponse,
  validationErrorResponse,
  rateLimitedResponse,
  notFoundResponse,
  internalErrorResponse,
  logError
} from '@/lib/technical/errors';

// Use edge runtime if compatible
// export const runtime = 'edge';

/**
 * Route params type
 */
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/questions/[id]
 * Retrieve a single question by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  try {
    const { id } = await params;
    
    // 1. Rate limiting
    const clientIP = getClientIP(request.headers);
    const path = `/api/questions/${id}`;
    
    if (!checkRateLimit(clientIP, path)) {
      return rateLimitedResponse();
    }
    
    // 2. Check API key
    if (!process.env.GEMINI_API_KEY) {
      return unauthorizedResponse('GEMINI_API_KEY not configured');
    }
    
    // 3. Get question from store
    const question = getQuestion(id);
    
    if (!question) {
      return notFoundResponse(`Question with ID '${id}' not found`);
    }
    
    // 4. Return success response
    return Response.json(question, { status: 200 });
    
  } catch (error) {
    logError(`GET /api/questions/[id]`, error);
    return internalErrorResponse();
  }
}

/**
 * PUT /api/questions/[id]
 * Update an existing question
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  try {
    const { id } = await params;
    
    // 1. Rate limiting
    const clientIP = getClientIP(request.headers);
    const path = `/api/questions/${id}`;
    
    if (!checkRateLimit(clientIP, path)) {
      return rateLimitedResponse();
    }
    
    // 2. Check API key
    if (!process.env.GEMINI_API_KEY) {
      return unauthorizedResponse('GEMINI_API_KEY not configured');
    }
    
    // 3. Check if question exists
    const existingQuestion = getQuestion(id);
    if (!existingQuestion) {
      return notFoundResponse(`Question with ID '${id}' not found`);
    }
    
    // 4. Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return validationErrorResponse('Invalid JSON in request body');
    }
    
    let validatedUpdates;
    try {
      validatedUpdates = UpdateQuestionRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse('Validation failed', error.issues);
      }
      return validationErrorResponse('Invalid update data');
    }
    
    // 5. Additional validation for multiple-choice questions
    if (validatedUpdates.choices) {
      // Validate choices structure
      try {
        validatedUpdates.choices.forEach(choice => {
          ChoiceSchema.parse(choice);
        });
      } catch {
        return validationErrorResponse('Invalid choice format');
      }
      
      // Ensure exactly one correct answer
      const correctCount = validatedUpdates.choices.filter(c => c.correct === true).length;
      if (correctCount !== 1) {
        return validationErrorResponse('Multiple-choice questions must have exactly one correct answer');
      }
    }
    
    // 6. Update question
    const updatedQuestion = updateQuestion(id, validatedUpdates);
    
    if (!updatedQuestion) {
      return notFoundResponse(`Question with ID '${id}' not found`);
    }
    
    // 7. Return success response
    return Response.json(updatedQuestion, { status: 200 });
    
  } catch (error) {
    logError(`PUT /api/questions/[id]`, error);
    return internalErrorResponse();
  }
}

/**
 * DELETE /api/questions/[id]
 * Soft delete a question
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  try {
    const { id } = await params;
    
    // 1. Rate limiting
    const clientIP = getClientIP(request.headers);
    const path = `/api/questions/${id}`;
    
    if (!checkRateLimit(clientIP, path)) {
      return rateLimitedResponse();
    }
    
    // 2. Check API key
    if (!process.env.GEMINI_API_KEY) {
      return unauthorizedResponse('GEMINI_API_KEY not configured');
    }
    
    // 3. Delete question (soft delete)
    const success = deleteQuestion(id);
    
    if (!success) {
      return notFoundResponse(`Question with ID '${id}' not found`);
    }
    
    // 4. Return success response
    return Response.json({ ok: true }, { status: 200 });
    
  } catch (error) {
    logError(`DELETE /api/questions/[id]`, error);
    return internalErrorResponse();
  }
}
