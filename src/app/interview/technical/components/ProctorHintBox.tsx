'use client';

import { Eye } from 'lucide-react';

interface ProctorHintBoxProps {
  hints: string[];
  isActive: boolean;
}

export default function ProctorHintBox({ hints, isActive }: ProctorHintBoxProps) {
  if (!isActive || hints.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-[rgba(76,166,38,1)] text-white rounded-lg shadow-2xl p-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-1">AI Proctor Active</p>
            <p className="text-sm opacity-90">{hints[hints.length - 1]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
