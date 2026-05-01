import { renderHook, act } from '@testing-library/react';
import { useStore } from '../lib/store';

describe('Store', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
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
      result.current.addMessage({ role: 'user', content: 'Hello', language: 'en' });
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello');

    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toHaveLength(0);
  });

  it('toggles language', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.setLanguage('hi');
    });
    expect(result.current.language).toBe('hi');
  });

  it('manages notifications', () => {
    const { result } = renderHook(() => useStore());

    // Initially there are 3 predefined notifications
    const initialCount = result.current.notifications.length;

    act(() => {
      result.current.addNotification({
        title: 'Test',
        message: 'Test message',
        type: 'info',
        date: new Date()
      });
    });

    expect(result.current.notifications).toHaveLength(initialCount + 1);
    expect(result.current.notifications[0].title).toBe('Test');
    expect(result.current.notifications[0].read).toBe(false);

    const newNotifId = result.current.notifications[0].id;

    act(() => {
      result.current.markNotificationRead(newNotifId);
    });

    expect(result.current.notifications[0].read).toBe(true);

    act(() => {
      result.current.clearNotifications();
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('tracks popular questions', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.trackQuestion('How to vote?');
      result.current.trackQuestion('How to vote?');
    });

    expect(result.current.popularQuestions['How to vote?']).toBe(2);
  });

  it('toggles accessibility options', () => {
    const { result } = renderHook(() => useStore());
    
    expect(result.current.largeText).toBe(false);
    expect(result.current.highContrast).toBe(false);

    act(() => {
      result.current.toggleLargeText();
      result.current.toggleHighContrast();
    });

    expect(result.current.largeText).toBe(true);
    expect(result.current.highContrast).toBe(true);
  });

  it('manages user', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.setUser({ uid: '123', email: 'test@example.com', displayName: 'Test', photoURL: null });
    });

    expect(result.current.user?.uid).toBe('123');
  });
});
