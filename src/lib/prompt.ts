/**
 * Prompt builder for Gemini API
 * Generates system and user prompts for question generation
 */

import type { CreateQuestionsRequest } from './schemas';
import { truncate, scrubPII } from './util';

/**
 * System prompt for Gemini
 */
export const SYSTEM_PROMPT = `You are a senior interview content designer specializing in creating original computer science and software engineering interview questions. Your responsibilities:

1. Generate realistic, unambiguous, and testable interview questions
2. Respect the specified difficulty level in complexity and scope
3. Never include company-internal or proprietary information
4. Produce ONLY valid JSON output matching the exact schema provided
5. Ensure all questions are original and suitable for technical interviews

Output Requirements:
- Return ONLY a JSON object, no markdown formatting, no code blocks, no additional text
- The JSON must match this exact structure: {"questions": [/* array of question objects */]}
- Each question object must include all required fields based on its format
- For multiple-choice questions: include exactly one choice with correct: true
- For coding questions: include constraints, edge cases, and sample input/output
- Topic tags should be relevant and specific (e.g., "arrays", "dynamic-programming", "sql")`;

/**
 * Build user prompt from request parameters
 */
export function buildUserPrompt(request: CreateQuestionsRequest): string {
  // Scrub PII from job description
  const cleanedJD = scrubPII(request.jobDescription);
  
  // Truncate job description to 1500 chars for prompt efficiency
  const jdSummary = truncate(cleanedJD, 1500);
  
  // Build seniority text
  const seniorityText = request.seniority 
    ? `for a ${request.seniority}-level candidate` 
    : '';
  
  // Build topics text
  const topicsText = request.topics && request.topics.length > 0
    ? `Focus on these topics: ${request.topics.join(', ')}.`
    : '';
  
  // Build format-specific instructions
  const formatInstructions = getFormatInstructions(request.format);
  
  const prompt = `Generate ${request.count} original technical interview question${request.count > 1 ? 's' : ''} ${seniorityText} for the following position:

**Company:** ${request.company}
**Role:** ${request.role}
**Difficulty:** ${request.difficulty}

**Job Description Summary:**
${jdSummary}

${topicsText}

${formatInstructions}

Requirements:
- Each question must be at ${request.difficulty} difficulty level
- Questions should be relevant to the role and company context
- Ensure questions are clear, unambiguous, and testable
- Include appropriate constraints and edge cases
- Topic tags should be specific and relevant

Return exactly this JSON structure with NO additional text, markdown, or formatting:
{
  "questions": [
    {
      "difficulty": "${request.difficulty}",
      "topicTags": ["tag1", "tag2"],
      "format": "multiple-choice" | "coding" | "free-response",
      "prompt": "Question text here",
      "starterCode": "// Optional: starter code for coding questions",
      "solutionOutline": "Brief solution approach",
      "testCases": [{"input": "example", "output": "result", "explanation": "why"}],
      "choices": [{"label": "A", "text": "choice text", "correct": true}],
      "explanation": "Brief explanation, constraints, or edge cases"
    }
  ]
}

For multiple-choice questions: Include exactly 4 choices (A, B, C, D) with exactly ONE marked as correct: true.
For coding questions: Include at least 2 test cases with clear input/output pairs and starter code.
For free-response questions: Include explanation with evaluation criteria.`;

  return prompt;
}

/**
 * Get format-specific instructions
 */
function getFormatInstructions(format: string): string {
  switch (format) {
    case 'multiple-choice':
      return `Format: Generate multiple-choice questions with exactly 4 choices (labeled A, B, C, D). Mark exactly ONE choice as correct with "correct": true. Include an explanation field with the rationale.`;
    
    case 'coding':
      return `Format: Generate coding questions with:
- Clear problem statement
- Starter code in an appropriate language
- At least 2 test cases with input/output examples
- Constraints and edge cases in the explanation
- Solution outline describing the approach`;
    
    case 'free-response':
      return `Format: Generate open-ended questions that require written explanations. Include evaluation criteria in the explanation field.`;
    
    case 'mixed':
      return `Format: Generate a mix of question types (multiple-choice, coding, and free-response). Vary the formats across the questions. Each question should follow the format requirements for its type.`;
    
    default:
      return '';
  }
}

/**
 * Build retry prompt when initial parsing fails
 */
export function buildRetryPrompt(): string {
  return `The previous response could not be parsed as valid JSON. Please return a valid JSON object that exactly matches the schema. The response must:

1. Be valid JSON (not markdown, not a code block)
2. Start with { and end with }
3. Have a "questions" array as the top-level key
4. Each question object must include all required fields
5. For multiple-choice: exactly one choice must have "correct": true
6. Use double quotes for all strings
7. No trailing commas
8. No comments

Return ONLY the JSON object, nothing else.`;
}
