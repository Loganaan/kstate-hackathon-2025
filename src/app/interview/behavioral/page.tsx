'use client';

import { useState } from 'react';
import { Send, Mic, Plus, MessageSquare, Video, Clock, Trash2 } from 'lucide-react';
import Button from '@/components/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export default function BehavioralInterviewPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Leadership Questions',
      lastMessage: 'Tell me about a time you led a team...',
      timestamp: new Date(),
      messageCount: 12
    },
    {
      id: '2',
      title: 'Conflict Resolution',
      lastMessage: 'How do you handle disagreements?',
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 8
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI interview coach. I\'m here to help you practice behavioral interview questions. What type of questions would you like to work on today?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [showLiveModal, setShowLiveModal] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newUserMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'That\'s a great question! Let me help you prepare for that. Here\'s what I recommend...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Session',
      lastMessage: 'Start a conversation...',
      timestamp: new Date(),
      messageCount: 0
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hi! I\'m your AI interview coach. I\'m here to help you practice behavioral interview questions. What type of questions would you like to work on today?',
        timestamp: new Date()
      }
    ]);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId && sessions.length > 1) {
      setActiveSessionId(sessions[0].id);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-8rem)] pl-20">
      <div className="flex h-[calc(100vh-8rem)]">
        
        {/* Left Sidebar - Sessions List */}
        <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Chat Sessions</h2>
              <Button
                variant="primary"
                className="flex items-center gap-2 text-sm"
                onClick={createNewSession}
              >
                <Plus className="w-4 h-4" />
                New
              </Button>
            </div>
            
            {/* Live Practice Button */}
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowLiveModal(true)}
            >
              <Video className="w-5 h-5" />
              Start Live Practice
            </Button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  activeSessionId === session.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => setActiveSessionId(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
                        {session.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {session.lastMessage}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.timestamp.toLocaleDateString()}
                      </span>
                      <span>{session.messageCount} messages</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Behavioral Interview Coach
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Practice with AI-powered interview questions and feedback
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-2 block ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Press Enter to send • Click &quot;Start Live Practice&quot; for voice interview
            </p>
          </div>
        </div>
      </div>

      {/* Live Practice Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pl-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Live Practice Interview</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Get ready for a real-time voice interview session
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">What to expect:</h3>
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
              <Button
                variant="secondary"
                onClick={() => setShowLiveModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex items-center gap-2"
                onClick={() => {
                  // TODO: Navigate to live practice session
                  setShowLiveModal(false);
                  alert('Starting live practice session...');
                }}
              >
                <Video className="w-4 h-4" />
                Start Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
