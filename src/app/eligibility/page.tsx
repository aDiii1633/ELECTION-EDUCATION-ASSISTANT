// app/eligibility/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ChevronRight, ChevronLeft, User, MapPin, CreditCard, Clock, Globe, Share2 } from 'lucide-react';
import { checkEligibility } from '@/services/ai';
import { INDIAN_STATES } from '@/core/data/election';
import toast from 'react-hot-toast';

interface EligibilityResult {
  eligible: boolean;
  reason: string;
  nextSteps: string[];
}

export default function EligibilityPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    citizenship: '',
    age: '',
    state: '',
    hasVoterId: false,
  });
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nextStep = () => {
    const e: Record<string, string> = {};
    if (step === 1 && !form.citizenship) e.citizenship = 'Please select your citizenship.';
    if (step === 2) {
      if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120) e.age = 'Enter a valid age (1-120).';
      if (!form.state) e.state = 'Please select your state.';
    }
    
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    
    setErrors({});
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
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

  const handleShare = async () => {
    const text = result?.eligible 
      ? `I'm eligible to vote in India! Checked my eligibility on the Election AI Assistant. Make sure you are ready for the elections too.` 
      : `I just checked my voter eligibility on the Election AI Assistant. Check yours to ensure you're ready for the elections!`;
      
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Voter Eligibility',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(text + " " + window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgb(16,185,129,0.3)] transform rotate-3">
          <CheckCircle size={32} className="text-white transform -rotate-3" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Smart Eligibility Checker</h1>
        <p className="text-gray-500 text-lg">
          Answer 3 quick questions. Our AI will determine your eligibility instantly.
        </p>
      </div>

      {/* Progress Bar */}
      {!result && (
        <div className="mb-8 max-w-sm mx-auto">
          <div className="flex justify-between mb-2 text-xs font-semibold text-gray-500">
            <span className={step >= 1 ? 'text-green-600' : ''}>Citizenship</span>
            <span className={step >= 2 ? 'text-green-600' : ''}>Details</span>
            <span className={step >= 3 ? 'text-green-600' : ''}>Documents</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Wizard */}
      {!result ? (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card-backlit p-6 sm:p-8 shadow-lg shadow-gray-100/50"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Globe className="text-green-500" /> What is your citizenship status?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { id: 'Indian', label: 'Resident Indian Citizen', icon: '🇮🇳' },
                  { id: 'NRI', label: 'Non-Resident Indian (NRI)', icon: '✈️' },
                  { id: 'Foreign', label: 'Foreign National', icon: '🌍' },
                  { id: 'OCI', label: 'Overseas Citizen (OCI)', icon: '🛂' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setForm({ ...form, citizenship: c.id }); setErrors({}); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      form.citizenship === c.id
                        ? 'border-green-500 bg-green-50 shadow-sm'
                        : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <span className="font-semibold text-gray-700">{c.label}</span>
                  </button>
                ))}
              </div>
              {errors.citizenship && <p className="text-red-500 text-sm mb-4 animate-pulse">{errors.citizenship}</p>}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="text-green-500" /> Tell us about yourself
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Clock size={16} className="text-gray-400" /> Your Age
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="e.g. 21"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all font-medium"
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1.5">{errors.age}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="text-gray-400" /> State / Union Territory
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-white font-medium text-gray-700"
                  >
                    <option value="">— Select your state —</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1.5">{errors.state}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="text-green-500" /> Document Status
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.hasVoterId}
                      onChange={(e) => setForm({ ...form, hasVoterId: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <span className="block text-base font-bold text-gray-800">I already have a Voter ID (EPIC)</span>
                    <span className="block text-sm text-gray-500 mt-1">Check this if you are already registered in the electoral roll.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                step === 1 ? 'invisible' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft size={16} /> Back
            </button>
            
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-green-200"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</> : <><CheckCircle size={18} /> Check Eligibility</>}
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        /* Result */
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="card-backlit overflow-hidden shadow-xl"
        >
          <div className={`p-8 text-center border-b ${result.eligible ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${result.eligible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
              {result.eligible ? <CheckCircle size={40} /> : <XCircle size={40} />}
            </div>
            <h2 className={`text-2xl font-extrabold mb-2 ${result.eligible ? 'text-green-700' : 'text-red-700'}`}>
              {result.eligible ? 'You are Eligible to Vote! 🎉' : 'Not Currently Eligible'}
            </h2>
            <p className="text-gray-600 max-w-sm mx-auto">{result.reason}</p>
          </div>

          <div className="p-8">
            {result.nextSteps.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ChevronRight className={result.eligible ? 'text-green-500' : 'text-red-500'} /> 
                  {result.eligible ? 'Your Action Plan:' : 'What You Can Do:'}
                </h3>
                <div className="space-y-3">
                  {result.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${result.eligible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {result.eligible && (
                <a
                  href="https://voterportal.eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors shadow-md shadow-green-200"
                >
                  Register on Voter Portal ↗
                </a>
              )}
              <button
                onClick={handleShare}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-6 py-3.5 rounded-xl transition-colors"
              >
                <Share2 size={18} /> Share Result
              </button>
              <button
                onClick={() => { setResult(null); setStep(1); }}
                className="w-full sm:w-auto flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 py-3.5 rounded-xl font-semibold transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        {[
          { icon: '🔞', title: 'Age Requirement', desc: '18 years or older as of the qualifying date.' },
          { icon: '🇮🇳', title: 'Citizenship', desc: 'Must be a citizen of India (NRI rules apply).' },
          { icon: '📍', title: 'Residence', desc: "Ordinary resident of the constituency." },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center hover:-translate-y-1 transition-transform">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
