// app/api/behavioral-feedback/route.ts
// API route for analyzing behavioral interview conversations and providing structured feedback

import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Gemini client
    const geminiClient = new GeminiClient(apiKey);

    // Extract Q&A pairs from conversation
    const questionAnswerPairs: { question: string; answer: string }[] = [];
    
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      
      // Find assistant questions (excluding system messages and follow-ups)
      if (message.role === 'assistant' && message.content.includes('?')) {
        // Look for the next user response
        const nextUserMessage = messages.slice(i + 1).find((m: { role: string; content: string }) => m.role === 'user');
        
        if (nextUserMessage) {
          const content = message.content.toLowerCase().trim();
          const length = message.content.length;
          
          // Skip short follow-up questions
          const followUpPatterns = [
            /^can you (tell me more|elaborate|explain|describe)/,
            /^what (was|were|did|about|specific)/,
            /^how (did|was|were)/,
            /^could you (provide|explain|describe|elaborate)/,
            /^tell me more/,
            /^which/,
          ];
          
          const isShortQuestion = length < 120;
          const matchesFollowUpPattern = followUpPatterns.some(pattern => pattern.test(content));
          
          // Only include main questions (not follow-ups)
          if (!(isShortQuestion && matchesFollowUpPattern)) {
            questionAnswerPairs.push({
              question: message.content,
              answer: nextUserMessage.content
            });
          }
        }
      }
    }

    // Limit to first 4 main Q&A pairs
    const mainQAPairs = questionAnswerPairs.slice(0, 4);

    // Create prompt for structured feedback
    const feedbackPrompt = {
      role: 'system',
      content: `You are analyzing a behavioral interview. Review each question and answer pair, then provide structured feedback.

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, no extra text):
{
  "questionFeedback": [
    {
      "question": "The exact question text",
      "answer": "The exact answer text", 
      "feedback": "2-3 sentences of specific, actionable feedback focusing on STAR method completeness and clarity",
      "rating": 1-5 (integer only)
    }
  ],
  "overallFeedback": "3-4 sentences summarizing strengths, areas for improvement, and one key actionable suggestion",
  "overallRating": 1-10 (integer only)
}

Q&A Pairs to analyze:
${mainQAPairs.map((qa, idx) => `
Question ${idx + 1}: ${qa.question}
Answer ${idx + 1}: ${qa.answer}
`).join('\n')}

Provide concise, constructive feedback. Rate based on STAR method usage, specificity, and impact demonstration.`
    };

    // Get feedback from Gemini
    const response = await geminiClient.chat([feedbackPrompt], {});
    
    // Parse the JSON response
    let feedbackData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = response?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedbackData = JSON.parse(jsonMatch[0]);
      } else if (response) {
        feedbackData = JSON.parse(response);
      } else {
        throw new Error('No response from Gemini');
      }
    } catch (parseError) {
      console.error('Failed to parse feedback JSON:', parseError);
      console.error('Response was:', response);
      
      // Fallback: create basic feedback structure
      feedbackData = {
        questionFeedback: mainQAPairs.map(qa => ({
          question: qa.question,
          answer: qa.answer,
          feedback: "Good effort! Consider providing more specific details using the STAR method.",
          rating: 3
        })),
        overallFeedback: "You demonstrated good communication skills. Focus on structuring answers with clear Situation, Task, Action, and Result components for stronger responses.",
        overallRating: 7
      };
    }

    return NextResponse.json(feedbackData);
  } catch (error) {
    console.error('Error in behavioral feedback API:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
