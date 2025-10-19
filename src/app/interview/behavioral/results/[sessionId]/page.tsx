'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import BehavioralSummary from '../../components/BehavioralSummary';

interface QuestionAnswer {
  question: string;
  answer: string;
  feedback: string;
  rating: number;
}

interface FeedbackData {
  questionFeedback: QuestionAnswer[];
  overallFeedback: string;
  overallRating: number;
}

export default function BehavioralResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  
  // Check if this is part of full interview flow
  const isFullInterview = searchParams.get('fullInterview') === 'true';
  
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // Fetch the session data from Firebase
        const { firebaseUtils } = await import('@/lib/firebase');
        const session = await firebaseUtils.getChatSession(sessionId);
        
        if (!session) {
          setError('Session not found');
          return;
        }

        // Convert messages to the format expected by the API
        const messages = session.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Fetch feedback from the API
        const response = await fetch('/api/behavioral-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }

        const feedback = await response.json();
        setFeedbackData(feedback);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load interview results');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResults();
    }
  }, [sessionId]);

  const handleRestart = () => {
    router.push('/interview/behavioral');
  };

  const handleExit = () => {
    router.push('/interview/behavioral');
  };

  const handleContinueToTechnical = () => {
    // Get stored full interview params
    const fullInterviewParamsStr = sessionStorage.getItem('fullInterviewParams');
    const searchParams = new URLSearchParams();
    searchParams.append('fullInterview', 'true');
    
    if (fullInterviewParamsStr) {
      try {
        const params = JSON.parse(fullInterviewParamsStr);
        if (params.company) searchParams.append('company', params.company);
        if (params.role) searchParams.append('role', params.role);
        if (params.seniority) searchParams.append('seniority', params.seniority);
        if (params.jobDescription) searchParams.append('jobDescription', params.jobDescription);
      } catch (e) {
        console.error('Error parsing full interview params:', e);
      }
    }
    
    router.push(`/interview/technical?${searchParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pl-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading Your Results...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analyzing your interview performance
          </p>
        </div>
      </div>
    );
  }

  if (error || !feedbackData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pl-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {error || 'Unable to load results'}
          </h2>
          <button
            onClick={() => router.push('/interview/behavioral')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Return to Interviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <BehavioralSummary
      questionAnswers={feedbackData.questionFeedback}
      overallFeedback={feedbackData.overallFeedback}
      overallRating={feedbackData.overallRating}
      onRestart={handleRestart}
      onExit={handleExit}
      isFullInterview={isFullInterview}
      onContinueToTechnical={handleContinueToTechnical}
    />
  );
}
