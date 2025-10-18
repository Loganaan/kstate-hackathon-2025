'use client';

import { Eye, CheckCircle } from 'lucide-react';

interface ProctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function ProctorModal({ isOpen, onClose, onStart }: ProctorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(76,166,38,0.1)] flex items-center justify-center">
            <Eye className="w-6 h-6 text-[rgba(76,166,38,1)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Start Live AI Proctor
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Real-time coding assistance</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="space-y-4 mb-6">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            The AI Proctor will monitor your coding session and provide helpful hints and
            suggestions in real-time to guide you toward the optimal solution.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[rgba(76,166,38,1)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Get contextual hints every few seconds
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[rgba(76,166,38,1)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Receive optimization suggestions
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[rgba(76,166,38,1)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Learn best practices as you code
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            💡 You can stop the AI Proctor session at any time by clicking the button again.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}
