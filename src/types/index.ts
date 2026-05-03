/**
 * Shared Type Definitions
 * Centralized types eliminate implicit dependencies and enforce contracts.
 */

// ── Election Data Types ───────────────────────────────────────────────────────

export interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: string;
  color: string;
}

export interface VotingStep {
  step: number;
  title: string;
  description: string;
  details: string[];
  icon: string;
  color: string;
  time?: string;
  links?: Array<{ text: string; url: string }>;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface ValidDocument {
  id: string;
  name: string;
  categories: string[];
  icon: string;
}

export interface PollingCenter {
  id: string;
  name: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  boothNo: string;
}

// ── AI Service Types ──────────────────────────────────────────────────────────

export interface EligibilityResult {
  eligible: boolean;
  reason: string;
  nextSteps: string[];
}

export interface DocumentValidationResult {
  valid: boolean;
  message: string;
  missing: string[];
}

// ── Component Props ───────────────────────────────────────────────────────────

export interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'chart';
}
