# Deepgram Integration Guide

This project now uses Deepgram for real-time speech-to-text instead of webkitSpeechRecognition.

## Setup Instructions

### 1. Get a Deepgram API Key

1. Go to [https://deepgram.com](https://deepgram.com)
2. Sign up for a free account
3. Navigate to your dashboard
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist):

```bash
cp .env.example .env.local
```

Add your Deepgram API key to `.env.local`:

```bash
DEEPGRAM_API_KEY=your-actual-deepgram-api-key-here
```

### 3. Install Dependencies

The Deepgram SDK has already been installed. If you need to reinstall:

```bash
npm install @deepgram/sdk
```

### 4. How It Works

The implementation consists of three main parts:

#### a) API Route (`src/app/api/deepgram/route.ts`)
- Provides the Deepgram API key to the client
- In production, you might want to implement temporary key generation

#### b) Custom Hook (`src/hooks/useDeepgram.ts`)
- Manages the Deepgram live transcription connection
- Handles microphone access and audio streaming
- Provides `startRecording()`, `stopRecording()`, and `isRecording` state
- Callbacks for `onTranscript` and `onError`

#### c) Usage in Components (`src/app/interview/behavioral/live/page.tsx`)
- Replaced webkitSpeechRecognition with the useDeepgram hook
- Real-time transcription of user speech
- Better accuracy and cross-browser support

## Benefits of Deepgram over webkitSpeechRecognition

1. **Cross-browser compatibility** - Works in all modern browsers, not just Chrome
2. **Better accuracy** - More accurate transcriptions using AI models
3. **More features** - Punctuation, formatting, speaker diarization
4. **Customizable** - Multiple language models and settings
5. **Real-time** - Low latency streaming transcription
6. **Production-ready** - Built for scale with proper error handling

## Usage Example

```typescript
import { useDeepgram } from '@/hooks/useDeepgram';

function MyComponent() {
  const { startRecording, stopRecording, isRecording } = useDeepgram({
    onTranscript: (text) => {
      console.log('Transcribed:', text);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
    </div>
  );
}
```

## Deepgram Model Options

The hook uses the `nova-2` model by default, but you can modify it in `useDeepgram.ts`:

- `nova-2` - Latest and most accurate model
- `nova` - Previous generation, still very accurate
- `enhanced` - Good for general purpose
- `base` - Faster but less accurate

## Deepgram Features Enabled

The following Deepgram parameters are enabled in our configuration:

- `model: 'nova-2'` - Uses the latest model
- `language: 'en-US'` - English (US) language
- `smart_format: true` - Automatic formatting
- `interim_results: true` - Real-time partial results
- `utterance_end_ms: 1000` - Detects end of utterances
- `punctuate: true` - Adds punctuation
- `filler_words: true` - **Includes filler words (uh, um, mhmm, uh-uh, uh-huh, nuh-uh) in transcripts**

The `filler_words` parameter is particularly useful for interview practice as it allows the application to detect and provide feedback on filler word usage.

## Troubleshooting

### "Deepgram API key not configured"
- Make sure `.env.local` exists and contains `DEEPGRAM_API_KEY`
- Restart your dev server after adding environment variables

### "Failed to start recording"
- Check browser console for microphone permission errors
- Ensure you're using HTTPS (required for microphone access)
- In development, localhost is allowed without HTTPS

### No transcription appearing
- Check browser console for Deepgram connection errors
- Verify your API key is valid
- Ensure your microphone is working and permissions are granted

## API Key Security

**Important:** The current implementation sends the API key to the client. For production:

1. Consider implementing temporary key generation using Deepgram's Projects API
2. Add rate limiting to the API route
3. Implement user authentication
4. Monitor API usage through Deepgram's dashboard

## Resources

- [Deepgram Documentation](https://developers.deepgram.com/)
- [Deepgram SDK for JavaScript](https://github.com/deepgram/deepgram-js-sdk)
- [Deepgram Console](https://console.deepgram.com/)
