// lib/store.ts
// Zustand global store — manages app-wide state

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language: 'en' | 'hi';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'reminder' | 'info' | 'alert';
  date: Date;
  read: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// ── Store interface ───────────────────────────────────────────────────────────
interface AppStore {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Chat
  messages: ChatMessage[];
  sessionId: string;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Language
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;

  // Accessibility
  largeText: boolean;
  highContrast: boolean;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Analytics (in-memory tracking)
  popularQuestions: Record<string, number>;
  trackQuestion: (question: string) => void;
}

// ── Store implementation ──────────────────────────────────────────────────────
export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Chat
      messages: [],
      sessionId: `session_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...msg,
              id: `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`,
              timestamp: new Date(),
            },
          ],
        })),
      clearMessages: () => set({ messages: [] }),

      // Language
      language: 'en',
      setLanguage: (language) => set({ language }),

      // Accessibility
      largeText: false,
      highContrast: false,
      toggleLargeText: () => set((s) => ({ largeText: !s.largeText })),
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),

      // Notifications
      notifications: [
        {
          id: 'n1',
          title: 'Voter Registration Open',
          message: 'Registration for upcoming elections is now open. Register by Dec 31, 2024.',
          type: 'deadline',
          date: new Date('2024-12-31'),
          read: false,
        },
        {
          id: 'n2',
          title: 'Election Day Reminder',
          message: 'General Elections are scheduled for Q1 2025. Make sure your voter ID is ready.',
          type: 'reminder',
          date: new Date('2025-01-15'),
          read: false,
        },
        {
          id: 'n3',
          title: 'New Feature: Booth Finder',
          message: 'Find your nearest polling booth using our new map-based finder.',
          type: 'info',
          date: new Date(),
          read: false,
        },
      ],
      addNotification: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              id: `notif_${Date.now()}`,
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // Analytics
      popularQuestions: {},
      trackQuestion: (question) =>
        set((state) => ({
          popularQuestions: {
            ...state.popularQuestions,
            [question]: (state.popularQuestions[question] || 0) + 1,
          },
        })),
    }),
    {
      name: 'election-assistant-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        largeText: state.largeText,
        highContrast: state.highContrast,
        notifications: state.notifications,
        popularQuestions: state.popularQuestions,
      }),
    }
  )
);
