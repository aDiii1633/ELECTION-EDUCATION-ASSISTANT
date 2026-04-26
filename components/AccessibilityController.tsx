// components/AccessibilityController.tsx
'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';

/**
 * Invisible component that syncs Zustand accessibility state
 * to body CSS classes — enabling large text and high contrast modes.
 */
export default function AccessibilityController() {
  const { largeText, highContrast } = useStore();

  useEffect(() => {
    document.body.classList.toggle('large-text', largeText);
    document.body.classList.toggle('high-contrast', highContrast);
  }, [largeText, highContrast]);

  return null;
}
