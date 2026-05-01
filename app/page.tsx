// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageCircle, CheckCircle, Calendar, Map, BookOpen,
  FileCheck, HelpCircle, BarChart3, Users,
  ArrowRight, Shield, Zap, Globe
} from 'lucide-react';
import { useStore } from '@/lib/store';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Chat Assistant',
    titleHi: 'AI चैट सहायक',
    description: 'Get instant answers about election processes, eligibility, and procedures powered by Google Gemini.',
    descHi: 'Google Gemini द्वारा संचालित चुनाव प्रक्रिया के बारे में तत्काल उत्तर पाएं।',
    href: '/chat',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    badge: 'Gemini AI',
  },
  {
    icon: CheckCircle,
    title: 'Eligibility Checker',
    titleHi: 'पात्रता जांचकर्ता',
    description: 'Find out instantly if you qualify to vote in Indian elections with our smart AI checker.',
    descHi: 'जानें कि क्या आप भारतीय चुनावों में मतदान के योग्य हैं।',
    href: '/eligibility',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    badge: 'Smart AI',
  },
  {
    icon: Calendar,
    title: 'Election Timeline',
    titleHi: 'चुनाव समयरेखा',
    description: 'Visual timeline of all important election dates, deadlines, and announcements.',
    descHi: 'सभी महत्वपूर्ण चुनाव तिथियों की दृश्य समयरेखा।',
    href: '/timeline',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    badge: 'Live Dates',
  },
  {
    icon: BookOpen,
    title: 'Voting Guide',
    titleHi: 'मतदान गाइड',
    description: 'Step-by-step wizard guiding you through the entire voting process.',
    descHi: 'पूरी मतदान प्रक्रिया के माध्यम से चरण-दर-चरण मार्गदर्शन।',
    href: '/guide',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50',
    badge: 'Interactive',
  },
  {
    icon: Map,
    title: 'Booth Finder',
    titleHi: 'बूथ खोजक',
    description: 'Locate your nearest polling station using maps and pincode search.',
    descHi: 'मानचित्र और पिनकोड खोज का उपयोग करके अपना निकटतम बूथ खोजें।',
    href: '/booth-finder',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    badge: 'Google Maps',
  },
  {
    icon: FileCheck,
    title: 'Document Checker',
    titleHi: 'दस्तावेज़ जांचकर्ता',
    description: 'Verify which documents you need for voter registration and voting.',
    descHi: 'जानें कि मतदाता पंजीकरण के लिए आपको कौन से दस्तावेज़ चाहिए।',
    href: '/documents',
    color: 'from-teal-500 to-cyan-600',
    bg: 'bg-teal-50',
    badge: 'AI Powered',
  },
  {
    icon: HelpCircle,
    title: 'FAQ Knowledge Base',
    titleHi: 'सामान्य प्रश्न',
    description: 'Searchable Q&A database with AI-enhanced answers to common election queries.',
    descHi: 'AI-उन्नत उत्तरों के साथ खोज योग्य प्रश्नोत्तर डेटाबेस।',
    href: '/faq',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    badge: 'AI Enhanced',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    titleHi: 'विश्लेषण डैशबोर्ड',
    description: 'Admin view: Popular questions, user engagement, and platform insights.',
    descHi: 'लोकप्रिय प्रश्न, उपयोगकर्ता जुड़ाव, और प्लेटफॉर्म अंतर्दृष्टि।',
    href: '/admin',
    color: 'from-gray-600 to-slate-700',
    bg: 'bg-gray-50',
    badge: 'Admin',
  },
];

const stats = [
  { label: 'Registered Voters', value: '96.8Cr+', icon: '👥' },
  { label: 'Polling Stations', value: '10.5L+', icon: '🏛️' },
  { label: 'States Covered', value: '28+', icon: '🗺️' },
  { label: 'Voter Helpline', value: '1950', icon: '📞' },
];

const WORDS = ['समझें।', 'Register.', 'जानें।', 'Participate.', 'मतदान करें।'];

export default function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const { language } = useStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-800/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Powered by Google Gemini AI
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
          >
            Election Process
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Education Assistant
            </span>
          </motion.h1>

          {/* Animated subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-300 mb-6 h-10"
          >
            Empower your vote.{' '}
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-blue-400 font-semibold"
            >
              {WORDS[wordIndex]}
            </motion.span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-10"
          >
            Your complete AI guide to India&apos;s democratic process — from registration to results.
            Available in English and Hindi.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Link
              href="/chat"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30 group"
            >
              <MessageCircle size={18} />
              Talk to AI Assistant
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/eligibility"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition-all backdrop-blur-sm"
            >
              <CheckCircle size={18} />
              Check Eligibility
            </Link>
            <Link
              href="/guide"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 transition-all backdrop-blur-sm"
            >
              <BookOpen size={18} />
              Voting Guide
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-sm"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          ↓
        </motion.div>
      </section>

      {/* ── Trust badges ── */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-sm text-gray-400">
            {[
              { icon: Shield, text: 'Secure & Private' },
              { icon: Zap, text: 'Real-time AI Responses' },
              { icon: Globe, text: 'English + Hindi' },
              { icon: Users, text: 'Accessible for All' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={16} className="text-blue-500" />
                <span className="font-medium text-gray-600">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-20 px-4" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
                All Features
              </span>
              <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Vote
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                From checking eligibility to finding your booth — our AI assistant covers the entire election journey.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={feature.href}
                    className="group block h-full p-6 card-backlit"
                    aria-label={`Go to ${feature.title}`}
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {language === 'hi' ? feature.titleHi : feature.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${feature.bg} text-gray-600 font-medium ml-auto shrink-0`}>
                        {feature.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {language === 'hi' ? feature.descHi : feature.description}
                    </p>
                    <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">🗳️</div>
              <h2 className="text-3xl font-bold mb-3">Your Vote. Your Voice.</h2>
              <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
                India&apos;s democracy depends on informed citizens like you. Start your election journey today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/chat"
                  className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  Ask AI Assistant
                </Link>
                <a
                  href="https://voterportal.eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white/50 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  Register on NVSP ↗
                </a>
              </div>
              <p className="text-blue-300 text-sm mt-6">
                Voter Helpline: <strong className="text-white">1950</strong> | voterportal.eci.gov.in
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
