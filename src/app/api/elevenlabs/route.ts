// app/api/elevenlabs/route.ts
// API route for ElevenLabs text-to-speech integration.
// Converts AI interviewer questions to natural speech audio.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  // ElevenLabs TTS API integration will be implemented here
  return NextResponse.json({ message: 'ElevenLabs API placeholder' });
}