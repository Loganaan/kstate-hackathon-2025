'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function SideButtons() {
  const pathname = usePathname();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use light mode colors during SSR to prevent hydration mismatch
  const getThemeColors = () => {
    if (!mounted) {
      return {
        background: 'linear-gradient(to bottom right, rgb(243, 244, 246), rgb(249, 250, 251))',
        border: 'rgb(229, 231, 235)',
        icon: 'rgb(55, 65, 81)'
      };
    }
    const isDark = resolvedTheme === 'dark';
    return isDark ? {
      background: 'linear-gradient(to bottom right, rgb(31, 41, 55), rgb(17, 24, 39))',
      border: 'rgb(55, 65, 81)',
      icon: 'rgb(209, 213, 219)'
    } : {
      background: 'linear-gradient(to bottom right, rgb(243, 244, 246), rgb(249, 250, 251))',
      border: 'rgb(229, 231, 235)',
      icon: 'rgb(55, 65, 81)'
    };
  };

  const colors = getThemeColors();
  
  // Safe theme check that works after hydration
  const isDarkMode = () => mounted && resolvedTheme === 'dark';
  
  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-24 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 shadow-xl z-40 flex flex-col items-center pt-28 pb-8 gap-6">

      {/* Navigation Buttons */}
      <nav className="flex flex-col items-center gap-4 flex-1">
        {/* Behavioral Interview Button */}
        <Link
          href="/interview/behavioral"
          onMouseEnter={() => setHoveredButton('behavioral')}
          onMouseLeave={() => setHoveredButton(null)}
          className="group relative w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer"
          style={{
            background: isActive('/interview/behavioral')
              ? 'linear-gradient(to bottom right, rgba(76,166,38,0.25), rgba(76,166,38,0.15))'
              : hoveredButton === 'behavioral'
              ? 'linear-gradient(to bottom right, rgba(76,166,38,0.15), rgba(76,166,38,0.05))'
              : isDarkMode()
              ? 'linear-gradient(to bottom right, rgb(31, 41, 55), rgb(17, 24, 39))'
              : 'linear-gradient(to bottom right, rgb(243, 244, 246), rgb(249, 250, 251))',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isActive('/interview/behavioral')
              ? 'rgba(76,166,38,0.5)'
              : hoveredButton === 'behavioral'
              ? 'rgba(76,166,38,0.4)'
              : isDarkMode()
              ? 'rgb(55, 65, 81)'
              : 'rgb(229, 231, 235)',
            transform: hoveredButton === 'behavioral' ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
            transition: 'all 300ms ease-out',
            boxShadow: isActive('/interview/behavioral')
              ? '0 0 20px rgba(76,166,38,0.3)'
              : hoveredButton === 'behavioral'
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          title="Behavioral Interview Practice"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-7 h-7"
            style={{
              color: isActive('/interview/behavioral') || hoveredButton === 'behavioral'
                ? 'rgba(76,166,38,1)'
                : isDarkMode()
                ? 'rgb(209, 213, 219)'
                : 'rgb(55, 65, 81)',
              transform: hoveredButton === 'behavioral' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 300ms ease-out'
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
          {/* Tooltip */}
          <span 
            className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
            style={{
              opacity: hoveredButton === 'behavioral' ? 1 : 0,
              transform: hoveredButton === 'behavioral' ? 'translateX(4px)' : 'translateX(0)',
              transition: 'all 300ms ease-out'
            }}
          >
            Behavioral
          </span>
        </Link>

        {/* Technical Interview Button */}
        <Link
          href="/interview/technical"
          onMouseEnter={() => setHoveredButton('technical')}
          onMouseLeave={() => setHoveredButton(null)}
          className="group relative w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer"
          style={{
            background: isActive('/interview/technical')
              ? 'linear-gradient(to bottom right, rgba(76,166,38,0.25), rgba(76,166,38,0.15))'
              : hoveredButton === 'technical'
              ? 'linear-gradient(to bottom right, rgba(76,166,38,0.15), rgba(76,166,38,0.05))'
              : isDarkMode()
              ? 'linear-gradient(to bottom right, rgb(31, 41, 55), rgb(17, 24, 39))'
              : 'linear-gradient(to bottom right, rgb(243, 244, 246), rgb(249, 250, 251))',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isActive('/interview/technical')
              ? 'rgba(76,166,38,0.5)'
              : hoveredButton === 'technical'
              ? 'rgba(76,166,38,0.4)'
              : isDarkMode()
              ? 'rgb(55, 65, 81)'
              : 'rgb(229, 231, 235)',
            transform: hoveredButton === 'technical' ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
            transition: 'all 300ms ease-out',
            boxShadow: isActive('/interview/technical')
              ? '0 0 20px rgba(76,166,38,0.3)'
              : hoveredButton === 'technical'
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          title="Technical Interview Practice"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-7 h-7"
            style={{
              color: isActive('/interview/technical') || hoveredButton === 'technical'
                ? 'rgba(76,166,38,1)'
                : isDarkMode()
                ? 'rgb(209, 213, 219)'
                : 'rgb(55, 65, 81)',
              transform: hoveredButton === 'technical' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 300ms ease-out'
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
            />
          </svg>
          {/* Tooltip */}
          <span 
            className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
            style={{
              opacity: hoveredButton === 'technical' ? 1 : 0,
              transform: hoveredButton === 'technical' ? 'translateX(4px)' : 'translateX(0)',
              transition: 'all 300ms ease-out'
            }}
          >
            Technical
          </span>
        </Link>

        {/* Dashboard Button */}
        <Link
          href="/dashboard"
          onMouseEnter={() => setHoveredButton('dashboard')}
          onMouseLeave={() => setHoveredButton(null)}
          className="group relative w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer"
          style={{
            background: isActive('/dashboard')
              ? 'linear-gradient(to bottom right, rgba(76,166,38,0.2), rgba(76,166,38,0.05))'
              : hoveredButton === 'dashboard'
              ? 'linear-gradient(to bottom right, rgba(76,166,38,0.15), rgba(76,166,38,0.05))'
              : colors.background,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isActive('/dashboard')
              ? 'rgba(76,166,38,0.6)'
              : hoveredButton === 'dashboard'
              ? 'rgba(76,166,38,0.4)'
              : colors.border,
            transform: hoveredButton === 'dashboard' ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
            transition: 'all 300ms ease-out',
            boxShadow: isActive('/dashboard')
              ? '0 0 20px rgba(76,166,38,0.3)'
              : hoveredButton === 'dashboard'
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          title="Dashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-7 h-7"
            style={{
              color: isActive('/dashboard') || hoveredButton === 'dashboard'
                ? 'rgba(76,166,38,1)'
                : colors.icon,
              transform: hoveredButton === 'dashboard' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 300ms ease-out'
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
            />
          </svg>
          {/* Tooltip */}
          <span 
            className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
            style={{
              opacity: hoveredButton === 'dashboard' ? 1 : 0,
              transform: hoveredButton === 'dashboard' ? 'translateX(4px)' : 'translateX(0)',
              transition: 'all 300ms ease-out'
            }}
          >
            Dashboard
          </span>
        </Link>

        {/* Flashcards Button */}
        <button
          onMouseEnter={() => setHoveredButton('flashcards')}
          onMouseLeave={() => setHoveredButton(null)}
          className="group relative w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer"
          style={{
            background: hoveredButton === 'flashcards'
              ? 'linear-gradient(to bottom right, rgba(76,166,38,0.15), rgba(76,166,38,0.05))'
              : colors.background,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: hoveredButton === 'flashcards' 
              ? 'rgba(76,166,38,0.4)' 
              : colors.border,
            transform: hoveredButton === 'flashcards' ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
            transition: 'all 300ms ease-out',
            boxShadow: hoveredButton === 'flashcards'
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          title="Flashcards"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-7 h-7"
            style={{
              color: hoveredButton === 'flashcards' 
                ? 'rgba(76,166,38,1)' 
                : colors.icon,
              transform: hoveredButton === 'flashcards' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 300ms ease-out'
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
            />
          </svg>
          {/* Tooltip */}
          <span 
            className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
            style={{
              opacity: hoveredButton === 'flashcards' ? 1 : 0,
              transform: hoveredButton === 'flashcards' ? 'translateX(4px)' : 'translateX(0)',
              transition: 'all 300ms ease-out'
            }}
          >
            Flashcards
          </span>
        </button>

        {/* About Button */}
        <Link
          href="/about"
          onMouseEnter={() => setHoveredButton('about')}
          onMouseLeave={() => setHoveredButton(null)}
          className="group relative w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer"
          style={{
            background: isActive('/about')
              ? 'linear-gradient(to bottom right, rgba(76,166,38,0.2), rgba(76,166,38,0.05))'
              : hoveredButton === 'about'
              ? 'linear-gradient(to bottom right, rgba(76,166,38,0.15), rgba(76,166,38,0.05))'
              : colors.background,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isActive('/about')
              ? 'rgba(76,166,38,0.6)'
              : hoveredButton === 'about' 
              ? 'rgba(76,166,38,0.4)' 
              : colors.border,
            transform: hoveredButton === 'about' ? 'scale(1.1) rotate(-3deg)' : 'scale(1)',
            transition: 'all 300ms ease-out',
            boxShadow: isActive('/about')
              ? '0 0 20px rgba(76,166,38,0.3)'
              : hoveredButton === 'about'
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          title="About"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-7 h-7"
            style={{
              color: isActive('/about') || hoveredButton === 'about' 
                ? 'rgba(76,166,38,1)' 
                : colors.icon,
              transform: hoveredButton === 'about' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 300ms ease-out'
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          {/* Tooltip */}
          <span 
            className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
            style={{
              opacity: hoveredButton === 'about' ? 1 : 0,
              transform: hoveredButton === 'about' ? 'translateX(4px)' : 'translateX(0)',
              transition: 'all 300ms ease-out'
            }}
          >
            About
          </span>
        </Link>
      </nav>

      {/* Theme Toggle at Bottom */}
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}
