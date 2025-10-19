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
      model: 'gemini-2.5-flash',
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

  } catch (error: any) {
    console.error('Error generating technical feedback:', error);
    
    // Check if it's a quota error
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('429')) {
      return NextResponse.json(
        { 
          error: 'API quota exceeded',
          feedback: `**AI Feedback Temporarily Unavailable**

The Gemini API has reached its daily quota limit. Here's what you can do:

**Manual Review Tips:**
1. **Completeness**: Does your answer address all parts of the question?
2. **Technical Accuracy**: Are your technical explanations correct?
3. **Clarity**: Is your answer well-structured and easy to understand?
4. **Examples**: Did you provide relevant examples where appropriate?
5. **Depth**: Does your answer show understanding of underlying concepts?

**Next Steps:**
- Review your answer against the key points provided
- Compare with industry best practices
- Consider edge cases and trade-offs
- Try again later when the API quota resets

Your answer has been saved successfully!`
        },
        { status: 200 } // Return 200 so frontend shows the fallback message
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate feedback', 
        details: error instanceof Error ? error.message : 'Unknown error',
        feedback: 'Unable to generate AI feedback at this time. Please review your answer manually and try again later.'
      },
      { status: 500 }
    );
  }
}
