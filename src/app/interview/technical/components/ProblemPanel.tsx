'use client';

import { Lightbulb } from 'lucide-react';

interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface ProblemData {
  title: string;
  difficulty: string;
  description: string;
  examples: Example[];
  constraints: string[];
}

interface ProblemPanelProps {
  problem: ProblemData;
  activeTab: 'question' | 'feedback';
  onTabChange: (tab: 'question' | 'feedback') => void;
  feedback: string;
  isFetchingFeedback?: boolean;
}

export default function ProblemPanel({
  problem,
  activeTab,
  onTabChange,
  feedback,
}: ProblemPanelProps) {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => onTabChange('question')}
          className={`flex-1 px-6 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'question'
              ? 'text-[rgba(76,166,38,1)] border-b-2 border-[rgba(76,166,38,1)] bg-gray-50 dark:bg-gray-800'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          Question
        </button>
        <button
          onClick={() => onTabChange('feedback')}
          className={`flex-1 px-6 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'feedback'
              ? 'text-[rgba(76,166,38,1)] border-b-2 border-[rgba(76,166,38,1)] bg-gray-50 dark:bg-gray-800'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Feedback
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'question' ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Problem Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {problem.description}
            </p>

            {/* Examples */}
            <div className="space-y-3 mb-4">
              {problem.examples.map((example, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm"
                >
                  <div className="text-gray-600 dark:text-gray-400 mb-2">
                    Example {idx + 1}:
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 space-y-1">
                    <div>
                      <span className="text-[rgba(76,166,38,1)] font-semibold">Input:</span>{' '}
                      {example.input}
                    </div>
                    <div>
                      <span className="text-[rgba(76,166,38,1)] font-semibold">Output:</span>{' '}
                      {example.output}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                      {example.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Constraints:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx}>• {constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[rgba(76,166,38,1)]" />
              AI Feedback
            </h2>
            {feedback ? (
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 whitespace-pre-line text-sm text-gray-900 dark:text-gray-100">
                  {feedback}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center py-12">
                <div className="text-center max-w-md">
                  <Lightbulb className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Click <span className="font-semibold">&quot;Request Feedback&quot;</span> to
                    get AI-powered insights on your code including:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400 text-left">
                    <li>• Time and space complexity analysis</li>
                    <li>• Code quality and best practices</li>
                    <li>• Alternative approaches</li>
                    <li>• Common edge cases to consider</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
