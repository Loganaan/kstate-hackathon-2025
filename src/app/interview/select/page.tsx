'use client';

import Link from 'next/link';
import { Brain, Code } from 'lucide-react';
import { useState } from 'react';

export default function InterviewSelectPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const interviewTypes = [
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      description: 'Practice answering behavioral questions based on your past experiences. Perfect for showcasing soft skills and problem-solving abilities.',
      icon: Brain,
      color: 'blue',
      href: '/interview/behavioral'
    },
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'Test your coding skills with real-world programming challenges. Get instant feedback on your solutions and approach.',
      icon: Code,
      color: 'green',
      href: '/interview/technical'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-[calc(100vh-8rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Interview Type
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the type of interview you&apos;d like to practice. Each session is tailored to help you improve specific skills.
          </p>
        </div>

        {/* Interview Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {interviewTypes.map((type) => {
            const Icon = type.icon;
            const isHovered = hoveredCard === type.id;
            
            return (
              <Link
                key={type.id}
                href={type.href}
                onMouseEnter={() => setHoveredCard(type.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="block"
              >
                <div
                  className={`
                    bg-white rounded-2xl shadow-md p-8 h-full
                    transition-all duration-300 cursor-pointer
                    ${isHovered ? 'shadow-2xl scale-105' : 'hover:shadow-lg'}
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    ${type.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'}
                    w-16 h-16 rounded-xl flex items-center justify-center mb-6
                    transition-transform duration-300
                    ${isHovered ? 'scale-110' : ''}
                  `}>
                    <Icon className={`
                      w-8 h-8
                      ${type.color === 'blue' ? 'text-blue-600' : 'text-green-600'}
                    `} />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {type.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {type.description}
                  </p>

                  {/* Start Button */}
                  <div className={`
                    inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                    transition-all duration-200
                    ${type.color === 'blue' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                    }
                    ${isHovered ? 'translate-x-2' : ''}
                  `}>
                    Start Practice
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Helper Text */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Not sure which to choose? Try both! Each interview type offers unique learning opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
