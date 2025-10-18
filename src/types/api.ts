// types/api.ts
// TypeScript type definitions for API requests, responses, and error handling.
// Defines interfaces for all API interactions and data transfer objects.

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GeminiRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GeminiResponse {
  text: string;
  confidence: number;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ElevenLabsRequest {
  text: string;
  voiceId: string;
  settings?: {
    stability: number;
    similarityBoost: number;
  };
}

export interface ElevenLabsResponse {
  audioUrl: string;
  audioBuffer?: ArrayBuffer;
}

export interface FeedbackRequest {
  questionId: string;
  userResponse: string;
  audioUrl?: string;
  videoUrl?: string;
}

export interface FeedbackResponse {
  scores: {
    clarity: number;
    confidence: number;
    relevance: number;
    structure: number;
    overall: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
}

export interface UploadRequest {
  file: File;
  type: 'audio' | 'video';
  sessionId: string;
}

export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
}