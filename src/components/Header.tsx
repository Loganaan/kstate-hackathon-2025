'use client';

import ThemeLogo from "./ThemeLogo";
import { useSearchParams, usePathname } from "next/navigation";
import { useMemo, Suspense } from "react";

function HeaderContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Check if this is part of a full interview flow
  const isFullInterview = searchParams.get('fullInterview') === 'true';
  
  // Determine current stage and progress
  const { stage, totalProgress } = useMemo(() => {
    if (!isFullInterview) {
      return { stage: null, totalProgress: 0 };
    }

    // Behavioral interview - 4 questions (checkpoint at 33.33%)
    if (pathname.includes('/interview/behavioral')) {
      return { 
        stage: 'Behavioral Interview', 
        totalProgress: 33.33 // First checkpoint (Behavioral)
      };
    }
    
    // Technical interview - 2 questions (checkpoint at 66.66%)
    if (pathname.includes('/interview/technical')) {
      return { 
        stage: 'Technical Interview', 
        totalProgress: 66.66 // Second checkpoint (Technical)
      };
    }

    return { stage: null, totalProgress: 0 };
  }, [isFullInterview, pathname]);

  // Determine which checkpoints are completed
  // Checkpoints at: Start (0%), Behavioral (33.33%), Technical (66.66%), Complete (100%)
  const checkpoints = [
    { label: 'Start', progress: 0, completed: totalProgress >= 0 },
    { label: 'Behavioral', progress: 33.33, completed: totalProgress >= 33.33 },
    { label: 'Technical', progress: 66.66, completed: totalProgress >= 66.66 },
    { label: 'Complete', progress: 100, completed: totalProgress >= 100 }
  ];

  return (
    <div className="w-full flex flex-col items-center mt-0 py-3 transition-colors">
      <ThemeLogo />
      
      {/* Progress Bar - Only show in full interview mode */}
      {isFullInterview && stage && (
        <div className="w-full max-w-4xl px-8 pb-3 pt-4">
          {/* Current Stage Indicator */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[rgba(76,166,38,0.1)] to-[rgba(76,166,38,0.05)] dark:from-[rgba(76,166,38,0.2)] dark:to-[rgba(76,166,38,0.1)] rounded-full border border-[rgba(76,166,38,0.3)] text-sm font-semibold text-[rgba(76,166,38,1)]">
              <div className="w-2 h-2 bg-[rgba(76,166,38,1)] rounded-full animate-pulse"></div>
              {stage}
            </span>
          </div>
          
          {/* Circular Checkpoint Progress Bar */}
          <div className="relative flex items-center justify-between px-8">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-12">
              <div 
                className="h-full bg-gradient-to-r from-[rgba(76,166,38,1)] via-[rgba(76,166,38,0.9)] to-[rgba(76,166,38,0.8)] transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(76,166,38,0.3)]"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            
            {/* Checkpoint Circles */}
            {checkpoints.map((checkpoint, index) => (
              <div key={index} className="relative flex flex-col items-center z-10">
                {/* Circle with Icon */}
                <div 
                  className={`w-8 h-8 rounded-full border-3 flex items-center justify-center transition-all duration-500 ${
                    checkpoint.completed
                      ? 'bg-gradient-to-br from-[rgba(76,166,38,1)] to-[rgba(76,166,38,0.8)] border-[rgba(76,166,38,1)] shadow-[0_0_12px_rgba(76,166,38,0.6)] scale-110'
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {checkpoint.completed ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                  )}
                </div>
                {/* Label */}
                <span 
                  className={`absolute top-10 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                    checkpoint.completed
                      ? 'text-[rgba(76,166,38,1)] scale-105'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {checkpoint.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <div className="w-full flex flex-col items-center mt-0 py-2 transition-colors">
        <ThemeLogo />
      </div>
    }>
      <HeaderContent />
    </Suspense>
  );
}
