'use client';


import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  const [showSplash, setShowSplash] = useState(true);
  const [typedText, setTypedText] = useState("");
  const splashText = "Welcome to TechReady";

  useEffect(() => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < splashText.length) {
        setTypedText(splashText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowSplash(false), 700); // Wait a bit after typing
      }
    }, 70);
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors relative overflow-hidden">
      {/* Splash Screen Overlay with typing animation */}
      <div
        className={`absolute inset-0 z-50 flex items-center justify-center transition-transform duration-700 ${showSplash ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ backgroundColor: 'white' }}
      >
        <style>{`
          .dark .splash-overlay-bg {
            background-color: lab(8.11897 0.811279 -12.254) !important;
          }
        `}</style>
        <div className="splash-overlay-bg absolute inset-0 -z-10" />
        <span className="text-6xl text-black dark:text-white whitespace-pre">
          {/* Typing animation with 'Ready' bold and colored */}
          {(() => {
            const readyIndex = splashText.indexOf('Ready');
            if (typedText.length <= readyIndex) {
              return typedText;
            }
            const beforeReady = typedText.slice(0, readyIndex);
            const readyTyped = typedText.slice(readyIndex, Math.min(readyIndex + 5, typedText.length));
            const afterReady = typedText.slice(readyIndex + 5);
            return <>
              {beforeReady}
              <b style={{ color: '#4CA626' }}>{readyTyped}</b>
              {afterReady}
            </>;
          })()}
          <span
            className={`inline-block ml-1 animate-pulse align-bottom rounded bg-black dark:bg-white`}
            style={{
              width: '0.5em',
              height: '1em',
              fontSize: '3.75rem',
              verticalAlign: 'bottom',
              display: 'inline-block',
              backgroundColor: typedText.length < splashText.length ? undefined : 'transparent'
            }}
          ></span>
        </span>
      </div>
      {/* Left Section - Behavioral Interview */}
      <Link href="/interview/behavioral" className="flex flex-col items-center group relative">
        <div className="flex items-center mb-8 relative">
          <div className="w-30 h-30 rounded-full bg-black dark:bg-white transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl" />
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-3 h-1 bg-black dark:bg-white -rotate-45 transition-colors" />
            <div className="w-6 h-1 bg-black dark:bg-white ml-6 transition-colors" />
            <div className="w-3 h-1 bg-black dark:bg-white rotate-45 transition-colors" />
          </div>
        </div>
        <div className="w-40 h-40 bg-black dark:bg-white transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl" />
        <span className="mt-4 text-black dark:text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Behavioral
        </span>
      </Link>

      {/* Center Section - Decorative */}
      <div className="flex flex-col items-center mx-10 mt-52">
        <div className="flex flex-row items-center">
          <div className="w-60 h-4 bg-black dark:bg-white transition-colors" />
        </div>
        <div className="flex flex-row justify-between w-60 mt-0 items-end">
          <div className="w-4 h-20 bg-black dark:bg-white transition-colors" />
          <div className="w-4 h-20 bg-black dark:bg-white transition-colors" />
        </div>
      </div>

      {/* Right Section - Technical Interview */}
      <Link href="/interview/technical" className="flex flex-col items-center group">
        <div className="w-30 h-30 rounded-full bg-black dark:bg-white mb-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl" />
        <div className="absolute right-full ml-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-3 h-1 bg-black dark:bg-white -rotate-45 transition-colors" />
          <div className="w-6 h-1 bg-black dark:bg-white ml-6 transition-colors" />
          <div className="w-3 h-1 bg-black dark:bg-white rotate-45 transition-colors" />
        </div>
        <div className="w-40 h-40 bg-black dark:bg-white transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl" />
        <span className="mt-4 text-black dark:text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Technical
        </span>
      </Link>
    </div>
  );
}
