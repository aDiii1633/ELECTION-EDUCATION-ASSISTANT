// app/guide/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { VOTING_STEPS } from '@/lib/electionData';

export default function GuidePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

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
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <BookOpen size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Step-by-Step Voting Guide</h1>
        <p className="text-gray-500">
          Follow this interactive guide to complete your voter journey in India.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500 font-medium">
            Step {currentStep + 1} of {VOTING_STEPS.length}
          </span>
          <span className="text-sm text-gray-500 font-medium">
            {completedSteps.size} completed
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-500"
            style={{ width: `${((completedSteps.size) / VOTING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {VOTING_STEPS.map((s, i) => (
          <button
            key={s.step}
            onClick={() => setCurrentStep(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              i === currentStep
                ? `bg-gradient-to-r ${s.color} text-white shadow-md`
                : completedSteps.has(i)
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            aria-label={`Step ${s.step}: ${s.title}`}
            aria-current={i === currentStep ? 'step' : undefined}
          >
            {completedSteps.has(i) ? (
              <CheckCircle2 size={15} />
            ) : (
              <span>{s.step}</span>
            )}
            <span className="hidden sm:block">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="card-backlit overflow-hidden"
        >
          {/* Step header */}
          <div className={`bg-gradient-to-r ${step.color} p-6 text-white`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                {step.icon}
              </div>
              <div>
                <p className="text-sm text-white/70 font-medium">Step {step.step}</p>
                <h2 className="text-xl font-bold">{step.title}</h2>
              </div>
            </div>
            <p className="text-white/80 text-sm mt-1">{step.description}</p>
          </div>

          {/* Step details */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-700 text-sm mb-4 uppercase tracking-wide">
              What to do:
            </h3>
            <ol className="space-y-3">
              {step.details.map((detail, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${step.color} text-white text-xs font-bold flex items-center justify-center`}>
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700 leading-relaxed pt-1">{detail}</span>
                </motion.li>
              ))}
            </ol>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl transition-colors"
                aria-label="Previous step"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <button
                onClick={markDone}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all bg-gradient-to-r ${step.color} hover:shadow-lg`}
                aria-label={isLast ? 'Complete guide' : 'Mark as done and continue'}
              >
                {completedSteps.has(currentStep) ? (
                  isLast ? 'Completed ✓' : <>Next Step <ChevronRight size={16} /></>
                ) : (
                  isLast ? <>Mark Done <CheckCircle2 size={16} /></> : <>Done, Next <ChevronRight size={16} /></>
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">You're ready to vote!</h3>
            <p className="text-green-600 text-sm mb-4">
              You've completed all steps of the voting guide. Now visit your polling booth on election day!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://voterportal.eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Register Now ↗
              </a>
              <button
                onClick={reset}
                className="border border-green-300 text-green-700 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-green-100 transition-colors"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
