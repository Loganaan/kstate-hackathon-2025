/**
 * Gemini API client with JSON parsing, validation, and retry logic
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CreateQuestionsRequest, GeminiQuestion, Choice } from './schemas';
import { GeminiResponseSchema } from './schemas';
import { buildUserPrompt, buildRetryPrompt, SYSTEM_PROMPT } from './prompt';
import { logError } from './errors';
import { normalizeTags } from './util';

/**
 * Initialize Gemini client
 */
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Get model name from environment or use default
 */
function getModelName(): string {
  return process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
}

/**
 * Parse JSON response from Gemini, handling markdown code blocks and malformed JSON
 */
function parseGeminiJSON(text: string): unknown {
  let cleaned = text.trim();
  
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```')) {
    // Remove opening ```json or ```
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '');
    // Remove closing ```
    cleaned = cleaned.replace(/\n?```$/, '');
    cleaned = cleaned.trim();
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    // If JSON parsing fails, try to extract JSON from the text
    console.error('[Gemini API] Initial JSON parse failed, attempting to extract JSON...');
    
    // Try to find JSON object boundaries
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(extracted);
      } catch (extractError) {
        // If still failing, try to fix common issues
        console.error('[Gemini API] Extraction failed, attempting fixes...');
        
        // Try to fix unterminated strings by finding and completing them
        let fixed = extracted;
        
        // Replace problematic newlines within strings
        fixed = fixed.replace(/([^\\])"([^"]*)\n([^"]*?)"/g, '$1"$2 $3"');
        
        // Remove any trailing commas before closing brackets/braces
        fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
        
        try {
          return JSON.parse(fixed);
        } catch (finalError) {
          console.error('[Gemini API] All parsing attempts failed');
          console.error('[Gemini API] Original text length:', text.length);
          console.error('[Gemini API] Text preview:', text.substring(0, 500));
          throw error; // Throw original error
        }
      }
    }
    
    throw error;
  }
}

/**
 * Ensure multiple-choice questions have exactly one correct answer
 */
function enforceOneCorrectAnswer(question: GeminiQuestion): GeminiQuestion {
  if (question.format !== 'multiple-choice' || !question.choices) {
    return question;
  }
  
  const correctCount = question.choices.filter(c => c.correct === true).length;
  
  // If exactly one correct, return as-is
  if (correctCount === 1) {
    return question;
  }
  
  // If zero or multiple correct, fix it
  const choices: Choice[] = question.choices.map((c, idx) => ({
    ...c,
    correct: idx === 0 ? true : undefined // Mark first as correct, remove from others
  }));
  
  return {
    ...question,
    choices
  };
}

/**
 * Generate questions using Gemini API
 */
export async function generateQuestions(
  request: CreateQuestionsRequest
): Promise<GeminiQuestion[]> {
  const genAI = getGeminiClient();
  const modelName = getModelName();
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: 0.4, // Lower temperature for more consistent JSON formatting
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 8192,
      responseMimeType: "application/json", // Request JSON format explicitly
    }
  });
  
  // Build prompts
  const systemPrompt = SYSTEM_PROMPT;
  const userPrompt = buildUserPrompt(request);
  
  // Combine prompts
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
  
  let attempts = 0;
  const maxAttempts = 2;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      // Call Gemini
      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini');
      }
      
      // Parse JSON
      const parsed = parseGeminiJSON(text);
      
      // Validate against schema
      const validated = GeminiResponseSchema.parse(parsed);
      
      // Post-process: ensure exactly one correct answer for MC questions
      const processedQuestions = validated.questions.map(enforceOneCorrectAnswer);
      
      // Normalize topic tags
      const finalQuestions = processedQuestions.map(q => ({
        ...q,
        topicTags: normalizeTags(q.topicTags)
      }));
      
      return finalQuestions;
      
    } catch (error) {
      logError('Gemini API', error);
      
      // If this was the last attempt, throw
      if (attempts >= maxAttempts) {
        if (error instanceof Error) {
          throw new Error(`Failed to generate valid questions after ${maxAttempts} attempts: ${error.message}`);
        }
        throw new Error(`Failed to generate valid questions after ${maxAttempts} attempts`);
      }
      
      // Retry with clarification prompt
      const retryPrompt = buildRetryPrompt();
      const retryFullPrompt = `${systemPrompt}\n\n${userPrompt}\n\n${retryPrompt}`;
      
      try {
        const retryResult = await model.generateContent(retryFullPrompt);
        const retryResponse = retryResult.response;
        const retryText = retryResponse.text();
        
        if (!retryText) {
          continue;
        }
        
        const retryParsed = parseGeminiJSON(retryText);
        const retryValidated = GeminiResponseSchema.parse(retryParsed);
        const retryProcessed = retryValidated.questions.map(enforceOneCorrectAnswer);
        const retryFinal = retryProcessed.map(q => ({
          ...q,
          topicTags: normalizeTags(q.topicTags)
        }));
        
        return retryFinal;
        
      } catch (retryError) {
        logError('Gemini API Retry', retryError);
        // Continue to throw on next iteration
      }
    }
  }
  
  throw new Error('Failed to generate questions');
}
