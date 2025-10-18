'use client';

import { useState } from 'react';
import { Mic, MicOff, SkipForward, Play, Pause } from 'lucide-react';
import Button from '@/components/Button';

export default function BehavioralInterviewPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Placeholder question
  const currentQuestion = "Tell me about a time when you had to deal with a difficult team member. How did you handle the situation?";

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Behavioral Interview Session</h1>
          <p className="text-gray-600 mt-1">Question 1 of 5</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Current Question */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Question</h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-gray-800 leading-relaxed">
                  {currentQuestion}
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
                
                {isRecording && (
                  <Button
                    variant="secondary"
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex items-center gap-2"
                  >
                    {isPaused ? (
                      <Play className="w-5 h-5" />
                    ) : (
                      <Pause className="w-5 h-5" />
                    )}
                  </Button>
                )}
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
                      {/* TODO: Real-time transcription will appear here */}
                      <span className="text-gray-400">Transcription will appear here as you speak...</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center mt-8">
                    Start recording to see your transcript
                  </p>
                )}
              </div>
              
              {/* Notes Section */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Personal Notes
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Add any notes or thoughts here..."
                />
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
