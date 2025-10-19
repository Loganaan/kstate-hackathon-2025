'use client';

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface FreeResponseQuestionProps {
  prompt: string;
  solutionOutline?: string;
  onSubmit: (answer: string) => void;
  isSubmitted: boolean;
  userAnswer: string;
  feedback: string;
  isFetchingFeedback: boolean;
}

export default function FreeResponseQuestion({
  prompt,
  solutionOutline,
  onSubmit,
  isSubmitted,
  userAnswer,
  feedback,
  isFetchingFeedback,
}: FreeResponseQuestionProps) {
  const [answer, setAnswer] = useState(userAnswer);

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Question Prompt */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Question
          </h2>
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {prompt}
            </p>
          </div>

          {/* Answer Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => !isSubmitted && setAnswer(e.target.value)}
              disabled={isSubmitted}
              placeholder="Type your answer here..."
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed resize-none font-mono text-sm"
            />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {answer.length} characters
            </div>
          </div>

          {/* AI Feedback Section */}
          {isSubmitted && (
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  AI Feedback
                </h3>
              </div>
              {isFetchingFeedback ? (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span>Analyzing your answer...</span>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {feedback}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Solution Outline (shown after submission) */}
          {isSubmitted && solutionOutline && !isFetchingFeedback && (
            <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Key Points to Consider
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {solutionOutline}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit for AI Review
            </button>
          ) : (
            <div className="text-center text-green-600 dark:text-green-400 font-semibold">
              ✓ Answer submitted! Review the feedback above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
