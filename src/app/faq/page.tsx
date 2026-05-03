// app/faq/page.tsx
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, ChevronUp, Sparkles, Loader2, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { FAQS } from '@/core/data/election';
import { enhanceFAQAnswer } from '@/services/ai';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', ...Array.from(new Set(FAQS.map(f => f.category)))];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [enhanced, setEnhanced] = useState<Record<string, string>>({});
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const filtered = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchCat = category === 'All' || faq.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.tags.some((t) => t.includes(q));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const handleEnhance = useCallback(async (faq: (typeof FAQS)[0]) => {
    if (enhanced[faq.id] || enhancing) return;
    setEnhancing(faq.id);
    try {
      const enhanced_ans = await enhanceFAQAnswer(faq.question, faq.answer);
      setEnhanced((prev) => ({ ...prev, [faq.id]: enhanced_ans }));
    } catch {
      toast.error('Failed to enhance answer via AI');
    } finally {
      setEnhancing(null);
    }
  }, [enhanced, enhancing]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        const faq = filtered[focusedIndex];
        setExpanded(expanded === faq.id ? null : faq.id);
        if (expanded !== faq.id) handleEnhance(faq);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered, focusedIndex, expanded, handleEnhance]);

  const handleShare = (faq: (typeof FAQS)[0]) => {
    const text = `Q: ${faq.question}\nA: ${faq.answer}`;
    if (navigator.share) {
      navigator.share({ title: 'Election FAQ', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('FAQ copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgb(244,63,94,0.3)]">
          <HelpCircle size={32} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">FAQ Knowledge Base</h1>
        <p className="text-gray-500 text-lg">
          Searchable answers to common election questions, dynamically enhanced by Gemini AI.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div className="relative mb-5">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions... (e.g. 'eligibility', 'documents', 'NRI')"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all"
            aria-label="Search FAQs"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-pink-200'
              }`}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count & Help text */}
      <div className="flex items-center justify-between mb-4 px-2">
        <p className="text-sm text-gray-400 font-medium">
          Showing <span className="text-gray-800 font-bold bg-gray-100 px-2 py-0.5 rounded-lg">{filtered.length}</span> questions
        </p>
        <p className="hidden sm:block text-xs text-gray-400">
          Use <kbd className="bg-gray-100 px-1 rounded border">↑</kbd> <kbd className="bg-gray-100 px-1 rounded border">↓</kbd> arrows to navigate
        </p>
      </div>

      {/* FAQ list */}
      <div className="space-y-3" role="list">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 font-semibold text-lg">No FAQs found</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">We couldn&apos;t find anything matching &quot;{search}&quot;</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="text-sm font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-xl transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filtered.map((faq, index) => {
            const isExpanded = expanded === faq.id;
            const isFocused = focusedIndex === index;
            
            return (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded ? 'border-pink-200 shadow-md' : isFocused ? 'border-pink-400 ring-2 ring-pink-100' : 'border-gray-100 hover:border-pink-200'
              }`}
              role="listitem"
            >
              <button
                onClick={() => {
                  setFocusedIndex(index);
                  setExpanded(isExpanded ? null : faq.id);
                  if (!isExpanded) handleEnhance(faq);
                }}
                className="w-full flex items-start sm:items-center justify-between gap-4 p-5 text-left focus:outline-none"
                aria-expanded={isExpanded}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 shrink-0 w-fit">
                    {faq.category}
                  </span>
                  <span className={`font-bold transition-colors ${isExpanded ? 'text-pink-900' : 'text-gray-800'}`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-pink-100 text-pink-600' : 'bg-gray-50 text-gray-400'}`}>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`faq-answer-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-gray-50">
                      {/* AI Enhanced Answer */}
                      {enhancing === faq.id ? (
                        <div className="flex items-center gap-3 py-6 text-pink-600 text-sm font-medium bg-pink-50/50 rounded-xl px-4 mt-4">
                          <Loader2 size={18} className="animate-spin" />
                          Consulting Gemini AI for more details...
                        </div>
                      ) : (
                        <div className="mt-4 space-y-4">
                          {/* Original Answer as base */}
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            {faq.answer}
                          </p>

                          {/* AI Enhancement if available */}
                          {enhanced[faq.id] && (
                            <div className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                <Sparkles size={16} className="text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-purple-800 mb-1 flex items-center gap-2">
                                  AI Detailed Context
                                </p>
                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                                  {enhanced[faq.id]}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Footer actions & Tags */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mt-2 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                              {faq.tags.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => setSearch(tag)}
                                  className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                            
                            {/* Feedback Actions */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 font-medium mr-2">Helpful?</span>
                              <button 
                                onClick={() => setFeedback(prev => ({...prev, [faq.id]: 'up'}))}
                                className={`p-1.5 rounded-lg transition-colors ${feedback[faq.id] === 'up' ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-600'}`}
                              >
                                <ThumbsUp size={14} />
                              </button>
                              <button 
                                onClick={() => setFeedback(prev => ({...prev, [faq.id]: 'down'}))}
                                className={`p-1.5 rounded-lg transition-colors ${feedback[faq.id] === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600'}`}
                              >
                                <ThumbsDown size={14} />
                              </button>
                              <div className="w-px h-4 bg-gray-200 mx-1"></div>
                              <button 
                                onClick={() => handleShare(faq)}
                                className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <Share2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            );
          })
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl border border-pink-100 p-8 text-center shadow-inner">
        <p className="text-gray-800 font-bold text-lg mb-2">
          Still have questions?
        </p>
        <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
          Our AI assistant is ready to provide instant, personalized answers to any election-related query.
        </p>
        <a
          href="/chat"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <Sparkles size={16} /> Chat with AI Assistant
        </a>
      </div>
    </div>
  );
}
