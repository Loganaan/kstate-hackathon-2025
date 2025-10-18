import Link from 'next/link';
import { ArrowRight, Brain, Sparkles } from 'lucide-react';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full">
              <Brain className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            AI Interview Coach
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
            Master your interview skills with AI-powered feedback
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Practice behavioral and technical interviews in a safe environment. 
            Get instant feedback and improve with every session.
          </p>

          {/* CTA Button */}
          <Link href="/interview/select">
            <Button className="inline-flex items-center gap-2 text-lg px-8 py-4">
              Start Interview
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 dark:bg-blue-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">AI-Powered Feedback</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get detailed analysis of your responses with actionable improvement suggestions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 dark:bg-green-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Realistic Practice</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simulate real interview scenarios with behavioral and technical questions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 dark:bg-purple-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ArrowRight className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your improvement over time with detailed performance analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
