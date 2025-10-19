// components/Navbar.tsx
// Global navigation bar component with branding and navigation links.
// Provides consistent navigation experience across all pages.

'use client';

import Link from 'next/link';
import { Brain, LogOut, LogIn } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Interview Coach</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">
              Home
            </Link>
            <Link href="/interview/select" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">
              Start Interview
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">
              Dashboard
            </Link>
            <ThemeToggle />
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
                title="Sign In"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}