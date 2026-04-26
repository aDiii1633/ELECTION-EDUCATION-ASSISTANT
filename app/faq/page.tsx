// app/faq/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { FAQS } from '@/lib/electionData';
import { enhanceFAQAnswer } from '@/lib/gemini';

const CATEGORIES = ['All', 'Eligibility', 'Registration', 'Documents', 'Voting', 'Booth', 'Process'];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [enhanced, setEnhanced] = useState<Record<string, string>>({});
  const [enhancing, setEnhancing] = useState<string | null>(null);

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

  const handleEnhance = async (faq: (typeof FAQS)[0]) => {
    if (enhanced[faq.id] || enhancing) return;
    setEnhancing(faq.id);
    try {
      const enhanced_ans = await enhanceFAQAnswer(faq.question, faq.answer);
      setEnhanced((prev) => ({ ...prev, [faq.id]: enhanced_ans }));
    } finally {
      setEnhancing(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <HelpCircle size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">FAQ Knowledge Base</h1>
        <p className="text-gray-500">
          Searchable answers to common election questions, enhanced by Gemini AI.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions... (e.g. 'eligibility', 'document', 'booth')"
          className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
          aria-label="Search FAQs"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
              category === cat
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-4 font-medium">
        Showing <span className="text-gray-700 font-semibold">{filtered.length}</span> questions
      </p>

      {/* FAQ list */}
      <div className="space-y-3" role="list">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Search size={48} className="mx-auto mb-3 opacity-40" />
            <p>No FAQs match your search.</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="mt-3 text-sm text-blue-500 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="card-backlit overflow-hidden"
              role="listitem"
            >
              {/* Question */}
              <button
                onClick={() => {
                  setExpanded(expanded === faq.id ? null : faq.id);
                  if (expanded !== faq.id) handleEnhance(faq);
                }}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={expanded === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-pink-100 text-pink-700 shrink-0 mt-0.5">
                    {faq.category}
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">{faq.question}</span>
                </div>
                {expanded === faq.id ? (
                  <ChevronUp size={18} className="text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400 shrink-0" />
                )}
              </button>

              {/* Answer */}
              <AnimatePresence>
                {expanded === faq.id && (
                  <motion.div
                    id={`faq-answer-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-gray-100">
                      {/* AI Enhanced Answer */}
                      {enhancing === faq.id ? (
                        <div className="flex items-center gap-2 py-4 text-gray-400 text-sm">
                          <Loader2 size={15} className="animate-spin" />
                          Enhancing with Gemini AI...
                        </div>
                      ) : (
                        <>
                          {enhanced[faq.id] && (
                            <div className="mt-3 flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-xl p-3 mb-3">
                              <Sparkles size={14} className="text-purple-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-purple-700 mb-1">AI-Enhanced Answer</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{enhanced[faq.id]}</p>
                              </div>
                            </div>
                          )}
                          <p className={`text-sm text-gray-600 leading-relaxed mt-3 ${enhanced[faq.id] ? 'text-xs text-gray-400' : ''}`}>
                            {enhanced[faq.id] ? '📌 Original: ' : ''}{faq.answer}
                          </p>
                        </>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {faq.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearch(tag)}
                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-5 text-center">
        <p className="text-sm text-gray-700 mb-3">
          Didn't find your answer? Ask our AI assistant directly!
        </p>
        <a
          href="/chat"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:shadow-lg"
        >
          <Sparkles size={15} /> Ask AI Assistant
        </a>
      </div>
    </div>
  );
}
