'use client';

import { useState, useEffect, useRef } from 'react';
import SessionHeader from './components/SessionHeader';
import ProblemPanel from './components/ProblemPanel';
import CodeEditor from './components/CodeEditor';
import ConsoleOutput from './components/ConsoleOutput';
import ProctorModal from './components/ProctorModal';
import ProctorHintBox from './components/ProctorHintBox';
import StatusBar from './components/StatusBar';

// Mock problem data
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
  // Editor state
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java'>('javascript');
  const [code, setCode] = useState(MOCK_PROBLEM.starterCode.javascript);

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

  // Start timer on mount
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

  // Handle language change
  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'java') => {
    setLanguage(newLang);
    setCode(MOCK_PROBLEM.starterCode[newLang]);
    setOutput('');
    setTestResults([]);
  };

  // Handle Run Code (TODO: Connect to backend)
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');

    // Simulate running code
    setTimeout(() => {
      const mockResults = [
        { passed: true, input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]' },
        { passed: true, input: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]' },
        { passed: false, input: '[3,3], 6', expected: '[0,1]', actual: '[]' },
      ];

      setTestResults(mockResults);
      setOutput(
        `✓ Test 1 passed\n✓ Test 2 passed\n✗ Test 3 failed\n\nExpected: [0,1]\nActual: []`
      );
      setIsRunning(false);
    }, 1500);
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
- Current approach has O(n²) time complexity due to nested loops
- Consider using a hash map for O(n) optimization
- Edge case handling for duplicate values could be improved

💡 **Optimization Suggestion:**
Use a single pass with a hash map to store complements:
1. Iterate through the array once
2. For each number, check if (target - number) exists in the map
3. If found, return the indices; otherwise, add current number to map

**Complexity:**
- Time: O(n²) → Can be optimized to O(n)
- Space: O(1) → Would become O(n) with hash map

Keep up the good work! Try implementing the hash map approach for better performance.`;

      setFeedback(mockFeedback);
      setIsFetchingFeedback(false);
    }, 2000);
  };

  // Handle Reset
  const handleReset = () => {
    setCode(MOCK_PROBLEM.starterCode[language]);
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

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pl-20">
      {/* Header */}
      <SessionHeader
        title={MOCK_PROBLEM.title}
        difficulty={MOCK_PROBLEM.difficulty}
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

      {/* Main Content - 3 Panel Layout */}
      <div className="grid lg:grid-cols-2 gap-0" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* Left Panel - Problem Description with Tabs */}
        <ProblemPanel
          problem={MOCK_PROBLEM}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          feedback={feedback}
          isFetchingFeedback={isFetchingFeedback}
        />

        {/* Right Panel - Code Editor (top) & Console (bottom) */}
        <div className="flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
          {/* Code Editor Section */}
          <CodeEditor
            language={language}
            code={code}
            onCodeChange={setCode}
            onLanguageChange={handleLanguageChange}
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
        totalTests={testResults.length || 5}
        liveProctorMode={liveProctorMode}
      />
    </div>
  );
}
