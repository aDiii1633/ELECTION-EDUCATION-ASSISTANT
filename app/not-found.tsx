// app/not-found.tsx
'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track to exploring the election process.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
            <Home size={18} /> Back to Home
          </Link>
          <Link href="/faq" className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors">
            <Search size={18} /> Search FAQs
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
