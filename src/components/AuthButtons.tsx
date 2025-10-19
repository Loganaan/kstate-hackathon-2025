'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthButtons() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  if (user) {
    return (
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium transition-colors"
        title="Sign Out"
      >
        <LogOut className="w-5 h-5" />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
      title="Sign In"
    >
      <LogIn className="w-5 h-5" />
      <span>Sign In</span>
    </button>
  );
}
