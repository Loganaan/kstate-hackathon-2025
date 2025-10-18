// app/interview/components/QuestionDisplay.tsx
// Component responsible for displaying interview questions from the AI.
// Handles text-to-speech integration and question progression.

interface QuestionDisplayProps {
  currentMessage: string;
}

export default function QuestionDisplay({ currentMessage }: QuestionDisplayProps) {
  return (
    <div className="mb-6">
      <div className="text-lg font-medium text-black">
        {currentMessage}
      </div>
    </div>
  );
}