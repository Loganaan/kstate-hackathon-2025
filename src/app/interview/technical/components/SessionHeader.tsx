'use client';

import { Clock, Eye, EyeOff } from 'lucide-react';

interface SessionHeaderProps {
  title: string;
  difficulty: string;
  timeElapsed: number;
  liveProctorMode: boolean;
  onToggleProctor: () => void;
}

export default function SessionHeader({
  title,
  difficulty,
  timeElapsed,
  liveProctorMode,
  onToggleProctor,
}: SessionHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-[rgba(76,166,38,0.1)] text-[rgba(76,166,38,1)]';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-full px-6 py-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
              <span className={`ml-3 text-sm font-medium px-3 py-1 rounded-full ${getDifficultyColor()}`}>
                {difficulty}
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Technical Interview Practice</p>
          </div>

          {/* Timer and Mode Toggle */}
          <div className="flex items-center gap-4">
            {/* Session Timer */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                {formatTime(timeElapsed)}
              </span>
            </div>

            {/* Live Proctor Toggle */}
            <button
              onClick={onToggleProctor}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg ${
                liveProctorMode
                  ? 'bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {liveProctorMode ? (
                <>
                  <Eye className="w-5 h-5" />
                  Live AI Proctor
                </>
              ) : (
                <>
                  <EyeOff className="w-5 h-5" />
                  Solo Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
