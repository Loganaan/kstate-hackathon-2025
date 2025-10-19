'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ThemeLogo() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder to avoid layout shift
    return (
      <div className="h-16 w-48" />
    );
  }

  const logoSrc = resolvedTheme === 'dark' 
    ? '/images/TechReady_light.png' 
    : '/images/TechReady.png';

  return (
    <Link href="/" className="cursor-pointer">
      <Image
        src={logoSrc}
        alt="TechReady Logo"
        width={192}
        height={64}
        className="h-16 object-contain transition-opacity duration-300 hover:opacity-80"
        priority
      />
    </Link>
  );
}
