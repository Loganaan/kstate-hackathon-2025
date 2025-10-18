// types/interview.ts
// TypeScript type definitions for interview-related data structures.
// Defines interfaces for questions, responses, scoring, and interview sessions.

export interface Question {
  id: string;
  text: string;
  category: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedDuration: number; // in seconds
}

export interface UserResponse {
  questionId: string;
  audioUrl?: string;
  videoUrl?: string;
  transcript: string;
  duration: number;
  timestamp: Date;
}

export interface InterviewSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  questions: Question[];
  responses: UserResponse[];
  overallScore?: number;
  status: 'in-progress' | 'completed' | 'paused';
}

export interface FeedbackScore {
  clarity: number;
  confidence: number;
  relevance: number;
  structure: number;
  overall: number;
}

export interface DetailedFeedback {
  questionId: string;
  scores: FeedbackScore;
  suggestions: string[];
  strengths: string[];
  improvements: string[];
}