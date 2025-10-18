// types/user.ts
// TypeScript type definitions for user-related data structures.
// Defines interfaces for user profiles, preferences, and authentication.

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  experience: 'entry' | 'mid' | 'senior' | 'executive';
  industry?: string;
  skills: string[];
  interviewGoals: string[];
}

export interface UserPreferences {
  userId: string;
  preferredVoice: string;
  speechRate: number;
  interviewDuration: number; // in minutes
  difficultyLevel: 'easy' | 'medium' | 'hard';
  focusAreas: string[];
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
}

export interface UserProgress {
  userId: string;
  totalInterviews: number;
  averageScore: number;
  improvementTrend: number[];
  lastInterviewDate?: Date;
  achievements: string[];
}