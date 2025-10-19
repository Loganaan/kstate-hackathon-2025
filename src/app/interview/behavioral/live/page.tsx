'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react';
import Button from '@/components/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SessionParams {
  company?: string;
  role?: string;
  seniority?: string;
  jobDescription?: string;
}

export default function LiveInterviewSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [transcript, setTranscript] = useState('');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get session params from URL
  const sessionParams: SessionParams = {
    company: searchParams.get('company') || undefined,
    role: searchParams.get('role') || undefined,
    seniority: searchParams.get('seniority') || undefined,
    jobDescription: searchParams.get('jobDescription') || undefined,
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start the interview
  const startInterview = async () => {
    setInterviewStarted(true);
    setIsProcessing(true);

    try {
      // Get first question from AI
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are starting a behavioral interview. Generate ONE concise behavioral interview question about a past experience. Only output the question itself, nothing else. Make it specific and actionable.'
            }
          ],
          params: sessionParams,
        }),
      });

      const data = await response.json();
      const questionText = data.response || 'Tell me about a time when you faced a significant challenge. How did you handle it?';

      setCurrentQuestion(questionText);
      
      const firstMessage: Message = {
        id: '1',
        role: 'assistant',
        content: questionText,
        timestamp: new Date(),
      };
      
      setMessages([firstMessage]);

      // Speak the question using ElevenLabs
      await speakText(questionText);
      
      // Start listening after question is asked
      setTimeout(() => {
        startListening();
      }, 500);
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech using ElevenLabs
  const speakText = async (text: string) => {
    try {
      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      return new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        if (!isMuted) {
          audio.play();
        } else {
          resolve();
        }
      });
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  };

  // Start listening to user
  const startListening = () => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Stop listening and process response
  const stopListening = async () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);

      if (transcript.trim()) {
        await processUserResponse(transcript.trim());
      }
    }
  };

  // Process user's response and get next question
  const processUserResponse = async (userResponse: string) => {
    setIsProcessing(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          interviewType: 'behavioral',
          params: sessionParams,
        }),
      });

      const data = await response.json();
      const aiResponse = data.response || 'Thank you for sharing that.';

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentQuestion(aiResponse);

      // Speak the AI response
      await speakText(aiResponse);

      // Start listening again for next answer
      setTimeout(() => {
        setTranscript('');
        startListening();
      }, 500);
    } catch (error) {
      console.error('Error processing response:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // End interview
  const endInterview = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    router.push('/interview/behavioral');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 pl-20">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[rgba(76,166,38,1)] to-[rgba(76,166,38,0.8)] p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Live Practice Interview</h1>
              <p className="text-sm text-white/80 mt-1">
                Behavioral Interview Session
                {sessionParams.role && sessionParams.company && (
                  <span> - {sessionParams.role} at {sessionParams.company}</span>
                )}
              </p>
            </div>
            <button
              onClick={endInterview}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 cursor-pointer hover:scale-110"
            >
              <X className="w-6 h-6 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {!interviewStarted ? (
            <div className="text-center py-12">
              <div className="mb-8">
                <div className="w-24 h-24 bg-[rgba(76,166,38,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-12 h-12 text-[rgba(76,166,38,1)]" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Ready to Begin?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Click start when you&apos;re ready to begin your live interview practice
                </p>
              </div>
              <Button
                variant="primary"
                className="bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] px-8 py-3 text-lg"
                onClick={startInterview}
              >
                Start Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Question */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Current Question:
                </h3>
                <p className="text-lg text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                  {currentQuestion}
                </p>
              </div>

              {/* Live Transcript */}
              {isRecording && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Live Transcript:
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {transcript || 'Listening...'}
                  </p>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleMute}
                  className="p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors"
                  title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  )}
                </button>

                {!isRecording && !isProcessing ? (
                  <button
                    onClick={startListening}
                    className="p-6 bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] rounded-full transition-colors shadow-lg"
                    title="Start Recording Your Answer"
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </button>
                ) : isRecording ? (
                  <button
                    onClick={stopListening}
                    className="p-6 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-lg animate-pulse"
                    title="Stop Recording"
                  >
                    <MicOff className="w-8 h-8 text-white" />
                  </button>
                ) : (
                  <div className="p-6 bg-gray-300 dark:bg-gray-700 rounded-full">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {isRecording && 'Click the microphone to stop and submit your answer'}
                {!isRecording && !isProcessing && 'Click the microphone to start answering'}
                {isProcessing && 'Processing your response...'}
              </div>

              {/* Messages History */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                  Conversation History:
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-[rgba(76,166,38,0.1)] ml-8'
                          : 'bg-gray-100 dark:bg-gray-800 mr-8'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {message.role === 'user' ? 'You' : 'Interviewer'}
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* End Interview Button */}
              <div className="flex justify-center mt-6">
                <Button
                  variant="secondary"
                  onClick={endInterview}
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  End Interview
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
