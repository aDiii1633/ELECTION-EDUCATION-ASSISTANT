// __tests__/store.test.ts

// Mock Firebase to avoid Web API globals requirement in Node
jest.mock('@/services/firebase', () => ({
  auth: {},
  analytics: null,
  messaging: null,
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

import { renderHook, act } from '@testing-library/react';
import { useStore } from '@/core/store';

describe('Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.clearMessages();
      result.current.clearNotifications();
      result.current.setLanguage('en');
    });
  });

  it('adds and clears messages', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addMessage({ role: 'user', content: 'Hello', language: 'en', timestamp: '10:00 AM' });
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello');
    act(() => {
      result.current.clearMessages();
    });
    expect(result.current.messages).toHaveLength(0);
  });

  it('toggles language and accessibility settings', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setLanguage('hi');
      result.current.toggleLargeText();
      result.current.toggleHighContrast();
    });
    expect(result.current.language).toBe('hi');
    expect(result.current.largeText).toBe(true);
    expect(result.current.highContrast).toBe(true);
  });

  it('manages notifications correctly', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.addNotification({
        title: 'New Event',
        message: 'Something happened',
        type: 'info',
        date: new Date()
      });
    });
    const notifs = result.current.notifications;
    expect(notifs.length).toBeGreaterThan(0);
    expect(notifs[0].read).toBe(false);

    act(() => {
      result.current.markNotificationRead(notifs[0].id);
    });
    expect(result.current.notifications[0].read).toBe(true);
  });

  it('tracks query popularity', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.trackQuestion('What is a booth?');
      result.current.trackQuestion('What is a booth?');
    });
    expect(result.current.popularQuestions['What is a booth?']).toBe(2);
  });

  it('handles user session state', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setUser({ uid: 'test-uid', email: 'test@voter.in', displayName: 'Citizen', photoURL: null });
    });
    expect(result.current.user?.uid).toBe('test-uid');
    act(() => {
      result.current.setUser(null);
    });
    expect(result.current.user).toBeNull();
  });
});
