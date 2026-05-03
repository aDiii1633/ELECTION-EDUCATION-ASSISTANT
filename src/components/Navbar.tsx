// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useStore } from '@/core/store';
import { messaging } from '@/services/firebase';
import { getToken } from 'firebase/messaging';
import { Bell, Menu, X, Globe, Type, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home', labelHi: 'होम' },
  { href: '/chat', label: 'AI Assistant', labelHi: 'AI सहायक' },
  { href: '/eligibility', label: 'Check Eligibility', labelHi: 'पात्रता जांचें' },
  { href: '/timeline', label: 'Timeline', labelHi: 'समयरेखा' },
  { href: '/guide', label: 'Voting Guide', labelHi: 'मतदान गाइड' },
  { href: '/booth-finder', label: 'Booth Finder', labelHi: 'बूथ खोजें' },
  { href: '/faq', label: 'FAQs', labelHi: 'सामान्य प्रश्न' },
  { href: '/admin', label: 'Analytics', labelHi: 'विश्लेषण' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();

  const { language, setLanguage, notifications, markNotificationRead, largeText, toggleLargeText, user } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (!messaging) return;
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'demo-vapid-key',
          });
        }
      } catch {
        console.log('Notification permission denied or not supported');
      }
    };
    requestPermission();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-blue-50 py-1'
          : 'bg-white/70 backdrop-blur-md py-3'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <span className="text-white text-xl font-bold">🗳️</span>
            </div>
            <div className="hidden md:block">
              <p className="font-extrabold text-gray-900 text-sm leading-tight tracking-tight uppercase">Election Assistant</p>
              <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] opacity-80">India 2024</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 shadow-sm'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {language === 'hi' ? link.labelHi : link.label}
                </Link>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Accessibility & Language (Compact on small screens) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-gray-100/50 p-1 rounded-2xl">
              <button
                onClick={toggleLargeText}
                className={`p-2 rounded-xl transition-all ${largeText ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Toggle large text"
                title="Large Text"
              >
                <Type size={18} />
              </button>
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold rounded-xl text-blue-700 hover:bg-white hover:shadow-sm transition-all"
                aria-label="Switch language"
              >
                <Globe size={14} />
                {language === 'en' ? 'HI' : 'EN'}
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative p-2.5 rounded-2xl transition-all ${notifOpen ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50"
                      role="dialog"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider">{unreadCount} new</span>
                      </div>
                      <div className="max-h-[24rem] overflow-y-auto p-2 scrollbar-hide">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Bell size={20} className="text-gray-300" />
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inbox Empty</p>
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((n) => (
                            <button
                              key={n.id}
                              onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}
                              className={`w-full text-left p-4 mb-1 rounded-2xl transition-all ${
                                !n.read ? 'bg-blue-50/50 border border-blue-100 shadow-sm' : 'hover:bg-gray-50 opacity-70'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  n.type === 'deadline' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  <span className="text-lg">{n.type === 'deadline' ? '⏰' : '🔔'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-gray-900 line-clamp-1">{n.title}</p>
                                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                                </div>
                                {!n.read && (
                                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0 animate-pulse" />
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                      <Link href="/notifications" className="block text-center py-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-t border-gray-50 hover:bg-gray-50 transition-colors">View All Activities</Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile/Auth */}
            <div className="hidden sm:block">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-extrabold text-gray-900 uppercase leading-none">
                      {user.displayName || 'User'}
                    </p>
                    <button 
                      onClick={() => useStore.getState().logout()}
                      className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border-2 border-white shadow-sm overflow-hidden">
                    {user.photoURL ? (
                      <Image src={user.photoURL} alt="" width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold">
                        {user.displayName?.charAt(0) || <User size={18} />}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="xl:hidden p-2.5 bg-gray-100 text-gray-600 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1] xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-[60] xl:hidden overflow-y-auto"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">🗳️</div>
                    <span className="font-extrabold text-gray-900 tracking-tight">ELECTION ASSISTANT</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl bg-gray-100 text-gray-500">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-1 mb-8">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {language === 'hi' ? link.labelHi : link.label}
                        <ChevronRight size={18} className={isActive ? 'text-blue-500' : 'text-gray-300'} />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-auto space-y-4">
                  <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Settings</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Type size={18} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">Large Text</span>
                      </div>
                      <button 
                        onClick={toggleLargeText}
                        className={`w-11 h-6 rounded-full transition-colors relative ${largeText ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${largeText ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">Language</span>
                      </div>
                      <button 
                        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                        className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-blue-600 shadow-sm"
                      >
                        {language === 'en' ? 'English' : 'हिंदी'}
                      </button>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-3 p-4 bg-gray-900 text-white rounded-3xl font-bold shadow-xl shadow-gray-200">
                    <User size={18} /> Account Login
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
