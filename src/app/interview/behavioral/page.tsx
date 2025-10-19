'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Video } from 'lucide-react';
import Button from '@/components/Button';
import ChatMessage from './components/ChatMessage';
import SessionCard from './components/SessionCard';
import LivePracticeModal from './components/LivePracticeModal';
import NewSessionModal, { SessionParams } from './components/NewSessionModal';
import ChatInput from './components/ChatInput';
import { firebaseUtils } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  firebaseId?: string; // Firebase document ID
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages: Message[];
  params?: SessionParams;
}

export default function BehavioralInterviewPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from Firebase on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const firebaseSessions = await firebaseUtils.getChatSessions(undefined, 'behavioral');
        const convertedSessions: ChatSession[] = firebaseSessions.map(session => ({
          id: session.id,
          firebaseId: session.id,
          title: session.title,
          lastMessage: session.lastMessage,
          timestamp: session.timestamp.toDate(),
          messageCount: session.messageCount,
          messages: session.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toDate()
          })),
          params: session.params ? {
            company: session.params.company || '',
            role: session.params.role || '',
            seniority: session.params.seniority || '',
            jobDescription: session.params.jobDescription || ''
          } : undefined
        }));
        setSessions(convertedSessions);
      } catch (error) {
        console.error('Error loading sessions from Firebase:', error);
      }
    };

    loadSessions();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId]);

  // Get current session messages
  const currentSession = sessions.find(s => s.id === activeSessionId);
  const messages = currentSession?.messages || [];

  // Count main questions (excluding follow-ups)
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

  // Generate first question for a new session
  const generateFirstQuestion = async (params?: SessionParams): Promise<Message> => {
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
          params,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate first question');
      }

      const data = await response.json();
      
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response || 'Tell me about a time when you faced a significant challenge. How did you handle it?',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error generating first question:', error);
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Tell me about a time when you faced a significant challenge at work. How did you approach it, and what was the outcome?',
        timestamp: new Date(),
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentSession) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    // Update session with user message
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === activeSessionId
          ? {
              ...session,
              messages: [...session.messages, newUserMessage],
              lastMessage: newUserMessage.content,
              messageCount: session.messageCount + 1,
              timestamp: new Date()
            }
          : session
      )
    );

    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          interviewType: 'behavioral',
          params: currentSession.params,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error. Could you please try again?',
        timestamp: new Date(),
      };

      // Save both user and assistant messages to Firebase
      if (currentSession?.firebaseId) {
        try {
          // Add user message
          await firebaseUtils.addMessageToSession(
            currentSession.firebaseId,
            {
              id: newUserMessage.id,
              role: newUserMessage.role,
              content: newUserMessage.content,
              timestamp: Timestamp.fromDate(newUserMessage.timestamp)
            },
            newUserMessage.content
          );

          // Add assistant message
          await firebaseUtils.addMessageToSession(
            currentSession.firebaseId,
            {
              id: assistantMessage.id,
              role: assistantMessage.role,
              content: assistantMessage.content,
              timestamp: Timestamp.fromDate(assistantMessage.timestamp)
            },
            assistantMessage.content
          );
        } catch (error) {
          console.error('Error saving messages to Firebase:', error);
        }
      }

      // Update session with assistant message
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === activeSessionId
            ? {
                ...session,
                messages: [...session.messages, assistantMessage],
                lastMessage: assistantMessage.content,
                messageCount: session.messageCount + 1,
                timestamp: new Date()
              }
            : session
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date(),
      };

      // Update session with error message
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === activeSessionId
            ? {
                ...session,
                messages: [...session.messages, errorMessage],
                lastMessage: errorMessage.content,
                messageCount: session.messageCount + 1
              }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async (params?: SessionParams) => {
    setIsLoading(true);
    
    try {
      // Generate first question with parameters
      const firstQuestion = await generateFirstQuestion(params);
      
      // Create a title based on the parameters
      let title = `Session ${sessions.length + 1}`;
      if (params?.role && params?.company) {
        title = `${params.role} at ${params.company}`;
      } else if (params?.role) {
        title = params.role;
      } else if (params?.company) {
        title = params.company;
      }
      
      const timestamp = new Date();
      const localId = Date.now().toString();
      
      // Save to Firebase
      const firebaseId = await firebaseUtils.saveChatSession({
        title,
        lastMessage: firstQuestion.content,
        timestamp: Timestamp.fromDate(timestamp),
        messageCount: 1,
        messages: [{
          id: firstQuestion.id,
          role: firstQuestion.role,
          content: firstQuestion.content,
          timestamp: Timestamp.fromDate(firstQuestion.timestamp)
        }],
        params,
        type: 'behavioral'
      });
      
      const newSession: ChatSession = {
        id: localId,
        firebaseId,
        title,
        lastMessage: firstQuestion.content,
        timestamp,
        messageCount: 1,
        messages: [firstQuestion],
        params
      };
      
      setSessions(prevSessions => [newSession, ...prevSessions]);
      setActiveSessionId(newSession.id);
    } catch (error) {
      console.error('Error creating new session:', error);
    } finally {
      setIsLoading(false);
    }
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
                onClick={() => setShowNewSessionModal(true)}
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Behavioral Interview Coach
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Practice with AI-powered interview questions and feedback
                </p>
              </div>
              {currentSession && messages.length > 0 && (
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Question {Math.min(countMainQuestions(), 4)} of 4
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Answer to continue
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
            {!currentSession ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="max-w-md">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Welcome to Behavioral Interview Practice
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start a new session to practice behavioral interview questions with AI-powered feedback. 
                    Create your first session by clicking the &quot;New&quot; button in the sidebar.
                  </p>
                  <Button
                    variant="primary"
                    className="bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] flex items-center gap-2 mx-auto"
                    onClick={() => setShowNewSessionModal(true)}
                  >
                    <Plus className="w-5 h-5" />
                    Create New Session
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            disabled={isLoading || !currentSession}
          />
        </div>
      </div>

      {/* Live Practice Modal */}
      <LivePracticeModal
        isOpen={showLiveModal}
        onClose={() => setShowLiveModal(false)}
        onStart={() => {
          setShowLiveModal(false);
          // Navigate to live practice session with current session params
          const params = new URLSearchParams();
          if (currentSession?.params) {
            if (currentSession.params.company) params.append('company', currentSession.params.company);
            if (currentSession.params.role) params.append('role', currentSession.params.role);
            if (currentSession.params.seniority) params.append('seniority', currentSession.params.seniority);
            if (currentSession.params.jobDescription) params.append('jobDescription', currentSession.params.jobDescription);
          }
          router.push(`/interview/behavioral/live?${params.toString()}`);
        }}
      />

      {/* New Session Modal */}
      <NewSessionModal
        isOpen={showNewSessionModal}
        onClose={() => setShowNewSessionModal(false)}
        onStart={(params) => {
          setShowNewSessionModal(false);
          createNewSession(params);
        }}
      />
    </div>
  );
}
