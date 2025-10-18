import Link from 'next/link';
import { ArrowRight, Brain, Sparkles } from 'lucide-react';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Brain className="w-16 h-16 text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            AI Interview Coach
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Master your interview skills with AI-powered feedback
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
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
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Feedback</h3>
            <p className="text-gray-600">
              Get detailed analysis of your responses with actionable improvement suggestions.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Realistic Practice</h3>
            <p className="text-gray-600">
              Simulate real interview scenarios with behavioral and technical questions.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ArrowRight className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your improvement over time with detailed performance analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
