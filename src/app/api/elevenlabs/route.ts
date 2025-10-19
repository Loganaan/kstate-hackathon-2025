// app/api/elevenlabs/route.ts
// API route for ElevenLabs text-to-speech integration.
// Converts AI interviewer questions to natural speech audio.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.XI_API_KEY;
    
    if (!apiKey) {
      console.error('XI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // ElevenLabs API endpoint for text-to-speech
    // Using voice ID for "Rachel" - professional female voice
    const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Rachel voice
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          speed: 1.2, // Speaking speed (0.25 to 4.0, default is 1.0)
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate speech' },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error in ElevenLabs API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}