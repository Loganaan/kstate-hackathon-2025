// components/ThemeToggle.tsx
// Theme toggle button for switching between light and dark modes
// Defaults to system preference on initial load, then allows manual toggle

'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same size to avoid layout shift
    return (
      <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 w-10 h-10" aria-label="Loading theme">
        <div className="w-5 h-5" />
      </button>
    );
  }

  const cycleTheme = () => {
    // Toggle between light and dark only (system is default but not in toggle)
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const getIcon = () => {
    // Show icon based on current theme (system resolves to light or dark)
    if (theme === 'dark') {
      return <Moon className="w-5 h-5 text-blue-400" />;
    } else {
      return <Sun className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Current theme: ${theme}. Click to toggle between light and dark mode.`}
      title={`${theme === 'dark' ? 'Dark' : 'Light'} mode - Click to toggle`}
    >
      {getIcon()}
    </button>
  );
}
