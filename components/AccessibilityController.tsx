// components/AccessibilityController.tsx
'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

/**
 * Invisible component that syncs Zustand accessibility state
 * to body CSS classes and handles global keyboard shortcuts.
 */
export default function AccessibilityController() {
  const { largeText, highContrast, toggleLargeText, toggleHighContrast } = useStore();

  useEffect(() => {
    // Sync state to DOM
    document.body.classList.toggle('large-text', largeText);
    document.body.classList.toggle('high-contrast', highContrast);
    
    // Set root CSS variables for scaling
    if (largeText) {
      document.documentElement.style.setProperty('--base-font-size', '18px');
    } else {
      document.documentElement.style.setProperty('--base-font-size', '16px');
    }
  }, [largeText, highContrast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + T: Toggle Text Size
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleLargeText();
        toast.success(`Text size: ${!largeText ? 'Large' : 'Normal'}`, { id: 'acc-text' });
      }
      // Alt + C: Toggle Contrast
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        toggleHighContrast();
        toast.success(`Contrast: ${!highContrast ? 'High' : 'Normal'}`, { id: 'acc-contrast' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [largeText, highContrast, toggleLargeText, toggleHighContrast]);

  return null;
}
