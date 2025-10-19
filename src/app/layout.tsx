import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SideButtons from "../components/SideButtons";
import ThemeLogo from "../components/ThemeLogo";
import AuthButtons from "../components/AuthButtons";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SplashProvider } from "@/components/SplashProvider";
import { AuthProvider } from "@/contexts/AuthContext";

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
  icons: {
    icon: '/images/TechReady_letters.png',
  },
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <SplashProvider>
              <SideButtons />
              <div className="w-full flex justify-center mt-0 sticky top-0 z-50 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
                <div className="flex-1 flex justify-center">
                  <ThemeLogo />
                </div>
                <div className="absolute right-6">
                  <AuthButtons />
                </div>
              </div>
              <main>
                {children}
              </main>
            </SplashProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
