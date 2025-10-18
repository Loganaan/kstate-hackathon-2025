// lib/gemini.ts
// Wrapper for Google Gemini AI API integration.
// Handles authentication, request formatting, and response processing for AI conversations.

import { GoogleGenAI } from '@google/genai';

interface SessionParams {
  company?: string;
  role?: string;
  seniority?: string;
  jobDescription?: string;
}

export class GeminiClient {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async chat(messages: Array<{ role: string; content: string }>, params?: SessionParams) {
    try {
      // Build context info from params
      let contextInfo = '';
      if (params) {
        const contextParts = [];
        if (params.company) contextParts.push(`Company: ${params.company}`);
        if (params.role) contextParts.push(`Role: ${params.role}`);
        if (params.seniority) contextParts.push(`Seniority Level: ${params.seniority}`);
        if (params.jobDescription) contextParts.push(`Job Description: ${params.jobDescription}`);
        
        if (contextParts.length > 0) {
          contextInfo = '\n\nINTERVIEW CONTEXT:\n' + contextParts.join('\n');
        }
      }

      // Build the conversation history with clear role labels
      const systemPrompt = `You are an experienced behavioral interview coach conducting a professional interview${contextInfo ? '.' + contextInfo : '.'}

RESPONSE GUIDELINES:
- Ask ONE behavioral question at a time using the STAR method (Situation, Task, Action, Result).
- You may ask ONE brief follow-up question ONLY if the candidate's answer lacks critical detail (missing Situation, Task, Action, or Result).
- If you just asked a short clarifying question, DO NOT ask another. Move to the next main question.
- Follow-ups must be ONE sentence asking for specific missing information (e.g., "What was the specific result?" or "Can you describe the situation in more detail?").
- When responding to a candidate's answer, structure your response in TWO parts:
  1. First, give a brief acknowledgment or feedback (1 sentence)
  2. Then add a blank line
  3. Then ask the next behavioral question
- Be selective with follow-ups - only when truly needed for incomplete answers.${params && (params.company || params.role || params.seniority || params.jobDescription) ? '\n- Tailor questions to be relevant for the specific role, seniority level, and company context provided above.' : ''}
- Be professional, conversational, and encouraging while maintaining an authentic interviewer tone.
- Focus on behavioral scenarios that assess leadership, problem-solving, teamwork, and impact.
- Do not generate responses for the candidate - only ask questions and respond as the interviewer.

RESPONSE FORMAT EXAMPLE:
"Thank you for sharing that experience and demonstrating strong leadership in that situation..

Now, tell me about a time when you had to work with a difficult team member. How did you handle it?"`;
      
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