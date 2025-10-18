/**
 * Zod schemas and TypeScript types for API validation
 */

import { z } from 'zod';

/**
 * Seniority levels
 */
export const SenioritySchema = z.enum(['intern', 'junior', 'mid', 'senior']).optional();

/**
 * Difficulty levels
 */
export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);

/**
 * Question formats
 */
export const FormatSchema = z.enum(['multiple-choice', 'coding', 'free-response', 'mixed']);

/**
 * Test case schema
 */
export const TestCaseSchema = z.object({
  input: z.union([z.string(), z.number()]).transform(val => String(val)),
  output: z.union([z.string(), z.number()]).transform(val => String(val)),
  explanation: z.string().optional()
});

/**
 * Choice schema for multiple-choice questions
 */
export const ChoiceSchema = z.object({
  label: z.string(),
  text: z.string(),
  correct: z.boolean().optional()
});

/**
 * POST /api/questions request body schema
 */
export const CreateQuestionsRequestSchema = z.object({
  company: z.string().min(1).max(80).transform((s: string) => s.trim()),
  role: z.string().min(1).max(200).transform((s: string) => s.trim()),
  seniority: SenioritySchema,
  jobDescription: z.string().min(50).max(8000).transform((s: string) => s.trim()),
  difficulty: DifficultySchema.optional().default('medium'),
  topics: z.array(z.string()).optional().default([]),
  count: z.number().int().min(1).max(10).optional().default(3),
  format: FormatSchema.optional().default('mixed')
});

/**
 * GET /api/questions query parameters schema
 */
export const GetQuestionsQuerySchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  difficulty: DifficultySchema.optional(),
  topic: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0)
});

/**
 * PUT /api/questions/[id] request body schema
 */
export const UpdateQuestionRequestSchema = z.object({
  difficulty: DifficultySchema.optional(),
  topicTags: z.array(z.string()).optional(),
  prompt: z.string().min(10).optional(),
  starterCode: z.string().optional(),
  choices: z.array(ChoiceSchema).optional(),
  explanation: z.string().optional(),
  testCases: z.array(TestCaseSchema).optional(),
  solutionOutline: z.string().optional()
});

/**
 * Question schema
 */
export const QuestionSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  seniority: SenioritySchema,
  difficulty: DifficultySchema,
  topicTags: z.array(z.string()),
  format: FormatSchema,
  prompt: z.string(),
  starterCode: z.string().optional(),
  solutionOutline: z.string().optional(),
  testCases: z.array(TestCaseSchema).optional(),
  choices: z.array(ChoiceSchema).optional(),
  explanation: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional()
});

/**
 * Gemini response envelope schema
 */
export const GeminiResponseSchema = z.object({
  questions: z.array(
    z.object({
      difficulty: DifficultySchema,
      topicTags: z.array(z.string()),
      format: FormatSchema,
      prompt: z.string(),
      starterCode: z.string().optional(),
      solutionOutline: z.string().optional(),
      testCases: z.array(TestCaseSchema).optional(),
      choices: z.array(ChoiceSchema).optional(),
      explanation: z.string().optional()
    })
  )
});

/**
 * Inferred TypeScript types
 */
export type Seniority = z.infer<typeof SenioritySchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
export type Format = z.infer<typeof FormatSchema>;
export type TestCase = z.infer<typeof TestCaseSchema>;
export type Choice = z.infer<typeof ChoiceSchema>;
export type CreateQuestionsRequest = z.infer<typeof CreateQuestionsRequestSchema>;
export type GetQuestionsQuery = z.infer<typeof GetQuestionsQuerySchema>;
export type UpdateQuestionRequest = z.infer<typeof UpdateQuestionRequestSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type GeminiResponse = z.infer<typeof GeminiResponseSchema>;
export type GeminiQuestion = GeminiResponse['questions'][0];
