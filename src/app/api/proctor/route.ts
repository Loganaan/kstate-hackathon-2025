import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ProctorMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ProctorRequest {
  question: string;
  solutionOutline?: string;
  code?: string;
  conversationHistory: ProctorMessage[];
  userResponse?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProctorRequest = await request.json();
    const { question, solutionOutline, code, conversationHistory, userResponse } = body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build the conversation context
    let prompt = '';

    // If this is the first interaction, ask them to explain their approach
    if (conversationHistory.length === 0) {
      prompt = `You are an expert technical interviewer conducting a live coding interview. You are observing a candidate working on the following problem:

**Problem:** ${question}

${solutionOutline ? `**Expected Solution Approach:** ${solutionOutline}` : ''}

Your task is to start the interview by asking the candidate to explain how they would approach solving this problem. Ask them to walk you through their thought process and proposed solution strategy.

Be encouraging, professional, and conversational. Keep your question concise (2-3 sentences max).`;
    } else {
      // Build conversation history
      const conversationContext = conversationHistory
        .map((msg) => `${msg.role === 'user' ? 'Candidate' : 'You'}: ${msg.content}`)
        .join('\n\n');

      prompt = `You are an expert technical interviewer conducting a live coding interview. Here's the context:

**Problem:** ${question}

${solutionOutline ? `**Expected Solution Approach:** ${solutionOutline}` : ''}

${code ? `**Current Code:**\n\`\`\`\n${code}\n\`\`\`` : ''}

**Conversation so far:**
${conversationContext}

**Candidate's latest response:** ${userResponse}

Your task is to:
1. Analyze their response and assess their understanding
2. Ask follow-up questions about their approach, complexity, or edge cases
3. If they seem stuck or confused, provide subtle hints without giving away the solution
4. If they're on the right track, encourage them and ask probing questions to test deeper understanding
5. Be conversational, supportive, and professional

Respond naturally in 2-4 sentences. Don't be overly formal or robotic.`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      message: text,
      success: true,
    });
  } catch (error) {
    console.error('Proctor AI error:', error);
    
    if (error instanceof Error && error.message.includes('quota')) {
      return NextResponse.json(
        {
          message: "I'm currently experiencing high demand. Let's continue - can you explain your approach to solving this problem?",
          success: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate proctor response', success: false },
      { status: 500 }
    );
  }
}
