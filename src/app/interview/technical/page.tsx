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

  // Editor state - Python only
  const [language] = useState<'python'>('python');
  const [code, setCode] = useState(MOCK_PROBLEM.starterCode.python);

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

  // Update code when question changes
  useEffect(() => {
    if (currentApiQuestion?.starterCode) {
      // Use the starter code directly (Python only)
      const starterCode = currentApiQuestion.starterCode || '# Write your solution here\ndef solution():\n    pass';
      setCode(starterCode);
      setOutput('');
      setFeedback('');
      setTestResults([]);
      setActiveTab('question');
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
    if (currentQuestionIndex < apiQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle Previous Question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === apiQuestions.length - 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Next →
              </button>
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

      {/* Main Content - 3 Panel Layout */}
      <div className="grid lg:grid-cols-2 gap-0" style={{ height: apiQuestions.length > 0 ? 'calc(100vh - 14rem)' : 'calc(100vh - 10rem)' }}>
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
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        language={language}
        testsPassed={testResults.filter((t) => t.passed).length}
        totalTests={currentApiQuestion?.testCases?.length || testResults.length || 5}
        liveProctorMode={liveProctorMode}
      />
    </div>
  );
}
