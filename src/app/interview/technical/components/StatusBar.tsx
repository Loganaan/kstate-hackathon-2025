'use client';

import { Eye } from 'lucide-react';

interface StatusBarProps {
  language: string;
  testsPassed: number;
  totalTests: number;
  liveProctorMode: boolean;
}

export default function StatusBar({
  language,
  testsPassed,
  totalTests,
  liveProctorMode,
}: StatusBarProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-3">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-6">
          <div className="text-gray-600 dark:text-gray-400">
            Language:{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {language}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Test Cases:{' '}
            <span className="font-semibold text-[rgba(76,166,38,1)]">
              {testsPassed} / {totalTests}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {liveProctorMode && (
            <span className="flex items-center gap-2 text-[rgba(76,166,38,1)] font-medium">
              <Eye className="w-4 h-4" />
              AI Proctor Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
