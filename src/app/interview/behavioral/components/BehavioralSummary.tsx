'use client';

import { Trophy, MessageCircle, TrendingUp, Star, Download } from 'lucide-react';

interface QuestionAnswer {
  question: string;
  answer: string;
  feedback: string;
  rating: number; // 1-5 stars
}

interface BehavioralSummaryProps {
  questionAnswers: QuestionAnswer[];
  overallFeedback: string;
  overallRating: number; // 1-10
  onRestart: () => void;
  onExit: () => void;
}

export default function BehavioralSummary({
  questionAnswers,
  overallFeedback,
  overallRating,
  onRestart,
  onExit,
}: BehavioralSummaryProps) {
  const downloadReport = () => {
    const reportContent = `
BEHAVIORAL INTERVIEW REPORT
===========================

Time Completed: ${new Date().toLocaleString()}
Overall Rating: ${overallRating}/10

QUESTION & ANSWER DETAILS
-------------------------
${questionAnswers
  .map(
    (qa, idx) => `
Question ${idx + 1}:
${qa.question}

Your Answer:
${qa.answer}

Feedback:
${qa.feedback}

Rating: ${qa.rating}/5 stars
${'='.repeat(60)}
`
  )
  .join('\n')}

OVERALL FEEDBACK
----------------
${overallFeedback}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `behavioral-interview-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStars = (rating: number, maxStars: number = 5) => {
    return (
      <div className="flex gap-1">
        {[...Array(maxStars)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pl-20 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Interview Complete!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Here&apos;s your performance analysis and feedback.
          </p>
        </div>

        {/* Overall Rating Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Overall Interview Readiness
            </h2>
          </div>
          <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            {overallRating}/10
          </div>
          <div className="max-w-2xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed">
            {overallFeedback}
          </div>
        </div>

        {/* Question & Answer Details */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Question Feedback
            </h2>
          </div>
          <div className="space-y-6">
            {questionAnswers.map((qa, idx) => (
              <div
                key={idx}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-800/50"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded">
                        Question {idx + 1}
                      </span>
                      {renderStars(qa.rating)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {qa.question}
                    </h3>
                  </div>
                </div>

                {/* Answer */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Answer:
                  </h4>
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                    {qa.answer}
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Feedback:
                  </h4>
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {qa.feedback}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={downloadReport}
            className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Start New Interview
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
