// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import SkipLink from '@/components/SkipLink';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import ClientSideFeatures from '@/components/ClientSideFeatures';

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Election Process Education Assistant",
  "url": "https://election-assistant.vercel.app",
  "description": "AI-powered guide to understanding India's election process."
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
    <html lang="en" id="html-root" className={inter.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <SkipLink />
            <ClientSideFeatures />
            <Navbar />
            <main id="main-content" className="min-h-screen pt-16 sm:pt-20" tabIndex={-1}>
              {children}
            </main>
          <footer className="bg-gray-900 text-white mt-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
            <div className="max-w-7xl mx-auto px-4 py-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <span className="text-2xl">🗳️</span>
                    </div>
                    <span className="font-extrabold text-xl tracking-tight">Election Assistant</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-md font-medium">
                    An advanced AI platform designed to empower every Indian citizen with knowledge about their democratic rights and the electoral process. Leveraging Google Gemini 1.5 for a smarter, more accessible India.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-8">
                    {['ECI Official', 'Voter Portal', 'Electoral Search'].map((text, i) => (
                      <a 
                        key={i} 
                        href="#" 
                        className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-blue-400 transition-colors border border-gray-800 px-3 py-1.5 rounded-lg"
                      >
                        {text} ↗
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xs mb-6 text-gray-500 uppercase tracking-[0.2em]">Platform</h3>
                  <ul className="space-y-4 text-sm font-bold text-gray-400">
                    {['AI Assistant', 'Check Eligibility', 'Voting Guide', 'Booth Finder', 'FAQs'].map((item, i) => (
                      <li key={i}>
                        <a href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                          <div className="w-1 h-1 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xs mb-6 text-gray-500 uppercase tracking-[0.2em]">Quick Help</h3>
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">1950</div>
                      <span className="text-xs font-bold text-gray-200">Voter Helpline</span>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Official Support</p>
                      <p className="text-xs font-medium text-gray-400">voterportal.eci.gov.in</p>
                      <p className="text-xs font-medium text-gray-400">complaints@eci.gov.in</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Developed with Purpose</p>
                  <p className="text-xs text-gray-600 font-medium max-w-sm">
                    © 2024 Election Education Initiative. Educational prototype powered by Google AI. Not an official ECI portal.
                  </p>
                </div>
                <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
                  <span className="text-xs font-bold text-gray-400">Status: <span className="text-green-500 ml-1">Live</span></span>
                  <div className="w-px h-4 bg-gray-700" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">v1.2.0 Production</span>
                </div>
              </div>
            </div>
          </footer>
          </AuthProvider>
          <Toaster 
            position="bottom-left" 
            toastOptions={{ 
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1e293b',
                borderRadius: '1.25rem',
                padding: '12px 20px',
                fontWeight: '700',
                fontSize: '14px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)'
              }
            }} 
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}
