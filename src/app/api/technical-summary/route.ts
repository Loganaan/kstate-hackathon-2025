import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { results, timeElapsed, totalQuestions } = await request.json();

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
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

    // Format results for the prompt
    const resultsText = results
      .map((r: any, idx: number) => {
        return `Question ${idx + 1}: ${r.format} (${r.difficulty})
Topics: ${r.topicTags.join(', ')}
Status: ${r.status}
${r.score !== undefined ? `Score: ${r.score}%` : ''}`;
      })
      .join('\n\n');

    // Create the analysis prompt
    const prompt = `You are an expert technical interviewer providing comprehensive feedback on a completed technical interview practice session.

**Interview Statistics:**
- Total Questions: ${totalQuestions}
- Time Taken: ${Math.floor(timeElapsed / 60)} minutes ${timeElapsed % 60} seconds
- Coding Questions: ${results.filter((r: any) => r.format === 'coding').length}
- Multiple Choice: ${results.filter((r: any) => r.format === 'multiple-choice').length}
- Free Response: ${results.filter((r: any) => r.format === 'free-response').length}

**Detailed Results:**
${resultsText}

Please provide a comprehensive performance analysis that includes:

1. **Overall Performance Summary** - A brief overview of how the candidate performed

2. **Strengths** - What the candidate did well (based on correct answers, high scores, etc.)

3. **Areas for Improvement** - Specific topics or question types that need more practice

4. **Time Management** - Assessment of whether the time taken was appropriate

5. **Recommendations** - Concrete next steps for improvement, including:
   - Specific topics to study
   - Types of problems to practice
   - Resources or approaches to consider

6. **Interview Readiness Score** - Rate from 1-10 with justification

Be encouraging but honest. Provide actionable feedback that will help the candidate improve.`;

    // Generate analysis
    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    return NextResponse.json({ 
      success: true,
      summary 
    });

  } catch (error: any) {
    console.error('Error generating technical summary:', error);
    
    // Check if it's a quota error - provide helpful fallback
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('429')) {
      return NextResponse.json({ 
        success: true,
        summary: `**Interview Performance Summary**

*AI analysis is temporarily unavailable due to API quota limits.*

**Basic Statistics:**
- You completed the technical interview session
- Results have been recorded for all questions
- Review the detailed breakdown above for individual question performance

**Manual Review Suggestions:**
1. **Review Your Answers**: Go through questions you struggled with
2. **Study Topics**: Focus on areas where you scored lower
3. **Practice More**: Use coding platforms like LeetCode, HackerRank
4. **Time Management**: Work on solving problems within time constraints
5. **Alternative Solutions**: Research different approaches to problems

**Next Steps:**
- Identify your weakest topic areas and create a study plan
- Practice similar difficulty problems daily
- Review optimal solutions and time/space complexity
- Consider mock interviews with peers

*AI-powered analysis will be available when the API quota resets (typically within 24 hours).*`
      });
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate summary', 
        details: error instanceof Error ? error.message : 'Unknown error',
        summary: 'Unable to generate AI summary at this time. Your results have been saved.'
      },
      { status: 500 }
    );
  }
}
