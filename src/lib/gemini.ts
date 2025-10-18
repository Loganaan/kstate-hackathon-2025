// lib/gemini.ts
// Wrapper for Google Gemini AI API integration.
// Handles authentication, request formatting, and response processing for AI conversations.

import { GoogleGenAI } from '@google/genai';

export class GeminiClient {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateQuestion(context: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: context,
      });
      return response.text;
    } catch (error) {
      console.error('Error generating question:', error);
      throw error;
    }
  }

  async evaluateResponse(question: string, userResponse: string) {
    try {
      const prompt = `As an interview evaluator, assess the following response:\n\nQuestion: ${question}\n\nCandidate's Response: ${userResponse}\n\nProvide constructive feedback on the response quality, relevance, and areas for improvement.`;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Error evaluating response:', error);
      throw error;
    }
  }

  async chat(messages: Array<{ role: string; content: string }>) {
    try {
      // Build the conversation history in the format expected by Gemini
      const systemPrompt = `You are an experienced behavioral interview coach conducting a practice interview. Ask thoughtful follow-up questions based on the candidate's responses. Keep questions focused on behavioral scenarios using the STAR method (Situation, Task, Action, Result). Be encouraging but professional.`;
      
      // Convert messages to Gemini format
      const contents = [
        systemPrompt,
        ...messages.map(msg => msg.content)
      ].join('\n\n');

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents,
      });
      
      return response.text;
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }
}