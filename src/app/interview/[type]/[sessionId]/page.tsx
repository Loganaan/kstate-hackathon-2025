'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mic, MicOff, SkipForward, Play, Terminal, Send, RotateCcw } from 'lucide-react';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { type, sessionId } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // TODO: Implement your solution here
  
}`);

  useEffect(() => {
    // Simulate loading session data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <LoadingSpinner />
      </div>
    );
  }

  // Render behavioral interview session
  if (type === 'behavioral') {
    return (
      <div className="bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-8rem)] pl-24">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Behavioral Interview Session</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Session ID: {sessionId as string}</p>
              </div>
              <Button variant="secondary" onClick={() => router.push('/dashboard')}>
                End Session
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Panel - Current Question */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Question</h2>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-gray-800 leading-relaxed">
                    Tell me about a time when you had to deal with a difficult team member. How did you handle the situation?
                  </p>
                </div>
                
                {/* Tips */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tips:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use the STAR method</li>
                    <li>• Be specific and concise</li>
                    <li>• Focus on your actions</li>
                    <li>• Highlight the results</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Center Panel - Recording Area */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center min-h-[500px]">
                
                {/* Microphone Visual */}
                <div className={`
                  w-32 h-32 rounded-full flex items-center justify-center mb-8
                  transition-all duration-300
                  ${isRecording 
                    ? 'bg-red-100 animate-pulse shadow-lg shadow-red-200' 
                    : 'bg-gray-100'
                  }
                `}>
                  {isRecording ? (
                    <Mic className="w-16 h-16 text-red-600" />
                  ) : (
                    <MicOff className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                {/* Status Text */}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {isRecording ? 'Recording...' : 'Ready to Record'}
                  </h3>
                  <p className="text-gray-600">
                    {isRecording 
                      ? 'Speak clearly and take your time' 
                      : 'Click the button below to start'
                    }
                  </p>
                  
                  {/* Timer */}
                  {isRecording && (
                    <div className="mt-4">
                      <span className="text-3xl font-mono text-red-600">00:42</span>
                    </div>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant={isRecording ? 'danger' : 'primary'}
                    onClick={() => setIsRecording(!isRecording)}
                    className="flex items-center gap-2"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel - Transcript */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Transcript</h2>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                  {isRecording ? (
                    <div className="space-y-2">
                      <p className="text-gray-700 leading-relaxed">
                        <span className="text-gray-400">Transcription will appear here as you speak...</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center mt-8">
                      Start recording to see your transcript
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Session Duration: <span className="font-semibold">5:32</span>
              </div>
              
              <div className="flex gap-4">
                <Button variant="secondary">
                  Save Progress
                </Button>
                <Button 
                  disabled={isRecording}
                  className="flex items-center gap-2"
                >
                  Next Question
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render technical interview session
  if (type === 'technical') {
    return (
      <div className="bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-8rem)] pl-24">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-full px-6 sm:px-8 lg:px-12 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Technical Interview Session</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Session ID: {sessionId as string}</p>
              </div>
              
              {/* Top Toolbar */}
              <div className="flex gap-3">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Run Code
                </Button>
                <Button className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit
                </Button>
                <Button variant="secondary" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-[calc(100vh-16rem)]">
          <div className="grid lg:grid-cols-2 gap-0 h-full">
            
            {/* Left Panel - Problem & Code Editor */}
            <div className="flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              
              {/* Problem Description */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6 overflow-y-auto max-h-64">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Problem: Two Sum</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Write a function that takes an array of integers and a target value, then returns the indices of two numbers that add up to the target.
                </p>
                
                {/* Examples */}
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    <div className="text-gray-600 dark:text-gray-400 mb-2">Example 1:</div>
                    <div className="text-gray-800 dark:text-gray-200">
                      Input: nums = [2,7,11,15], target = 9<br/>
                      Output: [0,1]
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Editor Area */}
              <div className="flex-1 flex flex-col">
                <div className="bg-gray-800 dark:bg-gray-950 px-4 py-2 flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-mono">solution.js</span>
                  <select className="bg-gray-700 dark:bg-gray-900 text-gray-300 text-sm rounded px-2 py-1 border-none focus:ring-2 focus:ring-blue-500">
                    <option>JavaScript</option>
                    <option>Python</option>
                  </select>
                </div>
                
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 bg-gray-900 dark:bg-black text-gray-100 font-mono text-sm p-4 focus:outline-none resize-none"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Right Panel - AI Feedback & Console */}
            <div className="flex flex-col bg-gray-50 dark:bg-gray-950">
              
              {/* AI Feedback Section */}
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">AI Feedback</h2>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                      <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        AI feedback will appear here after you run or submit your code.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Console Output Section */}
              <div className="border-t border-gray-300 dark:border-gray-700">
                <div className="bg-gray-800 dark:bg-gray-950 px-4 py-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm font-semibold">Console</span>
                </div>
                
                <div className="bg-gray-900 dark:bg-black p-4 h-48 overflow-y-auto font-mono text-sm">
                  <p className="text-gray-500">{'//'} Output will appear here when you run your code</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid interview type
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Invalid Interview Type</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The interview type &quot;{type as string}&quot; is not recognized.</p>
        <Button onClick={() => router.push('/interview/select')}>
          Back to Interview Selection
        </Button>
      </div>
    </div>
  );
}
