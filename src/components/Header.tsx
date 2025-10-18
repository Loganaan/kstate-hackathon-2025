'use client';

import ThemeLogo from "./ThemeLogo";

export default function Header() {
  return (
    <div className="w-full flex justify-center mt-0 sticky top-0 z-50 py-2 bg-white dark:bg-gray-900 transition-colors">
      <ThemeLogo />
    </div>
  );
}
