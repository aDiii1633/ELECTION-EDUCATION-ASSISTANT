// app/documents/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, CheckCircle2, XCircle, AlertCircle, Loader2, CheckSquare } from 'lucide-react';
import { VALID_DOCUMENTS } from '@/core/data/election';
import { validateDocuments } from '@/services/ai';

interface ValidationResult {
  valid: boolean;
  message: string;
  missing: string[];
}

export default function DocumentsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setResult(null);
  };

  const handleSelectAll = () => {
    if (selected.size === VALID_DOCUMENTS.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(VALID_DOCUMENTS.map(d => d.id)));
    }
    setResult(null);
  };

  const handleValidate = async () => {
    if (selected.size === 0) return;
    setLoading(true);
    try {
      const docNames = VALID_DOCUMENTS.filter((d) => selected.has(d.id)).map((d) => d.name);
      const res = await validateDocuments(docNames);
      setResult(res);
    } catch {
      setResult({
        valid: selected.size >= 2,
        message: selected.size >= 2
          ? 'Your selected documents appear sufficient.'
          : 'Please select at least 2 documents.',
        missing: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Category coverage analysis
  const selectedDocs = VALID_DOCUMENTS.filter((d) => selected.has(d.id));
  const coveredCategories = new Set(selectedDocs.flatMap((d) => d.categories));

  const required = ['identity', 'address', 'age'];
  const categoryStatus = required.map((cat) => ({
    cat,
    covered: coveredCategories.has(cat),
    label: cat === 'identity' ? 'Identity Proof' : cat === 'address' ? 'Address Proof' : 'Age Proof',
    emoji: cat === 'identity' ? '🪪' : cat === 'address' ? '🏠' : '🎂',
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgb(20,184,166,0.3)]">
          <FileCheck size={32} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Document Verification Helper</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Select the documents you have available. Our AI will analyze them and verify if they satisfy all ECI registration requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Document Selection */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold text-gray-800">Available Documents</h2>
            <button 
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <CheckSquare size={16} /> 
              {selected.size === VALID_DOCUMENTS.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {VALID_DOCUMENTS.map((doc) => {
              const isSelected = selected.has(doc.id);
              return (
                <motion.button
                  key={doc.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggle(doc.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-100 ring-offset-1'
                      : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                  }`}
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-label={`Select ${doc.name}`}
                >
                  <span className="text-3xl shrink-0">{doc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${isSelected ? 'text-teal-900' : 'text-gray-900'}`}>{doc.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {doc.categories.map((cat) => (
                        <span
                          key={cat}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                            isSelected ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-200'
                  }`}>
                    {isSelected && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Analysis & Results */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Category Coverage Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Coverage Status</h2>
            
            <div className="space-y-4 mb-8">
              {categoryStatus.map(({ cat, covered, label, emoji }) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{emoji}</span>
                    <span className="font-semibold text-gray-700 text-sm">{label}</span>
                  </div>
                  {covered ? (
                    <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                      <CheckCircle2 size={14} /> Yes
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                      <XCircle size={14} /> No
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Validate button */}
            <button
              onClick={handleValidate}
              disabled={selected.size === 0 || loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:grayscale text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.23)]"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Analyzing with AI...</>
              ) : (
                <><FileCheck size={18} /> Verify Documents</>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Result Full Width Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-10 p-8 rounded-3xl border-2 shadow-xl ${
              result.valid
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
            }`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-inner ${result.valid ? 'bg-green-100' : 'bg-amber-100'}`}>
                {result.valid ? (
                  <CheckCircle2 size={40} className="text-green-600" />
                ) : (
                  <AlertCircle size={40} className="text-amber-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-extrabold mb-2 ${result.valid ? 'text-green-700' : 'text-amber-700'}`}>
                  {result.valid ? 'Documents are Sufficient! 🎉' : 'Additional Documents Needed'}
                </h3>
                <p className={`text-lg font-medium mb-4 ${result.valid ? 'text-green-600' : 'text-amber-600'}`}>
                  {result.message}
                </p>
                
                {!result.valid && result.missing.length > 0 && (
                  <div className="bg-white/60 rounded-2xl p-5 border border-amber-100 text-left">
                    <p className="font-bold text-amber-800 mb-3">Please provide documents to cover:</p>
                    <ul className="space-y-2">
                      {result.missing.map((m, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.valid && (
                  <div className="mt-4">
                    <a href="https://voterportal.eci.gov.in" target="_blank" rel="noopener noreferrer"
                      className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md"
                    >
                      Proceed to Registration ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
