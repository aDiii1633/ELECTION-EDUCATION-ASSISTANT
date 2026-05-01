// app/chat/page.tsx
'use client';

import ChatWidget from '@/components/ChatWidget';
import { Zap, Globe, Volume2, Shield } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Gemini AI Online
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Election AI Assistant</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Ask anything about voting, registration, eligibility, documents, and polling in India.
          Available in English and Hindi.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Zap, text: 'Instant AI answers', color: 'text-yellow-600 bg-yellow-50' },
          { icon: Globe, text: 'English & Hindi', color: 'text-blue-600 bg-blue-50' },
          { icon: Volume2, text: 'Voice I/O support', color: 'text-purple-600 bg-purple-50' },
          { icon: Shield, text: 'Privacy focused', color: 'text-green-600 bg-green-50' },
        ].map(({ icon: Icon, text, color }) => (
          <div key={text} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${color}`}>
            <Icon size={15} />
            {text}
          </div>
        ))}
      </div>

      {/* Full-page chat */}
      <ChatWidget fullPage />

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        This AI assistant provides educational information only. For official guidance, visit{' '}
        <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          eci.gov.in
        </a>{' '}
        or call <strong>1950</strong>.
      </p>
    </div>
  );
}
