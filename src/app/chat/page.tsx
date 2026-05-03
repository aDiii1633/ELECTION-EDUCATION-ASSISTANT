// app/chat/page.tsx
'use client';

import ChatWidget from '@/components/ChatWidget';
import { Zap, Globe, Volume2, Shield, Info, Download, Clock } from 'lucide-react';
import { useStore } from '@/core/store';

export default function ChatPage() {
  const { messages } = useStore();

  const handleExport = () => {
    const text = messages.map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `election_chat_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] min-h-[600px]">
        
        {/* Left Sidebar: Context & Info */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-200 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              Gemini AI Online
            </div>
            
            <h1 className="text-3xl font-bold mb-3 leading-tight">Election AI<br/>Assistant</h1>
            <p className="text-blue-100/80 text-sm leading-relaxed mb-8">
              Ask anything about voting, registration, eligibility, documents, and polling in India.
            </p>

            <div className="space-y-4">
              {[
                { icon: Zap, text: 'Instant AI answers', color: 'text-yellow-400' },
                { icon: Globe, text: 'English & Hindi support', color: 'text-blue-400' },
                { icon: Volume2, text: 'Voice I/O capable', color: 'text-purple-400' },
                { icon: Shield, text: 'Privacy focused', color: 'text-green-400' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className={`p-1.5 bg-white/10 rounded-lg ${color}`}>
                    <Icon size={16} />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="font-semibold text-blue-800 text-sm flex items-center gap-2 mb-2">
              <Info size={16} /> Data Disclaimer
            </h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              This AI assistant provides educational information based on ECI guidelines. AI can make mistakes. Always verify critical dates and requirements on the official <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900">eci.gov.in</a> website.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock size={16} className="text-gray-400" /> Session History
            </div>
            <button 
              onClick={handleExport}
              disabled={messages.length === 0}
              className="flex items-center gap-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download size={14} /> Export Chat
            </button>
          </div>
        </div>

        {/* Right Area: The Chat UI */}
        <div className="lg:w-2/3 h-full">
          <ChatWidget />
        </div>

      </div>
    </div>
  );
}
