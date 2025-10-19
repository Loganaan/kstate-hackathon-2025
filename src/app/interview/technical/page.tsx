'use client';

import { useState, useEffect, useRef } from 'react';
import SessionHeader from './components/SessionHeader';
import ProblemPanel from './components/ProblemPanel';
import CodeEditor from './components/CodeEditor';
import ConsoleOutput from './components/ConsoleOutput';
import ProctorModal from './components/ProctorModal';
import ProctorHintBox from './components/ProctorHintBox';
import StatusBar from './components/StatusBar';
import InterviewSetup from './components/InterviewSetup';
import MultipleChoiceQuestion from './components/MultipleChoiceQuestion';
import FreeResponseQuestion from './components/FreeResponseQuestion';
import InterviewSummary from './components/InterviewSummary';

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

interface Choice {
  label: string;
  text: string;
  correct?: boolean;
}

interface ApiQuestion {
  id: string;
  company: string;
  role: string;
  seniority?: string;
  difficulty: string;
  topicTags: string[];
  format: string;
  prompt: string;
  starterCode?: string;
  solutionOutline?: string;
  testCases?: TestCase[];
  choices?: Choice[];
  explanation?: string;
  createdAt: string;
}

// Mock problem data (fallback)
const MOCK_PROBLEM = {
  title: 'Two Sum',
  difficulty: 'Easy',
  description:
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
  ],
  constraints: [
    '2 ≤ nums.length ≤ 10⁴',
    '-10⁹ ≤ nums[i] ≤ 10⁹',
    '-10⁹ ≤ target ≤ 10⁹',
    'Only one valid answer exists',
  ],
  starterCode: {
    javascript: `function twoSum(nums, target) {\n    // TODO: Write your solution here\n    \n}`,
    python: `def two_sum(nums, target):\n    # TODO: Write your solution here\n    pass`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // TODO: Write your solution here\n        \n    }\n}`,
  },
};

