// lib/gemini.ts
// Wrapper for Google Gemini AI API integration.
// Handles authentication, request formatting, and response processing for AI conversations.

import { GoogleGenAI } from '@google/genai';

export class GeminiClient {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async chat(messages: Array<{ role: string; content: string }>) {
    try {
      // Build the conversation history with clear role labels
      const systemPrompt = `
      [COMPANY NAME] is Koch Industries
      You are an experienced behavioral interview coach simulating a real interview for [COMPANY NAME].
      
      RESPONSE GUIDELINES:
      - You may ask ONE brief follow-up question ONLY if the candidate's answer lacks critical detail (missing Situation, Task, Action, or Result).
      - If you just asked a short clarifying question, DO NOT ask another. Move to the next main question.
      - Follow-ups must be ONE sentence asking for specific missing information.
      - If the answer is satisfactory, give a brief acknowledgment (one sentence) and ask the next main question.
      - Be selective with follow-ups - only when truly needed for incomplete answers.
      
      Ask thoughtful, realistic questions based on the candidate's responses, reflecting the values, culture, and leadership principles of [COMPANY NAME].
      Keep all questions focused on behavioral scenarios using the STAR method (Situation, Task, Action, Result).
      Be professional, conversational, and encouraging, but maintain the tone of an authentic company interviewer.
      Do not generate responses for the candidate — only ask questions and respond as the interviewer from [COMPANY NAME].
      `;
      
      // Format conversation with clear role indicators
      const conversationHistory = messages.map(msg => {
        if (msg.role === 'user') {
          return `CANDIDATE: ${msg.content}`;
        } else if (msg.role === 'assistant') {
          return `INTERVIEWER: ${msg.content}`;
        } else {
          return msg.content; // system messages
        }
      }).join('\n\n');

      const prompt = `${systemPrompt}\n\n${conversationHistory}\n\nINTERVIEWER:`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      return response.text;
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }
}