// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Bell, Menu, X, Globe, Moon, Sun, ChevronDown, Type } from 'lucide-react';
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

  const { language, setLanguage, notifications, markNotificationRead, largeText, toggleLargeText, highContrast, toggleHighContrast } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md group-hover:shadow-blue-300 transition-shadow">
              <span className="text-white text-lg font-bold">🗳️</span>
            </div>
            <span className="hidden sm:block font-bold text-gray-900 text-sm leading-tight">
              Election<br />
              <span className="text-blue-600 font-semibold text-xs">Education Assistant</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150"
              >
                {language === 'hi' ? link.labelHi : link.label}
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Accessibility */}
            <button
              onClick={toggleLargeText}
              className={`p-2 rounded-lg transition-colors text-gray-500 hover:text-blue-600 hover:bg-blue-50 ${largeText ? 'bg-blue-100 text-blue-600' : ''}`}
              aria-label="Toggle large text"
              title="Toggle large text"
            >
              <Type size={16} />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Switch language"
            >
              <Globe size={14} />
              {language === 'en' ? 'हिं' : 'EN'}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    role="dialog"
                    aria-label="Notifications panel"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                      <span className="text-xs text-gray-400">{unreadCount} new</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-gray-400 text-sm">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <button
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                              !n.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-base mt-0.5">
                                {n.type === 'deadline' ? '⏰' : n.type === 'reminder' ? '🔔' : 'ℹ️'}
                              </span>
                              <div>
                                <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                              </div>
                              {!n.read && (
                                <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-500 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {language === 'hi' ? link.labelHi : link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
