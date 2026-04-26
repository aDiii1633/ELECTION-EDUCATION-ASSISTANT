// app/eligibility/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ChevronRight, User, MapPin, CreditCard, Clock } from 'lucide-react';
import { checkEligibility } from '@/lib/gemini';
import { INDIAN_STATES } from '@/lib/electionData';

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  nextSteps: string[];
}

export default function EligibilityPage() {
  const [form, setForm] = useState({
    age: '',
    citizenship: 'Indian',
    state: '',
    hasVoterId: false,
  });
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120)
      e.age = 'Please enter a valid age (1–120).';
    if (!form.citizenship.trim()) e.citizenship = 'Please specify your citizenship.';
    if (!form.state) e.state = 'Please select your state.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await checkEligibility({
        age: Number(form.age),
        citizenship: form.citizenship,
        state: form.state,
        hasVoterId: form.hasVoterId,
      });
      setResult(res);
    } catch {
      setResult({
        eligible: false,
        reason: 'Unable to check eligibility. Please try again.',
        nextSteps: ['Visit voterportal.eci.gov.in', 'Call Voter Helpline: 1950'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CheckCircle size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Eligibility Checker</h1>
        <p className="text-gray-500">
          Answer a few questions and our AI will instantly determine your voter eligibility.
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-backlit p-6 sm:p-8"
      >
        <form onSubmit={handleSubmit} noValidate aria-label="Eligibility checker form">
          {/* Age */}
          <div className="mb-5">
            <label htmlFor="age" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock size={15} className="text-blue-500" /> Your Age
            </label>
            <input
              id="age"
              type="number"
              min={1}
              max={120}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="Enter your age (e.g. 22)"
              className={`w-full border ${errors.age ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all`}
              aria-describedby={errors.age ? 'age-error' : undefined}
            />
            {errors.age && <p id="age-error" className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>

          {/* Citizenship */}
          <div className="mb-5">
            <label htmlFor="citizenship" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User size={15} className="text-blue-500" /> Citizenship
            </label>
            <select
              id="citizenship"
              value={form.citizenship}
              onChange={(e) => setForm({ ...form, citizenship: e.target.value })}
              className={`w-full border ${errors.citizenship ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all`}
              aria-describedby={errors.citizenship ? 'citizenship-error' : undefined}
            >
              <option value="Indian">Indian Citizen</option>
              <option value="NRI">Non-Resident Indian (NRI)</option>
              <option value="Foreign">Foreign National</option>
              <option value="OCI">Overseas Citizen of India (OCI)</option>
            </select>
            {errors.citizenship && <p id="citizenship-error" className="text-red-500 text-xs mt-1">{errors.citizenship}</p>}
          </div>

          {/* State */}
          <div className="mb-5">
            <label htmlFor="state" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={15} className="text-blue-500" /> State / UT
            </label>
            <select
              id="state"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className={`w-full border ${errors.state ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all`}
              aria-describedby={errors.state ? 'state-error' : undefined}
            >
              <option value="">— Select your state —</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.state && <p id="state-error" className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          {/* Has Voter ID */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                id="hasVoterId"
                checked={form.hasVoterId}
                onChange={(e) => setForm({ ...form, hasVoterId: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <CreditCard size={15} className="text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">
                  I already have a Voter ID (EPIC card)
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-200"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Checking with AI...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Check My Eligibility
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`mt-6 rounded-2xl border-2 p-6 ${
              result.eligible
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-3 mb-4">
              {result.eligible ? (
                <CheckCircle size={28} className="text-green-600 shrink-0" />
              ) : (
                <XCircle size={28} className="text-red-500 shrink-0" />
              )}
              <div>
                <h2 className={`text-xl font-bold ${result.eligible ? 'text-green-700' : 'text-red-700'}`}>
                  {result.eligible ? '✅ You are Eligible to Vote!' : '❌ Not Currently Eligible'}
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">{result.reason}</p>
              </div>
            </div>

            {result.nextSteps.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 text-sm mb-3">
                  {result.eligible ? 'Your Next Steps:' : 'What You Can Do:'}
                </h3>
                <ul className="space-y-2">
                  {result.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <ChevronRight size={14} className={result.eligible ? 'text-green-500' : 'text-red-400'} />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.eligible && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <a
                  href="https://voterportal.eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Register on Voter Portal ↗
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {[
          { icon: '🔞', title: 'Age Requirement', desc: '18 years or older as of the qualifying date.' },
          { icon: '🇮🇳', title: 'Citizenship', desc: 'Must be a citizen of India.' },
          { icon: '📍', title: 'Residence', desc: "Ordinary resident of the constituency you're registering in." },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="font-semibold text-sm text-gray-800 mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
