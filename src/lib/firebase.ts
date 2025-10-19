// lib/firebase.ts
// Firebase configuration and initialization for user data and file storage.
// Handles authentication, Firestore database, and Cloud Storage integration.

// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Types for chat sessions
export interface FirebaseMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp;
}

export interface FirebaseChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Timestamp;
  messageCount: number;
  messages: FirebaseMessage[];
  params?: {
    company?: string;
    role?: string;
    seniority?: string;
    jobDescription?: string;
  };
  userId: string; // Required - each session must belong to a user
  type: 'behavioral' | 'technical';
}

// Firebase utility functions
export const firebaseUtils = {
  // Save a new chat session
  async saveChatSession(sessionData: Omit<FirebaseChatSession, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'chatSessions'), sessionData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving chat session:', error);
      throw error;
    }
  },

  // Update an existing chat session
  async updateChatSession(sessionId: string, updates: Partial<FirebaseChatSession>): Promise<void> {
    try {
      const sessionRef = doc(db, 'chatSessions', sessionId);
      await updateDoc(sessionRef, updates);
    } catch (error) {
      console.error('Error updating chat session:', error);
      throw error;
    }
  },

  // Get a single chat session
  async getChatSession(sessionId: string): Promise<FirebaseChatSession | null> {
    try {
      const sessionRef = doc(db, 'chatSessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);
      
      if (sessionSnap.exists()) {
        return { id: sessionSnap.id, ...sessionSnap.data() } as FirebaseChatSession;
      }
      return null;
    } catch (error) {
      console.error('Error getting chat session:', error);
      throw error;
    }
  },

  // Get all chat sessions for a user
  async getChatSessions(userId: string, type?: 'behavioral' | 'technical'): Promise<FirebaseChatSession[]> {
    try {
      // Query sessions for the specific user
      // Filter by type client-side to avoid compound query requirements
      const q = query(
        collection(db, 'chatSessions'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      let sessions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseChatSession[];

      // Filter by type client-side if specified
      if (type) {
        sessions = sessions.filter(session => session.type === type);
      }

      return sessions;
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      throw error;
    }
  },

  // Add a message to an existing session
  async addMessageToSession(sessionId: string, message: FirebaseMessage, lastMessage: string): Promise<void> {
    try {
      const sessionRef = doc(db, 'chatSessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);
      
      if (sessionSnap.exists()) {
        const sessionData = sessionSnap.data() as FirebaseChatSession;
        const updatedMessages = [...sessionData.messages, message];
        
        await updateDoc(sessionRef, {
          messages: updatedMessages,
          lastMessage,
          messageCount: updatedMessages.length,
          timestamp: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error adding message to session:', error);
      throw error;
    }
  },

  // Delete a chat session
  async deleteChatSession(sessionId: string): Promise<void> {
    try {
      const sessionRef = doc(db, 'chatSessions', sessionId);
      await deleteDoc(sessionRef);
    } catch (error) {
      console.error('Error deleting chat session:', error);
      throw error;
    }
  }
};