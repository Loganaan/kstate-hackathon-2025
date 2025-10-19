import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ProctorMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ProctorRequest {
  questionTitle: string;
  questionDescription: string;
  solutionOutline?: string;
  code?: string;
  conversationHistory: ProctorMessage[];
  userResponse?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProctorRequest = await request.json();
    const { questionTitle, questionDescription, solutionOutline, code, conversationHistory, userResponse } = body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    let prompt = '';

    // If this is the first interaction, ask them to explain their approach
    if (conversationHistory.length === 0) {
      prompt = `You are an expert technical interviewer conducting a live coding interview. The candidate is working on this problem:

**Problem Title:** ${questionTitle}

**Description:** ${questionDescription}

${solutionOutline ? `**Optimal Solution Approach:** ${solutionOutline}\n(Keep this in mind but don't reveal it unless they need hints)` : ''}

Start the interview by warmly greeting the candidate and asking them to explain their initial thoughts on how they would approach this problem. Ask them to walk through their thinking process.

Keep your response conversational, encouraging, and concise (2-3 sentences).`;
    } else {
      // Build conversation history
      const conversationContext = conversationHistory
        .map((msg) => `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`)
        .join('\n\n');

      const codeSection = code 
        ? `**Current Code:**\n${'```'}\n${code}\n${'```'}` 
        : '**Note:** The candidate hasn\'t started coding yet.';

      prompt = `You are an expert technical interviewer. Here's the interview context:

**Problem:** ${questionTitle}
${questionDescription}

${solutionOutline ? `**Optimal Solution:** ${solutionOutline}` : ''}

${codeSection}

**Conversation History:**
${conversationContext}

**Candidate's Latest Response:** ${userResponse}

As the interviewer, you should:

1. Analyze their response - Assess their understanding and approach
2. Ask probing questions - Test their knowledge of complexity, edge cases, or design decisions
3. Provide guidance if stuck - If they seem confused or ask for help, give subtle hints without revealing the full solution
4. Encourage good ideas - If they're on the right track, acknowledge it and dig deeper
5. Be conversational - Sound natural and supportive, not robotic

Respond in 2-4 sentences. Keep it conversational and focused.`;
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
          message: "I'm experiencing high demand right now. Let's continue - can you walk me through your approach to this problem?",
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
