'use client';

import { useRouter } from 'next/navigation';
import { Trophy } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCompletion?: boolean;
  sessionId?: string;
}

export default function ChatMessage({ role, content, timestamp, isCompletion, sessionId }: ChatMessageProps) {
  const router = useRouter();

  const handleViewResults = () => {
    if (sessionId) {
      router.push(`/interview/behavioral/results/${sessionId}`);
    }
  };

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 ${
          role === 'user'
            ? 'bg-[rgba(76,166,38,1)] text-white'
            : isCompletion
            ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 text-gray-900 dark:text-gray-100 border-2 border-green-300 dark:border-green-700'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        }`}
      >
        {isCompletion && (
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-green-600 dark:text-green-400">Interview Complete!</span>
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {isCompletion && sessionId && (
          <button
            onClick={handleViewResults}
            className="mt-4 w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            View Detailed Results
          </button>
        )}
        <span
          className={`text-xs mt-2 block ${
            role === 'user' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

