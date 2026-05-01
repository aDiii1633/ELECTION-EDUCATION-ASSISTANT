// components/ChatWidget.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Trash2, MessageCircle, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { sendChatMessage } from '@/lib/gemini';

interface ChatWidgetProps {
  fullPage?: boolean;
}

interface SpeechRecognitionEvent {
  results: { transcript: string }[][];
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

export default function ChatWidget({ fullPage = false }: ChatWidgetProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [open, setOpen] = useState(fullPage);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const { messages, addMessage, clearMessages, sessionId, language, setLanguage, trackQuestion } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const win = window as unknown as WindowWithSpeech;
    if (typeof window !== 'undefined' && (win.SpeechRecognition || win.webkitSpeechRecognition)) {
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = () => setIsListening(false);
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled, language]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);

    addMessage({ role: 'user', content: text, language });
    trackQuestion(text);

    try {
      const response = await sendChatMessage(sessionId, text, language);
      addMessage({ role: 'assistant', content: response, language });
      speak(response);
    } catch {
      addMessage({
        role: 'assistant',
        content: 'I apologize, I encountered an error. Please try again or call Voter Helpline 1950.',
        language,
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading, language, sessionId, addMessage, trackQuestion, speak]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = language === 'hi'
    ? ['मतदान के लिए कैसे पंजीकरण करें?', 'मतदाता पात्रता क्या है?', 'मतदान बूथ कैसे खोजें?']
    : ['How to register to vote?', 'What are the eligibility criteria?', 'How do I find my polling booth?'];

  const chatContent = (
    <div className={`flex flex-col ${fullPage ? 'h-[calc(100vh-160px)]' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-base">🤖</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Election AI Assistant</p>
            <p className="text-xs text-blue-200">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-xs font-semibold"
            title="Switch language"
            aria-label="Switch language"
          >
            {language === 'en' ? 'हिं' : 'EN'}
          </button>
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-1.5 rounded-lg transition-colors ${ttsEnabled ? 'bg-white/30' : 'hover:bg-white/20'}`}
            title="Toggle text-to-speech"
            aria-label="Toggle text-to-speech"
          >
            {ttsEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            onClick={clearMessages}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear chat"
            aria-label="Clear chat messages"
          >
            <Trash2 size={15} />
          </button>
          {!fullPage && (
            <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close chat">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🗳️</div>
            <p className="text-sm font-semibold text-gray-700">
              {language === 'hi' ? 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?' : 'Hello! How can I help you today?'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {language === 'hi' ? 'चुनाव प्रक्रिया के बारे में पूछें' : 'Ask me anything about the election process'}
            </p>
            {/* Quick questions */}
            <div className="mt-4 space-y-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="block w-full text-left text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-100"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                <span className="text-white text-xs">AI</span>
              </div>
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs">AI</span>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 bg-white border-t border-gray-100 rounded-b-2xl">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'hi' ? 'कोई प्रश्न पूछें...' : 'Ask about elections...'}
              rows={1}
              className="w-full resize-none text-sm border border-gray-200 rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              aria-label="Chat input"
            />
          </div>
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-all"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (fullPage) return <div className="bg-white rounded-2xl shadow-xl overflow-hidden">{chatContent}</div>;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Open AI chat assistant"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-40 w-[360px] sm:w-[400px] rounded-2xl shadow-2xl overflow-hidden"
          >
            {chatContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
