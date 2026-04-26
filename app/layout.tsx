// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ChatWidget from '@/components/ChatWidget';
import AccessibilityController from '@/components/AccessibilityController';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Election Process Education Assistant | Powered by Gemini AI',
  description:
    'Your AI-powered guide to understanding India\'s election process. Check eligibility, find polling booths, learn voting procedures, and get answers to election FAQs.',
  keywords: [
    'election', 'voting', 'voter registration', 'India elections', 'ECI',
    'polling booth', 'voter eligibility', 'EPIC', 'voter ID', 'election AI',
  ],
  authors: [{ name: 'Election Education Initiative' }],
  openGraph: {
    title: 'Election Process Education Assistant',
    description: 'AI-powered election education and voter guidance platform.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      </head>
      <body>
        <AccessibilityController />
        <Navbar />
        <main id="main-content" className="min-h-screen pt-16" tabIndex={-1}>
          {children}
        </main>
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🗳️</span>
                  <span className="font-bold text-lg">Election Education Assistant</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  An AI-powered platform to help every Indian citizen understand and participate
                  in the democratic process. Powered by Google Gemini AI.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    ECI Official ↗
                  </a>
                  <a href="https://voterportal.eci.gov.in" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Voter Portal ↗
                  </a>
                  <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Electoral Search ↗
                  </a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-3 text-gray-200">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/chat" className="hover:text-blue-400 transition-colors">AI Assistant</a></li>
                  <li><a href="/eligibility" className="hover:text-blue-400 transition-colors">Check Eligibility</a></li>
                  <li><a href="/guide" className="hover:text-blue-400 transition-colors">Voting Guide</a></li>
                  <li><a href="/booth-finder" className="hover:text-blue-400 transition-colors">Booth Finder</a></li>
                  <li><a href="/faq" className="hover:text-blue-400 transition-colors">FAQs</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-3 text-gray-200">Helpline</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-1.5"><span>📞</span> Voter Helpline: <strong className="text-white">1950</strong></li>
                  <li className="flex items-center gap-1.5"><span>🌐</span> voterportal.eci.gov.in</li>
                  <li className="flex items-center gap-1.5"><span>📱</span> Voter Helpline App</li>
                  <li className="flex items-center gap-1.5"><span>✉️</span> complaints@eci.gov.in</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-gray-500">
                © 2024 Election Education Assistant. For educational purposes only.
                Not an official ECI platform.
              </p>
              <p className="text-xs text-gray-500">
                Built with 💙 using Next.js + Gemini AI
              </p>
            </div>
          </div>
        </footer>
        <ChatWidget />
        <Toaster position="bottom-left" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
