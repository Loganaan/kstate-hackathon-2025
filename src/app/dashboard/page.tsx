'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Award, Target, AlertCircle } from 'lucide-react';
import Button from '@/components/Button';

export default function DashboardPage() {
  // Placeholder data
  const overallScore = 78;
  const completedInterviews = 12;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-8rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Summary</h1>
          <p className="text-gray-600">Review your performance and track your progress</p>
        </div>

        {/* Performance Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          
          {/* Overall Score Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Overall Score</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{overallScore}%</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-semibold">+5%</span>
              <span className="text-gray-500">from last session</span>
            </div>
          </div>

          {/* Completed Interviews */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed Interviews</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{completedInterviews}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">8 behavioral, 4 technical</span>
            </div>
          </div>

          {/* Target Progress */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Weekly Goal</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">3/5</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Strengths Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Strengths</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Communication Skills</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You articulate your thoughts clearly and maintain good eye contact throughout responses.
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Score</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Problem-Solving Approach</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Strong analytical thinking with well-structured responses using the STAR method.
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Score</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Code Quality</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Clean, readable code with good variable naming and proper commenting.
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Score</span>
                    <span>88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Areas to Improve Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Areas to Improve</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Time Management</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Try to be more concise in your responses. Aim for 2-3 minutes per behavioral question.
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Score</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Algorithm Optimization</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Focus on optimizing time complexity. Consider hash maps and other data structures.
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Score</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Confidence & Pacing</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Reduce filler words and maintain a steady pace. Practice pausing instead of using &quot;um&quot; or &quot;uh&quot;.
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Score</span>
                    <span>70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Trends</h2>
          <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {/* TODO: Integrate performance chart visualization */}
              Performance chart will be displayed here showing your progress over time
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/interview/select">
            <Button className="flex items-center gap-2 px-8">
              Start New Interview
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="secondary" className="px-8">
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}