'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface FillerWordPopupProps {
  word: string;
  onClose: () => void;
}

export default function FillerWordPopup({ word, onClose }: FillerWordPopupProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px]">
        <div className="flex-shrink-0 bg-white/20 rounded-full p-2 animate-pulse">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Filler Word Detected!</p>
          <p className="text-xs opacity-90 mt-1">
            Try to avoid: <span className="font-semibold">&quot;{word}&quot;</span>
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
