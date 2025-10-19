# Filler Word Detection Feature

## Overview
The live interview now includes real-time filler word detection to help users improve their speaking skills during behavioral interviews. This feature uses Deepgram's built-in `filler_words` parameter for accurate detection.

## Features

### 🎯 Real-time Detection
- Uses Deepgram's native `filler_words: true` parameter for accurate detection
- Automatically detects common filler words during speech
- Instant feedback while speaking

### 📊 Visual Indicators

#### 1. Pop-up Notification
- **Location**: Top-center of the screen
- **Duration**: 3 seconds (auto-dismiss)
- **Design**: Yellow-orange gradient with alert icon
- **Content**: Shows which filler word was detected
- **Interaction**: Can be manually dismissed by clicking the X button

#### 2. Counter Badge
- **Location**: Top-right header area
- **Display**: Shows total count of filler words used
- **Visibility**: Only visible once interview starts
- **Purpose**: Track progress throughout the interview

## Detected Filler Words

The system detects the following filler words using Deepgram's built-in detection:

### Deepgram Native Detection
Deepgram's `filler_words: true` parameter detects:
- `uh`, `um`, `mhmm`
- `uh-uh`, `uh-huh`, `nuh-uh`

### Additional Pattern Matching
Our custom detection also catches:

#### Vocal Fillers
- `umm`, `uhh`, `err`, `ah`

#### Verbal Fillers
- `like`
- `you know`
- `actually`
- `basically`
- `literally`
- `kind of`
- `sort of`
- `i mean`

## How It Works

```
User speaks → Deepgram transcribes (with filler_words: true) → 
Filler words included in transcript → Hook detects patterns → 
Pop-up appears + Counter increments
```

### Technical Flow

1. **Speech Input**: User speaks during interview
2. **Transcription**: Deepgram processes audio with `filler_words: true` parameter enabled
3. **Inclusion**: Filler words like "uh", "um", "mhmm" are included in the transcript
4. **Detection**: `useDeepgram` hook analyzes each transcript segment for filler word patterns
5. **Callback**: `onFillerWord` callback is triggered with the detected word
6. **UI Update**: Pop-up appears and counter increments

### Deepgram Configuration

In `src/hooks/useDeepgram.ts`:

```typescript
const connection = deepgram.listen.live({
  model: 'nova-2',
  language: 'en-US',
  smart_format: true,
  interim_results: true,
  utterance_end_ms: 1000,
  punctuate: true,
  filler_words: true, // ✨ Enables native filler word detection
});
```

## Customization

### Adding More Filler Words

Edit `src/hooks/useDeepgram.ts`:

```typescript
const FILLER_WORDS = [
  'um', 'uh', // ... existing words
  'your-custom-filler', // Add new words here
];
```

### Adjusting Pop-up Duration

Edit `src/components/FillerWordPopup.tsx`:

```typescript
const timer = setTimeout(() => {
  setIsVisible(false);
  setTimeout(onClose, 300);
}, 3000); // Change this value (in milliseconds)
```

### Changing Pop-up Style

The popup component uses Tailwind CSS classes. Key styling:

```tsx
// Background gradient
className="bg-gradient-to-r from-yellow-500 to-orange-500"

// Position
className="fixed top-20 left-1/2 transform -translate-x-1/2"

// Animation
className="transition-all duration-300"
```

## Benefits

✅ **Immediate Feedback**: Users know right away when they use filler words
✅ **Progress Tracking**: Counter shows improvement over time
✅ **Non-intrusive**: Auto-dismissing popup doesn't interrupt the interview flow
✅ **Professional Development**: Helps users sound more confident and polished

## Best Practices

### For Interviewees
1. Don't be discouraged by the counter - awareness is the first step
2. Take a brief pause instead of using filler words
3. Practice multiple sessions to see improvement
4. Review the counter at the end to set goals for next time

### For Development
1. Test with various accents and speaking speeds
2. Fine-tune detection to avoid false positives
3. Consider adding a settings toggle to enable/disable the feature
4. Track filler word patterns for analytics

## Future Enhancements

Potential improvements:
- [ ] Detailed breakdown by filler word type
- [ ] Historical tracking across sessions
- [ ] Customizable severity levels (warning colors)
- [ ] Audio feedback option
- [ ] Pause interview mode when popup appears
- [ ] Filler word trends over time
- [ ] Comparison with industry averages

## Troubleshooting

### Pop-ups not appearing
- Check browser console for Deepgram errors
- Verify microphone permissions are granted
- Ensure DEEPGRAM_API_KEY is configured

### Too many false positives
- Adjust the detection regex in `useDeepgram.ts`
- Consider adding context-aware detection
- Fine-tune word boundary matching

### Counter not incrementing
- Check that `onFillerWord` callback is properly connected
- Verify state updates in React DevTools
- Look for console logs: "Filler word detected: [word]"

## Related Files

- `src/hooks/useDeepgram.ts` - Detection logic
- `src/components/FillerWordPopup.tsx` - Pop-up UI component
- `src/app/interview/behavioral/live/page.tsx` - Integration in interview page
