// components/LoadingSpinner.tsx
// Loading spinner component for async operations and loading states.
// Provides visual feedback during data fetching and processing.

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}