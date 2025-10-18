'use client';

import { useState } from 'react';
import { Play, RotateCcw, Send, Terminal } from 'lucide-react';
import Button from '@/components/Button';

export default function TechnicalInterviewPage() {
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // TODO: Implement your solution here
  
}`);

  const placeholderQuestion = "Write a function that takes an array of integers and a target value, then returns the indices of two numbers that add up to the target.";

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-8rem)] pl-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-full px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Technical Interview Session</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Problem 1 of 3</p>
            </div>
            
            {/* Top Toolbar */}
            <div className="flex gap-3">
              <Button variant="secondary" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Run Code
              </Button>
              <Button className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-16rem)]">
        <div className="grid lg:grid-cols-2 gap-0 h-full">
          
          {/* Left Panel - Problem Description & Code Editor */}
          <div className="flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            
            {/* Problem Description */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 overflow-y-auto max-h-64">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Problem: Two Sum</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {placeholderQuestion}
              </p>
              
              {/* Examples */}
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <div className="text-gray-600 dark:text-gray-400 mb-2">Example 1:</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    Input: nums = [2,7,11,15], target = 9<br/>
                    Output: [0,1]<br/>
                    Explanation: nums[0] + nums[1] = 2 + 7 = 9
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <div className="text-gray-600 dark:text-gray-400 mb-2">Example 2:</div>
                  <div className="text-gray-800 dark:text-gray-200">
                    Input: nums = [3,2,4], target = 6<br/>
                    Output: [1,2]
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Constraints:</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 2 ≤ nums.length ≤ 10⁴</li>
                  <li>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                  <li>• -10⁹ ≤ target ≤ 10⁹</li>
                  <li>• Only one valid answer exists</li>
                </ul>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="flex-1 flex flex-col">
              <div className="bg-gray-800 dark:bg-gray-950 px-4 py-2 flex items-center justify-between">
                <span className="text-gray-300 text-sm font-mono">solution.js</span>
                <select className="bg-gray-700 dark:bg-gray-900 text-gray-300 text-sm rounded px-2 py-1 border-none focus:ring-2 focus:ring-blue-500">
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>Java</option>
                  <option>C++</option>
                </select>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-gray-900 dark:bg-black text-gray-100 font-mono text-sm p-4 focus:outline-none resize-none"
                spellCheck={false}
                style={{ 
                  tabSize: 2,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                }}
              />
            </div>
          </div>

          {/* Right Panel - AI Feedback & Console */}
          <div className="flex flex-col bg-gray-50 dark:bg-gray-950">
            
            {/* AI Feedback Section */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">AI Feedback</h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                    <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      {/* TODO: Integrate AI feedback */}
                      AI feedback will appear here after you run or submit your code. 
                      You&apos;ll receive insights on:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Time and space complexity analysis</li>
                      <li>• Code quality and best practices</li>
                      <li>• Alternative approaches</li>
                      <li>• Common edge cases to consider</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Hints Section */}
              <div className="mt-6">
                <details className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <summary className="p-4 cursor-pointer font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl">
                    💡 Need a hint?
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 dark:text-gray-400">
                    <p className="text-sm">
                      Try using a hash map to store the numbers you&apos;ve seen and their indices. 
                      For each number, check if the complement (target - current number) exists in the map.
                    </p>
                  </div>
                </details>
              </div>
            </div>

            {/* Console Output Section */}
            <div className="border-t border-gray-300 dark:border-gray-700">
              <div className="bg-gray-800 dark:bg-gray-950 px-4 py-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm font-semibold">Console</span>
              </div>
              
              <div className="bg-gray-900 dark:bg-black p-4 h-48 overflow-y-auto font-mono text-sm">
                <div className="text-green-400">
                  {/* TODO: Actual console output */}
                  <p className="text-gray-500">{'//'} Output will appear here when you run your code</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Time Elapsed: <span className="font-semibold">12:45</span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Test Cases Passed: <span className="font-semibold text-green-600 dark:text-green-400">0 / 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
