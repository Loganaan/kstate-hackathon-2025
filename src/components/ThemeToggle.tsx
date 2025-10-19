// components/ThemeToggle.tsx
// Theme toggle button for switching between light and dark modes
// Defaults to system preference on initial load, then allows manual toggle

'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same size to avoid layout shift
    return (
      <button 
        className="w-16 h-16 rounded-2xl flex items-center justify-center" 
        style={{
          background: 'linear-gradient(to bottom right, rgba(76,166,38,1), rgba(76,166,38,0.8))',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
        aria-label="Loading theme"
      >
        <div className="w-7 h-7" />
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
      return <Moon className="w-7 h-7" style={{ color: 'white' }} />;
    } else {
      return <Sun className="w-7 h-7" style={{ color: 'white' }} />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer group"
      style={{
        background: isHovered
          ? 'linear-gradient(to bottom right, rgba(76,166,38,1), rgba(76,166,38,0.7))'
          : 'linear-gradient(to bottom right, rgba(76,166,38,0.95), rgba(76,166,38,0.75))',
        transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
        transition: 'all 300ms ease-out',
        boxShadow: isHovered
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 20px rgba(76,166,38,0.3)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      aria-label={`Current theme: ${theme}. Click to toggle between light and dark mode.`}
      title={`${theme === 'dark' ? 'Dark' : 'Light'} mode - Click to toggle`}
    >
      <div
        style={{
          transform: isHovered ? 'scale(1.1) rotate(15deg)' : 'scale(1) rotate(0deg)',
          transition: 'all 300ms ease-out'
        }}
      >
        {getIcon()}
      </div>
      
      {/* Tooltip */}
      <span 
        className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'all 300ms ease-out'
        }}
      >
        {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
      </span>
    </button>
  );
}
