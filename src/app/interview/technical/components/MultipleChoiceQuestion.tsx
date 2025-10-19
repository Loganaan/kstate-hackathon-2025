'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Choice {
  label: string;
  text: string;
  correct?: boolean;
}

interface MultipleChoiceQuestionProps {
  prompt: string;
  choices: Choice[];
  onSubmit: (selectedChoice: string) => void;
  isSubmitted: boolean;
  selectedAnswer: string | null;
}

export default function MultipleChoiceQuestion({
  prompt,
  choices,
  onSubmit,
  isSubmitted,
  selectedAnswer,
}: MultipleChoiceQuestionProps) {
  const [selected, setSelected] = useState<string | null>(selectedAnswer);

  const handleSubmit = () => {
    if (selected) {
      onSubmit(selected);
    }
  };

  const getChoiceStyle = (choice: Choice) => {
    if (!isSubmitted) {
      return selected === choice.label
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700';
    }

    // After submission, show correct/incorrect
    if (choice.correct) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    }
    if (selected === choice.label && !choice.correct) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }
    return 'border-gray-300 dark:border-gray-700';
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

          {/* Choices */}
          <div className="space-y-4">
            {choices.map((choice) => (
              <button
                key={choice.label}
                onClick={() => !isSubmitted && setSelected(choice.label)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${getChoiceStyle(
                  choice
                )} ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {isSubmitted && choice.correct && (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                    {isSubmitted && selected === choice.label && !choice.correct && (
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    )}
                    {!isSubmitted && (
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selected === choice.label
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {selected === choice.label && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {choice.label}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {choice.text}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selected}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <div className="text-center">
              <div
                className={`text-lg font-semibold ${
                  choices.find((c) => c.label === selected)?.correct
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {choices.find((c) => c.label === selected)?.correct
                  ? '✓ Correct! Well done!'
                  : '✗ Incorrect. The correct answer is highlighted above.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
