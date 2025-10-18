// app/api/gemini/route.ts
// API route for handling Gemini AI chat requests
// Manages conversation flow and integrates with the GeminiClient

import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key status:', apiKey ? `Present (length: ${apiKey.length})` : 'Missing');
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error('GEMINI_API_KEY is not configured or still has placeholder value');
      return NextResponse.json(
        { error: 'API key not configured. Please add your GEMINI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Initialize Gemini client
    const geminiClient = new GeminiClient(apiKey);

    // Get AI response
    const response = await geminiClient.chat(messages);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
