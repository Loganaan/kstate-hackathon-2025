'use client';

import { useState } from 'react';
import { Plus, Video } from 'lucide-react';
import Button from '@/components/Button';
import ChatMessage from './components/ChatMessage';
import SessionCard from './components/SessionCard';
import LivePracticeModal from './components/LivePracticeModal';
import ChatInput from './components/ChatInput';

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
                className="flex items-center gap-2 text-sm bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)]"
                onClick={createNewSession}
              >
                <Plus className="w-4 h-4" />
                New
              </Button>
            </div>
            
            {/* Live Practice Button */}
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2 border-[rgba(76,166,38,1)] text-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.1)]"
              onClick={() => setShowLiveModal(true)}
            >
              <Video className="w-5 h-5" />
              Start Live Practice
            </Button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                id={session.id}
                title={session.title}
                lastMessage={session.lastMessage}
                timestamp={session.timestamp}
                messageCount={session.messageCount}
                isActive={activeSessionId === session.id}
                onSelect={setActiveSessionId}
                onDelete={deleteSession}
              />
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
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
          </div>

          {/* Input Area */}
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
          />
        </div>
      </div>

      {/* Live Practice Modal */}
      <LivePracticeModal
        isOpen={showLiveModal}
        onClose={() => setShowLiveModal(false)}
        onStart={() => {
          // TODO: Navigate to live practice session
          setShowLiveModal(false);
          alert('Starting live practice session...');
        }}
      />
    </div>
  );
}
