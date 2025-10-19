'use client';

import { Mic, Video } from 'lucide-react';
import Button from '@/components/Button';

interface LivePracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function LivePracticeModal({ isOpen, onClose, onStart }: LivePracticeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pl-24">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Live Practice Interview
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Get ready for a real-time voice interview session
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div className="bg-[rgba(76,166,38,0.1)] dark:bg-[rgba(76,166,38,0.2)] rounded-lg p-4 border border-[rgba(76,166,38,0.3)] dark:border-[rgba(76,166,38,0.4)]">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              What to expect:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Real-time voice conversation with AI interviewer</li>
              <li>• 5-7 behavioral questions based on STAR method</li>
              <li>• Live transcription and feedback</li>
              <li>• Session recorded for later review</li>
              <li>• Approximately 15-20 minutes</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <Mic className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Please ensure your microphone is enabled and you&apos;re in a quiet environment
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2 bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)]"
            onClick={onStart}
          >
            <Video className="w-4 h-4" />
            Start Session
          </Button>
        </div>
      </div>
    </div>
  );
}