export default function TechnicalInterviewPage() {
  // API Integration state
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  
  // Interview completion state
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [questionResults, setQuestionResults] = useState<any[]>([]);

  // Editor state - Python only
  const [language] = useState<'python'>('python');
  const [code, setCode] = useState(MOCK_PROBLEM.starterCode.python);

  // Multiple choice state
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [mcSubmitted, setMcSubmitted] = useState(false);

  // Free response state
  const [freeResponseAnswer, setFreeResponseAnswer] = useState('');
  const [frSubmitted, setFrSubmitted] = useState(false);
  const [frFeedback, setFrFeedback] = useState('');
  const [isFetchingFrFeedback, setIsFetchingFrFeedback] = useState(false);

  // Session state
  const [isRunning, setIsRunning] = useState(false);
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [testResults, setTestResults] = useState<
    Array<{ passed: boolean; input: string; expected: string; actual: string }>
  >([]);
  const [activeTab, setActiveTab] = useState<'question' | 'feedback'>('question');

  // AI Proctor mode
  const [liveProctorMode, setLiveProctorMode] = useState(false);
  const [proctorHints, setProctorHints] = useState<string[]>([]);
  const [showProctorModal, setShowProctorModal] = useState(false);
  const proctorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get current question (API or mock)
  const currentApiQuestion = apiQuestions[currentQuestionIndex];
  const currentProblem = currentApiQuestion
    ? {
        title: `Q${currentQuestionIndex + 1}: ${currentApiQuestion.prompt.substring(0, 50)}...`,
        difficulty: currentApiQuestion.difficulty,
        description: currentApiQuestion.prompt,
        examples: currentApiQuestion.testCases
          ? currentApiQuestion.testCases.map((tc) => ({
              input: tc.input,
              output: tc.output,
              explanation: tc.explanation || '',
            }))
          : [],
        constraints: currentApiQuestion.explanation ? [currentApiQuestion.explanation] : [],
      }
    : MOCK_PROBLEM;



  // Handle interview setup submission
  const handleSetupSubmit = async (setupData: {
    company: string;
    role: string;
    seniority: string;
    difficulty: string;
    jobDescription: string;
    count: number;
    format: string;
  }) => {
    setLoadingQuestions(true);
    setSetupError(null);

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate questions');
      }

      const data = await response.json();
      setApiQuestions(data.questions);
      setIsSetupComplete(true);
      setCurrentQuestionIndex(0);
      
      // Set initial code from first question
      if (data.questions[0]?.starterCode) {
        setCode(data.questions[0].starterCode);
      }
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Reset question state when changing questions
  const resetQuestionState = () => {
    setSelectedChoice(null);
    setMcSubmitted(false);
    setFreeResponseAnswer('');
    setFrSubmitted(false);
    setFrFeedback('');
    setOutput('');
    setFeedback('');
    setTestResults([]);
    setActiveTab('question');
  };

  // Update code when question changes
  useEffect(() => {
    if (currentApiQuestion) {
      // Reset all question state when changing questions
      resetQuestionState();
      
      // Set starter code for coding questions
      if (currentApiQuestion.format === 'coding' && currentApiQuestion.starterCode) {
        const starterCode = currentApiQuestion.starterCode || '# Write your solution here\ndef solution():\n    pass';
        setCode(starterCode);
      }
    }
  }, [currentQuestionIndex, currentApiQuestion]);

  // Start timer on mount or when setup is complete
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Live Proctor Mode simulation
  useEffect(() => {
    if (liveProctorMode) {
      const hints = [
        '💡 AI Proctor: Consider using a hash map for O(n) time complexity',
        '👀 AI Proctor: Remember to check for edge cases',
        '🎯 AI Proctor: Your approach looks good! Keep going',
        '⚡ AI Proctor: Try to optimize your solution for better performance',
        "✨ AI Proctor: Don't forget to handle negative numbers",
      ];

      let hintIndex = 0;
      proctorIntervalRef.current = setInterval(() => {
        setProctorHints((prev) => [...prev, hints[hintIndex % hints.length]]);
        hintIndex++;
      }, 8000); // New hint every 8 seconds

      return () => {
        if (proctorIntervalRef.current) {
          clearInterval(proctorIntervalRef.current);
        }
      };
    } else {
      setProctorHints([]);
      if (proctorIntervalRef.current) {
        clearInterval(proctorIntervalRef.current);
      }
    }
  }, [liveProctorMode]);

  // Handle Run Code - Execute Python code against test cases
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');

    // Use API test cases if available
    const testCasesToRun = currentApiQuestion?.testCases || [];
    
    if (testCasesToRun.length === 0) {
      setOutput('No test cases available for this problem.');
      setIsRunning(false);
      return;
    }

    try {
      // Call the execute API endpoint
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          testCases: testCasesToRun,
          language: 'python',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to execute code');
      }

      const data = await response.json();
      const results = data.results;

      setTestResults(results);
      
      const passedCount = results.filter((r: { passed: boolean }) => r.passed).length;
      const totalCount = results.length;
      
      let outputText = '';
      results.forEach((r: { passed: boolean; input: string; expected: string; actual: string; error?: string }, idx: number) => {
        outputText += `${r.passed ? '✓' : '✗'} Test ${idx + 1}: ${r.passed ? 'Passed' : 'Failed'}\n`;
        
        // Always show the details for better feedback
        outputText += `  Input: ${r.input}\n`;
        outputText += `  Expected: ${r.expected}\n`;
        outputText += `  Actual: ${r.actual}\n`;
        
        if (!r.passed && r.error) {
          outputText += `  Error: ${r.error}\n`;
        }
        outputText += '\n';
      });
      
      outputText += `\n${passedCount}/${totalCount} tests passed`;
      
      if (passedCount === totalCount) {
        outputText += '\n\n🎉 All tests passed! Great job!';
      }
      
      setOutput(outputText);
    } catch (error) {
      setOutput(
        `Error executing code:\n${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your code for syntax errors.`
      );
      setTestResults([]);
    } finally {
      setIsRunning(false);
    }
  };

  // Handle Request Feedback (TODO: Connect to AI backend)
  const handleRequestFeedback = async () => {
    setIsFetchingFeedback(true);
    setActiveTab('feedback'); // Switch to feedback tab
    setFeedback('Fetching AI feedback...');

    // Simulate AI feedback
    setTimeout(() => {
      const mockFeedback = `**Code Analysis:**

✅ **Strengths:**
- Clean and readable code structure
- Good variable naming

⚠️ **Areas for Improvement:**
- Consider edge cases and boundary conditions
- Look for optimization opportunities
- Test with various input sizes

💡 **Solution Approach:**
${currentApiQuestion?.solutionOutline || 'Try to break down the problem into smaller steps and think about the optimal data structure.'}

${currentApiQuestion?.explanation ? `\n**Additional Context:**\n${currentApiQuestion.explanation}` : ''}

**Complexity Considerations:**
- Analyze time and space complexity
- Consider trade-offs between different approaches

Keep up the good work! Review the test cases and iterate on your solution.`;

      setFeedback(mockFeedback);
      setIsFetchingFeedback(false);
    }, 2000);
  };

  // Handle Reset
  const handleReset = () => {
    // Reset to the starter code from current question
    const starterCode = currentApiQuestion?.starterCode || MOCK_PROBLEM.starterCode.python;
    setCode(starterCode);
    setOutput('');
    setFeedback('');
    setTestResults([]);
  };

  // Handle Toggle Proctor
  const handleToggleProctor = () => {
    if (liveProctorMode) {
      handleStopProctor();
    } else {
      setShowProctorModal(true);
    }
  };

  // Handle Start Proctor Session
  const handleStartProctor = () => {
    setLiveProctorMode(true);
    setShowProctorModal(false);
  };

  // Handle Stop Proctor Session
  const handleStopProctor = () => {
    setLiveProctorMode(false);
    setProctorHints([]);
  };

  // Handle Next Question
  const handleNextQuestion = () => {
    // Save current question result before moving
    saveQuestionResult();
    
    if (currentQuestionIndex < apiQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle Previous Question
  const handlePreviousQuestion = () => {
    // Save current question result before moving
    saveQuestionResult();
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Save current question result
  const saveQuestionResult = () => {
    if (!currentApiQuestion) return;

    const result: any = {
      questionNumber: currentQuestionIndex + 1,
      format: currentApiQuestion.format,
      difficulty: currentApiQuestion.difficulty,
      topicTags: currentApiQuestion.topicTags,
    };

    // Determine status based on question type
    if (currentApiQuestion.format === 'coding') {
      const passedCount = testResults.filter((t) => t.passed).length;
      const totalCount = testResults.length;
      result.score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
      result.status = passedCount === totalCount ? 'correct' : passedCount > 0 ? 'partial' : 'incorrect';
      result.details = `${passedCount}/${totalCount} tests passed`;
    } else if (currentApiQuestion.format === 'multiple-choice') {
      if (mcSubmitted) {
        const isCorrect = currentApiQuestion.choices?.find((c) => c.label === selectedChoice)?.correct;
        result.status = isCorrect ? 'correct' : 'incorrect';
        result.details = isCorrect ? 'Correct answer selected' : 'Incorrect answer selected';
      } else {
        result.status = 'submitted';
        result.details = 'Not attempted';
      }
    } else if (currentApiQuestion.format === 'free-response') {
      result.status = frSubmitted ? 'submitted' : 'submitted';
      result.details = frSubmitted ? 'Answer submitted and reviewed' : 'Not attempted';
    }

    // Update or add result
    setQuestionResults((prev) => {
      const existing = prev.findIndex((r) => r.questionNumber === result.questionNumber);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  // Handle Submit Interview
  const handleSubmitInterview = () => {
    // Save final question result
    saveQuestionResult();
    // Show summary
    setIsInterviewComplete(true);
  };

  // Handle Restart Interview
  const handleRestartInterview = () => {
    setIsInterviewComplete(false);
    setIsSetupComplete(false);
    setApiQuestions([]);
    setCurrentQuestionIndex(0);
    setQuestionResults([]);
    resetQuestionState();
    setTimeElapsed(0);
  };

  // Handle Exit to Dashboard
  const handleExitToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Handle Multiple Choice submission
  const handleMultipleChoiceSubmit = (choice: string) => {
    setSelectedChoice(choice);
    setMcSubmitted(true);
  };

  // Handle Free Response submission
  const handleFreeResponseSubmit = async (answer: string) => {
    setFreeResponseAnswer(answer);
    setFrSubmitted(true);
    setIsFetchingFrFeedback(true);

    // Call Technical Feedback API
    try {
      const response = await fetch('/api/technical-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentApiQuestion?.prompt,
          answer: answer,
          solutionOutline: currentApiQuestion?.solutionOutline,
        }),
      });

      const data = await response.json();
      
      // Check if there's feedback in the response (even on error responses)
      if (data.feedback) {
        setFrFeedback(data.feedback);
      } else if (!response.ok) {
        setFrFeedback(`Error: ${data.error || 'Failed to generate feedback. Please try again.'}`);
      } else {
        setFrFeedback('Unable to generate feedback at this time.');
      }
    } catch (error) {
      console.error('Feedback error:', error);
      setFrFeedback('Error generating feedback. Please try again.');
    } finally {
      setIsFetchingFrFeedback(false);
    }
  };

  // Show setup form if not complete
  if (!isSetupComplete) {
    return (
      <InterviewSetup
        onSubmit={handleSetupSubmit}
        loading={loadingQuestions}
        error={setupError}
      />
    );
  }

  // Show summary if interview is complete
  if (isInterviewComplete) {
    return (
      <InterviewSummary
        results={questionResults}
        timeElapsed={timeElapsed}
        onRestart={handleRestartInterview}
        onExit={handleExitToDashboard}
      />
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pl-20">
      {/* Header */}
      <SessionHeader
        title={currentProblem.title}
        difficulty={currentProblem.difficulty}
        timeElapsed={timeElapsed}
        liveProctorMode={liveProctorMode}
        onToggleProctor={handleToggleProctor}
      />

      {/* AI Proctor Floating Box */}
      <ProctorHintBox hints={proctorHints} isActive={liveProctorMode} />

      {/* AI Proctor Start Modal */}
      <ProctorModal
        isOpen={showProctorModal}
        onClose={() => setShowProctorModal(false)}
        onStart={handleStartProctor}
      />

      {/* Question Navigation Bar (only show if using API questions) */}
      {apiQuestions.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                ← Previous
              </button>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Question {currentQuestionIndex + 1} of {apiQuestions.length}
              </span>
              {currentQuestionIndex < apiQuestions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 font-medium"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmitInterview}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold shadow-lg"
                >
                  ✓ Submit Interview
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentApiQuestion?.topicTags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Layout changes based on question format */}
      <div className="grid lg:grid-cols-2 gap-0" style={{ height: apiQuestions.length > 0 ? 'calc(100vh - 14rem)' : 'calc(100vh - 10rem)' }}>
        {/* Coding Question - 2 panel layout */}
        {currentApiQuestion?.format === 'coding' && (
          <>
            {/* Left Panel - Problem Description with Tabs */}
            <ProblemPanel
              problem={currentProblem}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              feedback={feedback}
              isFetchingFeedback={isFetchingFeedback}
            />

            {/* Right Panel - Code Editor (top) & Console (bottom) */}
            <div className="flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
              {/* Code Editor Section */}
              <CodeEditor
                code={code}
                onCodeChange={setCode}
                onRunCode={handleRunCode}
                onRequestFeedback={handleRequestFeedback}
                onReset={handleReset}
                isRunning={isRunning}
                isFetchingFeedback={isFetchingFeedback}
              />

              {/* Console / Test Results Section */}
              <ConsoleOutput testResults={testResults} output={output} />
            </div>
          </>
        )}

        {/* Multiple Choice Question - Full width */}
        {currentApiQuestion?.format === 'multiple-choice' && (
          <div className="col-span-2">
            <MultipleChoiceQuestion
              prompt={currentApiQuestion.prompt}
              choices={currentApiQuestion.choices || []}
              onSubmit={handleMultipleChoiceSubmit}
              isSubmitted={mcSubmitted}
              selectedAnswer={selectedChoice}
            />
          </div>
        )}

        {/* Free Response Question - Full width */}
        {currentApiQuestion?.format === 'free-response' && (
          <div className="col-span-2">
            <FreeResponseQuestion
              prompt={currentApiQuestion.prompt}
              solutionOutline={currentApiQuestion.solutionOutline}
              onSubmit={handleFreeResponseSubmit}
              isSubmitted={frSubmitted}
              userAnswer={freeResponseAnswer}
              feedback={frFeedback}
              isFetchingFeedback={isFetchingFrFeedback}
            />
          </div>
        )}

        {/* Fallback for no API questions - show mock problem */}
        {!currentApiQuestion && (
          <>
            <ProblemPanel
              problem={currentProblem}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              feedback={feedback}
              isFetchingFeedback={isFetchingFeedback}
            />
            <div className="flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
              <CodeEditor
                code={code}
                onCodeChange={setCode}
                onRunCode={handleRunCode}
                onRequestFeedback={handleRequestFeedback}
                onReset={handleReset}
                isRunning={isRunning}
                isFetchingFeedback={isFetchingFeedback}
              />
              <ConsoleOutput testResults={testResults} output={output} />
            </div>
          </>
        )}
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        language={currentApiQuestion?.format === 'coding' ? language : undefined}
        testsPassed={currentApiQuestion?.format === 'coding' ? testResults.filter((t) => t.passed).length : undefined}
        totalTests={currentApiQuestion?.format === 'coding' ? (currentApiQuestion?.testCases?.length || testResults.length || 5) : undefined}
        liveProctorMode={liveProctorMode}
      />
    </div>
  );
}
