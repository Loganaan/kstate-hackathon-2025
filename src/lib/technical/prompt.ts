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
- For coding questions: EVERY test case MUST have a filled "output" field with the actual expected result (never empty, never blank)
- For coding questions: include constraints, edge cases, and sample input/output with CONCRETE output values
- Topic tags should be relevant and specific (e.g., "arrays", "dynamic-programming", "sql")

CRITICAL JSON FORMATTING RULES:
- Escape all special characters in strings: use \\" for quotes, \\n for newlines, \\\\ for backslashes
- Keep all text on single lines within JSON strings - no actual newlines in string values
- For multi-line content (like code or explanations), use \\n escape sequences
- Double-check that all strings are properly closed with quotes
- Remove any trailing commas before closing brackets or braces
- Test your JSON is valid before returning it`;

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
      "testCases": [
        {"input": "nums = [1,2,3]", "output": "6", "explanation": "Sum of all elements"},
        {"input": "nums = []", "output": "0", "explanation": "Edge case: empty array"}
      ],
      "choices": [{"label": "A", "text": "choice text", "correct": true}],
      "explanation": "Brief explanation, constraints, or edge cases"
    }
  ]
}

CRITICAL: For coding questions, every test case MUST have a filled "output" field with the actual expected result. Never leave it empty.

For multiple-choice questions: Include exactly 4 choices (A, B, C, D) with exactly ONE marked as correct: true. The explanation should clarify why the correct answer is right.

For coding questions: Include MINIMUM 3-5 diverse test cases. CRITICAL: Every test case MUST have a concrete "output" value - NEVER leave it empty or blank. 
Example: If input is "nums = [1,2,3,4,5], k = 2", output should be "3" (the actual number), NOT empty.
Example: If input is "nums = [], k = 5", output should be "0" (the actual result), NOT empty.
Cover basic cases, edge cases (empty, null, boundaries), and corner cases (single element, max/min values). The explanation field should describe overall constraints, complexity, and key considerations.

For free-response questions: Write the explanation in a conversational, practical style. Describe how YOU would solve it step-by-step, using concrete technologies and real examples. Say "I would use Redis for caching because..." not "Caching solutions include...". For system design, walk through the architecture naturally: "First I'd set up...", "Then for scaling I'd add...", "The database would be...". Make it sound like a senior engineer explaining their approach, not a grading rubric.`;

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
- Starter code in an appropriate language (JavaScript, Python, Java, etc.)
- Comprehensive test cases (MINIMUM 3-5 test cases covering different scenarios)
- Solution outline describing the approach

For test cases - CRITICAL INSTRUCTIONS:
- Include at least 3-5 diverse test cases in the testCases array
- Each test case MUST have ALL THREE fields filled with actual values:
  * "input": The actual input parameters (e.g., "arr = [1,2,3], target = 5")
  * "output": The EXACT expected output value (e.g., "true", "15", "[1,2]", "null")
  * "explanation": Why this test case matters and what it tests
- NEVER leave "output" field empty - always provide the concrete expected result
- Cover these scenarios:
  * Basic/happy path case (normal input with typical output)
  * Edge cases (empty arrays, null values, boundaries)
  * Corner cases (single element, maximum size, minimum values)
  * Invalid/error cases if applicable
- Example format: {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Basic case: finds indices of two numbers that sum to target"}
- For the explanation field at the question level: describe constraints, time/space complexity, and key edge cases to consider`;
    
    case 'free-response':
      return `Format: Generate open-ended questions that require written explanations (e.g., system design, architecture decisions, trade-offs). 

For the explanation field - CRITICAL INSTRUCTIONS:
- Write a conversational, practical explanation of how you would actually solve this problem
- Start with a high-level approach, then dive into specifics
- Use concrete examples and real technologies (Redis, Kafka, PostgreSQL, etc.)
- Explain the "why" behind decisions, not just the "what"
- For system design: Walk through the architecture like you're whiteboarding with a colleague
  * "First, I'd start with X because..."
  * "The key components would be..."
  * "For handling Y, I'd use Z because..."
  * Include diagrams descriptions, data flow, specific services
- Avoid listing abstract concepts or bullet-point checklists
- Instead of "A good answer should cover:" write "Here's how I'd approach this:"
- Make it sound like a senior engineer explaining their solution, not an evaluation rubric
- Be specific about implementation details, technologies, and trade-offs`;
    
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
