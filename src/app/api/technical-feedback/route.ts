import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { question, answer, solutionOutline } = await request.json();

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key not configured. Please add your GEMINI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Validate input
    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    // Create the feedback prompt
    const prompt = `You are an expert technical interviewer providing constructive feedback on a candidate's answer.

**Question:**
${question}

**Candidate's Answer:**
${answer}

${solutionOutline ? `**Key Points to Consider:**\n${solutionOutline}\n\n` : ''}

Please provide detailed, constructive feedback on the candidate's answer. Include:

1. **Correctness Assessment**: How accurate and complete is the answer?
2. **Technical Depth**: Does it demonstrate good technical understanding?
3. **Communication**: Is the explanation clear and well-structured?
4. **Strengths**: What did the candidate do well?
5. **Areas for Improvement**: What could be enhanced or expanded upon?
6. **Suggestions**: Specific recommendations for a stronger answer

Be encouraging but thorough. Format your response in a clear, readable way.`;

    // Generate feedback
    const result = await model.generateContent(prompt);
    const response = result.response;
    const feedback = response.text();

    return NextResponse.json({ 
      success: true,
      feedback 
    });

  } catch (error) {
    console.error('Error generating technical feedback:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate feedback', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
