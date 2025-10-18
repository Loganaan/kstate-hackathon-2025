'use client';

import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export default function ChatInput({ value, onChange, onSend, placeholder = "Type your message..." }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[rgba(76,166,38,1)] border-none"
        />
        <button
          onClick={onSend}
          className="bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] text-white rounded-full p-3 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Press Enter to send • Click &quot;Start Live Practice&quot; for voice interview
      </p>
    </div>
  );
}
