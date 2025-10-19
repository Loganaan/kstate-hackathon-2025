'use client';

import { MessageSquare, Clock, Trash2 } from 'lucide-react';

interface SessionCardProps {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SessionCard({
  id,
  title,
  lastMessage,
  timestamp,
  messageCount,
  isActive,
  onSelect,
  onDelete,
}: SessionCardProps) {
  return (
    <div
      className={`p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isActive ? 'bg-[rgba(76,166,38,0.1)] dark:bg-[rgba(76,166,38,0.2)] border-l-4 border-l-[rgba(76,166,38,1)]' : ''
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
              {title}
            </h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {lastMessage}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timestamp.toLocaleDateString()}
            </span>
            <span>{messageCount} messages</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 ml-2 transition-all duration-200 cursor-pointer hover:scale-110"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
