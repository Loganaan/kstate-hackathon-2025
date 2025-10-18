// components/Navbar.tsx
// Global navigation bar component with branding and navigation links.
// Provides consistent navigation experience across all pages.

import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">AI Interview Coach</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/interview/select" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Start Interview
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}