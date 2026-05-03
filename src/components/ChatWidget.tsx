// components/ChatWidget.tsx
'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, ThumbsUp, ThumbsDown, Copy, Check, RotateCcw, Maximize2, Minimize2, Volume2, Mic, Search, Hash, ShieldAlert } from 'lucide-react';
import { useStore } from '@/core/store';
import { sendChatMessage } from '@/services/ai';
import { usePathname } from 'next/navigation';
import { sanitizeChatInput } from '@/lib/sanitize';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  
  const pathname = usePathname();
  const { messages, addMessage, clearMessages, language, trackQuestion, user, isFeatureEnabled } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Moved feature flag check to end

  const isFullPage = pathname === '/chat';
  const unreadCount = useMemo(() => open ? 0 : messages.filter(m => m.role === 'assistant' && !m.timestamp).length, [messages, open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  const handleSend = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = sanitizeChatInput(input);
    if (!userMessage) return;
    
    const sessionId = 'session-' + Date.now();
    setInput('');
    addMessage({ role: 'user', content: userMessage, language });
    setLoading(true);
    trackQuestion(userMessage);

    try {
      const response = await sendChatMessage(sessionId, userMessage, language);
      addMessage({ role: 'assistant', content: response, language });
    } catch {
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  }, [input, loading, language, addMessage, trackQuestion]);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyingId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopyingId(null), 2000);
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    // @ts-expect-error - Web Speech API isn't fully typed
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const filteredMessages = useMemo(() => {
    if (!searchQuery) return messages;
    return messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [messages, searchQuery]);

  const chatContent = (
    <div className={`flex flex-col bg-white overflow-hidden shadow-2xl border border-gray-100 ${isFullPage ? 'h-full w-full' : 'rounded-3xl h-[600px] w-[400px] sm:w-[450px]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-5 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
            <Bot size={26} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Election AI Assistant</h3>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            </div>
            <p className="text-[10px] sm:text-xs text-blue-100 font-bold uppercase tracking-widest opacity-80 mt-0.5">Powered by Gemini 1.5</p>
          </div>
        </div>
        <div className="flex items-center gap-1 relative z-10">
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Search size={18} /></button>
          {!isFullPage && (
            <>
              <button onClick={() => setMinimized(!minimized)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                {minimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
            </>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-b border-gray-100">
            <div className="p-3 bg-gray-50 flex gap-2">
              <input 
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..." className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button onClick={() => setShowSearch(false)} className="text-gray-400 p-2"><X size={16}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide bg-[#f8faff] ${minimized ? 'hidden' : 'block'}`}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {!user ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6">
              <ShieldAlert size={36} className="text-blue-600" />
            </div>
            <h4 className="text-lg font-extrabold text-gray-900 mb-2">Secure Chat</h4>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed font-medium mb-8">
              Please sign in to access the AI assistant and save your chat history.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Link href="/login" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                Sign In
              </Link>
              <Link href="/signup" className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                Create Account
              </Link>
            </div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-6 border border-gray-50">
              <MessageSquare size={36} className="text-blue-500" />
            </div>
            <h4 className="text-lg font-extrabold text-gray-900 mb-2">Namaste! {language === 'hi' ? 'नमस्ते' : ''}</h4>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed font-medium">Ask me anything about the Indian election process, registration, or your voting rights.</p>
            <div className="grid grid-cols-1 gap-2 mt-8 w-full">
              {['How to register to vote?', 'Check eligibility criteria', 'Find my polling booth'].map(q => (
                <button 
                  key={q} onClick={() => setInput(q)}
                  className="p-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-blue-200 hover:text-blue-600 hover:shadow-md transition-all text-left flex items-center gap-3"
                >
                  <Hash size={14} className="text-blue-400" /> {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          filteredMessages.map((m, i) => {
            const isUser = m.role === 'user';
            const msgId = `msg-${i}`;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-center gap-2 mb-1.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-sm ${isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-100 text-gray-400'}`}>
                      {isUser ? <User size={12}/> : <Bot size={12}/>}
                    </div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{isUser ? 'You' : 'Assistant'}</span>
                    <span className="text-[10px] font-bold text-gray-300">{m.timestamp || ''}</span>
                  </div>
                  <div className={`p-4 rounded-3xl shadow-sm relative group transition-all ${
                    isUser 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{m.content}</p>
                    
                    {/* Actions */}
                    <div className={`absolute bottom-[-28px] ${isUser ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-gray-100 z-10`}>
                      <button onClick={() => copyToClipboard(m.content, msgId)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                        {copyingId === msgId ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                      {!isUser && (
                        <>
                          <button onClick={() => speak(m.content)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                            <Volume2 size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-500 transition-colors"><ThumbsUp size={14}/></button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><ThumbsDown size={14}/></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">AI Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`p-4 sm:p-5 bg-white border-t border-gray-50 ${minimized ? 'hidden' : 'block'}`}>
        <form onSubmit={handleSend} className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Type your query...'}
              className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
            />
            <button 
              type="button" 
              onClick={isListening ? () => {} : startListening}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-400 hover:bg-gray-200'}`}
            >
              {isListening ? <Mic size={18} /> : <Mic size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3.5 rounded-2xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send size={20} />
          </button>
        </form>
        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ask in English or Hindi</p>
          {messages.length > 0 && (
            <button onClick={clearMessages} className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1 transition-colors">
              <RotateCcw size={10} /> Clear Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (!isFeatureEnabled('ENABLE_AI_CHAT')) return null;

  if (isFullPage) return chatContent;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4"
          >
            {chatContent}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-300 relative group ${
          open ? 'bg-white text-blue-600 rotate-90 border-2 border-blue-50' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-300'
        }`}
        aria-label={open ? 'Close chat' : 'Open AI assistant'}
      >
        <div className="absolute inset-0 rounded-[2rem] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        {open ? <X size={28} /> : <MessageSquare size={30} />}
        {unreadCount > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
