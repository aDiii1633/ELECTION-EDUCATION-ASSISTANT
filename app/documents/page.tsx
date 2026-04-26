// app/documents/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { VALID_DOCUMENTS } from '@/lib/electionData';
import { validateDocuments } from '@/lib/gemini';

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
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FileCheck size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Verification Helper</h1>
        <p className="text-gray-500">
          Select the documents you have and our AI will check if they're sufficient for voter registration.
        </p>
      </div>

      {/* Category status */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {categoryStatus.map(({ cat, covered, label, emoji }) => (
          <div
            key={cat}
            className={`rounded-xl p-3 border text-center transition-all ${
              covered ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="text-2xl mb-1">{emoji}</div>
            <p className="text-xs font-semibold text-gray-700">{label}</p>
            <div className={`flex items-center justify-center gap-1 mt-1.5 text-xs font-bold ${
              covered ? 'text-green-600' : 'text-gray-400'
            }`}>
              {covered ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
              {covered ? 'Covered' : 'Missing'}
            </div>
          </div>
        ))}
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {VALID_DOCUMENTS.map((doc) => {
          const isSelected = selected.has(doc.id);
          return (
            <motion.button
              key={doc.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(doc.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-teal-400 bg-teal-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
              }`}
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`Select ${doc.name}`}
            >
              <span className="text-2xl shrink-0">{doc.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{doc.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {doc.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full capitalize"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              {isSelected && (
                <CheckCircle2 size={20} className="text-teal-600 shrink-0" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected count */}
      {selected.size > 0 && (
        <p className="text-sm text-gray-500 text-center mb-4">
          <span className="font-semibold text-teal-700">{selected.size}</span> document{selected.size > 1 ? 's' : ''} selected
        </p>
      )}

      {/* Validate button */}
      <button
        onClick={handleValidate}
        disabled={selected.size === 0 || loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-200"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Analyzing with AI...
          </>
        ) : (
          <>
            <FileCheck size={18} /> Verify My Documents
          </>
        )}
      </button>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-6 p-5 rounded-2xl border-2 ${
              result.valid
                ? 'bg-green-50 border-green-200'
                : 'bg-amber-50 border-amber-200'
            }`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 mb-3">
              {result.valid ? (
                <CheckCircle2 size={22} className="text-green-600" />
              ) : (
                <AlertCircle size={22} className="text-amber-600" />
              )}
              <h3 className={`font-bold ${result.valid ? 'text-green-700' : 'text-amber-700'}`}>
                {result.valid ? 'Documents are Sufficient ✓' : 'Additional Documents Needed'}
              </h3>
            </div>
            <p className="text-sm text-gray-700">{result.message}</p>
            {result.missing.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {result.missing.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-amber-700">
                    <AlertCircle size={13} /> {m}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className="mt-8 bg-blue-50 rounded-2xl border border-blue-100 p-5">
        <h3 className="font-semibold text-blue-800 mb-2 text-sm">📌 Required Documents for Registration</h3>
        <ul className="space-y-1.5 text-sm text-blue-700">
          <li>• <strong>Proof of Identity</strong>: Aadhaar, PAN, Passport, Driving License, etc.</li>
          <li>• <strong>Proof of Address</strong>: Aadhaar, Utility bill, Bank passbook, etc.</li>
          <li>• <strong>Proof of Age</strong>: Birth certificate, 10th marksheet, Aadhaar, etc.</li>
          <li>• <strong>Photograph</strong>: Passport-size photo (for physical form)</li>
        </ul>
      </div>
    </div>
  );
}
