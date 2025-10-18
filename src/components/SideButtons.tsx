'use client';

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SideButtons() {
  return (
    <div className="fixed top-1/4 left-4 flex flex-col space-y-4 z-50">
      {/* Behavioral Interview Button */}
      <Link
        href="/interview/behavioral"
        className="w-12 h-12 bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] text-white rounded-md flex items-center justify-center shadow transform transition-all duration-200 hover:scale-110"
        title="Behavioral Interview Practice"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>
      </Link>

      {/* Technical Interview Button */}
      <Link
        href="/interview/technical"
        className="w-12 h-12 bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] text-white rounded-md flex items-center justify-center shadow transform transition-all duration-200 hover:scale-110"
        title="Technical Interview Practice"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
      </Link>

      {/* Dashboard Button */}
      <Link
        href="/dashboard"
        className="w-12 h-12 bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] text-white rounded-md flex items-center justify-center shadow transform transition-all duration-200 hover:scale-110"
        title="Dashboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
          />
        </svg>
      </Link>

      {/* Flashcards Button */}
      <button
        className="w-12 h-12 bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] text-white rounded-md flex items-center justify-center shadow transform transition-all duration-200 hover:scale-110"
        title="Flashcards"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <rect x="4" y="4" width="10" height="10" rx="2" className="opacity-60" />
        </svg>
      </button>

      {/* About Button */}
      <button
        className="w-12 h-12 bg-[rgba(76,166,38,1)] hover:bg-[rgba(76,166,38,0.9)] text-white rounded-md flex items-center justify-center shadow transform transition-all duration-200 hover:scale-110"
        title="About"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17v-6m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Theme Toggle Button */}
      <ThemeToggle />
    </div>
  );
}
