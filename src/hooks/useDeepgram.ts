import { useEffect, useRef, useState, useCallback } from 'react';
import { createClient, LiveTranscriptionEvents, LiveClient } from '@deepgram/sdk';

interface UseDeepgramOptions {
  onTranscript?: (transcript: string) => void;
  onError?: (error: Error) => void;
  onFillerWord?: (word: string) => void;
}

// Common filler words to detect
const FILLER_WORDS = [
  'um', 'uh', 'umm', 'uhh', 'err', 'ah',
  'like', 'you know', 'actually', 'basically',
  'literally', 'kind of', 'sort of', 'i mean'
];

export function useDeepgram({ onTranscript, onError, onFillerWord }: UseDeepgramOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const deepgramRef = useRef<LiveClient | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Function to detect filler words in transcript
  const detectFillerWords = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    for (const filler of FILLER_WORDS) {
      // Check if the text contains the filler word as a separate word
      const regex = new RegExp(`\\b${filler}\\b`, 'i');
      if (regex.test(lowerText)) {
        onFillerWord?.(filler);
        break; // Only trigger once per transcript segment
      }
    }
  }, [onFillerWord]);

  const startRecording = useCallback(async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      streamRef.current = stream;

      // Get API key from our backend
      const response = await fetch('/api/deepgram');
      const { key, error } = await response.json();

      if (error || !key) {
        throw new Error(error || 'Failed to get Deepgram API key');
      }

      // Initialize Deepgram client
      const deepgram = createClient(key);
      
      // Create live transcription connection
      const connection = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        interim_results: true,
        utterance_end_ms: 1000,
        punctuate: true,
        filler_words: true, // Enable filler word detection
      });

      deepgramRef.current = connection;

      // Set up event listeners
      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('Deepgram connection opened');
        setIsConnected(true);
        setIsRecording(true);

        // Start sending audio
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && connection) {
            connection.send(event.data);
          }
        };

        mediaRecorder.start(250); // Send data every 250ms
        mediaRecorderRef.current = mediaRecorder;
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        
        if (transcript && data.is_final) {
          console.log('Final transcript:', transcript);
          
          // Detect filler words
          detectFillerWords(transcript);
          
          // Call the transcript callback
          onTranscript?.(transcript);
        }
      });

      connection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error('Deepgram error:', error);
        onError?.(new Error(error.message || 'Deepgram error'));
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('Deepgram connection closed');
        setIsConnected(false);
        setIsRecording(false);
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to start recording'));
      stopRecording();
    }
  }, [onTranscript, onError, onFillerWord, detectFillerWords]);

  const stopRecording = useCallback(() => {
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close Deepgram connection
    if (deepgramRef.current) {
      deepgramRef.current.finish();
      deepgramRef.current = null;
    }

    setIsRecording(false);
    setIsConnected(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    isConnected,
  };
}
