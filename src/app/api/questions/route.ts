/**
 * API Routes: POST /api/questions and GET /api/questions
 * Collection endpoints for creating and listing questions
 */

import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { CreateQuestionsRequestSchema, GetQuestionsQuerySchema } from '@/lib/schemas';
import { generateQuestions } from '@/lib/gemini-client';
import { saveQuestion, getQuestions } from '@/lib/store';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIP, paginate } from '@/lib/util';
import {
  unauthorizedResponse,
  validationErrorResponse,
  inputLimitExceededResponse,
  rateLimitedResponse,
  geminiErrorResponse,
  internalErrorResponse,
  logError
} from '@/lib/errors';

// Use edge runtime if compatible
// export const runtime = 'edge';

/**
 * POST /api/questions
 * Generate new questions using Gemini API
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // 1. Rate limiting
    const clientIP = getClientIP(request.headers);
    const path = '/api/questions';
    
    if (!checkRateLimit(clientIP, path)) {
      return rateLimitedResponse();
    }
    
    // 2. Check API key
    if (!process.env.GEMINI_API_KEY) {
      return unauthorizedResponse('GEMINI_API_KEY not configured');
    }
    
    // 3. Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return validationErrorResponse('Invalid JSON in request body');
    }
    
    let validatedRequest;
    try {
      validatedRequest = CreateQuestionsRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse('Validation failed', error.issues);
      }
      return validationErrorResponse('Invalid request data');
    }
    
    // 4. Additional sanitization checks
    if (validatedRequest.jobDescription.length > 8000) {
      return inputLimitExceededResponse('Job description must not exceed 8000 characters');
    }
    
    if (validatedRequest.count > 10) {
      return inputLimitExceededResponse('Count must not exceed 10');
    }
    
    // 5. Generate questions using Gemini
    let geminiQuestions;
    try {
      geminiQuestions = await generateQuestions(validatedRequest);
    } catch (error) {
      logError('Question Generation', error);
      const message = error instanceof Error ? error.message : 'Failed to generate questions';
      return geminiErrorResponse(message);
    }
    
    // 6. Save questions to store
    const savedQuestions = geminiQuestions.map(gq => {
      return saveQuestion({
        company: validatedRequest.company,
        role: validatedRequest.role,
        seniority: validatedRequest.seniority,
        difficulty: gq.difficulty,
        topicTags: gq.topicTags,
        format: gq.format,
        prompt: gq.prompt,
        starterCode: gq.starterCode,
        solutionOutline: gq.solutionOutline,
        testCases: gq.testCases,
        choices: gq.choices,
        explanation: gq.explanation
      });
    });
    
    // 7. Return success response
    return Response.json({ questions: savedQuestions }, { status: 200 });
    
  } catch (error) {
    logError('POST /api/questions', error);
    return internalErrorResponse();
  }
}

/**
 * GET /api/questions
 * List questions with optional filters and pagination
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    // 1. Rate limiting
    const clientIP = getClientIP(request.headers);
    const path = '/api/questions';
    
    if (!checkRateLimit(clientIP, path)) {
      return rateLimitedResponse();
    }
    
    // 2. Check API key
    if (!process.env.GEMINI_API_KEY) {
      return unauthorizedResponse('GEMINI_API_KEY not configured');
    }
    
    // 3. Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      company: searchParams.get('company') ?? undefined,
      role: searchParams.get('role') ?? undefined,
      difficulty: searchParams.get('difficulty') ?? undefined,
      topic: searchParams.get('topic') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      offset: searchParams.get('offset') ?? undefined
    };
    
    let validatedQuery;
    try {
      validatedQuery = GetQuestionsQuerySchema.parse(queryParams);
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse('Invalid query parameters', error.issues);
      }
      return validationErrorResponse('Invalid query parameters');
    }
    
    // 4. Additional validation
    if (validatedQuery.limit > 50) {
      return inputLimitExceededResponse('Limit must not exceed 50');
    }
    
    // 5. Get filtered questions
    const filteredQuestions = getQuestions(validatedQuery);
    
    // 6. Apply pagination
    const paginatedResult = paginate(
      filteredQuestions,
      validatedQuery.offset,
      validatedQuery.limit
    );
    
    // 7. Return success response
    return Response.json(paginatedResult, { status: 200 });
    
  } catch (error) {
    logError('GET /api/questions', error);
    return internalErrorResponse();
  }
}
