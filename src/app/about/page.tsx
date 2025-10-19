'use client';

import Link from "next/link";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function About() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-1 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .delay-2 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-12 sm:mb-16 fade-in">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white mb-4 sm:mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
            TechReady is designed to help you ace your technical and behavioral interviews. We provide a comprehensive interview experience to give you the confidence and skills you need to succeed.
          </p>
          <div className="flex justify-center mt-6 sm:mt-8">
            <Button onClick={() => router.push('/')}>
              Start Practicing
            </Button>
          </div>
        </div>

        <div className="mb-12 sm:mb-16 fade-in delay-1">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black dark:text-white mb-6 sm:mb-8 text-center">
            Meet the Team
          </h2>
          <div className="flex justify-center mb-8 sm:mb-12">
            <Image 
              src="/images/team_pic.jpg"
              alt="Team Photo"
              width={800}
              height={400}
              className="rounded-lg shadow-lg max-w-full h-auto md:max-w-2xl"
              priority
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sm:p-8 transition-all hover:shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-3 text-center">
                Logan Crotchett
              </h3>
              <div className="flex justify-center mt-4">
                <Link 
                  href="https://www.linkedin.com/in/logancrotchett/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sm:p-8 transition-all hover:shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-3 text-center">
                Alida Nola
              </h3>
              <div className="flex justify-center mt-4">
                <Link 
                  href="https://www.linkedin.com/in/alidanola/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sm:p-8 transition-all hover:shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-3 text-center">
                Christian Ramierz-Chavez
              </h3>
              <div className="flex justify-center mt-4">
                <Link 
                  href="https://www.linkedin.com/in/christianrcc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sm:p-8 transition-all hover:shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-3 text-center">
                Thinh Vo
              </h3>
              <div className="flex justify-center mt-4">
                <Link 
                  href="https://www.linkedin.com/in/thinhpvo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
