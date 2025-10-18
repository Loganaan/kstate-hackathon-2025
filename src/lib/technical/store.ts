/**
 * In-memory data store for questions
 * Uses Map for storage and array for indexing
 */

import type { Question, GetQuestionsQuery } from './schemas';
import { nanoid, now, normalizeTags } from './util';

// Storage
const questionsMap = new Map<string, Question>();
const questionsIndex: Question[] = [];

/**
 * Save a new question to the store
 */
export function saveQuestion(
  questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
): Question {
  const id = nanoid();
  const createdAt = now();
  
  const question: Question = {
    ...questionData,
    id,
    createdAt,
    topicTags: normalizeTags(questionData.topicTags)
  };
  
  questionsMap.set(id, question);
  questionsIndex.push(question);
  
  return question;
}

/**
 * Get a question by ID (excluding soft-deleted)
 */
export function getQuestion(id: string): Question | null {
  const question = questionsMap.get(id);
  
  if (!question || question.deletedAt) {
    return null;
  }
  
  return question;
}

/**
 * Get all questions with optional filters
 */
export function getQuestions(query: GetQuestionsQuery): Question[] {
  let results = questionsIndex.filter(q => !q.deletedAt);
  
  // Apply filters
  if (query.company) {
    const companyLower = query.company.toLowerCase();
    results = results.filter(q => q.company.toLowerCase().includes(companyLower));
  }
  
  if (query.role) {
    const roleLower = query.role.toLowerCase();
    results = results.filter(q => q.role.toLowerCase().includes(roleLower));
  }
  
  if (query.difficulty) {
    results = results.filter(q => q.difficulty === query.difficulty);
  }
  
  if (query.topic) {
    const topicLower = query.topic.toLowerCase();
    results = results.filter(q => q.topicTags.includes(topicLower));
  }
  
  // Sort by creation date (newest first)
  results.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  return results;
}

/**
 * Update a question
 */
export function updateQuestion(
  id: string,
  updates: Partial<Omit<Question, 'id' | 'createdAt' | 'deletedAt'>>
): Question | null {
  const question = questionsMap.get(id);
  
  if (!question || question.deletedAt) {
    return null;
  }
  
  const updatedQuestion: Question = {
    ...question,
    ...updates,
    updatedAt: now(),
    // Normalize tags if provided
    ...(updates.topicTags && { topicTags: normalizeTags(updates.topicTags) })
  };
  
  questionsMap.set(id, updatedQuestion);
  
  // Update in index
  const indexPosition = questionsIndex.findIndex(q => q.id === id);
  if (indexPosition !== -1) {
    questionsIndex[indexPosition] = updatedQuestion;
  }
  
  return updatedQuestion;
}

/**
 * Soft delete a question
 */
export function deleteQuestion(id: string): boolean {
  const question = questionsMap.get(id);
  
  if (!question || question.deletedAt) {
    return false;
  }
  
  const deletedQuestion: Question = {
    ...question,
    deletedAt: now()
  };
  
  questionsMap.set(id, deletedQuestion);
  
  // Update in index
  const indexPosition = questionsIndex.findIndex(q => q.id === id);
  if (indexPosition !== -1) {
    questionsIndex[indexPosition] = deletedQuestion;
  }
  
  return true;
}

/**
 * Get store statistics (useful for debugging)
 */
export function getStoreStats(): {
  total: number;
  active: number;
  deleted: number;
} {
  const total = questionsMap.size;
  const deleted = questionsIndex.filter(q => q.deletedAt).length;
  
  return {
    total,
    active: total - deleted,
    deleted
  };
}
