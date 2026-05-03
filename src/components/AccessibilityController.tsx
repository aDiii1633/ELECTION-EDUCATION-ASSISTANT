// components/AccessibilityController.tsx
'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import toast from 'react-hot-toast';

/**
 * Invisible component that syncs Zustand accessibility state
 * to body CSS classes and handles global keyboard shortcuts.
 */
export default function AccessibilityController() {
  const { largeText, highContrast, toggleLargeText, toggleHighContrast } = useStore();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Sync state to DOM
    document.body.classList.toggle('large-text', largeText);
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('reduce-motion', reducedMotion);
    
    // Set root CSS variables for scaling
    if (largeText) {
      document.documentElement.style.setProperty('--base-font-size', '18px');
    } else {
      document.documentElement.style.setProperty('--base-font-size', '16px');
    }
  }, [largeText, highContrast, reducedMotion]);

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
      // Alt + M: Toggle Motion
      if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setReducedMotion(!reducedMotion);
        toast.success(`Motion: ${!reducedMotion ? 'Reduced' : 'Normal'}`, { id: 'acc-motion' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [largeText, highContrast, reducedMotion, toggleLargeText, toggleHighContrast]);

  return null;
}
