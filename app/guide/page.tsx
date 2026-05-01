// app/guide/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { VOTING_STEPS } from '@/lib/electionData';
import Link from 'next/link';

export default function GuidePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('votingGuideProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCompletedSteps(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse guide progress', e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('votingGuideProgress', JSON.stringify(Array.from(completedSteps)));
    }
  }, [completedSteps, mounted]);

  if (!mounted) return null; // Avoid hydration mismatch on initial render

  const step = VOTING_STEPS[currentStep];
  const isLast = currentStep === VOTING_STEPS.length - 1;
  const allDone = completedSteps.size === VOTING_STEPS.length;

  const markDone = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (!isLast) setCurrentStep((prev) => prev + 1);
  };

  const reset = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    localStorage.removeItem('votingGuideProgress');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgb(249,115,22,0.3)]">
          <BookOpen size={32} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Step-by-Step Voting Guide</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Follow this interactive guide to complete your voter journey in India. Your progress is saved automatically.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full w-fit">
            {completedSteps.size} of {VOTING_STEPS.length} Completed ({Math.round((completedSteps.size / VOTING_STEPS.length) * 100)}%)
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-700 ease-out relative"
            style={{ width: `${((completedSteps.size) / VOTING_STEPS.length) * 100}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('/stripes.svg')] opacity-20" style={{ backgroundSize: '20px 20px' }}></div>
          </div>
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {VOTING_STEPS.map((s, i) => {
          const isCurrent = i === currentStep;
          const isDone = completedSteps.has(i);
          return (
            <button
              key={s.step}
              onClick={() => setCurrentStep(i)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border-2 ${
                isCurrent
                  ? `border-transparent bg-gradient-to-r ${s.color} text-white shadow-md transform scale-[1.02]`
                  : isDone
                  ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                  : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-200'
              }`}
              aria-label={`Step ${s.step}: ${s.title}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {isDone ? (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCurrent ? 'bg-white/20' : 'bg-green-200'}`}>
                  <CheckCircle2 size={14} className={isCurrent ? 'text-white' : 'text-green-700'} />
                </div>
              ) : (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isCurrent ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {s.step}
                </div>
              )}
              <span className="hidden sm:block">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100"
        >
          {/* Step header */}
          <div className={`bg-gradient-to-r ${step.color} p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-sm backdrop-blur-sm">
                    {step.icon}
                  </div>
                  <div>
                    <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider mb-1 inline-block">
                      Step {step.step}
                    </span>
                    <h2 className="text-2xl font-bold">{step.title}</h2>
                  </div>
                </div>
                
                {step.time && (
                  <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl text-sm font-semibold w-fit">
                    <Clock size={16} /> {step.time}
                  </div>
                )}
              </div>
              <p className="text-white/90 text-base leading-relaxed max-w-2xl">{step.description}</p>
            </div>
          </div>

          {/* Step details */}
          <div className="p-8">
            <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
              Action Checklist
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ol className="space-y-4">
                  {step.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100"
                    >
                      <span className={`shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${step.color} text-white text-xs font-bold flex items-center justify-center shadow-sm`}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-700 pt-0.5">{detail}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Resources & Links */}
              {(step.links && step.links.length > 0) && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 h-fit">
                  <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <ExternalLink size={18} className="text-blue-600" /> Helpful Resources
                  </h4>
                  <div className="space-y-3">
                    {step.links.map((link, i) => (
                      link.url.startsWith('/') ? (
                        <Link key={i} href={link.url} className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all group">
                          <span className="text-sm font-bold text-blue-800">{link.text}</span>
                          <ChevronRight size={16} className="text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all group">
                          <span className="text-sm font-bold text-blue-800">{link.text}</span>
                          <ExternalLink size={14} className="text-blue-400 group-hover:text-blue-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Previous step"
              >
                <ChevronLeft size={18} /> Previous
              </button>

              <button
                onClick={markDone}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl transition-all bg-gradient-to-r ${step.color} shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                aria-label={isLast ? 'Complete guide' : 'Mark as done and continue'}
              >
                {completedSteps.has(currentStep) ? (
                  isLast ? 'Completed ✓' : <>Next Step <ChevronRight size={18} /></>
                ) : (
                  isLast ? <>Mark Done <CheckCircle2 size={18} /></> : <>Mark Done & Next <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Completion state */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 text-center shadow-lg"
            role="status"
            aria-live="polite"
          >
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl font-extrabold text-green-800 mb-2">You're Fully Prepared!</h3>
            <p className="text-green-700 text-base mb-6 max-w-md mx-auto">
              You've successfully completed all steps of the voting guide. Your readiness contributes to a stronger democracy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://voterportal.eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors shadow-md shadow-green-200"
              >
                Go to Voter Portal ↗
              </a>
              <button
                onClick={reset}
                className="w-full sm:w-auto bg-white border border-green-300 text-green-700 font-bold px-6 py-3.5 rounded-xl hover:bg-green-50 transition-colors"
              >
                Restart Guide
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
