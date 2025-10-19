'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InterviewParams } from '@/components/FullInterviewModal';

type InterviewStage = 'behavioral' | 'technical' | 'complete';

export default function FullInterviewSession() {
  const router = useRouter();
  const [stage, setStage] = useState<InterviewStage>('behavioral');
  const [interviewParams, setInterviewParams] = useState<InterviewParams | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load interview parameters from sessionStorage
    const paramsStr = sessionStorage.getItem('fullInterviewParams');
    if (!paramsStr) {
      // No parameters found, redirect to home
      router.push('/');
      return;
    }

    try {
      const params = JSON.parse(paramsStr) as InterviewParams;
      setInterviewParams(params);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to parse interview parameters:', error);
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const startBehavioralInterview = () => {
      // Create a new behavioral interview session
      const sessionId = `behavioral-${Date.now()}`;
      
      // Store session context
      sessionStorage.setItem('fullInterviewStage', 'behavioral');
      sessionStorage.setItem('behavioralSessionId', sessionId);
      
      // Redirect to behavioral interview with params
      const params = new URLSearchParams({
        company: interviewParams?.company || '',
        role: interviewParams?.role || '',
        seniority: interviewParams?.seniority || '',
        jobDescription: interviewParams?.jobDescription || '',
        companyInfo: interviewParams?.companyInfo || '',
        fullInterview: 'true',
      });
      
      router.push(`/interview/behavioral?${params.toString()}`);
    };

    const startTechnicalInterview = () => {
      // Create a new technical interview session
      const sessionId = `technical-${Date.now()}`;
      
      // Store session context
      sessionStorage.setItem('fullInterviewStage', 'technical');
      sessionStorage.setItem('technicalSessionId', sessionId);
      
      // Redirect to technical interview with params
      const params = new URLSearchParams({
        company: interviewParams?.company || '',
        role: interviewParams?.role || '',
        seniority: interviewParams?.seniority || '',
        jobDescription: interviewParams?.jobDescription || '',
        fullInterview: 'true',
      });
      
      router.push(`/interview/technical?${params.toString()}`);
    };

    const handleCompletion = () => {
      // Clean up session storage
      sessionStorage.removeItem('fullInterviewParams');
      sessionStorage.removeItem('fullInterviewStage');
      sessionStorage.removeItem('behavioralSessionId');
      sessionStorage.removeItem('technicalSessionId');
      
      // Redirect to dashboard to view results
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    };

    // Determine which stage to show based on current state
    if (stage === 'behavioral' && interviewParams) {
      // Start behavioral interview
      startBehavioralInterview();
    } else if (stage === 'technical' && interviewParams) {
      // Start technical interview
      startTechnicalInterview();
    } else if (stage === 'complete') {
      // Show completion message and redirect
      handleCompletion();
    }
  }, [stage, interviewParams, router]);

  // Listen for messages from interview pages to know when to transition
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'INTERVIEW_COMPLETE') {
        const completedStage = event.data.stage;
        
        if (completedStage === 'behavioral') {
          // Move to technical interview
          setStage('technical');
        } else if (completedStage === 'technical') {
          // Mark as complete
          setStage('complete');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Preparing your interview...</p>
        </div>
      </div>
    );
  }

  if (stage === 'complete') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <div className="mb-8">
            <svg 
              className="w-24 h-24 mx-auto text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Interview Complete!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Congratulations on completing both the behavioral and technical interviews.
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Redirecting you to the dashboard to view your results...
          </p>
        </div>
      </div>
    );
  }

  // This component orchestrates the flow, actual interview UI is shown in child routes
  return null;
}
