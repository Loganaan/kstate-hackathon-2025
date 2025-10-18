// components/Footer.tsx
// Global footer component with links, contact info, and branding.
// Consistent footer across all pages of the application.

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p className="text-sm">© 2025 AI Interview Coach. Built with Next.js & Tailwind CSS.</p>
          <p className="text-xs mt-2 text-gray-500">Practice makes perfect. Master your interview skills with AI.</p>
        </div>
      </div>
    </footer>
  );
}