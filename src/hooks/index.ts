/**
 * Custom Hooks — Complexity Reduction (Phase 2)
 * Extracts reusable logic from bloated components into focused hooks.
 */

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Auto-scroll to bottom when dependencies change.
 * Extracted from ChatWidget to reduce cognitive complexity.
 */
export function useAutoScroll<T extends HTMLElement>(deps: unknown[]) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Copy text to clipboard with feedback state.
 * Eliminates duplicated copy logic across components.
 */
export function useClipboard(resetMs: number = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, id: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs]
  );

  return { copiedId, copy };
}

/**
 * Debounce a value — useful for search inputs.
 * Prevents excessive re-renders during rapid typing.
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

/**
 * Detect scroll position and provide a boolean.
 * Extracted from Navbar to separate scroll logic from UI rendering.
 */
export function useScrolled(threshold: number = 10): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);

  return scrolled;
}

/**
 * Persist state to localStorage with SSR safety.
 * Encapsulates hydration-safe local storage reads/writes.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage full or unavailable — fail silently
        }
        return next;
      });
    },
    [key]
  );

  return [stored, setValue];
}
