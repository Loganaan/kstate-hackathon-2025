// app/api/gemini/route.ts
// API route for handling Gemini AI chat requests
// Manages conversation flow and integrates with the GeminiClient

import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { messages, params } = await request.json();

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key status:', apiKey ? `Present (length: ${apiKey.length})` : 'Missing');
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error('GEMINI_API_KEY is not configured or still has placeholder value');
      return NextResponse.json(
        { error: 'API key not configured. Please add your GEMINI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Initialize Gemini client
    const geminiClient = new GeminiClient(apiKey);

    // Validate messages for chat
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }
    
    // Identify main questions vs follow-ups with better pattern matching
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    let mainQuestionCount = 0;
    assistantMessages.forEach((msg, index) => {
      const content = msg.content.toLowerCase().trim();
      const length = msg.content.length;
      
      // Characteristics of follow-ups:
      // 1. Short messages (under 120 chars)
      // 2. Asking for clarification/more detail
      const followUpPatterns = [
        /^can you (tell me more|elaborate|explain|describe)/,
        /^what (was|were|did|about|specific)/,
        /^how (did|was|were)/,
        /^could you (provide|explain|describe|elaborate)/,
        /^tell me more/,
        /^which/,
      ];
      
      const isShortQuestion = length < 120 && content.includes('?');
      const matchesFollowUpPattern = followUpPatterns.some(pattern => pattern.test(content));
      
      // It's a follow-up if it's short AND matches a follow-up pattern
      const isFollowUp = isShortQuestion && matchesFollowUpPattern;
      
      // Also check: if previous assistant message was within last 2 messages and was long,
      // this short one is likely a follow-up
      if (index > 0 && length < 120 && content.includes('?')) {
        const prevAssistantMsg = assistantMessages[index - 1];
        if (prevAssistantMsg && prevAssistantMsg.content.length > 200) {
          // Previous was a long main question, this short one is a follow-up
          return; // Don't count as main question
        }
      }
      
      // Count as main question if it's NOT a follow-up
      if (!isFollowUp) {
        mainQuestionCount++;
      }
    });
    
    const userResponses = messages.filter(msg => msg.role === 'user').length;
    
    // After 4 main questions and 4+ responses, provide feedback
    if (mainQuestionCount >= 4 && userResponses >= 4) {
      // Extract Q&A pairs for evaluation - create feedback message
      const feedbackSystemMessage = {
        role: 'system',
        content: `You have just completed a behavioral interview with 4 questions. Review the entire conversation and provide comprehensive feedback.

Please provide:
1. Overall performance summary
2. Strengths demonstrated in the responses
3. Areas for improvement
4. Specific suggestions for better answers using the STAR method
5. A score out of 10 for interview readiness

Be constructive, encouraging, and specific in your feedback.`
      };

      const response = await geminiClient.chat([feedbackSystemMessage, ...messages], params);
      return NextResponse.json({ response, interviewComplete: true });
    }
    
    // Update system prompt to track question count
    const currentQuestionNumber = mainQuestionCount + 1;
    
    const modifiedMessages = [
      {
        role: 'system',
        content: `You are an experienced behavioral interview coach. You will ask exactly 4 main behavioral interview questions total. You have asked ${mainQuestionCount} main questions so far. You are working towards main question ${currentQuestionNumber} of 4.

FOLLOW-UP RULES:
- You may ask ONE brief follow-up question after a candidate's response ONLY if their answer is vague or lacks important details (Situation, Task, Action, or Result).
- Follow-ups DO NOT count as main questions.
- If you just asked a follow-up, DO NOT ask another one. Move on to the next main question.
- Follow-ups should be SHORT (one sentence) and specific: "Can you tell me more about X?" or "What was the result?"
- If the answer is complete, simply acknowledge it briefly (optional) and move to the next main question.

Keep main questions focused on behavioral scenarios using the STAR method. Be encouraging but professional.`
      },
      ...messages
    ];
    
    const response = await geminiClient.chat(modifiedMessages, params);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
