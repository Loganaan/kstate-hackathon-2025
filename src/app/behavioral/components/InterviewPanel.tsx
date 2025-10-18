// app/interview/components/InterviewPanel.tsx
// Main panel component that orchestrates the interview experience.
// Manages state between question display, user responses, and feedback.

import { useState, useRef, useEffect } from 'react';
import QuestionDisplay from './QuestionDisplay';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function InterviewPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate first question on mount
  useEffect(() => {
    const generateFirstQuestion = async () => {
      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'You are starting a behavioral interview. Generate ONE concise behavioral interview question about a past experience (teamwork, leadership, challenges, or problem-solving). Only output the question itself, nothing else. Make it specific and actionable.'
              }
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate first question');
        }

        const data = await response.json();
        
        const firstQuestion: Message = {
          id: '1',
          role: 'assistant',
          content: data.response || 'Tell me about a time when you faced a significant challenge. How did you handle it?',
          timestamp: new Date(),
        };

        setMessages([firstQuestion]);
      } catch (error) {
        console.error('Error generating first question:', error);
        // Fallback question if API fails
        const fallbackQuestion: Message = {
          id: '1',
          role: 'assistant',
          content: 'Tell me about a time when you faced a significant challenge at work. How did you approach it, and what was the outcome?',
          timestamp: new Date(),
        };
        setMessages([fallbackQuestion]);
      } finally {
        setIsLoading(false);
      }
    };

    generateFirstQuestion();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || interviewComplete) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          interviewType: 'behavioral',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Check if interview is complete
      if (data.interviewComplete) {
        setInterviewComplete(true);
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error. Could you please try again?',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Count main questions (exclude follow-ups)
  const countMainQuestions = () => {
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    
    let mainQuestions = 0;
    assistantMessages.forEach((msg, index) => {
      const content = msg.content.toLowerCase().trim();
      const length = msg.content.length;
      
      // Characteristics of follow-ups:
      // 1. Short messages (under 120 chars)
      // 2. Asking for clarification/more detail
      const followUpPatterns = [
        /^can you (tell me more|elaborate|explain|describe)/,
        /^what (was|were|did|about|specific)/,
        /^how (did|was|were)/,
        /^could you (provide|explain|describe|elaborate)/,
        /^tell me more/,
        /^which/,
      ];
      
      const isShortQuestion = length < 120 && content.includes('?');
      const matchesFollowUpPattern = followUpPatterns.some(pattern => {
        if (typeof pattern === 'boolean') return pattern;
        return pattern.test(content);
      });
      
      // It's a follow-up if it's short AND matches a follow-up pattern
      const isFollowUp = isShortQuestion && matchesFollowUpPattern;
      
      // Also check: if previous assistant message was within last 2 messages and was long,
      // this short one is likely a follow-up
      if (index > 0 && length < 120 && content.includes('?')) {
        const prevAssistantMsg = assistantMessages[index - 1];
        if (prevAssistantMsg && prevAssistantMsg.content.length > 200) {
          // Previous was a long main question, this short one is a follow-up
          return; // Don't count as main question
        }
      }
      
      // Count as main question if it's NOT a follow-up
      if (!isFollowUp) {
        mainQuestions++;
      }
    });
    
    return mainQuestions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-black">
                Behavioral Interview
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Practice with an AI interviewer
              </p>
            </div>
            {!interviewComplete && (
              <div className="text-right">
                <div className="text-sm font-medium text-black">
                  Question {Math.min(countMainQuestions(), 4)} of 4
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {'Answer to continue'}
                </div>
              </div>
            )}
            {interviewComplete && (
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  Interview Complete
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Review your feedback below
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-3xl mx-auto px-6 py-8 h-[calc(100vh-160px)] flex flex-col">
        {/* Question Display */}
  <QuestionDisplay currentMessage="" />
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg ${
                  message.role === 'user'
                    ? 'bg-black text-white px-4 py-3'
                    : 'bg-white border border-gray-200 text-black px-4 py-3'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span
                  className={`text-xs mt-2 block ${
                    message.role === 'user'
                      ? 'text-gray-300'
                      : 'text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          {interviewComplete ? (
            <div className="text-center py-2">
              <p className="text-sm text-gray-600">
                Interview completed! Review your feedback above.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center h-10">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response..."
                  className="w-full resize-none h-full px-3 py-2 bg-transparent border-none focus:outline-none text-black placeholder-gray-400 text-sm flex items-center"
                  rows={1}
                  disabled={isLoading || interviewComplete}
                  style={{ minHeight: '40px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || interviewComplete}
                className="h-10 px-5 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors align-middle flex items-center"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}