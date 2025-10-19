import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

    if (!deepgramApiKey) {
      return NextResponse.json(
        { error: 'Deepgram API key not configured' },
        { status: 500 }
      );
    }

    // Return the API key to the client
    // Note: In production, you might want to create temporary keys instead
    // For now, we'll use the main API key directly from the client
    return NextResponse.json({ key: deepgramApiKey });
  } catch (error) {
    console.error('Error in Deepgram API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
