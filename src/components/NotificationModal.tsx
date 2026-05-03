// components/NotificationModal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Calendar, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { useStore } from '@/core/store';

export default function NotificationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { notifications, markNotificationRead } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 text-white relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                    <Bell size={24} />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Election Alerts</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-2xl transition-colors">
                  <X size={24} />
                </button>
              </div>
              <p className="text-blue-100/80 text-sm font-medium relative z-10">Stay updated with registration deadlines and voting reminders.</p>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <Bell size={32} className="text-gray-200" />
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-1">No New Updates</h3>
                  <p className="text-sm text-gray-400 font-medium">We&apos;ll notify you when elections are near!</p>
                </div>
              ) : (
                notifications.map((n, i) => {
                  const Icon = n.type === 'deadline' ? Calendar : n.type === 'reminder' ? AlertTriangle : Info;
                  const colorClass = n.type === 'deadline' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100';
                  
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`group p-5 rounded-3xl border-2 transition-all ${
                        !n.read 
                          ? 'bg-white border-blue-100 shadow-xl shadow-blue-500/5' 
                          : 'bg-gray-50/50 border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:bg-white hover:border-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${colorClass}`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-extrabold ${!n.read ? 'text-gray-900' : 'text-gray-500'}`}>{n.title}</h4>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(n.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-2 mb-3">{n.message}</p>
                          {!n.read && (
                            <button 
                              onClick={() => markNotificationRead(n.id)}
                              className="flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              Mark as read <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{unreadCount} UNREAD ALERTS</span>
              <button 
                onClick={onClose}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-gray-200 transition-transform active:scale-95"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
