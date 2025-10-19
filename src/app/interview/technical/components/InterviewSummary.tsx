'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, FileText, Trophy, Clock, Target, TrendingUp, Download } from 'lucide-react';

interface QuestionResult {
  questionNumber: number;
  format: string;
  difficulty: string;
  topicTags: string[];
  status: 'correct' | 'incorrect' | 'partial' | 'submitted';
  score?: number; // For coding: percentage of tests passed
  details?: string;
}

interface InterviewSummaryProps {
  results: QuestionResult[];
  timeElapsed: number;
  onRestart: () => void;
  onExit: () => void;
}

export default function InterviewSummary({
  results,
  timeElapsed,
  onRestart,
  onExit,
}: InterviewSummaryProps) {
  const [generatingReport, setGeneratingReport] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Calculate statistics
  const totalQuestions = results.length;
  const codingQuestions = results.filter((r) => r.format === 'coding');
  const mcQuestions = results.filter((r) => r.format === 'multiple-choice');
  const frQuestions = results.filter((r) => r.format === 'free-response');

  const correctAnswers = results.filter((r) => r.status === 'correct').length;
  const averageScore =
    codingQuestions.length > 0
      ? codingQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / codingQuestions.length
      : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'incorrect':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'partial':
        return <Target className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800';
      case 'incorrect':
        return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800';
      case 'partial':
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800';
    }
  };

  const generateAISummary = async () => {
    setGeneratingReport(true);
    try {
      const response = await fetch('/api/technical-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results,
          timeElapsed,
          totalQuestions,
        }),
      });

      const data = await response.json();
      setAiSummary(data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setAiSummary('Unable to generate AI summary at this time.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const downloadReport = () => {
    const reportContent = `
TECHNICAL INTERVIEW REPORT
========================

Time Completed: ${new Date().toLocaleString()}
Total Duration: ${formatTime(timeElapsed)}

OVERVIEW
--------
Total Questions: ${totalQuestions}
- Coding: ${codingQuestions.length}
- Multiple Choice: ${mcQuestions.length}
- Free Response: ${frQuestions.length}

Correct Answers: ${correctAnswers}/${totalQuestions}
Average Coding Score: ${averageScore.toFixed(1)}%

DETAILED RESULTS
----------------
${results
  .map(
    (r, idx) => `
Question ${idx + 1}: ${r.format.toUpperCase()}
Difficulty: ${r.difficulty}
Topics: ${r.topicTags.join(', ')}
Status: ${r.status}
${r.score !== undefined ? `Score: ${r.score}%` : ''}
${r.details ? `Details: ${r.details}` : ''}
`
  )
  .join('\n')}

${aiSummary ? `\nAI FEEDBACK\n-----------\n${aiSummary}` : ''}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
            Great job! Here&apos;s your performance summary.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Questions</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalQuestions}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Correct</span>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {correctAnswers}/{totalQuestions}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Score</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {averageScore.toFixed(0)}%
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {formatTime(timeElapsed)}
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Question Results
          </h2>
          <div className="space-y-4">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`border-2 rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Question {idx + 1}
                        </h3>
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs font-medium rounded">
                          {result.format}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            result.difficulty === 'Easy'
                              ? 'bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : result.difficulty === 'Medium'
                              ? 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                              : 'bg-red-200 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {result.difficulty}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {result.topicTags.slice(0, 3).map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {result.score !== undefined && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Score: <span className="font-semibold">{result.score}%</span> tests passed
                        </div>
                      )}
                      {result.details && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {result.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            AI Performance Analysis
          </h2>
          {!aiSummary ? (
            <button
              onClick={generateAISummary}
              disabled={generatingReport}
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {generatingReport ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Analysis...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Generate AI Analysis
                </>
              )}
            </button>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {aiSummary}
              </div>
            </div>
          )}
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
