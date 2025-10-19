'use client';

import { Eye, Mic, MicOff, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ProctorHintBoxProps {
  messages: Message[];
  isActive: boolean;
  onRecord: () => void;
  isRecording: boolean;
  isProcessing: boolean;
}

export default function ProctorHintBox({ 
  messages, 
  isActive, 
  onRecord, 
  isRecording, 
  isProcessing 
}: ProctorHintBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border-2 border-[rgba(76,166,38,1)] overflow-hidden">
        {/* Header */}
        <div 
          className="bg-[rgba(76,166,38,1)] text-white p-4 cursor-pointer flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span className="font-semibold">AI Proctor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-xs">Active</span>
          </div>
        </div>

        {/* Conversation Area */}
        {isExpanded && (
          <>
            <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-950">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm text-center">
                  <div>
                    <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>AI Proctor is ready to start the conversation.</p>
                    <p className="text-xs mt-1">Click the microphone to respond</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          msg.role === 'user'
                            ? 'bg-[rgba(76,166,38,1)] text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Recording Button */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onRecord}
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : isProcessing
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-[rgba(76,166,38,1)] text-white hover:bg-[rgba(66,146,28,1)]'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Recording... (Click to stop)
                  </>
                ) : isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Click to Record
                  </>
                )}
              </button>
              {!isRecording && !isProcessing && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Click to start recording, click again to stop
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
