import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  let testResults: any[] = [];
  
  try {
    const { question, code, testResults: testResultsFromRequest, solutionOutline } = await request.json();
    testResults = testResultsFromRequest || [];

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
    if (!question || !code) {
      return NextResponse.json(
        { error: 'Question and code are required' },
        { status: 400 }
      );
    }

    // Calculate test results summary
    const passedTests = testResults?.filter((t: any) => t.passed).length || 0;
    const totalTests = testResults?.length || 0;
    const testSummary = totalTests > 0 ? `${passedTests}/${totalTests} tests passed` : 'No tests run';

    // Format test results details
    const testDetails = testResults?.map((t: any, idx: number) => 
      `Test ${idx + 1}: ${t.passed ? '✓ Passed' : '✗ Failed'}
  Input: ${t.input}
  Expected: ${t.expected}
  Actual: ${t.actual}${t.error ? `\n  Error: ${t.error}` : ''}`
    ).join('\n\n') || 'No test results available';

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3072,
      },
    });

    // Check if code is just starter template (contains 'pass' or similar)
    const isStarterCode = code.trim().includes('pass') || 
                         code.trim().match(/def\s+\w+\([^)]*\)\s*:\s*$/m) ||
                         (passedTests === 0 && code.length < 200);

    // Create the feedback prompt with different instructions based on implementation status
    let prompt: string;
    
    if (isStarterCode) {
      // Special prompt for unimplemented solutions
      prompt = `You are a helpful coding mentor. The candidate has NOT yet started implementing their solution. They only have the starter template code with no actual logic.

**Problem Statement:**
${question}

**Current Code (UNIMPLEMENTED - just starter template):**
\`\`\`python
${code}
\`\`\`

**Test Results:**
ALL TESTS FAILING - ${testSummary} (because nothing is implemented yet)

${solutionOutline ? `**Suggested Approach:**\n${solutionOutline}\n\n` : ''}

Since NO SOLUTION has been implemented yet, provide beginner-friendly guidance to help them get started:

**Start your response with:** "I see you haven't implemented the solution yet. Let me help you get started!"

Then provide:

1. **Understanding the Problem** (2-3 sentences)
   - Rephrase what the problem is asking in simple terms
   - What are the inputs and expected output?

2. **Key Insight** (1-2 sentences)
   - What's the main algorithmic pattern or technique needed? (e.g., "This is a classic sliding window problem" or "Think about using a hash map to track frequencies")

3. **Step-by-Step Approach** (3-5 bullet points)
   - Break down the solution into concrete steps
   - Be specific: "First, create an empty dictionary to store..."
   - Include handling of edge cases

4. **Code Structure Hint**
   - What variables or data structures should they initialize?
   - What's the main loop structure?

5. **Getting Started**
   - What should be the first 2-3 lines they write?
   - Encourage them to start simple

Keep it encouraging and practical. Focus on HOW to implement, not just WHAT the solution is.`;
    } else {
      // Regular prompt for implemented solutions
      prompt = `You are an expert technical interviewer providing detailed feedback on a candidate's coding solution.

**Problem Statement:**
${question}

**Candidate's Code:**
\`\`\`python
${code}
\`\`\`

**Test Results:**
${testSummary}

**Detailed Test Results:**
${testDetails}

${solutionOutline ? `**Expected Approach:**\n${solutionOutline}\n\n` : ''}

The candidate HAS implemented a solution. Provide comprehensive, constructive feedback:

1. **Correctness Analysis**: 
   - How well does the code solve the problem?
   - Are there any bugs or logic errors?
   - Why did specific tests pass or fail?

2. **Code Quality**:
   - Is the code clean, readable, and well-structured?
   - Are variable names meaningful?
   - Is there proper error handling?

3. **Complexity Analysis**:
   - What is the time complexity? Can it be improved?
   - What is the space complexity? Are there optimization opportunities?

4. **Edge Cases**:
   - Does the code handle edge cases properly?
   - What additional test cases should be considered?

5. **Best Practices**:
   - Does the code follow Python best practices?
   - Are there more idiomatic approaches?

6. **Strengths**:
   - What did the candidate do well?
   - What techniques or patterns were used effectively?

7. **Areas for Improvement**:
   - What specific changes would make this solution better?
   - What concepts should the candidate review?

8. **Alternative Approaches**:
   - Are there different algorithms or data structures that could be used?
   - What are the trade-offs?

Be specific, encouraging, and educational. Reference the actual code and test results in your feedback.`;
    }

    // Generate feedback
    const result = await model.generateContent(prompt);
    const response = result.response;
    const feedback = response.text();

    return NextResponse.json({
      success: true,
      feedback
    });

  } catch (error: any) {
    console.error('Error generating coding feedback:', error);
    
    // Check if it's a quota error
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('429')) {
      const passedTests = testResults?.filter((t: any) => t.passed).length || 0;
      const totalTests = testResults?.length || 0;
      const failedTests = totalTests - passedTests;
      
      return NextResponse.json(
        {
          error: 'API quota exceeded',
          feedback: `**AI Feedback Temporarily Unavailable**

The Gemini API has reached its daily quota limit. Here are some tips for self-review:

**Code Review Checklist:**
1. **Correctness**: Does your solution handle all test cases correctly?
   - Test Results: ${totalTests > 0 ? `${passedTests}/${totalTests} passed` : 'No tests run'}
   ${failedTests > 0 ? '\n   - Review the failed test cases to identify the issue' : ''}

2. **Time Complexity**: 
   - What is the Big O notation of your solution?
   - Can you identify any nested loops or redundant operations?

3. **Space Complexity**:
   - How much additional memory does your solution use?
   - Can you reduce memory usage?

4. **Edge Cases**:
   - Empty inputs
   - Single element inputs
   - Maximum/minimum values
   - Duplicate values

5. **Code Quality**:
   - Are variable names descriptive?
   - Is the logic easy to follow?
   - Are there any magic numbers that should be constants?

6. **Python Best Practices**:
   - Using list comprehensions where appropriate
   - Proper use of built-in functions
   - Following PEP 8 style guidelines

**Next Steps:**
- Debug any failing test cases step by step
- Consider alternative algorithms or data structures
- Look for optimization opportunities
- Try again later when the API quota resets`
        },
        { status: 200 } // Return 200 so frontend shows the fallback message
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to generate feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
        feedback: 'Unable to generate AI feedback at this time. Please review your code manually and try again later.'
      },
      { status: 500 }
    );
  }
}
