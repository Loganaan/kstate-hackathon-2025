import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SideButtons from "../components/SideButtons";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interview Coach - Master Your Interview Skills",
  description: "Practice behavioral and technical interviews with AI-powered feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SideButtons />
        <div className="w-full flex justify-center mt-0 sticky top-0 z-50 py-2 bg-white" style={{ background: '#fff' }}>
          <img src="/images/TechReady.png" alt="TechReady Logo" className="h-16 object-contain" />
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
